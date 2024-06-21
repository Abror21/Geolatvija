<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductFile;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductFileRepository extends BaseRepository
{
    /**
     * GeoProductFileRepository constructor.
     * @param GeoProductFile $geoProductFile
     */
    public function __construct(GeoProductFile $geoProductFile)
    {
        parent::__construct($geoProductFile);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductFile();
    }


    public function pubicFiles($id)
    {
        return GeoProductFile::select([
            'geo_product_files.id',
            'geo_product_files.description',
            'geo_product_files.payment_type',
            'geo_product_files.license_type',
            'geo_product_files.available_restriction_type',
            'geo_product_files.thematic_user_group_id',
            'geo_product_files.institution_type_classifier_ids',
            'geo_product_files.usage_request',
            'geo_product_files.fee_cost',
            'geo_product_files.need_target',
            'geo_product_files.fail_amount',
            'geo_product_files.price_for',
            'geo_product_files.metadata_uuid',
            'geo_product_files.files_updated_at',
            'attachments.id as attachment_id',
            'attachments.display_name',
            'institution_licence_attachment.id as institution_attachment_id',
            'institution_licence_attachment.display_name as institution_display_name',
            'institution_licences.site',
        ])
            ->leftJoin('attachments', 'attachments.id', '=', 'geo_product_files.licence_attachment_id')
            ->leftJoin('institution_licences', 'institution_licences.id', '=', 'geo_product_files.institution_licence_id')
            ->leftJoin('attachments as institution_licence_attachment', 'institution_licence_attachment.id', '=', 'institution_licences.attachment_id')

            ->with('attachments.geoProductFilesFtp')
            ->where('geo_product_files.geo_product_id', $id)
            ->where('geo_product_files.is_public', true)
            ->orderBy('geo_product_files.id', 'asc')
            ->get();
    }

    /**
     * @return mixed
     */
    public function getCronExpresions()
    {
        return $this->create()->whereNotNull('ftp_cron')->get();
    }

    public function checkLicence($id)
    {
        return GeoProductFile::select('geo_products.name', 'geo_product_files.is_public', 'geo_product_files.id')->where('geo_product_files.institution_licence_id', $id)
            ->join('geo_products', 'geo_products.id', '=', 'geo_product_files.geo_product_id')
            ->get();
    }
}
