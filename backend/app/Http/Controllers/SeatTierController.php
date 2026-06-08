<?php

namespace App\Http\Controllers;

use App\Models\SeatTier;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeatTierController extends Controller
{
    // Ambil semua tier kursi untuk konser tertentu.
    public function index(Request $request)
    {
        $request->validate([
            'concert_id' => 'required|exists:concerts,id',
        ]);

        $tiers = SeatTier::where('concert_id', $request->concert_id)
            ->withCount('seats')
            ->get();

        return response()->json($tiers);
    }

    // Tambahkan tier kursi baru dan buat kursi otomatis.
    public function store(Request $request)
    {
        // Validasi data tier kursi.
        $request->validate([
            'concert_id' => 'required|exists:concerts,id',
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'total_seats' => 'required|integer|min:1',
        ]);

        $tier = DB::transaction(function () use ($request, &$tier) {
            // Simpan tier baru.
            $tier = SeatTier::create([
                'concert_id' => $request->concert_id,
                'name' => $request->name,
                'price' => $request->price,
                'total_seats' => $request->total_seats,
                'available_seats' => $request->total_seats,
            ]);

            // Auto generate seats untuk tier ini.
            for ($i = 1; $i <= $request->total_seats; $i++) {
                Seat::create([
                    'seat_tier_id' => $tier->id,
                    'seat_number' => str_pad($i, 3, '0', STR_PAD_LEFT),
                    'status' => 'available',
                ]);
            }

            return $tier;
        });

        return response()->json([
            'message' => 'Tier kursi berhasil dibuat',
            'tier' => $tier->load('seats'),
        ], 201);
    }

    // Tampilkan detail tier kursi.
    public function show(SeatTier $seatTier)
    {
        // Load daftar kursi untuk tier tersebut.
        return response()->json([
            'tier' => $seatTier->load('seats'),
        ]);
    }

    // Perbarui informasi tier kursi.
    public function update(Request $request, SeatTier $seatTier)
    {
        // Validasi perubahan tier.
        $request->validate([
            'name' => 'sometimes|string|max:100',
            'price' => 'sometimes|numeric|min:0',
        ]);

        // Update data tier.
        $seatTier->update($request->only('name', 'price'));

        return response()->json([
            'message' => 'Tier kursi berhasil diupdate',
            'tier' => $seatTier,
        ]);
    }

    // Hapus tier kursi jika belum ada transaksi terkait.
    public function destroy(SeatTier $seatTier)
    {
        if ($seatTier->orderItems()->count() > 0) {
            return response()->json([
                'message' => 'Tier tidak bisa dihapus karena sudah ada transaksi',
            ], 422);
        }

        $seatTier->delete();

        return response()->json([
            'message' => 'Tier kursi berhasil dihapus',
        ]);
    }
}
