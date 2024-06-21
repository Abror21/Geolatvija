<?php


namespace App\Services\API;

use App\Traits\RequestResponseHelpers;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class DppsAPI
{
    use RequestResponseHelpers;

    private string $host = '';
    private string $token = '';

    /**
     * DppsAPI constructor.
     */
    public function __construct()
    {
        $this->setParameters([
            'host' => config("dpps.base_uri"),
        ]);
    }

    /**
     * @param string $url
     * @param array $data
     * @param string $method
     * @param array $headers
     * @param array $options
     * @param bool $isFile
     * @return array|string
     */
    public function call($url, $data = [], $method = "GET", $headers = [], $options = [], $isFile = false): array|string
    {
        $headers = array_merge(
            $headers,
            [
                "Accept" => "application/json",
                'Authorization' => $this->token,
            ]
        );

        $options = array_merge(
            $options
        );

        return $this->actualCall($url, $data, $method, $headers, $options, $isFile);
    }


    /**
     * @param $url == for example "http:://URL/api/..."
     * @param array $data
     * @param string $method
     * @param array $headers
     * @param array $options
     * @return array|string
     */
    public function actualCall($url, $data = [], $method = "GET", $headers = [], $options = [], $isFile = false): array|string
    {
        $client = new Client([
            'base_uri' => $this->host,
        ]);

        $headers = array_merge(
            $this->getDefaultRequestHeaders(),
            $headers
        );

        if ($method == 'GET') {
            $type = 'query';
            $dataObject = $data;
        } else {
            if (isset($data['form_params'])) {
                $type = 'form_params';
                $dataObject = $data['form_params'];
            } else {
                $type = 'body';
                $dataObject = json_encode($data);
            }
        }

        $options = array_merge(
            $options,
            [
                $type => $dataObject,
                'headers' => $headers,
                'connect_timeout' => config('zvais.connection_timeout', 30),
                'verify' => false
            ]
        );

        return $this->makeRequest($client, $method, $this->host . $url, $options, $isFile);
    }

    /**
     * @param $client
     * @param $method
     * @param $url
     * @param $options
     * @return mixed
     */
    public function makeRequest($client, $method, $url, $options, $isFile = false, $stop = false): mixed
    {
        try {

            $response = $client->request($method, $url, $options);

            if ($isFile) {
                return $response->getBody()->__toString();
            }

            return json_decode($response->getBody()->__toString(), true) ?: '';
        } catch (\Exception $e) {
            $errorResponse = json_decode($e->getResponse()->getBody(), true);

            Log::error($e->getMessage(), $e->getTrace());

            //todo change from message to code when DPPS makes their changes
            if (isset($errorResponse['message']) && $e->getCode() === 401 && !$stop) {
                $this->login('/api/auth/get-token');
                $client = new Client([
                    'base_uri' => $this->host,
                ]);

                $options['headers']['Authorization'] =  $this->token;

                return $this->makeRequest($client, $method, $url, $options, false, true);
            }

            if (isset($errorResponse['error'])) {
                throw new \Exception($errorResponse['error'], $e->getCode());
            }

            if (isset($errorResponse['message'])) {
                throw new \Exception($errorResponse['message'], $e->getCode());
            }

            if (!empty($errorResponse)) {
                return $errorResponse;
            }

            return ["error" => ["code" => $e->getCode(), "message" => "API call error"]];
        }
    }

    /**
     * Set default connection parameters
     * @param array $params
     */
    public function setParameters(array $params): void
    {
        $this->host = $params['host'];
        $this->token = Cache::get('dpps_token') ?? '';
    }


    public function login($url): array|string
    {
        $client = new Client([
            'base_uri' => $this->host
        ]);

        $headers = $this->getDefaultRequestHeaders();


        $type = 'body';
        $dataObject = json_encode([
            'email' => config('dpps.email'),
            'password' => config('dpps.password')
        ]);


        $options = [
            $type => $dataObject,
            'headers' => $headers,
            'connect_timeout' => 30,
            'verify' => false
        ];


        $response = $this->makeRequest($client, "POST", $this->host . $url, $options, false);

        if (isset($response['data']['access_token'])) {
            Cache::put('dpps_token', 'Bearer ' . $response['data']['access_token']);

            $this->token = 'Bearer ' . $response['data']['access_token'];
        }

        return $response;
    }
}
