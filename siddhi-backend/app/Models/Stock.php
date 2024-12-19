<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    // The table associated with the model.
    protected $table = 'stocks';

    // The attributes that are mass assignable.
    protected $fillable = [
        'purchase_date',
        'supplier_company_name',
        'supplier_address',
        'frame_type',
        'model_name',
        'model_code',
        'model_color',
        'model_size',
        'quantity',
        'purchase_price',
        'sales_price',
        'extra_details',
    ];

    // Optionally, if you want to hide any attributes from being included in JSON representations of the model.
    // protected $hidden = ['purchase_price', 'sales_price'];

    // If you want to format the dates, you can use this.
    // protected $dates = ['purchase_date'];

    // If you're using timestamps but want to use different names for the created_at and updated_at columns.
    // const CREATED_AT = 'creation_date';
    // const UPDATED_AT = 'last_update';

    // If you want to automatically cast attributes to specific types, you can do it here.
    // protected $casts = [
    //     'purchase_date' => 'datetime',
    //     'purchase_price' => 'decimal:2',
    //     'sales_price' => 'decimal:2',
    //     'quantity' => 'integer',
    // ];

    // Add any relationships if necessary, e.g., for relationships with other models (e.g., Supplier).
}
