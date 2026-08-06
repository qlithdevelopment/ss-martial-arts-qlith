<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->decimal('payment_amount', 10, 2);

            $table->enum('payment_reason', [
                'monthly_payment',
                'equipment',
                'tournament',
                'belt_test',
                'other',
            ]);

            $table->string('other_reason')->nullable();           

            $table->enum('status', [
                'pending',
                'complete',
            ])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_payments');
    }
};