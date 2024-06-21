<?php

namespace App\Repositories;

use Carbon\Carbon;
use App\Models\Notification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Class NotificationRepository
 * @package App\Repositories
 */
class NotificationRepository extends BaseRepository
{

    /**
     * NotificationRepository constructor.
     * @param Notification $notification
     */
    public function __construct(Notification $notification)
    {
        parent::__construct($notification);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Notification();
    }


    public function getNotificationList($options): mixed
    {
        return Notification::select([
            'notifications.*',
            DB::raw("string_agg(ui_menus.translation, ', ') as ui_menus")
        ])
            ->leftJoin('notification_ui_menus', 'notification_ui_menus.notification_id', '=', 'notifications.id')
            ->leftJoin('ui_menus', 'ui_menus.id', '=', 'notification_ui_menus.ui_menu_id')
            ->when(isset($options['sort_by']), function ($query) use ($options) {
                return $query->orderBy($this->parseOrderBy($options['sort_by']), $options['order_by'] ?? 'ASC');
            })

            ->groupBy("notifications.id")
            ->paginate($options["page_size"] ?? 10);
    }

    public function getPublicNotificationList()
    {
        return Notification::select([
            'notifications.id',
            'notifications.content',
            'ui_menus.unique_key'
        ])
            ->leftJoin('notification_ui_menus', 'notification_ui_menus.notification_id', '=', 'notifications.id')
            ->leftJoin('ui_menus', 'ui_menus.id', '=', 'notification_ui_menus.ui_menu_id')
            ->where('notifications.public_from', '<=', Carbon::now())
            ->where(function ($query) {
                $query->where('notifications.public_to', '>=', Carbon::now())
                ->orWhereNull('notifications.public_to');
            })
            ->orderBy('notifications.id', 'DESC')
            ->get();
    }

}
