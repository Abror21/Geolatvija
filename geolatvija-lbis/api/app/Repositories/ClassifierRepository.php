<?php

namespace App\Repositories;

use App\Models\Classifier;
use App\Models\ClassifierValue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class ClassifierRepository
 * @package App\Repositories
 */
class ClassifierRepository extends BaseRepository
{

    /**
     * ClassifierRepository constructor.
     * @param Classifier $classifier
     */
    public function __construct(Classifier $classifier)
    {
        parent::__construct($classifier);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Classifier();
    }

    public function getClassifiersList($options) {

        return Classifier::when(isset($options['sort_by']), function ($query) use ($options) {
                return $query->orderBy($this->parseOrderBy($options['sort_by']), $options['order_by'] ?? 'ASC');
            })
            ->when(isset($options['filter']['translation']), function ($query) use ($options) {
                return $query->where('translation', 'LIKE', '%' . $options['filter']['translation'] . '%');
            })
            ->paginate($options['pageSize'] ?? 10);
    }

}
