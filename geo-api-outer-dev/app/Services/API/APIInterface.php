<?php


namespace App\Services\API;


use Psr\Http\Message\ResponseInterface;

interface APIInterface
{

    public function call(string $url, array $data, string $method, array $headers);

    /**
     * Set default connection parameters
     * @param array $params
     * @return void
     */
    public function setParameters(array $params): void;

}
