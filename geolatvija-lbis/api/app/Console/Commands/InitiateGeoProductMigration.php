<?php

namespace App\Console\Commands;

use App\Enums\GeoProductStatus;
use App\Imports\GeoProductImport;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Services\API\APIOuterAPI;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class InitiateGeoProductMigration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geoproduct:migration';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initiate geo product migration';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        private GeoProductImport $geoProductImport
    )
    {
        parent::__construct();
    }


    public function handle()
    {
        Excel::import($this->geoProductImport, 'Geomigr-final.xlsx');
    }

}
