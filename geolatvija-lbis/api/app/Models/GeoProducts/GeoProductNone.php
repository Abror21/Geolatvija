<?php

namespace App\Models\GeoProducts;

use Illuminate\Database\Eloquent\Model;

class GeoProductNone extends Model
{
    protected $fillable = [
        'geo_product_id',
        'is_public',
    ];

    protected $casts = [
        'geo_product_id'  => 'integer',
        'is_public'  => 'boolean',
    ];
}
