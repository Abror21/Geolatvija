<?php


namespace App\Http\Controllers;


use App\Services\API\GeoServerAPI;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Class GeoServerController
 * @package App\Http\Controllers\Spor
 */
class GeoServerController extends Controller
{

    /**
     * LocationsController constructor.
     * @param GeoServerAPI $geoServeriApi
     */
    public function __construct(private GeoServerAPI $geoServeriApi)
    {
    }

    /**
     * @param Request $request
     * @return Response|JsonResponse
     */
    public function getCadastrs(Request $request): Response|JsonResponse
    {
        try {

            $response = $this->geoServeriApi->call('/geoserver/vraa/wfs', $request->all());

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }



}
