<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TestimonialController extends Controller
{
    private array $types = [
        'quote-box',
        'square-text',
        'bubble-down-avatars',
        'tall-card',
        'large-image',
        'bubble-down-small',
        'wide-top',
        'wide-middle',
        'wide-bottom',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $testimonials = Testimonial::latest()->get();

            return response()->json([
                'success' => true,
                'message' => 'Testimonials fetched successfully.',
                'count' => $testimonials->count(),
                'data' => $testimonials,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch testimonials.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => ['required', Rule::in($this->types)],
                'title' => 'nullable|string|max:255',
                'text' => 'required|string',
                'name' => 'nullable|string|max:255',
                'role' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:1024',
                'stars' => 'nullable|integer|min:1|max:5',
            ]);

            $testimonial = Testimonial::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial created successfully.',
                'data' => $testimonial,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create testimonial.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $testimonial,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch testimonial.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        try {
            $validated = $request->validate([
                'type' => ['required', Rule::in($this->types)],
                'title' => 'nullable|string|max:255',
                'text' => 'required|string',
                'name' => 'nullable|string|max:255',
                'role' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:1024',
                'stars' => 'nullable|integer|min:1|max:5',
            ]);

            if ($request->hasFile('image')) {

                // Delete old image
                if ($testimonial->image && Storage::disk('public')->exists($testimonial->image)) {
                    Storage::disk('public')->delete($testimonial->image);
                }

                $fileName = Str::uuid() . '.' . $request->file('image')->getClientOriginalExtension();

                $validated['image'] = $request->file('image')->storeAs(
                    'testimonials',
                    $fileName,
                    'public'
                );
            }

            $testimonial->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial updated successfully.',
                'data' => $testimonial,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update testimonial.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        try {

            if ($testimonial->image && Storage::disk('public')->exists($testimonial->image)) {
                Storage::disk('public')->delete($testimonial->image);
            }

            $testimonial->delete();

            return response()->json([
                'success' => true,
                'message' => 'Testimonial deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete testimonial.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
