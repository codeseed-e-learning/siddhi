<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lens;
use Illuminate\Http\Request;

class LensController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all lenses with their details
        $lenses = Lens::with('details')->get();

        return response()->json([
            'success' => true,
            'data' => $lenses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validate the main lens data
    $validatedLens = $request->validate([
        'purchaseDate' => 'required|date',
        'companyName' => 'required|string',
        'address' => 'required|string',
        'lensType' => 'required|string',
        'lensCompanyName' => 'required|string',
        'lensProductName' => 'required|string',
        'dia' => 'nullable|string',
        'extraDetails' => 'nullable|string',
    ]);

    // Create the Lens
    $lens = Lens::create([
        'purchase_date' => $validatedLens['purchaseDate'],
        'company_name' => $validatedLens['companyName'],
        'address' => $validatedLens['address'],
        'lens_type' => $validatedLens['lensType'],
        'lens_company_name' => $validatedLens['lensCompanyName'],
        'lens_product_name' => $validatedLens['lensProductName'],
        'dia' => $validatedLens['dia'] ?? null,
        'extra_details' => $validatedLens['extraDetails'] ?? null,
    ]);

    // Validate and save the lens details
    $lensDetails = $request->validate([
        'lensDetails' => 'required|array',
        'lensDetails.*.sph' => 'required|string',
        'lensDetails.*.cyl' => 'required|string',
        'lensDetails.*.pair' => 'required|string',
        'lensDetails.*.purchasePrice' => 'required|numeric',
        'lensDetails.*.salesPrice' => 'required|numeric',
    ]);

    foreach ($lensDetails['lensDetails'] as $detail) {
        $lens->details()->create([
            'sph' => $detail['sph'],
            'cyl' => $detail['cyl'],
            'pair' => $detail['pair'],
            'purchase_price' => $detail['purchasePrice'],
            'sales_price' => $detail['salesPrice'],
        ]);
    }

    return response()->json([
        'success' => true,
        'message' => 'Lens and details created successfully.',
        'data' => $lens->load('details'),
    ], 201);
}


    /**
     * Display the specified resource.
     */
    public function show(Lens $lens)
    {
        // Load lens details when showing a specific lens
        $lens->load('details');

        return response()->json([
            'success' => true,
            'data' => $lens,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lens $lens)
    {
        // Validate request data
        $validated = $request->validate([
            'lens_type' => 'required|string',
            'lens_company_name' => 'required|string',
            'lens_product_name' => 'required|string',
            'dia' => 'nullable|string',
            'purchase_price' => 'required|numeric',
            'sales_price' => 'required|numeric',
            'sph' => 'required|string',
            'cyl' => 'required|string',
            'pair' => 'required|string',
        ]);

        // Update lens record
        $lens->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lens updated successfully.',
            'data' => $lens,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lens $lens)
    {
        $lens->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lens deleted successfully.',
        ]);
    }
}
