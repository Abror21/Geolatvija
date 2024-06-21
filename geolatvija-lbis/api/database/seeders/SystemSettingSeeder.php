<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $systemSettings = include(database_path('defaults/systemSettings.php'));

        foreach ($systemSettings as $entry) {
            $exists = SystemSetting::where('key', $entry['key'])->first();

            if (!$exists) {
                SystemSetting::create(
                    $entry
                );
            }
        }


    }
}
