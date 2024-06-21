<?php

namespace App\Services;

use App\Traits\RequestResponseHelpers;
use App\Traits\ResponseMessages;
use App\Traits\CamelToSnakeHelper;
use App\Traits\SnakeToCamelHelper;
use App\Traits\CommonHelper;

class BaseService
{
    use ResponseMessages, CamelToSnakeHelper, SnakeToCamelHelper, CommonHelper, RequestResponseHelpers;
}
