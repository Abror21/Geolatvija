<?php

namespace App\Models;

use App\Traits\ClassifierValueScope;
use Illuminate\Database\Eloquent\Model;


class InstitutionLicence extends Model
{
    use ClassifierValueScope;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'institution_classifier_id',
        'licence_type',
        'attachment_id',
        'site',
        'description',
        'is_public',
        'type'
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'institution_classifier_id' => 'integer',
        'attachment_id' => 'integer',
        'is_public' => 'boolean',
    ];

    public function scopeClassifierValue($query, $column, $name = '', $prefix = '')
    {
        return $this->buildClassifierValue($query, $column, $name, $prefix);
    }
}
