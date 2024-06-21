<?php

namespace App\Traits;


use Illuminate\Support\Str;

trait ClassifierValueScope {


    public function buildClassifierValue($query, $column, $name = '', $prefix = '')
    {
        preg_match('~(.*?)_classifier_value_id~', $column, $output);

        if (!$prefix) {
            $prefix = Str::uuid();
        }


        if (!$name) {
            $explode = explode('.', $output[1]);

            $name = end($explode) . '_classifier';
        }

        return $query->leftJoin('classifier_values as ' . $prefix, $prefix . '.id', '=', $column)->addSelect($prefix . '.translation as ' . $name);
    }


}
