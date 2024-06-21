<?php

namespace App\Enums;

enum GeoProductLicenceTypes: string
{
    case OPEN = "OPEN";
    case PREDEFINED = "PREDEFINED";
    case OTHER = "OTHER";
    case NONE = "NONE";

    public static function values(): array
    {
        return array_column(GeoProductLicenceTypes::cases(), 'value');
    }
}
