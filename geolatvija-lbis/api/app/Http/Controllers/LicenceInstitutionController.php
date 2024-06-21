<?php

namespace App\Http\Controllers;


use App\Http\Requests\PaginationRequest;
use App\Http\Requests\LicenceInstitutionStoreRequest;
use App\Services\LicenceInstitutionService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LicenceInstitutionController extends Controller
{


    public function __construct(private LicenceInstitutionService $licenceInstitutionService)
    {
    }

    /**
     * @description Get list of Institution Licences
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $licences = $this->licenceInstitutionService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($licences->toArray()));
    }

    /**
     * @description Get Institution Licence
     */
    public function show($id): Response
    {
        $licence = $this->licenceInstitutionService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($licence->toArray()));
    }

    /**
     * @description Create Institution Licence
     */
    public function store(LicenceInstitutionStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $licences = $this->licenceInstitutionService->store($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($licences->toArray()));
    }

    /**
     * @description Update Institution Licence
     */
    public function update(LicenceInstitutionStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $licences = $this->licenceInstitutionService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($licences->toArray()));
    }

    /**
     * @description Delete Institution Licences by IDs
     */
    public function delete(Request $request): Response
    {
        $this->licenceInstitutionService->delete($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Publish/Unpublish Institution Licence
     */
    public function public(Request $request, $id): Response
    {
        $this->licenceInstitutionService->public($id, $request->input('isPublic'));

        return $this->successResponse(true);
    }

    /**
     * @description Get Institution Licences for select field
     */
    public function select(Request $request): Response
    {
        $licences = $this->licenceInstitutionService->select($request->input('type'));

        return $this->successResponse($this->snakeToCamelArrayKeys($licences->toArray()));
    }
}
