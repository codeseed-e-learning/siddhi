<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;
use Carbon\Carbon;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all stock records and return a view with the data
        $stocks = Stock::all();
        return $stocks->toArray();
        #return view('stocks.index', compact('stocks')); // You can create a view 'stocks.index' to list the stocks
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Return a view with a form for creating a new stock record
        return view('stocks.create'); // Create a view 'stocks.create' with a form to add stock
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $purchase_date = Carbon::parse($request->purchase_date); // Parse the date
        $purchase_date = $purchase_date->format('Y-m-d H:i:s'); // Format it to MySQL's format

        // Store the stock record without QR code
        $stock = Stock::create([
            'purchase_date' => $purchase_date,
            'supplier_company_name' => $request->supplier_company_name,
            'supplier_address' => $request->supplier_address,
            'frame_type' => $request->frame_type,
            'model_name' => $request->model_name,
            'model_code' => $request->model_code,
            'model_color' => $request->model_color,
            'model_size' => $request->model_size,
            'quantity' => $request->quantity,
            'purchase_price' => $request->purchase_price,
            'sales_price' => $request->sales_price,
            'extra_details' => $request->extra_details,
        ]);

        print_r($request->toArray());
        return response()->json([
            'message' => 'Stock added successfully!',
        ], 201); // 201 Created status code
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        // Return the details of a single stock record
        if ($stock) {
            return $stock;
        } else {
            return ["message" => "No Data Found", "status code" => 500];
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        // Return a view with a form for editing the stock record
        return view('stocks.edit', compact('stock')); // Create a view 'stocks.edit' with a form to edit stock
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        // Validate incoming data
        $request->validate([
            'purchase_date' => 'required|date',
            'supplier_company_name' => 'required|string',
            'supplier_address' => 'required|string',
            'frame_type' => 'required|string',
            'model_name' => 'required|string',
            'model_code' => 'required|string',
            'model_color' => 'required|string',
            'model_size' => 'required|string',
            'quantity' => 'required|integer',
            'purchase_price' => 'required|numeric',
            'sales_price' => 'required|numeric',
            'extra_details' => 'nullable|string',
        ]);

        // Update the stock record
        $stock->update([
            'purchase_date' => $request->purchase_date,
            'supplier_company_name' => $request->supplier_company_name,
            'supplier_address' => $request->supplier_address,
            'frame_type' => $request->frame_type,
            'model_name' => $request->model_name,
            'model_code' => $request->model_code,
            'model_color' => $request->model_color,
            'model_size' => $request->model_size,
            'quantity' => $request->quantity,
            'purchase_price' => $request->purchase_price,
            'sales_price' => $request->sales_price,
            'extra_details' => $request->extra_details,
        ]);
        return [
            'status' => 'success',
            'message' => 'Data has been successfully inserted!',
            'data' => [] // Optional: Add relevant data if needed
        ];

        // Redirect to index or show page with a success message
        // return redirect()->route('stocks.index')->with('success', 'Stock updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        // Delete the stock record
        $stock->delete();

        return [
            'status' => 'success',
            'message' => 'Data has been successfully inserted!',
            'data' => [] // Optional: Add relevant data if needed
        ];

        // Redirect to index with a success message
        // return redirect()->route('stocks.index')->with('success', 'Stock deleted successfully.');
    }
}
