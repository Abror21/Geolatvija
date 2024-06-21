<?php

namespace App\Enums;

enum UserEmbedSizeTypes: string
{
    case SMALL = "SMALL";
    case MEDIUM = "MEDIUM";
    case LARGE = "LARGE";
    case CUSTOM = "CUSTOM";

    public static function values(): array
    {
        return array_column(UserEmbedSizeTypes::cases(), 'value');
    }
}
