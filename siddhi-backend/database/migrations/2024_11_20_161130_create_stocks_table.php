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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->timestamp('purchase_date')->nullable(); // Purchase date (nullable if not always required)
            $table->string('supplier_company_name'); // Supplier company name
            $table->text('supplier_address'); // Supplier address (using text for longer addresses)
            $table->string('frame_type'); // Frame type (string)
            $table->string('model_name'); // Model name (string)
            $table->string('model_code'); // Model code (string)
            $table->string('model_color'); // Model color (string)
            $table->string('model_size'); // Model size (string)
            $table->integer('quantity'); // Quantity (integer)
            $table->decimal('purchase_price', 10, 2); // Purchase price (decimal with precision)
            $table->decimal('sales_price', 10, 2); // Sales price (decimal with precision)
            $table->text('extra_details')->nullable(); // Extra details (nullable)
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
