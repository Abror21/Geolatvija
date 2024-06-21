<?php

namespace Database\Seeders;

use App\Models\Right;
use App\Models\UiMenu;
use App\Models\UserGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Class UserGroupSeeder
 * @package Database\Seeders
 */
class UserGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $userGroups = include(database_path('defaults/userGroups.php'));
        $menus = UiMenu::all();
        Right::truncate();

        foreach ($userGroups as $entry) {
            if ($entry['code']) {
                $group = UserGroup::where('code', $entry['code'])->first();

                if ($group) {
                    $group->name = $entry['name'];
                    $group->description = $entry['description'];
                    $group->update();
                } else {
                    $group = UserGroup::create($entry);
                }

                foreach ($menus as $menu) {
                    $right = [
                        'is_allowed' => $entry['code'] == 'admin' ? true : false,
                        'user_group_id' => $group->id,
                        'ui_menu_id' => $menu->id
                    ];

                    Right::create($right);
                }

                continue;
            }

            UserGroup::create($entry);
        }
    }
}
