<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Doctor's full name
            $table->string('qualification')->nullable(); // E.g., MBBS, MD (Ophthalmology)
            $table->string('phone', 15)->nullable(); // Contact number
            $table->string('email')->unique()->nullable(); // Email address
            $table->string('clinic_name')->nullable(); // Associated clinic name
            $table->string('clinic_address')->nullable(); // Clinic address
            $table->string('city')->nullable(); // City
            $table->string('state')->nullable(); // State
            $table->string('pincode', 10)->nullable(); // Pincode
            $table->text('notes')->nullable(); // Additional notes (e.g., availability, specialties)
            $table->timestamps(); // Created at and updated at timestamps
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
