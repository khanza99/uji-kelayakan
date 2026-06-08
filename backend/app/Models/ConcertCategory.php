<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConcertCategory extends Model
{
    protected $fillable = [
        'name',
        'slug'
    ];

    public function concerts()
    {
        return $this->hasMany(Concert::class, 'category_id');
    }
}
