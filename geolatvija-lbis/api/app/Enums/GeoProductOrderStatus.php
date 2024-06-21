<?php

namespace App\Enums;

enum GeoProductOrderStatus: string
{
    case DRAFT = "DRAFT";
    case DONE = "DONE";
    case CANCELLED = "CANCELLED";

    public static function values(): array
    {
        return array_column(GeoProductOrderStatus::cases(), 'value');
    }
}
