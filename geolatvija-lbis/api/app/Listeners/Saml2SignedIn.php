<?php

namespace App\Listeners;


use App\Actions\Saml\SyncUserFromSaml;
use App\Repositories\RightRepository;
use App\Repositories\RoleRepository;
use App\Services\AuthService;
use App\Services\SystemSettingService;
use App\Traits\TokenHelper;
use Slides\Saml2\Events\SignedIn;

/**
 * Class Saml2SignedIn
 * @package App\Listeners
 */
class Saml2SignedIn
{
    use TokenHelper;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        private readonly SyncUserFromSaml $syncUserFromSaml,
        private readonly SystemSettingService $systemSettingService,
        private readonly AuthService $authService,
        private readonly RoleRepository $roleRepository,
        private readonly RightRepository $rightRepository,
    )
    {}

    private function createTokens($role)
    {
        $expirationTime = $this->systemSettingService->getSessionInactivityTime();
        $expirationTimeValue = intval($expirationTime['value']);

        $expiration = now()->addSeconds($expirationTimeValue);
        $refreshExpiration = now()->addSeconds($expirationTimeValue * 2);

        $accessToken = $this->authService->generateToken($role, $this->rightRepository);
        $refreshToken = $role->createToken('SAML Refresh Token', ['refresh_token']);

        $accessToken->accessToken->update([
            'expires_at' => $expiration,
        ]);

        $refreshToken->accessToken->update([
            'expires_at' => $refreshExpiration,
        ]);

        $accessTokenObject = (object) [
            'token' => $accessToken,
            'expires_at' => $expiration,
        ];

        $refreshTokenObject = (object) [
            'token' => $refreshToken,
            'expires_at' => $refreshExpiration,
            'expire_set_at' => now(),
        ];

        return ['access_token' => $accessTokenObject, 'refresh_token' => $refreshTokenObject];
    }

    /**
     * Handle the event.
     *
     * @param SignedIn $event
     */
    public function handle(SignedIn $event)
    {
        // your own code preventing reuse of a $messageId to stop replay attacks
        $samlUser = $event->getSaml2User();

        $userData = [
            'id' => $samlUser->getUserId(),
            'attributes' => $samlUser->getAttributes(),
            'sid' => $samlUser->getAttribute('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid')[0] ?? null,
            'first_name' => $samlUser->getAttribute('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname')[0],
            'last_name' => $samlUser->getAttribute('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname')[0],
            'personal_code' => str_replace('-', '', $samlUser->getAttribute('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/privatepersonalidentifier')[0]),
            'assertion' => $samlUser->getRawSamlAssertion()
        ];

        $user = $this->syncUserFromSaml->sync($userData);
        $role = $this->roleRepository->getAuthenticatedUserRole($user->id);

        $tokens = $this->createTokens($role);

        $accessTokenPlainText = $tokens['access_token']->token->plainTextToken;
        $accessTokenExpiresAt = $tokens['access_token']->expires_at->toIso8601String();

        $refreshTokenPlainText = $tokens['refresh_token']->token->plainTextToken;
        $refreshTokenExpiresAt = $tokens['refresh_token']->expires_at->toIso8601String();
        $refreshTokenExpiresSetAt = $tokens['refresh_token']->expire_set_at->toIso8601String();

        request()->merge([
            'RelayState' => config('geo.base_frontend_uri') . '/auth-token/' . $accessTokenPlainText . '/' . $accessTokenExpiresAt . '/' . $refreshTokenPlainText . '/' . $refreshTokenExpiresAt . '/' . $refreshTokenExpiresSetAt . '/' . $role->id,
        ]);
    }
}
