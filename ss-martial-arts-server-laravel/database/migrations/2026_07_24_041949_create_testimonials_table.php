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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->enum('type', [
                'quote-box',
                'square-text',
                'bubble-down-avatars',
                'tall-card',
                'large-image',
                'bubble-down-small',
                'wide-top',
                'wide-middle',
                'wide-bottom',
            ]);

            $table->string('title')->nullable();
            $table->text('text');
            $table->string('name')->nullable();
            $table->string('role')->nullable();
            $table->text('image')->nullable();
            $table->unsignedTinyInteger('stars')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
