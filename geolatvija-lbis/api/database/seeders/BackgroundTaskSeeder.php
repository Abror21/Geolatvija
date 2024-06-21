<?php

namespace Database\Seeders;

use App\Models\BackgroundTask;
use Illuminate\Database\Seeder;
class BackgroundTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        BackgroundTask::truncate();

        $systemSettings = include(database_path('defaults/backgroundTasks.php'));

        foreach ($systemSettings as $entry) {
            BackgroundTask::create(
                $entry
            );
        }


    }
}
