<?php

namespace App\Imports;

use App\Models\ClassifierValue;
use App\Repositories\ClassifierRepository;
use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Repositories\InstitutionClassifierRepository;
use App\Repositories\InstitutionLicenceRepository;
use App\Services\API\APIOuterAPI;
use App\Services\API\GeoNetworkAPI;
use App\Services\GeoProductService;
use App\Traits\CommonHelper;
use DOMDocument;
use DOMXPath;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;


class GeoProductImport implements ToArray, WithHeadingRow, WithMultipleSheets
{
    use CommonHelper;

    private bool $continue;

    public function __construct(
        private GeoProductService $geoProductService,
        private ClassifierValueRepository $classifierValueRepository,
        private ClassifierRepository $classifierRepository,
        private InstitutionLicenceRepository $institutionLicenceRepository,
        private InstitutionClassifierRepository $institutionClassifierRepository,
        private GeoProductRepository $geoProductRepository,
        private APIOuterAPI $APIOuterAPI,
        private GeoNetworkAPI $geoNetworkAPI,
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    public function array($rows)
    {
        $oldGeoproducts = $this->geoProductRepository->findBy('is_migrated', true, true, [], [], ['geoProductServices', 'geoProductFiles', 'geoProductOthers']);

        $jar = new CookieJar;
        foreach ($oldGeoproducts as $oldGeoproduct) {

            foreach ($oldGeoproduct->geoProductServices as $service) {
                try {
                    if ($service->dpps_name) {
                        $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/delete-api', ['api_name' => $service->dpps_name], 'POST', $this->headers);
                        sleep(1);
                    }

                    $this->geoNetworkAPI->call('/geonetwork/srv/api/records/' . $service->metadata_uuid, [], 'DELETE', [], ['add_in_params' => true, 'cookie_jar' => $jar]);
                } catch (\Exception $e) {
                    Log::error('failed for - service ' . $service->id . ' as - ' . $e->getMessage());
                }
            }

            foreach ($oldGeoproduct->geoProductFiles as $file) {
                try {
                    $this->geoNetworkAPI->call('/geonetwork/srv/api/records/' . $file->metadata_uuid, [], 'DELETE', [], ['add_in_params' => true, 'cookie_jar' => $jar]);
                } catch (\Exception $e) {
                    Log::error('failed for file - ' . $file->id . ' as - ' . $e->getMessage());
                }
            }

            foreach ($oldGeoproduct->geoProductOthers as $other) {
                try {
                    $this->geoNetworkAPI->call('/geonetwork/srv/api/records/' . $other->metadata_uuid, [], 'DELETE', [], ['add_in_params' => true, 'cookie_jar' => $jar]);
                } catch (\Exception $e) {
                    Log::error('failed for other - ' . $other->id . ' as - ' . $e->getMessage());
                }
            }

            $oldGeoproduct->delete();
        }

        $licence = $this->institutionLicenceRepository->findLicenceForImport('https://creativecommons.org/licenses/by-nc/4.0/legalcode.lv', 'OPEN');

        if (!$licence) {
            $licence = $this->institutionLicenceRepository->store([
                'site' => 'https://creativecommons.org/licenses/by-nc/4.0/legalcode.lv',
                'name' => 'cc4.0',
                'is_public' => true,
                'licence_type' => 'OPEN',
                'type' => 'TEMPLATE'
            ]);
        }


        $geoproducts = collect();
        foreach ($rows as $index => $row) {
            Log::info('getting data for - ' . $index);
            try {
                if ($row['failed']) {
                    continue;
                }

                $result = $this->getMetadata("https://geometadati.viss.gov.lv/geoportal/csw?getxml=" . $row['md_link_id']);

                if ($row['parentid']) {
                    $dataset = $this->getMetadata("https://geometadati.viss.gov.lv/geoportal/csw?getxml=" . $row['parentid']);
                } else {
                    $datasetUrl = $result[0]['identificationInfo']['SV_ServiceIdentification']['operatesOn'] ?? null;
                    $dataset = $this->getMetadata($datasetUrl) ?? $result;
                }

                $inspiredDataTheme = null;
                $keywords = null;
                $primaryDataTheme = null;
                if (isset($dataset[0]['identificationInfo']['MD_DataIdentification']['descriptiveKeywords'])) {
                    foreach ($dataset[0]['identificationInfo']['MD_DataIdentification']['descriptiveKeywords'] as $descriptiveKeyword) {

                        if (isset($descriptiveKeyword['MD_Keywords'])) {
                            $descriptiveKeyword = $descriptiveKeyword['MD_Keywords'];
                        }

                        switch ($descriptiveKeyword['thesaurusName']['CI_Citation']['title']['CharacterString']) {
                            case 'GEMET - INSPIRE themes, version 1.0':
                                $value = $descriptiveKeyword['keyword']['CharacterString'];
                                $inspiredDataTheme = $this->classifierValueRepository->getClassifierValueByCodes('KL5', $value);

                                if (!$inspiredDataTheme) {
                                    $classifier = $this->classifierRepository->findBy('unique_code', 'KL5');

                                    $inspiredDataTheme = $this->classifierValueRepository->store([
                                        'value_code' => $value,
                                        'translation' => $value,
                                        'classifier_id' => $classifier->id
                                    ]);
                                }
                                break;
                            case 'GEMET':
                                $value = $descriptiveKeyword['keyword']['CharacterString'];
                                $keywords = $this->classifierValueRepository->getClassifierValueByCodes('KL6', $value);

                                if (!$keywords) {
                                    $classifier = $this->classifierRepository->findBy('unique_code', 'KL6');

                                    $keywords = $this->classifierValueRepository->store([
                                        'value_code' => $value,
                                        'translation' => $value,
                                        'classifier_id' => $classifier->id
                                    ]);
                                }
                                break;
                            case 'INSPIRE priority data set':
                                $value = $descriptiveKeyword['keyword']['CharacterString'];
                                $primaryDataTheme = $this->classifierValueRepository->getClassifierValueByCodes('KL7', $value);

                                if (!$primaryDataTheme) {
                                    $classifier = $this->classifierRepository->findBy('unique_code', 'KL7');

                                    $primaryDataTheme = $this->classifierValueRepository->store([
                                        'value_code' => $value,
                                        'translation' => $value,
                                        'classifier_id' => $classifier->id
                                    ]);
                                }
                                break;
                        }
                    }
                }

                $coord = null;
                $coordId = $dataset[0]['identificationInfo']['MD_DataIdentification']['citation']['CI_Citation']['coordid']['CharacterString'] ?? $dataset[0]['referenceSystemInfo']['MD_ReferenceSystem']['referenceSystemIdentifier']['RS_Identifier']['codeSpace']['CharacterString'] ?? null;
                if ($coordId) {
                    $coord = $this->classifierValueRepository->getClassifierValueByCodes('KL2', $coordId);

                    if (!$coord) {
                        $classifier = $this->classifierRepository->findBy('unique_code', 'KL2');

                        $coord = $this->classifierValueRepository->store([
                            'value_code' => $coordId,
                            'translation' => $coordId,
                            'classifier_id' => $classifier->id
                        ]);
                    }
                }

                $spatialData = null;
                if (isset($dataset[0]['identificationInfo']['MD_DataIdentification']['topicCategory']['MD_TopicCategoryCode'])) {
                    $spatialData = $this->classifierValueRepository->getClassifierValueByCodes('KL4', $dataset[0]['identificationInfo']['MD_DataIdentification']['topicCategory']['MD_TopicCategoryCode']);

                    if (!$spatialData) {
                        $classifier = $this->classifierRepository->findBy('unique_code', 'KL4');

                        $spatialData = $this->classifierValueRepository->store([
                            'value_code' => $dataset[0]['identificationInfo']['MD_DataIdentification']['topicCategory']['MD_TopicCategoryCode'],
                            'translation' => $dataset[0]['identificationInfo']['MD_DataIdentification']['topicCategory']['MD_TopicCategoryCode'],
                            'classifier_id' => $classifier->id
                        ]);
                    }
                }

                $spatialResolution = null;
                if (isset($dataset[0]['identificationInfo']['MD_DataIdentification']['spatialResolution']['MD_Resolution']['equivalentScale']['MD_RepresentativeFraction']['denominator']['Integer'])) {
                    $spatialResolution = $this->classifierValueRepository->getClassifierValueByCodes('KL3', $dataset[0]['identificationInfo']['MD_DataIdentification']['spatialResolution']['MD_Resolution']['equivalentScale']['MD_RepresentativeFraction']['denominator']['Integer']);

                    if (!$spatialResolution) {
                        $classifier = $this->classifierRepository->findBy('unique_code', 'KL3');

                        $spatialResolution = $this->classifierValueRepository->store([
                            'value_code' => $dataset[0]['identificationInfo']['MD_DataIdentification']['spatialResolution']['MD_Resolution']['equivalentScale']['MD_RepresentativeFraction']['denominator']['Integer'],
                            'translation' => $dataset[0]['identificationInfo']['MD_DataIdentification']['spatialResolution']['MD_Resolution']['equivalentScale']['MD_RepresentativeFraction']['denominator']['Integer'],
                            'classifier_id' => $classifier->id
                        ]);
                    }
                }

                $description = $result[0]['identificationInfo']['MD_DataIdentification']['abstract']['CharacterString'] ?? $result[0]['identificationInfo']['SV_ServiceIdentification']['abstract']['CharacterString'];

                $others = [];
                $services = [];
                $dynamicFiles = [];
                if ($row['type'] === 'CITS') {
                    $transferOptions = $result[0]['distributionInfo']['MD_Distribution']['transferOptions'];

                    $sites = [];
                    foreach ($transferOptions as $transferOption) {
                        $name = $transferOption['MD_DigitalTransferOptions']['onLine']['CI_OnlineResource']['name']['CharacterString'] ?? $transferOption['onLine']['CI_OnlineResource']['name']['CharacterString'] ?? ' ';
                        if (is_array($name)) {
                            $name = '';
                        }

                        $sites[] = [
                            'site' => $transferOption['MD_DigitalTransferOptions']['onLine']['CI_OnlineResource']['linkage']['URL'] ?? $transferOption['onLine']['CI_OnlineResource']['linkage']['URL'],
                            'name' => $name
                        ];
                    }

                    $others[] = [
                        'description' => $description,
                        'is_public' => false,
                        'sites' => $sites
                    ];
                } else if ($row['type'] !== 'DATNE') {
                    $serviceType = ClassifierValue::select('classifier_values.*')->where('value_code', $row['type'])
                        ->join('classifiers', function ($join) {
                            $join->on('classifiers.id', '=', 'classifier_values.classifier_id')
                                ->where('classifiers.unique_code', 'KL9');
                        })
                        ->first();

                    if ($serviceType) {
                        $atom = null;

                        if ($row['is_local_data']) {
                            if ($row['type']  === 'FEATURE_DOWNLOAD') {
                                $pattern = '/([^\/]+)$/';

                                if (preg_match($pattern, $row['file'], $matches)) {

                                    $file = Storage::get('/GML/' . $matches[1]);
                                    $fileUuid = $this->generateUUIDv4();

                                    $link = null;
                                    $atom = [$fileUuid, $matches[1]];
                                    $dynamicFiles[$fileUuid] = $file;
                                }
                            } else if ($row['inspire']) {
                                $link = env('GEOSERVER_INSPIRE_BASE_URI') . '/geoserver/' . $row['workspace'] . '/ows';
                            } else {
                                $link = env('GEOSERVER_BASE_URI') . '/geoserver/' . $row['workspace'] . '/ows';
                            }
                        } else {
                            $link = $row['service'] ?? $result[0]['distributionInfo']['MD_Distribution']['transferOptions']['MD_DigitalTransferOptions']['onLine']['CI_OnlineResource']['linkage']['URL'] ?? $result[0]['distributionInfo']['MD_Distribution']['transferOptions']['onLine']['CI_OnlineResource']['linkage']['URL'];
                        }

                        $services[] = [
                            'service_link' => $link,
                            'description' => $description,

                            'license_type' => $row['licence_type'] === 'Predefineta' ? 'PREDEFINED' : 'OPEN',
                            'available_restriction_type' => 'NO_RESTRICTION',

                            'service_type_classifier_value_id' => $serviceType->id,
                            'service_limitation_type' => ["NONE"],
                            'is_public' => false,
                            'institution_open_licence_id' => $licence->id,

                            'usage_request' => ['name', 'surname', 'personalCode'],

                            'payment_type' => $row['licence_type'] === 'Predefineta' ? 'FREE' : null,
                            'atom' => $atom
                        ];
                    }
                }

                $this->continue = false;

                //combine with existing
                $geoproducts = $geoproducts->map(function ($prod) use ($row, $others, $services, $dynamicFiles) {
                    if ($row['migration'] && $prod['old_id'] == $row['migration']) {
                        $prod['others'] = array_merge($prod['others'], $others);
                        $prod['services'] = array_merge($prod['services'], $services);
                        if ($dynamicFiles) {
                            $prod['dynamic_files'] = array_merge($prod['dynamic_files'], $dynamicFiles);
                        }

                        $prod['inspired_data_classifier_value_id'] = $prod['inspired_data_classifier_value_id'] ?? $inspiredDataTheme->id ?? null;
                        $prod['keyword_classifier_value_id'] = $prod['keyword_classifier_value_id'] ?? $keywords->id ?? null;
                        $prod['primary_data_theme_classifier_value_id'] = $prod['primary_data_theme_classifier_value_id'] ?? $primaryDataTheme->id ?? null;
                        $prod['coordinate_system_classifier_value_id'] = $prod['coordinate_system_classifier_value_id'] ?? $coord->id ?? null;
                        $this->continue = true;
                    }

                    return $prod;
                });

                if ($this->continue) {
                    continue;
                }

                $geoproduct = [
                    'old_id' => $row['migration'],
                    'name' => $dataset[0]['identificationInfo']['MD_DataIdentification']['citation']['CI_Citation']['title']['CharacterString'] ?? $row['geoproducts'],
                    'description' => $dataset[0]['identificationInfo']['MD_DataIdentification']['abstract']['CharacterString'] ?? $description,
                    'is_migrated' => true,
                    'is_inspired' => $row['inspire'],

                    'organization_name' => $result[0]['contact']['CI_ResponsibleParty']['organisationName']['CharacterString'],
                    'email' => $result[0]['contact']['CI_ResponsibleParty']['contactInfo']['CI_Contact']['address']['CI_Address']['electronicMailAddress']['CharacterString'],

                    'coordinate_system_classifier_value_id' => $coord->id ?? null,
                    'file_format_classifier_value_id' => $format->id ?? null,
                    'file_version' => $dataset[0]['identificationInfo']['MD_DataIdentification']['citation']['CI_Citation']['version']['CharacterString'] ?? null,
                    'data_release_date' => $dataset[0]['dateStamp']['Date'] ?? null,
                    'data_updated_at' => $dataset[0]['dateStamp']['Date'] ?? null,

                    'precision' => (int)($dataset[0]['dataQualityInfo']['DQ_DataQuality']['qualitylv']['LV_Quality']['accuracy']['CharacterString'] ?? null),
                    'completeness_value' => (int)($dataset[0]['dataQualityInfo']['DQ_DataQuality']['qualitylv']['LV_Quality']['validationvalue']['CharacterString'] ?? null),

                    'inspired_data_classifier_value_id' => $inspiredDataTheme->id ?? null,
                    'keyword_classifier_value_id' => $keywords->id ?? null,
                    'primary_data_theme_classifier_value_id' => $primaryDataTheme->id ?? null,
                    'enable_primary_data_theme_classifier' => (bool)(($primaryDataTheme->id ?? null)),
                    'spatial_data_classifier_value_id' => $spatialData->id ?? null,
                    'scale_classifier_value_id' => $spatialResolution->id ?? null,
                    'tags' => ($keywords->id ?? null) ? [$keywords->translation] : null,

                    'data_origin' => $dataset[0]['dataQualityInfo']['DQ_DataQuality']['lineage']['LI_Lineage']['statement']['CharacterString'] ?? null,
                    'owner_institution_classifier_id' => $this->institutionClassifierRepository->findBy('reg_nr', $row['reg_nr'])->id,

                    'others' => $others,
                    'services' => $services,
                    'dynamic_files' => $dynamicFiles ?? [],
                    'metadata_uuid' => $this->generateUUIDv4(),
                    'regularity_renewal_classifier_value_id' => $this->classifierValueRepository->findBy('value_code', 'IRREGULAR')->id,
                ];

                if (is_array($geoproduct['data_origin'])) {
                    $geoproduct['data_origin'] = '';
                }

                $geoproduct['data_origin'] = mb_substr($geoproduct['data_origin'], 0, 250);

                if (is_array($geoproduct['organization_name'])) {
                    $geoproduct['organization_name'] = '';
                }

                $geoproducts->push($geoproduct);
            } catch (\Exception $e) {
                print_r($index . '_');
                print_r($e->getMessage() . '_');
                dd($e->getTraceAsString());
//                DB::rollBack();
            }
        }

        foreach ($geoproducts as $geoproduct) {
            Log::info('started - ' . $geoproduct['old_id']);
            try {
                $this->geoProductService->store($geoproduct);
            } catch (\Exception $e) {
                Log::info('failed - ' . $geoproduct['old_id'] . ' - ' . $e->getMessage());
            }

            Log::info('ended - ' . $geoproduct['old_id']);
        }
    }

    function getMetadata($metadataUrl)
    {
        try {
            $client = new Client([
                'verify' => false
            ]);

            $url = str_replace('\\', '', $metadataUrl);
            $url = str_replace('[', '', $url);
            $url = str_replace(']', '', $url);
            $url = str_replace('"', '', $url);

            $metadata = $client->get($url);
            $contents = $metadata->getBody()->getContents();

            if (!$contents) {
                return null;
            }

            $dom = new DOMDocument();
            $dom->loadXML($contents);

            $xpath = new DOMXPath($dom);
            $result = [];

            // Use XPath to select elements with the registered namespace
            $elements = $xpath->query('//gmd:MD_Metadata');

            foreach ($elements as $element) {
                $result[] = $this->domNodeToArray($element);
            }

            return $result;
        } catch (\Exception $e) {
            return null;
        }

    }

    function domNodeToArray($node)
    {
        $output = [];

        if ($node->nodeType === XML_TEXT_NODE) {
            return $node->nodeValue;
        }

        foreach ($node->childNodes as $child) {
            $value = $this->domNodeToArray($child);

            if ($child->nodeType == XML_ELEMENT_NODE) {
                $removeNamespace = explode(':', $child->nodeName);
                if (isset($output[end($removeNamespace)])) {
                    if (!is_array($output[end($removeNamespace)])) {
                        $output[end($removeNamespace)] = [$output[end($removeNamespace)]];
                    }
                    $output[end($removeNamespace)][] = $value;
                } else {
                    $output[end($removeNamespace)] = $value;

                    //get attributes value
                    if ($child->nodeName === 'srv:operatesOn') {
                        if ($child->getAttribute('uuidref')) {
                            $output[end($removeNamespace)] = $child->getAttribute('uuidref');
                        }
                    }
                }
            } elseif ($child->nodeType == XML_TEXT_NODE && trim($value) !== '') {
                $output = $value;
            }

        }

        return $output;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        return [
            0 => $this,
        ];
    }
}
