<?php

namespace App\Services;

use App\Enums\GeoProductPaymentType;
use App\Enums\GeoProductServiceLimitationTypes;
use App\Enums\GeoProductStatus;
use App\Events\ProductViewEvent;
use App\Exceptions\ExceptionWithAttributes;
use App\Repositories\AttachmentRepository;
use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductNoneRepository;
use App\Repositories\GeoProducts\GeoProductOtherRepository;
use App\Repositories\GeoProducts\GeoProductOtherSiteRepository;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Repositories\GeoProducts\GeoProductServiceRepository;
use App\Repositories\GeoProducts\GeoProductTagRepository;
use App\Repositories\ThematicUserGroupRelationRepository;
use App\Repositories\ThematicUserGroupRepository;
use App\Services\API\APIOuterAPI;
use App\Services\API\GeoNetworkAPI;
use Carbon\Carbon;
use Cron\CronExpression;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use SimpleXMLElement;

/**
 * Class GeoProductService
 * @package App\Services
 */
class GeoProductService extends BaseService
{


    public function __construct(
        private GeoProductRepository $geoProductRepository,
        private GeoProductServiceRepository $geoProductServiceRepository,
        private StorageService $storageService,
        private GeoProductOrderRepository $geoProductOrderRepository,
        private GeoProductFileRepository $geoProductFileRepository,
        private GeoProductOtherRepository $geoProductOtherRepository,
        private GeoProductTagRepository $geoProductTagRepository,
        private GeoProductNoneRepository $geoProductNoneRepository,
        private AttachmentRepository $attachmentRepository,
        private ClassifierValueRepository $classifierValueRepository,
        private ThematicUserGroupRelationRepository $thematicUserGroupRelationRepository,
        private GeoProductOtherSiteRepository $geoProductOtherSiteRepository,
        private APIOuterAPI $APIOuterAPI,
        private MetadataService $metadataService,
        private GeoNetworkAPI $geoNetworkAPI,
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    public function getGeoproducts($options)
    {
        return $this->geoProductRepository->getGeoproducts($options);
    }


    public function getGeoproduct($id)
    {
        $this->checkGeoproductAccess($id);
        $geoProduct = $this->geoProductRepository->findById($id);

        $services = $this->geoProductServiceRepository->findBy('geo_product_id', $id, true, ['geo_product_services.*'], [['classifierValue' => 'service_type_classifier_value_id']], ['licence'], 'geo_product_services.id')->toArray();
        $filesData = $this->geoProductFileRepository->findBy('geo_product_id', $id, true, ['geo_product_files.*'], [['classifierValue' => 'file_method_classifier_value_id']], ['licence', 'attachments'], 'geo_product_files.id')->toArray();
        $others = $this->geoProductOtherRepository->findBy('geo_product_id', $id, true, [], [], ['sites'], 'id');
        $none = $this->geoProductNoneRepository->findBy('geo_product_id', $id, true, [], [], [], 'id');
        $tags = $this->geoProductTagRepository->findBy('geo_product_id', $id, true, [], [], [], 'id');

        foreach ($services as &$service) {
            $service['licence'] = [$service['licence']];
            $service[$service['license_type'] === 'OPEN' ? 'institution_open_licence_id' : 'institution_predefined_licence_id'] = $service['institution_licence_id'];

            if (!$service['payment_type']) {
                unset($service['payment_type']);
            }

            if (!$service['usage_request']) {
                unset($service['usage_request']);
            }

            if (!$service['institution_type_classifier_ids']) {
                $service['institution_type_classifier_ids'] = [];
            }
        }

        foreach ($filesData as &$file) {
            $file['licence'] = [$file['licence']];
            $file['file'] = $file['attachments'];
            $file[$file['license_type'] === 'OPEN' ? 'institution_open_licence_id' : 'institution_predefined_licence_id'] = $file['institution_licence_id'];

            if (!$file['payment_type']) {
                unset($file['payment_type']);
            }

            if (!$file['usage_request']) {
                unset($file['usage_request']);
            }

            if (!$file['institution_type_classifier_ids']) {
                $file['institution_type_classifier_ids'] = [];
            }
        }

        $geoProduct->services = $services;
        $geoProduct->filesData = $filesData;
        $geoProduct->others = $others->toArray();
        $geoProduct->none = $none->toArray();
        $geoProduct->tags = $tags->pluck('name');

        if ($geoProduct->photo_attachment_id) {
            $attachment = $this->attachmentRepository->findById($geoProduct->photo_attachment_id);
            $geoProduct->photo = [$attachment->toArray()];
        }

        if ($geoProduct->specification_attachment_id) {
            $attachment = $this->attachmentRepository->findById($geoProduct->specification_attachment_id);
            $geoProduct->data_specification = [$attachment->toArray()];
        }

        return $geoProduct;
    }

    public function checkInspireValidation($geoProductId, $id)
    {
        $inspireResponse = $this->metadataService->checkMetadataResponse($id);

        if (isset($inspireResponse['status']) && isset($geoProductId)) {
            $geoProduct = $this->geoProductRepository->findById($geoProductId);
            $geoProduct->inspire_status = $inspireResponse['status'];
            $geoProduct->update();
        }

        return $inspireResponse;
    }

    public function dppsCapabilities($id, $dppsUuid, $params)
    {
        $service = $this->geoProductServiceRepository->findById($id);

        if (!$dppsUuid || !$service->dpps_name || !in_array('ONLY_GEOPORTAL', $service->service_limitation_type)) {
            throw new \Exception('error.dpps_failed');
        }

        return $this->APIOuterAPI->call(
            'api/v1/dpps/api/DPPSPackage/capabilities',
            ['dpps_uuid' => $dppsUuid, 'dpps_name' => $service->dpps_name, 'params' => $params],
            'POST',
            $this->headers,
            [],
            true,
        );
    }

    public function store($params): Model
    {
        if (isset($params['photo'])) {
            $photoAttachment = $this->storageService->storeFile($params['photo'], 'default');
            $params['photo_attachment_id'] = $photoAttachment->id;
        }

        if (isset($params['data_specification'])) {
            $dataSpecificationAttachment = $this->storageService->storeFile($params['data_specification'], 'default');
            $params['specification_attachment_id'] = $dataSpecificationAttachment->id;
        }

        $activeRole = $this->attachmentRepository->activeRole();
        if ($activeRole) {
            $params['owner_institution_classifier_id'] = $activeRole->institution_classifier_id;
        }

        $params['status'] = GeoProductStatus::DRAFT;
        $geoProduct = $this->geoProductRepository->store($params);

        if (isset($params['services'])) {
            foreach ($params['services'] as &$service) {
                if (isset($param['payment_type'])) {
                    $this->checkIfPaymentModuleEnabled($param['payment_type']);
                }

                if (isset($service['licence'][0])) {
                    $attachment = $this->storageService->storeFile($params['dynamic_files'][$service['licence'][0]], 'default');
                    $service['licence_attachment_id'] = $attachment->id;
                }

                //FILE_DOWNLOAD specific if chooses a file
                if (isset($service['atom'][0])) {
                    if (is_string($service['atom'][0])) {
                        $attachment = $this->storageService->storeFile($params['dynamic_files'][$service['atom'][0]], 'atom', $service['atom'][1] ?? null);
                        $service['atom_attachment_id'] = $attachment->id;

                        $service['atom_uuid'] = $this->generateUUIDv4();
                        $service['service_link'] = env('APP_URL') . '/api/v1/atom/' . $service['atom_uuid'] . '/serviceatoma';
                    }
                }

                $service['geo_product_id'] = $geoProduct->id;
                $service['institution_licence_id'] = $service['institution_open_licence_id'] ?? $service['institution_predefined_licence_id'] ?? null;
                $service['usage_request'] = $service['usage_request'] ?? [];

                $model = $this->geoProductServiceRepository->store($service);
                $service['id'] = $model->id;

                if (isset($service['service_link'])) {
                    try {
                        $this->dppsHandling($service, $params['name'], $model);
                    } catch (\Exception $e) {
                        throw new \Exception('error.dpps_failed');
                    }
                }

            }
        }

        if (isset($params['files_data'])) {
            foreach ($params['files_data'] as $fileData) {
                if (isset($param['payment_type'])) {
                    $this->checkIfPaymentModuleEnabled($param['payment_type']);
                }

                if (!isset($params['payment_type'])) {
                    $params['payment_type'] = null;
                }

                $fileData['geo_product_id'] = $geoProduct->id;
                $fileData['institution_licence_id'] = $fileData['institution_open_licence_id'] ?? $fileData['institution_predefined_licence_id'] ?? null;
                $fileData['usage_request'] = $fileData['usage_request'] ?? [];

                if (
                    isset($fileData['update_is_needed']) &&
                    isset($fileData['frequency_number_classifier_value_id']) &&
                    isset($fileData['frequency_type_classifier_value_id']) &&
                    isset($fileData['frequency_date'])
                ) {
                    $frequency = $this->classifierValueRepository->findById($fileData['frequency_number_classifier_value_id'])->value_code;
                    $occurrence = $this->classifierValueRepository->findById($fileData['frequency_type_classifier_value_id'])->value_code;

                    $cronExpression = $this->buildCronExpression(intval($frequency), $occurrence, Carbon::parse($fileData['frequency_date'])->format('H:i'));

                    if (CronExpression::isValidExpression($cronExpression)) {
                        $fileData['ftp_cron'] = $cronExpression;
                    }
                }

                $files = $this->geoProductFileRepository->store($fileData);

                if ($files->ftp_address && $files->ftp_username && $files->ftp_password) {
                    Artisan::queue("ftp:sync {$files->id}");
                } else {
                    $fileData['files_updated_at'] = Carbon::now();
                }

                if (isset($fileData['licence'][0])) {
                    $attachment = $this->storageService->storeFile($params['dynamic_files'][$fileData['licence'][0]], 'default');
                    $fileData['licence_attachment_id'] = $attachment->id;
                }

                if (isset($fileData['file'][0])) {
                    if (is_string($fileData['file'][0])) {
                        foreach ($fileData['file'] as $file) {
                            $this->storageService->storeFile($params['dynamic_files'][$file], 'default', '', 'geo_product_file_id', $files->getKey());
                        }
                    }
                }
            }
        }

        if (isset($params['others'])) {
            foreach ($params['others'] as $other) {
                $other['geo_product_id'] = $geoProduct->id;

                $storedOther = $this->geoProductOtherRepository->store($other);

                if (isset($other['sites'])) {
                    foreach ($other['sites'] as $site) {
                        $site['geo_product_other_id'] = $storedOther->id;

                        $this->geoProductOtherSiteRepository->store($site);
                    }
                }
            }
        }

        if (isset($params['tags'])) {
            foreach ($params['tags'] as $tag) {
                $options = [
                    'name' => $tag,
                    'geo_product_id' => $geoProduct->id
                ];

                $this->geoProductTagRepository->store($options);
            }
        }

        if (isset($params['none'])) {
            foreach ($params['none'] as $none) {
                $none['geo_product_id'] = $geoProduct->id;

                $this->geoProductNoneRepository->store($none);
            }
        }

        $this->handleInspire($geoProduct);

        if (isset($params['services'])) {
            foreach ($params['services'] as $service) {
                if (isset($service['atom_uuid'])) {
                    $attachment = $this->attachmentRepository->findById($service['atom_attachment_id']);
                    $this->generateAtom($geoProduct->id, $attachment->uuid, $attachment->display_name, $service['atom_uuid'], $service['id']);
                }
            }
        }

        return $geoProduct;
    }

    private function checkIfPaymentModuleEnabled($paymentType): void
    {
        $isProd = config('app.env') === 'production';

        if ($isProd && $paymentType === GeoProductPaymentType::PREPAY->value) {
            throw new \Exception('validation.payment_module_disabled');
        }
    }

    public function updateGeoproduct($params, $id): Model
    {
        $this->checkGeoproductAccess($id);

        $geoProduct = $this->geoProductRepository->findById($id, ['geoProductServices']);

        if ($geoProduct->status !== GeoProductStatus::DRAFT) {
            $this->validation($params, $params['tags'], $params['services'], $params['files_data'], $params['others'], $params['none']);
        }

        $this->deleteGeoProductAttachments($params, $geoProduct);

        if (isset($params['photo']) && $params['photo'] !== 'undefined') {
            $photoAttachment = $this->storageService->storeFile($params['photo'], 'default');
            $params['photo_attachment_id'] = $photoAttachment->id;

            if ($geoProduct->photo_attachment_id) {
                $this->storageService->deleteFile($geoProduct->photo_attachment_id);
            }
        }

        if (isset($params['data_specification']) && $params['data_specification'] !== 'undefined') {
            $dataSpecificationAttachment = $this->storageService->storeFile($params['data_specification'], 'default');
            $params['specification_attachment_id'] = $dataSpecificationAttachment->id;

            if ($geoProduct->specification_attachment_id) {
                $this->storageService->deleteFile($geoProduct->specification_attachment_id);
            }
        }

        if (isset($params['to_be_deleted'])) {
            $filesToDelete = json_decode($params['to_be_deleted']);

            if (in_array($geoProduct->photo_attachment_id, $filesToDelete)) {
                $params['photo_attachment_id'] = null;
            }

            if (in_array($geoProduct->specification_attachment_id, $filesToDelete)) {
                $params['specification_attachment_id'] = null;
            }
        }


        $geoProduct = $this->geoProductRepository->update($id, $params);

        $this->dynamicUpdate($id, $params, 'services', $this->geoProductServiceRepository);
        $this->dynamicUpdate($id, $params, 'files_data', $this->geoProductFileRepository);
        $this->dynamicUpdate($id, $params, 'others', $this->geoProductOtherRepository);
        $this->dynamicUpdate($id, $params, 'none', $this->geoProductNoneRepository);

        $tags = $this->geoProductTagRepository->findBy('geo_product_id', $id, true);

        $actualIndex = 0;
        //update existing or delete unnecessary
        foreach ($tags as $index => $tag) {
            if (isset($params['tags'][$index])) {
                $tag->name = $params['tags'][$index];
                $tag->update();
            } else {
                $tag->delete();
            }
            $actualIndex += 1;
        }

        //create while new entries
        while (isset($params['tags'][$actualIndex])) {
            $newTag = [
                'name' => $params['tags'][$actualIndex],
                'geo_product_id' => $geoProduct->id
            ];

            $this->geoProductTagRepository->store($newTag);

            $actualIndex += 1;
        }

        $this->handleInspire($geoProduct);


        return $geoProduct;
    }

    private function deleteGeoProductAttachments($params, $geoProduct)
    {
        if (isset($params['to_be_deleted'])) {
            $filesToDelete = json_decode($params['to_be_deleted']);

            foreach ($filesToDelete as $fileToDelete) {
                if ($fileToDelete) {
                    $service = $geoProduct->geoProductServices->firstWhere('licence_attachment_id', intval($fileToDelete));
                    $file = $geoProduct->geoProductFiles->firstWhere('licence_attachment_id', intval($fileToDelete));
                    $attachment = $this->attachmentRepository->findById($fileToDelete);

                    if ($service) {
                        foreach ($params['services'] as &$paramService) {
                            if ($paramService['id'] === $service->id) {
                                $paramService['licence_attachment_id'] = null;
                            }
                        }

                        $service->licence_attachment_id = null;
                        $service->save();
                    }

                    if ($file) {
                        foreach ($params['filesData'] as &$paramFiles) {
                            if ($paramFiles['id'] === $file->id) {
                                $paramFiles['licence_attachment_id'] = null;
                            }
                        }

                        $file->licence_attachment_id = null;
                        $file->save();
                    }

                    $storage = Storage::disk($attachment->bucket);

                    if ($storage->exists($attachment->filename)) {
                        $storage->delete($attachment->filename);
                    }

                    $attachment->delete();
                }
            }
        }
    }

    public function handleInspire($geoProduct): void
    {
        $metadata = $this->metadataService->createMetadata($geoProduct);

        $geoProduct->metadata_uuid = $metadata['metadata_uuid'];
        $geoProduct->inspire_validation = $metadata['inspire_validation'];
        $geoProduct->inspire_status = $geoProduct->is_inspired ? 'PENDING' : null;
        $geoProduct->update();

        $geoProductServices = $geoProduct->geoProductServices;

        foreach ($geoProductServices as $geoProductService) {
            try {
                $metadata = $this->metadataService->createMetadata($geoProduct, $geoProductService, $geoProduct->metadata_uuid);

                $geoProductService->metadata_uuid = $metadata['metadata_uuid'];
                $geoProductService->inspire_validation = $metadata['inspire_validation'];
                $geoProductService->inspire_status = 'PENDING';
                $geoProductService->update();
            } catch (\Exception $e) {
                continue;
            }
        }

        $geoProductFiles = $geoProduct->geoProductFiles;
        foreach ($geoProductFiles as $geoProductFile) {
            try {
                $metadata = $this->metadataService->createMetadata($geoProduct, $geoProductFile, $geoProduct->metadata_uuid);

                $geoProductFile->metadata_uuid = $metadata['metadata_uuid'];
                $geoProductFile->update();
            } catch (\Exception $e) {
                continue;
            }
        }

        $geoProductOthers = $geoProduct->geoProductOthers;
        foreach ($geoProductOthers as $geoProductOther) {
            try {
                $metadata = $this->metadataService->createMetadata($geoProduct, $geoProductOther, $geoProduct->metadata_uuid);

                $geoProductOther->metadata_uuid = $metadata['metadata_uuid'];
                $geoProductOther->update();
            } catch (\Exception $e) {
                continue;
            }
        }
    }

    public function dynamicUpdate($id, $params, $value, $repo): void
    {
        $existing = $repo->findBy('geo_product_id', $id, true);

        $ids = collect($params[$value])->pluck('id')->all();
        $existingIds = $existing->pluck('id')->all();

        foreach ($params[$value] as &$param) {
            if (isset($param['payment_type'])) {
                $this->checkIfPaymentModuleEnabled($param['payment_type']);
            }

            if (!isset($param['payment_type'])) {
                $param['payment_type'] = null;
            }

            if (isset($param['id'])) {
                $deleteLicence = false;
                $deleteAtom = false;
                $modal = $repo->findById($param['id']);

                //cant edit while geoproduct orders are active
                if (($value == 'services' || $value == 'files_data') && !$modal->geoProductOrders->isEmpty()) {
                    $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'ACTIVE');

                    if (!$param['is_public']) {
                        $checkedOrders = $modal->geoProductOrders->where('order_status_classifier_value_id', $classifierValue->id)->pluck('id')->toArray();
                        if (!empty($checkedOrders)) {
                            throw new ExceptionWithAttributes(json_encode([
                                'error' => 'validation.product_is_used',
                                'attributes' => [
                                    'ids' => 'Nr. ' . implode(', ', $modal->geoProductOrders
                                            ->where('order_status_classifier_value_id', $classifierValue->id)
                                            ->pluck('id')
                                            ->toArray())
                                ]
                            ]), 412);

                        }
                    }
                }

                //update licence attachment
                if (isset($param['licence'][0])) {
                    if (is_string($param['licence'][0])) {
                        $attachment = $this->storageService->storeFile($params['dynamic_files'][$param['licence'][0]], 'default');
                        $param['licence_attachment_id'] = $attachment->id;

                        $deleteLicence = true;
                    }
                }

                //FILE_DOWNLOAD specific if chooses a file
                if (isset($param['atom'][0])) {
                    if (is_string($param['atom'][0])) {
                        $attachment = $this->storageService->storeFile($params['dynamic_files'][$param['atom'][0]], 'atom');
                        $param['atom_attachment_id'] = $attachment->id;
                        $deleteAtom = true;

                        $param['atom_uuid'] = $this->generateUUIDv4();
                        $param['service_link'] = env('APP_URL') . '/api/v1/atom/' . $param['atom_uuid'] . '/serviceatoma';
                    }
                }

                if (isset($param['institution_open_licence_id']) || isset($param['institution_predefined_licence_id'])) {
                    $param['institution_licence_id'] = $param['institution_open_licence_id'] ?? $param['institution_predefined_licence_id'] ?? null;
                }

                if (
                    isset($param['update_is_needed']) &&
                    isset($param['frequency_number_classifier_value_id']) &&
                    isset($param['frequency_type_classifier_value_id']) &&
                    isset($param['frequency_date'])
                ) {
                    $frequency = $this->classifierValueRepository->findById($param['frequency_number_classifier_value_id'])->value_code;
                    $occurrence = $this->classifierValueRepository->findById($param['frequency_type_classifier_value_id'])->value_code;

                    $cronExpression = $this->buildCronExpression(intval($frequency), $occurrence, Carbon::parse($param['frequency_date'])->format('H:i'));

                    if (CronExpression::isValidExpression($cronExpression)) {
                        $param['ftp_cron'] = $cronExpression;
                    }
                }

                $afterSave = $repo->update($param['id'], $param);

                if ($afterSave->ftp_address && $afterSave->ftp_username && $afterSave->ftp_password && $afterSave->processing_type_classifier_value_id) {
                    Artisan::queue("ftp:sync {$afterSave->id}");
                }

                if (isset($param['file'][0])) {
                    if (is_string($param['file'][0])) {
                        foreach ($param['file'] as $file) {
                            $this->storageService->storeFile($params['dynamic_files'][$file], 'default', '', 'geo_product_file_id', $afterSave->id);
                        }
                    }
                }

                if ($value !== 'others') {
                    $licenceId = $existing->where('id', $param['id'])->first()->licence_attachment_id;
                    if ($deleteLicence && $licenceId) {
                        $this->storageService->deleteFile($licenceId);
                    }

                    $atomId = $existing->where('id', $param['id'])->first()->atom_attachment_id;
                    if ($deleteAtom && $atomId) {
                        $this->storageService->deleteFile($atomId);
                    }
                }

            } else {
                $param['geo_product_id'] = $id;

                if (isset($param['licence'][0])) {
                    $attachment = $this->storageService->storeFile($params['dynamic_files'][$param['licence'][0]], 'default');
                    $param['licence_attachment_id'] = $attachment->id;
                }

                if (isset($param['payment_type']) && $param['payment_type'] === GeoProductPaymentType::PREPAY->value && isset($param['price_for']) && !$param['price_for']) {
                    $param['price_for'] = null;
                }

                //FILE_DOWNLOAD specific if chooses a file
                if (isset($param['atom'][0])) {
                    if (is_string($param['atom'][0])) {
                        $attachment = $this->storageService->storeFile($params['dynamic_files'][$param['atom'][0]], 'atom');
                        $param['atom_attachment_id'] = $attachment->id;

                        $param['atom_uuid'] = $this->generateUUIDv4();
                        $param['service_link'] = env('APP_URL') . '/api/v1/atom/' . $param['atom_uuid'] . '/serviceatoma';
                    }
                }

                if (isset($param['institution_open_licence_id']) || isset($param['institution_predefined_licence_id'])) {
                    $param['institution_licence_id'] = $param['institution_open_licence_id'] ?? $param['institution_predefined_licence_id'] ?? null;
                }

                if (
                    isset($param['update_is_needed']) &&
                    isset($param['frequency_number_classifier_value_id']) &&
                    isset($param['frequency_type_classifier_value_id']) &&
                    isset($param['frequency_date'])
                ) {
                    $frequency = $this->classifierValueRepository->findById($param['frequency_number_classifier_value_id'])->value_code;
                    $occurrence = $this->classifierValueRepository->findById($param['frequency_type_classifier_value_id'])->value_code;

                    $cronExpression = $this->buildCronExpression(intval($frequency), $occurrence, Carbon::parse($param['frequency_date'])->format('H:i'));

                    if (CronExpression::isValidExpression($cronExpression)) {
                        $param['ftp_cron'] = $cronExpression;
                    }
                }

                $afterSave = $repo->store($param);
                $param['id'] = $afterSave->id;

                if ($afterSave->ftp_address && $afterSave->ftp_username && $afterSave->ftp_password && $afterSave->processing_type_classifier_value_id) {
                    Artisan::queue("ftp:sync {$afterSave->id}");
                }

                if (isset($param['file'][0])) {
                    if (is_string($param['file'][0])) {
                        foreach ($param['file'] as $file) {
                            $this->storageService->storeFile($params['dynamic_files'][$file], 'default', '', 'geo_product_file_id', $afterSave->getKey());
                        }
                    }
                }
            }

            if ($value === 'services' && isset($param['service_link'])) {
                try {
                    $this->dppsHandling($param, $params['name'], $modal ?? $afterSave);
                } catch (\Exception $e) {
                    throw new \Exception('error.dpps_failed');
                }
            }

            //reset for next loop
            $modal = null;

            //for other sites
            if (isset($param['id']) && $value === 'others') {
                $existing = $this->geoProductOtherSiteRepository->findBy('geo_product_other_id', $param['id'], true);

                if (isset($param['sites'])) {
                    $sitesIds = collect($param['sites'])->pluck('id')->all();
                    $sitesExistingIds = $existing->pluck('id')->all();

                    foreach ($param['sites'] as $site) {
                        if (isset($site['id'])) {
                            $this->geoProductOtherSiteRepository->update($site['id'], $site);

                            continue;
                        }

                        $site['geo_product_other_id'] = $afterSave->id;
                        $this->geoProductOtherSiteRepository->store($site);
                    }

                    $diffIds = array_diff($sitesExistingIds, $sitesIds);

                    foreach ($diffIds as $diffId) {
                        $this->geoProductOtherSiteRepository->delete($diffId);
                    }
                }
            }
        }

        foreach ($params[$value] as $forAtom) {
            if (isset($forAtom['atom_uuid'])) {
                $attachment = $this->attachmentRepository->findById($forAtom['atom_attachment_id']);
                $this->generateAtom($id, $attachment->uuid, $attachment->display_name, $forAtom['atom_uuid'], $forAtom['id']);
            }
        }

        //delete existing values (soft delete)
        $diffIds = array_diff($existingIds, $ids);
        foreach ($diffIds as $diffId) {
            $repo->delete($diffId);
        }

        //delete dpps api
        $diffDpps = $existing->whereIn('id', $diffIds)->all();
        foreach ($diffDpps as $diffDpp) {
            if ($diffDpp->dpps_name) {
                $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/delete-api', ['api_name' => $diffDpp->dpps_name], 'POST', $this->headers);
            }
        }
    }

