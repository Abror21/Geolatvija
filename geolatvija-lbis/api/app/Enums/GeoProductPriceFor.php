<?php

namespace App\Enums;

enum GeoProductPriceFor: string
{
    case SINGLE = "SINGLE";
    case ALL = "ALL";

    public static function values(): array
    {
        return array_column(GeoProductPriceFor::cases(), 'value');
    }
}
