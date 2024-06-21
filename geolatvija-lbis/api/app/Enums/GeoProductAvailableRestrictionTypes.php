<?php

namespace App\Enums;

enum GeoProductAvailableRestrictionTypes: string
{
    case NO_RESTRICTION = "NO_RESTRICTION";
    case BY_BELONGING = "BY_BELONGING";
    case BELONG_TO_GROUP = "BELONG_TO_GROUP";

    public static function values(): array
    {
        return array_column(GeoProductAvailableRestrictionTypes::cases(), 'value');
    }
}
