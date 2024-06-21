<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tooltip extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ui_menu_id',
        'code',
        'translation',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'ui_menu_id' => 'integer',
    ];


}
