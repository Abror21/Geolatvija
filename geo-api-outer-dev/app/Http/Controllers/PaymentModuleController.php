<?php


namespace App\Http\Controllers;


use App\Services\PaymentModuleClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * Class DppsController
 * @package App\Http\Controllers\Spor
 */
class PaymentModuleController extends Controller
{
    public function __construct(private readonly PaymentModuleClient $paymentModuleClient)
    {
    }

    /**
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function savePaymentRequest(Request $request): JsonResponse | Response
    {
        $data = json_decode($request->getContent(), true);

        $response = $this->paymentModuleClient->call('SavePaymentRequest', $this->paymentModuleClient->buildPaymentData($data));

        if (isset($response['success']) && !$response['success']) {
            return $this->errorResponse($response, ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        } else {
            return $this->successResponse($response);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse|Response
     * @throws \Exception
     */
    public function checkPaymentRequestStatus(Request $request): JsonResponse | Response
    {
        $data = json_decode($request->getContent(), true);

        $response = $this->paymentModuleClient->call('CheckPaymentRequestStatus', $data);
//        (P = Procesā, E = Izpildīts, R = ExpireDate, O = Other, iespējams tikai ja apmaksas nodrošinātājs atgriež)

        if (isset($response['success']) && !$response['success']) {
            return $this->errorResponse($response, ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        } else {
            return $this->successResponse($response);
        }
    }
}
