<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicDiscussionCommentAnswer extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'comment_id',
        'status',
        'decision',
        'has_seen',
    ];


    /**
     * @var string[]
     */
    protected $casts = [
        'comment_id'  => 'integer',
        'has_seen'  => 'boolean',
    ];

}
