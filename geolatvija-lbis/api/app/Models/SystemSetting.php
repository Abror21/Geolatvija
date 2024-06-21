<?php

namespace App\Models;

use App\Enums\SystemSettingTypes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Cache;


class SystemSetting extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'key',
        'name',
        'value',
        'file_name',
        'setting_type'
    ];

    protected $casts = [
        'setting_type' => SystemSettingTypes::class,
    ];

    public static function boot()
    {
        parent::boot();

        static::updated(function () {
            Cache::forget("MW");
        });

        static::created(function () {
            Cache::forget("MW");
        });
    }

    public static function getAllSystemSettingValueBySystemName($systemName)
    {
        return Cache::rememberForever($systemName, function () use ($systemName) {
            return SystemSetting::where('setting_type', SystemSettingTypes::REGULAR)->whereNot('file_name', 'frontend')->get()->toArray();
        });
    }
}
