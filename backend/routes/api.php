<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

   
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });

  
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/profile', [AdminController::class, 'profile']);

    // cruddd Médecins
    Route::get('/admin/getmedecin', [AdminController::class, 'getMedecins']);
    Route::post('/admin/createmedecin', [AdminController::class, 'createMedecin']);
    Route::put('/admin/updatemedecin/{id}', [AdminController::class, 'updateMedecin']);
    Route::delete('/admin/deletemedecin/{id}', [AdminController::class, 'deleteMedecin']);

    // cruddd Patients
    Route::get('/admin/getpatient', [AdminController::class, 'getPatients']);
    Route::post('/admin/createpatient', [AdminController::class, 'createPatient']);
    Route::put('/admin/updatepatient/{id}', [AdminController::class, 'updatePatient']);
    Route::delete('/admin/deletepatient/{id}', [AdminController::class, 'deletePatient']);
});







});
