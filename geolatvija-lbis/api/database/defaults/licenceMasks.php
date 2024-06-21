<?php

// If seed attributes changes do not forget change array keys
// Services/GeoProductOrderService.php
// $templateProcessor->setValues(
//     [
//         'vards' => $user->name,
//         'uzvards' => $user->surname,
//         'personas_kods' => $user->personal_code,
//         'registracijas_numurs' => $organization->reg_nr,
//         'geoprodukta_nosaukums' => $geoProduct->name,
//         'datu_izplatisanas_veids' => $type
//     ]
// );

return [
    [
        'name' => 'Vārds',
        'attribute' => '${vards}',
        'access_key' => 'name',
    ],
    [
        'name' => 'Uzvārds',
        'attribute' => '${uzvards}',
        'access_key' => 'surname',
    ],
    [
        'name' => 'Personas kods',
        'attribute' => '${personas_kods}',
        'access_key' => 'personal_code',
    ],
    [
        'name' => 'Reģistrācijas numurs',
        'attribute' => '${registracijas_numurs}',
        'access_key' => 'reg_nr',
    ],
    [
        'name' => 'Ģeoprodukta nosaukums',
        'attribute' => '${geoprodukta_nosaukums}',
        'access_key' => 'geoproduct_name',
    ],
    [
        'name' => 'Datu izplatīšanas veids',
        'attribute' => '${datu_izplatisanas_veids}',
        'access_key' => 'distribution_method',
    ],
];
