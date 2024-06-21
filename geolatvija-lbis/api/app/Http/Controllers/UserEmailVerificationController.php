<?php

namespace App\Http\Controllers;

use App\Services\UserEmailVerificationService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserEmailVerificationController extends Controller
{
    /**
     * UserEmailVerificationController constructor.
     * @param UserEmailVerificationService $userEmailVerificationService
     */
    public function __construct(private UserEmailVerificationService $userEmailVerificationService)
    {
    }

    /**
     * @description Generate and send User verification email
     */
    public function generate(Request $request): Response {
        $user = $request->user()->user;
        $email = $request->input('email');
        $roleId = $request->input('roleId');
        return $this->successResponse($this->userEmailVerificationService->sendVerificationEmail($user, $email, $roleId));
    }

    /**
     * @description Verify User email verification
     */
    public function verify(Request $request): Response {
        $token = $request->input('token');
        return $this->successResponse($this->userEmailVerificationService->verify($token));
    }
}
