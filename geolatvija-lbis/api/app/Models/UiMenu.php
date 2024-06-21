<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;


class UiMenu extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'translation',
        'sequence',
        'parent_id',
        'content',
        'description',
        'is_public',
        'is_footer',
        'unique_key',
        'url',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'sequence' => 'integer',
        'parent_id' => 'integer',
        'is_public'  => 'boolean',
        'is_footer'  => 'boolean',
    ];


}
