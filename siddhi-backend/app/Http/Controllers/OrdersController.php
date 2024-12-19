<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{

    public function newOrder(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            '0.orderDetails.userDetails.mobile' => 'required',
            '0.orderDetails.userDetails.firstname' => 'required',
            '0.orderDetails.order_information.orderDate' => 'required|date_format:d-m-Y',
            '0.orderDetails.order_information.estimateCompletionDate' => 'required|date_format:d-m-Y',
            '0.orderDetails.totalBill' => 'required|numeric',
            '0.orderDetails.paymentDetails.payamount' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Extract the first array from the request
        $data = $request->toArray()[0];

        // Directly use the eyeDescription array
        $eyeDescription = $data['eyeDescription'];

        // Extract userDetails as an array (no need to JSON encode)
        $userDetails = $data['orderDetails']['userDetails'];

        // Check if the customer already exists based on mobile number
        $user = Customer::firstOrCreate(
            ['mobile' => $userDetails['mobile']],
            [
                'firstname' => $userDetails['firstname'],
                'lastname' => $userDetails['lastname'],
                'age' => $userDetails['age'] ?? null,
                'gender' => $userDetails['gender'] ?? null,
                'address' => $userDetails['address'] ?? null,
            ]
        );

        // Prepare orderDetails for insertion into the orders table
        $orderDetails = $data['orderDetails'];
        unset($orderDetails['userDetails']);

        try {
            // Create the order
            $order = Order::createOrder($orderDetails, $eyeDescription, $user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create order.', 'details' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Order successfully created!', 'order_id' => $order->id], 201);
    }


    public function allorders()
    {
        // Fetch all orders with their associated customer details
        $orders = Order::with('customer') // Assuming you have defined a relationship in the Order model
            ->orderBy('created_at', 'desc')
            ->get();

        // Return the data as JSON response
        return response()->json([
            'message' => 'Orders retrieved successfully!',
            'orders' => $orders,
        ], 200);
    }

    public function fetchAllOrdersWithUserPhone()
    {
        // Fetch all orders with their associated customer details (userid and phone)
        $orders = Order::join('customers', 'orders.userid', '=', 'customers.mobile') // Join on mobile
            ->select(
                'orders.*',
                'customers.*',
                'orders.userid'
            )->get();

        // Return the data as JSON response
        return response()->json([
            'message' => 'Orders with User ID and Phone retrieved successfully!',
            'orders' => $orders,
        ], 200);
    }

    public function updateOrderStatus(Request $request, $orderId)
    {
        // Validate incoming request
        $validatedData = $request->validate([
            'status' => 'required|string|in:complete,cancelled',
        ]);

        // Find the order by ID
        $order = Order::findOrFail($orderId);

        // Update the order status
        $order->payment_status = $validatedData['status'];
        $order->save();

        // Return a response
        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully!',
            'data' => $order,
        ], 200);
    }

    public function fetchPendingOrders()
    {
        // Fetch orders where payment_status is 'pending' or completion_status is 0
        $pendingOrders = Order::join('customers', 'orders.userid', '=', 'customers.mobile') // Join orders and customers on mobile
            ->where('orders.payment_status', 'pending') // Check for pending payment status
            ->orWhere('orders.completion_status', 0) // Orders that are pending completion
            ->orderBy('orders.created_at', 'desc') // Order by latest first
            ->select(
                'orders.*', // Select all columns from orders
                'customers.firstname', // Select additional columns from customers (you can add more as needed)
                'customers.lastname',
                'customers.mobile',
                'customers.address'
            )
            ->get();

        // Return the data as JSON response
        return response()->json([
            'message' => 'Pending orders retrieved successfully!',
            'orders' => $pendingOrders,
        ], 200);
    }

    public function calculateTodayBill()
    {
        $currentDate = date('Y-m-d');
        $todayBill = Order::whereDate('created_at', $currentDate)
            ->selectRaw('SUM(paid_amount) as total_paid, SUM(remaining_payment) as total_remaining')
            ->first();

        return response()->json([
            'message' => 'Total bill for the current date retrieved successfully!',
            'today_collection' => $todayBill->total_paid,
            'pending_today' => $todayBill->total_remaining,
        ], 200);
    }

    public function calculateThisMonthCollection()
    {
        // Get the current month and year
        $currentMonth = now()->month; // Using Carbon for better date handling
        $currentYear = now()->year;

        try {
            // Calculate the total collection for the current month based on paid_amount
            $monthlyCollection = Order::whereYear('order_taken_date', $currentYear)
                ->whereMonth('order_taken_date', $currentMonth)
                ->sum('paid_amount');

            // Check if no orders found for the current month
            if ($monthlyCollection === 0) {
                return response()->json([
                    'message' => 'No collections found for the current month.',
                    'total_collection' => 0,
                ], 200);
            }

            // Return the response with the total collection
            return response()->json([
                'message' => 'Total collection for the current month retrieved successfully!',
                'total_collection' => $monthlyCollection,
            ], 200);

        } catch (\Exception $e) {
            // Log the error and return a response
            \Log::error('Error calculating monthly collection: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred while calculating the monthly collection.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function pendingPayment()
    {
        // Fetch orders where payment_status is 'pending'
        $pendingOrders = Order::join('customers', 'orders.userid', '=', 'customers.mobile') // Join orders and customers on mobile
            ->where('orders.payment_status', 'unpaid') // Check for pending payment status
            ->select(
                'orders.order_id',
                'customers.firstname',
                'customers.lastname',
                'customers.mobile',
                'customers.address',
                'orders.total_bill',
                'orders.paid_amount',
                'orders.remaining_payment',
                'orders.created_at',
                'orders.updated_at'
            )
            ->get();

        // Return the data as JSON response
        return response()->json([
            'message' => 'Pending payments retrieved successfully!',
            'pending_orders' => $pendingOrders,
        ], 200);
    }

    public function updateOrder(Request $request, $orderId)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'orderDetails.userDetails.mobile' => 'sometimes|required',
            'orderDetails.userDetails.firstname' => 'sometimes|required',
            'orderDetails.order_information.orderDate' => 'sometimes|required|date_format:Y-m-d',
            'orderDetails.order_information.estimateCompletionDate' => 'sometimes|required|date_format:Y-m-d',
            'orderDetails.totalBill' => 'sometimes|required|numeric',
            'orderDetails.paymentDetails.payamount' => 'sometimes|required|numeric',
            'orderDetails.paymentDetails.advancedAmount' => 'sometimes|required|numeric',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Retrieve the order by ID
        $order = Order::find($orderId);
    
        if (!$order) {
            return response()->json(['error' => 'Order not found.'], 404);
        }
    
        // Extract the updated data
        $data = $request->all();
    
        if (isset($data['orderDetails'])) {
            $orderDetails = $data['orderDetails'];
    
            // Update user details if provided
            if (isset($orderDetails['userDetails'])) {
                $userDetails = $orderDetails['userDetails'];
                $customer = Customer::where('mobile', $order->userid)->first();
    
                if ($customer) {
                    $customer->update([
                        'firstname' => $userDetails['firstname'] ?? $customer->firstname,
                        'lastname' => $userDetails['lastname'] ?? $customer->lastname,
                        'age' => $userDetails['age'] ?? $customer->age,
                        'gender' => $userDetails['gender'] ?? $customer->gender,
                        'address' => $userDetails['address'] ?? $customer->address,
                    ]);
                }
            }
    
            // Update order details if provided
            $order->update([
                'total_bill' => $orderDetails['totalBill'] ?? $order->total_bill,
                'paid_amount' => $orderDetails['paymentDetails']['advancedAmount'] ?? $order->paid_amount,
                'remaining_payment' => ($orderDetails['paymentDetails']['payamount'] ?? $order->remaining_payment) - ($orderDetails['paymentDetails']['advancedAmount'] ?? 0),
                'order_taken_date' => $orderDetails['order_information']['orderDate'] ?? $order->order_taken_date,
                'estimate_completion_date' => $orderDetails['order_information']['estimateCompletionDate'] ?? $order->estimate_completion_date,
                'payment_status' => $orderDetails['paymentDetails']['status'] ?? $order->payment_status,
                'completion_status' => $orderDetails['completion_status'] ?? $order->completion_status,
            ]);
    
            // Optionally update prescription or other specific fields
            if (isset($orderDetails['prescriptionDetails'])) {
                $order->update([
                    'medicine_prescription' => $orderDetails['prescriptionDetails']['medicine_prescription'] ?? $order->medicine_prescription,
                ]);
            }
        }
    
        return response()->json(['message' => 'Order updated successfully.', 'order' => $order], 200);
    }
    
    public function destroy($order_id)
    {   
        // Find the order by its order_id
        $order = Order::where('order_id', $order_id)->first();

        // If the order doesn't exist, return a 404 error
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        try {
            // Delete the order
            $order->delete();

            return response()->json(['message' => 'Order deleted successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete order', 'details' => $e->getMessage()], 500);
        }
    }



}
