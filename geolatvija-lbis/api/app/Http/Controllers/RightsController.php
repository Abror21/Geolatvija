<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RightsService;
use App\Http\Requests\PaginationRequest;
use App\Http\Requests\RolesDeleteRequest;
use Illuminate\Http\Response;
use App\Traits\ResponseMessages;
use App\Http\Requests\UserStoreRequest;

class RightsController extends Controller
{
    /**
     * RightsController constructor.
     * @param RightsService $userService
     */
    public function __construct(private RightsService $rightsService)
    {}

    /**
     * @description Get all Rights
     */
    public function getRights(): Response
    {
        $userGroups = $this->rightsService->getRights();

        return $this->successResponse($this->snakeToCamelArrayKeys($userGroups->toArray()));
    }

    /**
     * @description Update Right
     */
    public function update(Request $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->values);

        $userGroups = $this->rightsService->update($options);

        return $this->successResponse('Success');
    }
}
