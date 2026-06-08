<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@concert.com',
            'password' => Hash::make('password'),
            'phone' => '081234567890',
            'role' => 'superadmin',
        ]);
        $superadmin->assignRole('superadmin');

        $staff = User::create([
            'name' => 'Staff Operasional',
            'email' => 'staff@concert.com',
            'password' => Hash::make('password'),
            'phone' => '081234567891',
            'role' => 'staff',
        ]);
        $staff->assignRole('staff');

        $user = User::create([
            'name' => 'Pembeli',
            'email' => 'user@concert.com',
            'password' => Hash::make('password'),
            'phone' => '081234567892',
            'role' => 'user',
        ]);
        $user->assignRole('user');
    }
}
