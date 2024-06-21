<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginationRequest;
use App\Http\Requests\UserEmbedsRequest;
use App\Imports\EmbedImport;
use App\Services\UserEmbedService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;

class UserEmbedsController extends Controller
{

    public function __construct(private UserEmbedService $userEmbedService)
    {
    }

    /**
     * Display a listing of the resource.
     * @description Get list of User Embeds
     */
    public function index(PaginationRequest $request)
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $embedsList = $this->userEmbedService->getUserEmbedList($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($embedsList->toArray()));
    }

    /**
     * Store a newly created resource in storage.
     * @description Create User Embed
     */
    public function store(UserEmbedsRequest $request)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $dataForStoring = $this->userEmbedService->storeUserEmbed($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($dataForStoring->toArray()));
    }

    /**
     * Update the specified resource in storage.
     * @description Update user Embed
     */
    public function update(UserEmbedsRequest $request, $id)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $userEmbed = $this->userEmbedService->updateUserEmbed($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($userEmbed->toArray()));
    }

    /**
     * Remove the specified resource from storage.
     * @description Delete User Embeds by IDs
     */
    public function delete(Request $request)
    {
        $this->userEmbedService->deleteUserEmbeds($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Get User Embed
     */
    public function show($id): Response
    {
        $userEmbed = $this->userEmbedService->showUserEmbed($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($userEmbed->toArray()));
    }
    /**
     * @description Get User Embed by UUID
     */
    public function uuid($uuid): Response
    {
        $userEmbed = $this->userEmbedService->uuid($uuid);

        return $this->successResponse($this->snakeToCamelArrayKeys($userEmbed));
    }

}
