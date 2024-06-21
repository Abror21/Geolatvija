<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    /**
     * UserController constructor.
     * @param AuthService $authService
     */
    public function __construct(private readonly AuthService $authService)
    {
    }

    /**
     * @description Refresh JWT Token
     */
    public function refreshToken(Request $request)
    {
        return $this->authService->refreshToken($request);
    }

    /**
     * @description Get Inactivity Token
     */
    public function inactivityToken(Request $request)
    {
        return $this->authService->inactivityToken($request);
    }

    /**
     * @description Refresh the Refresh Token
     */
    public function refreshItself(Request $request)
    {
        return $this->authService->refreshItself($request);
    }

    /**
     * @description Logout from API (Delete tokens)
     */
    public function logout(Request $request): Response
    {
        $this->authService->logout($request);
        return $this->successResponse('Success');
    }

    /**
     * @description Get Token and Refresh Token
     */
    public function getToken(Request $request, $id): Response
    {
        return $this->successResponse($this->authService->getToken($request, $id));
    }
}
