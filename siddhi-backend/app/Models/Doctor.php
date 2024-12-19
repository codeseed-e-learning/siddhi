<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    //
    protected $fillable = [
        'name',
        'qualification',
        'phone',
        'email',
        'clinic_name',
        'clinic_address',
        'city',
        'state',
        'pincode',
        'notes',
    ];
}
