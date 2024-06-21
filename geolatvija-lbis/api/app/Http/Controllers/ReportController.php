<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginationRequest;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
    )
    {
    }

    /**
     * @param PaginationRequest $request
     * @return Response
     * @description Make a Report
     */
    public function report(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $response = $this->reportService->report($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($response));
    }

    /**
     * @param Request $request
     * @return BinaryFileResponse
     * @description Export Report
     */
    public function export(Request $request): BinaryFileResponse
    {
        $response = $this->reportService->export($request->filter);

        return $response['file']->download($response['file_name']);
    }

    /**
     * @description Get Report view count
     */
    public function viewCount(Request $request): Response
    {
        $response = $this->reportService->viewCount(json_decode($request->input('filter'), true));

        return $this->successResponse($this->snakeToCamelArrayKeys($response->toArray()));
    }


}
