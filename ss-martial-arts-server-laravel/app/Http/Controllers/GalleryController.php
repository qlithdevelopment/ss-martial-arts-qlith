<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);

            $galleries = Gallery::latest()->paginate($perPage);

            $data = collect($galleries->items())->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'name' => $gallery->name,
                    'description' => $gallery->description,
                    'images' => is_array($gallery->images)
                        ? array_slice($gallery->images, 0, 3)
                        : [],
                    'created_at' => $gallery->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $data,
                'pagination' => [
                    'current_page' => $galleries->currentPage(),
                    'last_page' => $galleries->lastPage(),
                    'per_page' => $galleries->perPage(),
                    'total' => $galleries->total(),
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch galleries',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            $imagePaths = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {

                    $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

                    $path = $image->storeAs(
                        'gallery',
                        $filename,
                        'public'
                    );

                    $imagePaths[] = $path;
                }
            }

            $gallery = Gallery::create([
                'name' => $request->name,
                'description' => $request->description,
                'images' => $imagePaths,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gallery created successfully',
                'data' => $gallery,
            ], 201);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Gallery creation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {

            $gallery = Gallery::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $gallery,
            ]);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Gallery not found',
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $gallery = Gallery::findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'old_images' => 'nullable|array',
                'old_images.*' => 'string',
                'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            $finalImages = [];

            // Handle old images
            if ($request->has('old_images')) {

                $remainingOldImages = $request->old_images;

                foreach ($gallery->images ?? [] as $oldImage) {

                    if (!in_array($oldImage, $remainingOldImages)) {

                        if (Storage::disk('public')->exists($oldImage)) {
                            Storage::disk('public')->delete($oldImage);
                        }
                    }
                }

                $finalImages = $remainingOldImages;

            } else {

                $finalImages = $gallery->images ?? [];
            }

            // Handle new images
            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

                    $path = $image->storeAs(
                        'gallery',
                        $filename,
                        'public'
                    );

                    $finalImages[] = $path;
                }
            }

            $gallery->update([
                'name' => $request->name,
                'description' => $request->description,
                'images' => $finalImages,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gallery updated successfully',
                'data' => $gallery->fresh(),
            ]);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Gallery update failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {

            $gallery = Gallery::findOrFail($id);

            if (is_array($gallery->images)) {

                foreach ($gallery->images as $image) {

                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            $gallery->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gallery deleted successfully',
            ]);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Gallery deletion failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}