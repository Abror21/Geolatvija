<?php

namespace App\Models\Vzd;

use Illuminate\Database\Eloquent\Model;


/**
 * Class Attachment
 * @package App\Models\Attachment
 */
class Building extends Model
{

    protected $connection = 'vzd_pgsql';
    protected $table = 'building';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'geom',
        'code',
        'objectcode',
        'parcelcode',
        'area_scale',
        'group_code',
        'folder_name',
        'address',
        'public_water',
    ];


}
