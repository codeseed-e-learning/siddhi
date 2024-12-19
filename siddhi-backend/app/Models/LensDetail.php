<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LensDetail extends Model
{
    protected $fillable = [
        'lens_id',
        'sph',
        'cyl',
        'pair',
        'purchase_price',
        'sales_price',
    ];
}
