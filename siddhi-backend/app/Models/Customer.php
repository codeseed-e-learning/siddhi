<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    // Specify which fields are mass assignable
    protected $fillable = [
        'firstname',
        'lastname',
        'age',
        'gender',
        'address',
        'mobile',
    ];
    public function orders()
    {
        return $this->hasMany(Order::class, 'userid', 'mobile');
    }

}

