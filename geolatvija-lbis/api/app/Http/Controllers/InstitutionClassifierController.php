<?php

namespace App\Http\Controllers;

use App\Http\Requests\InstitutionClassifierStoreRequest;
use App\Http\Requests\PaginationRequest;
use App\Services\InstitutionClassifierService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InstitutionClassifierController extends Controller
{


    public function __construct(private InstitutionClassifierService $institutionClassifierService)
    {
    }

    /**
     * @description Get list of Institution Classifiers
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());
        $classifierValues = $this->institutionClassifierService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifierValues->toArray()));
    }

    /**
     * @description Update Institution Classifier
     */
    public function update(InstitutionClassifierStoreRequest $request, $classifierValueId)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $this->institutionClassifierService->update($classifierValueId, $data);
    }

    /**
     * @description Create Institution Classifier
     */
    public function store(InstitutionClassifierStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $classifierValue = $this->institutionClassifierService->store($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifierValue->toArray()));
    }

    /**
     * @description Get Institution Classifier
     */
    public function show($classifierValueId): Response
    {
        $classifierValue = $this->institutionClassifierService->show($classifierValueId);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifierValue->toArray()));
    }


    /**
     * @description Get Institution Classifiers for select field
     */
    public function select(Request $request): Response|JsonResponse
    {
        $type = $request->input('type');

        $getClassifierValues = $this->institutionClassifierService->select($type);

        return $this->successResponse($this->snakeToCamelArrayKeys($getClassifierValues->toArray()));
    }

    /**
     * @description Delete Institution Classifiers by IDs
     */
    public function deleteInstitutionClassifiers(Request $request): Response|JsonResponse
    {
        $this->institutionClassifierService->deleteInstitutionClassifiers($request->input('ids'));

        return $this->successResponse(true);
    }

}
