<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\FromArray;

class MetadatalinkExport implements FromArray
{
    protected $data;
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function array(): array
    {
        return $this->data;
    }
}
