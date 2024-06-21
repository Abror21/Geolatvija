<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use App\Traits\ResponseMessages;


class EnumController extends Controller
{
    use ResponseMessages;

    /**
     * @description Get Enums
     */
    public function select($type): Response
    {
        $enumClass = "\\App\Enums\\" . $type;

        $values = [];
        if (class_exists($enumClass)) {
            $values = $enumClass::cases();
        }

        return $this->successResponse($values);
    }
}
