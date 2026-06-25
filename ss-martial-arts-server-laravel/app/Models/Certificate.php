<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'certificated',
    ];

    protected $casts = [
        'certificated' => 'array', // Automatically serializes file array to JSON
    ];

    /**
     * Relationship: A certificate belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}