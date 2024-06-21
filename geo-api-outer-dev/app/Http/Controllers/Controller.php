<?php

namespace App\Http\Controllers;

use App\Traits\CommonHelper;
use App\Traits\KeysToKebab;
use App\Traits\ResponseMessages;
use App\Traits\SnakeToCamelHelper;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use ResponseMessages, KeysToKebab, SnakeToCamelHelper, CommonHelper;
}
