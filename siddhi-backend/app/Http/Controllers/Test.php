<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Test extends Controller
{
    //
    public function testFunction()
    {
        $data = ["name" => "amit"];
        return view('test' , ["data" => $data]);
    }
}
