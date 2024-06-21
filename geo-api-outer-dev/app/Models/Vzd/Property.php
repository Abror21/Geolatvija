<?php

namespace App\Models\Vzd;

use Illuminate\Database\Eloquent\Model;


class Property extends Model
{

    protected $connection = 'vzd_pgsql';
    protected $table = 'property';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'landbook_folio_nr',
        'total_area',
    ];


}
