import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardMedecin from "./pages/DashboardMedecin";
import DashboardPatient from "./pages/DashboardPatient";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-medecin" element={<DashboardMedecin />} />
        <Route path="/dashboard-patient" element={<DashboardPatient />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
