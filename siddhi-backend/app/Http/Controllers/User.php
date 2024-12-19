<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserDetails; // Import the model

class User extends Controller
{
    public function index()
    {
        echo "hello ";
    }

    public function sayHello()
    {
        echo "Say Hello!";
    }

    public function uploadUserDetails(Request $request)
    {
        // Validate incoming request data
        
    }
}
