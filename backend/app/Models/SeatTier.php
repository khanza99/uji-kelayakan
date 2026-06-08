<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeatTier extends Model
{
    protected $fillable = [
        'concert_id',
        'name',
        'price',
        'total_seats',
        'available_seats',
    ];

    public function concert()
    {
        return $this->belongsTo(Concert::class);
    }

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
