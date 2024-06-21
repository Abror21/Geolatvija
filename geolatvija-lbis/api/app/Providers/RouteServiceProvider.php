<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->routes(function () {
            Route::prefix('api/v1')
                ->middleware(['api'])
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::prefix('api/v1')
                ->middleware(['public'])
                ->namespace($this->namespace)
                ->group(base_path('routes/publicAPI.php'));

            Route::prefix('vpm')
                ->middleware(['public'])
                ->namespace($this->namespace)
                ->group(base_path('routes/saml.php'));

            Route::prefix('geonetwork')
                ->namespace($this->namespace)
                ->group(base_path('routes/geonetwork.php'));

            Route::prefix('geoserver')
                ->namespace($this->namespace)
                ->group(base_path('routes/geoserver.php'));

            Route::prefix('map/MapApi')
                ->namespace($this->namespace)
                ->group(base_path('routes/map.php'));
        });
    }
}
