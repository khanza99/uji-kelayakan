<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket;
use App\Models\Concert;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OrdersExport;
use App\Exports\TicketsExport;
use App\Exports\ConcertsExport;

class ExportController extends Controller
{
    // Export orders PDF
    public function ordersPdf(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:pending,paid,cancelled,expired,refunded',
        ]);

        $orders = Order::with(['user', 'items.seatTier.concert', 'payment'])
            ->when($request->start_date, fn($q) => $q->whereDate('created_at', '>=', $request->start_date))
            ->when($request->end_date, fn($q) => $q->whereDate('created_at', '<=', $request->end_date))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.report', [
            'title' => 'Laporan Penjualan',
            'orders' => $orders,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total' => $orders->where('status', 'paid')->sum('total_amount'),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('laporan-penjualan-' . now()->format('Ymd') . '.pdf');
    }

    // Export orders XLSX
    public function ordersExcel(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:pending,paid,cancelled,expired,refunded',
        ]);

        return Excel::download(
            new OrdersExport($request->start_date, $request->end_date, $request->status),
            'laporan-penjualan-' . now()->format('Ymd') . '.xlsx'
        );
    }

    // Export tickets XLSX
    public function ticketsExcel(Request $request)
    {
        $request->validate([
            'concert_id' => 'nullable|exists:concerts,id',
            'status' => 'nullable|in:active,used,cancelled,refunded',
        ]);

        return Excel::download(
            new TicketsExport($request->concert_id, $request->status),
            'laporan-tiket-' . now()->format('Ymd') . '.xlsx'
        );
    }

    // Export concerts XLSX
    public function concertsExcel()
    {
        return Excel::download(
            new ConcertsExport(),
            'laporan-konser-' . now()->format('Ymd') . '.xlsx'
        );
    }
}