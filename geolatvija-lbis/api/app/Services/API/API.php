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
    public function call($url, $data = [], $method = "GET",  $headers = [], $options = [], $isFile = false): array|string
    {
        $client = new Client([
            'base_uri' => $this->host,
            'verify' => false
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
                'connect_timeout' => 10,
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

            Log::error($e->getMessage());

            if(isset($errorResponse['error'])) {
                throw new \Exception($errorResponse['error'], $e->getCode());
            }

            if (!empty($errorResponse)) {
                return $errorResponse;
            }

            throw new \Exception("API call error", $e->getCode());
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
