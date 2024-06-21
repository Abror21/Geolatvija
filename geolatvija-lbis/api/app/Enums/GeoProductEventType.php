<?php

namespace App\Enums;

enum GeoProductEventType: string
{
    case VIEW = 'VIEW';
    case USE = 'USE';
    case DOWNLOAD = 'DOWNLOAD';

    public static function values(): array
    {
        return array_column(GeoProductEventType::cases(), 'value');
    }
}
