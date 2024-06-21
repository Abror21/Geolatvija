<?php

namespace App\Console\Commands;

use App\Repositories\GeoProductOrderRepository;
use App\Services\GeoProductOrderService;
use Illuminate\Console\Command;

class PaymentStatusSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:status-sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync payment module status';

    public function __construct(
        private readonly GeoProductOrderRepository $geoProductOrderRepository,
        private readonly GeoProductOrderService $geoProductOrderService

    )
    {
        parent::__construct();
    }
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $processingPayments = $this->geoProductOrderRepository->findBy('payment_request_status', 'P', true);

        foreach ($processingPayments as $processingPayment) {
            $this->geoProductOrderService->status($processingPayment->id);
        }
    }
}
