<?php


namespace App\Repositories;

use App\Enums\GeoProductPaymentType;
use App\Models\GeoProductOrder;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class GeoProductOrderRepository extends BaseRepository
{

    /**
     * GeoProductOrderRepository constructor.
     * @param GeoProductOrder $geoProduct
     */
    public function __construct(GeoProductOrder $geoProduct, private ClassifierValueRepository $classifierValueRepository)
    {
        parent::__construct($geoProduct);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductOrder();
    }

    public function getGeoproductOrders($options)
    {
        $activeRole = $this->activeRole();

        return GeoProductOrder::select([
            'geo_product_orders.id',
            'geo_product_orders.created_at',
            'geo_product_orders.geo_product_service_id',
            'geo_product_orders.geo_product_file_id',
            'geo_product_orders.payment_amount',
            'geo_product_orders.confirmed_rules',
            'geo_product_orders.confirmed_date',
            'geo_product_orders.payment_request_status as payment_status',
            'geo_product_orders.description',
            'geo_product_orders.files_availability',
            'geo_product_orders.attachments_display_names',
            'geo_product_orders.product_file_attachment_id',
            'geo_product_orders.order_status_classifier_value_id',
            'classifier_values.value_code as status',
            'geo_product_orders.period_classifier_value_id',
            'geo_product_orders.expire_at',
            'geo_product_orders.dpps_link',
            'geo_product_orders.ip_limitation',
            'geo_product_orders.period_number_value',
            'geo_product_services.updated_at as service_updated_at',
            'geo_product_services.license_type',
            'geo_product_services.service_limitation_type',
            'geo_product_services.usage_request as service_usage_request',

            'geo_product_files.updated_at as file_updated_at',
            'geo_product_files.license_type as file_license_type',
            'geo_product_files.usage_request as file_usage_request',

            'geo_products.name as geo_product_name',
            'geo_products.id as geo_product_id',
            'geo_products.deleted_at as geo_product_deleted_at',
            'geo_products.is_public as geo_product_is_public',
            'institution_classifiers.name as owner_institution_name',

            'geo_product_services.payment_type',
            'geo_product_files.payment_type'
        ])
            ->classifierValue('order_status_classifier_value_id')
            ->leftJoin('geo_product_services', 'geo_product_services.id', '=', 'geo_product_orders.geo_product_service_id')
            ->leftJoin('geo_product_files', 'geo_product_files.id', '=', 'geo_product_orders.geo_product_file_id')
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_orders.geo_product_id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'geo_products.owner_institution_classifier_id')
            ->join('classifier_values', 'classifier_values.id', '=', 'geo_product_orders.order_status_classifier_value_id')
            ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->where('roles.id', $activeRole->id)
            ->when(isset($options['filter']['num']) && $options['filter']['num'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.id', $options['filter']['num']);
            })
            ->when(isset($options['filter']['status']) && $options['filter']['status'] !== '', function ($query) use ($options) {
                return $query->where('order_status_classifier_value_id', $options['filter']['status']);
            })
            ->when(isset($options['filter']['date_from']) && $options['filter']['date_from'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.created_at', '>=', $options['filter']['date_from']);
            })
            ->when(isset($options['filter']['date_to']) && $options['filter']['date_to'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.created_at', '<=', $options['filter']['date_to']);
            })
            ->when(isset($options['filter']['geoproduct']) && $options['filter']['geoproduct'] !== '', function ($query) use ($options) {
                return $query->where('geo_products.name', 'LIKE', '%' . $options['filter']['geoproduct'] . '%');
            })
            ->when(isset($options['filter']['table']) && $options['filter']['table'] !== '', function ($query) use ($options) {
                switch ($options['filter']['table']) {
                    case 'ordered':
                        $query->where(function ($q) {
                            return $q->whereIn('geo_product_files.payment_type', [GeoProductPaymentType::FEE->value, GeoProductPaymentType::PREPAY->value])
                                ->orWhereIn('geo_product_services.payment_type', [GeoProductPaymentType::FEE->value, GeoProductPaymentType::PREPAY->value]);
                        });

                        break;
                    case 'confirmed':
                        $query->where(function ($q) {
                            $q->whereIn('geo_product_files.payment_type', [GeoProductPaymentType::FREE->value])
                                ->orWhereIn('geo_product_services.payment_type', [GeoProductPaymentType::FREE->value]);
                        });
                        break;
                }
            })
            ->orderBy('geo_product_orders.id', 'desc')
            ->paginate($options['pageSize'] ?? 10);
    }

    public function getOrdersForThematicGroupCheck($userId)
    {
        return GeoProductOrder::select([
            'geo_product_orders.id',
            'geo_product_orders.geo_product_service_id',
            'geo_product_orders.geo_product_file_id',
            'geo_product_orders.order_status_classifier_value_id',
        ])
            ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->where('users.id', $userId)
            ->get();
    }

    public function getOrdersForInstitutionClassifierDeletion($institutionClassifierId)
    {
        return GeoProductOrder::select([
            'geo_product_orders.id',
        ])
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_orders.geo_product_id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'geo_products.owner_institution_classifier_id')
            ->join('classifier_values', 'classifier_values.id', '=', 'geo_product_orders.order_status_classifier_value_id')
            ->where('classifier_values.value_code', 'ACTIVE')
            ->where('institution_classifiers.id', $institutionClassifierId)
            ->get();
    }

    public function getOrderedLicences($options)
    {
        $role = $this->activeRole();

        return GeoProductOrder::select([
            'geo_product_orders.id',
            'geo_product_orders.geo_product_service_id',
            'geo_product_orders.geo_product_file_id',
            'geo_product_orders.confirmed_rules',
            'geo_products.name as geo_product_name',
            'attachments.display_name as display_name',
            'geo_products.id as geo_product_id',
            'geo_product_services.license_type',
            'institution_classifiers.name as institution_name',
            'users.name',
            'users.surname',
            'users.personal_code',
        ])
            ->classifierValue('order_status_classifier_value_id')
            ->classifierValue('target_classifier_value_id')
            ->join('geo_product_services', 'geo_product_services.id', '=', 'geo_product_orders.geo_product_service_id')
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_services.geo_product_id')
            ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->join('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
            ->leftJoin('attachments', 'attachments.id', '=', 'geo_product_orders.accepted_licence_attachment_id')
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->when(isset($options['filter']['num']) && $options['filter']['num'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.id', $options['filter']['num']);
            })
            ->when(isset($options['filter']['confirmed_rules']) && $options['filter']['confirmed_rules'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.confirmed_rules', $options['filter']['confirmed_rules']);
            })
            ->orderBy('geo_product_orders.id', 'DESC')
            ->paginate($options['pageSize'] ?? 10);
    }

    public function getDataHolderOrders($options)
    {
        $role = $this->activeRole();

        return GeoProductOrder::withTrashed()
            ->select([
                'geo_product_orders.id',
                'geo_product_orders.created_at',

                'geo_product_orders.payment_amount',
                'geo_product_orders.period_number_value',
                'geo_product_orders.period_classifier_value_id',
                'geo_products.name as geo_product_name',
                'geo_product_orders.payment_request_status as payment_status',
                DB::raw("CASE
            WHEN geo_product_orders.geo_product_service_id IS NOT NULL THEN 'Pakalpe'
            WHEN geo_product_orders.geo_product_file_id IS NOT NULL THEN 'Datne'
            WHEN geo_product_orders.geo_product_other_id IS NOT NULL THEN 'Cits'
            ELSE ''
            END AS data_type"),
                DB::raw("STRING_AGG(classifier_values.translation, ', ') AS service_types"),
                DB::raw("STRING_AGG(file_method.translation, ', ') AS file_types")
            ])
            ->classifierValue('order_status_classifier_value_id', 'order_status_classifier', 'order_status')
            ->leftjoin('geo_product_services', 'geo_product_services.id', '=', 'geo_product_orders.geo_product_service_id')
            ->leftjoin('geo_product_files', 'geo_product_files.id', '=', 'geo_product_orders.geo_product_file_id')
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_orders.geo_product_id')
            ->leftJoin('classifier_values as order_status_classifier', 'order_status_classifier.id', '=', 'geo_product_orders.order_status_classifier_value_id')
            ->leftJoin('classifier_values', 'classifier_values.id', '=', 'geo_product_services.service_type_classifier_value_id')
            ->leftJoin('classifier_values as file_method', 'file_method.id', '=', 'geo_product_files.file_method_classifier_value_id')
            ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->when(isset($options['filter']['id']) && $options['filter']['id'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.id', $options['filter']['id']);
            })
            ->when(isset($options['filter']['geo_product_id']) && $options['filter']['geo_product_id'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.geo_product_id', $options['filter']['geo_product_id']);
            })
            ->when(isset($options['filter']['confirmed_rules']) && $options['filter']['confirmed_rules'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.confirmed_rules', $options['filter']['confirmed_rules']);
            })
            ->when(isset($options['filter']['personal_code']) && $options['filter']['personal_code'] !== '', function ($query) use ($options) {
                return $query->where('users.personal_code', $options['filter']['personal_code']);
            })
            ->when(isset($options['filter']['order_from']) && $options['filter']['order_from'] !== '', function ($query) use ($options) {
                return $query->whereDate('geo_product_orders.created_at', '>=', $options['filter']['order_from']);
            })
            ->when(isset($options['filter']['order_to']) && $options['filter']['order_to'] !== '', function ($query) use ($options) {
                return $query->whereDate('geo_product_orders.created_at', '<=', $options['filter']['order_to']);
            })
            ->when(isset($options['filter']['status_classifier_value_id']) && $options['filter']['status_classifier_value_id'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_orders.order_status_classifier_value_id', $options['filter']['status_classifier_value_id']);
            })
            ->when(isset($options['filter']['geo_product_id']) && $options['filter']['geo_product_id'] !== '', function ($query) use ($options) {
                return $query->where('geo_products.id', $options['filter']['geo_product_id']);
            })
            ->when(isset($options['filter']['license_type']) && $options['filter']['license_type'] !== '', function ($query) use ($options) {
                return $query->where('geo_product_services.license_type', $options['filter']['license_type'])
                    ->orWhere('geo_product_files.license_type', $options['filter']['license_type']);
            })
            ->when(isset($options['filter']['name_surname']) && $options['filter']['name_surname'] !== '', function ($query) use ($options) {
                return $query->whereRaw("CONCAT(users.name, ' ', users.surname) LIKE ?", ["%{$options['filter']['name_surname']}%"]);
            })
            ->when(isset($options['filter']['status']) && $options['filter']['status'] !== '', function ($query) use ($options) {
                $statusArray = is_array($options['filter']['status']) ? $options['filter']['status'] : [$options['filter']['status']];
                return $query->whereIn('order_status_classifier.value_code', $statusArray);
            })
            ->when(isset($options['filter']['data_type']) && $options['filter']['data_type'] !== '', function ($query) use ($options) {
                if ($options['filter']['data_type'] === 'service') {
                    return $query->where('geo_product_orders.geo_product_service_id', '!=', null);
                } else if ($options['filter']['data_type'] === 'file') {
                    return $query->where('geo_product_orders.geo_product_file_id', '!=', null);
                } else if ($options['filter']['data_type'] === 'other') {
                    return $query->where('geo_product_orders.geo_product_other_id', '!=', null);
                }
                return $query;
            })
            ->groupBy([
                'geo_product_orders.id',
                'geo_product_orders.created_at',
                'geo_product_orders.payment_amount',
                'geo_product_orders.period_number_value',
                'geo_product_orders.period_classifier_value_id',
                'geo_products.name',
                'order_status.translation'
            ])
            ->paginate($options['pageSize'] ?? 10);
    }

    public function getAllOrdersForSelectsByInstitution()
    {
        $inactiveStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'INACTIVE');
        $activeStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'ACTIVE');

        $role = $this->activeRole();

        return GeoProductOrder::withTrashed()
            ->select([
                'geo_product_orders.id',
                'roles.institution_classifier_id as institution_classifier_id',
                'users.id as user_id',
            ])
            ->leftJoin('geo_products', 'geo_products.id', '=', 'geo_product_orders.geo_product_id')
            ->leftJoin('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->leftJoin('users', 'users.id', '=', 'roles.user_id')
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->whereIn('geo_product_orders.order_status_classifier_value_id', [$inactiveStatus->id, $activeStatus->id])
            ->groupBy([
                'geo_product_orders.id',
                'roles.institution_classifier_id',
                'users.id'
            ])
            ->get();
    }

    public function getDataHolderOrder($id): mixed
    {
        $role = $this->activeRole();

        return GeoProductOrder::select([
            'geo_product_orders.id',
            'geo_product_orders.created_at',
            'geo_product_orders.payment_amount',
            'geo_product_orders.confirmed_rules',
            'geo_products.name as geo_product_name',
            'geo_products.id as geo_product_id',
            'geo_product_service_id',
            'geo_product_file_id',
            'geo_product_other_id',
            'institution_classifiers.name as institution_name',
            'institution_classifiers.reg_nr',
            'users.name',
            'users.surname',
            'users.personal_code',
            'geo_product_orders.email',
            'geo_product_orders.phone',
            'classifier_values.value_code',
            'geo_product_files.usage_request as file_usage',
            'geo_product_services.usage_request as service_usage',
            'geo_product_orders.ip_limitation',
            'geo_product_orders.description',
            DB::raw('COALESCE(geo_product_services.license_type, geo_product_files.license_type) AS license_type'),
            DB::raw("(SELECT cv.value_code FROM classifier_values cv WHERE cv.id = geo_product_orders.target_classifier_value_id) AS target_classifier_value_code"),
            DB::raw("(SELECT cv.translation FROM classifier_values cv WHERE cv.id = geo_product_orders.target_classifier_value_id) AS target_classifier_translation"),
            DB::raw("CONCAT(users.name, ' ', users.surname) as full_name")
        ])
            ->classifierValue('order_status_classifier_value_id')
            ->leftJoin('geo_product_services', 'geo_product_services.id', '=', 'geo_product_orders.geo_product_service_id')
            ->leftJoin('geo_product_others', 'geo_product_others.id', '=', 'geo_product_orders.geo_product_other_id')
            ->leftJoin('geo_product_files', 'geo_product_files.id', '=', 'geo_product_orders.geo_product_file_id')
            ->join('classifier_values', 'classifier_values.id', '=', 'order_status_classifier_value_id')
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_orders.geo_product_id')
            ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
            ->where('geo_product_orders.id', $id)
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->first();
    }

    /**
     * @param $id
     * @return Model | null
     */
    public function getHolderOrder($id): Model|null
    {
        $role = $this->activeRole();

        return GeoProductOrder::select([
            'geo_product_orders.*',
        ])
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_orders.geo_product_id')
            ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('geo_products.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->where('geo_product_orders.id', $id)
            ->first();
    }

    public function getLicence($id, $type = null)
    {
        $activeRole = $this->activeRole();

        if ($type === 'services') {
            return GeoProductOrder::select(['geo_product_orders.*'])
                ->join('classifier_values', 'classifier_values.id', '=', 'geo_product_orders.order_status_classifier_value_id')
                ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
                ->join('users', 'users.id', '=', 'roles.user_id')
                ->where('geo_product_orders.role_id', $activeRole->id)
                ->where('classifier_values.value_code', '=', 'ACTIVE')
                ->where('geo_product_service_id', $id)
                ->first();
        }

        return GeoProductOrder::select(['geo_product_attachments.attachment_id'])
            ->join('geo_product_attachments', 'order_id', '=', 'geo_product_orders.id')
            ->join('classifier_values', 'classifier_values.id', '=', 'geo_product_orders.order_status_classifier_value_id')
            ->join('roles', 'roles.id', '=', 'geo_product_orders.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->where('geo_product_orders.role_id', $activeRole->id)
            ->where('classifier_values.value_code', '=', 'ACTIVE')
            ->where('geo_product_file_id', $id)->get();
    }

    public function getDate($id)
    {
        return GeoProductOrder::select(['geo_product_orders.created_at', 'geo_product_orders.expire_at'])
            ->where('geo_product_service_id', $id)
            ->first();
    }

    public function expireToday()
    {
        return $this->create()
            ->whereDate('expire_at', Carbon::today())
            ->get();
    }

    public function getDraftsOlderThan30Days()
    {
        return GeoProductOrder::select(['geo_product_orders.*'])
            ->join('classifier_values', 'classifier_values.id', '=', 'geo_product_orders.order_status_classifier_value_id')
            ->where('classifier_values.value_code', '=', 'DRAFT')
            ->whereDate('geo_product_orders.updated_at', '<=', Carbon::now()->subDays(30))
            ->get();
    }

    public function getActiveGeoproductOrders($geoProductId, $roleId)
    {
        return GeoProductOrder::select(['geo_product_orders.*'])
            ->join('classifier_values', 'classifier_values.id', '=', 'geo_product_orders.order_status_classifier_value_id')
            ->leftJoin('geo_product_services', 'geo_product_services.id', '=', 'geo_product_orders.geo_product_service_id')
            ->leftJoin('geo_product_files', 'geo_product_files.id', '=', 'geo_product_orders.geo_product_file_id')
            ->where('geo_product_orders.geo_product_id', $geoProductId)
            ->where('geo_product_orders.role_id', $roleId)
            ->where('classifier_values.value_code', 'ACTIVE')
            ->get();

    }
}
