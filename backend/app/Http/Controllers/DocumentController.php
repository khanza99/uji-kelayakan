<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Concert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'concert_id' => 'required|exists:concerts,id',
        ]);

        $documents = Document::where('concert_id', $request->concert_id)
            ->with('uploader')
            ->latest()
            ->get();

        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'concert_id' => 'required|exists:concerts,id',
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,pdf,doc,docx|max:5120',
            'doc_type' => 'required|in:poster,flyer,contract,other',
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileType = $file->getClientOriginalExtension();
        $filePath = $file->store('documents', 'public');

        $document = Document::create([
            'concert_id' => $request->concert_id,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'doc_type' => $request->doc_type,
            'uploaded_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Dokumen berhasil diupload',
            'document' => $document->load('uploader'),
        ], 201);
    }

    public function show(Document $document)
    {
        return response()->json([
            'document' => $document->load(['uploader', 'concert']),
        ]);
    }

    public function destroy(Document $document)
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json([
            'message' => 'Dokumen berhasil dihapus',
        ]);
    }
}