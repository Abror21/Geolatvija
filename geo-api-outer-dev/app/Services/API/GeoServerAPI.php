<?php


namespace App\Services\API;

class GeoServerAPI extends API
{

    /**
     * GeoServerAPI constructor.
     */
    public function __construct()
    {
        $this->setParameters([
            'host' => config("geoserver.base_uri")
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
    public function call($url, $data = [], $method = "GET", $headers = [], $options = [], $isFile = false): array|string
    {
        $headers = array_merge(
            $headers,
            [
                "Accept" => "application/json"
            ]
        );

        $options = array_merge(
            $options
        );

        return parent::call($url, $data, $method, $headers, $options, $isFile);
    }

}
