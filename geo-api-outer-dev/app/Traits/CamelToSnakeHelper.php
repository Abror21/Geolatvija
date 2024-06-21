<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait CamelToSnakeHelper
{
    /**
     * Transform array keys to snake case
     * @param array $list
     * @return array
     */
    function camelToSnakeArrayKeys($list = [])
    {
        foreach ($list as $key => $value)
        {
            $newKey = Str::snake($key);

            unset($list[$key]);
            $list[$newKey] = $value;
        }

        return $list;
    }

    function camelToSnakeArrayKeysDeep($list = [])
    {
        foreach ($list as $key => $value)
        {
            $newKey = Str::camel($key);

            unset($list[$key]);

            if (is_array($value)) {
                $value = $this->camelToSnakeArrayKeys($value);
            }

            $list[$newKey] = $value;
        }

        return $list;
    }

    /**
     * Transform array values to snake case
     * @param array $list
     * @return array
     */
    function camelToSnakeArrayValues($list = [])
    {
        foreach ($list as $key => $value)
        {
            $newValue = Str::snake($value);

            unset($list[$key]);
            $list[] = $newValue;
        }

        return $list;
    }
}
