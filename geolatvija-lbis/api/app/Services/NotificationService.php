<?php

namespace App\Services;

use App\Repositories\NotificationRepository;
use App\Repositories\NotificationUiMenuRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationService
 * @package App\Services
 */
class NotificationService extends BaseService
{

    public function __construct
    (
        private NotificationRepository       $notificationRepository,
        private NotificationUiMenuRepository $notificationUiMenuRepository
    )
    {
    }

    public function getNotificationList($options)
    {
        return $this->notificationRepository->getNotificationList($options);
    }

    public function getPublicNotificationList()
    {
        $notifications = $this->notificationRepository->getPublicNotificationList();

        $notifications = $notifications->groupBy('unique_key')->map(function ($group) {
            return $group->map->only(['id', 'content']);
        });

        return $notifications;
    }

    public function storeNotification($data): Model
    {
        $notification = $this->notificationRepository->store($data);

        foreach ($data['ui_menu_ids'] as $uiMenuId) {
            $data = [
                'ui_menu_id' => $uiMenuId,
                'notification_id' => $notification->id
            ];

            $this->notificationUiMenuRepository->store($data);
        }

        return $notification;
    }

    public function getNotification($id): Model
    {
        $notification = $this->notificationRepository->findById($id, ['notificationUiMenus']);

        $notificationUiMenus = $notification->notificationUiMenus->toArray();
        $menuIds = [];
        foreach ($notificationUiMenus as $notificationUiMenu) {
            $menuIds[] = $notificationUiMenu['ui_menu_id'];
        }

        $notification->ui_menu_ids = $menuIds;
        unset($notification->notificationUiMenus); // remove unnecessary data for frontend

        return $notification;
    }


    public function updateNotification($id, $data): Model
    {
        $notification = $this->notificationRepository->update($id, $data);

        $findUiMenus = $this->notificationUiMenuRepository->findBy('notification_id', $id, true);

        $actualIndex = 0;
        //update existing or delete unnecessary
        foreach ($findUiMenus as $index => $uiMenu) {
            if (isset($data['ui_menu_ids'][$index])) {
                $uiMenu->ui_menu_id = $data['ui_menu_ids'][$index];
                $uiMenu->update();
            } else {
                $uiMenu->delete();
            }
            $actualIndex += 1;
        }

        //create while new entries
        while (isset($data['ui_menu_ids'][$actualIndex])) {
            $notificationUiMenu = [
                'ui_menu_id' => $data['ui_menu_ids'][$actualIndex],
                'notification_id' => $notification->id
            ];

            $this->notificationUiMenuRepository->store($notificationUiMenu);

            $actualIndex += 1;
        }

        return $notification;
    }

    public function deleteNotifications($ids): bool
    {
        foreach ($ids as $id) {
            $this->notificationUiMenuRepository->findBy('notification_id', $id, true)->each(function ($uiMenu) {
                $uiMenu->delete();
            });

            $this->notificationRepository->findById($id)->delete();
        }

        return true;
    }

    public function publishNotification($id): Model
    {
        $notification = $this->notificationRepository->findById($id);

        if ($notification->is_public) {
            $notification->public_to = Carbon::now();
        } else {
            $notification->public_from = Carbon::now();
            $notification->public_to = null;
        }

        $notification->update();

        return $notification;
    }

    public function unpublishNotification($id): Model
    {
        $notification = $this->notificationRepository->findById($id);

        $notification->public_from = null;
        $notification->public_to =  null;
        $notification->update();

        return $notification;
    }
}
