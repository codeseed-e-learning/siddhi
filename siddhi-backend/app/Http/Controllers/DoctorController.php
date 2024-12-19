<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all doctors and return them as JSON
        $doctors = Doctor::all();
        return $doctors;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // In APIs, this might not be used, as forms are generally handled on the frontend
        return response()->json(['message' => 'Provide doctor details for creation'], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'phone' => 'required|string|unique:doctors,phone',
            'email' => 'nullable|email|unique:doctors,email',
            'clinic_name' => 'nullable|string|max:255',
            'clinic_address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
        ]);

        // Create a new doctor entry
        $doctor = Doctor::create($validatedData);

        return response()->json([
            'message' => 'Doctor created successfully!',
            'data' => $doctor,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        // Return a single doctor's details
        $doctors = Doctor::all();
        return $doctors;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        // In APIs, this might not be used, as forms are generally handled on the frontend
        return response()->json(['message' => 'Provide doctor details for editing'], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'phone' => 'nullable|string|unique:doctors,phone,' . $doctor->id,
            'email' => 'nullable|email|unique:doctors,email,' . $doctor->id,
            'clinic_name' => 'nullable|string|max:255',
            'clinic_address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
        ]);

        // Update the doctor's details
        $doctor->update($validatedData);

        return response()->json([
            'message' => 'Doctor updated successfully!',
            'data' => $doctor,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor)
    {
        // Delete the doctor
        $doctor->delete();

        return response()->json([
            'message' => 'Doctor deleted successfully!',
        ], 200);
    }
}
