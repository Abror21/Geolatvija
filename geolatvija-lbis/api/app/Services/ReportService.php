<?php

namespace App\Services;

use App\Enums\GeoProductPaymentType;
use App\Enums\LicenceTypes;
use App\Exports\ReportExport;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductOtherRepository;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Repositories\GeoProducts\GeoProductServiceRepository;
use App\Services\API\APIOuterAPI;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use function Symfony\Component\Translation\t;

class ReportService extends BaseService
{
    public function __construct(
        private readonly GeoProductRepository $geoProductRepository,
        private readonly GeoProductFileRepository $geoProductFileRepository,
        private readonly GeoProductServiceRepository $geoProductServiceRepository,
        private readonly GeoProductOtherRepository $geoProductOtherRepository,
        private readonly APIOuterAPI $APIOuterAPI,
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    /**
     * @param $options
     * @return array
     */
    public function report($options)
    {
        $select = $this->buildSelect($options);

        $queryData = $this->geoProductRepository->report($options, $select)->paginate($options['page_size'] ?? 10);

        $data = $this->mergeDppsData(collect($queryData->items()), $options);

        $response = $queryData->toArray();

        $response['data'] = collect($data)->toArray();

        return $response;
    }

    public function viewCount($options)
    {
        return $this->geoProductRepository->viewCount($options);
    }

    /**
     * @param $filter
     * @return array
     */
    public function export($filter): array
    {
        $filter = $this->camelToSnakeArrayKeys(json_decode($filter, true) ?? []);

        $select = $this->buildSelect(['filter' => $filter], true);

        $queryData = $this->geoProductRepository->report(['filter' => $filter], $select['select'])->get();

        $data = $this->mergeDppsData($queryData, ['filter' => $filter]);

        // Convert date string to correct timezone and readable string.
        foreach ($data as &$item) {
            if (isset($item['confirmed_date'])) {
                $item['confirmed_date'] = Carbon::parse($item['confirmed_date'])->timezone('Europe/Riga')->format('d.m.Y H:i');
            }

            if (isset($item['order_date'])) {
                $item['order_date'] = Carbon::parse($item['order_date'])->timezone('Europe/Riga')->format('d.m.Y H:i');
            }
        }

        $product = $this->geoProductRepository->findById($filter['product_id']);

        $fileName = $this->replaceSpecialSymbols($product->name) . '_' . Carbon::parse($filter['range']['start'])->format('d_m_Y') . '_-_' . Carbon::parse($filter['range']['end'])->format('d_m_Y');

        $fileName = $this->replaceInvalidFileNameCharacters($fileName);

        return [
            'file' => (new ReportExport($data, $select['header'])),
            'file_name' => $fileName . '.xlsx'
        ];
    }

    /**
     * @param $queryData
     * @param $options
     * @return array
     */
    private function mergeDppsData($queryData, $options): array
    {
        $ids = $queryData->pluck('dpps_name')->toArray();

        $from = Carbon::parse($options['filter']['range']['start'])->format('Y-m-d');
        $to = Carbon::parse($options['filter']['range']['end'])->format('Y-m-d');

        foreach ($queryData as $data) {
            if ($data['distribution_type'] != 'Cits' && isset($data['number_of_uses'])) {
                $data->number_of_uses = '0';
            }
        }

        foreach (array_filter(array_unique($ids)) as $apiName) {
            $requestData = [
                'from_period' => $from,
                'to_period' => $to,
                'api_name' => $apiName
            ];
            $dppsResponse = $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/monitor-access', $requestData, "POST", $this->headers);

            $dppsData = collect($dppsResponse['data']['api_usage']);

            foreach ($queryData as $data) {
                if ($targetLink = $data['dpps_uuid']) {
                    $index = $dppsData->search(function ($item) use ($targetLink) {
                        return $item['link'] === $targetLink;
                    });

                    $data->number_of_uses = $dppsData[$index]['usage'] . '';
                    $data->dpps_uuid = null;
                    $data->dpps_name = null;
                }
            }
        }

        return $queryData->toArray();
    }

    private function buildSelect($options, $export = false)
    {
        $files = $this->geoProductFileRepository->findBy('geo_product_id', $options['filter']['product_id'], true);

        $header = ['Licence', 'Izplatīšanas veids'];

        $columns = [
            'uuid' => !$export,
            'licence_type' => 0,
            'distribution_type' => true,
            'distribution_code' => true,
            'view_count' => 0,
            'number_of_uses' => 0,
            'download_count' => 0,
            'full_name' => 0,
            'organization' => 0,
            'order_date' => 0,
            'confirmed_date' => 0,
            'order_number' => 0,
            'files' => 0,
            'files_count' => 0,
            'payment_amount' => 0,
            'dpps_uuid' => 0,
            'dpps_name' => 0
        ];

        foreach ($files as $file) {
            $columns['licence_type'] = true;

            if ($file->license_type->value === LicenceTypes::OPEN->value) {
                $columns['download_count'] = true;
            }

            if ($file->license_type->value !== LicenceTypes::OPEN->value) {
                $columns['download_count'] = true;
                $columns['full_name'] = true;
                $columns['organization'] = true;
                $columns['order_date'] = true;
                $columns['order_number'] = true;
            }

            if (
                $file->license_type->value !== LicenceTypes::OPEN->value &&
                $file->payment_type->value === GeoProductPaymentType::FEE->value
            ) {
                $columns['download_count'] = true;
                $columns['files'] = true;
                $columns['files_count'] = true;
                $columns['payment_amount'] = true;
                $columns['confirmed_date'] = true;
            }

            if (
                $file->license_type->value !== LicenceTypes::OPEN->value &&
                $file->payment_type->value === GeoProductPaymentType::PREPAY->value
            ) {
                $columns['files'] = true;
                $columns['files_count'] = true;
                $columns['payment_amount'] = true;
                $columns['confirmed_date'] = true;
            }
        }

        $services = $this->geoProductServiceRepository->findBy('geo_product_id', $options['filter']['product_id'], true);

        foreach ($services as $service) {
            $columns['licence_type'] = true;

            if ($service->license_type->value === LicenceTypes::OPEN->value) {
                $columns['number_of_uses'] = true;
                $columns['dpps_uuid'] = true;
                $columns['dpps_name'] = true;
            }

            if ($service->license_type->value !== LicenceTypes::OPEN->value) {
                $columns['number_of_uses'] = true;
                $columns['full_name'] = true;
                $columns['organization'] = true;
                $columns['order_date'] = true;
                $columns['order_number'] = true;
                $columns['dpps_uuid'] = true;
                $columns['dpps_name'] = true;
            }

            if (
                $service->license_type->value !== LicenceTypes::OPEN->value &&
                $service->payment_type->value === GeoProductPaymentType::FEE->value
            ) {
                $columns['number_of_uses'] = true;
                $columns['payment_amount'] = true;
                $columns['dpps_uuid'] = true;
                $columns['dpps_name'] = true;
            }

            if (
                $service->license_type->value !== LicenceTypes::OPEN->value &&
                $service->payment_type->value === GeoProductPaymentType::PREPAY->value
            ) {
                $columns['number_of_uses'] = true;
                $columns['confirmed_date'] = true;
                $columns['payment_amount'] = true;
                $columns['dpps_uuid'] = true;
                $columns['dpps_name'] = true;
            }
        }

        $others = $this->geoProductOtherRepository->findBy('geo_product_id', $options['filter']['product_id'], true);
        foreach ($others as $other) {
            $columns['number_of_uses'] = true;
            $columns['distribution_code'] = false;
        }


        return $this->appendSelect($columns, $options, $header, $export);
    }

    /**
     * @param $columns
     * @param $options
     * @param array $header
     * @param bool $export
     * @return array
     */
    private function appendSelect($columns, $options, array $header = [], bool $export = false)
    {
        $select = [];

        foreach ($columns as $key => $column) {

            if (!$column) {
                continue;
            }

            switch ($key) {
                case 'uuid':
                    $select['files'][] = 'geo_product_orders.uuid as uuid';
                    $select['open_files'][] = 'geo_product_files.uuid as uuid';
                    $select['services'][] = 'geo_product_orders.uuid as uuid';
                    $select['open_services'][] = 'geo_product_services.uuid as uuid';
                    $select['open_others'][] = DB::raw("NULL AS uuid");
                    break;
                case 'licence_type':
                    $select['files'][] = DB::raw("CASE WHEN institution_licences.licence_type IS NULL THEN 'OTHER' ELSE institution_licences.licence_type END licence_type");
                    $select['open_files'][] = DB::raw("CASE WHEN institution_licences.licence_type IS NULL THEN 'OTHER' ELSE institution_licences.licence_type END licence_type");
                    $select['services'][] = DB::raw("CASE WHEN institution_licences.licence_type IS NULL THEN 'OTHER' ELSE institution_licences.licence_type END licence_type");
                    $select['open_services'][] = DB::raw("CASE WHEN institution_licences.licence_type IS NULL THEN 'OTHER' ELSE institution_licences.licence_type END licence_type");
                    $select['open_others'][] = DB::raw("NULL AS licence_type");
                    break;
                case 'distribution_type':
                    $select['files'][] = DB::raw("'Datne' AS distribution_type");
                    $select['open_files'][] = DB::raw("'Datne' AS distribution_type");
                    $select['services'][] = DB::raw("'Pakalpe' AS distribution_type");
                    $select['open_services'][] = DB::raw("'Pakalpe' AS distribution_type");
                    $select['open_others'][] = DB::raw("'Cits' AS distribution_type");
                    break;
                case 'distribution_code':
                    $select['files'][] = DB::raw("CASE WHEN geo_product_files.ftp_address IS NULL THEN 'Datne' ELSE 'FTP' END distribution_code");
                    $select['open_files'][] = DB::raw("CASE WHEN geo_product_files.ftp_address IS NULL THEN 'Datne' ELSE 'FTP' END distribution_code");
                    $select['services'][] = 'classifier_values.value_code as distribution_code';
                    $select['open_services'][] = 'classifier_values.value_code as distribution_code';
                    $select['open_others'][] = DB::raw("NULL AS distribution_code");
                    $header = $this->appendExportHeader($header, 'distribution_code');
                    break;
                case 'number_of_uses':
                    $from = Carbon::parse($options['filter']['range']['start'])->startOfDay();
                    $to = Carbon::parse($options['filter']['range']['end'])->endOfDay();

                    $select['files'][] = DB::raw("0 AS number_of_uses");
                    $select['open_files'][] = DB::raw("0 AS number_of_uses");
                    $select['services'][] = DB::raw("0 AS number_of_uses");
                    $select['open_services'][] = DB::raw("0 AS number_of_uses");
                    $select['open_others'][] = DB::raw("(SELECT COUNT(DISTINCT geo_product_events.id) FROM geo_product_events WHERE geo_product_events.event_subject_id = geo_product_others.id AND event_type = 'OTHER_VIEW' AND geo_product_events.created_at between '$from' AND '$to') AS number_of_uses");
                    $header = $this->appendExportHeader($header, 'number_of_uses');
                    break;
                case 'download_count':
                    $from = Carbon::parse($options['filter']['range']['start'])->startOfDay();
                    $to = Carbon::parse($options['filter']['range']['end'])->endOfDay();

                    $select['files'][] = DB::raw("(SELECT COUNT(DISTINCT geo_product_events.id) FROM geo_product_events WHERE geo_product_events.event_subject_id = geo_product_files.geo_product_id AND geo_product_events.event_initiator_id = roles.id AND geo_product_events.geo_product_order_id = geo_product_orders.id   AND event_type = 'DOWNLOAD') AS download_count");
                    $select['open_files'][] = DB::raw("(SELECT COUNT(DISTINCT geo_product_events.id) FROM geo_product_events WHERE geo_product_events.event_subject_id = geo_product_files.geo_product_id AND event_type = 'DOWNLOAD' AND geo_product_events.created_at between '$from' AND '$to') AS download_count");
                    $select['services'][] = DB::raw("0 AS download_count");
                    $select['open_services'][] = DB::raw("0 AS download_count");
                    $select['open_others'][] = DB::raw("0 AS download_count");
                    $header = $this->appendExportHeader($header, 'download_count');
                    break;
                case 'full_name':
                    $select['files'][] = DB::raw("CONCAT(users.name, ' ', users.surname) AS full_name");
                    $select['services'][] = DB::raw("CONCAT(users.name, ' ', users.surname) AS full_name");
                    $select['open_files'][] = DB::raw("NULL AS full_name");
                    $select['open_services'][] = DB::raw("NULL AS full_name");
                    $select['open_others'][] = DB::raw("NULL AS full_name");
                    $header = $this->appendExportHeader($header, 'full_name');
                    break;
                case 'organization':
                    $select['files'][] = 'institution_classifiers.name as organization';
                    $select['services'][] = 'institution_classifiers.name as organization';
                    $select['open_files'][] = DB::raw("NULL AS organization");
                    $select['open_services'][] = DB::raw("NULL AS organization");
                    $select['open_others'][] = DB::raw("NULL AS organization");
                    $header = $this->appendExportHeader($header, 'organization');
                    break;
                case 'order_date':
                    $select['files'][] = 'geo_product_orders.created_at as order_date';
                    $select['services'][] = 'geo_product_orders.created_at as order_date';
                    $select['open_files'][] = DB::raw("NULL AS order_date");
                    $select['open_services'][] = DB::raw("NULL AS order_date");
                    $select['open_others'][] = DB::raw("NULL AS order_date");
                    $header = $this->appendExportHeader($header, 'order_date');
                    break;
                case 'order_number':
                    $select['files'][] = 'geo_product_orders.id as order_number';
                    $select['services'][] = 'geo_product_orders.id as order_number';
                    $select['open_files'][] = DB::raw("NULL AS order_number");
                    $select['open_services'][] = DB::raw("NULL AS order_number");
                    $select['open_others'][] = DB::raw("NULL AS order_number");
                    $header = $this->appendExportHeader($header, 'order_number');
                    break;
                case 'confirmed_date':
                    $select['files'][] = 'geo_product_orders.confirmed_date';
                    $select['services'][] = 'geo_product_orders.confirmed_date';
                    $select['open_files'][] = DB::raw("NULL AS confirmed_date");
                    $select['open_services'][] = DB::raw("NULL AS confirmed_date");
                    $select['open_others'][] = DB::raw("NULL AS confirmed_date");
                    $header = $this->appendExportHeader($header, 'confirmed_date');
                    break;
                case 'files':
                    $select['files'][] = DB::raw("STRING_AGG(DISTINCT attachments.display_name, ', ') AS files");
                    $select['services'][] = DB::raw("NULL AS files");
                    $select['open_files'][] = DB::raw("NULL AS files");
                    $select['open_services'][] = DB::raw("NULL AS files");
                    $select['open_others'][] = DB::raw("NULL AS files");
                    $header = $this->appendExportHeader($header, 'files');
                    break;
                case 'files_count':
                    $select['files'][] = DB::raw("COUNT(DISTINCT geo_product_attachments.id) AS files_count");
                    $select['services'][] = DB::raw("NULL AS files_count");
                    $select['open_files'][] = DB::raw("NULL AS files_count");
                    $select['open_services'][] = DB::raw("NULL AS files_count");
                    $select['open_others'][] = DB::raw("NULL AS files_count");
                    $header = $this->appendExportHeader($header, 'files_count');
                    break;
                case 'payment_amount':
                    $select['files'][] = 'geo_product_orders.payment_amount';
                    $select['services'][] = 'geo_product_orders.payment_amount';
                    $select['open_files'][] = DB::raw("NULL AS payment_amount");
                    $select['open_services'][] = DB::raw("NULL AS payment_amount");
                    $select['open_others'][] = DB::raw("NULL AS payment_amount");
                    $header = $this->appendExportHeader($header, 'payment_amount');
                    break;
                case 'dpps_uuid':
                    $select['files'][] = DB::raw("NULL AS dpps_name");
                    $select['open_files'][] = 'geo_product_files.dpps_name';
                    $select['services'][] = DB::raw("geo_product_orders.dpps_uuid");
                    $select['open_services'][] = DB::raw("geo_product_services.dpps_uuid");
                    $select['open_others'][] = DB::raw("NULL AS dpps_uuid");
                    break;
                case 'dpps_name':
                    $select['files'][] = DB::raw("NULL AS dpps_name");
                    $select['open_files'][] = DB::raw("NULL AS dpps_name");
                    $select['services'][] = DB::raw("geo_product_services.dpps_name");
                    $select['open_services'][] = 'geo_product_services.dpps_name';
                    $select['open_others'][] = DB::raw("NULL AS dpps_name");
                    break;
            }
        }

        if ($export) {
            return [
                'select' => $select,
                'header' => $header
            ];
        }

        return $select;
    }

    private function appendExportHeader($header, $column)
    {
        if ($header) {
            switch ($column) {
                case 'number_of_uses':
                    $header[] = 'Lietošanas skaits';
                    break;
                case 'download_count':
                    $header[] = 'Lejupielādžu skaits';
                    break;
                case 'distribution_code':
                    $header[] = 'Izplatīšanas tips';
                    break;
                case 'full_name':
                    $header[] = 'Lietotājs';
                    break;
                case 'organization':
                    $header[] = 'Organizācija';
                    break;
                case 'order_date':
                    $header[] = 'Pasūtījuma datums';
                    break;
                case 'confirmed_date':
                    $header[] = 'Apmaksa';
                    break;
                case 'files':
                    $header[] = 'Datņu saraksts';
                    break;
                case 'files_count':
                    $header[] = 'Datņu skaits';
                    break;
                case 'payment_amount':
                    $header[] = 'Summa apmaksai';
                    break;
                case 'order_number':
                    $header[] = 'Pasūtīšanas numurs';
                    break;
            }
        }
        return $header;
    }
}
