import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardAdmin() {
  const [admin, setAdmin] = useState(null);
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Formulaires
  const [newMedecin, setNewMedecin] = useState({ name: "", email: "", password: "" });
  const [newPatient, setNewPatient] = useState({ name: "", email: "", password: "" });

  const token = localStorage.getItem("token"); // stocke le token de l'admin connecté

  // Configuration axios
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // ===============================
  // 🟢 Récupérer profil + données
  // ===============================
  useEffect(() => {
    fetchAdmin();
    fetchMedecins();
    fetchPatients();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await api.get("/admin/profile");
      setAdmin(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMedecins = async () => {
    try {
      const res = await api.get("/admin/getmedecin");
      setMedecins(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/admin/getpatient");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // 🩺 CRUD MÉDECINS
  // ===============================
  const createMedecin = async () => {
    try {
      setLoading(true);
      await api.post("/admin/createmedecin", newMedecin);
      fetchMedecins();
      setNewMedecin({ name: "", email: "", password: "" });
      alert("✅ Médecin créé avec succès !");
    } catch (err) {
      alert("❌ Erreur création médecin");
    } finally {
      setLoading(false);
    }
  };

  const updateMedecin = async (id, name, email) => {
    try {
      await api.put(`/admin/updatemedecin?id=${id}`, { name, email });
      fetchMedecins();
    } catch {
      alert("❌ Erreur mise à jour médecin");
    }
  };

  const deleteMedecin = async (id) => {
    if (!window.confirm("Supprimer ce médecin ?")) return;
    try {
      await api.delete(`/admin/deletemedecin?id=${id}`);
      fetchMedecins();
    } catch {
      alert("❌ Erreur suppression médecin");
    }
  };

  // ===============================
  // 👥 CRUD PATIENTS
  // ===============================
  const createPatient = async () => {
    try {
      setLoading(true);
      await api.post("/admin/createpatient", newPatient);
      fetchPatients();
      setNewPatient({ name: "", email: "", password: "" });
      alert("✅ Patient créé avec succès !");
    } catch (err) {
      alert("❌ Erreur création patient");
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id, name, email) => {
    try {
      await api.put(`/admin/updatepatient?id=${id}`, { name, email });
      fetchPatients();
    } catch {
      alert("❌ Erreur mise à jour patient");
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Supprimer ce patient ?")) return;
    try {
      await api.delete(`/admin/deletepatient?id=${id}`);
      fetchPatients();
    } catch {
      alert("❌ Erreur suppression patient");
    }
  };

  // ===============================
  // 🖥️ AFFICHAGE
  // ===============================
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🏠 Tableau de bord Administrateur</h1>

      {admin && (
        <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "8px" }}>
          <h2>👤 Profil Admin</h2>
          <p><b>Nom :</b> {admin.name}</p>
          <p><b>Email :</b> {admin.email}</p>
        </div>
      )}

      <hr />

      {/* Gestion Médecins */}
      <section>
        <h2>🩺 Gestion des Médecins</h2>
        <input
          type="text"
          placeholder="Nom"
          value={newMedecin.name}
          onChange={(e) => setNewMedecin({ ...newMedecin, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newMedecin.email}
          onChange={(e) => setNewMedecin({ ...newMedecin, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={newMedecin.password}
          onChange={(e) => setNewMedecin({ ...newMedecin, password: e.target.value })}
        />
        <button onClick={createMedecin} disabled={loading}>➕ Ajouter Médecin</button>

        <ul>
          {medecins.map((m) => (
            <li key={m.id}>
              <b>{m.name}</b> ({m.email})
              <button onClick={() => deleteMedecin(m.id)}>🗑️ Supprimer</button>
              <button
                onClick={() => {
                  const newName = prompt("Nouveau nom :", m.name);
                  const newEmail = prompt("Nouvel email :", m.email);
                  if (newName && newEmail) updateMedecin(m.id, newName, newEmail);
                }}
              >
                ✏️ Modifier
              </button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* Gestion Patients */}
      <section>
        <h2>👥 Gestion des Patients</h2>
        <input
          type="text"
          placeholder="Nom"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newPatient.email}
          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={newPatient.password}
          onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
        />
        <button onClick={createPatient} disabled={loading}>➕ Ajouter Patient</button>

        <ul>
          {patients.map((p) => (
            <li key={p.id}>
              <b>{p.name}</b> ({p.email})
              <button onClick={() => deletePatient(p.id)}>🗑️ Supprimer</button>
              <button
                onClick={() => {
                  const newName = prompt("Nouveau nom :", p.name);
                  const newEmail = prompt("Nouvel email :", p.email);
                  if (newName && newEmail) updatePatient(p.id, newName, newEmail);
                }}
              >
                ✏️ Modifier
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default DashboardAdmin;
