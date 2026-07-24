<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
     protected $fillable = [
        'type',
        'title',
        'text',
        'name',
        'role',
        'image',
        'stars',
    ];

    protected $casts = [
        'stars' => 'integer',
    ];
}
