<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductFilesFtp;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductFilesFtpRepository extends BaseRepository
{
    /**
     * GeoProductFilesFtpRepository constructor.
     * @param GeoProductFilesFtp $geoProductFilesFtp
     */
    public function __construct(GeoProductFilesFtp $geoProductFilesFtp)
    {
        parent::__construct($geoProductFilesFtp);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductFilesFtp();
    }

    public function getFiles($id)
    {
        return $this->create()
            ->select(
                [
                    'attachments.display_name as name',
                    'geo_product_files_ftp.created_at as date',
                    'geo_product_files_ftp.zip_id'
                ]
            )
            ->join('attachments', 'attachments.id', '=', 'geo_product_files_ftp.attachment_id')
            ->where('attachments.files_id', $id)
            ->get();
    }
}
