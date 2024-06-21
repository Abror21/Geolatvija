<?php

namespace App\Services;

use App\Repositories\ProcessingTypeRepository;
use Illuminate\Support\Collection;

class ProcessingTypeService extends BaseService
{


    public function __construct
    (
        private ProcessingTypeRepository $processingTypeRepository,
    )
    {
    }

    public function index($options)
    {
        return $this->processingTypeRepository->getProcessingTypeList($options);
    }

    public function show($id)
    {
        return $this->processingTypeRepository->findById($id);
    }

    public function update($id, $data)
    {
        return $this->processingTypeRepository->update($id, $data);
    }

    public function store($data)
    {
        $activeRole = $this->processingTypeRepository->activeRole();
        $data['institution_classifier_id'] = $activeRole->institution_classifier_id;

        return $this->processingTypeRepository->store($data);
    }

    public function delete($ids): bool
    {
        return $this->processingTypeRepository->deleteMultiple($ids);
    }

    /**
     * @return Collection
     */
    public function select(): Collection
    {
        return $this->processingTypeRepository->select();
    }
}
