<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\PatientController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });


    // Routes admineeee  
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/profile', [AdminController::class, 'profile']);

        // Médecins
        Route::get('/admin/medecins', [AdminController::class, 'getMedecins']);
        Route::post('/admin/createmedecin', [AdminController::class, 'createMedecin']);
        Route::put('/admin/updatemedecin/{id}', [AdminController::class, 'updateMedecin']);
        Route::delete('/admin/deletemedecin/{id}', [AdminController::class, 'deleteMedecin']);

        // Patients
        Route::get('/admin/patients', [AdminController::class, 'getPatients']);
        Route::post('/admin/createpatient', [AdminController::class, 'createPatient']);
        Route::put('/admin/updatepatient/{id}', [AdminController::class, 'updatePatient']);
        Route::delete('/admin/deletepatient/{id}', [AdminController::class, 'deletePatient']);
    });

// ROUTES MÉDECIN
Route::middleware(['auth:sanctum', 'role:medecin'])->group(function () {
    Route::get('/medecin/rendezvous', [MedecinController::class, 'mesRendezVous']);
    Route::put('/medecin/rendezvous/{id}/confirmer', [MedecinController::class, 'confirmer']);
    Route::put('/medecin/rendezvous/{id}/annuler', [MedecinController::class, 'annuler']);
});

// ROUTES PATIENT
Route::middleware(['auth:sanctum', 'role:patient'])->group(function () {
    Route::get('/patient/medecins', [PatientController::class, 'getMedecins']);
    Route::post('/patient/prendrerendezvous', [PatientController::class, 'prendreRendezVous']);
    Route::get('/patient/mesrendezvous', [PatientController::class, 'mesRendezVous']);
});
    
});
