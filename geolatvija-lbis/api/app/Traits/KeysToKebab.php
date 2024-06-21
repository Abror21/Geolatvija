<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait KeysToKebab {
    /**
     * Changes array keys to KebabCase
     *
     * @param array $list
     * @return array|mixed
     */
    public function keysToKebab($list = [])
    {
        foreach ($list as $key => $value) {
            $newKey = Str::kebab($key);

            unset($list[$key]);

            if (is_array($value)) {
                $value = $this->keysToCamel($value);
            }

            $list[$newKey] = $value;
        }

        return $list;
    }

    public function kebabToCamel($list = [])
    {
        foreach ($list as $key => $value) {
            $newKey = Str::camel($key);

            unset($list[$key]);

            if (is_array($value)) {
                $value = $this->kebabToCamel($value);
            }

            $list[$newKey] = $value;
        }

        return $list;
    }
}
