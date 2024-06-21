<?php

namespace App\Http\Controllers;


use App\Http\Requests\PaginationRequest;
use App\Services\OrderedLicenceService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderedLicenceController extends Controller
{

    public function __construct(private OrderedLicenceService $orderedLicenceService)
    {
    }

    /**
     * @description Get list of Ordered Licences
     */
    public function index(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $notificationList = $this->orderedLicenceService->index($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($notificationList->toArray()));
    }

    /**
     * @param $id
     * @return JsonResponse|StreamedResponse
     * @throws Exception
     * @description Download Order Licence
     */
    public function download($id): JsonResponse|StreamedResponse
    {
        return $this->orderedLicenceService->download($id);
    }
}
