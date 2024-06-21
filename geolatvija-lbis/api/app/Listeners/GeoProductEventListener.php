<?php

namespace App\Listeners;

use App\Events\GeoProductEventsBase;
use App\Services\GeoProductEventsService;
use Illuminate\Contracts\Queue\ShouldQueue;

class GeoProductEventListener implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        protected GeoProductEventsService $geoProductEventsService
    ) {
    }

    /**
     * Handle the event.
     *
     * @param  GeoProductEventsBase  $geoProductEventsBase
     * @return void
     */
    public function handle(GeoProductEventsBase $geoProductEventsBase): void
    {
        $this->geoProductEventsService->logEvent($geoProductEventsBase);
    }
}
