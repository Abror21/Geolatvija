<?php

namespace App\Enums;

enum LicenceTypes: string
{
    case OPEN = "OPEN";
    case PREDEFINED = "PREDEFINED";

    public static function values(): array
    {
        return array_column(LicenceTypes::cases(), 'value');
    }
}
