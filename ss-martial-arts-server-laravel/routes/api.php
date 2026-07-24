<?php

use App\Http\Controllers\AffiliationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\TestimonialController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/running', function () {
    return "SS Martial Arts Server is Running";
});

Route::post('/contacts', [ContactController::class, 'store']);
Route::get('/trainers', [TrainerController::class, 'index']);
Route::get('/trainers/{trainer}', [TrainerController::class, 'show']);

Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faqs/{id}', [FaqController::class, 'show']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/galleries', [GalleryController::class, 'index']);
Route::get('/galleries/{id}', [GalleryController::class, 'show']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);
Route::get('/blogs/{id}/related', [BlogController::class, 'getRelatedBlogs']);

Route::get('/users/{userId}/certificates', [CertificateController::class, 'index']);
Route::get('/certificates/{id}', [CertificateController::class, 'show']);

Route::get('/findstudents', [StudentController::class, 'findstudent']);
Route::get('/affiliations', [AffiliationController::class, 'index']);

Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [AuthController::class, 'dashboard']);


    Route::get('/contacts', [ContactController::class, 'index']);
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

    Route::post('/trainers', [TrainerController::class, 'store']);
    Route::put('/trainers/{trainer}', [TrainerController::class, 'update']);
    Route::get('/trainers/{id}', [TrainerController::class, 'show']);
    Route::delete('/trainers/{trainer}', [TrainerController::class, 'destroy']);

    Route::get('/batches', [BatchController::class, 'index']);
    Route::post('/batches', [BatchController::class, 'store']);
    Route::get('/batches/{id}', [BatchController::class, 'show']);
    Route::put('/batches/{id}', [BatchController::class, 'update']);
    Route::delete('/batches/{id}', [BatchController::class, 'destroy']);

    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::post('/students/register', [StudentController::class, 'register']);
    Route::get('/student/my-batch', [StudentController::class, 'myBatch']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::delete('/students/{id}', [StudentController::class, 'destroy']);
    Route::get('/students', [StudentController::class, 'index']);

    Route::get('/student/fee-status', [PaymentController::class, 'myFeeStatus']);
    Route::post('/payments/add', [PaymentController::class, 'addPayment']);

    Route::post('/galleries', [GalleryController::class, 'store']);
    Route::post('/galleries/{id}', [GalleryController::class, 'update']);
    Route::delete('/galleries/{id}', [GalleryController::class, 'destroy']);

    Route::post('/events', [EventController::class, 'store']);
    Route::post('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);

    Route::post('/faqs', [FaqController::class, 'store']);
    Route::put('/faqs/{id}', [FaqController::class, 'update']);
    Route::delete('/faqs/{id}', [FaqController::class, 'destroy']);

    Route::post('/certificates', [CertificateController::class, 'store']);
    Route::post('/certificates/{id}', [CertificateController::class, 'update']);
    Route::delete('/certificates/{id}', [CertificateController::class, 'destroy']);

    Route::post('/affiliations', [AffiliationController::class, 'store']);
    Route::put('/affiliations/{id}', [AffiliationController::class, 'update']);
    Route::delete('/affiliations/{id}', [AffiliationController::class, 'destroy']);

    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::patch('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
});
