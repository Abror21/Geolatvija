<?php

namespace App\Console\Commands;

use App\Services\API\APIOuterAPI;
use App\Services\NotificationGroupService;
use App\Traits\CamelToSnakeHelper;
use Illuminate\Console\Command;

class SyncNotificationGroupsWithDatabase extends Command
{
    use CamelToSnakeHelper;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user-notifications:sync-notification-groups-with-database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Retrieves notification groups from TAPIS and synchronizes them with the database';

    public function __construct(
        private readonly NotificationGroupService $notificationGroupService,
        private readonly APIOuterAPI $APIOuterAPI,
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
            $response = $this->APIOuterAPI->call('api/v1/tapis/get-notification-groups', [], "GET", $this->headers);

            if (isset($response['NotificationSubscriptionGroups'])) {
                foreach ($response['NotificationSubscriptionGroups'] as $group) {
                    $snake = $this->camelToSnakeArrayKeys($group);
                    $snake['tapis_id'] = $snake['id'];
                    $this->notificationGroupService->updateOrInsert($snake);
                }
            } else {
                $this->error('Invalid API response: Missing "NotificationSubscriptionGroups"');
            }
        } catch (\Exception $e) {
            $this->error('API request failed: ' . $e->getMessage());
        }
    }
}
