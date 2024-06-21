<?php


namespace App\Services;

use App\Repositories\NotificationGroupRepository;
use App\Repositories\PublicDiscussionCommentAnswerRepository;
use App\Repositories\UserNotificationRepository;
use App\Services\API\APIOuterAPI;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationService
 * @package App\Services
 */
class UserNotificationService extends BaseService
{

    public function __construct
    (
        private readonly APIOuterAPI $APIOuterAPI,
        private readonly UserNotificationRepository $userNotificationRepository,
        private readonly NotificationGroupRepository $notificationGroupRepository,
        private readonly UserService $userService,
        private readonly PublicDiscussionCommentAnswerRepository $publicDiscussionCommentAnswerRepository
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    public function getUserNotificationList($userId, $options)
    {
        return $this->userNotificationRepository->getUserNotificationsList($userId, $options);

    }

    public function storeUserNotification($id, $personalCode, $data)
    {
        $activeRole = $this->userNotificationRepository->activeRole();

        $physicalPerson = $activeRole->userGroup->code == 'authenticated';

        if (!$physicalPerson) {
            throw new \Exception('validation.only_physical_person_allowed');
        }

        if (!$activeRole->email_verified) {
            throw new \Exception('validation.email_not_verified');
        }

        $data['user_id'] = $id;
        $data['personal_code'] = $personalCode;

        try {
            $localResponse = $this->userNotificationRepository->store($data);

            $notificationGroupsAdded = $this->userNotificationRepository->addNotificationGroups($localResponse, $data['notification_groups']);

            if (!$localResponse->wasRecentlyCreated) {
                throw new \Exception('Failed to create user notification locally');
            }

            if (!$notificationGroupsAdded) {
                throw new \Exception('Failed to add notification groups to user notification locally');
            }

            $notificationGroups = $this->notificationGroupRepository->findByIds($data['notification_groups']);
            $notificationGroupsArray = $notificationGroups->toArray();
            $notificationTapisIds = array_map(function ($notificationGroup) {
                return $notificationGroup['tapis_id'];
            }, $notificationGroupsArray);
            $data['notification_groups'] = $notificationTapisIds;

            $tapisResponse = $this->APIOuterAPI->call(
                'api/v1/tapis/create-user-notification',
                $data,
                "POST",
                $this->headers
            );

            if (isset($tapisResponse['Success']) && !$tapisResponse['Success']) {
                throw new \Exception(implode(', ', $tapisResponse['Errors']));
            } else if (isset($tapisResponse['Success'])) {
                $this->userNotificationRepository->update($localResponse->getKey(), [
                    'tapis_id' => $tapisResponse['Id'],
                    'sent_to_tapis' => true,
                ]);
            }

            return $this->userNotificationRepository->findById($localResponse->getKey(), ['notificationGroups']);
        } catch (\Exception $e) {
            throw $e;
        }
    }


    public function showUserNotification($id)
    {
        return $this->userNotificationRepository->findById($id, ['notificationGroups']);
    }

    public function updateUserNotification($id, $data): Model
    {
        $activeRole = $this->userNotificationRepository->activeRole();

        $physicalPerson = $activeRole->userGroup->code == 'authenticated';

        if (!$physicalPerson) {
            throw new \Exception('validation.only_physical_person_allowed');
        }

        if (!$activeRole->email_verified) {
            throw new \Exception('validation.email_not_verified');
        }

        $data['sent_to_tapis'] = false;
        $response = $this->userNotificationRepository->update($id, $data);
        $notificationGroupsSynced = $this->userNotificationRepository->updateNotificationGroups($response, $data['notification_groups']);

        if (!$notificationGroupsSynced) {
            throw new \Exception('Failed to update notification groups to user notification locally');
        }

        $notificationGroups = $this->notificationGroupRepository->findByIds($data['notification_groups']);
        $notificationGroupsArray = $notificationGroups->toArray();
        $notificationTapisIds = array_map(function ($notificationGroup) {
            return $notificationGroup['tapis_id'];
        }, $notificationGroupsArray);
        $data['notification_groups'] = $notificationTapisIds;

        $tapisResponse = $this->APIOuterAPI->call(
            'api/v1/tapis/update-user-notification/' . $response['tapis_id'],
            $data,
            "PUT",
            $this->headers
        );

        if (isset($tapisResponse['Success']) && $tapisResponse['Success']) {
            $this->userNotificationRepository->update($response->getKey(), ['sent_to_tapis' => true]);
        }

        return $response;
    }

    public function sendUpdateNotificationToTapis(Model $data): bool
    {
        $notificationGroups = $this->notificationGroupRepository->findByIds($data->notificationGroups->pluck('id')->toArray());
        $notificationGroupsArray = $notificationGroups->toArray();
        $notificationTapisIds = array_map(function ($notificationGroup) {
            return $notificationGroup['tapis_id'];
        }, $notificationGroupsArray);
        $data['notification_group_ids'] = $notificationTapisIds;

        $tapisResponse = $this->APIOuterAPI->call(
            'api/v1/tapis/update-user-notification/' . $data->tapis_id,
            $data,
            "PUT",
            $this->headers
        );

        if (isset($tapisResponse['Success']) && $tapisResponse['Success']) {
            $this->userNotificationRepository->update($data->getKey(), ['sent_to_tapis' => true]);
        }

        return true;
    }

    public function sendCreateNotificationToTapis(Model $notification): bool
    {
        $personalCode = $notification->user->personal_code;

        $notification['personal_code'] = $personalCode;


        $notificationGroups = $this->notificationGroupRepository->findByIds($notification->notificationGroups->pluck('id')->toArray());
        $notificationGroupsArray = $notificationGroups->toArray();
        $notificationTapisIds = array_map(function ($notificationGroup) {
            return $notificationGroup['tapis_id'];
        }, $notificationGroupsArray);
        $notification['notification_group_ids'] = $notificationTapisIds;

        $tapisResponse = $this->APIOuterAPI->call(
            'api/v1/tapis/create-user-notification',
            $notification,
            "POST",
            $this->headers
        );

        if (isset($tapisResponse['Success']) && $tapisResponse['Success']) {
            $this->userNotificationRepository->update($notification->getKey(), [
                'tapis_id' => $tapisResponse['Id'],
                'sent_to_tapis' => true,
            ]);
        }

        return true;
    }

    public function deleteUserNotifications(array $ids): bool
    {
        foreach ($ids as $id) {
            $this->deleteUserNotification($id);
        }

        return true;
    }

    public function updateDeletedNotification(bool $inTapisDeleted, $notification): bool
    {
        if ($inTapisDeleted) {
            $notification->update([
                'deleted_in_tapis' => true,
                'deleted_in_tapis_at' => now(),
                'sent_to_tapis' => true,
                'tapis_id' => null,
            ]);
        } else {
            $notification->update([
                'sent_to_tapis' => false,
            ]);
        }

        return true;
    }

    public function sendDeleteUserNotificationToTapis($id): bool
    {
        $notification = $this->userNotificationRepository->findTrashedById($id);

        if ($notification && $notification->tapis_id && !$notification->deleted_in_tapis) {
            $tapisResponse = $this->APIOuterAPI->call(
                'api/v1/tapis/delete-user-notification/' . $notification->tapis_id,
                [],
                "DELETE",
                $this->headers
            );

            $this->updateDeletedNotification(isset($tapisResponse['Success']) && $tapisResponse['Success'], $notification);
        }

        return true;
    }

    public function deleteUserNotification($id): bool
    {
        $notification = $this->userNotificationRepository->findById($id);

        if ($notification && $notification->tapis_id && !$notification->deleted_in_tapis) {
            $tapisResponse = $this->APIOuterAPI->call(
                'api/v1/tapis/delete-user-notification/' . $notification->tapis_id,
                [],
                "DELETE",
                $this->headers
            );

            $this->updateDeletedNotification(isset($tapisResponse['Success']) && $tapisResponse['Success'], $notification);
        } else if ($notification && !$notification->sent_to_tapis) {
            $this->updateDeletedNotification(true, $notification);
        }

        $notification->delete();

        return true;
    }

    public function syncUserNotificationsFromTapis(array $data, string $personalCode, bool $deleteNonTapisNotifications = false)
    {
        if (isset($data['Success']) && !$data['Success']) {
            throw new \Exception("Tapis reported errors: " . implode(", ", $data['Errors']));
        }

        $_personalCode = str_replace('-', '', $personalCode);
        $user = $this->userService->getUserByPersonalCode($_personalCode);

        if ($user) {
            $userId = $user->getKey();

            if ($deleteNonTapisNotifications) {
                $userNotifications = $user->userNotifications;
                $tapisNotifications = collect($data['UserSubscriptionGroups']);

                $filteredUserNotifications = $userNotifications->filter(function ($notification) use ($tapisNotifications) {
                    return !$tapisNotifications->contains('Id', $notification->tapis_id);
                });

                foreach ($filteredUserNotifications as $filteredNotification) {
                    $filteredNotification->notificationGroups()->detach();
                    $filteredNotification->delete();
                }
            }

            $returnData = [];
            foreach ($data['UserSubscriptionGroups'] as $subscriptionGroup) {
                $tapisData = $this->prepareTapisData($subscriptionGroup, $userId);
                $returnData[] = $this->userNotificationRepository->updateOrInsertDataFromTapis($tapisData);
            }

            return $returnData;
        } else {
            throw new \Exception("User not found for personal code: $_personalCode");
        }
    }

    private function prepareTapisData(array $subscriptionGroup, $userId): array
    {
        $territory = $subscriptionGroup['CustomSubscriptionTerritories'][0];
        return [
            'user_id' => $userId,
            'tapis_id' => $subscriptionGroup['Id'],
            'notification_groups' => $subscriptionGroup['NotificationSubscriptionGroupIds'],
            'name' => $territory['Name'],
            'radius' => $territory['Radius'],
            'coord_l_k_s_long' => $territory['CoordX'],
            'coord_l_k_s_lat' => $territory['CoordY'],
            'sent_to_tapis' => true,
        ];
    }

    public function syncDiscussionAnswers($user)
    {
        $discussions = $this->APIOuterAPI->call(
            'api/v1/tapis/get-discussion-answer',
            ['commenter_code' => $user->personal_code],
            "GET",
            $this->headers
        );

        if (isset($discussions['data'])) {
            foreach ($discussions['data'] as $discussion) {
                $hasAlready = $this->publicDiscussionCommentAnswerRepository->findUnique($discussion['comment_id'], $discussion['decision'], $discussion['status']);

                if ($hasAlready) {
                    continue;
                }

                $parse = [
                    'user_id' => $user->id,
                    'comment_id' => $discussion['comment_id'],
                    'status' => $discussion['status'],
                    'decision' => $discussion['decision'],
                ];

                $this->publicDiscussionCommentAnswerRepository->store($parse);
            }
        }
    }

}
