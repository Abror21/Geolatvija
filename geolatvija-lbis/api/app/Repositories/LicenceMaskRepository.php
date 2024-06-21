<?php


namespace App\Repositories;

use App\Models\LicenceMask;
use Illuminate\Database\Eloquent\Model;

class LicenceMaskRepository extends BaseRepository
{

    /**
     * LicenceMaskRepository constructor.
     * @param LicenceMask $licenceMask
     */
    public function __construct(LicenceMask $licenceMask)
    {
        parent::__construct($licenceMask);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new LicenceMask;
    }

    public function list()
    {
        return LicenceMask::paginate(999);
    }

}
