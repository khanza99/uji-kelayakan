<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    // Ambil daftar venue.
    public function index()
    {
        // Pagination daftar venue.
        $venues = Venue::paginate(10);
        return response()->json($venues);
    }

    // Buat venue baru.
    public function store(Request $request)
    {
        // Validasi data venue.
        $request->validate([
            'name' => 'required|string|max:150',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'capacity' => 'required|integer|min:1',
        ]);

        // Simpan venue baru.
        $venue = Venue::create($request->all());

        return response()->json([
            'message' => 'Venue berhasil dibuat',
            'venue' => $venue,
        ], 201);
    }

    // Tampilkan detail venue.
    public function show(Venue $venue)
    {
        // Load concert terkait venue.
        return response()->json([
            'venue' => $venue->load('concerts'),
        ]);
    }

    // Perbarui data venue.
    public function update(Request $request, Venue $venue)
    {
        // Validasi data update.
        $request->validate([
            'name' => 'sometimes|string|max:150',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:100',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        // Update venue.
        $venue->update($request->all());

        return response()->json([
            'message' => 'Venue berhasil diupdate',
            'venue' => $venue,
        ]);
    }

    // Hapus venue jika tidak memiliki konser terkait.
    public function destroy(Venue $venue)
    {
        // Pastikan tidak ada konser terkait.
        if ($venue->concerts()->count() > 0) {
            return response()->json([
                'message' => 'Venue tidak bisa dihapus karena masih memiliki konser',
            ], 422);
        }

        // Hapus venue dari database.
        $venue->delete();

        return response()->json([
            'message' => 'Venue berhasil dihapus',
        ]);
    }
}