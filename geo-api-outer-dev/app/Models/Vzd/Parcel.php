<?php

namespace App\Models\Vzd;

use Illuminate\Database\Eloquent\Model;


/**
 * Class Attachment
 * @package App\Models\Attachment
 */
class Parcel extends Model
{

    protected $connection = 'vzd_pgsql';
    protected $table = 'parcel';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'geom',
        'code',
        'geom_act_d',
        'objectcode',
        'area_scale',
        'geoup_code',
        'folder_name',
        'address',
        'purpose_use',
        'area',
        'landbook_folio_nr',
        'owner',
        'owned_by_municipality',
        'public_water',
    ];


}
