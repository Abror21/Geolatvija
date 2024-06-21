<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdateRequest;
use App\Models\Attachment;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Requests\PaginationRequest;
use Illuminate\Http\Response;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UsersDeleteRequest;

class UserController extends Controller
{
    /**
     * UserController constructor.
     * @param UserService $userService
     */
    public function __construct(private readonly UserService $userService)
    {
    }

    /**
     * @description Get session data
     */
    public function me(Request $request): Response
    {
        $role = $request->user();

        $user = $this->userService->me($role->user_id);

        return $this->successResponse($this->snakeToCamelArrayKeys($user->toArray()));
    }

    /**
     * @description Get list of Users
     */
    public function getUsers(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $users = $this->userService->getUsers($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($users->toArray()));
    }

    /**
     * @description Get User
     */
    public function show($id): Response
    {
        $user = $this->userService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($user->toArray()));
    }

    /**
     * @description Create User
     */
    public function store(UserStoreRequest $request): Response
    {
        $params = $this->camelToSnakeArrayKeys($request->validated());

        $user = $this->userService->store($params);

        return $this->successResponse($this->snakeToCamelArrayKeys($user->toArray()));
    }

    /**
     * @description Update User Account
     */
    public function updateAccount(UserUpdateRequest $request): Response
    {
        $params = $this->camelToSnakeArrayKeys($request->validated());

        $role = $request->user();

        $user = $this->userService->updateAccount($role, $params);

        return $this->successResponse($this->snakeToCamelArrayKeys($user->toArray()));
    }

    /**
     * @description Update User
     */
    public function update(UserStoreRequest $request, $id): Response
    {
        $params = $this->camelToSnakeArrayKeys($request->validated());

        $user = $this->userService->update($id, $params);

        return $this->successResponse($this->snakeToCamelArrayKeys($user->toArray()));
    }

    /**
     * @description Delete Users by IDs
     */
    public function delete(UsersDeleteRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $userGroups = $this->userService->deleteMultiple($options['ids']);

        return $this->successResponse('Success');
    }

    /**
     * @description Update User active till field (extend active till field)
     */
    public function extend(UsersDeleteRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $userGroups = $this->userService->extend($options['ids']);

        return $this->successResponse('Success');
    }

    /**
     * @param Request $request
     * @return Response
     * @throws \Exception
     * @description Get Users for select field
     */
    public function select(Request $request): Response
    {
        $options = $request->only('role', 'roleId', 'type');
        $response = $this->userService->select($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($response));
    }
}
