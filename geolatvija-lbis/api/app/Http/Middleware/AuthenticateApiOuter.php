<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\UnauthorizedException;

class AuthenticateApiOuter
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

        $validSecret = config('geo.secret');

        try {
            if ($request->header('X-GEO-HTTP-SECRET') == null || $validSecret == null) {
                throw new UnauthorizedException();
            }

            if ($request->header('X-GEO-HTTP-SECRET') != $validSecret) {
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
