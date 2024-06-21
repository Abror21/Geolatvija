<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GeoProductEventsBase
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $event_type;
    public $event_subject_id;
    public $event_subject_type;
    public $event_object_id;
    public $event_object_type;
    public $event_initiator_id;
    public $event_data_old;
    public $event_data_new;
    public $event_note;
    public $geo_product_order_id;

    public function __construct()
    {
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('listeners');
    }
}
