<?php


namespace App\Services\API;


class AMKAPI extends API
{

    /**
     * AMKAPI constructor.
     */
    public function __construct()
    {
        $this->setParameters([
            'host' => config("amk.amk_service_url")
        ]);
    }

}
