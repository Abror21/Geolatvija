<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductNone;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductNoneRepository extends BaseRepository
{
    /**
     * GeoProductOtherRepository constructor.
     * @param GeoProductNone $geoProductNone
     */
    public function __construct(GeoProductNone $geoProductNone)
    {
        parent::__construct($geoProductNone);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductNone();
    }

    public function pubicNone($id)
    {
        return GeoProductNone::select(['geo_product_nones.id'])->where('geo_product_nones.geo_product_id', $id)
            ->where('geo_product_nones.is_public', true)
            ->first();
    }


}
