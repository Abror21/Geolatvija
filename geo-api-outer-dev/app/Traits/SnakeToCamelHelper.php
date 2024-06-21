<?php

namespace App\Traits;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

trait SnakeToCamelHelper
{
    /**
     * @param array $list
     * @return array
     */
    function snakeToCamelArrayKeys($list = [], $exceptions = [])
    {
        foreach ($list as $key => $value)
        {
            $newKey = Str::camel($key);

            unset($list[$key]);

            if (is_array($value) && !in_array($key, $exceptions)) {
                $value = $this->snakeToCamelArrayKeys($value);
            }

            $list[$newKey] = $value;
        }

        return $list;
    }

    /**
     * @param array $list
     * @return array
     */
    function snakeToCamelArrayValues($list = [])
    {
        foreach ($list as $key => $value)
        {
            $newValue = Str::camel($value);

            unset($list[$key]);
            $list[] = $newValue;
        }

        return $list;
    }
}
