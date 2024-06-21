<?php

namespace App\Services;

use App\Exceptions\InvalidAction;
use App\Repositories\UiMenuRepository;
use Exception;

/**
 * Class UiMenuService
 * @package App\Services
 */
class UiMenuService extends BaseService
{

    /**
     * UiMenuService constructor.
     * @param UiMenuRepository $uiMenuRepository
     */
    public function __construct
    (
        private UiMenuRepository $uiMenuRepository,
    )
    {
    }

    public function getUserUiMenuList(): array
    {
        $uiMenuList = $this->uiMenuRepository->getUserUiMenuList();

        return $this->formatUiMenu($uiMenuList->toArray());
    }

    public function getFooterUiMenuList()
    {
        return $this->uiMenuRepository->getFooterUiMenuList();
    }

    public function getUiMenuByCode($code)
    {
        return $this->uiMenuRepository->findBy('unique_key', $code);
    }

    public function formatUiMenu(array $authorisedUiMenus): array
    {
        $uiMenu = collect($authorisedUiMenus)->whereNull('parent_id');

        //divide list by parent ids, based on - https://stackoverflow.com/questions/4196157/create-array-tree-from-array-list
        $new = array();
        foreach ($authorisedUiMenus as $menu) {
            $new[$menu['parent_id']][] = $menu;
        }

        //make tree
        return $this->createTree($new, $uiMenu);
    }

    public function createTree(&$list, $parents): array
    {
        $tree = [];
        foreach ($parents as $parent) {
            if (isset($list[$parent['id']])) {
                $parent['menu_child'] = $this->createTree($list, $list[$parent['id']]);
            }

            $tree[] = $parent;
        }

        return $tree;
    }

    public function getUiMenuList($options)
    {
        return $this->uiMenuRepository->getUiMenuList($options);
    }

    public function getSelectUiMenuList($type, $filter)
    {
        return $this->uiMenuRepository->getSelectUiMenuList($type, $filter);
    }

    public function getUiMenu($id)
    {
        return $this->uiMenuRepository->findById($id);
    }


    public function updateUiMenu($id, $data): array
    {
        $uiMenu = $this->uiMenuRepository->update($id, $data);

        return $this->snakeToCamelArrayKeys($uiMenu->toArray());
    }

    public function createUiMenu($data): array
    {
        $existingUniqueKey = $this->uiMenuRepository->findBy('unique_key', $data['unique_key']);

        if ($existingUniqueKey) {
            throw new InvalidAction('validation.code_already_used', 412);
        }

        $uiMenu = $this->uiMenuRepository->store($data);

        return $this->snakeToCamelArrayKeys($uiMenu->toArray());
    }

    public function delete($ids): bool
    {
        $this->uiMenuRepository->deleteMany($ids);

        return true;
    }
}
