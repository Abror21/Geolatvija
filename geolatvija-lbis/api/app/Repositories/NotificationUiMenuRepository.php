<?php

namespace App\Repositories;

use App\Models\NotificationUiMenu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Class NotificationUiMenuRepository
 * @package App\Repositories
 */
class NotificationUiMenuRepository extends BaseRepository
{

    /**
     * NotificationUiMenuRepository constructor.
     * @param NotificationUiMenu $notificationUiMenu
     */
    public function __construct(NotificationUiMenu $notificationUiMenu)
    {
        parent::__construct($notificationUiMenu);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new NotificationUiMenu();
    }





}
