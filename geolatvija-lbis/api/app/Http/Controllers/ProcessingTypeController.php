<?php

namespace App\Http\Controllers;

use App\Enums\SystemSettingTypes;
use App\Http\Requests\PaginationRequest;
use App\Http\Requests\ProcessingTypeStoreRequest;
use App\Services\ProcessingTypeService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProcessingTypeController extends Controller
{


    public function __construct(private ProcessingTypeService $processingTypeService)
    {
    }

    /**
     * @description Get list of Processing Types
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $systemSettingsList = $this->processingTypeService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSettingsList->toArray()));
    }

    /**
     * @description Get Processing Type
     */
    public function show($id): Response
    {
        $systemSetting = $this->processingTypeService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Create Processing Type
     */
    public function store(ProcessingTypeStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $systemSetting = $this->processingTypeService->store($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Update Processing Type
     */
    public function update(ProcessingTypeStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $systemSetting = $this->processingTypeService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Delete Processing Types by IDs
     */
    public function delete(Request $request): Response
    {
        $this->processingTypeService->delete($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Get Processing Types for select field
     */
    public function select(): Response
    {
        $response = $this->processingTypeService->select();

        return $this->successResponse($this->snakeToCamelArrayKeys($response->toArray()));
    }

}
