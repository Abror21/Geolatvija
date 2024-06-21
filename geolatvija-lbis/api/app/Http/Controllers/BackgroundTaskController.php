<?php

namespace App\Http\Controllers;

use App\Enums\SystemSettingTypes;
use App\Http\Requests\BackgroundTaskStoreRequest;
use App\Http\Requests\PaginationRequest;
use App\Http\Requests\ProcessingTypeStoreRequest;
use App\Services\BackgroundTaskService;
use App\Services\ProcessingTypeService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BackgroundTaskController extends Controller
{


    public function __construct(private BackgroundTaskService $backgroundTaskService)
    {
    }

    /**
     * @description Get list of Background tasks
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $systemSettingsList = $this->backgroundTaskService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSettingsList->toArray()));
    }

    /**
     * @description Get Background task
     */
    public function show($id): Response
    {
        $systemSetting = $this->backgroundTaskService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }


    /**
     * @description Update Background task
     */
    public function update(BackgroundTaskStoreRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $systemSetting = $this->backgroundTaskService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Disable Background task
     */
    public function disable(Request $request, $id): Response
    {
        $systemSetting = $this->backgroundTaskService->disable($id, $request->input('active'));

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Run Background tasks with specific IDs
     */
    public function run(Request $request): Response
    {
        $this->backgroundTaskService->run($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Finish Background task
     */
    public function finishTask(Request $request): Response
    {
        $this->backgroundTaskService->finishTask($request->input('command'));

        return $this->successResponse(true);
    }
}
