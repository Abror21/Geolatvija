<?php

namespace App\Enums;

enum GeoProductServiceLimitationTypes: string
{
    case NONE = "NONE";
    case ONLY_GEOPORTAL = "ONLY_GEOPORTAL";
    case IP_ADDRESS = "IP_ADDRESS";
    case PERIOD = "PERIOD";

    public static function values(): array
    {
        return array_column(GeoProductServiceLimitationTypes::cases(), 'value');
    }
}
