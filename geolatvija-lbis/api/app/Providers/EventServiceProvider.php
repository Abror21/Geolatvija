<?php

namespace App\Providers;

use App\Events\CreateOrderFile;
use App\Events\OtherProductCallEvent;
use App\Events\ProductDownloadEvent;
use App\Events\ProductViewEvent;
use App\Listeners\CreateOrderFileListener;
use App\Listeners\GeoProductEventListener;
use App\Listeners\Saml2SignedIn;
use App\Listeners\Saml2SignedOut;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        \Slides\Saml2\Events\SignedIn::class => [
            Saml2SignedIn::class
        ],
        \Slides\Saml2\Events\SignedOut::class => [
            Saml2SignedOut::class
        ],
        ProductViewEvent::class => [
            GeoProductEventListener::class
        ],
        ProductDownloadEvent::class => [
            GeoProductEventListener::class
        ],
        OtherProductCallEvent::class => [
            GeoProductEventListener::class
        ],
        CreateOrderFile::class => [
            CreateOrderFileListener::class
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
