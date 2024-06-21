<?php


namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Support\Facades\Storage;
use ReflectionMethod;

class RequestLogger
{

    /**
     * @param $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $start = microtime(true);
        $uri = app('router')->getRoutes()->match(app('request'))->uri;

        $activity = [];
        $activity['frontend_route'] = $request->header('X-FRONTEND-ROUTE');
        $activity['backend_route'] = $request->url();
        $activity['http_method'] = $request->method();
        $activity['ip'] = request()->header('x-forwarded-for');
        $activity['user_agent'] = $request->header('USER-AGENT');
        $activity['sec_ch_ua_mobile'] = $request->header('SEC-CH-UA-MOBILE');
        $activity['sec_ch_ua'] = $request->header('SEC-CH-UA');
        $activity['action_made_at'] = Carbon::now()->setTimezone('Europe/Riga')->format('Y-m-d h:i:s');
        $activity['authorization'] = $request->header('authorization');

        $response = $next($request);
        $content = '';

        $role = $request->user();

        $activity['user_id'] = $role->user_id ?? '';
        $activity['role_id'] = $role->id ?? '';

        $description = $this->getDescriptionComment($request);
        $activity['description'] = $description;

//        if (app('router')->getRoutes()->match(app('request'))->action['middleware'] === 'telescope') {
//            return $response;
//        }

        if (!in_array($uri, $this->emptyContent()) && in_array('auth:sanctum', app('router')->getRoutes()->match(app('request'))->action['middleware'] ?? [])) {
            $content = json_decode($response->content());
        }

        $activity['content'] = $content;
        $activity['http_code'] = $response->getStatusCode();
        $end = microtime(true);
        $activity['request_time_sec'] = (string)($end - $start);

        Storage::append('activity_logs_' . Carbon::now()->format('Y-m-d') . '.txt', json_encode($activity, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        return $response;
    }

    /**
     * @return string[]
     */
    public function emptyContent(): array
    {
        return [
            'api/v1/storage/{id}',
            'api/v1/atom/{id}/file',
            'api/v1/geoproduct-orders/{id}/download',
            'api/v1/ordered-licences/{id}/download',
            'api/v1/reports/export'
        ];
    }

    public function getDescriptionComment($request): string
    {
        try {
            $controller = explode('@', $request->route()->getAction()['controller'] ?? '');

            if ($controller) {
                $reflectionMethod = new ReflectionMethod($controller[0], $controller[1]);
                $docComment = $reflectionMethod->getDocComment();

                $matches = [];
                if (preg_match('/@description\s+(.+)/', $docComment, $matches)) {
                    $description = $matches[1];
                } else {
                    return '';
                }
            }
        } catch (\Exception) {
            return '';
        }

        return $description ?? '';
    }
}
