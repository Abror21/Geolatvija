<?php

namespace App\Models;

use App\Traits\ClassifierValueScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class User extends Model
{
    use SoftDeletes, ClassifierValueScope;

    protected $fillable = [
        'name',
        'surname',
        'personal_code',
        'status',
        'active_till',
        'status_classifier_value_id',
        'last_login',
        'default_role_id',
        'send_email',
        'full_name',
    ];

    protected $casts = [
        'active_till' => 'datetime',
        'last_login' => 'datetime',
        'status_classifier_value_id' => 'integer',
        'default_role_id' => 'integer',
        'send_email' => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->full_name) {
                $model->full_name = "$model->name $model->surname";
            }
        });
    }

    public function scopeClassifierValue($query, $column, $name = '', $prefix = '')
    {
        return $this->buildClassifierValue($query, $column, $name, $prefix);
    }

    public function maskPersonalCode()
    {
        return $this->personal_code = Str::mask(Str::mask(Str::mask($this->personal_code, '*', 0, 3), '*', -5, 6), '*', 4, 1);
    }

    public function userNotifications(): HasMany
    {
        return $this->hasMany(UserNotifications::class);
    }

    public function roles(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    public function userGroups(): HasManyThrough
    {
        return $this->hasManyThrough(UserGroup::class, Role::class, 'user_id', 'id', 'id', 'user_group_id');
    }

    public function publicDiscussionCommentAnswers(): HasMany
    {
        return $this->hasMany(PublicDiscussionCommentAnswer::class)->where('has_seen', false);
    }
}
