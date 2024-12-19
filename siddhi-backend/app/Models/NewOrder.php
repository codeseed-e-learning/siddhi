<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewOrder extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'new_orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_taking_date',
        'order_expected_completion_date',
        'user_id',
        'doctor_id',
        'optician_id',
        'eye_description_left_id',
        'eye_description_right_id',
        'full_spec_id',
        'only_frame_id',
        'only_lens_id',
        'total_bill',
        'advanced_taken',
        'payment_status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'order_taking_date' => 'date',
        'order_expected_completion_date' => 'date',
        'total_bill' => 'decimal:2',
        'advanced_taken' => 'decimal:2',
        'payment_status' => 'string',
    ];

    /**
     * Relationships with other models.
     */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function optician()
    {
        return $this->belongsTo(Optician::class);
    }

    public function eyeDescriptionLeft()
    {
        return $this->belongsTo(EyeDescription::class, 'eye_description_left_id');
    }

    public function eyeDescriptionRight()
    {
        return $this->belongsTo(EyeDescription::class, 'eye_description_right_id');
    }

    public function fullSpec()
    {
        return $this->belongsTo(FullSpec::class);
    }

    public function frame()
    {
        return $this->belongsTo(Frame::class, 'only_frame_id');
    }

    public function lens()
    {
        return $this->belongsTo(Lens::class, 'only_lens_id');
    }
}
