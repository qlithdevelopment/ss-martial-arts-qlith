<?php

namespace App\Http\Controllers;

use App\Models\Belt;
use Illuminate\Http\Request;

class BeltController extends Controller
{
    public function index()
    {
        try {
            $belts = Belt::with('user')->latest()->get();

            return response()->json([
                'success' => true,
                'message' => 'Belts fetched successfully.',
                'data' => $belts,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch belts.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'kyu_no' => 'required|string|max:100',
                'belt_position' => 'required|string|max:100',
                'certification_no' => 'required|string|unique:belts,certification_no',
                'date_of_issue' => 'required|date',
                'user_id' => 'required|exists:users,id',
            ]);

            $belt = Belt::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Belt created successfully.',
                'data' => $belt->load('user'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create belt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Belt $belt)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $belt->load('user'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch belt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request, Belt $belt)
    {
        try {
            $validated = $request->validate([
                'kyu_no' => 'required|string|max:100',
                'belt_position' => 'required|string|max:100',
                'certification_no' => 'required|string|unique:belts,certification_no,' . $belt->id,
                'date_of_issue' => 'required|date',
                'user_id' => 'required|exists:users,id',
            ]);

            $belt->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Belt updated successfully.',
                'data' => $belt->load('user'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update belt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Belt $belt)
    {
        try {
            $belt->delete();

            return response()->json([
                'success' => true,
                'message' => 'Belt deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete belt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getBeltsByUser(int $userId)
    {
        try {
            $belts = Belt::with('user')
                ->where('user_id', $userId)
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Belts fetched successfully.',
                'data' => $belts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch belts.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
