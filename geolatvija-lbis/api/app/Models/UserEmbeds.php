<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserEmbeds extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_id',
        'name',
        'domain',
        'width',
        'height',
        'size_type',
        'iframe',
        'uuid',
        'data',
        'pid',
        'temp',
        'reg_nr'
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}
