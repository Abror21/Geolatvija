<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductTag;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductTagRepository extends BaseRepository
{
    /**
     * GeoProductTagRepository constructor.
     * @param GeoProductTag $geoProductTag
     */
    public function __construct(GeoProductTag $geoProductTag)
    {
        parent::__construct($geoProductTag);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductTag();
    }

}
