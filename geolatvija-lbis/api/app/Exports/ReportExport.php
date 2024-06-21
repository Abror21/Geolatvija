<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportExport implements FromArray, WithHeadings
{
    use Exportable;

    public function __construct(
        private $data,
        private $header
    )
    {
    }

    /**
     * @return array
     */
    public function array(): array
    {
        $parsed = [];

        foreach ($this->data as $entry)  {
            if (isset($entry['licence_type'])) {
                $entry['licence_type'] = match ($entry['licence_type']) {
                    'OPEN' => 'Atvērta',
                    'PREDEFINED' => 'Predifinēta',
                    default => 'Cits',
                };
                $parsed[] = $entry;
            }
        }

        return $parsed;
    }

    /**
     * @return string[]
     */
    public function headings(): array
    {
        return $this->header;
    }
}
