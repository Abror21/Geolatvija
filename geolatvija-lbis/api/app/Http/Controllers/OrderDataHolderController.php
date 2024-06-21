<?php

namespace App\Http\Controllers;


use App\Http\Requests\PaginationRequest;
use App\Services\OrderDataHolderService;
use Illuminate\Http\Response;

class OrderDataHolderController extends Controller
{

    public function __construct(private OrderDataHolderService $orderDataHolderService)
    {
    }

    /**
     * @description Get list of Data Holder orders
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $notificationList = $this->orderDataHolderService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($notificationList->toArray()));
    }

    /**
     * @param $id
     * @return Response
     * @description Get Data Holder order
     */
    public function show($id): Response
    {
        $orderData = $this->orderDataHolderService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($orderData->toArray()));
    }
}
