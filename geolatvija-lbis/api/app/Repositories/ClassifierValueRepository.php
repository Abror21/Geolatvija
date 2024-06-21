<?php

namespace App\Repositories;

use App\Models\Classifier;
use App\Models\ClassifierValue;
use Illuminate\Database\Eloquent\Model;
/**
 * Class ClassifierValueRepository
 * @package App\Repositories
 */
class ClassifierValueRepository extends BaseRepository
{

    /**
     * ClassifierValueRepository constructor.
     * @param ClassifierValue $classifierValue
     */
    public function __construct(ClassifierValue $classifierValue)
    {
        parent::__construct($classifierValue);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new ClassifierValue();
    }

    public function getClassifiersValuesList($id, $options)
    {
        return ClassifierValue::select('classifier_values.*')
            ->where('classifier_values.classifier_id', $id)
            ->when(isset($options['sort_by']), function ($query) use ($options) {
                return $query->orderBy($this->parseOrderBy($options['sort_by']), $options['order_by'] ?? 'ASC');
            })
            ->paginate($options['pageSize'] ?? 10);

    }

    public function getClassifierValue($classifierId, $classifierValueId)
    {
        return ClassifierValue::where('classifier_id', $classifierId)
            ->where('id', $classifierValueId)
            ->first();
    }


    public function getClassifierValueByCodes($classifierCode, $classifierValueCode)
    {
        return ClassifierValue::select('classifier_values.*')->where('value_code', $classifierValueCode)
            ->join('classifiers', function ($join) use ($classifierCode) {
                $join->on('classifiers.id', '=', 'classifier_values.classifier_id')
                    ->where('classifiers.unique_code', $classifierCode);
            })
            ->first();
    }

    public function getClassifierByCode($id, $code)
    {
        return ClassifierValue::where('classifier_id', $id)
            ->where('value_code', $code)
            ->first();
    }

    public function findClassifierValues($classifierId, $code): mixed
    {
        return ClassifierValue::where('classifier_id', $classifierId)->where('value_code', $code)->first();
    }

    public function getClassifierValuesForSelect($code): mixed
    {
        $query = ClassifierValue::select([
            'classifier_values.id',
            'classifier_values.translation',
            'classifier_values.value_code as code',
        ])
            ->join('classifiers', function ($join) use ($code) {
                $join->on('classifiers.id', '=', 'classifier_values.classifier_id')
                    ->where('classifiers.unique_code', $code);
            });

        $enableWeights = Classifier::where('unique_code', $code)->value('enable_weights');

        if ($enableWeights) {
            $query->orderBy('classifier_values.weight', 'asc');
        } else {
            $query->orderBy('classifier_values.translation', 'asc');
        }

        return $query->get();
    }


}
