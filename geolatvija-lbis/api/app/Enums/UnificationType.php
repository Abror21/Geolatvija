<?php

namespace App\Enums;

enum UnificationType: string
{
    case NONE = "NONE";
    case UNIFY = "UNIFY";

    public static function values(): array
    {
        return array_column(UnificationType::cases(), 'value');
    }
}
