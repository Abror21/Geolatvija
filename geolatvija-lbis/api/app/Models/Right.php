<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Right extends Model
{

    protected $fillable = [
        'is_allowed',
        'user_group_id',
        'ui_menu_id'
    ];
}
