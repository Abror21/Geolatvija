<?php

namespace App\Models\GeoProducts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GeoProductOtherSite extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'geo_product_other_id',
        'name',
        'site',
    ];

    protected $casts = [
        'geo_product_other_id'  => 'integer',
    ];
}
