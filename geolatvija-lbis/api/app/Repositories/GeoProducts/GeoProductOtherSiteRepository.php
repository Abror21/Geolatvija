<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductOtherSite;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductOtherSiteRepository extends BaseRepository
{
    /**
     * GeoProductOtherRepository constructor.
     * @param GeoProductOtherSite $geoProductOtherSite
     */
    public function __construct(GeoProductOtherSite $geoProductOtherSite)
    {
        parent::__construct($geoProductOtherSite);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductOtherSite();
    }

}
