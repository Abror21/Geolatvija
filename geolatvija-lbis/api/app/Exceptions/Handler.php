<?php

namespace App\Exceptions;

use Carbon\Carbon;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
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
        DB::rollback();

        switch (class_basename($e)) {
            case 'QueryException':
                $errorType = 'QUERY EXCEPTION';
                Log::channel('queryExceptions')->error($e->getMessage());
//                Log::channel('mattermost')->error($this->constructMessage($errorType, $e));
                if (env('APP_ENV') == 'local') {
                    return $this->errorResponse($e->getMessage(), 500);
                }

                return $this->errorResponse('error.query_exception', 500);
            case 'ValidationException':
                $validation = json_encode($this->snakeToCamelArrayKeys($e->errors()));

                return $this->errorResponse($validation, 422);
            case 'ExceptionWithAttributes':
                $decoded = json_decode($e->getMessage(), true);
                $decoded['code'] = $e->getCode();
                return response()->json($decoded, $e->getCode());
            case 'CustomErrors':
                return $this->errorResponse($e->getMessage(), $e->getCode());
            case 'AuthenticationException':
            case 'RouteNotFoundException':
                return $this->errorResponse('validation.unauthorised', 401);
            case 'MissingAbilityException':
                return $this->errorResponse('validation.role_unauthorised', 403);
            default:
                $errorType = 'OTHER';
//                Log::channel('mattermost')->error($this->constructMessage($errorType, $e));
                return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function report(Throwable $exception)
    {
        // Log exception in activity_logs if Route is not found.
        if ($exception instanceof NotFoundHttpException) {
            $this->logNotFoundHttpException($exception);
        }

        parent::report($exception);
    }

    // Request Logger when Route is not found. (activity_logs)
    private function logNotFoundHttpException(NotFoundHttpException $exception)
    {
        $request = request();
        $role = $request->user();

        $activity = [
            'frontend_route' => $request->header('X-FRONTEND-ROUTE'),
            'backend_route' => $request->url(),
            'http_method' => $request->method(),
            'ip' => $request->header('x-forwarded-for'),
            'user_agent' => $request->header('USER-AGENT'),
            'sec_ch_ua_mobile' => $request->header('SEC-CH-UA-MOBILE'),
            'sec_ch_ua' => $request->header('SEC-CH-UA'),
            'user_id' => $role->user_id ?? '',
            'role_id' => $role->id ?? '',
            'action_made_at' => Carbon::now()->setTimezone('Europe/Riga')->format('Y-m-d h:i:s'),
            'description' => 'Resource Not Found: The requested resource could not be located. This may be due to an invalid URL, missing data, or unmet conditions within the application\'s logic.',
            'content' => $exception->getMessage(),
            'http_code' => $exception->getStatusCode(),
            'request_time_sec' =>  (string)(microtime(true) - $request->server('REQUEST_TIME_FLOAT')),
            'authorization_header' => $request->header('authorization')
        ];

        Storage::append('activity_logs_' . Carbon::now()->format('Y-m-d') . '.txt', json_encode($activity, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
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
