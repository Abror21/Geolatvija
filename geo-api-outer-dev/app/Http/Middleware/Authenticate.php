<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\UnauthorizedException;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        $validSecrets = config('api_access_settings.accepted_tokens');

        try {
            if ($request->header('X-GEO-HTTP-SECRET') == null || $validSecrets == null) {
                throw new UnauthorizedException();
            }

            if (!in_array($request->header('X-GEO-HTTP-SECRET'), $validSecrets)) {
                throw new UnauthorizedException();
            }

            return $next($request);
        } catch (UnauthorizedException $e) {
            return new response(
                '{"error": {"code": 403, "message": "Unauthorized"}}',
                Response::HTTP_UNAUTHORIZED,
                ["Content-Type" => "application/json"]
            );
        }
    }
}
