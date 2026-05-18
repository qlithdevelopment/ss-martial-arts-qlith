<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 10);

            $paginator = User::where('role', 'student')
                ->latest()
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $paginator->items(),
                'total' => $paginator->total(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching the students list.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:6',
                'batch_id' => 'required|exists:batches,id',
                'total_fee' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            $student = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'batch_id' => $validated['batch_id'],
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
            // Grab the very first specific validation message that failed
            $actualErrorMessage = $e->validator->errors()->first();

            return response()->json([
                'success' => false,
                'message' => $actualErrorMessage,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while registering the student.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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

            // Merge the success key with the batch object fields
            return response()->json(array_merge(
                ['success' => true],
                $batch->toArray()
            ), 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching your batch data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving student profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
