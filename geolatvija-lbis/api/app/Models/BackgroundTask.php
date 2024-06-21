<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
 * Class Attachment
 * @package App\Models\Attachment
 */
class BackgroundTask extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'command',
        'description',
        'cron',
        'executed_at',
        'execution_time',
        'is_active',
        'failed',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'executed_at' => 'datetime',
        'execution_time' => 'integer',
        'is_active' => 'boolean',
        'failed' => 'integer',
    ];

}
