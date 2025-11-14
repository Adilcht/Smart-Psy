import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const AnimatedBubbles = () => {
  return (
    <div className="bubbles-container">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="bubble" 
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            width: `${20 + Math.random() * 60}px`,
            height: `${20 + Math.random() * 60}px`,
          }}
        />
      ))}
    </div>
  );
};

const InputField = ({ type, placeholder, value, onChange, name, icon }) => {
  return (
    <div className="input-group">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className="auth-input"
        required
      />
    </div>
  );
};

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { name, email, password, password_confirmation } = formData;
      
      // Validation des mots de passe
      if (password !== password_confirmation) {
        alert("Les mots de passe ne correspondent pas !");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères !");
        setIsLoading(false);
        return;
      }

      await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
        password_confirmation,
      });

      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
      
    } catch (error) {
      console.error(error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join('\n');
        alert(`Erreur lors de l'inscription:\n${errorMessage}`);
      } else {
        alert("Erreur lors de l'inscription. Vérifiez vos informations.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <AnimatedBubbles />
      
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <div className="logo-icon">🧠</div>
            <h1>Smart Psy</h1>
          </div>
          <h2>Créer votre compte</h2>
          <p>Rejoignez Smart Psy et prenez soin de votre santé mentale</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <InputField
            type="text"
            placeholder="Nom complet"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon="👤"
          />
          
          <InputField
            type="email"
            placeholder="Adresse email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon="✉️"
          />
          
          <InputField
            type="password"
            placeholder="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon="🔒"
          />
          
          <InputField
            type="password"
            placeholder="Confirmer le mot de passe"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            icon="✅"
          />

          <div className="password-requirements">
            <p>Le mot de passe doit contenir au moins 6 caractères</p>
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <span>S'inscrire</span>
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Déjà un compte ?{" "}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <p>Vos données sont sécurisées et confidentielles</p>
        </div>
      </div>
    </div>
  );
}

export default Register;