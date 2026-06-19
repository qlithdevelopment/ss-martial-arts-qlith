<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'posted_date',
        'short_description',
        'featured_image',
        'content',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'is_published',
        'views',
    ];

    protected $casts = [
        'posted_date'   => 'date:Y-m-d',
        'content'       => 'array',
        'meta_keywords' => 'array',
        'is_published'  => 'boolean',
        'views'         => 'integer',
        
        // Forces dates into clear explicit strings for React rendering pipelines
        'created_at'    => 'datetime:Y-m-d H:i:s',
        'updated_at'    => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * Converts the Model instance to an array/JSON response wrapper.
     * Intercepts serialization pipelines to append absolute asset URLs to the 
     * featured_image target key directly while leaving external paths untouched.
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        if (!empty($array['featured_image'])) {
            if (!filter_var($this->featured_image, FILTER_VALIDATE_URL)) {
                $array['featured_image'] = asset('storage/' . $this->featured_image);
            }
        }
        
        return $array;
    }
}