<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginationRequest;
use App\Http\Requests\UiMenuSubmitRequest;
use App\Services\UiMenuService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class UiMenuController extends Controller
{

    /**
     * UiMenuController constructor.
     * @param UiMenuService $uiMenuService
     */
    public function __construct(private UiMenuService $uiMenuService)
    {
    }


    /**
     * @description Get list of User UI Menus
     */
    public function getUserUiMenuList(Request $request): Response
    {
        $uiMenuList = $this->uiMenuService->getUserUiMenuList();

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList));
    }

    /**
     * @description Get list of Footer UI Menus
     */
    public function getFooterUiMenuList()
    {
        $uiMenuList = $this->uiMenuService->getFooterUiMenuList();

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList->toArray()));
    }

    /**
     * @description Get UI Menu by code
     */
    public function getUiMenuByCode($code)
    {
        $uiMenuList = $this->uiMenuService->getUiMenuByCode($code);

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList->toArray()));
    }

    /**
     * @description Get list of UI Menus
     */
    public function getUiMenuList(PaginationRequest $request)
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $uiMenuList = $this->uiMenuService->getUiMenuList($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList->toArray()));
    }

    /**
     * @description Get UI Menus for Select field
     */
    public function getSelectUiMenuList(Request $request)
    {
        $type = $request->input('fetchType');
        $filter = $this->camelToSnakeArrayKeys(json_decode($request->input('filter'), true));

        $uiMenuList = $this->uiMenuService->getSelectUiMenuList($type, $filter);

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList->toArray()));
    }

    /**
     * @description Get UI Menu
     */
    public function getUiMenu($id)
    {
        $uiMenuList = $this->uiMenuService->getUiMenu($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList->toArray()));
    }

    /**
     * @description Update UI Menu
     */
    public function updateUiMenu(UiMenuSubmitRequest $request, $id)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());
        unset($data['unique_key']); //can't be updated

        $uiMenuList = $this->uiMenuService->updateUiMenu($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList));
    }

    /**
     * @description Create UI Menu
     */
    public function createUiMenu(UiMenuSubmitRequest $request)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $uiMenuList = $this->uiMenuService->createUiMenu($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($uiMenuList));
    }

    /**
     * @description Delete UI Menus by IDs
     */
    public function delete(Request $request): Response
    {
        $this->uiMenuService->delete($request->input('ids'));

        return $this->successResponse(true);
    }
}
