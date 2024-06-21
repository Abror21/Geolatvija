<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use SoapClient;

/**
 * Class VzdService
 * @package App\Services
 */
class PaymentModuleClient
{
    private $client;

    public function __construct()
    {
    }

    /**
     * @param $authorityUID
     * @throws \Exception
     */
    private function initClient()
    {
        $stream_context = stream_context_create([
            'ssl' => [
                'ciphers' => 'DHE-RSA-AES256-SHA:DHE-DSS-AES256-SHA:AES256-SHA',
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ]
        ]);

        $soapClientConfig = array(
            'local_cert' => storage_path(env('PAYMENT_MODULE_CERTIFICATE_PATH')),
            'passphrase' => env('PAYMENT_MODULE_CERTIFICATE_SECRET'),
            'stream_context' => $stream_context,
            'exceptions' => true,
            'trace' => true,
        );

        $this->client = new SoapClient(env('PAYMENT_MODULE_WSDL'), $soapClientConfig);
    }

    /**
     * @param string $method
     * @param array $data
     * @return array|false|string
     * @throws \Exception
     */
    public function call(string $method, array $data)
    {
        $this->initClient();

        if (!$this->isMethodValid($method)) {
            return ['success' => false, 'message' => 'method_not_found'];
        }
        try {
            Log::info('Calling "' . $method . '" with params: ' . json_encode($data));

            $response = $this->callSoap($method, $data);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }

        $response->success = true;

        return json_encode($response);
    }

    /**
     * @param string $method
     * @param array $data
     * @param null $authority
     * @return mixed
     * @throws \Exception
     */
    private function callSoap(string $method, array $data, $authority = null)
    {
        if ($authority) {
            $this->initClient($authority);
        }
        return $this->client->__call($method, array($method => $data));
    }

    /**
     * @param string $method
     * @return bool
     */
    private function isMethodValid(string $method): bool
    {
        $SOAPMethods = $this->client->__getFunctions();
        $valid = false;

        foreach ($SOAPMethods as $SOAPMethod) {
            if (str_contains($SOAPMethod, $method)) {
                $valid = true;
                break;
            }
        }

        return $valid;
    }

    /**
     * @param $data
     * @return array
     */
    public function buildPaymentData($data): array
    {
        $requestData['paymentRequest'] = [
            "Payment" => null,
            "PaymentRequest" => [
                "ClientInfo" => $data['client_info'],
                "ParentPaymentRequestID" => null,
                "PaymentObject" => null, // "PaymentObject": "1L0Y0 payment",
                "PriceList" => [
                    [
                        "Item" => $data['item'],
                        "ItemElementName" => "Amount",
                        "Position" => $this->parsePosition($data['position'])
                    ]
                ],
                "ResponseUrl" => $data['response_url'],
                "ServerResponseUrl" => $data['response_url'],
                "ServiceStep" => $data['service_step']
            ],
            "PaymentRequestPPK" => null,
            "PaymentRequestResponse" => null,
            "PaymentRequestStatus" => null
        ];

        return $requestData;
    }

    /**
     * @param $position
     * @return string
     */
    private function parsePosition($position): string
    {
        if ($position[0] === '0') {
            return substr($position, 1);

        }
        return $position;
    }
}
