<?php

namespace App\Console\Commands;

use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckInactiveGeoProductOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geoproductorders:check-inactive-geo-product-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks geo product orders which are expired and sets them to INACTIVE status';

    public function __construct(
        private readonly ClassifierValueRepository $classifierValueRepository,
        private readonly GeoProductOrderRepository $geoProductOrderRepository,
    )
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orders = $this->geoProductOrderRepository->all();

        $inactiveStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'INACTIVE');

        foreach ($orders as $order) {
            if (isset($order->expire_at)) {
                $expireDate = Carbon::parse($order->expire_at);
                if (Carbon::now()->gt($expireDate)) {
                    if ($order->order_status_classifier_value_id !== $inactiveStatus->id) {
                        $this->geoProductOrderRepository->update($order, ['order_status_classifier_value_id' => $inactiveStatus->id]);
                    }
                }
            }
        }
    }
}
