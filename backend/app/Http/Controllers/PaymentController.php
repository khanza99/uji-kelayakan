<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();

        $payments = Payment::with(['order.user', 'order.items.seat.seatTier'])
            ->when($user->hasRole('user'), fn($q) => $q->whereHas('order', fn($q) => $q->where('user_id', $user->id)))
            ->latest()
            ->paginate(10);

        return response()->json($payments);
    }

    public function show(Payment $payment)
    {
        if (JWTAuth::user()->hasRole('user') && $payment->order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'payment' => $payment->load(['order.user', 'order.items.seat.seatTier']),
        ]);
    }
}