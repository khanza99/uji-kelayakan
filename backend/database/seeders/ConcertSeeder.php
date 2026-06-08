<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Concert;
use App\Models\Venue;
use App\Models\ConcertCategory;
use App\Models\User;
use App\Models\SeatTier;
use App\Models\Seat;

class ConcertSeeder extends Seeder
{
    public function run(): void
    {
        // Get the superadmin user to be the creator
        $admin = User::role('superadmin')->first() ?? User::first();
        
        // Get some venues and categories
        $venue1 = Venue::firstOrCreate(['name' => 'Gelora Bung Karno']);
        $venue2 = Venue::firstOrCreate(['name' => 'Indonesia Arena']);
        
        $catPop = ConcertCategory::firstOrCreate(['name' => 'Pop']);
        $catRock = ConcertCategory::firstOrCreate(['name' => 'Rock']);

        // 1. Create a massive stadium concert
        $concert1 = Concert::create([
            'venue_id' => $venue1->id,
            'category_id' => $catPop->id,
            'created_by' => $admin->id,
            'title' => 'Coldplay: Music of the Spheres',
            'description' => "Coldplay's spectacular Music of the Spheres World Tour arrives in Jakarta! Experience a night of incredible music, stunning visuals, and magical moments.",
            'concert_date' => now()->addDays(30)->toDateString(),
            'start_time' => '19:30:00',
            'status' => 'published',
        ]);

        // Create Seat Tiers for Concert 1
        $c1_cat1 = SeatTier::create(['concert_id' => $concert1->id, 'name' => 'CAT 1', 'price' => 5000000, 'total_seats' => 20, 'available_seats' => 20]);
        $c1_fest = SeatTier::create(['concert_id' => $concert1->id, 'name' => 'Festival (Standing)', 'price' => 3500000, 'total_seats' => 50, 'available_seats' => 50]);
        $c1_cat2 = SeatTier::create(['concert_id' => $concert1->id, 'name' => 'CAT 2', 'price' => 2500000, 'total_seats' => 30, 'available_seats' => 30]);

        $this->generateSeats($c1_cat1, 'A');
        $this->generateSeats($c1_fest, 'FEST');
        $this->generateSeats($c1_cat2, 'B');

        // 2. Create an indoor arena concert
        $concert2 = Concert::create([
            'venue_id' => $venue2->id,
            'category_id' => $catRock->id,
            'created_by' => $admin->id,
            'title' => 'Bring Me The Horizon: Live in Jakarta',
            'description' => "Get ready for an explosive night with BMTH at Indonesia Arena. Expect heavy riffs and legendary energy.",
            'concert_date' => now()->addDays(15)->toDateString(),
            'start_time' => '20:00:00',
            'status' => 'published',
        ]);

        // Create Seat Tiers for Concert 2
        $c2_vip = SeatTier::create(['concert_id' => $concert2->id, 'name' => 'VIP', 'price' => 3000000, 'total_seats' => 10, 'available_seats' => 10]);
        $c2_trib = SeatTier::create(['concert_id' => $concert2->id, 'name' => 'Tribune', 'price' => 1500000, 'total_seats' => 40, 'available_seats' => 40]);

        $this->generateSeats($c2_vip, 'VIP');
        $this->generateSeats($c2_trib, 'TRB');

        // 3. Create a draft concert (Not published yet)
        Concert::create([
            'venue_id' => $venue1->id,
            'category_id' => $catPop->id,
            'created_by' => $admin->id,
            'title' => 'Taylor Swift: The Eras Tour (Rumored)',
            'description' => "Details to be announced.",
            'concert_date' => now()->addDays(120)->toDateString(),
            'start_time' => '19:00:00',
            'status' => 'draft',
        ]);
    }

    private function generateSeats(SeatTier $tier, $prefix)
    {
        $seats = [];
        for ($i = 1; $i <= $tier->total_seats; $i++) {
            $seats[] = [
                'seat_tier_id' => $tier->id,
                'seat_number' => $prefix . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        Seat::insert($seats);
    }
}
