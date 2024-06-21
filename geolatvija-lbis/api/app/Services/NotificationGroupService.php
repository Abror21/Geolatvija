<?php

namespace App\Services;

use App\Repositories\NotificationGroupRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationGroupService
 * @package App\Services
 */
class NotificationGroupService extends BaseService
{

    public function __construct
    (
        private NotificationGroupRepository $notificationGroupRepository,
    )
    {
    }

    public function store($data): Model {
        return $this->notificationGroupRepository->store($data);
    }

    public function updateOrInsert($data): Model {
        return $this->notificationGroupRepository->updateOrInsert($data);
    }

    public function all(): array|Collection {
        return $this->notificationGroupRepository->all();
    }
}
