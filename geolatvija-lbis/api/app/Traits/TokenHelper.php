<?php

namespace App\Traits;

use App\Models\User;
use App\Repositories\RightRepository;
use Laravel\Sanctum\NewAccessToken;

trait TokenHelper
{

    /**
     * Generates token with capabilities
     * @param User $user
     * @param integer $roleId
     * @param RightRepository $rightRepository
     * @return NewAccessToken
     */
    public function generateToken($role, $rightRepository)
    {
        $rights = $rightRepository->getUserRights($role->user_id, $role->id);

        $capabilities = collect($rights)->map(function ($item) {
            return $item->unique_key;
        })->toArray();

        $capabilities[] = 'general';

        return $role->createToken('SAML Access Token', $capabilities);
    }

}
