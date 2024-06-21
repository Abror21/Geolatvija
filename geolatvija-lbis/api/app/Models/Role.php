<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Role extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $fillable = [
        'user_id',
        'user_group_id',
        'created_by_role_id',
        'institution_classifier_id',
        'is_active',
        'active_till',
        'lower_created_by_role_id',
        'email',
        'email_verified',
    ];

    public function userGroup()
    {
        return $this->belongsTo(UserGroup::class, 'user_group_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function userEmbeds(): HasMany
    {
        return $this->hasMany(UserEmbeds::class);
    }
}
