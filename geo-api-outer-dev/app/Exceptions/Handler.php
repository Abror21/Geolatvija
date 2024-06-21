<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;
use App\Traits\ResponseMessages;
use App\Traits\SnakeToCamelHelper;

class Handler extends ExceptionHandler
{
    use ResponseMessages, SnakeToCamelHelper;

    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, $e)
    {

        switch (class_basename($e)) {
            case 'QueryException':
                $errorType= 'QUERY EXCEPTION';
                Log::channel('queryExceptions')->error($e->getMessage());
//                Log::channel('mattermost')->error($this->constructMessage($errorType, $e));
                if (env('APP_ENV') == 'local') {
                    return $this->errorResponse($e->getMessage(), 500);
                }

                return $this->errorResponse('error.query_exception', 500);
            case 'ValidationException':
                $validation = json_encode($this->snakeToCamelArrayKeys($e->errors()));

                return $this->errorResponse($validation, 422);
            case 'CustomErrors':
                return $this->errorResponse($e->getMessage(), $e->getCode());
            default:
                $errorType = 'OTHER';

//                Log::channel('mattermost')->error($this->constructMessage($errorType, $e));
                return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function constructMessage($type, $e): string
    {
        return '
## ' . $type . '
```
' . $e->getMessage() . '
```';
    }
}
