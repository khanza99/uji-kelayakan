<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Hapus snap_token jika ada (dari integrasi Midtrans sebelumnya)
            if (Schema::hasColumn('payments', 'snap_token')) {
                $table->dropColumn('snap_token');
            }
            // Tambah kolom untuk bukti pembayaran manual
            $table->string('payment_proof')->nullable()->after('amount');
            $table->string('bank_name')->nullable()->after('payment_proof');
            $table->string('account_name')->nullable()->after('bank_name');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['payment_proof', 'bank_name', 'account_name']);
            $table->string('snap_token')->nullable()->after('amount');
        });
    }
};
