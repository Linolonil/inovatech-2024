import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Provider para autenticação
import { SensorProvider } from "./context/SensorContext"; // Importando o SensorProvider
import PrivateRoutes from "./routes/PrivateRoutes"; // Componente para rotas privadas

// Importação das páginas
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <SensorProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotas privadas */}
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </SensorProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppRouter;
