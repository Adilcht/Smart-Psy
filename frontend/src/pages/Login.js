import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

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

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const { email, password } = formData;
      
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const user = res.data.user;
      const token = res.data.token;

      // Sauvegarde du token et de l'utilisateur
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      if (setUser) {
        setUser(user);
      }

      // Redirection selon le rôle
      const role = user.roles[0]?.name;
      const routes = {
        'admin': '/dashboard-admin',
        'medecin': '/dashboard-medecin',
        'patient': '/dashboard-patient'
      };
      
      navigate(routes[role] || '/dashboard');
      
    } catch (error) {
      console.error(error);
      alert("Email ou mot de passe incorrect !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <AnimatedBubbles />
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">🧠</div>
            <h1>Smart Psy</h1>
          </div>
          <h2>Content de vous revoir</h2>
          <p>Connectez-vous à votre compte pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <span>Se connecter</span>
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Pas encore de compte ?{" "}
            <Link to="/register" className="auth-link">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;