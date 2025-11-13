import React, { useState, useEffect } from "react";
import axios from "axios";

function DashboardPatient() {
  const [medecins, setMedecins] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);
  const [selectedDate, setSelectedDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Config Axios avec token stocké dans localStorage
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  // 🔹 Récupérer tous les médecins
  const fetchMedecins = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/patient/medecins", axiosConfig);
      setMedecins(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les médecins");
    }
  };

  // 🔹 Récupérer les rendez-vous du patient
  const fetchRendezVous = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/patient/mesrendezvous", axiosConfig);
      setRendezvous(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer vos rendez-vous");
    }
  };

  useEffect(() => {
    fetchMedecins();
    fetchRendezVous();
  }, []);

  // 🔹 Prendre rendez-vous pour un médecin donné
  const handlePrendreRdv = async (medecinId) => {
    if (!selectedDate[medecinId]) {
      alert("Veuillez choisir une date !");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/patient/prendrerendezvous",
        {
          medecin_id: medecinId,
          date: selectedDate[medecinId],
        },
        axiosConfig
      );
      alert("Rendez-vous créé !");
      setSelectedDate({ ...selectedDate, [medecinId]: "" }); // réinitialiser la date
      fetchRendezVous(); // rafraîchir la liste des rendez-vous
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du rendez-vous");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Liste des médecins</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {medecins.length === 0 && <p>Aucun médecin disponible.</p>}
      {medecins.map((med) => (
        <div
          key={med.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h2>{med.name}</h2>
          <p>Email : {med.email}</p>
          <input
            type="datetime-local"
            value={selectedDate[med.id] || ""}
            onChange={(e) =>
              setSelectedDate({ ...selectedDate, [med.id]: e.target.value })
            }
            style={{ marginRight: "10px" }}
          />
          <button
            onClick={() => handlePrendreRdv(med.id)}
            disabled={loading}
            style={{
              padding: "5px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "En cours..." : "Prendre rendez-vous"}
          </button>
        </div>
      ))}

      <h1>Mes rendez-vous</h1>
      {rendezvous.length === 0 && <p>Vous n'avez aucun rendez-vous.</p>}
      {rendezvous.map((rdv) => (
        <div
          key={rdv.id}
          style={{
            border: "1px solid #eee",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p>Médecin : {rdv.medecin.name}</p>
          <p>Date : {new Date(rdv.date).toLocaleString()}</p>
          <p>Status : {rdv.status}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPatient;
