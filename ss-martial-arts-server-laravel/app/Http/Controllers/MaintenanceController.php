<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class MaintenanceController extends Controller
{
    /**
     * Get active maintenance alerts (due within 10 days or overdue, and pending).
     */
    public function checkAlert(): JsonResponse
    {
        $today = Carbon::today();
        $tenDaysLater = Carbon::today()->addDays(10);

        $activeAlerts = Maintenance::where('status', 'pending')
            ->whereDate('due_date', '<=', $tenDaysLater)
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function ($item) use ($today) {
                $dueDate = Carbon::parse($item->due_date);
                $diffInDays = $today->diffInDays($dueDate, false);

                return [
                    'id'            => $item->id,
                    'title'         => $item->title,
                    'amount'        => $item->amount,
                    'due_date'      => $item->due_date->format('Y-m-d'),
                    'status'        => $item->status,
                    'days_left'     => $diffInDays,
                    'is_overdue'    => $diffInDays < 0,
                ];
            });

        return response()->json([
            'success' => true,
            'count'   => $activeAlerts->count(),
            'data'    => $activeAlerts,
        ]);
    }

    /**
     * Get complete maintenance history (both paid and pending).
     */
    public function history(): JsonResponse
    {
        $history = Maintenance::orderBy('due_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $history,
        ]);
    }
}
