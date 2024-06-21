<?php

namespace App\Console\Commands;

use App\Repositories\UserNotificationRepository;
use App\Services\UserNotificationService;
use Illuminate\Console\Command;

class SendUnsentNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user-notifications:send-unsent-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks for unsent user notifications and tries to send them to TAPIS';

    public function __construct(
        private readonly UserNotificationService $userNotificationService,
        private readonly UserNotificationRepository $userNotificationRepository,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $notifications = $this->userNotificationRepository->all();
        $softDeletedNotifications = $this->userNotificationRepository->onlyTrashed();

        foreach ($notifications as $notification) {
            if (!$notification->sent_to_tapis && $notification->tapis_id) {
                $this->userNotificationService->sendUpdateNotificationToTapis($notification);

                continue;
            }

            if (!$notification->sent_to_tapis && !$notification->tapis_id) {
                $this->userNotificationService->sendCreateNotificationToTapis($notification);
            }
        }

        foreach ($softDeletedNotifications as $notification) {
            if (!$notification->sent_to_tapis && !$notification->deleted_in_tapis && $notification->tapis_id) {
                $this->userNotificationService->sendDeleteUserNotificationToTapis($notification->getKey());
            }
        }
    }

}
