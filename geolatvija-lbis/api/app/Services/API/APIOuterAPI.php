<?php


namespace App\Services\API;

/**
 * Class APIOuterAPI
 * @package App\Services\API
 */
class APIOuterAPI extends API
{

    /**
     * APIOuterAPI constructor.
     */
    public function __construct()
    {
        $this->setParameters([
            'host' => config('geo.api_outer')
        ]);
    }

}
