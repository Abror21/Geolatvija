<?php

namespace App\Console\Commands;

use App\Enums\GeoProductStatus;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Services\API\APIOuterAPI;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GeoProductStatusCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geoproduct:status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if need to change geoproduct status';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        private GeoProductRepository $geoProductRepository,
        private APIOuterAPI $APIOuterAPI,
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
        parent::__construct();
    }


    public function handle()
    {
        $geoProducts = $this->geoProductRepository->unacceptableStatus();

        foreach ($geoProducts as $geoProduct) {
            if ($geoProduct->status === GeoProductStatus::PLANNED){
                $geoProduct->status = GeoProductStatus::PUBLIC;
                $geoProduct->update();

                continue;
            }

            try {
                if ($geoProduct->status === GeoProductStatus::PUBLIC){
                    $geoProduct->status = GeoProductStatus::DRAFT;

                    $services = $geoProduct->geoProductServices;

                    foreach ($services as $service) {
                        if ($service->dpps_name) {
                            $parsed = [
                                'api_name' => $service->dpps_name,
                                'test' => 't',
                            ];

                            $this->APIOuterAPI->call('api/v1/dpps/api/DPPSPackage/delete-api', $parsed, 'POST', $this->headers);

                            $service->dpps_name = null;
                            $service->update();
                        }
                    }

                    $geoProduct->update();
                }
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }
    }

}
