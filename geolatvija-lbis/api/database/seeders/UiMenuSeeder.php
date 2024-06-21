<?php

namespace Database\Seeders;

use App\Models\UiMenu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Class UiMenuSeeder
 * @package Database\Seeders
 */
class UiMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $uiMenu = include(database_path('defaults/uiMenu.php'));

        foreach ($uiMenu as $entry) {
            $exists = UiMenu::where('unique_key', $entry['unique_key'])->first();

            if ($exists) {
                continue;
            }

            if ($entry['parent_id']) {
                $uiMenu = UiMenu::where('unique_key', $entry['parent_id'])->first();

                $entry['parent_id'] = $uiMenu->id;
            }

            UiMenu::create(
                collect($entry)
                    ->put('unique_key', $entry['unique_key'] ?? Str::replace('.', '_', $entry['translation']))
                ->toArray()
            );
        }
    }
}
