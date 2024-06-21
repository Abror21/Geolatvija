<?php

namespace App\Models\GeoProducts;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GeoProductFilesFtp extends Model
{
    protected $table = 'geo_product_files_ftp';

    protected $fillable = [
        'attachment_id',
        'zip_id',
        'files_id',
        'file_modified_date'
    ];

    public function attachment(): BelongsTo
    {
        return $this->belongsTo(Attachment::class);
    }
}
