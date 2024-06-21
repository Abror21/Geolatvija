<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeoProductOrderStoreRequest;
use Illuminate\Http\Request;
use App\Traits\ResponseMessages;
use Illuminate\Http\Response;
use App\Services\GeoProductOrderService;
use App\Http\Requests\PaginationRequest;

class GeoProductOrderController extends Controller
{
    use ResponseMessages;

    /**
     * GeoProductOrderController constructor.
     * @param GeoProductOrderService $geoProductOrderService
     */
    public function __construct(private GeoProductOrderService $geoProductOrderService)
    {}

    /**
     * @description Get list of Geo Product orders
     */
    public function getGeoproductOrders(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $geoProductOrders = $this->geoProductOrderService->getGeoproductOrders($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProductOrders->toArray()));
    }

    /**
     * @description Get Geo Product order
     */
    public function getGeoproductOrder($id): Response
    {
        $geoProductOrder = $this->geoProductOrderService->getGeoproductOrder($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProductOrder->toArray()));
    }

    /**
     * @description Create Geo Product order
     */
    public function store(GeoProductOrderStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $licences = $this->geoProductOrderService->order($data, null);

        return $this->successResponse($this->snakeToCamelArrayKeys($licences->toArray()));
    }

    /**
     * @description Update Geo Product order
     */
    public function update(GeoProductOrderStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $licences = $this->geoProductOrderService->order($data, $id);

        return $this->successResponse($this->snakeToCamelArrayKeys($licences->toArray()));
    }

    /**
     * @description Get Geo Products for Select field
     */
    public function download($id)
    {
        return $this->geoProductOrderService->download($id);
    }

    /**
     * @description Check Geo Product order status
     */
    public function status($id)
    {
        $response = $this->geoProductOrderService->status($id);

        return $this->successResponse($response);
    }

    /**
     * @description Update Geo Product order payment status
     */
    public function updateOrderStatus(GeoProductOrderStoreRequest $request, $id)
    {
        $geoProductValues = $this->camelToSnakeArrayKeys($request->validated());

        $geoProduct = $this->geoProductOrderService->updateGeoProductOrderStatus($id, $geoProductValues);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProduct->toArray()));
    }

    /**
     * @description Update Geo Product order status
     */
    public function statusUpdate($id, Request $request)
    {
        $status = $request->input('status');

        $geoProduct = $this->geoProductOrderService->statusUpdate($id, $status);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProduct->toArray()));
    }
}
