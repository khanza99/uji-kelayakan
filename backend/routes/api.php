<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConcertController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\ConcertCategoryController;
use App\Http\Controllers\SeatTierController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\UserController;

// =============================================
// PUBLIC ROUTES
// =============================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Browse konser tanpa login
Route::get('concerts', [ConcertController::class, 'index']);
Route::get('concerts/{concert}',[ConcertController::class, 'show']);
Route::get('categories', [ConcertCategoryController::class, 'index']);
Route::get('venues', [VenueController::class, 'index']);

// =============================================
// AUTHENTICATED ROUTES
// =============================================
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // -----------------------------------------------
    // USER routes
    // -----------------------------------------------
    Route::middleware('role:user|staff|superadmin')->group(function () {
        // Order & checkout
        Route::post('orders', [OrderController::class, 'store']);
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
        Route::post('orders/{order}/upload-proof', [OrderController::class, 'uploadPaymentProof']);

        // Tiket milik sendiri
        Route::get('tickets', [TicketController::class, 'index']);
        Route::get('tickets/{ticket}', [TicketController::class, 'show']);
        Route::get('tickets/{ticket}/qr', [TicketController::class, 'qr']);
        Route::get('tickets/{ticket}/download', [TicketController::class, 'download']);

        // Payment milik sendiri
        Route::get('payments', [PaymentController::class, 'index']);
        Route::get('payments/{payment}', [PaymentController::class, 'show']);

        // Refund — ajukan
        Route::get('refunds', [RefundController::class, 'index']);
        Route::post('refunds', [RefundController::class, 'store']);
        Route::get('refunds/{refund}', [RefundController::class, 'show']);

        // Seats — lihat kursi
        Route::get('seats', [SeatController::class, 'index']);
        Route::get('seats/{seat}', [SeatController::class, 'show']);

        // Seat tiers — lihat tier
        Route::get('seat-tiers', [SeatTierController::class, 'index']);
        Route::get('seat-tiers/{seatTier}',[SeatTierController::class, 'show']);
    });

    // -----------------------------------------------
    // STAFF routes
    // -----------------------------------------------
    Route::middleware('role:staff|superadmin')->group(function () {
        // Validasi QR tiket
        Route::post('tickets/validate', [TicketController::class, 'validate']);

        // Konfirmasi pembayaran
        Route::post('orders/{order}/confirm-payment', [OrderController::class, 'confirmPayment']);

        // Approve / reject refund
        Route::patch('refunds/{refund}', [RefundController::class, 'update']);

        // Upload dokumen konser
        Route::get('documents', [DocumentController::class, 'index']);
        Route::post('documents', [DocumentController::class, 'store']);
        Route::get('documents/{document}', [DocumentController::class, 'show']);
        Route::delete('documents/{document}',[DocumentController::class, 'destroy']);

        // Edit info konser (terbatas)
        Route::patch('concerts/{concert}', [ConcertController::class, 'update']);

        // Seat tier CRUD
        Route::post('seat-tiers', [SeatTierController::class, 'store']);
        Route::put('seat-tiers/{seatTier}', [SeatTierController::class, 'update']);
        Route::delete('seat-tiers/{seatTier}', [SeatTierController::class, 'destroy']);

        // Block/unblock kursi
        Route::patch('seats/{seat}', [SeatController::class, 'update']);
    });

    // -----------------------------------------------
    // SUPERADMIN routes
    // -----------------------------------------------
    Route::middleware('role:superadmin')->group(function () {
        // User management
        Route::apiResource('users', UserController::class);

        // Concert full CRUD
        Route::post('concerts', [ConcertController::class, 'store']);
        Route::put('concerts/{concert}', [ConcertController::class, 'update']);
        Route::delete('concerts/{concert}', [ConcertController::class, 'destroy']);

        // Venue full CRUD
        Route::post('venues', [VenueController::class, 'store']);
        Route::put('venues/{venue}', [VenueController::class, 'update']);
        Route::delete('venues/{venue}', [VenueController::class, 'destroy']);

        // Category full CRUD
        Route::post('categories', [ConcertCategoryController::class, 'store']);
        Route::put('categories/{concertCategory}', [ConcertCategoryController::class, 'update']);
        Route::delete('categories/{concertCategory}',[ConcertCategoryController::class, 'destroy']);

        // (Seat tiers and Seats CRUD have been moved to staff|superadmin)

        // Dashboard & laporan
        Route::get('dashboard', [DashboardController::class, 'index']);

        // Export
        Route::prefix('export')->group(function () {
            Route::get('orders/pdf', [ExportController::class, 'ordersPdf']);
            Route::get('orders/excel', [ExportController::class, 'ordersExcel']);
            Route::get('tickets/excel', [ExportController::class, 'ticketsExcel']);
            Route::get('concerts/excel', [ExportController::class, 'concertsExcel']);
        });
    });
});