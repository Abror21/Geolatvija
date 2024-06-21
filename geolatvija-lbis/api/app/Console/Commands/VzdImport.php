<?php

namespace App\Console\Commands;

use App\Repositories\BackgroundTaskRepository;

use App\Services\API\APIOuterAPI;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class VzdImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vzd:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'VZD import';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        private BackgroundTaskRepository $backgroundTaskRepository,
        private APIOuterAPI $APIOuterAPI
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
        parent::__construct();
    }


    public function handle()
    {
        $started = Carbon::now();

        if (env('APP_ENV') === 'local') {
            return;
        }

        $this->APIOuterAPI->call('api/v1/vzd/initiate-file-download', ['command' => $this->signature], "GET", $this->headers);

        $task = $this->backgroundTaskRepository->findBy('command', $this->signature);

        $task->executed_at = $started;
        $task->update();
    }

}
