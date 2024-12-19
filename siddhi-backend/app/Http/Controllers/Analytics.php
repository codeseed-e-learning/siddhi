<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;

class Analytics extends Controller
{
    protected $orderModel;

    // Constructor with Dependency Injection
    public function __construct(Order $orderModel)
    {
        $this->orderModel = $orderModel; // Correctly assigning the model
    }

    public function dailyCollection()
    {
        // Calculate the total sum of 'total_bill' for today's orders
        $totalSum = $this->orderModel->whereDate('created_at', today())->sum('total_bill');

        return response()->json([
            'status' => 'success',
            'total_bill_sum' => $totalSum,
        ]);
    }

    public function monthlyCollection()
    {
        // Calculate the total sum of 'total_bill' for the current month
        $monthlySum = $this->orderModel->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_bill');

        return response()->json([
            'status' => 'success',
            'monthly_bill_sum' => $monthlySum,
        ]);
    }



}
