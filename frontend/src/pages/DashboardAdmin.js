import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardAdmin.css";

function DashboardAdmin() {
  const [admin, setAdmin] = useState(null);
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("medecins");
  const [editingMedecin, setEditingMedecin] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  const [newMedecin, setNewMedecin] = useState({ name: "", email: "", password: "" });
  const [newPatient, setNewPatient] = useState({ name: "", email: "", password: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  // 🔹 Déconnexion
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      alert("❌ Token non trouvé. Connectez-vous !");
      navigate("/login");
      return;
    }
    fetchAdmin();
    fetchMedecins();
    fetchPatients();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await api.get("/user");
      setAdmin(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchMedecins = async () => {
    try {
      const res = await api.get("/admin/medecins");
      setMedecins(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Impossible de récupérer les médecins");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/admin/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Impossible de récupérer les patients");
    }
  };

  // 🔹 Médecins
  const createMedecin = async () => {
    if (!newMedecin.name || !newMedecin.email || !newMedecin.password) {
      return alert("⚠️ Tous les champs sont obligatoires");
    }
    try {
      setLoading(true);
      await api.post("/admin/createmedecin", newMedecin);
      setNewMedecin({ name: "", email: "", password: "" });
      fetchMedecins();
      alert("✅ Médecin créé avec succès !");
    } catch (err) { 
      console.error(err); 
      alert("❌ Erreur lors de la création du médecin");
    } finally { 
      setLoading(false); 
    }
  };

  const updateMedecin = async (id, data) => {
    try { 
      await api.put(`/admin/updatemedecin/${id}`, data); 
      fetchMedecins();
      setEditingMedecin(null);
      alert("✅ Médecin modifié avec succès !");
    } catch (err) { 
      console.error(err);
      alert("❌ Erreur lors de la modification");
    }
  };

  const deleteMedecin = async (id) => { 
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?")) return;
    try { 
      await api.delete(`/admin/deletemedecin/${id}`); 
      fetchMedecins();
      alert("✅ Médecin supprimé avec succès !");
    } catch (err) { 
      console.error(err);
      alert("❌ Erreur lors de la suppression");
    } 
  };

  // 🔹 Patients
  const createPatient = async () => {
    if (!newPatient.name || !newPatient.email || !newPatient.password) {
      return alert("⚠️ Tous les champs sont obligatoires");
    }
    try {
      setLoading(true);
      await api.post("/admin/createpatient", newPatient);
      setNewPatient({ name: "", email: "", password: "" });
      fetchPatients();
      alert("✅ Patient créé avec succès !");
    } catch (err) { 
      console.error(err); 
      alert("❌ Erreur lors de la création du patient");
    } finally { 
      setLoading(false); 
    }
  };

  const updatePatient = async (id, data) => { 
    try { 
      await api.put(`/admin/updatepatient/${id}`, data); 
      fetchPatients();
      setEditingPatient(null);
      alert("✅ Patient modifié avec succès !");
    } catch (err) { 
      console.error(err);
      alert("❌ Erreur lors de la modification");
    } 
  };

  const deletePatient = async (id) => { 
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) return;
    try { 
      await api.delete(`/admin/deletepatient/${id}`); 
      fetchPatients();
      alert("✅ Patient supprimé avec succès !");
    } catch (err) { 
      console.error(err);
      alert("❌ Erreur lors de la suppression");
    } 
  };

  if (!admin) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-admin">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>🏠 Tableau de Bord Administrateur</h1>
            <p>Gestion complète des médecins et patients</p>
          </div>
          <div className="header-actions">
            <div className="profile-badge">
              <div className="profile-avatar">
                {admin.name?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <strong>{admin.name}</strong>
                <span>Administrateur</span>
              </div>
            </div>
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
          🩺 Médecins
        </button>
        <button 
          className={`tab-button ${activeTab === "patients" ? "active" : ""}`}
          onClick={() => setActiveTab("patients")}
        >
          👥 Patients
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
        {/* Tab 1: Médecins */}
        {activeTab === "medecins" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🩺 Gestion des Médecins</h2>
              <p>Ajouter, modifier ou supprimer des médecins</p>
            </div>

            {/* Formulaire d'ajout */}
            <div className="form-card">
              <h3>➕ Ajouter un nouveau médecin</h3>
              <div className="form-grid">
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  value={newMedecin.name}
                  onChange={e => setNewMedecin({...newMedecin, name: e.target.value})}
                  className="form-input"
                />
                <input 
                  type="email" 
                  placeholder="Adresse email" 
                  value={newMedecin.email}
                  onChange={e => setNewMedecin({...newMedecin, email: e.target.value})}
                  className="form-input"
                />
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  value={newMedecin.password}
                  onChange={e => setNewMedecin({...newMedecin, password: e.target.value})}
                  className="form-input"
                />
                <button 
                  onClick={createMedecin} 
                  disabled={loading}
                  className="primary-button"
                >
                  {loading ? "Création..." : "➕ Ajouter Médecin"}
                </button>
              </div>
            </div>

            {/* Liste des médecins */}
            <div className="table-section">
              <h3>📋 Liste des médecins ({medecins.length})</h3>
              {medecins.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👨‍⚕️</div>
                  <h4>Aucun médecin enregistré</h4>
                  <p>Commencez par ajouter un médecin</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Date de création</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medecins.map(medecin => (
                        <tr key={medecin.id}>
                          {editingMedecin?.id === medecin.id ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  value={editingMedecin.name}
                                  onChange={e => setEditingMedecin({...editingMedecin, name: e.target.value})}
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="email"
                                  value={editingMedecin.email}
                                  onChange={e => setEditingMedecin({...editingMedecin, email: e.target.value})}
                                  className="edit-input"
                                />
                              </td>
                              <td>{new Date(medecin.created_at).toLocaleDateString('fr-FR')}</td>
                              <td>
                                <button 
                                  onClick={() => updateMedecin(medecin.id, {name: editingMedecin.name, email: editingMedecin.email})}
                                  className="action-button success"
                                >
                                  ✅
                                </button>
                                <button 
                                  onClick={() => setEditingMedecin(null)}
                                  className="action-button danger"
                                >
                                  ❌
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{medecin.name}</td>
                              <td>{medecin.email}</td>
                              <td>{new Date(medecin.created_at).toLocaleDateString('fr-FR')}</td>
                              <td>
                                <button 
                                  onClick={() => setEditingMedecin(medecin)}
                                  className="action-button primary"
                                  title="Modifier"
                                >
                                  ✏️
                                </button>
                                <button 
                                  onClick={() => deleteMedecin(medecin.id)}
                                  className="action-button danger"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Patients */}
        {activeTab === "patients" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>👥 Gestion des Patients</h2>
              <p>Ajouter, modifier ou supprimer des patients</p>
            </div>

            {/* Formulaire d'ajout */}
            <div className="form-card">
              <h3>➕ Ajouter un nouveau patient</h3>
              <div className="form-grid">
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  value={newPatient.name}
                  onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                  className="form-input"
                />
                <input 
                  type="email" 
                  placeholder="Adresse email" 
                  value={newPatient.email}
                  onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                  className="form-input"
                />
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  value={newPatient.password}
                  onChange={e => setNewPatient({...newPatient, password: e.target.value})}
                  className="form-input"
                />
                <button 
                  onClick={createPatient} 
                  disabled={loading}
                  className="primary-button"
                >
                  {loading ? "Création..." : "➕ Ajouter Patient"}
                </button>
              </div>
            </div>

            {/* Liste des patients */}
            <div className="table-section">
              <h3>📋 Liste des patients ({patients.length})</h3>
              {patients.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👤</div>
                  <h4>Aucun patient enregistré</h4>
                  <p>Commencez par ajouter un patient</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Date de création</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map(patient => (
                        <tr key={patient.id}>
                          {editingPatient?.id === patient.id ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  value={editingPatient.name}
                                  onChange={e => setEditingPatient({...editingPatient, name: e.target.value})}
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="email"
                                  value={editingPatient.email}
                                  onChange={e => setEditingPatient({...editingPatient, email: e.target.value})}
                                  className="edit-input"
                                />
                              </td>
                              <td>{new Date(patient.created_at).toLocaleDateString('fr-FR')}</td>
                              <td>
                                <button 
                                  onClick={() => updatePatient(patient.id, {name: editingPatient.name, email: editingPatient.email})}
                                  className="action-button success"
                                >
                                  ✅
                                </button>
                                <button 
                                  onClick={() => setEditingPatient(null)}
                                  className="action-button danger"
                                >
                                  ❌
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{patient.name}</td>
                              <td>{patient.email}</td>
                              <td>{new Date(patient.created_at).toLocaleDateString('fr-FR')}</td>
                              <td>
                                <button 
                                  onClick={() => setEditingPatient(patient)}
                                  className="action-button primary"
                                  title="Modifier"
                                >
                                  ✏️
                                </button>
                                <button 
                                  onClick={() => deletePatient(patient.id)}
                                  className="action-button danger"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Profil */}
        {activeTab === "profil" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>👤 Mon Profil Administrateur</h2>
              <p>Informations de votre compte administrateur</p>
            </div>
            
            <div className="profile-card">
              <div className="profile-section">
                <div className="profile-avatar large">
                  {admin.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Nom complet</label>
                    <p>{admin.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Adresse email</label>
                    <p>{admin.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Rôle</label>
                    <p>{admin.roles?.map(r => r.name).join(", ")}</p>
                  </div>
                  <div className="detail-item">
                    <label>Statistiques</label>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-number">{medecins.length}</span>
                        <span className="stat-label">Médecins</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{patients.length}</span>
                        <span className="stat-label">Patients</span>
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
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardAdmin;