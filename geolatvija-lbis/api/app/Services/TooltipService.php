<?php

namespace App\Services;

use App\Repositories\TooltipRepository;

class TooltipService extends BaseService
{


    public function __construct
    (
        private TooltipRepository $tooltipRepository,

    )
    {
    }

    public function index($options)
    {
        return $this->tooltipRepository->getTooltipList($options);
    }

    public function show($id)
    {
        return $this->tooltipRepository->findById($id);
    }

    public function update($id, $data)
    {
        return $this->tooltipRepository->update($id, $data);
    }

    public function store($data)
    {
        return $this->tooltipRepository->store($data);
    }

    public function delete($ids): bool
    {
        return $this->tooltipRepository->deleteMultiple($ids);
    }

    public function tooltips()
    {
        return $this->tooltipRepository->tooltips();
    }


}
