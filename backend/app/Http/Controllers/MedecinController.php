<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;

class MedecinController extends Controller
{
      public function profile(Request $request)
    {
        $medecin = $request->user()->load('roles');
        return response()->json($medecin);
    }
    /**
     * Récupérer tous les rendez-vous du médecin connecté
     */
    public function mesRendezVous(Request $request)
    {
        $medecin = $request->user();

        // Récupère les rendez-vous avec les infos patient
        $rendezvous = RendezVous::where('medecin_id', $medecin->id)
            ->with('patient:id,name,email') // récupérer seulement id, name, email du patient
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($rendezvous);
    }

    /**
     * Confirmer un rendez-vous
     */
    public function confirmer($id)
    {
        $rdv = RendezVous::findOrFail($id);

        // Vérifie que le rendez-vous appartient bien au médecin connecté
        if ($rdv->medecin_id != auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $rdv->update(['status' => 'confirmé']);

        return response()->json([
            'message' => 'Rendez-vous confirmé',
            'rendezvous' => $rdv
        ]);
    }

    /**
     * Annuler un rendez-vous
     */
    public function annuler($id)
    {
        $rdv = RendezVous::findOrFail($id);

        // Vérifie que le rendez-vous appartient bien au médecin connecté
        if ($rdv->medecin_id != auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $rdv->update(['status' => 'annulé']);

        return response()->json([
            'message' => 'Rendez-vous annulé',
            'rendezvous' => $rdv
        ]);
    }
}
