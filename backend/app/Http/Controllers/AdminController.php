<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // 🔹 Profil admin
    public function profile(Request $request)
    {
        $admin = $request->user()->load('roles');
        return response()->json($admin);
    }

    // =========================
    // MÉDECINS
    // =========================

    // 🔹 Récupérer tous les médecins
   public function getMedecins()
{
    $medecins = User::whereHas('roles', function ($query) {
    $query->where('name', 'medecin');
})->get();

    return response()->json($medecins);
}

    // 🔹 Créer médecin
    public function createMedecin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->addRole('medecin');

        return response()->json(['message' => 'Médecin créé avec succès', 'user' => $user]);
    }

    // 🔹 Mettre à jour médecin
    public function updateMedecin(Request $request, $id)
    {
        $medecin = User::findOrFail($id);
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $id,
        ]);
        $medecin->update($request->only('name', 'email'));
        return response()->json(['message' => 'Médecin mis à jour', 'user' => $medecin]);
    }

    // 🔹 Supprimer médecin
    public function deleteMedecin($id)
    {
        $medecin = User::findOrFail($id);
        $medecin->delete();
        return response()->json(['message' => 'Médecin supprimé']);
    }

    // =========================
    // PATIENTS
    // =========================

    // 🔹 Récupérer tous les patients
    public function getPatients()
    {
        $patients = User::whereHas('roles', function ($query) {
    $query->where('name', 'patient');
})->get();

        return response()->json($patients);
    }

    // 🔹 Créer patient
    public function createPatient(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->addRole('patient');

        return response()->json(['message' => 'Patient créé avec succès', 'user' => $user]);
    }

    // 🔹 Mettre à jour patient
    public function updatePatient(Request $request, $id)
    {
        $patient = User::findOrFail($id);
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $id,
        ]);
        $patient->update($request->only('name', 'email'));
        return response()->json(['message' => 'Patient mis à jour', 'user' => $patient]);
    }

    // 🔹 Supprimer patient
    public function deletePatient($id)
    {
        $patient = User::findOrFail($id);
        $patient->delete();
        return response()->json(['message' => 'Patient supprimé']);
    }
}
