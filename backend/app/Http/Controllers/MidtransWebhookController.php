<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MidtransWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        Log::info('Midtrans Webhook Received: ', $request->all());

        $serverKey = config('services.midtrans.server_key');
        $orderId = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $grossAmount = $request->input('gross_amount');
        $signatureKey = $request->input('signature_key');

        // Verify Signature
        $calculatedSignature = hash("sha512", $orderId . $statusCode . $grossAmount . $serverKey);
        
        if ($calculatedSignature !== $signatureKey) {
            Log::warning('Midtrans Webhook: Invalid Signature');
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Find Order by code
        $order = Order::with(['items.seat.seatTier', 'payment'])->where('order_code', $orderId)->first();

        if (!$order) {
            Log::error('Midtrans Webhook: Order Not Found: ' . $orderId);
            return response()->json(['message' => 'Order not found'], 404);
        }

        $transactionStatus = $request->input('transaction_status');
        $type = $request->input('payment_type');
        $fraudStatus = $request->input('fraud_status');

        DB::transaction(function () use ($order, $transactionStatus, $type, $fraudStatus, $request) {
            // Check status mapping
            if ($transactionStatus == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraudStatus == 'challenge') {
                        // Challenge status
                        $order->update(['status' => 'pending']);
                        $order->payment->update(['status' => 'pending']);
                    } else {
                        // Success
                        $this->markAsPaid($order, $request->input('transaction_id'));
                    }
                }
            } else if ($transactionStatus == 'settlement') {
                // Success
                $this->markAsPaid($order, $request->input('transaction_id'));
            } else if ($transactionStatus == 'pending') {
                $order->update(['status' => 'pending']);
                $order->payment->update(['status' => 'pending']);
            } else if (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                // Cancelled / Expired
                $order->update(['status' => 'cancelled']);
                $order->payment->update(['status' => 'failed']);

                // Release seats
                foreach ($order->items as $item) {
                    $item->seat->update(['status' => 'available']);
                    $item->seatTier->increment('available_seats');
                }
            }
        });

        return response()->json(['message' => 'Webhook handled successfully']);
    }

    private function markAsPaid($order, $transactionId)
    {
        if ($order->status === 'paid') {
            return;
        }

        $order->update(['status' => 'paid']);

        $order->payment->update([
            'status' => 'success',
            'gateway_transaction_id' => $transactionId,
            'paid_at' => now(),
        ]);

        // Generate tickets and update seat status to sold
        foreach ($order->items as $item) {
            $item->seat->update(['status' => 'sold']);

            $ticketCode = 'TIX-' . strtoupper(Str::random(10));
            $qrToken = hash_hmac('sha256', $ticketCode, config('app.key'));

            Ticket::create([
                'order_item_id' => $item->id,
                'user_id' => $order->user_id,
                'ticket_code' => $ticketCode,
                'qr_token' => $qrToken,
                'status' => 'active',
            ]);
        }
    }
}
