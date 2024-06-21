<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class NotificationGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'planning_level',
        'date_from',
        'date_to',
        'position',
        'tapis_id',
    ];

    public function userNotifications(): BelongsToMany
    {
        return $this->belongsToMany(UserNotifications::class, 'user_notification_notification_group', 'notification_group_id', 'user_notification_id');
    }
}
