<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Traits\CamelToSnakeHelper;
use App\Traits\CommonHelper;
use App\Traits\KeysToKebab;
use App\Traits\ResponseMessages;
use App\Traits\SnakeToCamelHelper;
use App\Traits\CaptchaValidationHelper;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, ResponseMessages, CamelToSnakeHelper, SnakeToCamelHelper, CommonHelper, KeysToKebab, CaptchaValidationHelper;
}
