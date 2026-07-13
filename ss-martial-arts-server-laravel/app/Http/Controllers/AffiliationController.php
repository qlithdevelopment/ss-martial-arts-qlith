<?php

namespace App\Http\Controllers;

use App\Models\Affiliation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class AffiliationController extends Controller
{
    public function index()
    {
        try {
            $affiliations = Affiliation::latest()->paginate(10);
            return response()->json([
                'success' => true,
                'data' => $affiliations
            ], 200);
        } catch (Exception $e) {
            Log::error('Failed to fetch affiliations: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while fetching data.'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('affiliations', 'public');
            }

            $affiliation = Affiliation::create($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Affiliation created successfully.',
                'data' => $affiliation
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            
            if (isset($validated['image'])) {
                Storage::disk('public')->delete($validated['image']);
            }

            Log::error('Failed to create affiliation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create affiliation.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $affiliation = Affiliation::findOrFail($id);
            $oldImage = $affiliation->image;

            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('affiliations', 'public');
            }

            $affiliation->update($validated);

            if ($request->hasFile('image') && $oldImage) {
                Storage::disk('public')->delete($oldImage);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Affiliation updated successfully.',
                'data' => $affiliation
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            if (isset($validated['image'])) {
                Storage::disk('public')->delete($validated['image']);
            }

            Log::error('Failed to update affiliation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update affiliation or record not found.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $affiliation = Affiliation::findOrFail($id);
            $imageToDelete = $affiliation->image;

            $affiliation->delete();

            if ($imageToDelete) {
                Storage::disk('public')->delete($imageToDelete);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Affiliation deleted successfully.'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete affiliation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete affiliation or record not found.'
            ], 500);
        }
    }
}