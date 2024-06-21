<?php

namespace App\Http\Controllers\Integrations;


use App\Http\Controllers\Controller;
use App\Services\API\GeoNetworkAPI;
use App\Services\API\GeoServerAPI;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GeoNetworkController extends Controller
{
    public function __construct(private GeoServerAPI $geoServerAPI, private GeoNetworkAPI $geoNetworkAPI)
    {
    }

    /**
     * @description Geo Network Proxy
     */
    public function proxy(Request $request, $path)
    {
        $jar = new CookieJar;
        $response = $this->geoNetworkAPI->call('/geonetwork/inspire/' . $path, $request->all(), 'GET', ['Accept' => 'application/XML'], ['cookie_jar' => $jar]);

        return $this->successResponse($response, 200, ['Content-Type' => $request->input('format')]);
    }

    /**
     * @description Geo Network open data Proxy
     */
    public function opendataProxy(Request $request, $path)
    {
        $jar = new CookieJar;
        $response = $this->geoNetworkAPI->call('/geonetwork/opendata/' . $path, $request->all(), 'GET', ['Accept' => 'application/XML'], ['cookie_jar' => $jar]);

        return $this->successResponse($response, 200, ['Content-Type' => $request->input('format')]);
    }


    /**
     * @description Get Geo Network Metadata
     */
    public function metadata(Request $request, $path)
    {
        $jar = new CookieJar;

        $response = $this->geoNetworkAPI->call('/geonetwork/srv/api/' . $path, $request->all(), 'GET', ['Accept' => 'application/XML'], ['cookie_jar' => $jar], false);

        return $this->successResponse($response, 200, ['Content-Type' => $request->input('format')]);
    }
}
