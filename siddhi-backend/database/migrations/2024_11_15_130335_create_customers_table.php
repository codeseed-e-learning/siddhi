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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('firstname', 100); // First name
            $table->string('lastname', 100); // Last name
            $table->integer('age')->unsigned(); // Age (positive only)
            $table->enum('gender', ['male', 'female', 'other']); // Gender options
            $table->text('address'); // Address
            $table->string('mobile', 15)->unique(); // Unique mobile number
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
