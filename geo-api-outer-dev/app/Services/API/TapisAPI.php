<?php


namespace App\Services\API;

class TapisAPI extends API
{

    /**
     * TapisAPI constructor.
     */
    public function __construct()
    {
        $this->setParameters([
            'host' => config("tapis.base_uri")
        ]);
    }

    /**
     * @param string $url
     * @param string $data
     * @param string $method
     * @param array $headers
     * @param array $options
     * @param bool $isFile
     * @return array|string
     */
    public function call($url, $data = [], $method = "GET", $headers = [], $options = [], $isFile = false): array|string
    {
        $headers = array_merge(
            [
                "content-type" => "application/json",
                "Accept" => "application/json"
            ],
            $headers,
        );

        $options = array_merge(
            $options
        );

        return parent::call($url, $data, $method, $headers, $options, $isFile);
    }

}
