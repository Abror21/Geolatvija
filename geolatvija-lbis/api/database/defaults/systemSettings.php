<?php

return [
    [
        'key' => 'entityId',
        'name' => 'A Identifikators (URI) priekš Servisa Nodrošinātāja entītijas.',
        'value' => env('SAML2_SP_ENTITYID', ''),
        'file_name' => 'saml2.sp',
    ],
    [
        'key' => 'FILE_FORMAT',
        'name' => 'Faila xlsx',
        'value' => 'xls xlsx',
        'file_name' => 'frontend',
        'setting_type' => 'FILE_FORMAT'
    ],
    [
        'key' => 'FILE_SIZE',
        'name' => 'Faila lielums',
        'value' => 50000,
        'file_name' => 'frontend',
        'setting_type' => 'FILE_SIZE'
    ],
    [
        'key' => 'GEOPRODUCT_CAPTCHA',
        'name' => 'Ģeoprodukta Captcha',
        'value' => 0,
        'file_name' => 'frontend',
    ],
    [
        'key' => 'SESSION_INACTIVITY_TIME',
        'name' => 'Lietotāja neaktīvās sessijas laiks (sekundes)',
        'value' => 180,
        'file_name' => 'frontend',
    ],
    [
        'key' => 'SESSION_INACTIVITY_TOKEN_TIME',
        'name' => 'Lietotāja neaktīvās sessijas uznirstoša loga laiks (sekundes)',
        'value' => 60,
        'file_name' => 'frontend',
    ],
    [
        'key' => 'ikv',
        'name' => 'Izmantotā kontrolētā vārdnica',
        'value' => 'GEMET',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'e_length',
        'name' => 'Rietuma garums',
        'value' => '20.700',
        'file_name' => 'predefined',
    ],
    [
        'key' => 's_length',
        'name' => 'Dienvidu platums',
        'value' => '55.600',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'w_length',
        'name' => 'Austrumu garums',
        'value' => '28.500',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'n_length',
        'name' => 'Ziemeļu platums',
        'value' => '58.100',
        'file_name' => 'predefined',
    ],

    [
        'key' => 'spec_name',
        'name' => 'Specifikācijas nosaukums',
        'value' => ' Komisijas Regula (ES) Nr. 1089/2010 (2010. gada 23. novembris), ar kuru īsteno Eiropas Parlamenta un Padomes Direktīvu 2007/2/EK attiecībā uz telpisko datu kopu un telpisko datu pakalpojumu savstarpējo izmantojamību ',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'spec_date',
        'name' => 'Specifikācijas datums',
        'value' => '2010-12-08',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'spec_type',
        'name' => 'Specifikācijas tips',
        'value' => 'publication',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'pvn',
        'name' => 'PVN',
        'value' => '1.21',
        'file_name' => 'frontend',
    ],

    [
        'key' => 'specification_name',
        'name' => 'Specifikācijas nosaukums',
        'value' => 'Komisijas Regula (ES) Nr. 1089/2010 (2010. gada 23. novembris), ar kuru īsteno Eiropas Parlamenta un Padomes Direktīvu 2007/2/EK attiecībā uz telpisko datu kopu un telpisko datu pakalpojumu savstarpējo izmantojamību',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'specification_date',
        'name' => 'Specifikācijas datums',
        'value' => '2010-12-08',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'specification_type',
        'name' => 'Specifikācijas tips',
        'value' => 'publication',
        'file_name' => 'predefined',
    ],
    [
        'key' => 'div_file_download_availability_duration',
        'name' => 'Datnes lejupielādes pieejamības laiks pēc pasūtīšanas (sekundes)',
        'value' => '2592000',
        'file_name' => 'frontend',
    ],
];
