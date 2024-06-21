<?php


namespace App\Services\API;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class GeoNetworkAPI extends API
{

    private string $token = '';

    /**
     * GeoServerAPI constructor.
     */
    public function __construct()
    {
        $this->setParameters([
            'host' => config("geonetwork.base_uri"),
            'auth' => [config("geonetwork.user"), config("geonetwork.password")]
        ]);
    }

    /**
     * @param string $url
     * @param array $data
     * @param string $method
     * @param array $headers
     * @param array $options
     * @return array|string
     */
    public function call($url, $data = [], $method = "GET", $headers = [], $options = [], $isFile = false, $multipart = false): array|string
    {
        $headers = array_merge(
            [
                "Accept" => "application/json",
            ],
            $headers
        );

        $options = array_merge(
            $options
        );

        return $this->actualCall($url, $data, $method, $headers, $options, $isFile, $multipart);
    }


    /**
     * @param $url == for example "http:://URL/api/..."
     * @param array $data
     * @param string $method
     * @param array $headers
     * @param array $options
     * @return array|string
     */
    public function actualCall($url, $data = [], $method = "GET", $headers = [], $options = [], $isFile = false, $multipart = false): array|string
    {
        $client = new Client([
            'base_uri' => $this->host,
            'auth' => $this->auth,
            'cookies' => $options['cookie_jar'] ?? false,
        ]);

        $headers = array_merge(
            $this->getDefaultRequestHeaders(),
            $headers
        );

        if ($multipart) {
            unset($headers['content-type']);
        }

        if (isset($options['add_in_params']) || $method == 'GET') {
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
    public function makeRequest($client, $method, $url, $options, $stop): mixed
    {
        try {
            $options['headers']['X-XSRF-TOKEN'] = ($options['cookie_jar']->toArray()[0]['Value'] ?? null);

            $response = $client->request($method, $url, $options);

            return json_decode($response->getBody()->__toString(), true) ?: $response->getBody()->__toString();
        } catch (\Exception $e) {
            $errorResponse = json_decode($e->getResponse()->getBody(), true);

            if ($e->getCode() == 403 && !$stop) {
                $options['headers']['X-XSRF-TOKEN'] = ($options['cookie_jar']->toArray()[0]['Value']);

                return $this->makeRequest($client, $method, $url, $options, true);
            }

//            Log::error($e->getMessage(), $e->getTrace());

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
        $this->auth = $params['auth'];
    }
}
