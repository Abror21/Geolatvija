<?php

namespace App\Models;

use App\Traits\ClassifierValueScope;
use App\Traits\CommonHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class GeoProductOrder extends Model
{
    use HasFactory, ClassifierValueScope, CommonHelper, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'geo_product_orders';

    protected $fillable = [
        'order_status_classifier_value_id',
        'geo_product_service_id',
        'geo_product_file_id',
        'geo_product_other_id',
        'accepted_licence_attachment_id',
        'email',
        'phone',
        'description',
        'confirmed_rules',
        'ip_limitation',
        'payment_amount',
        'confirmed_date',
        'role_id',
        'target_classifier_value_id',
        'dpps_link',
        'dpps_uuid',
        'product_file_attachment_id',
        'geo_product_id',
        'uuid',
        'payment_request_id',
        'payment_request_url',
        'payment_status',
        'payment_request_status',
        'expire_at',
        'period_number_value',
        'period_classifier_value_id',
        'files_availability',
        'attachments_display_names'
    ];

    protected $casts = [
        'order_status_classifier_value_id' => 'integer',
        'month' => 'integer',
        'payment_amount' => 'integer',
        'geo_product_service_id' => 'integer',
        'geo_product_file_id' => 'integer',
        'confirmed_rules' => 'boolean',
        'confirmed_date' => 'datetime',
        'role_id' => 'integer',
        'geo_product_other_id' => 'integer',
        'accepted_licence_attachment_id' => 'integer',
        'product_file_attachment_id' => 'integer',
        'period_classifier_value_id' => 'integer',
        'period_number_value' => 'integer',
        'expire_at' => 'datetime',
        'order_date' => 'datetime',
        'files_availability' => 'datetime',
        'attachments_display_names' => 'json'
    ];

    public function scopeClassifierValue($query, $column, $name = '', $prefix = '')
    {
        return $this->buildClassifierValue($query, $column, $name, $prefix);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->uuid = static::generateUUIDv4();
        });
    }
}
