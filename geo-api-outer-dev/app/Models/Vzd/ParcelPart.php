<?php

namespace App\Models\Vzd;

use Illuminate\Database\Eloquent\Model;


/**
 * Class Attachment
 * @package App\Models\Attachment
 */
class ParcelPart extends Model
{

    protected $connection = 'vzd_pgsql';
    protected $table = 'parcel_part';
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
        'geoup_code',
        'area_scale',
        'folder_name',
    ];


}
