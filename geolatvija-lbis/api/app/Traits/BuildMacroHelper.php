<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

class BuildMacroHelper
{

    function searchMacro($q, $settings, $filter)
    {
        foreach ($settings as $key => $setting) {

            if (isset($filter[$key]) && $filter[$key]) {
                $value = $filter[$key];

                //when ors are applied
                if (is_array($setting)) {

                    $q->where(function ($qInner) use ($setting, $value) {
                        foreach ($setting as $s) {
                             $this->handleConversions($qInner, $s, $value);
                        }

                        return $qInner;
                    });

                } else {
                    $this->handleConversions($q, $setting, $value);
                }
            }
        }

        return $q;
    }

    private function handleConversions($q, $setting, $value)
    {
        $type = explode(':', $setting)[0];
        $column = explode(':', $setting)[1];

        return $this->build($q, $type, $column, $value);
    }

    private function build($q, $type, $column, $value)
    {
        switch ($type) {
            case 'eq':
            {
                $q->where($column, '=', $value);
                break;
            }
            case 'orEq':
            {
                $q->orWhere($column, '=', $value);
                break;
            }
            case 'in':
            {
                $q->whereIn($column, $value);
                break;
            }
            case 'like':
            {
                $q->where($column, 'ILIKE', '%' . $value . '%');
                break;
            }
            case 'orLike':
            {
                $q->orWhere($column, 'ILIKE', '%' . $value . '%');
                break;
            }
        }

        return $q;
    }
}
