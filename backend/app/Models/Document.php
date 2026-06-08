<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'concert_id',
        'file_name',
        'file_path',
        'file_type',
        'doc_type',
        'uploaded_by',
    ];

    public function concert()
    {
        return $this->belongsTo(Concert::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
