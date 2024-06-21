<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductOther;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductOtherRepository extends BaseRepository
{
    /**
     * GeoProductOtherRepository constructor.
     * @param GeoProductOther $geoProductOther
     */
    public function __construct(GeoProductOther $geoProductOther)
    {
        parent::__construct($geoProductOther);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductOther();
    }

    public function pubicOthers($id)
    {
        return GeoProductOther::select([
            'geo_product_others.id',
            'geo_product_others.description',
            'geo_product_others.metadata_uuid',
        ])
            ->with(['sites'])
            ->where('geo_product_others.geo_product_id', $id)
            ->where('geo_product_others.is_public', true)
            ->orderBy('geo_product_others.id', 'asc')
            ->get();
    }



}
