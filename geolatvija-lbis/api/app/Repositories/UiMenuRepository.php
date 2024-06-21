<?php

namespace App\Repositories;

use App\Models\UiMenu;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UiMenuRepository
 * @package App\Repositories
 */
class UiMenuRepository extends BaseRepository
{

    /**
     * UiMenuRepository constructor.
     * @param UiMenu $uiMenu
     */
    public function __construct(UiMenu $uiMenu)
    {
        parent::__construct($uiMenu);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new UiMenu();
    }

    public function getUserUiMenuList()
    {
        $role = $this->activeRole();
        $isAuthenticated = isset($role);

        return UiMenu::select('ui_menus.*')
            ->leftJoin('rights', function ($q) {
                return $q->on('rights.ui_menu_id', '=', 'ui_menus.id')->where('rights.is_allowed', true);
            })
            ->leftJoin('user_groups', 'user_groups.id', '=', 'rights.user_group_id')
            ->whereNull('user_groups.deleted_at')
            ->where('ui_menus.is_public', true)
            ->where('ui_menus.is_footer', false)
            ->when(!$isAuthenticated, function ($q) {
                return $q->where('user_groups.code', 'public');
            })
            ->when($isAuthenticated, function ($q) use ($role) {
                return $q->join('roles', 'roles.user_group_id', '=', 'user_groups.id')
                    ->where('roles.id', $role->id)
                    ->whereNull('roles.deleted_at');
            })
            ->orderBy('sequence', 'ASC')
            ->groupBy('ui_menus.id')
            ->get();
    }

    public function getFooterUiMenuList()
    {
        return UiMenu::select('ui_menus.*')
            ->where('ui_menus.is_public', true)
            ->where('ui_menus.is_footer', true)
            ->orderBy('sequence', 'ASC')
            ->get();
    }

    public function getUiMenuList($options): mixed
    {
        return UiMenu::select(['ui_menus.*', 'parent_ui_menus.translation as parent_translation'])
            ->leftJoin('ui_menus as parent_ui_menus', function ($join) {
                $join->on('parent_ui_menus.id', '=', 'ui_menus.parent_id');
            })
            ->when(isset($options['filter']['is_public']), function ($query) use ($options) {
                return $query ->where('ui_menus.is_public', true);
            })

            ->when(isset($options['filter']['name']), function ($query) use ($options) {
                return $query->where('ui_menus.translation', 'ILIKE', '%' . $options['filter']['name'] . '%');
            })
            ->when(isset($options['sort_by']), function ($query) use ($options) {
                return $query->orderBy($this->parseOrderBy($options['sort_by']), $options['order_by'] ?? 'ASC');
            })
            ->paginate($options["page_size"] ?? 10);
    }

    public function getSelectUiMenuList($type, $filter): mixed
    {
        $query = UiMenu::select(['ui_menus.id', 'ui_menus.translation'])
            ->where('ui_menus.is_public', true)
            ->when(isset($filter['sort_by']),
                function ($query) use ($filter) {
                    return $query->orderBy($this->parseOrderBy($filter['sort_by']), $filter['order_by'] ?? 'ASC');
                },
                function ($query) {
                    return $query->orderBy('sequence', 'ASC');
                }
            );

        if ($type !== "ALL") {
            $query->where('ui_menus.is_footer', false)
                ->whereNotNull('ui_menus.parent_id');
        }

        return $query->get();
    }

    public function deleteMany($ids): mixed
    {
        return UiMenu::whereIn('ui_menus.id', $ids)
            ->delete();
    }
}
