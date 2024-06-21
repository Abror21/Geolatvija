<?php

namespace App\Http\Controllers;


use App\Http\Requests\PaginationRequest;
use App\Http\Requests\ThematicUserGroupStoreRequest;
use App\Services\ThematicUserGroupService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ThematicUserGroupController extends Controller
{


    public function __construct(private ThematicUserGroupService $thematicUserGroupService)
    {
    }

    /**
     * @description Get list of Thematic User Groups
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $thematicUserGroups = $this->thematicUserGroupService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($thematicUserGroups->toArray()));
    }

    /**
     * @description Get Thematic User Group
     */
    public function show($id): Response
    {
        $thematicUserGroup = $this->thematicUserGroupService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($thematicUserGroup->toArray()));
    }

    /**
     * @description Create Thematic User Group
     */
    public function store(ThematicUserGroupStoreRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $thematicUserGroup = $this->thematicUserGroupService->store($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($thematicUserGroup->toArray()));
    }

    /**
     * @description Update Thematic User Group
     */
    public function update(ThematicUserGroupStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $thematicUserGroup = $this->thematicUserGroupService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($thematicUserGroup->toArray()));
    }

    /**
     * @description Delete Thematic User Groups by IDs
     */
    public function delete(Request $request): Response
    {
        $this->thematicUserGroupService->delete($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Search user by type
     */
    public function searchUser(Request $request): Response
    {
        $type = $request->input('userTypeClassifierValueId');
        $search = $request->input('number');

        $user = $this->thematicUserGroupService->searchUser($type, $search);

        return $this->successResponse($this->snakeToCamelArrayKeys($user->toArray()));
    }

    /**
     * @description Get Thematic User Groups for select field
     */
    public function select(): Response
    {
        $thematicGroups = $this->thematicUserGroupService->select();

        return $this->successResponse($thematicGroups);
    }

}
