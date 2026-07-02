<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Blog;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Handle user login and issue a Sanctum token.
     */
    public function login(Request $request)
    {
        try {


            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            // Check user existence and password strength
            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials do not match our records.'],
                ]);
            }


            // Generate token with the user's role embedded in the abilities
            $token = $user->createToken('auth_token', [$user->role])->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ], 200);
        } catch (ValidationException $e) {
            // Re-throw validation exceptions so Laravel can return the 422 error response formatted correctly
            throw $e;
        } catch (\Exception $e) {
            // Handle any other unexpected database or system exceptions
            return response()->json([
                'message' => 'An error occurred during login.',
                'error' => $e->getMessage() // You can remove this line in production for security
            ], 500);
        }
    }

    /**
     * Get the authenticated user details.
     */
    public function me(Request $request)
    {
        try {
            return response()->json($request->user(), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unable to fetch user data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log the user out (Revoke token).
     */
    public function logout(Request $request)
    {
        try {
            // Revoke the token that was used to authenticate the current request
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Successfully logged out'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during logout.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function dashboard(Request $request)
    {
        try {

            // Dashboard Counts
            $totalStudents = User::where('role', 'student')->count();
            $totalBatches = Batch::count();
            $totalEvents = Event::count();

            // Total Income
            $totalIncome = User::where('role', 'student')
                ->sum('total_fee');

            // Last 6 Months Revenue
            $revenue = [];

            for ($i = 5; $i >= 0; $i--) {

                $month = Carbon::now()->subMonths($i);

                $amount = User::where('role', 'student')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->sum('total_fee');

                $revenue[] = [
                    'month' => $month->format('M'),
                    'amount' => (float) $amount,
                ];
            }

            // Recent Data
            $recentStudents = User::where('role', 'student')
                ->latest()
                ->take(5)
                ->get();

            $recentBatches = Batch::latest()
                ->take(5)
                ->get();

            $recentBlogs = Blog::latest()
                ->take(5)
                ->get();

            $recentEvents = Event::latest()
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Dashboard data fetched successfully.',

                'statistics' => [
                    'total_income' => (float) $totalIncome,
                    'total_students' => $totalStudents,
                    'total_batches' => $totalBatches,
                    'total_events' => $totalEvents,
                ],

                'revenue' => $revenue,

                'recent_students' => $recentStudents,
                'recent_batches' => $recentBatches,
                'recent_blogs' => $recentBlogs,
                'recent_events' => $recentEvents,
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
