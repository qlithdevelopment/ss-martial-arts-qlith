<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trainer extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'designation',
        'biography',
        'motivation_line',
        'achievements',
        'expertise',
        'image_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'achievements' => 'array', // Automatically decodes JSON back to standard array
        'expertise' => 'array',    // Automatically decodes JSON back to standard array
    ];
}