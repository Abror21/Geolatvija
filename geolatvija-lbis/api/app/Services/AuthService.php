<?php

namespace App\Services;

use App\Repositories\RightRepository;
use App\Repositories\RoleRepository;
use App\Traits\TokenHelper;
use Illuminate\Http\Request;

/**
 * Class UserService
 * @package App\Services
 */
class AuthService extends BaseService
{
    use TokenHelper;

    public function __construct(
        private readonly SystemSettingService $systemSettingService,
        private readonly RightRepository      $rightRepository,
        private readonly RoleRepository       $roleRepository
    )
    {}

    public function refreshToken(Request $request)
    {
        $role = $request->user();

        $existingToken = $role->tokens()->latest()->where('personal_access_tokens.name', 'SAML Access Token')->first();

        if ($existingToken) {
            $existingToken->delete();
        }

        $token = $this->generateToken($role, $this->rightRepository);
        $expirationTime = $this->systemSettingService->getSessionInactivityTime();
        $expirationTimeValue = intval($expirationTime['value']);

        $expiration = now()->addSeconds($expirationTimeValue);

        $token->accessToken->update([
            'expires_at' => $expiration,
        ]);

        return response()->json([
            'access_token' => $token->plainTextToken,
            'expires_at' => $expiration,
            'expiration_value' => $expirationTimeValue,
        ]);
    }

    private function validatedRefreshToken($user)
    {
        $existingRefreshToken = $user->tokens()->latest()->where('personal_access_tokens.name', 'SAML Refresh Token')->first();

        if (!$existingRefreshToken) {
            return response()->json(['error' => 'Invalid refreshToken'], 401);
        }

        $existingRefreshToken->delete();

        return true;
    }

    public function refreshItself(Request $request)
    {
        $user = $request->user('sanctum');

        $this->validatedRefreshToken($user);

        $expirationTime = $this->systemSettingService->getSessionInactivityTime();
        $expirationTimeValue = intval($expirationTime['value']);

        $refreshExpiration = now()->addSeconds($expirationTimeValue * 2);

        $refreshToken = $user->createToken('SAML Refresh Token', ['refresh_token']);

        $refreshToken->accessToken->update([
            'expires_at' => $refreshExpiration,
        ]);

        $refreshTokenText = $refreshToken->plainTextToken;

        $refreshTokenObject = (object) [
            'token' => $refreshTokenText,
            'expires_at' => $refreshExpiration->toIso8601String(),
            'expire_set_at' => now(),
        ];

        return response()->json(['refresh_token' => $refreshTokenObject]);
    }

    public function inactivityToken(Request $request)
    {
        $user = $request->user('sanctum');

        $this->validatedRefreshToken($user);

        $expirationTime = $this->systemSettingService->getSessionInactivityTokenTime();
        $expirationTimeValue = intval($expirationTime['value']);

        $expiration = now()->addSeconds($expirationTimeValue + 30);

        $token = $user->createToken('SAML Inactivity Token', ['inactivity_token']);

        $token->accessToken->update([
            'expires_at' => $expiration,
        ]);

        $tokenText = $token->plainTextToken;

        $tokenObject = (object) [
            'token' => $tokenText,
            'expires_at' => $expiration->toIso8601String(),
            'expire_set_at' => now(),
        ];

        return response()->json(['inactivity_token' => $tokenObject]);
    }

    public function getToken(Request $request, $id) {
        $expirationTime = $this->systemSettingService->getSessionInactivityTime();
        $expirationTimeValue = intval($expirationTime['value']);

        $expiration = now()->addSeconds($expirationTimeValue);
        $refreshExpiration = now()->addSeconds($expirationTimeValue * 2);

        $request->user()->tokens()->delete();

        $newRole = $this->roleRepository->findById($id);

        $accessToken = $this->generateToken($newRole, $this->rightRepository);
        $refreshToken = $newRole->createToken('SAML Refresh Token', ['refresh_token']);

        $accessToken->accessToken->update([
            'expires_at' => $expiration,
        ]);

        $refreshToken->accessToken->update([
            'expires_at' => $refreshExpiration,
        ]);

        $accessTokenObject = (object) [
            'token' => $accessToken->plainTextToken,
            'expires_at' => $expiration,
        ];

        $refreshTokenObject = (object) [
            'token' => $refreshToken->plainTextToken,
            'expires_at' => $refreshExpiration,
            'expire_set_at' => now(),
        ];

        return ['access_token' => $accessTokenObject, 'refresh_token' => $refreshTokenObject];
    }

    public function logout(Request $request)
    {
        $user = $request->user('sanctum');
        $user->tokens()->delete();
    }
}
