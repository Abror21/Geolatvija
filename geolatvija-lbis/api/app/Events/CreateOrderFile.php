<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CreateOrderFile
{
    use Dispatchable, SerializesModels, InteractsWithSockets;

    public $files;
    public $order_id;

    /**
     * Create a new event instance.
     */
    public function __construct($files, $orderId)
    {
        $this->files = $files;
        $this->order_id = $orderId;
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
