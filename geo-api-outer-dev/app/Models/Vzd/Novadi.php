<?php

namespace App\Models\Vzd;

use Illuminate\Database\Eloquent\Model;


/**
 * Class Attachment
 * @package App\Models\Attachment
 */
class Novadi extends Model
{

    protected $connection = 'vzd_pgsql';
    protected $table = 'novadi';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'geom',
        'kods',
        'tips_cd',
        'nosaukums',
        'vkur_cd',
        'vkur_tips',
        'apstipr',
        'apst_pak',
        'statuss',
        'sort_nos',
        'dat_sak',
        'dat_mod',
        'dat_beig',
        'atrib',
        'std',
        'folder_name',
    ];


}
