<?php

namespace App\Listeners;


use App\Events\InitiateVzdDataTransferEvent;
use App\Models\Vzd\AutoceliIelas;
use App\Models\Vzd\Building;
use App\Models\Vzd\Ciemi;
use App\Models\Vzd\Ekas;
use App\Models\Vzd\Novadi;
use App\Models\Vzd\Pagasti;
use App\Models\Vzd\Parcel;
use App\Models\Vzd\ParcelPart;
use App\Models\Vzd\Pilsetas;
use App\Models\Vzd\Property;
use App\Services\API\GeoPortalAPI;
use App\Services\API\VZDAPI;
use DOMDocument;
use DOMXPath;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Shapefile\Shapefile;
use Shapefile\ShapefileException;
use Shapefile\ShapefileReader;
use ZanySoft\Zip\Zip;
use ZanySoft\Zip\ZipManager;
use Throwable;

class InitiateVzdDataTransfer implements ShouldQueue
{

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        private readonly VZDAPI $VZDAPI,
        private readonly GeoPortalAPI $geoPortalAPI
    )
    {
    }


    public function handle(InitiateVzdDataTransferEvent $event)
    {
        $this->initiateKadastraSync();

        dd('no more');
//        $this->addressRegister();

        Log::info('started');
        $allFiles = $this->VZDAPI->call('/dati/lv/dataset/b28f0eed-73b0-4e44-94e7-b04b11bf0b69.jsonld');

        foreach ($allFiles['@graph'] as $file) {

            if (isset($file['dcat:accessURL']['@id'])) {
                $url = $file['dcat:accessURL']['@id'];
                $url = str_replace(config('vzd.base_uri'), '', $url);

                $fileContent = $this->VZDAPI->call($url, [], 'GET', [], [], true);

                $split = explode('/', $url);
                $fileName = end($split);

                //store zip file
                Storage::disk('vzd')->put($fileName, $fileContent);

                //extract from zip file
                $manager = new ZipManager();
                $zip = new Zip();

                $unzipFolder = storage_path() . '/app/vzd/unzip';

                $manager->addZip($zip->open(storage_path() . '/app/vzd/' . $fileName));
                $manager->extract($unzipFolder);

                //start storing
                $directories = Storage::disk('vzdUnzipped')->allDirectories();

                Log::info('started - ' . $fileName);
                foreach ($directories as $directory) {

                    //KKBuilding
                    $exists = Storage::disk('vzdUnzipped')->exists($directory . '/KKBuilding.shp');
                    if ($exists) {
                        $this->readShape($unzipFolder . '/' . $directory . '/KKBuilding.shp', 'building', $directory);
                    }

                    //KKParcel
                    $exists = Storage::disk('vzdUnzipped')->exists($directory . '/KKParcel.shp');
                    if ($exists) {
                        $this->readShape($unzipFolder . '/' . $directory . '/KKParcel.shp', 'parcel', $directory);
                    }

                    //KKParcelPart
                    $exists = Storage::disk('vzdUnzipped')->exists($directory . '/KKParcelPart.shp');
                    if ($exists) {
                        $this->readShape($unzipFolder . '/' . $directory . '/KKParcelPart.shp', 'parcel_part', $directory);
                    }

                    Storage::disk('vzdUnzipped')->deleteDirectory($directory);
                }

                Log::info('finished - ' . $fileName);
                Storage::disk('vzd')->delete($fileName);
            }
        }

        Log::info('finished');

        // Clears cache in geoserver
        $this->truncateLayers();

        $this->geoPortalAPI->call('/api/v1/background-task/finish-task', ['command' => 'vzd:import'], "GET", ['X-GEO-HTTP-SECRET' => config('geo.service_token')]);

        return true;
    }

    public function readShape($path, $type, $directory)
    {
        try {
            DB::beginTransaction();

            $Shapefile = new ShapefileReader($path, [
                Shapefile::OPTION_FORCE_MULTIPART_GEOMETRIES => true,
            ]);

            $this->removeExisting($directory, $type);

            while ($Geometry = $Shapefile->fetchRecord()) {
                $data = $Geometry->getDataArray();

                foreach ($data as $key => $value) {
                    $newKey = Str::lower($key);

                    unset($data[$key]);
                    $data[$newKey] = $value;
                    $data['folder_name'] = $directory;
                }

                $data['geom'] = $Geometry->getWKT();

                if (isset($data['apst_pak'])) {
                    if (!$data['apst_pak']) {
                        $data['apst_pak'] = null;
                    }
                }

                switch ($type) {
                    case 'building':
                        Building::create($data);
                        break;
                    case 'parcel':
                        Parcel::create($data);
                        break;
                    case 'parcel_part':
                        ParcelPart::create($data);
                        break;
                    case 'ielas':
                    case 'autoceli':
                        AutoceliIelas::create($data);
                        break;
                    case 'ciemi':
                        Ciemi::create($data);
                        break;
                    case 'ekas':
                        Ekas::create($data);
                        break;
                    case 'novadi':
                        Novadi::create($data);
                        break;
                    case 'pagasti':
                        Pagasti::create($data);
                        break;
                    case 'pilsetas':
                        Pilsetas::create($data);
                        break;
                }
            }

            DB::commit();
        } catch (ShapefileException $e) {

            Log::info('shape' . "Error Type: " . $e->getErrorType()
                . "\nMessage: " . $e->getMessage()
                . "\nDetails: " . $e->getDetails());
        } catch (\Exception $e) {
            Log::info('Failed at ' . $type . ' ' . $directory . ' ' . $e->getMessage());
            DB::rollBack();
        }


    }

    public function addressRegister()
    {
        $fileName = 'aw_shp.zip';

        try {
            $fileContent = $this->VZDAPI->call('/dati/dataset/0c5e1a3b-0097-45a9-afa9-7f7262f3f623/resource/f539e8df-d4e4-4fc1-9f94-d25b662a4c38/download/aw_shp.zip', [], 'GET', [], [], true);

            //store zip file
            Storage::disk('vzd')->put($fileName, $fileContent);

            //extract from zip file
            $manager = new ZipManager();
            $zip = new Zip();

            $unzipFolder = storage_path() . '/app/vzd/unzip';

            $manager->addZip($zip->open(storage_path() . '/app/vzd/' . $fileName));
            $manager->extract($unzipFolder);

            $this->wrap('Autoceli.shp', $unzipFolder, $fileName, 'autoceli');
            $this->wrap('Ciemi.shp', $unzipFolder, $fileName, 'ciemi');
            $this->wrap('Ekas.shp', $unzipFolder, $fileName, 'ekas');
            $this->wrap('Ielas.shp', $unzipFolder, $fileName, 'ielas');
            $this->wrap('Novadi.shp', $unzipFolder, $fileName, 'novadi');
            $this->wrap('Pagasti.shp', $unzipFolder, $fileName, 'pagasti');
            $this->wrap('Pilsetas.shp', $unzipFolder, $fileName, 'pilsetas');


        } catch (\Exception $e) {
            Log::info('x Failed at ' . $fileName . ' ' . $e->getMessage());
        }

        $files = Storage::disk('vzdUnzipped')->allFiles();

        Storage::disk('vzdUnzipped')->delete($files);
        Storage::disk('vzd')->delete($fileName);
    }

    public function wrap($target, $unzipFolder, $fileName, $type)
    {
        try {
            Log::info('started at ' . $type);
            $exists = Storage::disk('vzdUnzipped')->exists($target);
            if ($exists) {
                $this->readShape($unzipFolder . '/' . $target, $type, $fileName);
            }
        } catch (\Exception $e) {
            Log::info('w Failed at ' . $fileName . ' ' . $e->getMessage());
        }
    }

    public function removeExisting($directory, $type)
    {
        switch ($type) {
            case 'building':
                Building::where('folder_name', $directory)->delete();
                break;
            case 'parcel':
                Parcel::where('folder_name', $directory)->delete();
                break;
            case 'parcel_part':
                ParcelPart::where('folder_name', $directory)->delete();
                break;
            case 'autoceli':
                AutoceliIelas::where('folder_name', $directory)->delete();
                break;
            case 'ciemi':
                Ciemi::where('folder_name', $directory)->delete();
                break;
            case 'ekas':
                Ekas::where('folder_name', $directory)->delete();
                break;
            case 'novadi':
                Novadi::where('folder_name', $directory)->delete();
                break;
            case 'pagasti':
                Pagasti::where('folder_name', $directory)->delete();
                break;
            case 'pilsetas':
                Pilsetas::where('folder_name', $directory)->delete();
                break;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(InitiateVzdDataTransferEvent $event, Throwable $exception): void
    {
        Log::info('failed ' . $exception->getMessage());
    }

    public function truncateLayers()
    {
        $client = new Client();
        $baseUrl = config("geoserver.base_uri");

        $url = "$baseUrl/geoserver/gwc/rest/masstruncate";

        $layers = [
            'tapis_admin_ter',
            'tapis_kadastrs',
            'novadi',
            'autoceli_ielas',
            'ciemi',
            'pagasti',
            'pilsetas'
        ];

        foreach ($layers as $layer) {
            try {
                Log::info('started layer - ' . $layer);
                $data = "<truncateLayer><layerName>vraa:$layer</layerName></truncateLayer>";
                $client->request('POST', $url, [
                    'auth' => [config('geo.base_user'), config('geo.base_password')],
                    'headers' => ['Content-Type' => 'text/xml'],
                    'body' => $data,
                    'verify' => false
                ]);
            } catch (GuzzleException $e) {
                Log::error($e->getMessage());
                throw new \Exception($e->getMessage());
            }
        }

    }

    public function initiateKadastraSync(): void
    {
        Log::info(memory_get_usage());
        $allFiles = $this->VZDAPI->call('/dati/lv/dataset/be841486-4af9-4d38-aa14-6502a2ddb517.jsonld');

        foreach ($allFiles['@graph'] as $file) {

            if (isset($file['dcat:accessURL']['@id'])) {
                $url = $file['dcat:accessURL']['@id'];
                $url = str_replace(config('vzd.base_uri'), '', $url);

                $split = explode('/', $url);
                $fileName = end($split);
//                $onlyDownload = ['parcel.zip', 'mark.zip', 'address.zip', 'ownership.zip', 'property.zip'];
                $onlyDownload = ['ownership.zip'];

                if (in_array($fileName, $onlyDownload)) {
                    $type = explode('.', $fileName)[0] ?? null;
                    $fileContent = $this->VZDAPI->call($url, [], 'GET', [], [], true);
                    $marksHasWater = ['10', '11', '12', '20'];

//                    store zip file
                    Storage::disk('vzd')->put($fileName, $fileContent);
                    unset($fileContent);

//                    extract from zip file
                    $manager = new ZipManager();
                    $zip = new Zip();

                    $unzipFolder = storage_path() . '/app/vzd/unzip';

                    $manager->addZip($zip->open(storage_path() . '/app/vzd/' . $fileName));
                    $manager->extract($unzipFolder);
                    $manager->close();

                    //start storing
                    $mainDirectories = Storage::disk('vzdUnzipped')->allDirectories();


                    Log::info('started - ' . $fileName);
                    Log::info(memory_get_usage());
                    foreach ($mainDirectories as $mainDirectory) {
                        $directories = Storage::disk('vzdUnzipped')->allDirectories('/' . $mainDirectory);
                        Log::info('started - ' . $mainDirectory);
                        foreach ($directories as $directory) {
                            $files = Storage::disk('vzdUnzipped')->allFiles($directory);

                            Log::info('started - ' . $directory);
                            Log::info(memory_get_usage());
                            if (isset($files[0])) {
                                $dom = new DOMDocument();
                                $dom->load(storage_path() . '/app/vzd/unzip/' . $files[0]);

                                $xpath = new DOMXPath($dom);
                                $result = [];

                                try {
                                    switch ($type) {
                                        case 'parcel':
                                            $elements = $xpath->query('ParcelItemList');

                                            foreach ($elements as $element) {
                                                $result = $this->domNodeToArray($element);
                                            }

                                            foreach ($result['ParcelItemData'] as $item) {
                                                $parcel = Parcel::where('code', $item['ParcelBasicData']['ParcelCadastreNr'])->first();

                                                if ($parcel) {
                                                    $useList = [];
                                                    if (isset($item['LandPurposeList'])) {
                                                        foreach ($item['LandPurposeList'] as $purpose) {
                                                            $useList[] = $purpose['LandPurposeData']['LandPurposeKind']['LandPurposeKindName'] ?? null;
                                                        }

                                                        $parcel->purpose_use = implode(',', $useList);
                                                    }

                                                    $parcel->area = $item['ParcelBasicData']['ParcelArea'] ?? null;
                                                    $parcel->update();
                                                }
                                            }
                                            break;
                                        case 'property':
                                            $elements = $xpath->query('PropertyItemList');

                                            foreach ($elements as $element) {
                                                $result = $this->domNodeToArray($element);
                                            }

                                            foreach ($result['PropertyItemData'] as $f => $item) {
                                                if (!isset($item['LandbookData']['LandbookFolioNr'])) {
                                                    continue;
                                                }

                                                $property = Property::where('landbook_folio_nr', $item['LandbookData']['LandbookFolioNr'])->first();

                                                if (!isset($item['PropertyBasicData']['PropertyParcelTotalArea'])) {
                                                    continue;
                                                }

                                                $parsed = [
                                                    'landbook_folio_nr' => $item['LandbookData']['LandbookFolioNr'],
                                                    'total_area' => $item['PropertyBasicData']['PropertyParcelTotalArea'],
                                                ];

                                                if ($property) {
                                                    $property->fill($parsed);
                                                    $property->save();
                                                } else {
                                                    $model = Property::create($parsed);
                                                    $model->save();
                                                }

                                                $cadastrNrs = [];
                                                foreach ($item['PropertyContentData']['ObjectList']['ObjectData'] as $index => $parcelItem) {
                                                    $parcel = null;
                                                    if (is_array($parcelItem)) {
                                                        $cadastrNrs[] = $parcelItem['ObjectCadastreNrData'];
//                                                        $parcel = Parcel::where('code', $parcelItem['ObjectCadastreNrData'])->first();
                                                    } elseif ($index != 0) {
                                                        $cadastrNrs[] = $parcelItem;
//                                                        $parcel = Parcel::where('code', $parcelItem)->first();
                                                    }
                                                }

                                                Parcel::whereIn('code', $cadastrNrs)->update(['landbook_folio_nr' => $item['LandbookData']['LandbookFolioNr']]);
                                            }
                                            break;
                                        case 'ownership':
                                            $elements = $xpath->query('OwnershipItemList');

                                            foreach ($elements as $element) {
                                                $result = $this->domNodeToArray($element);
                                            }

                                            foreach ($result['OwnershipItemData'] as $item) {
                                                if ($item['ObjectRelation']['ObjectType'] != 'PROPERTY') {
                                                    continue;
                                                }

                                                $parcel = Parcel::where('code', $item['ObjectRelation']['ObjectCadastreNr'])->first();

                                                if ($parcel) {
                                                    $isMunicipality = false;
                                                    $personStatus = [];
                                                    $ownershipStatus = [];

                                                    if (isset($item['OwnershipStatusKindList']['OwnershipStatusKind'][0]['PersonStatus'])) {
                                                        foreach ($item['OwnershipStatusKindList']['OwnershipStatusKind'] as $status) {
                                                            $personStatus[] = $status['PersonStatus'];
                                                            $ownershipStatus[] = $status['OwnershipStatus'];

                                                            if ($status['PersonStatus'] === 'pašvaldība') {
                                                                $isMunicipality = true;
                                                            }
                                                        }
                                                    } else {
                                                        $personStatus[] = $item['OwnershipStatusKindList']['OwnershipStatusKind']['PersonStatus'];
                                                        $ownershipStatus[] = $item['OwnershipStatusKindList']['OwnershipStatusKind']['OwnershipStatus'];

                                                        if ($item['OwnershipStatusKindList']['OwnershipStatusKind']['PersonStatus'] === 'pašvaldība') {
                                                            $isMunicipality = true;
                                                        }
                                                    }

                                                    $parcel->owner = implode(',', $personStatus) . " (" . implode(',', $ownershipStatus) . ")";
                                                    $parcel->owned_by_municipality = $isMunicipality;
                                                    $parcel->update();
                                                }
                                            }
                                            break;
                                        case 'address':
                                            $elements = $xpath->query('AddressItemList');

                                            foreach ($elements as $element) {
                                                $result = $this->domNodeToArray($element);
                                            }

                                            foreach ($result['AddressItemData'] as $item) {
                                                $mappedAddress = implode(', ', [
                                                    isset($item['AddressData']['Street']) ? $item['AddressData']['Street'] . ' ' . $item['AddressData']['House'] : $item['AddressData']['House'],
                                                    $item['AddressData']['County'] ?? null,
                                                    $item['AddressData']['Town'] ?? $item['AddressData']['Parish'],
                                                    $item['AddressData']['PostIndex'],
                                                ]);

                                                if ($item['ObjectRelation']['ObjectType'] === 'PARCEL') {
                                                    $parcel = Parcel::where('code', $item['ObjectRelation']['ObjectCadastreNr'])->first();
                                                    if ($parcel) {
                                                        $parcel->address = $mappedAddress;
                                                        $parcel->update();
                                                    }
                                                } else if ($item['ObjectRelation']['ObjectType'] === 'BUILDING') {
                                                    $building = Building::where('code', $item['ObjectRelation']['ObjectCadastreNr'])->first();
                                                    if ($building) {
                                                        $building->address = $mappedAddress;
                                                        $building->update();
                                                    }
                                                }
                                            }
                                            break;
                                        case 'mark':
                                            $elements = $xpath->query('MarkItemList');

                                            foreach ($elements as $element) {
                                                $result = $this->domNodeToArray($element);
                                            }

                                            foreach ($result['MarkItemData'] as $item) {
                                                $hasMark = false;


                                                if (isset($item['MarkList']['MarkRecData']['MarkType'])) {
                                                    $hasMark = $this->checkMark($item['MarkList']['MarkRecData'], $marksHasWater);
                                                } else {
                                                    foreach ($item['MarkList']['MarkRecData'] as $mark) {
                                                        $hasMark = $this->checkMark($mark, $marksHasWater);

                                                        if ($hasMark) {
                                                            break;
                                                        }
                                                    }
                                                }

                                                if ($item['ObjectRelation']['ObjectType'] === 'PARCEL') {
                                                    $parcel = Parcel::where('code', $item['ObjectRelation']['ObjectCadastreNr'])->first();
                                                    if ($parcel) {
                                                        $parcel->public_water = $hasMark;
                                                        $parcel->update();
                                                    }
                                                } else if ($item['ObjectRelation']['ObjectType'] === 'BUILDING') {
                                                    $building = Building::where('code', $item['ObjectRelation']['ObjectCadastreNr'])->first();
                                                    if ($building) {
                                                        $building->public_water = $hasMark;
                                                        $building->update();
                                                    }
                                                }
                                            }
                                    }
                                } catch (\Exception $e) {
                                    if (isset($item)) {
                                        Log::info(json_encode($item));
                                    }
                                    Log::error($e->getMessage());
                                }

                                Storage::disk('vzdUnzipped')->deleteDirectory($directory);

                                //release from memory
                                unset($dom);
                                unset($xpath);
                                unset($result);
                                unset($elements);
                            }
                        }
                        Storage::disk('vzdUnzipped')->deleteDirectory($mainDirectory);
                        Log::info(memory_get_usage());
                    }

                    Log::info('finished - ' . $fileName);
                    Storage::disk('vzd')->delete($fileName);
                }
            }
        }
    }

    function checkMark($mark, $marksHasWater): bool
    {
        $listMark = substr($mark['MarkType'], 0, 2);

        if (in_array($listMark, $marksHasWater)) {
            return true;
        }

        return false;
    }

    function domNodeToArray($node)
    {
        $output = [];

        if ($node->nodeType === XML_TEXT_NODE) {
            return $node->nodeValue;
        }

        foreach ($node->childNodes as $key => $child) {
            $value = $this->domNodeToArray($child);

            if ($child->nodeType == XML_ELEMENT_NODE) {
                if (isset($output[$child->nodeName])) {
                    if (!is_array($output[$child->nodeName])) {
                        $output[$child->nodeName] = [$output[$child->nodeName]];
                    }

                    if ($key === 1) {
                        $f = $output[$child->nodeName];
                        $output[$child->nodeName] = null;
                        $output[$child->nodeName][] = $f;
                    }

                    $output[$child->nodeName][] = $value;
                } else {
                    $output[$child->nodeName] = $value;
                }
            } elseif ($child->nodeType == XML_TEXT_NODE && trim($value) !== '') {
                $output = $value;
            } else {
                Log::info('i fucked up - ' . $child->nodeType);
            }

        }

        return $output;
    }
}
