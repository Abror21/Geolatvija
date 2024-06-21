<?php

return [
    [
        'name' => 'Datu izplatīšanas veidu uzraudzība',
        'command' => 'geo_product:health_check',
        'cron' => '0 * * * *',
        'is_active' => true,
    ],
    [
        'name' => 'VZD datu sync',
        'command' => 'vzd:import',
        'cron' => '0 2 * * *',
        'is_active' => true,
    ],
];
