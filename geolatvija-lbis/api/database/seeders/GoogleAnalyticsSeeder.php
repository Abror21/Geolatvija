<?php

namespace Database\Seeders;

use App\Models\GoogleAnalytics;
use Illuminate\Database\Seeder;

class GoogleAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GoogleAnalytics::truncate();
        GoogleAnalytics::create([
            'id' => 1,
            'script' => '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>'
                . '<script> window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}'
                . 'gtag("js", new Date());gtag("config", "G-XXXXXXXXXX");</script>',
        ]);

    }
}
