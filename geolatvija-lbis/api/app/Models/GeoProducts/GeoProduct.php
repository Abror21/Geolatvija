<?php

namespace App\Models\GeoProducts;

use App\Enums\GeoProductStatus;
use App\Traits\ClassifierValueScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GeoProduct extends Model
{
    use SoftDeletes, ClassifierValueScope;

    protected $fillable = [
        'status',
        'name',
        'description',
        'is_public',
        'public_from',
        'public_to',
        'regularity_renewal_classifier_value_id',
        'photo_attachment_id',
        'specification_attachment_id',
        'organization_name',
        'email',
        'scale_classifier_value_id',
        'data_release_date',
        'data_updated_at',
        'is_inspired',
        'data_origin',
        'condition_of_access',
        'restriction_of_access',
        'priority_topic',
        'coordinate_system',
        'owner_institution_classifier_id',
        'coordinate_system_classifier_value_id',
        'scale_classifier_value_id',
        'spatial_data_classifier_value_id',
        'inspired_data_classifier_value_id',
        'keyword_classifier_value_id',
        'primary_data_theme_classifier_value_id',
        'enable_primary_data_theme_classifier',
        'access_and_use_restrictions',
        'enable_access_and_use_restrictions',
        'access_and_use_conditions',
        'enable_access_and_use_conditions',
        'data_release_date',
        'data_updated_at',
        'data_origin',
        'metadata_uuid',
        'inspire_validation',
        'inspire_status',
        'precision',
        'completeness_value',
        'is_migrated',
    ];

    protected $casts = [
        'status' => GeoProductStatus::class,
        'is_public' => 'boolean',
        'regularity_renewal_classifier_value_id'  => 'integer',
        'photo_attachment_id'  => 'integer',
        'specification_attachment_id'  => 'integer',
        'coordinate_system_classifier_value_id'  => 'integer',
        'scale_classifier_value_id'  => 'integer',
        'data_release_date'  => 'date',
        'data_updated_at'  => 'date',
        'public_from'  => 'date',
        'public_to'  => 'date',
        'is_inspired'  => 'boolean',
        'is_migrated'  => 'boolean',
        'spatial_classifier_value_id'  => 'integer',
    ];

    public function geoProductServices(): HasMany
    {
        return $this->hasMany(GeoProductService::class);
    }

    public function geoProductFiles(): HasMany
    {
        return $this->hasMany(GeoProductFile::class);
    }

    public function geoProductTags(): HasMany
    {
        return $this->hasMany(GeoProductTag::class);
    }

    public function geoProductOthers(): HasMany
    {
        return $this->hasMany(GeoProductOther::class);
    }

    public function geoProductNones(): HasMany
    {
        return $this->hasMany(GeoProductNone::class);
    }

    public function scopeClassifierValue($query, $column, $name = '', $prefix = '')
    {
        return $this->buildClassifierValue($query, $column, $name, $prefix);
    }

    public function views(): HasMany
    {
        return $this->hasMany(GeoProductEvents::class, 'event_subject_id', 'id')->where('event_type', 'VIEW');
    }
}
