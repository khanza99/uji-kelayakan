<?php

namespace App\Http\Controllers;

use App\Models\Seat;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    // Ambil daftar kursi berdasarkan tier.
    public function index(Request $request)
    {
        // Validasi input concert tier.
        $request->validate([
            'seat_tier_id' => 'required|exists:seat_tiers,id',
        ]);

        // Ambil kursi untuk tier tersebut.
        $seats = Seat::where('seat_tier_id', $request->seat_tier_id)
            ->orderBy('seat_number')
            ->get();

        return response()->json($seats);
    }

    public function show(Seat $seat)
    {
        return response()->json([
            'seat' => $seat->load('seatTier'),
        ]);
    }

    public function update(Request $request, Seat $seat)
    {
        // Validasi status kursi.
        $request->validate([
            'status' => 'required|in:available,blocked',
        ]);

        // Update status kursi.
        $seat->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status kursi berhasil diupdate',
            'seat' => $seat,
        ]);
    }
}