    public function generateAtom($geoproductId, $uuid, $displayName, $atomUuid, $serviceId): string
    {
        $geoproduct = $this->geoProductRepository->findById($geoproductId);
        $service = $this->geoProductServiceRepository->findById($serviceId);

        $datasetAtomUuid = $this->generateUUIDv4();
        $serviceAtomUuid = $atomUuid ?? $this->generateUUIDv4();

        $datasetLink = env('APP_URL') . '/api/v1/atom/' . $datasetAtomUuid . '/datasetatoma';
        $serviceLink = env('APP_URL') . '/api/v1/atom/' . $serviceAtomUuid . '/serviceatoma';
        $fileLink = env('APP_URL') . '/api/v1/atom/' . $uuid . '/file';

        $datasetMetadataLink = env('APP_URL') . '/geonetwork/srv/api/records/' . $geoproduct->metadata_uuid . '/formatters/xml';
        $serviceMetadataLink = env('APP_URL') . '/geonetwork/srv/api/records/' . $service->metadata_uuid . '/formatters/xml';

        //create dataset atom
        $atom = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="' . env('APP_URL') . '/api/v1/atom/service-style' . '"?>
    <!--
    + ATTENTION !!! DO NOT DELETE THIS COMMENT. IT IS NECESSARY
    + TO PREVENT AND FIREFOX IE TO USE YOUR DEFAULT STYLE SHEET.
    + E \'NECESSARY THAT THERE ARE AT LEAST 512 CHARACTERS TO PREVENT A FIREFOX AND INTERNET
    + EXPLORER TO IGNORE THE STYLE SHEET OF DECLARED IN HEAD.
    + THIS \'CONDUCT KNOWN BUT WHEN NOT\' BEEN SOLVED.
    +
    + This ATOM Feed? the implementation of a download service according to the rules
    + INSPIRE for Pre-Defined Download Datasets.
    +
    + This? the Dataset feed inside which there are references to downloadable data.
    -->
    <feed xmlns="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss" xmlns:inspire_dls="http://inspire.ec.europa.eu/schemas/inspire_dls/1.0" xml:lang="en">
    </feed>
    ');
        $atom->addChild('title', $displayName);
        $link = $atom->addChild('link');
        $link->addAttribute('href', $datasetLink);
        $link->addAttribute('hreflang', 'en');
        $link->addAttribute('rel', 'self');
        $link->addAttribute('title', 'This document');
        $link->addAttribute('type', 'application/atom+xml');

        $link = $atom->addChild('link');
        $link->addAttribute('href', $serviceLink);
        $link->addAttribute('hreflang', 'en');
        $link->addAttribute('rel', 'up');
        $link->addAttribute('title', 'The parent service feed document');
        $link->addAttribute('type', 'application/atom+xml');

        $atom->addChild('id', $datasetLink);
        $atom->addChild('rights', '(c) COPYRIGHTS 2014, INSPIRE; all rights reserved');
        $atom->addChild('updated', Carbon::now()->format('Y-m-d'));
        $author = $atom->addChild('author');
        $author->addChild('name', $geoproduct->organization_name);
        $author->addChild('email', $geoproduct->email);

        $entry = $atom->addChild('entry');
        $entry->addChild('title', $displayName);
        $link = $entry->addChild('link');
        $link->addAttribute('href', $fileLink);
        $link->addAttribute('hreflang', 'en');
        $link->addAttribute('rel', 'alternate');
        $link->addAttribute('title', 'zip fails');
        $link->addAttribute('type', 'application/gml+xml');

        $entry->addChild('id', 'datasetatom.xml');
        $entry->addChild('updated', Carbon::now()->format('Y-m-d'));

        $entry->addChild('summary');
        $entry->addChild('georss:polygon', '53.100 20.235 56.400 20.235 56.400 26.893 53.100 26.893 53.100 20.235', 'http://www.georss.org/georss');
        $category = $entry->addChild('category');
        $category->addAttribute('label', 'ETRS89');
        $category->addAttribute('term', 'http://www.opengis.net/def/crs/EPSG/0/4258');

        $atom->asXML(public_path() . '/' . $datasetAtomUuid . '.xml');

        $file = File::get(public_path() . '/' . $datasetAtomUuid . '.xml');

        $this->storageService->storeFile($file, 'atom', $datasetAtomUuid . '.xml', null, null, $datasetAtomUuid);

        //create service atomm
        $atom = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="' . env('APP_URL') . '/api/v1/atom/service-style' . '"?>
    <!--
    + ATTENTION !!! DO NOT DELETE THIS COMMENT. IT IS NECESSARY
    + TO PREVENT AND FIREFOX IE TO USE YOUR DEFAULT STYLE SHEET.
    + E \'NECESSARY THAT THERE ARE AT LEAST 512 CHARACTERS TO PREVENT A FIREFOX AND INTERNET
    + EXPLORER TO IGNORE THE STYLE SHEET OF DECLARED IN HEAD.
    + THIS \'CONDUCT KNOWN BUT WHEN NOT\' BEEN SOLVED.
    +
    + This ATOM Feed? the implementation of a download service according to the rules
    + INSPIRE for Pre-Defined Download Datasets.
    +
    + This? the Dataset feed inside which there are references to downloadable data.
    -->
    <feed xmlns="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss" xmlns:inspire_dls="http://inspire.ec.europa.eu/schemas/inspire_dls/1.0" xml:lang="en">
    </feed>
    ');

        $atom->addChild('title', $displayName);
        $atom->addChild('subtitle');

        $link = $atom->addChild('link');
        $link->addAttribute('href', $serviceMetadataLink);
        $link->addAttribute('rel', 'describedby');
        $link->addAttribute('type', 'application/xml');

        $link = $atom->addChild('link');
        $link->addAttribute('href', $serviceLink);
        $link->addAttribute('hreflang', 'en');
        $link->addAttribute('rel', 'self');
        $link->addAttribute('title', 'This document');

        $atom->addChild('id', $serviceLink);
        $atom->addChild('rights', '(c) COPYRIGHTS 2014, INSPIRE; all rights reserved');
        $atom->addChild('updated', Carbon::now()->format('Y-m-d'));
        $author = $atom->addChild('author');
        $author->addChild('name', $geoproduct->organization_name);
        $author->addChild('email', $geoproduct->email);

        $entry = $atom->addChild('entry');

        $entry->addChild('inspire_dls:spatial_dataset_identifier_code', 'ZD', 'http://inspire.ec.europa.eu/schemas/inspire_dls/1.0');
        $entry->addChild('inspire_dls:spatial_dataset_identifier_namespace', 'http://www.esri.com/inspire/atom', 'http://inspire.ec.europa.eu/schemas/inspire_dls/1.0');

        $link = $entry->addChild('link');
        $link->addAttribute('href', $datasetMetadataLink);
        $link->addAttribute('rel', 'describedby');
        $link->addAttribute('type', 'application/xml');

        $link = $entry->addChild('link');
        $link->addAttribute('href', $datasetLink);
        $link->addAttribute('hreflang', 'en');
        $link->addAttribute('rel', 'alternate');
        $link->addAttribute('title', 'dataset link');

        $entry->addChild('id', $datasetLink);
        $entry->addChild('title', $displayName);
        $entry->addChild('rights', '(c) COPYRIGHTS 2014, INSPIRE; all rights reserved');
        $entry->addChild('updated', Carbon::now()->format('Y-m-d'));
        $author = $entry->addChild('author');
        $author->addChild('name', $geoproduct->organization_name);
        $author->addChild('email', $geoproduct->email);
        $entry->addChild('summary');
        $entry->addChild('georss:polygon', '53.100 20.235 56.400 20.235 56.400 26.893 53.100 26.893 53.100 20.235', 'http://www.georss.org/georss');
        $category = $entry->addChild('category');
        $category->addAttribute('label', 'ETRS89');
        $category->addAttribute('term', 'http://www.opengis.net/def/crs/EPSG/0/4258');

        $atom->asXML(public_path() . '/' . $serviceAtomUuid . '.xml');

        $file = File::get(public_path() . '/' . $serviceAtomUuid . '.xml');

        $this->storageService->storeFile($file, 'atom', $serviceAtomUuid . '.xml', null, null, $serviceAtomUuid);

        File::delete(public_path() . '/' . $serviceAtomUuid . '.xml');
        File::delete(public_path() . '/' . $datasetAtomUuid . '.xml');

        return $serviceLink;
    }

