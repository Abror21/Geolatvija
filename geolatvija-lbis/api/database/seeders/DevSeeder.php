<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DevSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UiMenuSeeder::class,
            ClassifiersSeeder::class,
            UserGroupSeeder::class,
            SystemSettingSeeder::class,
            BackgroundTaskSeeder::class,
            LicenceMaskSeeder::class,
            Saml2Seeder::class,
            GoogleAnalyticsSeeder::class,
        ]);
    }
}
