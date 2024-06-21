<?php

namespace App\Http\Controllers;


use App\Http\Requests\PaginationRequest;
use App\Http\Requests\TooltipStoreRequest;
use App\Services\TooltipService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TooltipController extends Controller
{


    public function __construct(private TooltipService $tooltipService)
    {
    }

    /**
     * @description Get list of Tooltips
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $tooltips = $this->tooltipService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($tooltips->toArray()));
    }

    /**
     * @description Get Tooltip
     */
    public function show($id): Response
    {
        $tooltip = $this->tooltipService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($tooltip->toArray()));
    }

    /**
     * @description Create Tooltip
     */
    public function store(TooltipStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $tooltip = $this->tooltipService->store($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($tooltip->toArray()));
    }

    /**
     * @description Update Tooltip
     */
    public function update(TooltipStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $tooltip = $this->tooltipService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($tooltip->toArray()));
    }

    /**
     * @description Delete Tooltips by IDs
     */
    public function delete(Request $request): Response
    {
        $this->tooltipService->delete($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Get Tooltips
     */
    public function tooltips(): Response
    {
        $tooltips = $this->tooltipService->tooltips();

        return $this->successResponse($this->snakeToCamelArrayKeys($tooltips->toArray()));
    }


}
