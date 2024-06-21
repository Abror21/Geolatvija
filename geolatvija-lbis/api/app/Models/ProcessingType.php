<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class ProcessingType extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'unification_type',
        'institution_classifier_id',
        'symbol_amount',
        'directory_name',
        'description',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'ui_menu_id'  => 'integer',
        'notification_id'  => 'integer',
        'institution_classifier_id' => 'integer',
    ];

}
