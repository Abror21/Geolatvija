<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductViewEvent extends GeoProductEventsBase
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct($data, $roleId)
    {
        parent::__construct();
        $this->event_type = 'VIEW';
        $this->event_initiator_id = $roleId;
        $this->event_subject_type = self::class;
        $this->event_subject_id = $data->id;
        $this->event_data_old = [];
        $this->event_data_new = [];
    }
}
