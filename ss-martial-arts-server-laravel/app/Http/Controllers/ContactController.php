<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $perPage = $request->get('per_page', 10);

            $contacts = Contact::latest()->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Contacts fetched successfully.',
                'data' => $contacts->items(),
                'pagination' => [
                    'current_page' => $contacts->currentPage(),
                    'last_page' => $contacts->lastPage(),
                    'per_page' => $contacts->perPage(),
                    'total' => $contacts->total(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contacts.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Custom descriptive error strings for response arrays
        $customMessages = [
            'first_name.required'    => 'Please provide your first name.',
            'last_name.required'     => 'Please provide your last name.',
            'mobile_number.required' => 'A contact mobile number is mandatory to reach you back.',
            'mobile_number.regex'    => 'Please enter a valid mobile phone number format.',
            'programs.required'      => 'Selecting a specific program category option is required.',
            'message.required'       => 'The message text field content cannot be left empty.',
        ];

        $request->validate([
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'mobile_number' => 'required|string|min:8|max:20', // Handles various localization formats safely
            'programs'      => 'required|string|max:255',
            'message'       => 'required|string',
        ], $customMessages);

        try {
            $contact = Contact::create([
                'first_name'    => $request->first_name,
                'last_name'     => $request->last_name,
                'mobile_number' => $request->mobile_number,
                'programs'      => $request->programs,
                'message'       => $request->message,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you! Your contact request has been sent successfully.',
                'data' => $contact
            ], 201);
        } catch (Exception $e) {
            Log::error('Failed to preserve contact element instance: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Unfortunately, an unexpected server error prevented saving your request.',
                'debug_error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'The contact log entry has been deleted successfully.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete the record. It may have already been removed.'
            ], 500);
        }
    }
}
