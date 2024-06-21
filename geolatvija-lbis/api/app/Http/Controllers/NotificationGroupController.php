<?php

namespace App\Http\Controllers;

use App\Services\NotificationGroupService;
use Illuminate\Database\Eloquent\Collection;

class NotificationGroupController extends Controller
{
    public function __construct(private readonly NotificationGroupService $notificationGroupService)
    {
    }

    /**
     * @description Get all Notification Groups
     */
    public function all(): array|Collection
    {
        return $this->notificationGroupService->all();
    }
}
