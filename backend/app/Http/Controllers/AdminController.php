<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    
    public function profile(Request $request)
    {
        $admin = $request->user()->load('roles');
        return response()->json($admin);
    }

   
    public function getMedecins()
    {
        $medecins = User::role('medecin')->get(); 
        return response()->json($medecins);
    }

 
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

       
        $user->assignRole('medecin');

        return response()->json(['message' => 'Médecin créé avec succès', 'user' => $user]);
    }

    // 🟢 UPDATE médecin
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

    // 🟢 DELETE médecin
    public function deleteMedecin($id)
    {
        $medecin = User::findOrFail($id);
        $medecin->delete();
        return response()->json(['message' => 'Médecin supprimé']);
    }

    // ==========================================================
    // 👥 PATIENTS
    // ==========================================================

    // 🟢 GET tous les patients
    public function getPatients()
    {
        $patients = User::role('patient')->get(); // ✅ simplifié aussi
        return response()->json($patients);
    }

    // 🟢 CREATE patient
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

        // ✅ Spatie
        $user->assignRole('patient');

        return response()->json(['message' => 'Patient créé avec succès', 'user' => $user]);
    }

    // 🟢 UPDATE patient
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

    // 🟢 DELETE patient
    public function deletePatient($id)
    {
        $patient = User::findOrFail($id);
        $patient->delete();
        return response()->json(['message' => 'Patient supprimé']);
    }
}
