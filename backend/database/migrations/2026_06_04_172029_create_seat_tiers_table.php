<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seat_tiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('concert_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->decimal('price', 12, 2);
            $table->integer('total_seats');
            $table->integer('available_seats');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seat_tiers');
    }
};
