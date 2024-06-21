<?php

namespace App\Models\GeoProducts;

use Illuminate\Database\Eloquent\Model;

class GeoProductAttachments extends Model
{
    protected $fillable = [
        'attachment_id',
        'zip_id',
        'order_id',
    ];
}
