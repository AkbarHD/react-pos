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
            Schema::create('suppliers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('address');
                $table->string('phone');
                $table->string('description')->nullable();
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->foreignId('province_id')->constrained('provincies')->onDelete('cascade');
                $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');
                $table->foreignId('store_id')->nullable()->constrained('stores')->onDelete('set null');
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
