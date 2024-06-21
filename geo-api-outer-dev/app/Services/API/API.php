<?php


namespace App\Services\API;


use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;
use App\Traits\RequestResponseHelpers;

/**
 * Class API
 * @package App\Services\API
 */
class API implements APIInterface
{
    use RequestResponseHelpers;

    private string $host = '';

    /**
     * @param $url == for example "http:://URL/api/..."
     * @param array $data
     * @param string $method
     * @param array $headers
     * @param array $options
     * @return array|string
     */
    public function call($url, $data = [], $method = "GET", $headers = [], $options = [], $isFile = false): array|string
    {
        $client = new Client([
            'base_uri' => $this->host
        ]);

        $headers = array_merge(
            $this->getDefaultRequestHeaders(),
            $headers
        );

        if (isset($options['unset-content-type'])) {
            unset($headers['content-type']);
        }

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

        if (isset($options['body'])) {
            $dataObject = $options['body'];
        }

        if (isset($options['type'])) {
            $type = $options['type'];
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
    public function makeRequest($client, $method, $url, $options, $isFile): mixed
    {
        try {
            $response = $client->request($method, $url, $options);

            if ($isFile) {
                return $response->getBody()->__toString();
            }

            return json_decode($response->getBody()->__toString(), true) ? : '';
        } catch (ClientException $e) {
            $errorResponse = json_decode($e->getResponse()->getBody(), true);

            Log::error($e->getMessage(), $e->getTrace());

            if(isset($errorResponse['error'])) {
                throw new \Exception($errorResponse['error'], $e->getCode());
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
    }
}
