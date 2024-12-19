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
        //
        Schema::create('lenses', function (Blueprint $table) {
            $table->id();
            $table->string('lens_type'); // e.g., mineral, plastic, etc.
            $table->string('lens_company_name');
            $table->string('lens_product_name');
            $table->string('dia')->nullable(); // Diameter
            $table->decimal('purchase_price', 10, 2); // Purchase price
            $table->decimal('sales_price', 10, 2); // Sales price
            $table->string('sph'); // Sphere
            $table->string('cyl'); // Cylinder
            $table->string('pair'); // Pair
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('lenses');

    }
};
