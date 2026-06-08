<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'seat_id',
        'seat_tier_id',
        'price',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }

    public function seatTier()
    {
        return $this->belongsTo(SeatTier::class);
    }

    public function ticket()
    {
        return $this->hasOne(Ticket::class);
    }
}
