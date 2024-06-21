<?php

return [

    // Backend Base URI
    'base_uri' => env('BASE_URI', 'http://geo-backend:8080/'),

    'base_frontend_uri' => env('BASE_FRONTEND_URI', 'http://localhost:3000'),

    // Connection timeout
    'connection_timeout' => env('CONNECTION_TIMEOUT', 30),

    'api_outer_service_token' => env('GEO_API_OUTER_SERVICE_TOKEN', 'secret'),

    'api_outer' => env('GEO_API_OUTER', 'http://geo-api-outer:8082/'),
    'secret' => env('GEO_SECRET', ''),

];
