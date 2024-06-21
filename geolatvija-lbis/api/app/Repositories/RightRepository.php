<?php


namespace App\Repositories;

use App\Models\Right;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class RightRepository extends BaseRepository
{

    /**
     * RightRepository constructor.
     * @param Rights $right
     */
    public function __construct(Right $userGroup)
    {
        parent::__construct($userGroup);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Right();
    }

    public function getRights()
    {
        return Right::get();
    }

    public function getUserRights($userId, $roleId)
    {
        return Right::select(['rights.id', 'rights.is_allowed', 'ui_menus.unique_key', 'user_groups.code'])
            ->join('user_groups', 'user_groups.id', 'rights.user_group_id')
            ->join('ui_menus', 'ui_menus.id', 'rights.ui_menu_id')
            ->join('roles', function ($join) use ($userId) {
                $join->on('roles.user_group_id', '=', 'user_groups.id')
                    ->where('roles.user_id', $userId)
                    ->where('roles.is_active', true)
                    ->whereNull('roles.deleted_at');
            })
            ->where('roles.id', $roleId)
            ->where('rights.is_allowed', true)
            ->where('ui_menus.is_public', true)
            ->whereNull('user_groups.deleted_at')
            ->get();
    }

    public function updateMultiple($options)
    {
        foreach ($options as $data) {
            $userGroupId = $data["userGroupId"];
            $uiMenuId = $data["uiMenuId"];
            $isAllowed = $data["isAllowed"];

            $right = Right::where('user_group_id', $userGroupId)
            ->where('ui_menu_id', $uiMenuId)
            ->first();

            if ($right) {
                $right->is_allowed = $isAllowed;
                $right->save();
            } else {
                $store = [
                    'user_group_id' =>$userGroupId,
                    'is_allowed' => $isAllowed,
                    'ui_menu_id' => $uiMenuId
                ];

                $this->store($store);
            }
        }

        return;
    }
}
