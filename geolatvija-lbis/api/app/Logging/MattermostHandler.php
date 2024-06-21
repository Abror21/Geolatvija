<?php

namespace App\Logging;

use GuzzleHttp\Client;
use Monolog\Logger;
use Monolog\Handler\AbstractProcessingHandler;
use Illuminate\Support\Facades\Log;

class MattermostHandler extends AbstractProcessingHandler
{
    private $webHookUrl;
    private $client;

    public function __construct($webHookUrl, $level = Logger::DEBUG, $bubble = true, $client = null)
    {
        parent::__construct($level, $bubble);

        $this->webHookUrl = $webHookUrl;
        $this->client     = ($client) ?: new Client();
    }

    /**
     * @param array $record
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function write(\Monolog\LogRecord $record): void
    {
        $this->client->request('POST', $this->webHookUrl, [
            'form_params' => [
                'payload' => json_encode(
                    [
                        'username' => env('MATTERMOST_USERNAME'),
                        'icon_url' => env('MATTERMOST_ICON'),
                        'text'     => $record['message'],
                    ]
                ),
            ],
        ]);
    }
}
