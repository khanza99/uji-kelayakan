<?php

namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TicketsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function __construct(
        protected ?int $concertId,
        protected ?string $status,
    ) {}

    public function query()
    {
        return Ticket::with(['user', 'orderItem.seatTier.concert', 'orderItem.seat'])
            ->when($this->concertId, fn($q) => $q->whereHas(
                'orderItem.seatTier', fn($q) => $q->where('concert_id', $this->concertId)
            ))
            ->when($this->status, fn($q) => $q->where('status', $this->status))
            ->latest();
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode Tiket',
            'Nama Pemegang',
            'Email',
            'Konser',
            'Tier Kursi',
            'Nomor Kursi',
            'Harga',
            'Status',
            'Scan',
        ];
    }

    public function map($ticket): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $ticket->ticket_code,
            $ticket->user->name,
            $ticket->user->email,
            $ticket->orderItem->seatTier->concert->title,
            $ticket->orderItem->seatTier->name,
            $ticket->orderItem->seat->seat_number ?? 'Festival',
            'Rp ' . number_format($ticket->orderItem->price, 0, ',', '.'),
            strtoupper($ticket->status),
            $ticket->scanned_at ? $ticket->scanned_at->format('d/m/Y H:i') : '-',
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