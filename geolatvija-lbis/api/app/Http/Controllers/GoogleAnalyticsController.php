<?php

namespace App\Http\Controllers;

use App\Http\Requests\GoogleAnalyticsRequest;
use App\Services\GoogleAnalyticsService;
use Illuminate\Http\Response;

class GoogleAnalyticsController extends Controller
{
    public function __construct(private GoogleAnalyticsService $googleAnalyticsService)
    {
    }

    /**
     * @description Get Google Analytics
     */
    public function show($id): Response
    {
        $script = $this->googleAnalyticsService->show($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($script->toArray()));
    }

    /**
     * @description Update Google Analytics
     */
    public function update(GoogleAnalyticsRequest $request, $id)
    {
        $data = $this->camelToSnakeArrayKeys($request->validated());

        $script = $this->googleAnalyticsService->updateGoogleAnalyticsScript($id, $data);

        return $this->successResponse($this->snakeToCamelArrayKeys($script->toArray()));
    }
}
