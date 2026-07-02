<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $perPage = $request->get('per_page', 10);
            $search = $request->get('search');

            $query = Faq::query();

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('question', 'LIKE', "%{$search}%")
                        ->orWhere('answer', 'LIKE', "%{$search}%");
                });
            }

            $faqs = $query
                ->orderBy('order', 'asc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'FAQs fetched successfully.',
                'data' => $faqs->items(),
                'pagination' => [
                    'current_page' => $faqs->currentPage(),
                    'last_page' => $faqs->lastPage(),
                    'per_page' => $faqs->perPage(),
                    'total' => $faqs->total(),
                ]
            ], 200);
        } catch (\Exception $e) {

            Log::error('Error fetching FAQs: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve FAQs.'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'question'  => 'required|string',
            'answer'    => 'required|string',
            'isPublish' => 'required|boolean',
            'order'     => 'required|integer',
        ]);

        try {
            $faq = Faq::create([
                'question'  => $request->question,
                'answer'    => $request->answer,
                'isPublish' => $request->isPublish,
                'order'     => $request->order,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'FAQ created successfully!',
                'data'    => $faq
            ], 201);
        } catch (Exception $e) {
            Log::error('Error storing FAQ: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while saving the FAQ.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $faq = Faq::findOrFail($id);
            return response()->json([
                'success' => true,
                'data'    => $faq
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found.'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $faq = Faq::findOrFail($id);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found to process updates.'
            ], 404);
        }

        $request->validate([
            'question'  => 'required|string',
            'answer'    => 'required|string',
            'isPublish' => 'required|boolean',
            'order'     => 'required|integer',
        ]);

        try {
            $faq->update([
                'question'  => $request->question,
                'answer'    => $request->answer,
                'isPublish' => $request->isPublish,
                'order'     => $request->order,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'FAQ updated successfully!',
                'data'    => $faq
            ], 200);
        } catch (Exception $e) {
            Log::error('Error updating FAQ: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong during data modification.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $faq = Faq::findOrFail($id);
            $faq->delete();

            return response()->json([
                'success' => true,
                'message' => 'FAQ permanently deleted.'
            ], 200);
        } catch (Exception $e) {
            Log::error('Error deleting FAQ: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove requested FAQ asset from server.'
            ], 500);
        }
    }
}
