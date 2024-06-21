<?php

namespace App\Http\Controllers\Integrations;


use App\Http\Controllers\Controller;
use App\Services\API\APIOuterAPI;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AmkController extends Controller
{
    public function __construct(private APIOuterAPI $APIOuterAPI)
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    /**
     * @description Get Amk Address
     */
    public function address(Request $request): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/amk/address', $request->all(), "GET", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Get Amk Address Struct
     */
    public function addressStruct(Request $request): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/amk/address-struct', $request->all(), "GET", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Resolve Amk
     */
    public function resolve(Request $request): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/amk/resolve', $request->all(), "GET", $this->headers);

        return $this->successResponse($response);
    }

}
