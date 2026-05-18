<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $batch = Batch::where('name', 'Kickboxing Morning 2026')->first();

        if (!$batch) {
            $batch = Batch::create([
                'name' => 'Kickboxing Morning 2026',
                'date' => '2026-06-01',
                'enddate' => '2026-12-01',
                'total_fee' => 1000.00,
                'status' => 'active',
                'notes' => 'Standard beginner batch.'
            ]);
        }
        
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'batch_id' => null,
            'total_fee' => null,
            'status' => true,
        ]);

        User::create([
            'name' => 'Jane Doe',
            'email' => 'student@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('student123'),
            'role' => 'student',
            'batch_id' => $batch->id,
            'total_fee' => 1000.00,
            'notes' => 'Enrolled in morning martial arts sessions.',
            'status' => true,
        ]);
    }
}
