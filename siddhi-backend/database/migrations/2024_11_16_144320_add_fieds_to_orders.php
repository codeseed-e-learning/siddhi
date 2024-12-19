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
        Schema::table('orders', function (Blueprint $table) {
            // Adding new fields to store the data received from the frontend
            $table->string('firstname')->after('order_id');
            $table->string('lastname')->after('firstname');
            $table->integer('age')->nullable()->after('lastname');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('age');
            $table->text('address')->nullable()->after('gender');
            $table->string('mobile')->nullable()->after('address');
            $table->string('type')->nullable()->after('mobile');
            $table->string('doctor_name')->nullable()->after('type');
            $table->string('hospital')->nullable()->after('doctor_name');
            $table->string('doctor_city')->nullable()->after('hospital');
            $table->string('shop_name')->nullable()->after('doctor_city');
            $table->string('optician_city')->nullable()->after('shop_name');
            $table->string('right_sph_sign')->nullable()->after('optician_city');
            $table->string('right_sph_whole')->nullable()->after('right_sph_sign');
            $table->string('right_sph_decimal')->nullable()->after('right_sph_whole');
            $table->string('right_cyl')->nullable()->after('right_sph_decimal');
            $table->string('right_axis')->nullable()->after('right_cyl');
            $table->string('right_va')->nullable()->after('right_axis');
            $table->string('left_sph_sign')->nullable()->after('right_va');
            $table->string('left_sph_whole')->nullable()->after('left_sph_sign');
            $table->string('left_sph_decimal')->nullable()->after('left_sph_whole');
            $table->string('left_cyl')->nullable()->after('left_sph_decimal');
            $table->string('left_axis')->nullable()->after('left_cyl');
            $table->string('left_va')->nullable()->after('left_axis');
            $table->string('order_details')->nullable()->after('left_va');
            $table->integer('total_bill')->nullable()->after('order_details');
            $table->enum('payment_status', ['advance', 'paid', 'unpaid'])->nullable()->after('total_bill');
            $table->string('medicine_prescription')->nullable()->after('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'firstname',
                'lastname',
                'age',
                'gender',
                'address',
                'mobile',
                'type',
                'doctor_name',
                'hospital',
                'doctor_city',
                'shop_name',
                'optician_city',
                'right_sph_sign',
                'right_sph_whole',
                'right_sph_decimal',
                'right_cyl',
                'right_axis',
                'right_va',
                'left_sph_sign',
                'left_sph_whole',
                'left_sph_decimal',
                'left_cyl',
                'left_axis',
                'left_va',
                'order_details',
                'total_bill',
                'payment_status',
                'medicine_prescription',
            ]);
        });
    }
};
