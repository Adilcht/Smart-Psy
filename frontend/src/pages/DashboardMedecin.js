import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardMedecin.css";

function DashboardMedecin() {
  const [medecin, setMedecin] = useState(null);
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rendezvous");
  const [stats, setStats] = useState({
    total: 0,
    confirmes: 0,
    en_attente: 0,
    annules: 0
  });
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔹 Déconnexion
  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // 🔹 Récupérer le profil du médecin
  const fetchMedecinProfile = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedecin(res.data);
    } catch (error) {
      console.error("Erreur fetch profil médecin:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // 🔹 Récupérer tous les rendez-vous du médecin
  const fetchRendezvous = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/medecin/rendezvous", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRendezvous(res.data);
      calculateStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur fetch rendezvous:", error);
      setLoading(false);
    }
  };

  // 🔹 Calculer les statistiques
  const calculateStats = (rdvs) => {
    const stats = {
      total: rdvs.length,
      confirmes: rdvs.filter(rdv => rdv.status === "confirmé").length,
      en_attente: rdvs.filter(rdv => rdv.status === "en_attente").length,
      annules: rdvs.filter(rdv => rdv.status === "annulé").length
    };
    setStats(stats);
  };

  // 🔹 Confirmer un rendez-vous
  const confirmerRdv = async (id) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/medecin/rendezvous/${id}/confirmer`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRendezvous();
      alert("✅ Rendez-vous confirmé avec succès !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la confirmation");
    }
  };

  // 🔹 Annuler un rendez-vous
  const annulerRdv = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) return;
    
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/medecin/rendezvous/${id}/annuler`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRendezvous();
      alert("✅ Rendez-vous annulé avec succès !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'annulation");
    }
  };

  // 🔹 Filtrer les rendez-vous par statut
  const getFilteredRendezvous = (status = null) => {
    if (!status) return rendezvous;
    return rendezvous.filter(rdv => rdv.status === status);
  };

  useEffect(() => {
    fetchMedecinProfile();
    fetchRendezvous();
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
    <div className="dashboard-medecin">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>🩺 Tableau de Bord Médecin</h1>
            <p>Gérez vos rendez-vous et votre planning</p>
          </div>
          <div className="header-actions">
            {medecin && (
              <div className="profile-badge">
                <div className="profile-avatar">
                  {medecin.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <strong>Dr. {medecin.name}</strong>
                  <span>{medecin.email}</span>
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
          className={`tab-button ${activeTab === "rendezvous" ? "active" : ""}`}
          onClick={() => setActiveTab("rendezvous")}
        >
          📅 Mes Rendez-vous
        </button>
        <button 
          className={`tab-button ${activeTab === "profil" ? "active" : ""}`}
          onClick={() => setActiveTab("profil")}
        >
          👤 Mon Profil
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Tab 1: Rendez-vous */}
        {activeTab === "rendezvous" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>📅 Mes Rendez-vous</h2>
              <p>Gérez vos rendez-vous avec vos patients</p>
            </div>

            {/* Statistiques */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.total}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.en_attente}</span>
                  <span className="stat-label">En attente</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.confirmes}</span>
                  <span className="stat-label">Confirmés</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.annules}</span>
                  <span className="stat-label">Annulés</span>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="filters-section">
              <button 
                className={`filter-button ${getFilteredRendezvous().length === rendezvous.length ? 'active' : ''}`}
                onClick={() => setRendezvous(getFilteredRendezvous())}
              >
                Tous ({stats.total})
              </button>
              <button 
                className={`filter-button ${getFilteredRendezvous('en_attente').length === rendezvous.length ? 'active' : ''}`}
                onClick={() => setRendezvous(getFilteredRendezvous('en_attente'))}
              >
                En attente ({stats.en_attente})
              </button>
              <button 
                className={`filter-button ${getFilteredRendezvous('confirmé').length === rendezvous.length ? 'active' : ''}`}
                onClick={() => setRendezvous(getFilteredRendezvous('confirmé'))}
              >
                Confirmés ({stats.confirmes})
              </button>
            </div>

            {/* Liste des rendez-vous */}
            {rendezvous.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>Aucun rendez-vous pour le moment</h3>
                <p>Les rendez-vous de vos patients apparaîtront ici.</p>
              </div>
            ) : (
              <div className="rdv-table-container">
                <table className="rdv-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Email</th>
                      <th>Date et heure</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rendezvous.map((rdv) => (
                      <tr key={rdv.id} className="rdv-row">
                        <td className="patient-cell">
                          <div className="patient-avatar">
                            {rdv.patient?.name?.charAt(0).toUpperCase()}
                          </div>
                          {rdv.patient?.name}
                        </td>
                        <td className="email-cell">{rdv.patient?.email}</td>
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
                        <td className="actions-cell">
                          <button
                            onClick={() => confirmerRdv(rdv.id)}
                            disabled={rdv.status === "confirmé" || rdv.status === "annulé"}
                            className="action-button confirm"
                            title="Confirmer le rendez-vous"
                          >
                            ✅ Confirmer
                          </button>
                          <button
                            onClick={() => annulerRdv(rdv.id)}
                            disabled={rdv.status === "annulé"}
                            className="action-button cancel"
                            title="Annuler le rendez-vous"
                          >
                            ❌ Annuler
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profil */}
        {activeTab === "profil" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>👤 Mon Profil Médecin</h2>
              <p>Informations de votre compte médecin</p>
            </div>
            
            {medecin && (
              <div className="profile-card">
                <div className="profile-section">
                  <div className="profile-avatar large">
                    {medecin.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-details">
                    <div className="detail-item">
                      <label>Nom complet</label>
                      <p>Dr. {medecin.name}</p>
                    </div>
                    <div className="detail-item">
                      <label>Adresse email</label>
                      <p>{medecin.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Rôle</label>
                      <p>{medecin.roles?.map(r => r.name).join(", ")}</p>
                    </div>
                    <div className="detail-item">
                      <label>Statistiques des rendez-vous</label>
                      <div className="stats-grid compact">
                        <div className="stat-item">
                          <span className="stat-number">{stats.total}</span>
                          <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{stats.en_attente}</span>
                          <span className="stat-label">En attente</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{stats.confirmes}</span>
                          <span className="stat-label">Confirmés</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{stats.annules}</span>
                          <span className="stat-label">Annulés</span>
                        </div>
                      </div>
                    </div>
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
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardMedecin;