<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Concert extends Model
{
    protected $fillable = [
        'venue_id',
        'category_id',
        'created_by',
        'title',
        'description',
        'poster_image',
        'concert_date',
        'start_time',
        'status',
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function category()
    {
        return $this->belongsTo(ConcertCategory::class, 'category_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function seatTiers()
    {
        return $this->hasMany(SeatTier::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
