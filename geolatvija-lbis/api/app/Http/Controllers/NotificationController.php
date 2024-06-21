<?php

namespace App\Http\Controllers;

use App\Http\Requests\NotificationStoreRequest;
use App\Http\Requests\PaginationRequest;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{

    public function __construct(private NotificationService $notificationService)
    {
    }

    /**
     * @description Get list of Notifications
     */
    public function getNotificationList(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $notificationList = $this->notificationService->getNotificationList($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($notificationList->toArray()));
    }

    /**
     * @description Get list of public Notifications
     */
    public function getPublicNotificationList()
    {
        $notificationList = $this->notificationService->getPublicNotificationList();

        return $this->successResponse($notificationList);
    }

    /**
     * @description Create Notification
     */
    public function storeNotification(NotificationStoreRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $notification = $this->notificationService->storeNotification($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($notification->toArray()));
    }

    /**
     * @description Get Notification
     */
    public function getNotification($id): Response
    {
        $notification = $this->notificationService->getNotification($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($notification->toArray()));
    }

    /**
     * @description Update Notification
     */
    public function updateNotification(NotificationStoreRequest $request, $id): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $notification = $this->notificationService->updateNotification($id, $options);

        return $this->successResponse($this->snakeToCamelArrayKeys($notification->toArray()));
    }

    /**
     * @description Delete Notifications by IDs
     */
    public function deleteNotifications(Request $request): Response
    {
        $this->notificationService->deleteNotifications($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Publish Notification
     */
    public function publishNotification($id): Response
    {
        $notification = $this->notificationService->publishNotification($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($notification->toArray()));
    }

    /**
     * @description Unpublish Notification
     */
    public function unpublishNotification($id): Response
    {
        $notification = $this->notificationService->unpublishNotification($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($notification->toArray()));
    }

}
