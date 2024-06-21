<?php


namespace App\Http\Controllers;


use App\Services\VzdService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Class VzdController
 * @package App\Http\Controllers\Spor
 */
class VzdController extends Controller
{

    public function __construct(private VzdService $vzdService)
    {
    }


    public function initiateFileDownload(): Response|JsonResponse
    {
        try {
            $this->vzdService->initiateFileDownload();

            return $this->successResponse('');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

}
