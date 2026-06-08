<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Seat;
use App\Models\SeatTier;
use App\Models\Ticket;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();

        $orders = Order::with(['items.seat.seatTier', 'items.ticket', 'payment'])
            ->when($user->hasRole('user'), fn($q) => $q->where('user_id', $user->id))
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'seat_ids'       => 'required|array|min:1',
            'seat_ids.*'     => 'exists:seats,id',
            'payment_method' => 'required|string',
        ]);

        try {
            $order = DB::transaction(function () use ($request) {
                $seats = Seat::whereIn('id', $request->seat_ids)
                    ->lockForUpdate()
                    ->get();

                // Cek semua kursi masih available
                foreach ($seats as $seat) {
                    if ($seat->status !== 'available') {
                        throw new \Exception("Kursi {$seat->seat_number} sudah tidak tersedia");
                    }
                }

                $totalAmount = 0;
                $orderItems  = [];

                foreach ($seats as $seat) {
                    $tier         = SeatTier::findOrFail($seat->seat_tier_id);
                    $totalAmount += $tier->price;

                    $orderItems[] = [
                        'seat_id'      => $seat->id,
                        'seat_tier_id' => $tier->id,
                        'price'        => $tier->price,
                    ];

                    // Update status kursi jadi reserved
                    $seat->update(['status' => 'reserved']);

                    // Kurangi available_seats
                    $tier->decrement('available_seats');
                }

                // Buat order
                $order = Order::create([
                    'user_id'      => Auth::id(),
                    'order_code'   => 'ORD-' . strtoupper(Str::random(10)),
                    'total_amount' => $totalAmount,
                    'status'       => 'pending',
                    'expires_at'   => now()->addMinutes(60),
                ]);

                // Buat order items
                foreach ($orderItems as $item) {
                    $order->items()->create($item);
                }

                // Buat payment
                Payment::create([
                    'order_id'       => $order->id,
                    'payment_method' => $request->payment_method,
                    'amount'         => $totalAmount,
                    'status'         => 'pending',
                ]);

                return $order;
            });

            return response()->json([
                'message' => 'Order berhasil dibuat. Silakan upload bukti pembayaran dalam 60 menit.',
                'order'   => $order->load(['items.seat', 'payment']),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // Upload bukti pembayaran manual
    public function uploadPaymentProof(Request $request, Order $order)
    {
        // Pastikan order milik user yang login
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order tidak dalam status pending'], 422);
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'bank_name'     => 'required|string|max:100',
            'account_name'  => 'required|string|max:100',
        ]);

        $path = $request->file('payment_proof')->store('payment-proofs', 'public');

        $order->payment->update([
            'payment_proof' => $path,
            'bank_name'     => $request->bank_name,
            'account_name'  => $request->account_name,
            'status'        => 'reviewing', // menunggu konfirmasi admin
        ]);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil diupload. Menunggu konfirmasi admin.',
            'order'   => $order->load(['items.seat', 'payment']),
        ]);
    }

    // Tampilkan detail order
    public function show(Order $order)
    {
        if (JWTAuth::user()->hasRole('user') && $order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'order' => $order->load(['items.seat.seatTier', 'items.ticket', 'payment', 'user']),
        ]);
    }

    // Konfirmasi pembayaran oleh staff/superadmin
    public function confirmPayment(Request $request, Order $order)
    {
        $request->validate([
            'gateway_transaction_id' => 'nullable|string',
        ]);

        if (!in_array($order->status, ['pending'])) {
            return response()->json([
                'message' => 'Order tidak dalam status pending',
            ], 422);
        }

        DB::transaction(function () use ($order, $request) {
            // Update order
            $order->update(['status' => 'paid']);

            // Update payment
            $order->payment->update([
                'status'                 => 'success',
                'gateway_transaction_id' => $request->gateway_transaction_id,
                'paid_at'                => now(),
            ]);

            // Update status kursi ke sold & generate tiket
            foreach ($order->items as $item) {
                $item->seat->update(['status' => 'sold']);

                $ticketCode = 'TIX-' . strtoupper(Str::random(10));
                $qrToken    = hash_hmac('sha256', $ticketCode, config('app.key'));

                Ticket::create([
                    'order_item_id' => $item->id,
                    'user_id'       => $order->user_id,
                    'ticket_code'   => $ticketCode,
                    'qr_token'      => $qrToken,
                    'status'        => 'active',
                ]);
            }
        });

        return response()->json([
            'message' => 'Pembayaran dikonfirmasi, tiket berhasil digenerate',
            'order'   => $order->load(['items.ticket', 'payment']),
        ]);
    }

    // Cancel order
    public function cancel(Order $order)
    {
        if ($order->user_id !== Auth::id() && !JWTAuth::user()->hasRole('staff|superadmin')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (!in_array($order->status, ['pending'])) {
            return response()->json([
                'message' => 'Order tidak bisa dibatalkan',
            ], 422);
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $item->seat->update(['status' => 'available']);
                $item->seatTier->increment('available_seats');
            }

            $order->update(['status' => 'cancelled']);
            $order->payment->update(['status' => 'failed']);
        });

        return response()->json([
            'message' => 'Order berhasil dibatalkan',
        ]);
    }
}