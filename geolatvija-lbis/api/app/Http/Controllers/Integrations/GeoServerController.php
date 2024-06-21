<?php

namespace App\Http\Controllers\Integrations;


use App\Http\Controllers\Controller;
use App\Services\API\GeoServerAPI;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GeoServerController extends Controller
{
    public function __construct(private GeoServerAPI $geoServerAPI)
    {
    }

    /**
     * @description Get VRAA WFS
     */
    public function wfs(Request $request): Response|JsonResponse
    {
        $format = $request->input('FORMAT');
        $isImage = str_contains($format, 'image');

        $response = $this->geoServerAPI->call('/geoserver/vraa/wfs', $request->all(), 'GET', [], [], $isImage);

        return $this->successResponse($response, 200, ['Content-Type' => $request->input('format')]);
    }

    /**
     * @description Get VRAA WMS
     */
    public function wms(Request $request): Response|JsonResponse
    {
        $format = $request->input('FORMAT');
        $isImage = str_contains($format, 'image');

        $response = $this->geoServerAPI->call('/geoserver/vraa/wms', $request->all(), 'GET', [], [], $isImage);

        return $this->successResponse($response, 200, ['Content-Type' => $request->input('format')]);
    }


    /**
     * @description Get VRAA GWC
     */
    public function gwc(Request $request, $path)
    {
        $format = $request->input('Format');
        $isImage = str_contains($format, 'image');

        $response = $this->geoServerAPI->call('/geoserver/gwc/' . $path, $request->all(), 'GET', [], [], $isImage);

        return $this->successResponse($response, 200, ['Content-Type' => $request->input('format')]);
    }
}
