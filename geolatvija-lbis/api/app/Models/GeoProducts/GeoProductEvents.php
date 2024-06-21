<?php

namespace App\Models\GeoProducts;

use Illuminate\Database\Eloquent\Model;

class GeoProductEvents extends Model
{
    protected $guarded = ['id'];

    protected $jsonable = ['data_new', 'data_old'];

}