    public function dppsHandling($param, $name, $model): void
    {
        $linkParams = explode('?', $param['service_link']);
        $serviceType = $this->classifierValueRepository->findById($model->service_type_classifier_value_id);

        if ($serviceType->value_code === 'FEATURE_DOWNLOAD') {
            return;
        }

        $replaced = $this->replaceInvalidFileNameCharacters($this->replaceSpecialSymbols($name));

        $replacedName = str_replace(',', '', str_replace(' ', '_', substr($replaced, 0, 10)));

        $parsed = [
            'name' => $replacedName . '_' . $model->id . '_' . Str::random(6),
            'context' => '/' . $replacedName . '_' . $model->id . '_' . Str::random(6),
            'version' => '1.0.0',
            'endpoint' => $linkParams[0],
            'default_parameters' => '?' . ($linkParams[1] ?? ('SERVICE=' . ($serviceType->value_code === 'INSPIRE_VIEW' ? 'WMS' : $serviceType->value_code) . '&REQUEST=GetCapabilities'))
        ];

        $accessParsed = [
            'access_name' => $parsed['name'] . '_service_open_' . $model->id . '_' . Str::random(6),
            'api_name' => $parsed['name'],
            'validity_period' => "-1",
            'user_id' => request()->user() ? (string)request()->user()->id : '1',
        ];

        //create new
        if (!$model->dpps_name) {

            $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/create-api', $parsed, 'POST', $this->headers);

            $model->dpps_name = $parsed['name'];

            if ($param['license_type'] === 'OPEN') {
                $data = $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/create-access', $accessParsed, 'POST', $this->headers);

                $uuidData = explode('/', $data['data']['Access_URL']);
                $model->dpps_uuid = end($uuidData);
                $model->dpps_link = $data['data']['Access_URL'];
            }

            $model->update();

            return;
        }

        //update existing
        if ($model->dpps_name && $model->service_link && $model->service_link != $param['service_link']) {
            $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/update-api', [
                'endpoint' => $linkParams[0],
                'name' => $model->dpps_name,
                'default_parameters' => '?' . ($linkParams[1] ?? ('SERVICE=' . ($serviceType->value_code === 'INSPIRE_VIEW' ? 'WMS' : $serviceType->value_code) . '&REQUEST=GetCapabilities'))
            ], 'POST', $this->headers);
        }

        if (!$model->service_link && $param['license_type'] === 'OPEN') {
            $data = $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/create-access', $accessParsed, 'POST', $this->headers);

            $model->dpps_link = $data['data']['Access_URL'];
        }
    }

    public function publishGeoproduct($data, $id): Model
    {
        $this->checkGeoproductAccess($id);
        $geoProduct = $this->geoProductRepository->findById($id, ['geoProductServices', 'geoProductFiles', 'geoProductOthers', 'geoProductOthers.sites', 'geoProductNones']);

        $this->validation($geoProduct->toArray(), $geoProduct->geoProductTags->toArray(), $geoProduct->geoProductServices->toArray(), $geoProduct->geoProductFiles->toArray(), $geoProduct->geoProductOthers->toArray(), $geoProduct->geoProductNones->toArray());

        $enableInspireValidationCheckOnPublish = env('ENABLE_INSPIRE_VALIDATION_CHECK_ON_PUBLISH');
        if ($enableInspireValidationCheckOnPublish && $geoProduct->is_inspire && isset($geoProduct->inspire_validation)) {
            $inspire = $this->checkInspireValidation($id, $geoProduct->inspire_validation);
            if (isset($inspire['status']) && $inspire['status'] === 'FAILED') {
                throw new \Exception('validation.inspire_check_failed');
            }
        }

        $geoProduct->is_public = true;
        $geoProduct->public_from = $data['public_from'] ?? Carbon::now();
        $geoProduct->public_to = $data['public_to'] ?? null;
        $geoProduct->status = Carbon::parse($data['public_from'] ?? Carbon::now()) > Carbon::now() ? GeoProductStatus::PLANNED : GeoProductStatus::PUBLIC;
        $geoProduct->update();

        $jar = new CookieJar;

        $geoproductUuids = [$geoProduct->metadata_uuid];
        $serviceUuids = $geoProduct->geoProductServices->pluck('metadata_uuid')->toArray();
        $fileUuids = $geoProduct->geoProductFiles->pluck('metadata_uuid')->toArray();
        $otherUuids = $geoProduct->geoProductOthers->pluck('metadata_uuid')->toArray();

        $uuids = array_merge($geoproductUuids, $serviceUuids, $fileUuids, $otherUuids);

        foreach ($uuids as $uuid) {
            $networkData = [
                'uuids' => $uuid,
            ];

            $this->geoNetworkAPI->call('/geonetwork/srv/api/records/publish', $networkData, 'PUT', [], ['add_in_params' => true, 'cookie_jar' => $jar]);
        }

        return $geoProduct;
    }

    public function validation($values, $tags, $services, $files, $others, $nones)
    {
        try {
            $validator = Validator::make($values, [
                'name' => ['required'],
                'description' => ['required'],
                'regularity_renewal_classifier_value_id' => ['required'],
                'organization_name' => ['required'],
                'email' => ['required'],
            ]);

            $validator->validate();

            if ($values['description'] === '<p><br></p>') {
                throw new \Exception('validation.required_fields_not_filled');
            }

            if (empty($tags)) {
                throw new \Exception('validation.required_fields_not_filled');
            }

            foreach ($services as $service) {
                if (isset($service['is_public']) && !$service['is_public']) continue;

                $validator = Validator::make($service, [
                    'service_type_classifier_value_id' => ['required'],
                    'service_link' => ['required'],
                    'description' => ['required'],
                    'available_restriction_type' => ['required'],
                ]);

                $validator->validate();

                if (in_array(GeoProductServiceLimitationTypes::PERIOD, $service['service_limitation_type'])) {
                    $validator = Validator::make($service, [
                        'period_classifier_value_id' => ['required'],
                        'number_value' => ['required'],
                    ]);

                    $validator->validate();
                }

                if ($service['license_type'] !== 'OTHER') {
                    $service['institution_licence_id'] = $service['institution_open_licence_id'] ?? $service['institution_predefined_licence_id'] ?? $service['institution_licence_id'];
                    $validator = Validator::make($service, [
                        'institution_licence_id' => ['required'],
                    ]);

                    $validator->validate();
                } else {
                    if (isset($service['licence_attachment_id'])) {
                        $validator = Validator::make($service, [
                            'licence_attachment_id' => ['required'],
                        ]);

                    } else {
                        $validator = Validator::make($service, [
                            'licence' => ['required'],
                        ]);

                    }
                    $validator->validate();
                }

                if ($service['license_type'] !== 'OPEN') {

                    switch ($service['payment_type']) {
                        case GeoProductPaymentType::FEE->value:
                            $validator = Validator::make($service, [
                                'fee_cost' => ['required'],
                            ]);
                            break;
                        case GeoProductPaymentType::PREPAY->value:
                            $validator = Validator::make($service, [
                                'fee_cost' => ['required'],
                                'service_step' => ['required'],
                                'position' => ['required'],
                            ]);
                            break;
                        default:
                            $validator = Validator::make($service, [
                                'payment_type' => ['required'],
                            ]);
                            break;
                    }

                    $validator->validate();
                }

            }

            $ftpClassifier = $this->classifierValueRepository->getClassifierValueByCodes('KL10', 'LOAD_ON_FTP');

            foreach ($files as $file) {
                if (isset($file['is_public']) && !$file['is_public']) continue;

                $validator = Validator::make($file, [
                    'file_method_classifier_value_id' => ['required'],
                    'available_restriction_type' => ['required'],
                    'description' => ['required'],
                ]);

                $validator->validate();

                if ($file['update_is_needed']) {
                    $validator = Validator::make($file, [
                        'frequency_number_classifier_value_id' => ['required'],
                        'frequency_type_classifier_value_id' => ['required'],
                        'frequency_date' => ['required']
                    ]);

                    $validator->validate();
                }

                if ($file['license_type'] !== 'OTHER') {
                    $file['institution_licence_id'] = $file['institution_open_licence_id'] ?? $file['institution_predefined_licence_id'] ?? $file['institution_licence_id'];
                    $validator = Validator::make($file, [
                        'institution_licence_id' => ['required'],
                    ]);

                    $validator->validate();
                } else {
                    $validator = Validator::make($file, [
                        'licence_attachment_id' => ['required'],
                    ]);

                    $validator->validate();
                }

                if ($ftpClassifier->id === $file['file_method_classifier_value_id']) {
//                    $validator = Validator::make($file, [
//                        'processing_type_classifier_value_id' => ['required'],
//                    ]);

//                    $validator->validate();

                    if ($file['update_is_needed']) {
                        $validator = Validator::make($file, [
                            'frequency_number_classifier_value_id' => ['required'],
                            'frequency_type_classifier_value_id' => ['required'],
                            'frequency_date' => ['required'],
                        ]);

                        $validator->validate();
                    }
                } else if (isset($file['id'])) {
                    $attachments = $this->attachmentRepository->findBy('geo_product_file_id', $file['id'], true);

                    if ($attachments->isEmpty() && empty($file['file'])) {
                        throw new \Exception('file_empty', 422);
                    }
                }

                if ($file['license_type'] !== 'OPEN') {
                    switch ($file['payment_type']) {
                        case GeoProductPaymentType::FEE->value:
                            $validator = Validator::make($file, [
                                'fee_cost' => ['required'],
                            ]);
                            break;
                        case GeoProductPaymentType::PREPAY->value:
                            $validator = Validator::make($file, [
                                'fee_cost' => ['required'],
                                'service_step' => ['required'],
                                'position' => ['required'],
                            ]);
                            break;
                        default:
                            $validator = Validator::make($file, [
                                'payment_type' => ['required'],
                            ]);
                            break;
                    }

                    $validator->validate();
                }
            }

            foreach ($others as $other) {
                if (isset($other['is_public']) && !$other['is_public']) continue;

                $validator = Validator::make($other, [
                    'sites' => ['required'],
                    'description' => ['required'],
                ]);

                $validator->validate();
            }


        } catch (\Exception $e) {
            Log::error($e);
            throw new \Exception('validation.required_fields_not_filled', 422);
        }

        if (
            !$this->hasPublicItemInDivs($services) &&
            !$this->hasPublicItemInDivs($files) &&
            !$this->hasPublicItemInDivs($others) &&
            !$this->hasPublicItemInDivs($nones)
        ) {
            throw new \Exception('validation.atleast_one_needs_to_be_public');
        }
    }

    private function hasPublicItemInDivs(array $items): bool
    {
        foreach ($items as $item) {
            if (isset($item['is_public']) && $item['is_public']) {
                return true;
            }
        }
        return false;
    }

    public function unpublishGeoproduct($id): Model
    {
        $this->checkGeoproductAccess($id);

        $geoProduct = $this->geoProductRepository->findById($id, ['geoProductServices.geoProductOrders', 'geoProductFiles.geoProductOrders', 'geoProductOthers.geoProductOrders', 'geoProductNones']);

        $this->validateUnpublish($geoProduct);

        $geoProduct->is_public = false;
        $geoProduct->public_from = null;
        $geoProduct->public_to = null;
        $geoProduct->status = GeoProductStatus::DRAFT;
        $geoProduct->update();

        $jar = new CookieJar;

        $geoproductUuids = [$geoProduct->metadata_uuid];
        $serviceUuids = $geoProduct->geoProductServices->pluck('metadata_uuid')->toArray();
        $fileUuids = $geoProduct->geoProductFiles->pluck('metadata_uuid')->toArray();
        $otherUuids = $geoProduct->geoProductOthers->pluck('metadata_uuid')->toArray();

        $uuids = array_merge($geoproductUuids, $serviceUuids, $fileUuids, $otherUuids);

        foreach ($uuids as $uuid) {
            $networkData = [
                'uuids' => $uuid,
            ];

            $this->geoNetworkAPI->call('/geonetwork/srv/api/records/unpublish', $networkData, 'PUT', [], ['add_in_params' => true, 'cookie_jar' => $jar]);
        }


        return $geoProduct;
    }

    public function checkGeoproductAccess($id): bool
    {
        $activeRoll = $this->geoProductOrderRepository->activeRole();

        if ($activeRoll->is_admin) {
            return true;
        }

        $geoproduct = $this->geoProductRepository->findById($id);

        if ($activeRoll->institution_classifier_id === $geoproduct->owner_institution_classifier_id) {
            return true;
        }

        throw new \Exception('validation.not_allowed_to_access');
    }

    public function validateUnpublish($geoProduct)
    {
        $services = $geoProduct->geoProductServices;
        $status = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'ACTIVE');
        $statusTwo = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'DRAFT');


        foreach ($services as $service) {
            $orders = $service->geoProductOrders->filter(fn($item) => $item->order_status_classifier_value_id === $status->id || $item->order_status_classifier_value_id === $statusTwo->id);

            if (!$orders->isEmpty()) {
                throw new ExceptionWithAttributes(json_encode(['error' => 'validation.product_is_used', 'attributes' => [
                    'ids' => 'Nr. ' . join(', Nr. ', $orders->pluck('id')->toArray())
                ]]), 412);
            }

            if ($service->is_public) {
                throw new \Exception('validation.public_data_distribution', 412);
            }
        }

        $files = $geoProduct->geoProductFiles;
        foreach ($files as $file) {
            $orders = $file->geoProductOrders->filter(fn($item) => $item->order_status_classifier_value_id === $status->id || $item->order_status_classifier_value_id === $statusTwo->id);

            if (!$orders->isEmpty()) {
                throw new ExceptionWithAttributes(json_encode(['error' => 'validation.product_is_used', 'attributes' => [
                    'ids' => 'Nr. ' . join(', Nr. ', $orders->pluck('id')->toArray())
                ]]), 412);
            }

            if ($file->is_public) {
                throw new \Exception('validation.public_data_distribution', 412);
            }
        }

        return true;
    }

    public function copyGeoproduct($id): Model
    {
        $geoProduct = $this->geoProductRepository->findById($id);

        $geoProduct = $geoProduct->replicate();

        $geoProduct->photo_attachment_id = null;
        $geoProduct->specification_attachment_id = null;
        $geoProduct->public_from = null;
        $geoProduct->public_to = null;
        $geoProduct->status = 'DRAFT';
        $geoProduct->name = $geoProduct->name . ' - KOPIJA';
        $geoProduct->save();

        $services = $this->geoProductServiceRepository->findBy('geo_product_id', $id, true);
        $filesData = $this->geoProductFileRepository->findBy('geo_product_id', $id, true);
        $others = $this->geoProductOtherRepository->findBy('geo_product_id', $id, true);
        $none = $this->geoProductNoneRepository->findBy('geo_product_id', $id, true);
        $tags = $this->geoProductTagRepository->findBy('geo_product_id', $id, true);

        foreach ($services as $service) {
            $newService = $service->replicate();
            $newService->geo_product_id = $geoProduct->id;
            $newService->licence_attachment_id = null;
            $newService->save();
        }

        foreach ($filesData as $file) {
            $newFile = $file->replicate();
            $newFile->geo_product_id = $geoProduct->id;
            $newFile->licence_attachment_id = null;
            $newFile->save();
        }

        foreach ($others as $other) {
            $newOther = $other->replicate();
            $newOther->geo_product_id = $geoProduct->id;
            $newOther->save();
        }

        foreach ($tags as $tag) {
            $newTag = $tag->replicate();
            $newTag->geo_product_id = $geoProduct->id;
            $newTag->save();
        }

        foreach ($none as $n) {
            $newNone = $n->replicate();
            $newNone->geo_product_id = $geoProduct->id;
            $newNone->save();
        }

        return $geoProduct;
    }

    public function deleteMultiple($ids): bool
    {
        $geoproducts = $this->geoProductRepository->deleteMultiple($ids);

        foreach ($geoproducts as $geoproduct) {
            if ($geoproduct->status !== GeoProductStatus::DRAFT) {
                throw new \Exception('validation.geo_product_is_not_draft', 403);
            }

            $geoproduct->delete();
        }

        return true;
    }

    public function getPublicGeoproducts($options)
    {
        return $this->geoProductRepository->getPublicGeoproducts($options);
    }


    public function getPublicGeoproduct($id)
    {
        $activeRole = $this->geoProductRepository->activeRole();
        $activeInstitutionType = $this->geoProductRepository->activeInstitutionType();

        $orders = $this->geoProductOrderRepository->getActiveGeoproductOrders($id, $activeRole->id ?? 0);

        $geoProduct = $this->geoProductRepository->getPublicGeoproduct($id);

        if (!$geoProduct) {
            throw new \Exception('validation.not_allowed_to_access');
        }

        $services = $this->geoProductServiceRepository->pubicServices($id)->toArray();
        $files = $this->geoProductFileRepository->pubicFiles($id)->toArray();
        $others = $this->geoProductOtherRepository->pubicOthers($id)->toArray();
        $none = $this->geoProductNoneRepository->pubicNone($id);

        $services = $this->parseAvailability($services, $activeRole, $activeInstitutionType, $orders);
        $files = $this->parseAvailability($files, $activeRole, $activeInstitutionType, $orders);


        $tags = $this->geoProductTagRepository->findBy('geo_product_id', $id, true);
        $services = $this->servicesLicenceAccepted($services, $activeRole);

        $services = $this->filteredServicesFromAlreadyOrdered($orders, $services);
        $files = $this->filteredFilesFromAlreadyOrdered($orders, $files);
        $files = $this->parseProccessingTypeFiles($files);

        $geoProduct->orderedAttachmentIds = $this->filesLicenceAccepted($files, $activeRole);
        $geoProduct->tags = $tags->pluck('name');
        $geoProduct->services = $services;
        $geoProduct->files = $files;
        $geoProduct->others = $others;
        $geoProduct->none = $none;

        if ($geoProduct->photo_attachment_id) {
            $attachment = $this->attachmentRepository->findById($geoProduct->photo_attachment_id);
            $geoProduct->photo = [$attachment->toArray()];
        }

        if ($geoProduct->specification_attachment_id) {
            $attachment = $this->attachmentRepository->findById($geoProduct->specification_attachment_id);
            $geoProduct->data_specification = [$attachment->toArray()];
        }

        if (isset($activeRole->id) || request()->cookie('cookie') === 'accepted') {
            event(new ProductViewEvent($geoProduct, $activeRole->id ?? null));
        }

        return $geoProduct;
    }

    public function parseAvailability($services, $activeRole, $activeInstitutionType, $orders)
    {
        foreach ($services as &$service) {
            $order = $orders->where('geo_product_service_id', $service['id'])->first();

            if ($order && $order->dpps_uuid) {
                $service['dpps_uuid'] = $order->dpps_uuid;
            }

            if ($service['available_restriction_type'] === 'BELONG_TO_GROUP') {
                $thematicGroupRelations = $this->thematicUserGroupRelationRepository->findBy('thematic_user_group_id', $service['thematic_user_group_id'], true) ?? [];
                $hasAccess = false;

                //check if has access
                foreach ($thematicGroupRelations as $relation) {
                    if (!$activeRole) {
                        continue;
                    }

                    if (!$relation->is_active) {
                        continue;
                    }

                    if ($relation->user_id) {
                        if ($activeRole->user_id === $relation->user_id && $activeRole->institution_classifier_id == $relation->institution_classifier_id) {
                            $hasAccess = true;
                        }

                        if (
                            $activeRole->user_id === $relation->user_id &&
                            $activeRole->is_physical_person &&
                            !isset($relation->institution_classifier_id) &&
                            !isset($activeRole->institution_classifier_id)
                        ) {
                            $hasAccess = true;
                        }
                    } else {
                        if ($activeRole->institution_classifier_id == $relation->institution_classifier_id) {
                            $hasAccess = true;
                        }
                    }
                }

                if (!$hasAccess) {
                    $service['is_disabled'] = true;
                    $service['service_link'] = null;
                    $service['attachments'] = [];
                } else {
                    $service['is_disabled'] = false;
                }
            } else if ($service['available_restriction_type'] === 'BY_BELONGING') {
                if (!$activeRole) {
                    $service['is_disabled'] = true;
                    $service['service_link'] = null;
                }
                if ($activeInstitutionType && !in_array($activeInstitutionType->id, $service['institution_type_classifier_ids'])) {
                    $service['is_disabled'] = true;
                    $service['service_link'] = null;
                }
            } else if ($service['available_restriction_type'] === 'NO_RESTRICTION') {
                $service['is_disabled'] = false;
            }

            if (isset($service['service_type_classifier_value_id'])) {
                $serviceType = $this->classifierValueRepository->findById($service['service_type_classifier_value_id']);
                if (isset($service['service_link']) && $service['service_link'] && $serviceType->value_code !== 'FEATURE_DOWNLOAD') {
                    if ($service['license_type'] === 'OPEN') {
                        $service['service_link'] = $service['dpps_link'] ?? null;
                    } else {
                        $service['service_link'] = $orders->where('geo_product_service_id', $service['id'])->first()->dpps_link ?? null;
                    }
                }
            }

            if (isset($service['dpps_link'])) {
                unset($service['dpps_link']);
            }
        }

        return $services;
    }

    public function checkServiceLink($serviceLink, $serviceTypeClassifierValueId): bool
    {
        $linkParams = explode('?', $serviceLink);
        $serviceType = $this->classifierValueRepository->findById($serviceTypeClassifierValueId);
        if (!isset($linkParams[1])) {
            if ($serviceType->value_code !== 'FEATURE_DOWNLOAD') {
                $type = '';
                switch ($serviceType->value_code) {
                    case 'WFS':
                        $type = 'WFS';
                        break;
                    case 'WMS':
                    case 'INSPIRE_VIEW':
                        $type = 'WMS';
                        break;
                }

                $serviceLink = $linkParams[0] . '?' . 'SERVICE=' . $type . '&REQUEST=GetCapabilities';
            }
        }

        $response = $this->makeRequest('GET', $serviceLink, []);

        //checks if error is in 400 or 500 range
        if (is_array($response)) {
            throw new \Exception('validation.geo_product_service_status_code', 412);
        }

        //checks if is valid xml
        try {
            simplexml_load_string($response);
        } catch (\Exception $e) {
            throw new \Exception('validation.geo_product_service_valid_xml', 412);
        }

        //check if contains exception
        if (str_contains($response, 'ExceptionReport>') || str_contains($response, 'ServiceException>')) {
            throw new \Exception('validation.geo_product_service_exception', 412);
        }

        $check = str_contains($serviceLink, env('APP_URL'));

        //check if finds title which means successfully response
        if (!$check && !str_contains($response, 'Title>') && $serviceType->value_code !== 'FEATURE_DOWNLOAD') {
            throw new \Exception('validation.geo_product_service_title', 412);
        }

        return true;
    }

    public function makeRequest($method, $url, $options): mixed
    {
        if (!isset($url)) {
            throw new \Exception('validation.url_not_present', 500);
        }

        $locale = [];
        if (env('APP_ENV') === 'local') {
            $locale = ['verify' => false];
        }

        $client = new Client($locale);

        try {
            $response = $client->request($method, $url, $options);

            return $response->getBody()->__toString();

        } catch (ClientException $e) {
            $errorResponse = json_decode($e->getResponse()->getBody(), true);

            Log::error($e->getMessage(), $e->getTrace());

            if (isset($errorResponse['error'])) {
                throw new \Exception($errorResponse['error'], $e->getCode());
            }

            if (!empty($errorResponse)) {
                return $errorResponse;
            }

            return ["error" => ["code" => $e->getCode(), "message" => "API call error"]];
        }
    }

    public function select()
    {
        return $this->geoProductRepository->select();
    }

    public function filteredServicesFromAlreadyOrdered($orders, $services)
    {
        $inactiveStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'INACTIVE');

        foreach ($services as &$service) {
            $service['already_ordered'] = false;

            foreach ($orders as $order) {
                if ($order->geo_product_service_id === $service['id'] && $order->order_status_classifier_value_id !== $inactiveStatus->id) {
                    $service['already_ordered'] = true;
                    break;
                }
            }
        }

        return $services;
    }

    public function filteredFilesFromAlreadyOrdered($orders, $files)
    {
        foreach ($files as &$file) {
            $file['already_ordered'] = false;

            foreach ($orders as $order) {
                if ($order->geo_product_file_id === $file['id']) {
                    $file['already_ordered'] = true;
                    break;
                }
            }
        }

        return $files;
    }

    public function servicesLicenceAccepted($services, $activeRole)
    {
        foreach ($services as &$service) {
            if (($service['payment_type'] === null || $service['payment_type'] === 'FREE') && $service['license_type'] === 'OPEN') {
                $service['servicesLicenceAccepted'] = true;
                continue;
            }

            if (!isset($activeRole)) {
                $service['servicesLicenceAccepted'] = false;
                continue;
            }

            $id = $service['id'];

            $service['licenceExpirationData'] = $this->geoProductOrderRepository->getDate($id);
            $order = $this->geoProductOrderRepository->getLicence($id, 'services');

            if (isset($order)) {
                $service['servicesLicenceAccepted'] = true;
            } else {
                $service['servicesLicenceAccepted'] = false;
            }
        }
        return $services;
    }

    public function filesLicenceAccepted($files, $activeRole)
    {
        $ids = [];
        foreach ($files as &$file) {
            if ($file['payment_type'] === 'FREE' || $file['payment_type'] === null) {
                continue;
            }

            if (!isset($activeRole)) {
                continue;
            }

            $id = $file['id'];

            $ids[] = $this->geoProductOrderRepository->getLicence($id);
        }

        $attachmentIds = collect($ids)->flatten()->pluck('attachment_id')->toArray();

        return $attachmentIds;
    }

    public function selectGeoProductsByUser()
    {
        return $this->geoProductRepository->selectGeoProductsByUser();
    }

    public function otherView($id)
    {
        return $this->geoProductOtherRepository->findById($id);
    }

    public function parseProccessingTypeFiles($files)
    {
        foreach ($files as &$file) {
            foreach ($file['attachments'] as $attachment) {
                if ($attachment['geo_product_files_ftp'] && $attachment['geo_product_files_ftp']['zip_id']) {
                    $file['attachments'] = array_values(collect($file['attachments'])->whereNull('geo_product_files_ftp.zip_id')->all());
                    break;
                }
            }
        }

        return $files;
    }

}
