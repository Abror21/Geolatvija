<?php

namespace App\Services;

use App\Repositories\GeoProductOrderRepository;
use Illuminate\Database\Eloquent\Model;

class OrderDataHolderService extends BaseService
{


    public function __construct
    (
        private GeoProductOrderRepository $geoProductOrderRepository,
    )
    {
    }

    public function index($options)
    {
       return $this->geoProductOrderRepository->getDataHolderOrders($options);
    }

    /**
     * @param $id
     * @return Model|mixed
     */
    public function show($id): mixed
    {
        return $this->geoProductOrderRepository->getDataHolderOrder($id);
    }
}
