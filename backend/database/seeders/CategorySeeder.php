<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConcertCategory;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Pop', 'Rock', 'Jazz', 'K-Pop', 'EDM', 'R&B', 'Metal', 'Indie'];

        foreach ($categories as $name) {
            ConcertCategory::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }
    }
}
