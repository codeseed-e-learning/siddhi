<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'right_sph_D',
        'right_cyl_D',
        'right_axis',
        'right_sph_N',
        'right_cyl_N',
        'right_axis_N',
        'right_sph_add',
        'right_cyl_add',
        'right_axis_add',
        'left_sph_D',
        'left_cyl_D',
        'left_axis',
        'left_sph_N',
        'left_cyl_N',
        'left_axis_N',
        'left_sph_add',
        'left_cyl_add',
        'left_axis_add',
        'left_sph_cl',
        'left_cyl_cl',
        'left_axis_cl',
        'right_sph_cl',
        'right_cyl_cl',
        'right_axis_cl',
        'order_id',
        'doctor_name',
        'hospital',
        'doctor_city',
        'shop_name',
        'optician_city',
        'total_bill',
        'payment_status',
        'medicine_prescription',
        'userid',
        'order_taken_date',
        'estimate_completion_date',
        'completion_status',
        'paid_amount',
        'remaining_payment',
    ];


    /**
     * Relationship to Customer model.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'userid', 'mobile');
    }
    public static function calculateEyeDescription(array $eyeDescription)
    {
        // Calculate right eye near vision Sph_N if missing
        if (empty($eyeDescription['right_sph_N'])) {
            $eyeDescription['right_sph_N'] = $eyeDescription['right_sph_D'] + $eyeDescription['right_sph_add'];
        }

        // If Cyl_N is missing, assume it's the same as Cyl_D
        if (empty($eyeDescription['right_cyl_N'])) {
            $eyeDescription['right_cyl_N'] = $eyeDescription['right_cyl_D'];
        }

        // If Axis_N is missing, assume it's the same as Axis_D
        if (empty($eyeDescription['right_axis_N'])) {
            $eyeDescription['right_axis_N'] = $eyeDescription['right_axis'];
        }

        // Repeat the same logic for left eye
        if (empty($eyeDescription['left_sph_N'])) {
            $eyeDescription['left_sph_N'] = $eyeDescription['left_sph_D'] + $eyeDescription['left_sph_add'];
        }

        if (empty($eyeDescription['left_cyl_N'])) {
            $eyeDescription['left_cyl_N'] = $eyeDescription['left_cyl_D'];
        }

        if (empty($eyeDescription['left_axis_N'])) {
            $eyeDescription['left_axis_N'] = $eyeDescription['left_axis'];
        }

        return $eyeDescription;
    }


    /**
     * Static method to create an order.
     */
    public static function createOrder(array $orderDetails, $eyeDescription, $user)
    {
        $orderDate = \DateTime::createFromFormat('d-m-Y', $orderDetails['order_information']['orderDate'])->format('Y-m-d');
        $completionDate = \DateTime::createFromFormat('d-m-Y', $orderDetails['order_information']['estimateCompletionDate'])->format('Y-m-d');

        // Generate a random 6-digit number
        $randomNumber = rand(100000, 999999);

        // Get the last four digits of the phone number
        $lastFourDigits = substr($user->mobile, -4);

        // Combine them to create the unique ID
        $uniqueId = $randomNumber . $lastFourDigits;

        // Right Eye description
        $rightEye = $eyeDescription['rightEye'];

        // Left Eye description
        $leftEye = $eyeDescription['leftEye'];

        return self::create([
            'doctor_name' => $orderDetails['doctorDetails']['doctorName'] ?? null,
            'hospital' => $orderDetails['doctorDetails']['hospital'] ?? null,
            'doctor_city' => $orderDetails['doctorDetails']['doctorCity'] ?? null,
            'shop_name' => 'Your Shop Name',
            'optician_city' => 'Your City',
            'total_bill' => $orderDetails['totalBill'],
            'payment_status' => $orderDetails['payment_status'] ?? 'pending',
            'userid' => $user->mobile,
            'order_taken_date' => $orderDate,
            'estimate_completion_date' => $completionDate,
            'completion_status' => 'Pending',
            'paid_amount' => $orderDetails['paymentDetails']['advancedAmount'],
            'remaining_payment' => $orderDetails['paymentDetails']['payamount'] - $orderDetails['paymentDetails']['advancedAmount'],
            'order_id' => $uniqueId, // Assuming you have a 'unique_id' field in your database

            // Right Eye details
            'right_sph_D' => $rightEye['right_sph_D'] ?? null,
            'right_cyl_D' => $rightEye['right_cyl_D'] ?? null,
            'right_axis' => $rightEye['right_axis'] ?? null,
            'right_sph_N' => $rightEye['right_sph_N'] ?? null,
            'right_cyl_N' => $rightEye['right_cyl_N'] ?? null,
            'right_axis_N' => $rightEye['right_axis_N'] ?? null,
            'right_sph_add' => $rightEye['right_sph_add'] ?? null,
            'right_cyl_add' => $rightEye['right_cyl_add'] ?? null,
            'right_axis_add' => $rightEye['right_axis_add'] ?? null,

            // Left Eye details
            'left_sph_D' => $leftEye['left_sph_D'] ?? null,
            'left_cyl_D' => $leftEye['left_cyl_D'] ?? null,
            'left_axis' => $leftEye['left_axis'] ?? null,
            'left_sph_N' => $leftEye['left_sph_N'] ?? null,
            'left_cyl_N' => $leftEye['left_cyl_N'] ?? null,
            'left_axis_N' => $leftEye['left_axis_N'] ?? null,
            'left_sph_add' => $leftEye['left_sph_add'] ?? null,
            'left_cyl_add' => $leftEye['left_cyl_add'] ?? null,
            'left_axis_add' => $leftEye['left_axis_add'] ?? null,
            'left_sph_cl' => $leftEye['left_sph_cl'] ?? null,
            'left_cyl_cl' => $leftEye['left_cyl_cl'] ?? null,
            'left_axis_cl' => $leftEye['left_axis_cl'] ?? null,
        ]);
    }


}
