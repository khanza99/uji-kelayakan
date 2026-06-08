<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    protected $fillable = [
        'seat_tier_id',
        'row_label',
        'seat_number',
        'status',
    ];

    public function seatTier()
    {
        return $this->belongsTo(SeatTier::class);
    }

    public function orderItem()
    {
        return $this->hasOne(OrderItem::class);
    }
}
