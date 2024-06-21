<?php

namespace App\Logging;

use Monolog\Logger;

class CreateCustomLogger
{

    /**
     * @param array $config
     * @return Logger
     */
    public function __invoke(array $config)
    {
        if (isset($config['url']) && $config['url']) {
            return new Logger(
                env('APP_NAME'),
                [
                    new MattermostHandler(
                        $config['url'],
                        $config['level']
                    ),
                ]
            );
        }
    }
}
