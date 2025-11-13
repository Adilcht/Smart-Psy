import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardAdmin() {
  const [admin, setAdmin] = useState(null);
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newMedecin, setNewMedecin] = useState({ name: "", email: "", password: "" });
  const [newPatient, setNewPatient] = useState({ name: "", email: "", password: "" });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  useEffect(() => {
    if (!token) {
      alert("❌ Token non trouvé. Connectez-vous !");
      return;
    }
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
      alert("❌ Impossible de récupérer le profil admin");
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

  // Création, update, delete Médecin
  const createMedecin = async () => {
    if (!newMedecin.name || !newMedecin.email || !newMedecin.password) return alert("⚠️ Tous les champs sont obligatoires");
    try {
      setLoading(true);
      await api.post("/admin/createmedecin", newMedecin);
      setNewMedecin({ name: "", email: "", password: "" });
      fetchMedecins();
      alert("✅ Médecin créé !");
    } catch (err) { console.error(err); alert("❌ Erreur"); } finally { setLoading(false); }
  };

  const updateMedecin = async (id, name, email) => {
    if (!name || !email) return;
    try { await api.put(`/admin/updatemedecin/${id}`, { name, email }); fetchMedecins(); } catch (err) { console.error(err); }
  };

  const deleteMedecin = async (id) => { if (!window.confirm("Supprimer ce médecin ?")) return; try { await api.delete(`/admin/deletemedecin/${id}`); fetchMedecins(); } catch (err) { console.error(err); } };

  // Création, update, delete Patient
  const createPatient = async () => {
    if (!newPatient.name || !newPatient.email || !newPatient.password) return alert("⚠️ Tous les champs sont obligatoires");
    try {
      setLoading(true);
      await api.post("/admin/createpatient", newPatient);
      setNewPatient({ name: "", email: "", password: "" });
      fetchPatients();
      alert("✅ Patient créé !");
    } catch (err) { console.error(err); alert("❌ Erreur"); } finally { setLoading(false); }
  };

  const updatePatient = async (id, name, email) => { if (!name || !email) return; try { await api.put(`/admin/updatepatient/${id}`, { name, email }); fetchPatients(); } catch (err) { console.error(err); } };
  const deletePatient = async (id) => { if (!window.confirm("Supprimer ce patient ?")) return; try { await api.delete(`/admin/deletepatient/${id}`); fetchPatients(); } catch (err) { console.error(err); } };

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Dashboard Admin</h1>

      {admin && (
        <div style={{ background: "#f2f2f2", padding: 10, borderRadius: 8 }}>
          <h2>👤 Profil Admin</h2>
          <p><b>Nom:</b> {admin.name}</p>
          <p><b>Email:</b> {admin.email}</p>
        </div>
      )}

      <section>
        <h2>🩺 Médecins</h2>
        <input placeholder="Nom" value={newMedecin.name} onChange={e => setNewMedecin({...newMedecin, name:e.target.value})} />
        <input placeholder="Email" value={newMedecin.email} onChange={e => setNewMedecin({...newMedecin, email:e.target.value})} />
        <input type="password" placeholder="Mot de passe" value={newMedecin.password} onChange={e => setNewMedecin({...newMedecin, password:e.target.value})} />
        <button onClick={createMedecin} disabled={loading}>➕ Ajouter Médecin</button>
        <table border="1" cellPadding="5">
          <thead><tr><th>Nom</th><th>Email</th><th>Actions</th></tr></thead>
          <tbody>
            {medecins.map(m => <tr key={m.id}><td>{m.name}</td><td>{m.email}</td>
              <td>
                <button onClick={()=>deleteMedecin(m.id)}>🗑️</button>
                <button onClick={()=>{
                  const newName=prompt("Nom", m.name);
                  const newEmail=prompt("Email", m.email);
                  updateMedecin(m.id, newName, newEmail);
                }}>✏️</button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </section>

      <section>
        <h2>👥 Patients</h2>
        <input placeholder="Nom" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name:e.target.value})} />
        <input placeholder="Email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email:e.target.value})} />
        <input type="password" placeholder="Mot de passe" value={newPatient.password} onChange={e => setNewPatient({...newPatient, password:e.target.value})} />
        <button onClick={createPatient} disabled={loading}>➕ Ajouter Patient</button>
        <table border="1" cellPadding="5">
          <thead><tr><th>Nom</th><th>Email</th><th>Actions</th></tr></thead>
          <tbody>
            {patients.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.email}</td>
              <td>
                <button onClick={()=>deletePatient(p.id)}>🗑️</button>
                <button onClick={()=>{
                  const newName=prompt("Nom", p.name);
                  const newEmail=prompt("Email", p.email);
                  updatePatient(p.id, newName, newEmail);
                }}>✏️</button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default DashboardAdmin;
