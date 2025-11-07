<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AdminController;

// ========================
// 🔐 AUTHENTIFICATION
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ========================
// 🔒 ROUTES PROTÉGÉES (Sanctum)
// ========================
Route::middleware('auth:sanctum')->group(function () {

    // 🔸 Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // 🔸 Profil utilisateur connecté
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });

    // ========================
    // 🧭 ROUTES ADMIN (protégées par rôle)
    // ========================
    Route::middleware(['role:admin'])->group(function () {

        // Profil de l'admin
        Route::get('/admin/profile', [AdminController::class, 'profile']);

        // CRUD Médecins
        Route::get('/admin/medecins', [AdminController::class, 'getMedecins']);
        Route::post('/admin/medecins', [AdminController::class, 'createMedecin']);
        Route::put('/admin/medecins/{id}', [AdminController::class, 'updateMedecin']);
        Route::delete('/admin/medecins/{id}', [AdminController::class, 'deleteMedecin']);

        // CRUD Patients
        Route::get('/admin/patients', [AdminController::class, 'getPatients']);
        Route::post('/admin/patients', [AdminController::class, 'createPatient']);
        Route::put('/admin/patients/{id}', [AdminController::class, 'updatePatient']);
        Route::delete('/admin/patients/{id}', [AdminController::class, 'deletePatient']);
    });
});
