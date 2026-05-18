<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function addPayment(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'amount' => 'required|numeric|min:1',
                'payment_date' => 'required|date',
                'payment_method' => 'nullable|string|max:100',
                'notes' => 'nullable|string',
            ]);

            // Ensure the targeted user is actually a student
            $student = User::find($validated['user_id']);
            if ($student->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payments can only be added to users with the student role.'
                ], 420);
            }

            $payment = Payment::create($validated);

            return response()->json(array_merge(
                ['success' => true],
                $payment->toArray()
            ), 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while logging the payment.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function myFeeStatus(Request $request)
    {
        try {
            $student = $request->user();

            if ($student->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only student accounts contain ledger records.'
                ], 403);
            }

            $totalFee = (float) ($student->total_fee ?? 0);

            $totalPaid = (float) $student->payments()->sum('amount');

            $pendingAmount = $totalFee - $totalPaid;

            return response()->json([
                'success' => true,
                'fee_summary' => [
                    'student_name' => $student->name,
                    'total_fee' => $totalFee,
                    'total_paid' => $totalPaid,
                    'pending_amount' => max(0, $pendingAmount),
                ],
                'payment_history' => $student->payments()->latest()->get()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while tracking ledger balances.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
