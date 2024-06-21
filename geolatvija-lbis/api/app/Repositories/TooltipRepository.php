<?php

namespace App\Repositories;

use App\Models\Tooltip;
use Illuminate\Database\Eloquent\Model;


class TooltipRepository extends BaseRepository
{


    public function __construct(Tooltip $tooltip)
    {
        parent::__construct($tooltip);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Tooltip();
    }


    public function getTooltipList($options): mixed
    {
        $filterSettings = [
            'code' => 'like:tooltips.code',
            'translation' => 'like:tooltips.translation',
            'ui_menu_id' => 'like:tooltips.ui_menu_id',
        ];


        return Tooltip::select(['tooltips.*', 'ui_menus.translation as ui_menu_translation'])
            ->leftJoin('ui_menus', function ($join) {
                $join->on('ui_menus.id', '=', 'tooltips.ui_menu_id');
            })
            ->search($filterSettings, $options['filter'])
            ->paginate($options["page_size"] ?? 10);
    }

    public function tooltips(): mixed
    {
        $activeRole = $this->activeRole();

        return Tooltip::select(['tooltips.*', 'ui_menus.unique_key'])
            ->join('ui_menus', function ($join) {
                $join->on('ui_menus.id', '=', 'tooltips.ui_menu_id');
            })
            ->join('rights', function ($q) {
                return $q->on('rights.ui_menu_id', '=', 'ui_menus.id')->where('rights.is_allowed', true);
            })
            ->join('user_groups', 'user_groups.id', '=', 'rights.user_group_id')
            ->join('roles', function ($q) use ($activeRole) {
                return $q->on('roles.user_group_id', '=', 'user_groups.id')
                    ->where('roles.id', $activeRole->id)
                    ->whereNull('roles.deleted_at');
            })
            ->groupBy('tooltips.id', 'ui_menus.unique_key')
            ->get();
    }

    public function deleteMultiple($ids): mixed
    {
        return Tooltip::whereIn('id', $ids)
            ->delete();
    }



}
