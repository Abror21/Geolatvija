<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThematicUserGroupRelation extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'thematic_user_group_id',
        'institution_classifier_id',
        'is_active',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'user_id' => 'integer',
        'thematic_user_group_id' => 'integer',
        'institution_classifier_id' => 'integer',
        'is_active' => 'boolean',
    ];


}
