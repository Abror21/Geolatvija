<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginationRequest;
use App\Http\Requests\SystemSettingUpdateRequest;
use App\Services\SystemSettingService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class SystemSettingController extends Controller
{


    public function __construct(private SystemSettingService $systemSettingService)
    {
    }

    /**
     * @description Get list of System Settings
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $systemSettingsList = $this->systemSettingService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSettingsList->toArray()));
    }

    /**
     * @description Get System Setting
     */
    public function show($id): Response
    {
        $systemSetting = $this->systemSettingService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Update System Setting
     */
    public function update(SystemSettingUpdateRequest $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $systemSetting = $this->systemSettingService->update($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting->toArray()));
    }

    /**
     * @description Get Frontend
     */
    public function frontend(): Response
    {
        $systemSetting = $this->systemSettingService->frontend();

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting));
    }

    /**
     * @description Get Captcha
     */
    public function captchaShow(): Response
    {
        $systemSetting = $this->systemSettingService->captchaShow();

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting));
    }

    /**
     * @description Get Session Inactivity time
     */
    public function getSessionInactivityTime(): Response
    {
        $systemSetting = $this->systemSettingService->getSessionInactivityTime();

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting));
    }

    /**
     * @description Get DIV: File download availability duration
     */
    public function getDivFileDownloadAvailabilityDuration(): Response
    {
        $systemSetting = $this->systemSettingService->getDivFileDownloadAvailabilityDuration();

        return $this->successResponse($this->snakeToCamelArrayKeys($systemSetting));
    }

    /**
     * @description Update Captcha
     */
    public function captchaUpdate(Request $request): Response
    {
        $this->systemSettingService->captchaUpdate($request->input('geoproduct_captcha'));

        return $this->successResponse(true);
    }

    /**
     * @description Validate Captcha
     */
    public function submitCaptcha(Request $request): bool
    {
        return $this->validateCaptcha($request);
    }
}
