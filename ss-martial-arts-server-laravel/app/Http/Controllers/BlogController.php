<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display all blogs latest first.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $search = $request->input('search');
            $category = $request->input('category');

            $isPublishedParam = $request->input('is_published');

            $query = Blog::query()->select([
                'id',
                'title',
                'category',
                'posted_date',
                'short_description',
                'featured_image',
                'is_published',
            ]);

            if ($isPublishedParam !== null) {
                $status = filter_var($isPublishedParam, FILTER_VALIDATE_BOOLEAN);
                $query->where('is_published', $status);
            } else {
                $query->where('is_published', true);
            }

            if (!empty($category)) {
                $query->where('category', $category);
            }

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('short_description', 'LIKE', "%{$search}%")
                        ->orWhere('content', 'LIKE', "%{$search}%");
                });
            }

            $blogs = $query
                ->latest()
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Blogs fetched successfully.',
                'data' => $blogs->items(),
                'pagination' => [
                    'current_page' => $blogs->currentPage(),
                    'last_page' => $blogs->lastPage(),
                    'per_page' => $blogs->perPage(),
                    'total' => $blogs->total(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch blogs.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Store a newly created blog in storage.
     */
    public function store(Request $request)
    {
        try {
            // Initialize Core validation rules with 1MB file size ceilings (1024 KB)
            $rules = [
                'title'             => 'required|string|max:255',
                'category'          => 'required|string|max:100',
                'posted_date'       => 'required|date',
                'short_description' => 'required|string',
                'featured_image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
                'content'           => 'required',
            ];

            // Scan request structure to attach dynamic validation constraints onto multi-block keys
            foreach ($request->allFiles() as $key => $file) {
                if (str_starts_with($key, 'block_image_')) {
                    $rules[$key] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024';
                }
            }

            $validator = Validator::make($request->all(), $rules, [
                'featured_image.max' => 'The main banner image must be less than 1MB.',
                'block_image_*.max'  => 'Every optional section content image must be less than 1MB.'
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            // Create clean distinct slug
            $slug = Str::slug($request->title);
            if (Blog::where('slug', $slug)->exists()) {
                $slug .= '-' . time();
            }

            // 1. Save Main Hero Image Banner
            $featuredImage = null;
            if ($request->hasFile('featured_image')) {
                $featuredImage = $request->file('featured_image')->store('blogs', 'public');
            } elseif ($request->filled('featured_image')) {
                $featuredImage = $request->featured_image;
            }

            // Safe convert content mapping
            $content = $request->content;
            if (is_string($content)) {
                $content = json_decode($content, true);
            }

            // 2. Loop save individual content section uploads 
            if (is_array($content)) {
                foreach ($content as $idx => $block) {
                    $fileKey = "block_image_" . $idx;
                    if ($request->hasFile($fileKey)) {
                        $storedPath = $request->file($fileKey)->store('blogs/sections', 'public');
                        $content[$idx]['image'] = asset('storage/' . $storedPath);
                    } else {
                        $content[$idx]['image'] = $block['image'] ?? "";
                    }
                }
            }

            $metaKeywords = $request->meta_keywords;
            if (is_string($metaKeywords)) {
                $metaKeywords = json_decode($metaKeywords, true);
            }

            $blog = Blog::create([
                'title'             => $request->title,
                'slug'              => $slug,
                'category'          => $request->category,
                'posted_date'       => $request->posted_date,
                'short_description' => $request->short_description,
                'featured_image'    => $featuredImage,
                'content'           => $content,
                'meta_title'        => $request->meta_title,
                'meta_description'  => $request->meta_description,
                'meta_keywords'     => $metaKeywords,
                'is_published'      => filter_var($request->is_published, FILTER_VALIDATE_BOOLEAN),
            ]);

            return response()->json(['success' => true, 'data' => $blog], 201);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show detailed article parameters.
     */
    public function show($id)
    {
        try {
            $blog = Blog::find($id);
            if (!$blog) return response()->json(['success' => false, 'message' => 'Blog not found.'], 404);
            return response()->json(['success' => true, 'data' => $blog], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified blog in storage and clean old files.
     */
    public function update(Request $request, $id)
    {
        try {
            $blog = Blog::find($id);
            if (!$blog) return response()->json(['success' => false, 'message' => 'Blog not found.'], 404);

            $rules = [
                'title'             => 'sometimes|string|max:255',
                'category'          => 'sometimes|string|max:100',
                'short_description' => 'sometimes|string',
                'featured_image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
            ];

            foreach ($request->allFiles() as $key => $file) {
                if (str_starts_with($key, 'block_image_')) {
                    $rules[$key] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024';
                }
            }

            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $data = $request->all();

            // 1. Swap & Delete previous local main image banner
            if ($request->hasFile('featured_image')) {
                $rawOriginal = $blog->getRawOriginal('featured_image');
                if ($rawOriginal && !filter_var($rawOriginal, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($rawOriginal)) {
                    Storage::disk('public')->delete($rawOriginal);
                }
                $data['featured_image'] = $request->file('featured_image')->store('blogs', 'public');
            }

            // 2. Clear old files during inner block multi-image uploads
            if ($request->has('content')) {
                $content = $request->content;
                if (is_string($content)) {
                    $content = json_decode($content, true);
                }

                $oldContent = $blog->content ?? [];

                if (is_array($content)) {
                    foreach ($content as $idx => $block) {
                        $fileKey = "block_image_" . $idx;

                        if ($request->hasFile($fileKey)) {
                            // Purge existing local disk image asset if present inside that index loop matching context
                            if (isset($oldContent[$idx]['image']) && !empty($oldContent[$idx]['image'])) {
                                $imageField = $oldContent[$idx]['image'];
                                if (str_contains($imageField, asset('storage/'))) {
                                    $parsedUrl = parse_url($imageField, PHP_URL_PATH);
                                    $oldRelativePath = str_replace('/storage/', '', $parsedUrl);

                                    if (Storage::disk('public')->exists($oldRelativePath)) {
                                        Storage::disk('public')->delete($oldRelativePath);
                                    }
                                }
                            }

                            $storedPath = $request->file($fileKey)->store('blogs/sections', 'public');
                            $content[$idx]['image'] = asset('storage/' . $storedPath);
                        } else {
                            $content[$idx]['image'] = $block['image'] ?? "";
                        }
                    }
                }
                $data['content'] = $content;
            }

            if ($request->has('meta_keywords')) {
                $data['meta_keywords'] = is_string($request->meta_keywords) ? json_decode($request->meta_keywords, true) : $request->meta_keywords;
            }
            if ($request->has('is_published')) {
                $data['is_published'] = filter_var($request->is_published, FILTER_VALIDATE_BOOLEAN);
            }

            $blog->update($data);
            return response()->json(['success' => true, 'data' => $blog->fresh()], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified blog and delete all its assets from storage.
     */
    public function destroy($id)
    {
        try {
            $blog = Blog::find($id);
            if (!$blog) return response()->json(['success' => false, 'message' => 'Blog not found.'], 404);

            // 1. Wipe local main banner file
            $rawFeatured = $blog->getRawOriginal('featured_image');
            if ($rawFeatured && !filter_var($rawFeatured, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($rawFeatured)) {
                Storage::disk('public')->delete($rawFeatured);
            }

            // 2. Clear out all nested local block images inside loop structures
            $content = $blog->content;
            if (is_array($content)) {
                foreach ($content as $block) {
                    if (!empty($block['image'])) {
                        $imageField = $block['image'];
                        if (str_contains($imageField, asset('storage/'))) {
                            $parsedUrl = parse_url($imageField, PHP_URL_PATH);
                            $relativePath = str_replace('/storage/', '', $parsedUrl);

                            if (Storage::disk('public')->exists($relativePath)) {
                                Storage::disk('public')->delete($relativePath);
                            }
                        }
                    }
                }
            }

            $blog->delete();
            return response()->json(['success' => true, 'message' => 'Blog and related images deleted completely from storage.'], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getRelatedBlogs(Request $request, $id)
    {
        try {
            $currentBlog = Blog::findOrFail($id);

            $limit = $request->get('limit', 4);

            $relatedBlogs = Blog::where('category', $currentBlog->category)
                ->where('id', '!=', $currentBlog->id)
                ->latest()
                ->take($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $relatedBlogs,
                'total_related' => $relatedBlogs->count()
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch related blogs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
