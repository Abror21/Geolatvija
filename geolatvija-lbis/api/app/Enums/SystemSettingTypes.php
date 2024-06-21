<?php

namespace App\Enums;

enum SystemSettingTypes: string
{
    case REGULAR = "REGULAR";
    case FILE_SIZE = "FILE_SIZE";
    case FILE_FORMAT = "FILE_FORMAT";

    public static function values(): array
    {
        return array_column(SystemSettingTypes::cases(), 'value');
    }
}
