<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class TrainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $trainers = Trainer::latest()->get();
            return response()->json([
                'success' => true,
                'data' => $trainers
            ], 200);
        } catch (Exception $e) {
            Log::error('Error fetching trainers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve trainers profile list.'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Custom explicit error strings
        $messages = [
            'image.mimes' => 'The trainer image must be a file of type: png.',
            'image.max' => 'The trainer image size must not exceed 2MB.',
        ];

        $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'biography' => 'required|string',
            'motivation_line' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (str_word_count($value) > 10) {
                        $fail('The motivation line must not exceed 10 words.');
                    }
                },
            ],
            'achievements' => 'required|array|min:1',
            'achievements.*' => 'required|string',
            'expertise' => 'required|array|min:1',
            'expertise.*' => 'required|string',
            'image' => 'required|image|mimes:png|max:2048', // Mandatory on creation
        ], $messages);

        try {
            if ($request->hasFile('image')) {
                // Upload image locally into storage/app/public/trainers
                $imageLocalPath = $request->file('image')->store('trainers', 'public');
            } else {
                throw new Exception("Physical trainer image payload is missing.");
            }

            $trainer = Trainer::create([
                'name' => $request->name,
                'designation' => $request->designation,
                'biography' => $request->biography,
                'motivation_line' => $request->motivation_line,
                'achievements' => $request->achievements,
                'expertise' => $request->expertise,
                'image_path' => Storage::url($imageLocalPath), // Exposes file as an asset url
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Trainer profile generated successfully!',
                'data' => $trainer
            ], 201);

        } catch (Exception $e) {
            // Rollback uploaded image asset if database insertion crashes
            if (isset($imageLocalPath) && Storage::disk('public')->exists($imageLocalPath)) {
                Storage::disk('public')->delete($imageLocalPath);
            }

            Log::error('Error storing trainer context: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong inside the server.',
                'debug_error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $trainer = Trainer::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $trainer
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Trainer not found.'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $trainer = Trainer::findOrFail($id);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Trainer profile not found to process updates.'
            ], 404);
        }

        $messages = [
            'image.mimes' => 'The trainer image must be a file of type: png.',
            'image.max' => 'The trainer image size must not exceed 2MB.',
        ];

        $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'biography' => 'required|string',
            'motivation_line' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (str_word_count($value) > 10) {
                        $fail('The motivation line must not exceed 10 words.');
                    }
                },
            ],
            'achievements' => 'required|array|min:1',
            'achievements.*' => 'required|string',
            'expertise' => 'required|array|min:1',
            'expertise.*' => 'required|string',
            'image' => 'nullable|image|mimes:png|max:2048', // Nullable on update if keeping the old one
        ], $messages);

        try {
            $dataToUpdate = $request->only(['name', 'designation', 'biography', 'motivation_line', 'achievements', 'expertise']);

            // REMOVE OLD PICTURE IF NEW ONE IS PROVIDED
            if ($request->hasFile('image')) {
                // Convert "/storage/trainers/filename.png" -> "trainers/filename.png"
                $cleanOldPath = str_replace('/storage/', '', $trainer->image_path);
                
                if (Storage::disk('public')->exists($cleanOldPath)) {
                    Storage::disk('public')->delete($cleanOldPath); // Deletes old picture
                }

                // Upload the brand new image
                $newImageLocalPath = $request->file('image')->store('trainers', 'public');
                $dataToUpdate['image_path'] = Storage::url($newImageLocalPath);
            }

            $trainer->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Trainer profile updated and old file replaced successfully!',
                'data' => $trainer
            ], 200);

        } catch (Exception $e) {
            Log::error('Error updating trainer context: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong during data modification.',
                'debug_error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $trainer = Trainer::findOrFail($id);
            
            // REMOVE OLD PICTURE FROM LOCAL MEMORY
            $cleanDiskPath = str_replace('/storage/', '', $trainer->image_path);
            if (Storage::disk('public')->exists($cleanDiskPath)) {
                Storage::disk('public')->delete($cleanDiskPath);
            }

            // Remove database entry record
            $trainer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Trainer and associated image file permanently deleted.'
            ], 200);

        } catch (Exception $e) {
            Log::error('Error executing trainer drop routine: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove requested trainer profile asset from server.',
                'debug_error' => $e->getMessage()
            ], 500);
        }
    }
}