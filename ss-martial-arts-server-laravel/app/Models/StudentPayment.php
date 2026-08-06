<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentPayment extends Model
{
    protected $fillable = [
        'student_id',
        'payment_amount',
        'payment_reason',
        'other_reason',        
        'status',        
    ];


    protected $casts = [
        'payment_amount' => 'decimal:2',
    ];


    /**
     * Student belongs to User table
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}