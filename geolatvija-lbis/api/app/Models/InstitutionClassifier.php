<?php

namespace App\Models;

use App\Traits\ClassifierValueScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class InstitutionClassifier extends Model
{
    use ClassifierValueScope;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reg_nr',
        'name',
        'institution_type_classifier_value_id',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'institution_type_classifier_value_id' => 'integer',
    ];

    public function scopeClassifierValue($query, $column, $name = '', $prefix = '')
    {
        return $this->buildClassifierValue($query, $column, $name, $prefix);
    }
}
