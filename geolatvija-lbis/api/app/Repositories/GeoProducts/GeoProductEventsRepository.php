<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductEvents;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductEventsRepository extends BaseRepository
{
    /**
     * GeoProductEventsRepository constructor.
     * @param GeoProductEvents $geoProductEvents
     */
    public function __construct(GeoProductEvents $geoProductEvents)
    {
        parent::__construct($geoProductEvents);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductEvents();
    }
}
