<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RendezVous;
use Illuminate\Support\Facades\Mail;

class PatientController extends Controller
{

      public function profile(Request $request)
    {
        $patient = $request->user()->load('roles');
        return response()->json($patient);
    }
    // Liste des médecins
   public function getMedecins()
{
    // ✅ Utilise la méthode Laratrust
    $medecins = \App\Models\User::whereHas('roles', function ($query) {
        $query->where('name', 'medecin');
    })->select('id', 'name', 'email')->get();

    return response()->json($medecins);
}


    // Créer un rendez-vous
    public function prendreRendezVous(Request $request)
    {
        $validated = $request->validate([
            'medecin_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);

        $rdv = RendezVous::create([
            'patient_id' => $request->user()->id,
            'medecin_id' => $validated['medecin_id'],
            'date' => $validated['date'],
            'status' => 'en attente', // ✅ statut par défaut
        ]);

        // Exemple futur : envoyer un mail
        // Mail::to($request->user()->email)->send(new ConfirmationRendezVous($rdv));

        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'rendezvous' => $rdv
        ]);
    }

    // Voir ses rendez-vous
    public function mesRendezVous(Request $request)
    {
        $patient = $request->user();
        $rendezvous = RendezVous::where('patient_id', $patient->id)
            ->with('medecin')
            ->get();

        return response()->json($rendezvous);
    }
}
