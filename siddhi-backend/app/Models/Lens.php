<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lens extends Model
{
    protected $fillable = [
        'purchase_date',
        'company_name',
        'address',
        'lens_type',
        'lens_company_name',
        'lens_product_name',
        'dia',
        'extra_details',
    ];

    public function details()
    {
        return $this->hasMany(LensDetail::class);
    }
}
