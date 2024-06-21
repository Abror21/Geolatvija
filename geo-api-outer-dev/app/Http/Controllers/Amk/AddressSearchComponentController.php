<?php


namespace App\Http\Controllers\Amk;


use App\Http\Controllers\Controller;
use App\Http\Requests\Amk\AddressRequest;
use App\Http\Requests\Amk\AddressStuctRequest;
use App\Http\Requests\Amk\ResolveRequest;
use App\Services\API\AMKAPI;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

/**
 * Class AddressSearchComponentController
 * @package App\Http\Controllers\Amk
 */
class AddressSearchComponentController extends Controller
{

    /**
     * AddressSearchComponentController constructor.
     * @param AMKAPI $AMKAPI
     */
    public function __construct(private AMKAPI $AMKAPI)
    {}

    /**
     * The method is used to search for an address and returns the corresponding address
     * according to the entered parameters, or the address closest to the coordinates.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function address(AddressRequest $request): Response|JsonResponse
    {
        try {
            $requestData = $request->validated();

            $response = $this->AMKAPI->call('/address', $requestData);

            return $this->successResponse($response);
        } catch (ValidationException $e) {
            $validation = $this->snakeToCamelArrayKeys(collect(json_decode($e->getResponse()->getContent()))->toArray());
            Log::error($e->getTraceAsString());

            return $this->errorResponse($validation, $e->status);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), ($e->getCode() == 0) ? 500 : $e->getCode());
        }
    }

    /**
     * The method is used to search for an address and returns the corresponding address a
     * according to the entered parameters, or according to the coordinates of the nearest address in a structured way
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function addressStruct(AddressStuctRequest $request): Response|JsonResponse
    {
        try {
            $requestData = $request->validated();

            $requestData['lks_koord'] = true;

            $response = $this->AMKAPI->call('/address-struct', $requestData);

            if (!$response) {
                $response = [];
            }

            return $this->successResponse(array_values(array_filter($response, function ($item) {
                return $item["typ"] === 108;
            })));
        } catch (ValidationException $e) {
            $validation = $this->snakeToCamelArrayKeys(collect(json_decode($e->getResponse()->getContent()))->toArray());
            Log::error($e->getTraceAsString());

            return $this->errorResponse($validation, $e->status);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), ($e->getCode() == 0) ? 500 : $e->getCode());
        }
    }

    /**
     * Returns the decoded address (structure, coordinates, etc.)
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function resolve(ResolveRequest $request): Response|JsonResponse
    {
        try {

            $requestData = $request->validated();

            $response = $this->AMKAPI->call('/resolve', $requestData);

            return $this->successResponse($response);
        } catch (ValidationException $e) {
            $validation = $this->snakeToCamelArrayKeys(collect(json_decode($e->getResponse()->getContent()))->toArray());
            Log::error($e->getMessage());

            return $this->errorResponse($validation, $e->status);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), ($e->getCode() == 0) ? 500 : $e->getCode());
        }
    }
}
