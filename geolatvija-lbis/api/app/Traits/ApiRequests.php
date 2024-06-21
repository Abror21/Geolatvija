<?php

namespace App\Traits;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;

trait ApiRequests {

    use RequestResponseHelpers;

    /**
     * @param $url
     * @param array $data
     * @param string $method
     * @param array $headers
     * @param false $isDownloadable
     * @return Response|\Laravel\Lumen\Http\ResponseFactory|mixed|string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function performRequest($url, $data = [], $method = "GET",  $headers = [], $isDownloadable = false)
    {

        $client = new Client([
            'base_uri' => $this->baseUri,
        ]);

        $headers = array_merge(
            $this->getDefaultRequestHeaders(),
            $headers
        );

        try {
            $requestOptions = [
                ($method == 'GET' ? 'query' : 'body') => ($method == 'GET' ? $data : json_encode($data)),
                'headers' => $headers,
                'connect_timeout' => config('geo.connection_timeout'),
                'verify' => false
            ];

            if($isDownloadable) {
                $requestOptions['stream'] = true;
            }

            $response = $client->request($method, $this->baseUri . $url, $requestOptions);

            if($isDownloadable) {
                return response($response->getBody()->getContents())->withHeaders($response->getHeaders());
            }

            return json_decode($response->getBody()->__toString(), true) ? : '';

        } catch (GuzzleException $e) {
            $response = $e->getResponse();

            $decodedResponse =  json_decode($response->getBody()->getContents(), true) ? : '';

            // When api-outer (spor) returns error its in message parameter
            if (isset($decodedResponse['error']['message'])) {
                throw new Exception($decodedResponse['error']['message'] ?? $e->getMessage(), $decodedResponse['code'] ?? $e->getCode());
            }

            throw new Exception($decodedResponse['error'] ?? $e->getMessage(), $decodedResponse['code'] ?? $e->getCode());
        }

    }


    /**
     * @param $url
     * @param array $data
     * @param string $method
     * @param array $headers
     * @return mixed|string
     * @throws Exception
     */
    public function performMultipartRequest($url, $data = [], $method = "GET",  $headers = [])
    {

        $client = new Client([
            'base_uri' => $this->baseUri,
        ]);

        $headers = array_merge(
            $this->getDefaultRequestHeaders(),
            $headers
        );

        unset($headers['content-type']);

        $multipartData = [];

        foreach ($data as $field => $value) {
            if (is_array($value)) {
                foreach ($value as $key => $file) {
                    if($file instanceof UploadedFile) {
                        $multipartData[] = [
                            'name' => $field . '[]',
                            'contents' => $file->get(),
                            'filename' => $file->getClientOriginalName()
                        ];
                    } else if (is_array($file)) {
                        foreach ($file as $realFile) {
                            if($realFile instanceof UploadedFile) {
                                $multipartData[] = [
                                    'name' => $field . '[' . $key . '][]',
                                    'contents' => $realFile->get(),
                                    'filename' => $realFile->getClientOriginalName()
                                ];
                            }
                        }
                    } else {
                        $multipartData[] = [
                            'name' => $field . '[' . $key . ']',
                            'contents' => $file,
                        ];
                    }
                }
            } else if($value instanceof UploadedFile) {
                $multipartData[] = [
                    'name' => $field,
                    'contents' => $value->get(),
                    'filename' => $value->getClientOriginalName()
                ];
            } else {
                $multipartData[] = [
                    'name' => $field,
                    'contents' => $value
                ];
            }
        }

        try {
            $response = $client->request($method, $this->baseUri . $url,
                [
                    ($method == 'GET' ? 'query' : 'body') => ($method == 'GET' ? $data : json_encode($data)),
                    'headers' => $headers,
                    'connect_timeout' => config('geo.connection_timeout'),
                    'verify' => false,
                    'multipart' => $multipartData
                ]
            );

            return json_decode($response->getBody()->__toString(), true) ? : '';

        } catch (GuzzleException $e) {
            $response = $e->getResponse();

            $decodedResponse =  json_decode($response->getBody()->getContents(), true) ? : '';

            throw new Exception($decodedResponse['error'] ?? $e->getMessage(), $decodedResponse['code'] ?? $e->getCode());
        }

    }


}
