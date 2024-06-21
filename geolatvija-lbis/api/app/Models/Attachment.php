<?php

namespace App\Models;

use App\Models\GeoProducts\GeoProductFilesFtp;
use App\Traits\CommonHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;


/**
 * Class Attachment
 * @package App\Models\Attachment
 */
class Attachment extends Model
{
    use CommonHelper, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'filename',
        'display_name',
        'bucket',
        'geo_product_file_id',
        'uuid'
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->uuid) {
                $model->uuid = static::generateUUIDv4();
            }
        });

        static::deleted(function ($model) {
            if ($model->geoProductFilesFtp) {
                $model->geoProductFilesFtp->delete();
            }
        });
    }

    public function geoProductFilesFtp(): HasOne
    {
        return $this->hasOne(GeoProductFilesFtp::class);
    }
}
