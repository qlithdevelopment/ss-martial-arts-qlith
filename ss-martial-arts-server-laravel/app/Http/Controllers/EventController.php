<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index(Request $request)
    {
        try {

            $today = Carbon::today();
            $search = $request->search;
            $perPage = $request->per_page ?? 10;

            $events = Event::select('*')
                ->selectRaw("
                CASE
                    WHEN date = ? THEN 1
                    WHEN date > ? THEN 2
                    ELSE 3
                END AS sort_order
            ", [$today, $today]);

            // Search
            if (!empty($search)) {
                $events->where(function ($query) use ($search) {
                    $query->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('description', 'LIKE', "%{$search}%");
                });
            }

            $events = $events
                ->orderBy('sort_order')

                ->orderByRaw("
                CASE
                    WHEN date > ? THEN date
                END ASC
            ", [$today])

                ->orderByRaw("
                CASE
                    WHEN date < ? THEN date
                END DESC
            ", [$today])

                ->paginate($perPage);

            $events->getCollection()->transform(function ($event) use ($today) {

                $eventDate = Carbon::parse($event->date);

                if ($eventDate->isSameDay($today)) {
                    $event->timing = 'today';
                } elseif ($eventDate->isAfter($today)) {
                    $event->timing = 'upcoming';
                } else {
                    $event->timing = 'past';
                }

                unset($event->sort_order);

                return $event;
            });

            return response()->json([
                'success' => true,
                'data' => $events->items(),
                'pagination' => [
                    'current_page' => $events->currentPage(),
                    'last_page' => $events->lastPage(),
                    'per_page' => $events->perPage(),
                    'total' => $events->total(),
                ],
            ]);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch events',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'date' => 'required|date',
                'location' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            $imagePath = null;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('events', 'public');
            }

            $event = Event::create([
                'name' => $request->name,
                'description' => $request->description,
                'date' => $request->date,
                'image' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => $event,
            ], 201);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Event creation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {

            $event = Event::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $event,
            ]);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Event not found',
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $event = Event::findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'date' => 'required|date',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if ($request->hasFile('image')) {

                if (
                    $event->image &&
                    Storage::disk('public')->exists($event->image)
                ) {
                    Storage::disk('public')->delete($event->image);
                }

                $event->image = $request->file('image')->store('events', 'public');
            }

            $event->name = $request->name;
            $event->description = $request->description;
            $event->date = $request->date;

            $event->save();

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully',
                'data' => $event,
            ]);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Event update failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {

            $event = Event::findOrFail($id);

            if (
                $event->image &&
                Storage::disk('public')->exists($event->image)
            ) {
                Storage::disk('public')->delete($event->image);
            }

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully',
            ]);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Event deletion failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
