<?php

namespace App\Services;

use App\Exceptions\InvalidAction;
use App\Repositories\ClassifierRepository;
use App\Repositories\ClassifierValueRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

class ClassifierService extends BaseService
{

    /**
     * ClassifierService constructor.
     * @param ClassifierRepository $classifierRepository
     * @param ClassifierValueRepository $classifierValueRepository
     */
    public function __construct(private ClassifierRepository $classifierRepository, private ClassifierValueRepository $classifierValueRepository)
    {
    }

    public function getClassifierById($id)
    {
        return $this->classifierRepository->findById($id);
    }

    public function getClassifiersList($options)
    {
        return $this->classifierRepository->getClassifiersList($options);
    }

    public function getClassifiersValuesList($id, $options)
    {
        return $this->classifierValueRepository->getClassifiersValuesList($id, $options);
    }

    public function updateClassifier($id, $data): Model
    {
        return $this->classifierRepository->update($id, $data);
    }

    public function updateClassifierValue($classifierId, $classifierValueId, $data): Model
    {
        $existing = $this->classifierValueRepository->getClassifierByCode($classifierId, $data['value_code']);

        if (isset($existing) && $existing->id != $classifierValueId) {
            throw new InvalidAction('validation.value_code_not_unique', 412);
        }

        return $this->classifierValueRepository->update($classifierValueId, $data);
    }

    public function storeClassifierValue($id, $data): Model
    {
        $existing = $this->classifierValueRepository->getClassifierByCode($id, $data['value_code']);

        if ($existing) {
            throw new InvalidAction('validation.value_code_not_unique', 412);
        }

        $data['classifier_id'] = $id;

        return $this->classifierValueRepository->store($data);
    }

    public function getClassifierValue($classifierId, $classifierValueId): Model
    {
        return $this->classifierValueRepository->getClassifierValue($classifierId, $classifierValueId);
    }


    public function storeClassifier($data): Model
    {
        $existing = $this->classifierRepository->findBy('unique_code', $data['unique_code']);

        if ($existing) {
            throw new InvalidAction('validation.unique_code_not_unique', 412);
        }

        return $this->classifierRepository->store($data);
    }

    public function getClassifierValuesForSelect($code)
    {
        return $this->classifierValueRepository->getClassifierValuesForSelect($code);
    }

    public function deleteClassifiers($ids): bool
    {
        foreach ($ids as $id) {
            $this->classifierValueRepository->findBy('classifier_id', $id, true)->each(function ($classifierValue) {
                $classifierValue->delete();
            });

            $this->classifierRepository->findById($id)->delete();
        }

        return true;
    }

    public function deleteClassifierValues($ids): bool
    {
        try {
            foreach ($ids as $id) {
                $this->classifierValueRepository->findById($id)->forceDelete();
            }
        } catch (QueryException $e) {
            throw new \Exception('validation.classifier_constraint', $e->getCode());
        }

        return true;
    }
}
