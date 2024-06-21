<?php

namespace App\Models;

use App\Models\GeoProducts\GeoProductFile;
use App\Models\GeoProducts\GeoProductService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ThematicUserGroup extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'owner_institution_classifier_id',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'owner_institution_classifier_id' => 'integer',
    ];

    public function thematicGroupRelations(): HasMany
    {
        return $this->hasMany(ThematicUserGroupRelation::class);
    }

    public function geoProductServices(): HasMany
    {
        return $this->hasMany(GeoProductService::class);
    }

    public function geoProductFiles(): HasMany
    {
        return $this->hasMany(GeoProductFile::class);
    }

}
