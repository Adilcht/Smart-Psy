import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardPatient.css";

function DashboardPatient() {
  const [patient, setPatient] = useState(null);
  const [medecins, setMedecins] = useState([]);
  const [mesRdv, setMesRdv] = useState([]);
  const [rdvData, setRdvData] = useState({});
  const [activeTab, setActiveTab] = useState("medecins");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔹 Déconnexion
  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Supprimer les données du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Rediriger vers la page de login
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      // Déconnexion forcée même en cas d'erreur
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // 🔹 Charger le profil du patient connecté
  const fetchPatientProfile = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement du profil :", error);
      // Si le token est invalide, déconnecter l'utilisateur
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // 🔹 Charger les médecins
  const fetchMedecins = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/patient/medecins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedecins(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des médecins :", error);
      alert("Erreur serveur : impossible de charger les médecins");
    }
  };

  // 🔹 Charger mes rendez-vous
  const fetchMesRdv = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/patient/mesrendezvous", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMesRdv(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous :", error);
    }
  };

  // 🔹 Prendre un rendez-vous pour un médecin donné
  const prendreRendezVous = async (medecinId) => {
    const date = rdvData[medecinId];
    if (!date) return alert("Veuillez choisir une date pour ce médecin");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/patient/prendrerendezvous",
        { medecin_id: medecinId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Rendez-vous pris avec succès !");
      setRdvData({ ...rdvData, [medecinId]: "" });
      fetchMesRdv();
      setActiveTab("rendezvous");
    } catch (error) {
      console.error("Erreur lors de la prise de rendez-vous :", error);
      alert("Erreur lors de la prise de rendez-vous");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPatientProfile(),
        fetchMedecins(),
        fetchMesRdv()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-patient">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>👤 Tableau de bord Patient</h1>
            <p>Bienvenue{patient ? `, ${patient.name}` : ''} ! Gérez vos rendez-vous facilement.</p>
          </div>
          <div className="header-actions">
            {patient && (
              <div className="profile-badge">
                <div className="profile-avatar">
                  {patient.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <strong>{patient.name}</strong>
                  <span>{patient.email}</span>
                </div>
              </div>
            )}
            <button 
              className="logout-button"
              onClick={handleLogout}
              title="Se déconnecter"
            >
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === "medecins" ? "active" : ""}`}
          onClick={() => setActiveTab("medecins")}
        >
          🏥 Médecins disponibles
        </button>
        <button 
          className={`tab-button ${activeTab === "rendezvous" ? "active" : ""}`}
          onClick={() => setActiveTab("rendezvous")}
        >
          📅 Mes rendez-vous
        </button>
        <button 
          className={`tab-button ${activeTab === "profil" ? "active" : ""}`}
          onClick={() => setActiveTab("profil")}
        >
          👤 Mon profil
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Tab 1: Médecins disponibles */}
        {activeTab === "medecins" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🏥 Médecins disponibles</h2>
              <p>Choisissez un médecin et prenez rendez-vous</p>
            </div>
            
            {medecins.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👨‍⚕️</div>
                <h3>Aucun médecin disponible</h3>
                <p>Revenez plus tard pour voir les médecins disponibles.</p>
              </div>
            ) : (
              <div className="medecins-grid">
                {medecins.map((medecin) => (
                  <div key={medecin.id} className="medecin-card">
                    <div className="medecin-header">
                      <div className="medecin-avatar">
                        {medecin.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="medecin-info">
                        <h3>{medecin.name}</h3>
                        <p className="medecin-email">{medecin.email}</p>
                      </div>
                    </div>
                    
                    <div className="rdv-form">
                      <label className="date-label">Choisir une date et heure :</label>
                      <div className="date-input-group">
                        <input
                          type="datetime-local"
                          value={rdvData[medecin.id] || ""}
                          onChange={(e) => setRdvData({ ...rdvData, [medecin.id]: e.target.value })}
                          className="date-input"
                        />
                        <button
                          onClick={() => prendreRendezVous(medecin.id)}
                          className="rdv-button"
                          disabled={!rdvData[medecin.id]}
                        >
                          <span>📅 Prendre rendez-vous</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mes rendez-vous */}
        {activeTab === "rendezvous" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>📅 Mes rendez-vous</h2>
              <p>Consultez et gérez vos prochains rendez-vous</p>
            </div>
            
            {mesRdv.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>Aucun rendez-vous pour le moment</h3>
                <p>Prenez votre premier rendez-vous avec un médecin disponible.</p>
                <button 
                  className="primary-button"
                  onClick={() => setActiveTab("medecins")}
                >
                  Voir les médecins
                </button>
              </div>
            ) : (
              <div className="rdv-table-container">
                <table className="rdv-table">
                  <thead>
                    <tr>
                      <th>Médecin</th>
                      <th>Date et heure</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mesRdv.map((rdv) => (
                      <tr key={rdv.id} className="rdv-row">
                        <td className="medecin-cell">
                          <div className="medecin-avatar small">
                            {rdv.medecin?.name?.charAt(0).toUpperCase()}
                          </div>
                          {rdv.medecin?.name}
                        </td>
                        <td className="date-cell">
                          {new Date(rdv.date).toLocaleString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="status-cell">
                          <span className={`status-badge status-${rdv.status?.toLowerCase()}`}>
                            {rdv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profil */}
        {activeTab === "profil" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>👤 Mon profil</h2>
              <p>Informations de votre compte</p>
            </div>
            
            {patient && (
              <div className="profile-card">
                <div className="profile-section">
                  <div className="profile-avatar large">
                    {patient.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-details">
                    <div className="detail-item">
                      <label>Nom complet</label>
                      <p>{patient.name}</p>
                    </div>
                    <div className="detail-item">
                      <label>Adresse email</label>
                      <p>{patient.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Rôle</label>
                      <p>{patient.roles?.map(r => r.name).join(", ")}</p>
                    </div>
                    <div className="detail-item">
                      <button 
                        className="logout-button secondary"
                        onClick={handleLogout}
                      >
                        <span className="logout-icon">🚪</span>
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPatient;