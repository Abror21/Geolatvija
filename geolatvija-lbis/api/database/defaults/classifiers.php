<?php

$KL4Values = include(database_path('defaults/kl4Values.php'));
$KL5Values = include(database_path('defaults/kl5Values.php'));
$KL7Values = include(database_path('defaults/kl7Values.php'));

function generateKL15Values(): array
{
    $array = [];
    for ($i = 1; $i <= 99; $i++) {
        $newElement = [
            'value_code' => (string)$i,
            'translation' => (string)$i,
        ];
        $array[] = $newElement;
    }
    return $array;
}

return [
    [
        'unique_code' => "KL1",
        'translation' => 'Atjaunošanas biežums',
        'values' => [
            [
                'value_code' => "ONCE_A_DAY",
                "translation" => "Vienreiz dienā",
            ],
            [
                'value_code' => "ONCE_A_WEEK",
                "translation" => "Vienreiz Nedēļā",
            ],
            [
                'value_code' => "ONCE_A_MONTH",
                "translation" => "Vienreiz mēnesī",
            ],
            [
                'value_code' => "ONCE_A_YEAR",
                "translation" => "Vienreiz gadā",
            ],
        ]
    ],
    [
        'unique_code' => "KL2",
        'translation' => 'Koordinātes sistēma',
        'values' => [
            [
                'value_code' => "ETRS89-GRS80",
                "translation" => "ETRS89-GRS80 (EPSG:4258)",
            ],
        ]
    ],
    [
        'unique_code' => "KL3",
        'translation' => 'Mērogs',
        'values' => [
            [
                'value_code' => "10000",
                "translation" => "1:10000",
            ],
        ]
    ],
    [
        'unique_code' => "KL4",
        'translation' => 'Telpisko Datu Klasifikācija',
        'values' => $KL4Values,
    ],
    [
        'unique_code' => "KL5",
        'translation' => 'Inspire datu tēmu',
        'values' => $KL5Values,
    ],
    [
        'unique_code' => "KL6",
        'translation' => 'Atslēgvārdi',
        'values' => [
            [
                'value_code' => "Kadastrāli zemes gabali",
                "translation" => "Kadastrāli zemes gabali",
            ],
        ]
    ],

    [
        'unique_code' => "KL7",
        'translation' => 'Prioritārā Datu Tēma',
        'values' => $KL7Values,
    ],

    [
        'unique_code' => "KL8",
        'translation' => 'Datu izplatīšanas veids',
        'values' => [
            [
                'value_code' => "SERVICE",
                "translation" => "Pakalpe",
            ],
            [
                'value_code' => "FILE",
                "translation" => "Datne",
            ],
            [
                'value_code' => "OTHER",
                "translation" => "Cits",
            ],
            [
                'value_code' => "NO",
                "translation" => "Nav",
            ],
        ],
    ],

    [
        'unique_code' => "KL9",
        'translation' => 'Pakalpes veids',
        'values' => [
            [
                'value_code' => "WMS",
                "translation" => "WMS",
            ],
            [
                'value_code' => "WMTS",
                "translation" => "WMTS",
            ],
            [
                'value_code' => "WFS",
                "translation" => "WFS",
            ],
            [
                'value_code' => "INSPIRE_VIEW",
                "translation" => "Inspire view",
            ],
            [
                'value_code' => "FEATURE_DOWNLOAD",
                "translation" => "Feature download",
            ],
        ]
    ],

    [
        'unique_code' => "KL10",
        'translation' => 'Datnes pievienošanas veids',
        'values' => [
            [
                'value_code' => "ADD",
                "translation" => "Pievienot",
            ],
            [
                'value_code' => "LOAD_ON_FTP",
                "translation" => "Ielāde no FTP",
            ],
        ]
    ],

    [
        'unique_code' => "KL12",
        'translation' => 'Pēc piederības',
        'values' => [
            [
                'value_code' => "MUNICIPAL_AUTHORITY",
                "translation" => "Pašvaldības iestāde",
            ],
            [
                'value_code' => "STATE_OF_AUTHORITY",
                "translation" => "Valsts iestāde",
            ],
            [
                'value_code' => "LEGAL_PERSON",
                "translation" => "Juridiska persona",
            ],
            [
                'value_code' => "INDIVIDUAL",
                "translation" => "Fiziska persona",
            ],
        ]
    ],


    [
        'unique_code' => "KL14",
        'translation' => 'Perioda vērtību klasifikators',
        'values' => [
            [
                'value_code' => "DAY",
                "translation" => "dienas(-ām)",
            ],
            [
                'value_code' => "WEEK",
                "translation" => "nedēļas (-ām)",
            ],
            [
                'value_code' => "MONTH",
                "translation" => "mēneša (-iem)",
            ],
            [
                'value_code' => "YEAR",
                "translation" => "gada (-iem)",
            ],
        ]
    ],

    [
        'unique_code' => "KL15",
        'translation' => 'Numuru klasifikators',
        'values' => generateKL15Values()
    ],

    [
        'unique_code' => "KL19",
        'translation' => 'Pasūtījuma statusa klasifikators',
        'values' => [
            [
                'value_code' => "DRAFT",
                "translation" => "Melnraksts",
            ],
            [
                'value_code' => "CANCELLED",
                "translation" => "Anulēts",
            ],
            [
                'value_code' => "ONHOLD",
                "translation" => "Apturēts",
            ],
            [
                'value_code' => "ACTIVE",
                "translation" => "Aktīvs",
            ],
            [
                'value_code' => "INACTIVE",
                "translation" => "Neaktīvs",
            ],
        ]
    ],

    [
        'unique_code' => "KL21",
        'translation' => 'Lietotāju statusu klasifikators',
        'values' => [
            [
                'value_code' => "ACTIVE",
                "translation" => "Aktīvs",
            ],
            [
                'value_code' => "INACTIVE",
                "translation" => "Neaktīvs",
            ],
        ]
    ],
    [
        'unique_code' => "KL27",
        'translation' => 'Izmantošanas mērķi',
        'values' => []
    ],
    [
        'unique_code' => "KL28",
        'translation' => 'Iestādes veidi',
        'values' => [
            [
                'value_code' => "LOREM",
                "translation" => "Lorem",
            ],
        ]
    ],
    [
        'unique_code' => "KL29",
        'translation' => 'Lietotāja veidi',
        'values' => [
            [
                'value_code' => "PHYSICAL_PERSON",
                "translation" => "Fiziska persona",
            ],
            [
                'value_code' => "LEGAL_PERSON",
                "translation" => "Juridiska persona",
            ],
        ]
    ],
    [
        'unique_code' => "KL30",
        'translation' => 'Datņu veidi',
        'values' => [
            [
                'value_code' => "*.shp",
                "translation" => "*.shp",
            ],
            [
                'value_code' => "*.gml",
                "translation" => "*.gml",
            ],
            [
                'value_code' => "*.zip",
                "translation" => "*.zip",
            ],
        ]
    ],
];
