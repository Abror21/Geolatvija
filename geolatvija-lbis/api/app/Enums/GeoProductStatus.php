<?php

namespace App\Enums;

enum GeoProductStatus: string
{
    case DRAFT = "DRAFT";
    case PLANNED = "PLANNED";

    case PUBLIC = "PUBLIC";

    public static function values(): array
    {
        return array_column(GeoProductStatus::cases(), 'value');
    }
}
