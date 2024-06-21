<?php

namespace App\Repositories;

use App\Models\Dummy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Class DummyRepository
 * @package App\Repositories
 */
class DummyRepository extends BaseRepository
{

    /**
     * DummyRepository constructor.
     * @param Dummy $dummy
     */
    public function __construct(Dummy $dummy)
    {
        parent::__construct($dummy);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Dummy();
    }

    public function getDummyList($options)
    {
        return Dummy::select(['dummies.*'])
            ->paginate($options["page_size"] ?? 10);
    }
}
