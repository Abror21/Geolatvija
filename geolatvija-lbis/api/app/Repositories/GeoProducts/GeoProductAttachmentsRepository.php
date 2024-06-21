<?php


namespace App\Repositories\GeoProducts;

use App\Models\GeoProducts\GeoProductAttachments;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class GeoProductAttachmentsRepository extends BaseRepository
{
    /**
     * GeoProductAttachmentsRepository constructor.
     * @param GeoProductAttachments $geoProductAttachments
     */
    public function __construct(GeoProductAttachments $geoProductAttachments)
    {
        parent::__construct($geoProductAttachments);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new GeoProductAttachments();
    }
}
