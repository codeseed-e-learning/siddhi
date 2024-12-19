<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User;
use App\Http\Controllers\Test;
Route::get('/', function () {
    return view('welcome');
});
Route::get('/test' , [User::class , 'sayHello']);
Route::get('/ruchika' , [Test::class , 'testFunction']);