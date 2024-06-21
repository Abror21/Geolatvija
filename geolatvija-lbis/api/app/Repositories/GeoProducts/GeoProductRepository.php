<?php


namespace App\Repositories\GeoProducts;

use App\Enums\GeoProductStatus;
use App\Enums\LicenceTypes;
use App\Models\GeoProductOrder;
use App\Models\GeoProducts\GeoProduct;
use App\Models\GeoProducts\GeoProductFile;
use App\Models\GeoProducts\GeoProductOther;
use App\Models\GeoProducts\GeoProductService;
use App\Repositories\BaseRepository;
use App\Repositories\ClassifierValueRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class GeoProductRepository extends BaseRepository
{

    /**
     * @param GeoProduct $geoProduct
     * @param ClassifierValueRepository $classifierValueRepository
     */
    public function __construct(GeoProduct $geoProduct, private ClassifierValueRepository $classifierValueRepository)
    {
        parent::__construct($geoProduct);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProduct();
    }

    public function getGeoproducts($options)
    {
        $role = $this->activeRole();

        $inspiredClassifiers = [];
        if (isset($options['filter']['is_inspired']) && $options['filter']['is_inspired']) {
            $inspiredClassifiers[] = $this->classifierValueRepository->getClassifierValueByCodes('KL9', 'INSPIRE_VIEW')->id;
            $inspiredClassifiers[] = $this->classifierValueRepository->getClassifierValueByCodes('KL9', 'FEATURE_DOWNLOAD')->id;
        }


        return GeoProduct::select([
            'geo_products.id',
            'geo_products.name',
            'geo_products.status',
            'geo_products.public_from',
            'geo_products.public_to',
        ])
            ->leftJoin('geo_product_services', 'geo_product_services.geo_product_id', '=', 'geo_products.id')
            ->withCount(['geoProductOthers', 'geoProductNones', 'geoProductServices', 'geoProductFiles'])
            ->when(true, function ($query) use ($options) {
                if (isset($options['sort_by'])) {
                    return $query->orderBy($this->parseOrderBy($options['sort_by']), $options['order_by'] ?? 'ASC');
                }

                return $query->orderBy($this->parseOrderBy('geo_products.id'), $options['order_by'] ?? 'ASC');
            })
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->when(isset($options['filter']['is_inspired']) && $options['filter']['is_inspired'], function ($query) use ($inspiredClassifiers) {
                return $query->whereHas('geoProductServices', function ($q) use ($inspiredClassifiers) {
                    $q->whereIn('geo_product_services.service_type_classifier_value_id', $inspiredClassifiers);
                });
            })
            ->when(isset($options['filter']['owner_institution_classifier_id']) && $options['filter']['owner_institution_classifier_id'], function ($query) use ($options) {
                return $query->whereIn('geo_products.owner_institution_classifier_id', $options['filter']['owner_institution_classifier_id']);
            })
            ->when(isset($options['filter']['name']) && $options['filter']['name'], function ($query) use ($options) {
                return $query->where('geo_products.name', 'ILIKE', '%' . $options['filter']['name'] . '%');
            })
            ->when(isset($options['filter']['div']) && $options['filter']['div'], function ($query) use ($options) {
                if (in_array('service', $options['filter']['div'])) {
                    return $query->whereHas('geoProductServices');
                }

                if (in_array('file', $options['filter']['div'])) {
                    return $query->whereHas('geoProductFiles');
                }

                if (in_array('other', $options['filter']['div'])) {
                    return $query->whereHas('geoProductOthers');
                }

                if (in_array('none', $options['filter']['div'])) {
                    return $query->whereHas('geoProductNones');
                }
            })
            ->groupBy(['geo_products.id', 'geo_products.name', 'geo_products.status', 'geo_products.public_from', 'geo_products.public_to'])
            ->paginate($options['pageSize'] ?? 10);
    }

    public function getGeoproductReport()
    {
        return GeoProduct::select([
            'geo_products.name',
            'geo_product_services.id as service_id',
            'geo_product_services.service_type_classifier_value_id',
            'geo_product_files.id as file_id',
            'geo_product_files.file_method_classifier_value_id'
        ])
            ->leftJoin('geo_product_services', 'geo_product_services.geo_product_id', '=', 'geo_products.id')
            ->leftJoin('geo_product_files', 'geo_product_files.geo_product_id', '=', 'geo_products.id')
            ->where(function ($q) {
                $q->whereNotNull('geo_product_services.id')->orWhereNotNull('geo_product_files.id');
            })
            ->paginate($options['pageSize'] ?? 10);
    }

    public function deleteMultiple($ids)
    {
        return GeoProduct::select(['geo_products.*'])
            ->whereIn('geo_products.id', $ids)
            ->get();
    }

    public function getPublicGeoproducts($options)
    {
        $filterSettings = [
            'search' => 'like:geo_products.name',
            'institution_name' => 'like:institution_classifiers.name',
        ];

        $inspireFilter = $options['filter']['inspire'] ?? false;

        $query = GeoProduct::select(['geo_products.id', 'geo_products.name'])
            ->search($filterSettings, $options['filter'])
            ->join('institution_classifiers', 'institution_classifiers.id', '=', 'geo_products.owner_institution_classifier_id')
            ->where('geo_products.status', GeoProductStatus::PUBLIC);

        if ($inspireFilter) {
            $query->where('is_inspired', '=', $inspireFilter);
        }

        return $query->paginate($options['pageSize'] ?? 10);
    }

    public function getPublicGeoproduct($id)
    {
        $role = $this->activeRole();

        return GeoProduct::select([
            'geo_products.id',
            'geo_products.name',
            'geo_products.description',
            'geo_products.photo_attachment_id',
            'geo_products.specification_attachment_id',
            'geo_products.organization_name',
            'geo_products.email',
            'geo_products.metadata_uuid',
        ])
            ->classifierValue('regularity_renewal_classifier_value_id')
            ->classifierValue('coordinate_system_classifier_value_id')
            ->where('geo_products.status', GeoProductStatus::PUBLIC)
            ->where('geo_products.id', $id)
            ->first();
    }

    public function select()
    {
        $role = $this->activeRole();

        return GeoProduct::select([
            'geo_products.id',
            'geo_products.name',
        ])
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->orderBy('geo_products.name', 'asc')
            ->get();
    }

    public function viewCount($options)
    {
        return GeoProduct::select([
            'geo_products.id',
            'geo_products.name',
        ])
            ->where('geo_products.id', $options['productId'])
            ->withCount(['views' => function ($q) use ($options) {
                $q->when(!empty($options['range']), function ($q) use ($options) {
                    $q->whereBetween('geo_product_events.created_at', [Carbon::parse($options['range']['start'])->startOfDay(), Carbon::parse($options['range']['end'])->endOfDay()]);
                });
            }])
            ->first();
    }

    public function unacceptableStatus()
    {
        return GeoProduct::where(function ($query) {
            $query->where('status', GeoProductStatus::PLANNED)->where('public_from', '<', Carbon::now())->whereNotNull('public_from');
        })->orWhere(function ($query) {
            $query->where('status', GeoProductStatus::PUBLIC)->where('public_to', '<', Carbon::now())->whereNotNull('public_to');
        })
            ->get();
    }

    /**
     * @param $options
     * @param $select
     * @return Builder
     * @throws \Exception
     */
    public function report($options, $select): Builder
    {
        $inactiveStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'INACTIVE');
        $activeStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'ACTIVE');

        $services = GeoProductOrder::select($select['services'])
            ->join('geo_product_services', 'geo_product_services.id', 'geo_product_orders.geo_product_service_id')
            ->join('geo_products', 'geo_products.id', 'geo_product_orders.geo_product_id')
            ->leftJoin('institution_licences', 'institution_licences.id', 'geo_product_services.institution_licence_id')
            ->join('classifier_values', 'geo_product_services.service_type_classifier_value_id', 'classifier_values.id')
            ->leftJoin('roles', 'roles.id', 'geo_product_orders.role_id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', 'roles.institution_classifier_id')
            ->leftJoin('geo_product_attachments', 'geo_product_attachments.order_id', 'geo_product_orders.id')
            ->leftJoin('attachments', 'attachments.id', 'geo_product_attachments.attachment_id')
            ->leftJoin('users', 'users.id', 'roles.user_id')
            ->leftJoin('geo_product_events', function ($join) use ($options) {
                $join->on('geo_product_events.event_subject_id', 'geo_product_orders.geo_product_id')
                    ->on('geo_product_events.event_initiator_id', 'users.id')
                    ->when(!empty($options['filter']['range']), function ($query) use ($options) {
                        $query->whereBetween('geo_product_events.created_at', [Carbon::parse($options['filter']['range']['start'])->startOfDay(), Carbon::parse($options['filter']['range']['end'])->endOfDay()]);
                    })
                    ->where('geo_product_events.event_subject_type', 'App\\Events\\ProductViewEvent');
            })
            ->whereNot('geo_product_services.license_type', LicenceTypes::OPEN)
            ->when(!empty($options['filter']['ids']), function ($query) use ($options) {
                $query->whereIn('geo_product_orders.uuid', $options['filter']['ids']);
            })
            ->when(!empty($options['filter']['users']), function ($query) use ($options) {
                $query->whereIn('roles.user_id', $options['filter']['users']);
            })
            ->when(!empty($options['filter']['organization']), function ($query) use ($options) {
                $query->whereIn('roles.institution_classifier_id', $options['filter']['organization']);
            })
            ->whereIn('geo_product_orders.order_status_classifier_value_id', [$inactiveStatus->id, $activeStatus->id])
            ->orderBy('geo_product_orders.id', 'DESC')
            ->groupBy(['geo_product_orders.id', 'users.name', 'users.surname', 'institution_licences.licence_type', 'institution_classifiers.name', 'classifier_values.value_code', 'geo_product_services.dpps_name', 'geo_product_services.geo_product_id']);

        $services = $this->reportFilter($services, $options);

        $files = GeoProductOrder::select($select['files'])
            ->join('geo_product_files', 'geo_product_files.id', 'geo_product_orders.geo_product_file_id')
            ->join('geo_products', 'geo_products.id', 'geo_product_orders.geo_product_id')
            ->leftJoin('institution_licences', 'institution_licences.id', 'geo_product_files.institution_licence_id')
            ->join('classifier_values', 'geo_product_files.file_method_classifier_value_id', 'classifier_values.id')
            ->leftJoin('roles', 'roles.id', 'geo_product_orders.role_id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', 'roles.institution_classifier_id')
            ->leftJoin('geo_product_attachments', 'geo_product_attachments.order_id', 'geo_product_orders.id')
            ->leftJoin('attachments', 'attachments.id', 'geo_product_attachments.attachment_id')
            ->leftJoin('users', 'users.id', 'roles.user_id')
            ->leftJoin('geo_product_events', function ($join) use ($options) {
                $join->on('geo_product_events.event_subject_id', 'geo_product_orders.geo_product_id')
                    ->on('geo_product_events.event_initiator_id', 'users.id')
                    ->whereIn('geo_product_events.event_subject_type', [
                        'App\\Events\\ProductViewEvent',
                        'App\\Events\\ProductDownloadEvent'
                    ]);
            })
            ->whereNot('geo_product_files.license_type', LicenceTypes::OPEN)
            ->when(!empty($options['filter']['ids']), function ($query) use ($options) {
                $query->whereIn('geo_product_orders.uuid', $options['filter']['ids']);
            })
            ->when(!empty($options['filter']['users']), function ($query) use ($options) {
                $query->whereIn('roles.user_id', $options['filter']['users']);
            })
            ->when(!empty($options['filter']['organization']), function ($query) use ($options) {
                $query->whereIn('roles.institution_classifier_id', $options['filter']['organization']);
            })
            ->when(!empty($options['filter']['range']), function ($query) use ($options) {
                $query->whereBetween('geo_product_orders.created_at', [Carbon::parse($options['filter']['range']['start'])->startOfDay(), Carbon::parse($options['filter']['range']['end'])->endOfDay()]);
            })
            ->whereIn('geo_product_orders.order_status_classifier_value_id', [$inactiveStatus->id, $activeStatus->id])
            ->orderBy('geo_product_orders.id', 'DESC')
            ->groupBy(['geo_product_orders.id', 'users.name', 'users.surname', 'institution_licences.licence_type', 'institution_classifiers.name', 'geo_product_files.ftp_address', 'geo_product_files.dpps_name', 'geo_product_files.geo_product_id', 'roles.id']);

        $files = $this->reportFilter($files, $options);

        $openServices = GeoProductService::select($select['open_services'])
            ->join('geo_products', 'geo_products.id', 'geo_product_services.geo_product_id')
            ->leftJoin('institution_licences', 'institution_licences.id', 'geo_product_services.institution_licence_id')
            ->join('classifier_values', 'geo_product_services.service_type_classifier_value_id', 'classifier_values.id')
            ->leftJoin('geo_product_events', function ($join) use ($options) {
                $join->on('geo_product_events.event_subject_id', 'geo_products.id')
                    ->when(!empty($options['filter']['range']), function ($query) use ($options) {
                        $query->whereBetween('geo_product_events.created_at', [Carbon::parse($options['filter']['range']['start'])->startOfDay(), Carbon::parse($options['filter']['range']['end'])->endOfDay()]);
                    })
                    ->where('geo_product_events.event_subject_type', 'App\\Events\\ProductViewEvent');
            })
            ->where('geo_product_services.license_type', LicenceTypes::OPEN)
            ->when(!empty($options['filter']['ids']), function ($query) use ($options) {
                $query->whereIn('geo_product_services.uuid', $options['filter']['ids']);
            })
            ->groupBy(['geo_product_services.id', 'institution_licences.licence_type', 'classifier_values.value_code', 'geo_product_services.dpps_name']);

        $openServices = $this->reportFilter($openServices, $options);

        $openFiles = GeoProductFile::select($select['open_files'])
            ->join('geo_products', 'geo_products.id', 'geo_product_files.geo_product_id')
            ->leftJoin('institution_licences', 'institution_licences.id', 'geo_product_files.institution_licence_id')
            ->join('classifier_values', 'geo_product_files.file_method_classifier_value_id', 'classifier_values.id')
            ->leftJoin('geo_product_events', function ($join) use ($options) {
                $join->on('geo_product_events.event_subject_id', 'geo_products.id')
                    ->when(!empty($options['filter']['range']), function ($query) use ($options) {
                        $query->whereBetween('geo_product_events.created_at', [Carbon::parse($options['filter']['range']['start'])->startOfDay(), Carbon::parse($options['filter']['range']['end'])->endOfDay()]);
                    })
                    ->whereIn('geo_product_events.event_subject_type', [
                        'App\\Events\\ProductViewEvent',
                        'App\\Events\\ProductDownloadEvent'
                    ]);
            })
            ->where('geo_product_files.license_type', LicenceTypes::OPEN)
            ->when(!empty($options['filter']['ids']), function ($query) use ($options) {
                $query->whereIn('geo_product_files.uuid', $options['filter']['ids']);
            })
            ->groupBy(['geo_product_files.id', 'institution_licences.licence_type', 'classifier_values.value_code', 'geo_product_files.dpps_name']);

        $openFiles = $this->reportFilter($openFiles, $options);

        $openOthers = GeoProductOther::select($select['open_others'])
            ->join('geo_products', 'geo_products.id', 'geo_product_others.geo_product_id')
            ->leftJoin('geo_product_events', function ($join) use ($options) {
                $join->on('geo_product_events.event_subject_id', 'geo_products.id')
                    ->when(!empty($options['filter']['range']), function ($query) use ($options) {
                        $query->whereBetween('geo_product_events.created_at', [Carbon::parse($options['filter']['range']['start'])->startOfDay(), Carbon::parse($options['filter']['range']['end'])->endOfDay()]);
                    })
                    ->where('geo_product_events.event_subject_type', 'App\\Events\\OtherProductCallEvent');
            })

