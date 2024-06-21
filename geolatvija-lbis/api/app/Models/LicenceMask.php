<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;


class LicenceMask extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'attribute',
        'access_key',
    ];

    /**
     * @var string[]
     */
    protected $casts = [];


}
