<?php

namespace App\Http\Controllers;

use App\Services\Saml2Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Traits\ResponseMessages;

/**
 * Class Saml2Controller
 * @package App\Http\Controllers
 */
class Saml2Controller extends Controller
{
    use ResponseMessages;

    /**
     * Create a new controller instance.
     *
     */
    public function __construct(private Saml2Service $saml2Service)
    {
    }


    /**
     * @return JsonResponse|Response
     * @throws \Exception
     * @description Saml2 UUID (Saml2 login)
     */
    public function saml2Uuid()
    {
        return $this->saml2Service->saml2Uuid();
    }

    /**
     * @return JsonResponse|Response
     * @throws \Exception
     * @description Saml2 Logout
     */
    public function saml2Logout()
    {
        return $this->saml2Service->saml2Logout();
    }

}
