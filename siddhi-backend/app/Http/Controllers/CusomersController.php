<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class CusomersController extends Controller
{
    //
    public function dump_data_to_db(Request $request)
    {
        $dataArray = $request->all();

        if (isset($dataArray['firstname'])) {
            // Single entry
            Customer::create([
                'firstname' => $dataArray['firstname'],
                'lastname' => $dataArray['lastname'],
                'age' => $dataArray['age'] ?? null,
                'gender' => $dataArray['gender'] ?? null,
                'address' => $dataArray['address'] ?? null,
                'mobile' => $dataArray['mobile'],
            ]);
        } else {
            // Multiple entries
            foreach ($dataArray as $data) {
                Customer::create([
                    'firstname' => $data['firstname'],
                    'lastname' => $data['lastname'],
                    'age' => $data['age'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'address' => $data['address'] ?? null,
                    'mobile' => $data['mobile'],
                ]);
            }
        }

        return response()->json(['message' => 'User details uploaded successfully!'], 201);
    }



    public function allCustomer()
    {
        $customers = Customer::all(); // Fetch all customers
        return response()->json($customers); // Return customers as JSON
    }

    public function update_user(Request $request, $id)
    {
        $customer = Customer::findOrFail($id); // Find customer by ID
        $customer->update($request->all()); // Update customer details
        return response()->json(['message' => 'User details updated successfully!']);
    }


    public function delete_user($id)
    {
        $customer = Customer::findOrFail($id); // Find customer by ID
        $customer->delete(); // Delete the customer
        return response()->json(['message' => 'User deleted successfully!']);
    }

    public function get_user_by_id($id)
    {
        // Fetch a specific customer by their ID
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404); // Return error if not found
        }

        return response()->json($customer); // Return the customer details
    }
}
