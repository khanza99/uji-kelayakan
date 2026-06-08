<?php

namespace App\Http\Controllers;

use App\Models\ConcertCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConcertCategoryController extends Controller
{
    // Ambil semua kategori konser.
    public function index()
    {
        $categories = ConcertCategory::withCount('concerts')->get();
        return response()->json($categories);
    }

    // Buat kategori konser baru.
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:concert_categories,name',
        ]);

        $category = ConcertCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Kategori berhasil dibuat',
            'category' => $category,
        ], 201);
    }

    // Tampilkan detail kategori konser.
    public function show(ConcertCategory $concertCategory)
    {
        // Load konser terkait untuk kategori.
        return response()->json([
            'category' => $concertCategory->load('concerts'),
        ]);
    }

    // Perbarui kategori konser.
    public function update(Request $request, ConcertCategory $concertCategory)
    {
        // Validasi update kategori.
        $request->validate([
            'name' => 'required|string|max:100|unique:concert_categories,name,' . $concertCategory->id,
        ]);

        $concertCategory->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Kategori berhasil diupdate',
            'category' => $concertCategory,
        ]);
    }

    // Hapus kategori jika belum ada konser terkait.
    public function destroy(ConcertCategory $concertCategory)
    {
        // Pastikan tidak ada konser pakai kategori ini.
        if ($concertCategory->concerts()->count() > 0) {
            return response()->json([
                'message' => 'Kategori tidak bisa dihapus karena masih memiliki konser',
            ], 422);
        }

        $concertCategory->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}