<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoogleAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'script',
    ];
}

