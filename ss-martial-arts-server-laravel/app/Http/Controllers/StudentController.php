<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Exception;

class StudentController extends Controller
{
    /**
     * Display a listing of students (Paginator list).
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('per_page', 10);
            if ($perPage < 1 || $perPage > 100) {
                $perPage = 10;
            }

            $search = $request->query('search');

            $query = User::leftJoin('batches', 'users.batch_id', '=', 'batches.id')
                ->where('users.role', 'student')
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.role',
                    'users.batch_id',
                    'users.belt',
                    'users.total_fee',
                    'users.status',
                    'users.created_at',
                    'batches.name as batch_name'
                );

            // Apply search filter if search parameter is present
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.name', 'LIKE', "%{$search}%")
                        ->orWhere('users.email', 'LIKE', "%{$search}%")
                        ->orWhere('users.belt', 'LIKE', "%{$search}%")
                        ->orWhere('batches.name', 'LIKE', "%{$search}%");
                });
            }

            $students = $query->latest('users.created_at')->paginate($perPage);

            return response()->json([
                'status' => true,
                'message' => 'Students fetched successfully.',
                'data' => $students->items(),
                'pagination' => [
                    'total' => $students->total(),
                    'current_page' => $students->currentPage(),
                    'last_page' => $students->lastPage(),
                    'per_page' => $students->perPage(),
                ],
            ], 200);
        } catch (\Exception $e) { // Added backslash to ensure global Exception class is caught
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching the students list.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly registered student.
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:6',
                'batch_id' => 'required|exists:batches,id',
                'belt' => 'nullable|string|max:50', // Completely optional field
                'total_fee' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            $student = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'batch_id' => $validated['batch_id'],
                'belt' => $validated['belt'] ?? '', // Saves empty string if omitted
                'total_fee' => $validated['total_fee'],
                'notes' => $validated['notes'] ?? null,
                'role' => 'student',
                'status' => true,
            ]);

            return response()->json(array_merge(
                ['success' => true],
                $student->toArray()
            ), 201);
        } catch (ValidationException $e) {
            $actualErrorMessage = $e->validator->errors()->first();

            return response()->json([
                'success' => false,
                'message' => $actualErrorMessage,
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while registering the student.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific current student's batch profile.
     */
    public function myBatch(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->batch_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not assigned to any batch.'
                ], 404);
            }

            $batch = Batch::find($user->batch_id);

            if (!$batch) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your assigned batch details could not be found.'
                ], 404);
            }

            return response()->json(array_merge(
                ['success' => true],
                $batch->toArray()
            ), 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching your batch data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a single student ledger profile record detail.
     */
    public function show($id)
    {
        try {
            $student = User::where('role', 'student')
                ->with('batch')
                ->find($id);

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student record not found.'
                ], 404);
            }

            $totalFee = (float) ($student->total_fee ?? 0);
            $totalPaid = (float) $student->payments()->sum('amount');
            $pendingAmount = $totalFee - $totalPaid;

            $payments = $student->payments()->latest()->get();

            $responseData = array_merge(
                ['success' => true],
                $student->toArray(),
                [
                    'ledger_summary' => [
                        'total_fee' => $totalFee,
                        'total_paid' => $totalPaid,
                        'pending_amount' => max(0, $pendingAmount),
                    ],
                    'payment_history' => $payments
                ]
            );

            return response()->json($responseData, 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving student profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update specified student row attributes directly (Edit).
     */
    public function update(Request $request, $id)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'nullable|string|min:6',
                'batch_id' => 'required|exists:batches,id',
                'belt' => 'nullable|string|max:50', // Optional field rule configurations
                'total_fee' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
                'status' => 'required|in:0,1'
            ]);

            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'batch_id' => $validated['batch_id'],
                'belt' => $validated['belt'] ?? '', // Keeps standard empty string default assignment
                'total_fee' => $validated['total_fee'],
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'],
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $student->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Student profile updated successfully.',
                'data' => $student
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first(),
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to apply modifications onto student record entries.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified student resource permanently (Delete).
     */
    public function destroy($id)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($id);
            $student->delete();

            return response()->json([
                'success' => true,
                'message' => 'Student account entry dropped from server memory successfully.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not delete student record. Element might not exist.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
