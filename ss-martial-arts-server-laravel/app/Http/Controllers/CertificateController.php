<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class CertificateController extends Controller
{
    /**
     * Display a listing of certificates for a specific user.
     * Accessible endpoint: /api/users/{userId}/certificates
     */
    public function index($userId)
    {
        try {
            $user = User::findOrFail($userId);
            $certificates = $user->certificates()->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $certificates
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or failed to fetch profiles.'
            ], 404);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'certificated' => 'required|array|min:1',
            'certificated.*' => 'required|file|mimes:pdf,jpg,jpeg,png|max:4096', // supports PDFs/images up to 4MB each
        ]);

        $uploadedPaths = [];

        try {
            if ($request->hasFile('certificated')) {
                foreach ($request->file('certificated') as $file) {
                    // Save files locally to storage/app/public/certificates
                    $localPath = $file->store('certificates', 'public');
                    $uploadedPaths[] = Storage::url($localPath);
                }
            }

            $certificate = Certificate::create([
                'user_id' => $request->user_id,
                'title' => $request->title,
                'certificated' => $uploadedPaths,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Certificates uploaded successfully!',
                'data' => $certificate
            ], 201);

        } catch (Exception $e) {
            // Clean up uploaded files if database creation fails midway
            foreach ($uploadedPaths as $urlPath) {
                $cleanPath = str_replace('/storage/', '', $urlPath);
                Storage::disk('public')->delete($cleanPath);
            }

            Log::error('Error storing certificates: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error occurred during execution.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified certificate entry.
     */
    public function show($id)
    {
        try {
            $certificate = Certificate::with('user')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $certificate
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate asset record not found.'
            ], 404);
        }
    }

    /**
     * Update specified entry (Replacing associated document vectors if structural modification passed).
     */
    public function update(Request $request, $id)
    {
        try {
            $certificate = Certificate::findOrFail($id);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Target record element not found.'
            ], 404);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'certificated' => 'nullable|array',
            'certificated.*' => 'required|file|mimes:pdf,jpg,jpeg,png|max:4096',
        ]);

        $newUploadedPaths = [];

        try {
            $dataToUpdate = $request->only(['user_id', 'title']);

            if ($request->hasFile('certificated')) {
                // Delete old local files entirely before linking new files
                foreach ($certificate->certificated as $oldUrl) {
                    $oldCleanPath = str_replace('/storage/', '', $oldUrl);
                    if (Storage::disk('public')->exists($oldCleanPath)) {
                        Storage::disk('public')->delete($oldCleanPath);
                    }
                }

                // Upload new batch files
                foreach ($request->file('certificated') as $file) {
                    $localPath = $file->store('certificates', 'public');
                    $newUploadedPaths[] = Storage::url($localPath);
                }
                $dataToUpdate['certificated'] = $newUploadedPaths;
            }

            $certificate->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Certificate updated successfully.',
                'data' => $certificate
            ], 200);

        } catch (Exception $e) {
            Log::error('Error updating certificates: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Modification routing collapsed internally.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage along with all file systems.
     */
    public function destroy($id)
    {
        try {
            $certificate = Certificate::findOrFail($id);

            // Clear physical dependencies
            foreach ($certificate->certificated as $fileUrl) {
                $cleanPath = str_replace('/storage/', '', $fileUrl);
                if (Storage::disk('public')->exists($cleanPath)) {
                    Storage::disk('public')->delete($cleanPath);
                }
            }

            $certificate->delete();

            return response()->json([
                'success' => true,
                'message' => 'Certificate record and local documents removed entirely.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Deletion breakdown experienced.'
            ], 500);
        }
    }
}