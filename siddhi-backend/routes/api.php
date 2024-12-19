<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\User;
use App\Http\Controllers\CusomersController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\Api\LensController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Order routesCustomersPage
Route::get('/new-order', [OrdersController::class, 'newOrders']);
Route::post('/push-user-details', [CusomersController::class, 'dump_data_to_db']);
Route::post('/add-new-order', [OrdersController::class, 'newOrder']);
Route::get('/all-orders', [OrdersController::class, 'allorders']);
Route::get('/all-customer', [CusomersController::class, 'allCustomer']);

Route::get('/this-month' , [OrdersController::class , 'calculateThisMonthCollection']);

// Doctor routes
Route::get('/show-doctors', [DoctorController::class, 'show']); // Custom route to display all doctors

// RESTful routes for DoctorController
Route::prefix('doctors')->group(function () {
    Route::get('/', [DoctorController::class, 'index']); // Display a listing of doctors
    Route::get('/create', [DoctorController::class, 'create']); // Show form for creating a new doctor
    Route::post('/', [DoctorController::class, 'store']); // Store a new doctor
    Route::get('/{doctor}', [DoctorController::class, 'show']); // Display a specific doctor
    Route::get('/{doctor}/edit', [DoctorController::class, 'edit']); // Show form to edit a doctor
    Route::put('/{doctor}', [DoctorController::class, 'update']); // Update a specific doctor
    Route::delete('/{doctor}', [DoctorController::class, 'destroy']); // Delete a specific doctor
});
Route::prefix('stocks')->group(function () {
    Route::get('/', [StockController::class, 'index']); // Display a listing of all stock
    Route::get('/create', [StockController::class, 'create']); // Show form for creating new stock
    Route::post('/', [StockController::class, 'store']); // Store a new stock record
    Route::get('/{stock}', [StockController::class, 'show']); // Display a specific stock
    Route::get('/{stock}/edit', [StockController::class, 'edit']); // Show form to edit a stock
    Route::put('/{stock}', [StockController::class, 'update']); // Update a specific stock
    Route::delete('/{stock}', [StockController::class, 'destroy']); // Delete a specific stock
});
Route::prefix('customers')->group(function () {
    Route::post('/', [CusomersController::class, 'dump_data_to_db']);
    Route::get('/', [CusomersController::class, 'allCustomer']); // Fetch all customers
    Route::get('/{id}', [CusomersController::class, 'get_user_by_id']);
    Route::put('/{id}', [CusomersController::class, 'update_user']); // Update a specific customer
    Route::delete('/{id}', [CusomersController::class, 'delete_user']); // Delete a specific customer
});


Route::get('/orders/pending', [OrdersController::class, 'fetchPendingOrders']);
Route::get('/orders/allOrders', [OrdersController::class, 'fetchAllOrdersWithUserPhone']);

Route::prefix('bill')->group(function () {
    Route::get('/', [OrdersController::class, 'calculateTodayBill']);
});

Route::prefix('analytics')->group(function () {
    // Add routes for analytics here
    Route::get("/month" , [OrdersController::class , 'calculateThisMonthCollection']);
    Route::get("/pending-payment-uses" , [OrdersController::class , 'pendingPayment']);
});



Route::prefix('lenses')->group(function () {
    Route::get('/', [LensController::class, 'index']); // Display a listing of lenses
    Route::post('/', [LensController::class, 'store']); // Store a new lens
    Route::get('/{lens}', [LensController::class, 'show']); // Display a specific lens
    Route::put('/{lens}', [LensController::class, 'update']); // Update a specific lens
    Route::delete('/{lens}', [LensController::class, 'destroy']); // Delete a specific lens
});
// create same group for orders 
Route::prefix('orders')->group(function () {
    Route::get('/', [OrdersController::class, 'index']); // Display a listing of orders
    Route::post('/', [OrdersController::class, 'store']); // Store a new order
    Route::get('/{order}', [OrdersController::class, 'show']); // Display a specific order
    Route::put('/{order}', [OrdersController::class, 'updateOrder']); // Update a specific order
    Route::delete('/{order}', [OrdersController::class, 'destroy']); // Delete a specific order
});




