<?php

namespace App\Services;

use App\Enums\GeoProductPaymentType;
use App\Enums\GeoProductServiceLimitationTypes;
use App\Enums\GeoProductStatus;
use App\Enums\MinioBucketTypes;
use App\Events\CreateOrderFile;
use App\Events\ProductDownloadEvent;
use App\Events\ProductViewEvent;
use App\Repositories\AttachmentRepository;
use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use App\Repositories\GeoProducts\GeoProductAttachmentsRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Repositories\GeoProducts\GeoProductServiceRepository;
use App\Repositories\InstitutionClassifierRepository;
use App\Repositories\InstitutionLicenceRepository;
use App\Repositories\ThematicUserGroupRelationRepository;
use App\Repositories\UserRepository;
use App\Services\API\APIOuterAPI;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\TemplateProcessor;
use ZanySoft\Zip\Zip;
use Illuminate\Support\Facades\File;
use Dompdf\Dompdf;
use Dompdf\Options;
use ZipArchive;

/**
 * Class GeoProductOrderService
 * @package App\Services
 */
class GeoProductOrderService extends BaseService
{
    public function __construct(
        private GeoProductOrderRepository $geoProductOrderRepository,
        private GeoProductServiceRepository $geoProductServiceRepository,
        private ClassifierValueRepository $classifierValueRepository,
        private APIOuterAPI $APIOuterAPI,
        private StorageService $storageService,
        private AttachmentRepository $attachmentRepository,
        private GeoProductFileRepository $geoProductFileRepository,
        private GeoProductAttachmentsRepository $geoProductAttachmentsRepository,
        private InstitutionLicenceRepository $institutionLicenceRepository,
        private UserRepository $userRepository,
        private GeoProductRepository $geoProductRepository,
        private ThematicUserGroupRelationRepository $thematicUserGroupRelationRepository,
        private InstitutionClassifierRepository $institutionClassifierRepository,
        private SystemSettingService $systemSettingService,
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    public function getGeoproductOrders($options)
    {
//        event(new CreateOrderFile(['asdgasdgsadgsad', 'dsagdfxx'], $activeRole->id ?? null));

        $orders = $this->geoProductOrderRepository->getGeoproductOrders($options);
        $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'ACTIVE');

        $inactiveStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'INACTIVE');

        foreach ($orders as &$order) {
            if ($order->order_status_classifier_value_id != $classifierValue->id) {
                $order->dpps_link = null;
                $order->geo_product_file_id = null;
            }

            if (isset($order->expire_at)) {
                $expireDate = Carbon::parse($order->expire_at);
                if (Carbon::now()->gt($expireDate)) {
                    if ($order->order_status_classifier_value_id !== $inactiveStatus->id) {
                        $order = $this->geoProductOrderRepository->update($order, ['order_status_classifier_value_id' => $inactiveStatus->id]);
                        $order->order_status_classifier = $inactiveStatus->translation;
                    }
                }
            }

            if (isset($order->payment_status) && $order->payment_status === 'P') {
                $order = $this->geoProductOrderRepository->update($order, ['payment_request_status' => 'R']);
            }

            if ($order->getOriginal('geo_product_file_id') !== null && isset($order->product_file_attachment_id) && isset($order->files_availability) && $order->files_availability->isPast()) {
                $attachmentId = $order->product_file_attachment_id;
                $this->geoProductOrderRepository->update($order, ['product_file_attachment_id' => null, 'order_status_classifier_value_id' => $inactiveStatus->id]);
                $this->storageService->deleteFile($attachmentId);
            }
        }

        $updatedOrders = $this->geoProductOrderRepository->getGeoproductOrders($options);

