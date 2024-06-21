<?php

namespace App\Listeners;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Slides\Saml2\Events\SignedOut;

/**
 * Class Saml2SignedOut
 * @package App\Listeners
 */
class Saml2SignedOut
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param SignedOut $event
     * @return void
     */
    public function handle(SignedOut $event)
    {
        Auth::logout();
        Session::save();
    }
}
