<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'validation.accepted',
    'active_url' => 'validation.active_url',
    'after' => 'validation.after',
    'after_or_equal' => 'validation.after_or_equal',
    'alpha' => 'validation.alpha',
    'alpha_dash' => 'validation.alpha_dash',
    'alpha_num' => 'validation.alpha_num',
    'array' => 'validation.array',
    'before' => 'validation.before',
    'before_or_equal' => 'validation.before_or_equal',
    'between' => [
        'numeric' => 'validation.between.numeric',
        'file' => 'validation.between.file',
        'string' => 'validation.between.string',
        'array' => 'validation.between.array',
    ],
    'boolean' => 'validation.boolean',
    'confirmed' => 'validation.confirmed',
    'date' => 'validation.date',
    'date_equals' => 'validation.date_equals',
    'date_format' => 'validation.date_format',
    'different' => 'validation.different',
    'digits' => 'validation.digits',
    'digits_between' => 'validation.digits_between',
    'dimensions' => 'validation.dimensions',
    'distinct' => 'validation.distinct',
    'email' => 'validation.email',
    'ends_with' => 'validation.ends_with',
    'exists' => 'validation.exists',
    'file' => 'validation.file',
    'filled' => 'validation.filled',
    'gt' => [
        'numeric' => 'validation.gt.numeric',
        'file' => 'validation.gt.file',
        'string' => 'validation.gt.string',
        'array' => 'validation.gt.array',
    ],
    'gte' => [
        'numeric' => 'validation.gte.numeric',
        'file' => 'validation.gte.file',
        'string' => 'validation.gte.string',
        'array' => 'validation.gte.array',
    ],
    'image' => 'validation.image',
    'in' => 'validation.in',
    'in_array' => 'validation.in_array',
    'integer' => 'validation.integer',
    'ip' => 'validation.ip',
    'ipv4' => 'validation.ipv4',
    'ipv6' => 'validation.ipv6',
    'json' => 'validation.json',
    'lt' => [
        'numeric' => 'validation.lt.numeric',
        'file' => 'validation.lt.file',
        'string' => 'validation.lt.string',
        'array' => 'validation.lt.array',
    ],
    'lte' => [
        'numeric' => 'validation.lte.numeric',
        'file' => 'validation.lte.file',
        'string' => 'validation.lte.string',
        'array' => 'validation.lte.array',
    ],
    'max' => [
        'numeric' => 'validation.max.numeric',
        'file' => 'validation.max.file',
        'string' => 'validation.max.string',
        'array' => 'validation.max.array',
    ],
    'mimes' => 'validation.mimes',
    'mimetypes' => 'validation.mimetypes',
    'min' => [
        'numeric' => 'validation.min.numeric',
        'file' => 'validation.min.file',
        'string' => 'validation.min.string',
        'array' => 'validation.min.array',
    ],
    'multiple_of' => 'validation.multiple_of',
    'not_in' => 'validation.not_in',
    'not_regex' => 'validation.not_regex',
    'numeric' => 'validation.numeric',
    'password' => 'validation.password',
    'present' => 'validation.present',
    'regex' => 'validation.regex',
    'required' => 'validation.required',
    'required_if' => 'validation.required_if',
    'required_unless' => 'validation.required_unless',
    'required_with' => 'validation.required_with',
    'required_with_all' => 'validation.required_with_all',
    'required_without' => 'validation.required_without',
    'required_without_all' => 'validation.required_without_all',
    'same' => 'validation.same',
    'size' => [
        'numeric' => 'validation.size.numeric',
        'file' => 'validation.size.file',
        'string' => 'validation.size.string',
        'array' => 'validation.size.array',
    ],
    'starts_with' => 'validation.starts_with',
    'string' => 'validation.string',
    'timezone' => 'validation.timezone',
    'unique' => 'validation.unique',
    'uploaded' => 'validation.uploaded',
    'url' => 'validation.url',
    'uuid' => 'validation.uuid',


    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
