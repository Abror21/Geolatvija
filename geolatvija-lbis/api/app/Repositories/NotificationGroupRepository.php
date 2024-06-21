<?php

namespace App\Repositories;

use App\Models\NotificationGroup;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationGroupRepository
 * @package App\Repositories
 */
class NotificationGroupRepository extends BaseRepository
{

    /**
     * NotificationGroupRepository constructor.
     * @param NotificationGroup $notificationGroup
     */
    public function __construct(NotificationGroup $notificationGroup)
    {
        parent::__construct($notificationGroup);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new NotificationGroup();
    }


    public function updateOrInsert(array $data): Model
    {
        $uniqueValue = $data['tapis_id'];

        $existingModel = NotificationGroup::where('tapis_id', $uniqueValue)->first();

        if ($existingModel) {
            $existingModel->update($data);
            return $existingModel;
        } else {
            return NotificationGroup::create($data);
        }
    }

    public function findByIds(array $ids)
    {
        return NotificationGroup::whereIn('id', $ids)->get();
    }
}
