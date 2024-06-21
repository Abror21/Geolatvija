<?php

namespace App\Models\GeoProducts;

use App\Models\GeoProductOrder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GeoProductOther extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'geo_product_id',
        'description',
        'is_public',
        'metadata_uuid',
    ];

    protected $casts = [
        'geo_product_id'  => 'integer',
        'is_public'  => 'boolean',
    ];

    public function sites(): HasMany
    {
        return $this->hasMany(GeoProductOtherSite::class);
    }

    public function geoProductOrders(): HasMany
    {
        return $this->hasMany(GeoProductOrder::class);
    }
}
