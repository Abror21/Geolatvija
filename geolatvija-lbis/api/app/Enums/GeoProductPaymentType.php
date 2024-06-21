<?php

namespace App\Enums;

enum GeoProductPaymentType: string
{
    case FREE = "FREE";
    case FEE = "FEE";
    case PREPAY = "PREPAY";

    public static function values(): array
    {
        return array_column(GeoProductPaymentType::cases(), 'value');
    }
}