        foreach ($updatedOrders as &$updatedOrder) {
            if (isset($updatedOrder->period_classifier_value_id)) {
                $periodClassifier = $this->classifierValueRepository->findById($updatedOrder->period_classifier_value_id);

                $timestamp = Carbon::now();

                switch ($periodClassifier->value_code) {
                    case "DAY":
                        $timestamp->addDays($updatedOrder->period_number_value);
                        break;
                    case "WEEK":
                        $timestamp->addWeeks($updatedOrder->period_number_value);
                        break;
                    case "MONTH":
                        $timestamp->addMonths($updatedOrder->period_number_value);
                        break;
                    case "YEAR":
                        $timestamp->addYears($updatedOrder->period_number_value);
                        break;
                    default:
                        $timestamp = null;
                }

                $updatedOrder->period = $timestamp;
            } else {
                $updatedOrder->period = null;
            }
        }

        return $updatedOrders;
    }

    public function getGeoproductOrder($id)
    {
        return $this->geoProductOrderRepository->findById($id);
    }

    public function order($data, $id): Model
    {
        $existingOrder = null;
        if ($id) {
            $existingOrder = $this->geoProductOrderRepository->findById($id);
        }

        $inactiveStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'INACTIVE');

        $activeRole = $this->classifierValueRepository->activeRole();
        $activeInstitutionType = $this->geoProductRepository->activeInstitutionType();

        $data['role_id'] = $activeRole->id;

        $paymentType = null;
        $paymentDetails = [];

        $service = null;
        $file = null;

        $order = null;

        DB::beginTransaction();

        if (isset($data['geo_product_service_id'])) {
            $service = $this->geoProductServiceRepository->findById($data['geo_product_service_id']);
            $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', $service->payment_type->value === 'FREE' && $data['ordering'] ? 'ACTIVE' : 'DRAFT');
            $data['order_status_classifier_value_id'] = $classifierValue->id;
            $paymentType = $service->payment_type;
            $paymentDetails = [
                'service_step' => $service->service_step,
                'position' => $service->position,
            ];

            $data['geo_product_id'] = $service->geo_product_id;
            $data['payment_amount'] = $service->fee_cost;

            foreach ($service->service_limitation_type as $limitation) {
                if ($limitation === GeoProductServiceLimitationTypes::PERIOD->value) {
                    $classifierPeriodValue = $this->classifierValueRepository->findById($service->period_classifier_value_id);

                    $data['expire_at'] = Carbon::now()->copy()->add($classifierPeriodValue->value_code, $data['period_number_value']);
                    break;
                }
            }

            $canAccess = $this->canAccess($service, $activeRole, $activeInstitutionType);

            if (!$canAccess) {
                $order->order_status_classifier_value_id = $inactiveStatus->id;
                throw new \Exception('validation.geo_product_order_has_no_access');
            }
        }

        //dpps integration
        if (isset($data['geo_product_service_id']) && $data['ordering']) {
            $service = $this->geoProductServiceRepository->findById($data['geo_product_service_id']);
            $paymentType = $service->payment_type;
            $paymentDetails = [
                'service_step' => $service->service_step,
                'position' => $service->position,
            ];

            $validityPeriod = isset($data['expire_at']) && isset($data['payment_amount']) ? Carbon::now()->diffInSeconds(Carbon::parse($data['expire_at'])) : "-1";

            $accessParsed = [
                'access_name' => $service->dpps_name . '_service_open_' . request()->user()->id . '_' . Str::random(6),
                'api_name' => $service->dpps_name,
                'validity_period' => "$validityPeriod",
                'user_id' => (string)request()->user()->id,
            ];

            if (in_array(GeoProductServiceLimitationTypes::ONLY_GEOPORTAL->value, $data['service_limitation_type'])) {
                $accessParsed['ip_addresses'] = env('ONLY_GEO_PORTAL_LIMITATION_ADDRESS');
            } else if (isset($data['ip_limitation'])) {
                $accessParsed['ip_addresses'] = $data['ip_limitation'];
            }

            $access = $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/create-access', $accessParsed, 'POST', $this->headers);

            $data['dpps_link'] = $access['data']['Access_URL'];
            $uuidData = explode('/', $access['data']['Access_URL']);
            $data['dpps_uuid'] = end($uuidData);
        }

        if (isset($data['geo_product_file_id'])) {
            $file = $this->geoProductFileRepository->findById($data['geo_product_file_id'], ['attachments']);

            $checkedAttachmentDisplayNames = [];
            foreach ($data['checked_files'] as $checkedFileId) {
                $checkedAttachmentDisplayNames[] = $this->attachmentRepository->findBy('uuid', $checkedFileId)->display_name;
            }

            $data['attachments_display_names'] = $checkedAttachmentDisplayNames;

            $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', $file->payment_type->value === 'FREE' && $data['ordering'] ? 'ACTIVE' : 'DRAFT');
            $data['order_status_classifier_value_id'] = $classifierValue->id;
            $paymentType = $file->payment_type;
            $paymentDetails = [
                'service_step' => $file->service_step,
                'position' => $file->position,
            ];

            $canAccess = $this->canAccess($file, $activeRole, $activeInstitutionType);

            if (!$canAccess) {
                $order->order_status_classifier_value_id = $inactiveStatus->id;
                throw new \Exception('validation.geo_product_order_has_no_access');
            }

            $data['geo_product_id'] = $file->geo_product_id;
            if ($file->price_for) {
                $data['payment_amount'] = $file->price_for->value === 'SINGLE' ? count($data['checked_files']) * $file->fee_cost : $file->fee_cost;
            }
         }

        if (isset($existingOrder) && $existingOrder->order_status_classifier_value_id !== $inactiveStatus->id) {
            $order = $this->geoProductOrderRepository->update($existingOrder, $data);
        } else {
            $order = $this->geoProductOrderRepository->store($data);
        }

        if (($file && $file->institution_licence_id) || ($service && $service->institution_licence_id)) {
            $institutionLicenceId = $file ? $file->institution_licence_id : $service->institution_licence_id;

            $type = '';

            if ($file) {
                $type = 'Datne';
            } else if ($service) {
                $type = 'Pakalpe';
            }

            $order->accepted_licence_attachment_id = $this->createLicense($institutionLicenceId, $order, $activeRole, $type);
            $order->save();
        }

        if ($paymentType->value === GeoProductPaymentType::PREPAY->value && $data['ordering']) {
            $paymentDetails['response_url'] = $data['response_url'] . '&orderId=' . $order->id . '&paymentRequestId=';

            $user = $this->userRepository->findById($activeRole->user_id);

            $clientInfo = [
                "ClientCode" => $user->personal_code,
                "ClientFirstName" => $user->name,
                "ClientName" => $user->surname,
            ];

            $paymentDetails['client_info'] = $clientInfo;
            $paymentDetails['item'] = $order->payment_amount;
            $paymentDetails['order'] = $order->toArray();

            $payment = $this->APIOuterAPI->call('api/v1/vraa/savePayment', $paymentDetails, 'POST', $this->headers);

            $order = $this->geoProductOrderRepository->update($order, [
                'payment_request_status' => 'P',
                'order_status_classifier_value_id' => $inactiveStatus->id
            ]);

            if ($payment['success']) {
                $order->payment_request_id = $payment['SavePaymentRequestResult']['PaymentRequestId'];
                $order->payment_request_url = $payment['SavePaymentRequestResult']['PaymentRequestUrl'];
                $order->save();
            }
        } else if ($data['ordering']) {
            $activeStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'ACTIVE');

            if ($activeStatus) {
                if (isset($data['geo_product_file_id']) && (
                        $paymentType->value === GeoProductPaymentType::FEE->value ||
                        $paymentType->value === GeoProductPaymentType::FREE->value
                    )) {
                    $divFileAvailabilityTime = $this->systemSettingService->getDivFileDownloadAvailabilityDuration();
                    $order->files_availability = Carbon::now()->addSeconds($divFileAvailabilityTime->value);
                }

                $order->order_status_classifier_value_id = $activeStatus->getKey();
                $order->confirmed_date = Carbon::now();
                $order->save();
            }
        }

        if (isset($data['geo_product_file_id']) && $data['geo_product_file_id'] && $data['checked_files']) {
            event(new CreateOrderFile($data['checked_files'], $order->id));
        }

        DB::commit();

        return $order;
    }

    public function canAccess($service, $activeRole, $activeInstitutionType): bool
    {
        if (
            $service->license_type->value === 'OTHER' ||
            $service->license_type->value === 'PREDEFINED'
        ) {
            if ($service->available_restriction_type->value === 'NO_RESTRICTION') {
                return true;
            } else if ($service->available_restriction_type->value === 'BY_BELONGING') {
                if ($activeInstitutionType || in_array($activeInstitutionType->id, $service['institution_type_classifier_ids'])) {
                    return true;
                }
            } else if ($service->available_restriction_type->value === 'BELONG_TO_GROUP') {
                $thematicGroupRelations = $this->thematicUserGroupRelationRepository->findBy('thematic_user_group_id', $service['thematic_user_group_id'], true) ?? [];

                foreach ($thematicGroupRelations as $relation) {
                    if (!$activeRole) {
                        continue;
                    }

                    if (!$relation->is_active) {
                        continue;
                    }

                    if ($relation->user_id) {
                        if ($activeRole->user_id === $relation->user_id && $activeRole->institution_classifier_id == $relation->institution_classifier_id) {
                            return true;
                        }

                        if (
                            $activeRole->user_id === $relation->user_id &&
                            $activeRole->is_physical_person &&
                            !isset($relation->institution_classifier_id) &&
                            !isset($activeRole->institution_classifier_id)
                        ) {
                            return true;
                        }
                    } else if ($activeRole->institution_classifier_id == $relation->institution_classifier_id) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public function download($id)
    {
        $order = $this->geoProductOrderRepository->findById($id, ['role']);

        if (isset($order->geo_product_file_id) && isset($order->files_availability) && $order->files_availability->isPast()) {
            throw new \Exception('validation.order_file_download_expired');
        }

        $activeRole = $this->geoProductOrderRepository->activeRole();

        if ($activeRole->user_id != $order->role->user_id) {
            throw new \Exception('validation.order_doesnt_belong_to_role');
        }

        $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'ACTIVE');

        if ($order->order_status_classifier_value_id != $classifierValue->id) {
            throw new \Exception('validation.order_not_active');
        }

        $file = $this->storageService->getFile($order->product_file_attachment_id);

        event(new ProductDownloadEvent($order, $activeRole->id, $order->id));

        return $file;
    }

    /**
     * @param $id
     * @param $order
     * @param $activeRole
     * @param $type
     * @return mixed|void
     * @throws \PhpOffice\PhpWord\Exception\CopyFileException
     * @throws \PhpOffice\PhpWord\Exception\CreateTemporaryFileException
     */
    public function createLicense($id, $order, $activeRole, $type)
    {
        $license = $this->institutionLicenceRepository->findById($id);

        if ($license->attachment_id) {

            $file = $this->attachmentRepository->findById($license->attachment_id);

            $localFilePath = $file->display_name;

            Storage::disk('local')->put($localFilePath, Storage::disk($file->bucket)->get($file->filename));

            $path = Storage::disk('local')->path($localFilePath);

            $templateProcessor = new TemplateProcessor($path);

            $user = $this->userRepository->findById($activeRole->user_id);

            $geoProduct = $this->geoProductRepository->findById($order->geo_product_id);

            $fileName = $user->name . '_' . $user->surname . '_' . $order->id . '_' . Carbon::now()->format('d-m-Y');

            if ($activeRole->institution_classifier_id) {
                $organization = $this->institutionClassifierRepository->findById($activeRole->institution_classifier_id);
            }

            $templateProcessor->setValues(
                [
                    'vards' => $user->name,
                    'uzvards' => $user->surname,
                    'personas_kods' => $user->personal_code,
                    'registracijas_numurs' => $organization->reg_nr ?? null,
                    'geoprodukta_nosaukums' => $geoProduct->name,
                    'datu_izplatisanas_veids' => $type
                ]
            );

            $filePath = storage_path('app/' . $fileName . '.docx');

            $templateProcessor->saveAs($filePath);

            $pdfPath = $this->convertDocxToPdf($filePath, $fileName);

            $pdfAttachment = $this->storageService->moveLocalFile(MinioBucketTypes::OrderLicense, $pdfPath, '.pdf');

            // delete temp files
            Storage::disk('local')->delete($fileName . '.docx');
            Storage::disk('local')->delete($fileName . '.pdf');
            Storage::disk('local')->delete($fileName . '.html');
            Storage::disk('local')->delete($localFilePath);

            return $pdfAttachment->id;
        }
    }

    /**
     * @param $filePath
     * @param $fileName
     * @return string
     */
    public function convertDocxToPdf($filePath, $fileName): string
    {
        $phpWord = IOFactory::load($filePath);

        $htmlFilePath = storage_path('app/' . $fileName . '.html');
        $phpWord->save($htmlFilePath, 'HTML');

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');
        $dompdf = new Dompdf($options);

        $html = file_get_contents($htmlFilePath);
        $dompdf->loadHtml($html);

        $dompdf->setPaper('A4');

        $dompdf->render();

        $pdfFileName = $fileName . '.pdf';

        $pdfFilePath = storage_path('app/' . $pdfFileName);
        file_put_contents($pdfFilePath, $dompdf->output());

        return $pdfFileName;
    }

    /**
     * @param $id
     * @return array|void
     */
    public function status($id)
    {
        if ($id === ':id') { // fix problems with fronted and can remove
            return;
        }
        $order = $this->geoProductOrderRepository->findById($id);

        if ($order) {
            $paymentDetails = [
                'paymentRequestId' => $order->payment_request_id,
            ];
            $payment = $this->APIOuterAPI->call('api/v1/vraa/checkStatus', $paymentDetails, 'POST', $this->headers);

            $order->payment_status = $payment;
            $order->payment_request_status = $payment['CheckPaymentRequestStatusResult'];

//        (P = Procesā, E = Izpildīts, R = ExpireDate, O = Other, iespējams tikai ja apmaksas nodrošinātājs atgriež)
            switch ($payment['CheckPaymentRequestStatusResult']) {
                case 'E':
                    if (isset($order->geo_product_file_id)) {
                        $divFileAvailabilityTime = $this->systemSettingService->getDivFileDownloadAvailabilityDuration();
                        $order->files_availability = Carbon::now()->addSeconds($divFileAvailabilityTime->value);
                    }

                    $order->confirmed_date = Carbon::now();
                    $order->order_status_classifier_value_id = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'ACTIVE')->id;
                    break;
                case 'R':
                    $order->order_status_classifier_value_id = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'INACTIVE')->id;
                    break;
                default:
                    break;
            }

            $order->save();

            return $this->snakeToCamelArrayKeys($order->toArray());
        }
    }

    public function updateGeoProductOrderStatus($id, $data): Model
    {
        $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', $data['geo_product_status']);

        return $this->geoProductOrderRepository->update($id, ['order_status_classifier_value_id' => $classifierValue->id]);
    }

    public function statusUpdate($id, $status)
    {
        if (!$order = $this->geoProductOrderRepository->getHolderOrder($id)) {
            throw new \Exception('validation.geo_product_order_has_no_access');
        }

        $actualStatus = $this->classifierValueRepository->findById($order->order_status_classifier_value_id);

        switch ($actualStatus->value_code) {
            case 'DRAFT':
                if ($status === 'CANCELLED' && $order->payment_request_status === 'R') {
                    $this->changeOrderStatus($order, $status);
                }

                if ($status === 'CANCELLED' && !$order->payment_request_id) {
                    $this->changeOrderStatus($order, $status);
                }
                break;
            case 'ONHOLD':
                if ($status === 'ACTIVE') {
                    $this->changeOrderStatus($order, $status);
                }
                break;
            case 'ACTIVE':
                if (in_array($status, ['CANCELLED'])) {
                    $this->changeOrderStatus($order, $status);
                }

                if ($status === 'ONHOLD') {
                    $this->changeOrderStatus($order, $status);
                }
                break;
        }

        return $order;
    }

    public function changeOrderStatus($order, $status)
    {
        $order->order_status_classifier_value_id = $this->classifierValueRepository->getClassifierValueByCodes('KL19', $status)->id;
        $order->save();
    }
}
