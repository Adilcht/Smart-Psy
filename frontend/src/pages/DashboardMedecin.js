import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardMedecin() {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRendezVous();
  }, []);

  const fetchRendezVous = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/medecin/rendezvous", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRendezVous(response.data);
    } catch (error) {
      console.error("Erreur de récupération :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/medecin/rendezvous/${id}`,
        { statut: action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Rendez-vous ${action === "confirmé" ? "confirmé" : "annulé"} !`);
      fetchRendezVous();
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tableau de bord Médecin</h1>
      <h3>Liste des rendez-vous reçus</h3>

      {rendezVous.length === 0 ? (
        <p>Aucun rendez-vous pour le moment.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rendezVous.map((rdv) => (
              <tr key={rdv.id}>
                <td>{rdv.patient?.name}</td>
                <td>{rdv.date}</td>
                <td>{rdv.statut}</td>
                <td>
                  <button onClick={() => handleAction(rdv.id, "confirmé")}>Confirmer</button>{" "}
                  <button onClick={() => handleAction(rdv.id, "annulé")}>Annuler</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DashboardMedecin;
