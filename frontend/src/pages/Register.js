import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, password_confirmation } = formData;

    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
        password_confirmation,
      });

      console.log(response.data);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');

      // 🔁 Redirige vers la page de login
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Créer un compte</h1>
      <input
        type="text"
        placeholder="Nom complet"
        name="name"
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        name="password"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        name="password_confirmation"
        onChange={handleChange}
      />
      <button type="submit">S'inscrire</button>
    </form>
  );
}

export default Register;
