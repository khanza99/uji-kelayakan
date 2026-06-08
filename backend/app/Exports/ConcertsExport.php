<?php

namespace App\Exports;

use App\Models\Concert;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ConcertsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function query()
    {
        return Concert::with(['venue', 'category'])->latest();
    }

    public function headings(): array
    {
        return [
            'No',
            'Judul Konser',
            'Kategori',
            'Venue',
            'Kota',
            'Tanggal',
            'Jam Mulai',
            'Status',
        ];
    }

    public function map($concert): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $concert->title,
            $concert->category->name,
            $concert->venue->name,
            $concert->venue->city,
            \Carbon\Carbon::parse($concert->concert_date)->format('d/m/Y'),
            $concert->start_time,
            strtoupper($concert->status),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '1a1a2e']],
                'alignment' => ['horizontal' => 'center'],
            ],
        ];
    }
}