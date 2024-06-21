<?php

namespace App\Console\Commands;

use App\Services\API\APIOuterAPI;
use App\Services\UserNotificationService;
use Illuminate\Console\Command;

class SyncUserNotificationsWithDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user-notifications:sync-with-database {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Retrieves user notifications from TAPIS and synchronizes them with the database';

    public function __construct(
        private readonly UserNotificationService $userNotificationService,
        private readonly APIOuterAPI $APIOuterAPI

    ) {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        try {
            $id = $this->argument('id');
            $response = $this->APIOuterAPI->call('api/v1/tapis/get-user-notifications/' . $id, [], "GET", $this->headers);

            $this->userNotificationService->syncUserNotificationsFromTapis($response, $id);

        } catch (\Exception $e) {
            $this->error('API request failed: ' . $e->getMessage());
        }
    }
}
