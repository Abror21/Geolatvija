<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class NotificationUiMenu extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ui_menu_id',
        'notification_id',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'ui_menu_id'  => 'integer',
        'notification_id'  => 'integer',
    ];


}
