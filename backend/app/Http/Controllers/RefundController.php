<?php

namespace App\Http\Controllers;

use App\Models\Refund;
use App\Models\Ticket;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class RefundController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();

        $refunds = Refund::with(['ticket', 'order', 'requester', 'approver'])
            ->when($user->hasRole('user'), fn($q) => $q->where('requested_by', $user->id))
            ->latest()
            ->paginate(10);

        return response()->json($refunds);
    }

    // User ajukan refund
    public function store(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'reason' => 'required|string|min:10',
        ]);

        $ticket = Ticket::findOrFail($request->ticket_id);

        // Pastikan tiket milik user
        if ($ticket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Cek tiket masih active
        if ($ticket->status !== 'active') {
            return response()->json([
                'message' => 'Tiket tidak bisa direfund, status: ' . $ticket->status,
            ], 422);
        }

        // Cek belum pernah direfund
        if ($ticket->refund) {
            return response()->json([
                'message' => 'Tiket sudah pernah diajukan refund',
            ], 422);
        }

        $orderItem = $ticket->orderItem;
        $order     = Order::findOrFail($orderItem->order_id);

        $refund = Refund::create([
            'ticket_id' => $ticket->id,
            'order_id' => $order->id,
            'requested_by' => Auth::id(),
            'reason' => $request->reason,
            'refund_amount' => $orderItem->price,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Pengajuan refund berhasil, menunggu persetujuan',
            'refund' => $refund->load(['ticket', 'requester']),
        ], 201);
    }

    public function show(Refund $refund)
    {
        if (JWTAuth::user()->hasRole('user') && $refund->requested_by !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'refund' => $refund->load(['ticket', 'order', 'requester', 'approver']),
        ]);
    }

    // Staff/superadmin approve atau reject refund
    public function update(Request $request, Refund $refund)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        if ($refund->status !== 'pending') {
            return response()->json([
                'message' => 'Refund sudah diproses sebelumnya',
            ], 422);
        }

        DB::transaction(function () use ($request, $refund) {
            $refund->update([
                'status' => $request->status,
                'approved_by' => Auth::id(),
                'approved_at' => now(),
            ]);

            if ($request->status === 'approved') {
                // Update status tiket
                $refund->ticket->update(['status' => 'refunded']);

                // Kembalikan kursi ke available
                $seat = $refund->ticket->orderItem->seat;
                $seat->update(['status' => 'available']);

                // Kembalikan available_seats
                $refund->ticket->orderItem->seatTier->increment('available_seats');

                // Update status order jika semua tiket direfund
                $order = $refund->order;
                $allRefunded = $order->items->every(function ($item) {
                    return $item->ticket && $item->ticket->status === 'refunded';
                });

                if ($allRefunded) {
                    $order->update(['status' => 'refunded']);
                }
            }
        });

        return response()->json([
            'message' => 'Refund berhasil ' . ($request->status === 'approved' ? 'disetujui' : 'ditolak'),
            'refund' => $refund->load(['ticket', 'approver']),
        ]);
    }
}