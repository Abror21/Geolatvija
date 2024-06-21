<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductService;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductServiceRepository extends BaseRepository
{
    /**
     * GeoProductServiceRepository constructor.
     * @param GeoProductService $geoProductService
     */
    public function __construct(GeoProductService $geoProductService)
    {
        parent::__construct($geoProductService);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductService();
    }

    public function pubicServices($id)
    {
        return GeoProductService::select([
            'geo_product_services.id',
            'geo_product_services.description',
            'geo_product_services.service_link',
            'geo_product_services.payment_type',
            'geo_product_services.license_type',
            'geo_product_services.available_restriction_type',
            'geo_product_services.thematic_user_group_id',
            'geo_product_services.institution_type_classifier_ids',
            'geo_product_services.service_limitation_type',
            'geo_product_services.usage_request',
            'geo_product_services.fee_cost',
            'geo_product_services.need_target',
            'geo_product_services.fail_amount',
            'geo_product_services.number_value',
            'geo_product_services.dpps_link',
            'geo_product_services.metadata_uuid',
            'geo_product_services.service_type_classifier_value_id',
            'classifier_values.value_code as service_type_code',
            'attachments.id as attachment_id',
            'attachments.display_name',
            'institution_licence_attachment.id as institution_attachment_id',
            'institution_licence_attachment.display_name as institution_display_name',
            'institution_licences.site',
            'period_classifier_values.value_code as period_code',

        ])

            ->leftJoin('classifier_values', 'classifier_values.id', '=', 'geo_product_services.service_type_classifier_value_id')
            ->leftJoin('attachments', 'attachments.id', '=', 'geo_product_services.licence_attachment_id')
            ->leftJoin('institution_licences', 'institution_licences.id', '=', 'geo_product_services.institution_licence_id')
            ->leftJoin('attachments as institution_licence_attachment', 'institution_licence_attachment.id', '=', 'institution_licences.attachment_id')

            ->leftJoin('classifier_values as period_classifier_values', 'period_classifier_values.id', '=', 'geo_product_services.period_classifier_value_id')

            ->where('geo_product_services.geo_product_id', $id)
            ->where('geo_product_services.is_public', true)

            ->orderBy('geo_product_services.id', 'asc')
            ->get();
    }

    public function checkLicence($id)
    {
        return GeoProductService::select('geo_products.name', 'geo_product_services.is_public', 'geo_product_services.id')->where('geo_product_services.institution_licence_id', $id)
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_services.geo_product_id')
            ->get();
    }
}
