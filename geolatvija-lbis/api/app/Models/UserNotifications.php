<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserNotifications extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'radius',
        'address',
        'coord_l_k_s_lat',
        'coord_l_k_s_long',
        'sent_to_tapis',
        'deleted_in_tapis',
        'deleted_in_tapis_at',
        'tapis_id',
    ];

    protected $casts = [
        'coord_l_k_s_lat' => 'float',
        'coord_l_k_s_long' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function notificationGroups(): BelongsToMany
    {
        return $this->belongsToMany(NotificationGroup::class, 'user_notification_notification_group', 'user_notification_id', 'notification_group_id');
    }
}