//            ->when(!empty($options['filter']['ids']), function ($query) use ($options) {
//                $query->whereIn('geo_product_others.uuid', $options['filter']['ids']);
//            })
            ->groupBy(['geo_product_others.id']);


        $openOthers = $this->reportFilter($openOthers, $options);


//        $openOthers->dd();

        return $services
            ->union($files)
            ->when(empty($options['filter']['users']) && empty($options['filter']['organization']), function ($query) use ($openServices, $openFiles, $openOthers) {
                $query->union($openServices)->union($openFiles)->union($openOthers);
            })
            ->orderBy('distribution_type');
    }

    /**
     * @param $builder
     * @param $options
     * @return Builder
     * @throws \Exception
     */
    private function reportFilter($builder, $options): Builder
    {
        $activeRole = $this->activeRole();

        return $builder->when(isset($options['filter']['product_id']), function ($query) use ($options) {
            $query->where('geo_products.id', $options['filter']['product_id']);
        })
            ->when(!$activeRole->is_admin, function ($query) use ($options, $activeRole) {
                $query->where('geo_products.owner_institution_classifier_id', $activeRole->institution_classifier_id);
            })
            ->when($activeRole->is_admin && !empty($options['filter']['owner_institution_classifier_id']), function ($query) use ($options) {
                $query->whereIn('geo_products.owner_institution_classifier_id', $options['filter']['owner_institution_classifier_id']);
            });
    }

    public function selectGeoProductsByUser()
    {
        $role = $this->activeRole();

        return GeoProduct::select(['geo_products.name', 'geo_products.id',])
            ->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id)
            ->groupBy('geo_products.id')
            ->orderBy('geo_products.name', 'asc')
            ->get();
    }
}
