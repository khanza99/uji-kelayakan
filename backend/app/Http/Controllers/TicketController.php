<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;


class TicketController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();

        $tickets = Ticket::with([
                'orderItem.seat.seatTier.concert.venue',
                'orderItem.seatTier',
            ])
            ->when($user->hasRole('user'), fn($q) => $q->where('user_id', $user->id))
            ->latest()
            ->paginate(10);

        return response()->json($tickets);
    }

    public function show(Ticket $ticket)
    {
        // User hanya bisa lihat tiketnya sendiri
        if (JWTAuth::user()->hasRole('user') && $ticket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'ticket' => $ticket->load([
                'orderItem.seat.seatTier.concert.venue',
                'orderItem.seatTier',
                'user',
            ]),
        ]);
    }

    // Generate QR code image
    public function qr(Ticket $ticket)
    {
        if (JWTAuth::user()->hasRole('user') && $ticket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $qr = QrCode::format('svg')
            ->size(300)
            ->errorCorrection('H')
            ->generate($ticket->qr_token);

        return response($qr, 200, [
            'Content-Type' => 'image/svg+xml',
            'Content-Disposition' => 'inline; filename="qr-' . $ticket->ticket_code . '.svg"',
        ]);
    }

    // Download e-tiket PDF
    public function download(Ticket $ticket)
    {
        if (JWTAuth::user()->hasRole('user') && $ticket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $ticket->load([
            'orderItem.seat.seatTier.concert.venue',
            'orderItem.seatTier',
            'user',
        ]);

        // Generate QR sebagai base64 SVG untuk embed di PDF
        $qrSvg = QrCode::format('svg')
                ->size(200)
                ->errorCorrection('H')
                ->generate($ticket->qr_token);
        $qrImage = 'data:image/svg+xml;base64,' . base64_encode($qrSvg);

        $pdf = Pdf::loadView('pdf.ticket', [
            'ticket'  => $ticket,
            'qrImage' => $qrImage,
        ])->setPaper('a5', 'portrait');

        return $pdf->download('tiket-' . $ticket->ticket_code . '.pdf');
    }

    // Validasi QR saat scan (oleh staff)
    public function validate(Request $request)
    {
        $request->validate([
            'qr_token' => 'required|string',
        ]);

        $ticket = Ticket::where('qr_token', $request->qr_token)
            ->orWhere('ticket_code', $request->qr_token)
            ->with(['orderItem.seat.seatTier.concert', 'user'])
            ->first();

        if (!$ticket) {
            return response()->json([
                'valid' => false,
                'message' => 'Tiket tidak ditemukan / QR tidak valid',
            ], 200); // Menggunakan 200 agar tidak muncul error merah di console browser
        }

        if ($ticket->status === 'used') {
            return response()->json([
                'valid' => false,
                'message' => 'Tiket sudah digunakan',
                'scanned_at' => $ticket->scanned_at,
            ], 422);
        }

        if ($ticket->status !== 'active') {
            return response()->json([
                'valid' => false,
                'message' => 'Tiket tidak valid, status: ' . $ticket->status,
            ], 422);
        }

        // Tandai tiket sudah digunakan
        $ticket->update([
            'status' => 'used',
            'scanned_at' => now(),
            'scanned_by' => Auth::id(),
        ]);

        return response()->json([
            'valid' => true,
            'message' => 'Tiket valid, silakan masuk',
            'ticket' => $ticket,
        ]);
    }
}