<?php

namespace App\Console;

use App\Repositories\BackgroundTaskRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use DateTimeZone;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * @param Application $app
     * @param Dispatcher $events
     */
    public function __construct(
        Application $app,
        Dispatcher $events,
        private BackgroundTaskRepository $backgroundTaskRepository,
        private readonly GeoProductFileRepository $geoProductFileRepository
    )
    {
        parent::__construct($app, $events);
    }

    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('role:is_active')->daily();
        $schedule->command('geoproduct:status')->daily();
        $schedule->command('geoproduct:expire')->daily();
        $schedule->command('user:embeds')->everyFourHours();
        $schedule->command('payment:status-sync')->everyTenMinutes();
        $schedule->command('user-notifications:sync-notification-groups-with-database')->dailyAt('02:00');
        $schedule->command('user-notifications:send-unsent-notifications')->dailyAt('02:00');
        $schedule->command('geoproduct:soft-delete-old-geo-product-order-drafts')->dailyAt('02:00');
        $schedule->command('userembeds:delete-temp-user-embeds')->dailyAt('02:00');
        $schedule->command('geoproductorders:check-inactive-geo-product-orders')->dailyAt('02:00');
        $schedule->command('sanctum:prune-expired --hours=24')->daily();
        $schedule->command('geoproduct:delete-expired-ordered-files')->dailyAt('02:00');

        $this->database($schedule);
        $this->ftpFileSync($schedule);
    }

    private function database(Schedule $schedule)
    {
        $tasks = $this->backgroundTaskRepository->active();

        foreach ($tasks as $task) {
            $schedule->command($task->command)->cron($task->cron);
        }
    }

    /**
     * @param Schedule $schedule
     * @return void
     */
    private function ftpFileSync(Schedule $schedule)
    {
        $tasks = $this->geoProductFileRepository->getCronExpresions();

        foreach ($tasks as $task) {
            $schedule->command("ftp:sync {$task->id}")->cron($task->ftp_cron);
        }
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }

}
