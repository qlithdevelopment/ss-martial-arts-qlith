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
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Handle user login and issue a Sanctum token.
     */
  public function login(Request $request)
{
    try {
        // 1. Input Validation
        $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ], [
            'email.required'    => 'Please enter your email or registration number.',
            'password.required' => 'Please enter your password.',
        ]);

        $loginInput = $request->email;

        // Determine if input is an email or reg_no
        $field = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'reg_no';

        $user = User::where($field, $loginInput)->first();

        // 2. Specific Error: Account Not Found
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['No account found with this email or registration number.'],
            ]);
        }

        // 3. Specific Error: Incorrect Password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Incorrect password. Please try again.'],
            ]);
        }

        // Issue Sanctum token
        $token = $user->createToken('auth_token', [$user->role])->plainTextToken;

        return response()->json([
            'success'      => true,
            'message'      => 'Login successful',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'reg_no' => $user->reg_no ?? null,
                'role'   => $user->role,
            ],
        ], 200);

    } catch (ValidationException $e) {
         return response()->json([
            'success' => false,
            'message' => 'An unexpected server error occurred.',
            'error'   => config('app.debug') ? $e->getMessage() : 'Internal Server Error',
        ], 500);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'An unexpected server error occurred.',
            'error'   => config('app.debug') ? $e->getMessage() : 'Internal Server Error',
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

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => ['required', 'string'],
                'new_password'     => ['required', 'string', 'confirmed', Password::defaults()],
            ]);

            $user = $request->user();

            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password you provided is incorrect.'],
                ]);
            }

            if (Hash::check($request->new_password, $user->password)) {
                throw ValidationException::withMessages([
                    'new_password' => ['The new password cannot be the same as your current password.'],
                ]);
            }

            $user->update([
                'password' => Hash::make($request->new_password),
            ]);

            $request->user()->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully.',
            ], 200);
        } catch (ValidationException $e) {
           return response()->json([
            'success' => false,
            'message' => 'An unexpected server error occurred.',
            'error'   => config('app.debug') ? $e->getMessage() : 'Internal Server Error',
        ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while resetting password.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
