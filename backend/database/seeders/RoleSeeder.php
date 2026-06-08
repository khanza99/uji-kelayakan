<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Buat roles
        Role::create(['name' => 'superadmin', 'guard_name' => 'api']);
        Role::create(['name' => 'staff', 'guard_name' => 'api']);
        Role::create(['name' => 'user', 'guard_name' => 'api']);
    }
}
