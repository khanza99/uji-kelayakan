<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Venue;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        $venues = [
            ['name' => 'Gelora Bung Karno', 'address' => 'Jl. Pintu Satu Senayan', 'city' => 'Jakarta', 'capacity' => 80000],
            ['name' => 'Indonesia Arena', 'address' => 'Jl. Pintu Satu Senayan', 'city' => 'Jakarta', 'capacity' => 16000],
            ['name' => 'Istora Senayan', 'address' => 'Jl. Pintu VI Senayan', 'city' => 'Jakarta', 'capacity' => 8000],
            ['name' => 'Tennis Indoor Senayan', 'address' => 'Jl. Pintu IX Senayan', 'city' => 'Jakarta', 'capacity' => 3500],
            ['name' => 'Stadion Kanjuruhan', 'address' => 'Jl. Trunojoyo No.1', 'city' => 'Malang', 'capacity' => 45000],
            ['name' => 'Stadion Utama Gelora Bandung Lautan Api', 'address' => 'Jl. Soekarno Hatta', 'city' => 'Bandung', 'capacity' => 38000],
        ];

        foreach ($venues as $venue) {
            Venue::create($venue);
        }
    }
}
