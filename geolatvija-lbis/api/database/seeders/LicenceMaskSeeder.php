<?php

namespace Database\Seeders;

use App\Models\LicenceMask;
use Illuminate\Database\Seeder;
class LicenceMaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        LicenceMask::truncate();

        $systemSettings = include(database_path('defaults/licenceMasks.php'));

        foreach ($systemSettings as $entry) {
            LicenceMask::create(
                $entry
            );
        }


    }
}
