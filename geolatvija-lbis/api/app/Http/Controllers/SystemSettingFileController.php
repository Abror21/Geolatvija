<?php

namespace App\Http\Controllers;

use App\Enums\SystemSettingTypes;
use App\Http\Requests\PaginationRequest;
use App\Http\Requests\SystemSettingUpdateRequest;
use App\Services\SystemSettingFileService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class SystemSettingFileController extends Controller
{


    public function __construct(private SystemSettingFileService $systemSettingFileService)
    {
    }

    /**
     * @description Get list of System Settings by type: FILE_FORMAT
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $systemSettingsList = $this->systemSettingFileService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSettingsList->toArray()));
    }

    /**
     * @description Get System Setting File
     */
    public function show($id): Response
    {
        $systemSetting = $this->systemSettingFileService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Create System Setting File
     */
    public function store(SystemSettingUpdateRequest $request): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());
        $data['key'] =  SystemSettingTypes::FILE_FORMAT;
        $data['setting_type'] =  SystemSettingTypes::FILE_FORMAT;
        $data['file_name'] = 'frontend';

        $systemSetting = $this->systemSettingFileService->store($data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Update System Setting File
     */
    public function update(SystemSettingUpdateRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());
        $data['setting_type'] = SystemSettingTypes::FILE_FORMAT;
        $data['key'] =  SystemSettingTypes::FILE_FORMAT;
        $data['file_name'] = 'frontend';

        $systemSetting = $this->systemSettingFileService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Delete System Settings by IDs (System Settings with type: FILE_FORMAT)
     */
    public function delete(Request $request): Response
    {
        $this->systemSettingFileService->delete($request->input('ids'));

        return $this->successResponse(true);
    }

    /**
     * @description Get System Setting by setting type: FILE_SIZE
     */
    public function sizeShow(): Response
    {
        $systemSetting = $this->systemSettingFileService->sizeShow();

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Update System Setting FILE_SIZE
     */
    public function sizeUpdate(Request $request): Response
    {
        $this->systemSettingFileService->sizeUpdate($request->input('value'));

        return $this->successResponse(true);
    }

}
