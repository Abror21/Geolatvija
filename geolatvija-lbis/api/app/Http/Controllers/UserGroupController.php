<?php

namespace App\Http\Controllers;

use App\Http\Requests\RolesStoreRequest;
use Illuminate\Http\Request;
use App\Services\UserGroupService;
use App\Http\Requests\RolesDeleteRequest;
use Illuminate\Http\Response;

class UserGroupController extends Controller
{

    public function __construct(private UserGroupService $userGroupService)
    {}

    /**
     * @description Get Roles
     */
    public function getRoles(Request $request): Response
    {
        $options = $this->camelToSnakeArrayKeys([]);

        $userGroups = $this->userGroupService->getRoles($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($userGroups->toArray()));
    }

    /**
     * @description Delete User Groups by IDs
     */
    public function delete(RolesDeleteRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $userGroups = $this->userGroupService->deleteMultiple($options['ids']);

        return $this->successResponse('Success');
    }

    /**
     * @description Create User Group
     */
    public function store(RolesStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $userGroups = $this->userGroupService->store($data);

        return $this->successResponse($userGroups->toArray());
    }

    /**
     * @description Update User Group
     */
    public function update(RolesStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $userGroups = $this->userGroupService->update($id, $data);

        return $this->successResponse($userGroups->toArray());
    }

    /**
     * @description Get User Group
     */
    public function show($id): Response
    {
        $userGroup = $this->userGroupService->show($id);

        return $this->successResponse($userGroup->toArray());
    }

    /**
     * @description Get User Groups for select field
     */
    public function userGroupSelect(Request $request): Response
    {
        $type = $request->input('type');

        $userGroups = $this->userGroupService->userGroupSelect($type);

        return $this->successResponse($userGroups->toArray());
    }
}
