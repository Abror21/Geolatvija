<?php

namespace App\Enums;

enum UserTypes: string
{
    case PERSON = "PERSON";
    case ORGANIZATION = "ORGANIZATION";

    public static function values(): array
    {
        return array_column(UserTypes::cases(), 'value');
    }
}
