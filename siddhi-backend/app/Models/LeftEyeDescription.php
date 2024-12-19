<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeftEyeDescription extends Model
{
    protected $table = 'left_eye_descriptions';

    protected $fillable = [
        'order_id',
        'user_id',
        'left_sph_sign',
        'left_sph_whole',
        'left_sph_decimal',
        'left_cyl',
        'left_axis',
        'left_va',
    ];

    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
}
