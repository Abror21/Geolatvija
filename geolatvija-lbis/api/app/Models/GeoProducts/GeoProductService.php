<?php

namespace App\Models\GeoProducts;

use App\Enums\GeoProductAvailableRestrictionTypes;
use App\Enums\GeoProductLicenceTypes;
use App\Enums\GeoProductPaymentType;
use App\Enums\GeoProductServiceLimitationTypes;
use App\Models\Attachment;
use App\Models\GeoProductOrder;
use App\Traits\ClassifierValueScope;
use App\Traits\CommonHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class GeoProductService extends Model
{
    use SoftDeletes, CommonHelper, ClassifierValueScope;

    protected $fillable = [
        'geo_product_id',
        'usage_request',
        'description',
        'is_public',
        'service_type_classifier_value_id',
        'service_link',
        'thematic_user_group_id',
        'period_classifier_value_id',
        'number_value',
        'institution_licence_id',
        'licence_attachment_id',
        'fee_cost',
        'available_restriction_type',
        'service_limitation_type',
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
        'atom_attachment_id',
        'metadata_uuid',
        'inspire_validation',
        'inspire_status',
        'dpps_uuid',
        'service_link_validated',
        'institution_type_classifier_ids',
    ];

    protected $casts = [
        'geo_product_id' => 'integer',
        'usage_request' => 'json',
        'is_public' => 'boolean',
        'service_type_classifier_value_id' => 'integer',
        'thematic_user_group_id' => 'integer',
        'period_classifier_value_id' => 'integer',
        'number_value' => 'integer',
        'institution_licence_id' => 'integer',
        'licence_attachment_id' => 'integer',
        'available_restriction_type' => GeoProductAvailableRestrictionTypes::class,
        'service_limitation_type' => 'array',
        'license_type' => GeoProductLicenceTypes::class,
        'payment_type' => GeoProductPaymentType::class,
        'fee_cost' => 'decimal:2',
        'fail_amount' => 'integer',
        'last_checked' => 'date',
        'need_target' => 'boolean',
        'service_link_validated' => 'boolean',
        'institution_type_classifier_ids' => 'json',
    ];

    public function licence(): HasOne
    {
        return $this->hasOne(Attachment::class, 'id', 'licence_attachment_id');
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
