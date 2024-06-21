<?php

namespace App\Models\Vzd;

use Illuminate\Database\Eloquent\Model;


/**
 * Class Attachment
 * @package App\Models\Attachment
 */
class Ekas extends Model
{

    protected $connection = 'vzd_pgsql';
    protected $table = 'ekas';
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
        'statuss',
        'apstipr',
        'apst_pak',
        'vkur_cd',
        'vkur_tips',
        'nosaukums',
        'sort_nos',
        'atrib',
        'pnod_cd',
        'dat_sak',
        'dat_mod',
        'dat_beig',
        'for_build',
        'plan_adr',
        'std',
        'folder_name',
    ];


}
