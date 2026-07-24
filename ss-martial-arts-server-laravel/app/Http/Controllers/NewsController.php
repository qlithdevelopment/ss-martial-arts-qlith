<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = News::query();

            if ($request->filled('search')) {
                $query->where('url', 'like', '%' . $request->search . '%');
            }

            $perPage = $request->get('per_page', 10);

            $news = $query
                ->orderBy('published_date', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'News fetched successfully.',
                'data' => $news->items(),
                'pagination' => [
                    'current_page' => $news->currentPage(),
                    'last_page' => $news->lastPage(),
                    'per_page' => $news->perPage(),
                    'total' => $news->total(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch news.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $news = News::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'News fetched successfully.',
                'data' => $news,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'News not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'url' => 'required|url|max:500',
                'published_date' => 'required|date',
            ]);

            $news = News::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'News created successfully.',
                'data' => $news,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create news.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request,int $id)
    {
        try {
            $news = News::findOrFail($id);

            $validated = $request->validate([
                'url' => 'required|url|max:500',
                'published_date' => 'required|date',
            ]);

            $news->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'News updated successfully.',
                'data' => $news,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update news.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $news = News::findOrFail($id);

            $news->delete();

            return response()->json([
                'success' => true,
                'message' => 'News deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete news.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
