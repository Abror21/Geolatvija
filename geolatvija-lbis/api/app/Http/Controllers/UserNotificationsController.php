<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginationRequest;
use App\Http\Requests\UserNotificationsRequest;
use App\Services\UserNotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserNotificationsController extends Controller
{

    public function __construct(private UserNotificationService $userNotificationService)
    {
    }

    /**
     * Display a listing of the resource.
     * @description Get list of User Notifications
     */
    public function index(PaginationRequest $request)
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $notificationList = $this->userNotificationService->getUserNotificationList($request->user()->user_id, $options);

        return $this->successResponse($this->snakeToCamelArrayKeys($notificationList->toArray()));
    }

    /**
     * Store a newly created resource in storage.
     * @description Create User Notification
     */
    public function store(UserNotificationsRequest $request)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $data['radius'] = (float)$data['radius'];
        $data['coord_l_k_s_long'] = (float)$data['coord_l_k_s_long'];
        $data['coord_l_k_s_lat'] = (float)$data['coord_l_k_s_lat'];

        $dataForStoring = $this->userNotificationService->storeUserNotification($request->user()->user_id, $request->user()->user->personal_code, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($dataForStoring->toArray()));
    }

    /**
     * Update the specified resource in storage.
     * @description Update User Notification
     */
    public function update(UserNotificationsRequest $request, $id)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());
        $data['user_id'] = $request->user()->user_id;

        $userNotification = $this->userNotificationService->updateUserNotification($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($userNotification->toArray()));
    }

    /**
     * Remove the specified resource from storage.
     * @description Delete User Notifications by IDs
     */
    public function delete(Request $request)
    {
        $this->userNotificationService->deleteUserNotifications($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Get User Notification
     */
    public function show($id): Response
    {
        $userNotification = $this->userNotificationService->showUserNotification($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($userNotification->toArray()));
    }
}
