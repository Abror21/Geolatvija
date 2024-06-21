<?php

namespace App\Services;


use App\Repositories\Saml2TenantRepository;
use App\Repositories\UserRepository;

/**
 * Class Saml2Service
 * @package App\Services
 */
class Saml2Service
{

    /**
     * UserService constructor.
     * @param UserRepository $userRepository
     */
    public function __construct(
        private Saml2TenantRepository $saml2TenantRepository
    )
    {
    }

    public function saml2Uuid()
    {
        return env('APP_URL') . '/vpm/login';
    }

    public function saml2Logout()
    {
        return $this->saml2TenantRepository->getSaml2Entry()->idp_logout_url;
    }

}
