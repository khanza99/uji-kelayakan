<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OrdersExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function __construct(
        protected ?string $startDate,
        protected ?string $endDate,
        protected ?string $status,
    ) {}

    public function query()
    {
        return Order::with(['user', 'payment'])
            ->when($this->startDate, fn($q) => $q->whereDate('created_at', '>=', $this->startDate))
            ->when($this->endDate, fn($q) => $q->whereDate('created_at', '<=', $this->endDate))
            ->when($this->status, fn($q) => $q->where('status', $this->status))
            ->latest();
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode Order',
            'Nama Pembeli',
            'Email',
            'Total',
            'Status Order',
            'Metode Bayar',
            'Status Bayar',
            'Tanggal Order',
        ];
    }

    public function map($order): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $order->order_code,
            $order->user->name,
            $order->user->email,
            'Rp ' . number_format($order->total_amount, 0, ',', '.'),
            strtoupper($order->status),
            $order->payment?->payment_method ?? '-',
            strtoupper($order->payment?->status ?? '-'),
            $order->created_at->format('d/m/Y H:i'),
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