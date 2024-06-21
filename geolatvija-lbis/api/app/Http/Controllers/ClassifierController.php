<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClassifierStoreRequest;
use App\Http\Requests\ClassifierUpdateRequest;
use App\Http\Requests\ClassifierValueStoreRequest;
use App\Http\Requests\PaginationRequest;
use App\Services\ClassifierService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClassifierController extends Controller
{

    /**
     * ClassifierController constructor.
     * @param ClassifierService $classifierService
     */
    public function __construct(private ClassifierService $classifierService)
    {
    }

    /**
     * @description Get Classifier by ID
     */
    public function getClassifierById($id): Response
    {
        $classifier = $this->classifierService->getClassifierById($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifier->toArray()));
    }


    /**
     * @description Get list of Classifiers
     */
    public function getClassifiersList(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $classifiers = $this->classifierService->getClassifiersList($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifiers->toArray()));
    }

    /**
     * @description Get list of Classifiers Values
     */
    public function getClassifiersValuesList(PaginationRequest $request, $id): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());
        $classifierValues = $this->classifierService->getClassifiersValuesList($id, $options);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifierValues->toArray()));
    }

    /**
     * @description Update Classifier
     */
    public function updateClassifier(ClassifierUpdateRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $classifier = $this->classifierService->updateClassifier($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifier->toArray()));
    }

    /**
     * @description Update Classifier Value
     */
    public function updateClassifierValue(ClassifierValueStoreRequest $request, $classifierId, $classifierValueId)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $this->classifierService->updateClassifierValue($classifierId, $classifierValueId, $data);
    }

    /**
     * @description Create Classifier Value
     */
    public function storeClassifierValue(ClassifierValueStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $classifierValue = $this->classifierService->storeClassifierValue($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifierValue->toArray()));
    }

    /**
     * @description Get Classifier Value
     */
    public function getClassifierValue($classifierId, $classifierValueId): Response
    {
        $classifierValue = $this->classifierService->getClassifierValue($classifierId, $classifierValueId);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifierValue->toArray()));
    }

    /**
     * @description Create Classifier
     */
    public function storeClassifier(ClassifierStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());
        $classifier = $this->classifierService->storeClassifier($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($classifier->toArray()));
    }

    /**
     * @description Get Classifier Values for Select field
     */
    public function getClassifierValuesForSelect($code): Response|JsonResponse
    {
        $getClassifierValues = $this->classifierService->getClassifierValuesForSelect($code);

        return $this->successResponse($this->snakeToCamelArrayKeys($getClassifierValues->toArray()));
    }

    /**
     * @description Delete Classifiers by IDs
     */
    public function deleteClassifiers(Request $request): Response
    {
        $this->classifierService->deleteClassifiers($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Delete Classifier Values by IDs
     */
    public function deleteClassifierValues(Request $request): Response
    {
        $this->classifierService->deleteClassifierValues($request->input('ids'));

        return $this->successResponse(true);
    }
}
