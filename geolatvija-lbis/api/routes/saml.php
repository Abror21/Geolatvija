<?php

use Illuminate\Support\Facades\Route;
use Slides\Saml2\Http\Controllers\Saml2Controller;


Route::group([
    'prefix' => config('saml2.routesPrefix'),
    'middleware' => array_merge(['resolveTenant'], config('saml2.routesMiddleware')),
], function () {
    Route::get('/logout', [Saml2Controller::class, 'logout'])->name('saml.logout');
    Route::get('/login', [Saml2Controller::class, 'login'])->name('saml.login');
    Route::get('/metadata', [Saml2Controller::class, 'metadata'])->name('saml.metadata');
    Route::post('/acs', [Saml2Controller::class, 'acs'])->name('saml.acs');
    Route::post('/sls', [Saml2Controller::class, 'sls'])->name('saml.sls');
});
