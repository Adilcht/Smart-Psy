<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;

class MedecinController extends Controller
{
    // Liste des rendez-vous reçus par le médecin connecté
    public function mesRendezVous(Request $request)
    {
        $medecin = $request->user();
        $rendezvous = RendezVous::where('medecin_id', $medecin->id)->with('patient')->get();
        return response()->json($rendezvous);
    }

    // Confirmer un rendez-vous
    public function confirmer($id)
    {
        $rdv = RendezVous::findOrFail($id);
        $rdv->update(['status' => 'confirmé']);
        return response()->json(['message' => 'Rendez-vous confirmé']);
    }

    // Annuler un rendez-vous
    public function annuler($id)
    {
        $rdv = RendezVous::findOrFail($id);
        $rdv->update(['status' => 'annulé']);
        return response()->json(['message' => 'Rendez-vous annulé']);
    }
}
