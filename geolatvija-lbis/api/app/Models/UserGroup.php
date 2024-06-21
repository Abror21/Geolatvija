<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Role;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserGroup extends Model
{
    use SoftDeletes;

    //dont add code to fillable it should never change
    protected $fillable = [
        'name',
        'description',
    ];

    public function roles()
    {
        return $this->hasMany(Role::class, 'user_group_id');
    }
}
