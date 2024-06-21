<?php

namespace App\Repositories;

use App\Models\NotificationGroup;
use App\Models\UserNotifications;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationRepository
 * @package App\Repositories
 */
class UserNotificationRepository extends BaseRepository
{

    /**
     * NotificationRepository constructor.
     * @param UserNotifications $userNotification
     */
    public function __construct(UserNotifications $userNotification)
    {
        parent::__construct($userNotification);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new UserNotifications();
    }


    public function getUserNotificationsList($userId, $options): mixed
    {

        return UserNotifications::with('notificationGroups')
            ->select('user_notifications.*')
            ->when(isset($options['filter']['name']), function ($query) use ($options) {
                return $query->where('user_notifications.name', 'LIKE', '%' . $options['filter']['name'] . '%');
            })
            ->join('users', 'users.id', 'user_notifications.user_id')
            ->where('user_id', '=', $userId)
            ->paginate($options['pageSize'] ?? 10);

    }

    public function addNotificationGroups($model, array $notificationGroups)
    {
        $model->notificationGroups()->attach($notificationGroups);

        return true;
    }

    public function updateNotificationGroups($model, array $notificationGroups)
    {
        $model->notificationGroups()->sync($notificationGroups);

        return true;
    }

    public function updateOrInsertDataFromTapis(array $data): mixed
    {
        $uniqueTapisId= $data['tapis_id'];
        $existingModel = UserNotifications::where('tapis_id', $uniqueTapisId)->first();

        $tapisIds = $data['notification_groups'];
        $notificationGroupIds = NotificationGroup::whereIn('tapis_id', $tapisIds)->pluck('id')->toArray();

        if ($existingModel) {
            $existingModel->update($data);

            $existingModel->notificationGroups()->sync($notificationGroupIds);

            return UserNotifications::with('notificationGroups')->find($existingModel->getKey());
        } else {
            $model = $this->create();
            $model->fill($data);
            $model->save();
            $model->notificationGroups()->attach($notificationGroupIds);

            return UserNotifications::with('notificationGroups')->find($model->getKey());
        }
    }
}
