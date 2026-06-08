<?php

namespace App\Http\Controllers;

use App\Models\Concert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ConcertController extends Controller
{
    // Ambil daftar konser dengan filter, sort, dan include.
    public function index()
    {
        $concerts = QueryBuilder::for(Concert::class)
            ->allowedFilters(
                AllowedFilter::exact('status'),
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('venue_id'),
                AllowedFilter::partial('title')
            )
            ->allowedSorts('concert_date', 'created_at', 'title')
            ->allowedIncludes('venue', 'category', 'seatTiers')
            ->paginate(10);

        return response()->json($concerts);
    }

    // Buat konser baru beserta poster opsional.
    public function store(Request $request)
    {
        // Validasi data konser.
        $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'category_id' => 'required|exists:concert_categories,id',
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'concert_date' => 'required|date|after:today',
            'start_time' => 'required|date_format:H:i',
            'poster_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'in:draft,published,ongoing,completed,cancelled',
        ]);

        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        // Simpan poster jika diunggah.
        $posterPath = null;
        if ($request->hasFile('poster_image')) {
            $posterPath = $request->file('poster_image')->store('posters', 'public');
        }

        // Buat konser di database.
        $concert = Concert::create([
            'venue_id' => $request->venue_id,
            'category_id' => $request->category_id,
            'created_by' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'concert_date' => $request->concert_date,
            'start_time' => $request->start_time,
            'poster_image' => $posterPath,
            'status' => $request->status ?? 'draft',
        ]);

        return response()->json([
            'message' => 'Konser berhasil dibuat',
            'concert' => $concert->load(['venue', 'category']),
        ], 201);
    }

    // Tampilkan detail lengkap konser.
    public function show(Concert $concert)
    {
        // Load relasi utama konser beserta kursi-kursinya.
        return response()->json([
            'concert' => $concert->load(['venue', 'category', 'seatTiers.seats', 'documents']),
        ]);
    }

    // Perbarui data konser.
    public function update(Request $request, Concert $concert)
    {
        // Validasi data update konser.
        $request->validate([
            'venue_id' => 'sometimes|exists:venues,id',
            'category_id' => 'sometimes|exists:concert_categories,id',
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'concert_date' => 'sometimes|date|after:today',
            'start_time' => 'sometimes|date_format:H:i',
            'poster_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'sometimes|in:draft,published,ongoing,completed,cancelled',
        ]);

        if ($request->hasFile('poster_image')) {
            // Hapus poster lama jika ada.
            if ($concert->poster_image) {
                Storage::disk('public')->delete($concert->poster_image);
            }
            // Simpan poster baru.
            $concert->poster_image = $request->file('poster_image')->store('posters', 'public');
        }

        // Update data konser.
        $concert->update($request->except('poster_image'));

        return response()->json([
            'message' => 'Konser berhasil diupdate',
            'concert' => $concert->load(['venue', 'category']),
        ]);
    }

    // Hapus konser dan file poster jika ada.
    public function destroy(Concert $concert)
    {
        // Hapus file poster di storage jika ada.
        if ($concert->poster_image) {
            Storage::disk('public')->delete($concert->poster_image);
        }

        $concert->delete();

        return response()->json([
            'message' => 'Konser berhasil dihapus',
        ]);
    }
}