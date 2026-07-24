<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Belt extends Model
{
    protected $fillable = [
        'kyu_no',
        'belt_position',
        'certification_no',
        'date_of_issue',
        'user_id',
    ];

    protected $casts = [
        'date_of_issue' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
