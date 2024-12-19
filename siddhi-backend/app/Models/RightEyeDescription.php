<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RightEyeDescription extends Model
{
    protected $table = 'right_eye_descriptions';

    protected $fillable = [
        'order_id',
        'user_id',
        'right_sph_sign',
        'right_sph_whole',
        'right_sph_decimal',
        'right_cyl',
        'right_axis',
        'right_va',
    ];

    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
}
