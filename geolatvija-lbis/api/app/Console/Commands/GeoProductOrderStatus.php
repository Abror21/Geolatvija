<?php

namespace App\Console\Commands;

use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GeoProductOrderStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geoproduct:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if order is expired and change status to INACTIVE';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        private GeoProductOrderRepository           $geoProductOrderRepository,
        private ClassifierValueRepository           $classifierValueRepository
    )
    {
        parent::__construct();
    }

    public function handle()
    {
        $orders = $this->geoProductOrderRepository->expireToday();
        $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'INACTIVE');

        try {
            foreach ($orders as $order) {
                $order->order_status_classifier_value_id = $classifierValue->id;
                $order->save();
            }

        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }
    }
}
