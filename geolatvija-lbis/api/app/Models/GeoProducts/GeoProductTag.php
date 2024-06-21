<?php

namespace App\Models\GeoProducts;

use Illuminate\Database\Eloquent\Model;

class GeoProductTag extends Model
{

    protected $fillable = [
        'geo_product_id',
        'name',
    ];

    protected $casts = [
        'geo_product_id'  => 'integer',
    ];
}
