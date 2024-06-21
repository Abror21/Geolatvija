<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Notification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'content',
        'public_from',
        'public_to',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'public_from' => 'datetime',
        'public_to' => 'datetime',
    ];

    protected $appends = ['is_public'];

    public function notificationUiMenus(): HasMany
    {
        return $this->hasMany(NotificationUiMenu::class);
    }

    public function getIsPublicAttribute(): bool
    {
        if (isset($this->attributes['public_from'])) {
            if (isset($this->attributes['public_to'])) {
                return Carbon::now()->isBetween(Carbon::parse($this->attributes['public_from']), Carbon::parse($this->attributes['public_to']));
            }
            return Carbon::now()->isBetween(Carbon::now(), Carbon::parse($this->attributes['public_from']));
        }
        return false;
    }
}
