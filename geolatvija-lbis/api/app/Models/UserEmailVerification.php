<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserEmailVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'expiration',
        'token',
        'role_id'
    ];

    protected $casts = [
        'expiration' => 'datetime',
        'role_id' => 'integer',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
