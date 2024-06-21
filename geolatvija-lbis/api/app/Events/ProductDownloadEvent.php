<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductDownloadEvent extends GeoProductEventsBase
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct($data, $roleId, $orderId = null)
    {
        parent::__construct();
        $this->event_type = 'DOWNLOAD';
        $this->event_initiator_id = $roleId;
        $this->event_object_id = $data['geo_product_file_id'];
        $this->event_subject_type = self::class;
        $this->event_subject_id = isset($data['geo_product_id']) ? $data['geo_product_id'] : $data['id'];
        $this->event_data_old = [];
        $this->event_data_new = [];
        $this->geo_product_order_id = $orderId ?? null;
    }
}
