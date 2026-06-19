<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            
            // Basic Information
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category');
            $table->date('posted_date');
            $table->text('short_description');

            // Image Reference
            $table->string('featured_image')->nullable();

            // Nested Dynamic Sections Layout array
            $table->json('content');

            // SEO Engine Metadata
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('meta_keywords')->nullable();

            // Controls visibility parameters
            $table->boolean('is_published')->default(false);
            $table->unsignedBigInteger('views')->default(0);
            
            // Auto-generates created_at and updated_at tracks
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};