<?php

namespace App\Models\GeoProducts;

use App\Enums\GeoProductAvailableRestrictionTypes;
use App\Enums\GeoProductLicenceTypes;
use App\Enums\GeoProductPaymentType;
use App\Enums\GeoProductPriceFor;
use App\Models\Attachment;
use App\Models\GeoProductOrder;
use App\Traits\ClassifierValueScope;
use App\Traits\CommonHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class GeoProductFile extends Model
{
    use SoftDeletes, CommonHelper, ClassifierValueScope;

    protected $fillable = [
        'geo_product_id',
        'description',
        'usage_request',
        'is_public',
        'file_method_classifier_value_id',
        'ftp_address',
        'ftp_username',
        'ftp_password',
        'processing_type_classifier_value_id',
        'update_is_needed',
        'frequency_number_classifier_value_id',
        'frequency_type_classifier_value_id',
        'thematic_user_group_id',
        'institution_licence_id',
        'licence_attachment_id',
        'fee_cost',
        'price_for',
        'available_restriction_type',
        'license_type',
        'payment_type',
        'service_step',
        'position',
        'fail_amount',
        'last_checked',
        'need_target',
        'dpps_name',
        'dpps_link',
        'uuid',
        'ftp_cron',
        'metadata_uuid',
        'file_format_classifier_value_id',
        'file_format_version',
        'frequency_date',
        'files_updated_at',
        'institution_type_classifier_ids'
    ];

    protected $casts = [
        'geo_product_id' => 'integer',
        'description' => 'array',
        'usage_request' => 'json',
        'is_public' => 'boolean',
        'file_method_classifier_value_id' => 'integer',
        'processing_type_classifier_value_id' => 'integer',
        'update_is_needed' => 'boolean',
        'frequency_number_classifier_value_id' => 'integer',
        'frequency_type_classifier_value_id' => 'integer',
        'thematic_user_group_id' => 'integer',
        'institution_licence_id' => 'integer',
        'licence_attachment_id' => 'integer',
        'price_for' => GeoProductPriceFor::class,
        'fee_cost' => 'decimal:2',
        'available_restriction_type' => GeoProductAvailableRestrictionTypes::class,
        'license_type' => GeoProductLicenceTypes::class,
        'payment_type' => GeoProductPaymentType::class,
        'fail_amount' => 'integer',
        'file_format_classifier_value_id' => 'integer',
        'last_checked' => 'date',
        'files_updated_at' => 'datetime',
        'frequency_date' => 'datetime',
        'institution_type_classifier_ids' => 'json',
    ];

    public function licence(): HasOne
    {
        return $this->hasOne(Attachment::class, 'id', 'licence_attachment_id');
    }


    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function geoProductOrders(): HasMany
    {
        return $this->hasMany(GeoProductOrder::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->uuid = static::generateUUIDv4();
        });
    }

    public function scopeClassifierValue($query, $column, $name = '', $prefix = '')
    {
        return $this->buildClassifierValue($query, $column, $name, $prefix);
    }
}
