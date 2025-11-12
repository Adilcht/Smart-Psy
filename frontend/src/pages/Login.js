import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const user = res.data.user;
      const token = res.data.token;

      // Sauvegarde du token et de l'utilisateur
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Connexion réussie !");

      // Redirection selon le rôle
      const role = user.roles[0]?.name;

      if (role === "admin") {
        navigate("/dashboard-admin");
      } else if (role === "medecin") {
        navigate("/dashboard-medecin");
      } else if (role === "patient") {
        navigate("/dashboard-patient");
      } else {
        alert("Rôle inconnu !");
      }
    } catch (error) {
      console.error(error);
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Connexion</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Se connecter</button>
    </form>
  );
}

export default Login;
