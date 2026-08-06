<?php

namespace App\Http\Controllers;

use App\Models\StudentPayment;
use App\Models\User;
use Illuminate\Http\Request;

class StudentPaymentController extends Controller
{

    // Get all payments
    public function index()
    {
        try {

            $payments = StudentPayment::with('student')
                ->latest()
                ->get();


            return response()->json([
                'success' => true,
                'data' => $payments
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    // Store payment
    public function store(Request $request, $studentId)
    {
        try {

            // Check user is student
            $student = User::where('id', $studentId)
                ->where('role', 'student')
                ->first();


            if (!$student) {

                return response()->json([
                    'success' => false,
                    'message' => 'Selected user is not a student'
                ], 422);

            }


            $validated = $request->validate([

                'payment_amount' => [
                    'required',
                    'numeric',
                    'min:0'
                ],

                'payment_reason' => [
                    'required',
                    'in:monthly_payment,equipment,tournament,belt_test,other'
                ],

                'other_reason' => [
                    'nullable',
                    'string'
                ],

                'status' => [
                    'nullable',
                    'in:pending,complete'
                ],
            ]);


            $payment = StudentPayment::create([

                'student_id' => $studentId,

                'payment_amount' => $validated['payment_amount'],

                'payment_reason' => $validated['payment_reason'],

                'other_reason' => $validated['other_reason'] ?? null,

                'status' => $validated['status'] ?? 'pending',

            ]);


            return response()->json([
                'success' => true,
                'message' => 'Payment added successfully',
                'data' => $payment
            ], 201);


        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }



    // Get single payment
    public function show($id)
    {
        try {

            $payment = StudentPayment::with('student')
                ->findOrFail($id);


            return response()->json([
                'success' => true,
                'data' => $payment
            ]);


        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }



    // Update payment
    public function update(Request $request, $id)
    {
        try {

            $payment = StudentPayment::findOrFail($id);


            $validated = $request->validate([

                'payment_amount' => 'sometimes|numeric|min:0',

                'payment_reason' => 'sometimes|in:monthly_payment,equipment,tournament,belt_test,other',

                'other_reason' => 'nullable|string',

                'status' => 'sometimes|in:pending,complete'
            ]);


            $payment->update($validated);


            return response()->json([
                'success' => true,
                'message' => 'Payment updated successfully',
                'data' => $payment
            ]);


        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }




    // Delete payment
    public function destroy($id)
    {
        try {

            $payment = StudentPayment::findOrFail($id);

            $payment->delete();


            return response()->json([
                'success' => true,
                'message' => 'Payment deleted successfully'
            ]);


        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }



    // Get payment history of a student
    public function studentPayments($studentId)
    {
        try {

            $payments = StudentPayment::where('student_id', $studentId)
                ->latest()
                ->get();

            if (auth()->check() && auth()->user()->role === 'student') {
                $payments->makeHidden(['payment_amount']);
            }

            return response()->json([
                'success' => true,
                'data' => $payments
            ]);


        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

}