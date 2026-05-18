<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'payment_date',
        'payment_method',
        'notes',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
