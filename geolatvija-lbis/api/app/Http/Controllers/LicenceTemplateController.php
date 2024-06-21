<?php

namespace App\Http\Controllers;


use App\Http\Requests\PaginationRequest;
use App\Http\Requests\LicenceTemplateStoreRequest;
use App\Services\LicenceTemplateService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LicenceTemplateController extends Controller
{


    public function __construct(private LicenceTemplateService $licenceTemplateService)
    {
    }

    /**
     * @description Get list of Licence Templates
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $licenceTemplates = $this->licenceTemplateService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($licenceTemplates->toArray()));
    }

    /**
     * @description Get Licence Template
     */
    public function show($id): Response
    {
        $systemSetting = $this->licenceTemplateService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Create Licence Template
     */
    public function store(LicenceTemplateStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $systemSetting = $this->licenceTemplateService->store($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Update Licence Template
     */
    public function update(LicenceTemplateStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $systemSetting = $this->licenceTemplateService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Delete Licence Templates by IDs
     */
    public function delete(Request $request): Response
    {
        $this->licenceTemplateService->delete($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Get Licence Template masks
     */
    public function masks(): Response
    {
        $masks = $this->licenceTemplateService->masks();

        return $this->successResponse($this->snakeToCamelArrayKeys($masks->toArray()));
    }

    /**
     * @description Publish/Unpublish Licence Template
     */
    public function public(Request $request, $id): Response
    {
        $this->licenceTemplateService->public($id, $request->input('isPublic'));

        return $this->successResponse(true);
    }

}
