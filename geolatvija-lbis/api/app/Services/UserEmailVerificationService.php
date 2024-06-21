<?php

namespace App\Services;

use App\Repositories\RoleRepository;
use App\Repositories\UserEmailVerificationRepository;
use App\Services\API\APIOuterAPI;
use Exception;
use Illuminate\Support\Facades\Mail;

class UserEmailVerificationService extends BaseService
{
    public function __construct(private readonly UserEmailVerificationRepository $emailVerificationRepository, private readonly APIOuterAPI $APIOuterAPI, private readonly UserService $userService, private RoleRepository $roleRepository, )
    {

        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];

    }

    public function sendVerificationEmail($user, $email, $roleId): bool
    {
        $roles = $this->roleRepository->userRoles($user->id);
        $activeRole = $roles->firstWhere('id', $roleId);
        if (!$email || !$roleId) {
            throw new Exception('Email or Role ID was not provided!');
        }

        if ($activeRole->email !== $email) {
            $params = [
                'selected_role' => $roleId,
                'email' => $email,
                'name' => $user->name,
                'surname' => $user->surname,
            ];
            $this->userService->updateAccount($activeRole, $params);
        }

        $existingTokens = $this->emailVerificationRepository->findBy('role_id', $roleId);

        if ($existingTokens) {
            foreach ($existingTokens->get() as $existingToken) {
                $existingToken->delete();
            }
        }

        $token = md5(uniqid(rand(), true));

        $expiration = now()->addDay();

        $this->emailVerificationRepository->store([
            'expiration' => $expiration,
            'token' => $token,
            'role_id' => $roleId,
        ]);

        $frontendUrl = config('geo.base_frontend_uri');
        $url = $frontendUrl . '/main' . '?email-verify=' . $token;
        $logoUrl = asset('geo_logo.png');

        $emailData = [
            'url' => $url,
            'logoUrl' => $logoUrl,
        ];

        Mail::send('user_email_verification', $emailData, function ($message) use ($email, $user) {
            $message->to($email, $user->name)
                ->subject('Ģeo Latvija - E-pasta Verifikācija');
        });

        return true;
    }

    public function verify($token)
    {
        $storedEmailVerification = $this->emailVerificationRepository->findBy('token', $token);

        if ($storedEmailVerification && $storedEmailVerification->expiration->isPast()) {
            return [
                'email' => null,
                'responseType' => 'EXPIRED',
            ];
        }

        if ($storedEmailVerification && hash_equals($storedEmailVerification->token, $token)) {
            $role = $storedEmailVerification->role;
            $user = $role->user;

            if ($role->userGroup->code === 'authenticated') {
                $this->APIOuterAPI->call('api/v1/tapis/ws/create_or_update_person', ['email' => $role->email, 'person_code' => $user->personal_code], "POST", $this->headers);
            }

            $role->update([
                'email_verified' => true,
            ]);

            $allUserRoles = $user->roles;

            foreach ($allUserRoles as $userRole) {
                if ($userRole->email === $role->email) {
                    $userRole->update([
                        'email_verified' => true,
                    ]);
                }
            }

            $storedEmailVerification->delete();

            return [
                'email' => $role->email,
                'responseType' => 'SUCCESS',
            ];
        }

        return [
            'email' => '',
            'responseType' => 'ERROR',
        ];
    }
}
