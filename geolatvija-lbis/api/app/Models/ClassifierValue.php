<?php

namespace App\Models;

use App\Traits\ClassifierValueScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class ClassifierValue extends Model
{
    use SoftDeletes, ClassifierValueScope;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'classifier_id',
        'value_code',
        'translation',
        'weight',
    ];

    protected $casts = [
        'classifier_id' => 'integer',
        'weight' => 'integer'
    ];


    public function scopeClassifierValue($query, $column, $name = '', $prefix = '')
    {
        return $this->buildClassifierValue($query, $column, $name, $prefix);
    }
}
