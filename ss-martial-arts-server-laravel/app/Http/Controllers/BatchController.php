<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BatchController extends Controller
{
 
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 10);

            $paginator = Batch::paginate($perPage);

            return response()->json([
                'data' => $paginator->items(),
                'total' => $paginator->total(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while fetching batches.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

  
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:batches,name|max:255',
                'date' => 'required|date',
                'enddate' => 'required|date|after_or_equal:date',
                'total_fee' => 'required|numeric|min:0',
                'status' => 'nullable|in:active,inactive',
                'notes' => 'nullable|string', 
            ]);

            $batch = Batch::create($validated);

            return response()->json($batch, 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create batch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * READ A SINGLE BATCH
     */
    public function show($id)
    {
        try {
            $batch = Batch::find($id);

            if (!$batch) {
                return response()->json(['message' => 'Batch not found.'], 404);
            }

            return response()->json($batch, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve batch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * UPDATE AN EXISTING BATCH
     */
    public function update(Request $request, $id)
    {
        try {
            $batch = Batch::find($id);

            if (!$batch) {
                return response()->json(['message' => 'Batch not found.'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:batches,name,' . $id,
                'date' => 'sometimes|required|date',
                'enddate' => 'sometimes|required|date|after_or_equal:date',
                'total_fee' => 'sometimes|required|numeric|min:0',
                'status' => 'sometimes|required|in:active,inactive',
                'notes' => 'nullable|string', // Validated during update
            ]);

            $batch->update($validated);

            return response()->json($batch, 200);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update batch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE A BATCH
     */
    public function destroy($id)
    {
        try {
            $batch = Batch::find($id);

            if (!$batch) {
                return response()->json(['message' => 'Batch not found.'], 404);
            }

            $batch->delete();

            return response()->json([
                'message' => 'Batch deleted successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete batch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
