<?php


namespace App\Http\Controllers;


use App\Services\API\DppsAPI;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Class DppsController
 * @package App\Http\Controllers\Spor
 */
class DppsController extends Controller
{

    /**
     * LocationsController constructor.
     * @param DppsAPI $dppsAPI
     */
    public function __construct(private DppsAPI $dppsAPI)
    {
    }

    public function createParentLink(Request $request): Response|JsonResponse
    {
        try {
            $response = $this->dppsAPI->call('/api/DPPSPackage/create-api', $request->all(), 'POST');

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function updateParentLink(Request $request): Response|JsonResponse
    {
        try {
            $response = $this->dppsAPI->call('/api/DPPSPackage/update-api', $request->all(), 'POST');

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function  capabilities(Request $request)
    {
        try {
            $dppsUuid = $request->input('dpps_uuid');
            $dppsName = $request->input('dpps_name');
            $params = $request->input('params');

            $response = $this->dppsAPI->call('/api/DPPSPackage/client/' . $dppsName . '/' . $dppsUuid, $params, 'GET', [], [], true);

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), 403);
        }
    }

    public function deleteParentLink(Request $request): Response|JsonResponse
    {
        try {
            $response = $this->dppsAPI->call('/api/DPPSPackage/delete-api', $request->all(), 'POST');

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }


    public function createChildLink(Request $request): Response|JsonResponse
    {
        try {
            $response = $this->dppsAPI->call('/api/DPPSPackage/create-access', $request->all(), 'POST');

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function monitorLink(Request $request): JsonResponse|Response
    {
        try {
            $response = $this->dppsAPI->call('/api/DPPSPackage/monitor-access', $request->all(), 'POST');

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }
}
