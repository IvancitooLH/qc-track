// src/App.tsx — REEMPLAZA el archivo original

import SideBar from "./components/layout/SideBar";
import Container from "./components/layout/Container";
import { Routes, Route } from "react-router-dom";
import Rechazos from "./pages/Rechazos";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import NotificationListener from "./components/common/NotificationListener";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Rutas públicas: login, recuperación de contraseña
  if (!isAuthenticated) {
    return (
      <div className="h-screen overflow-hidden bg-gray-100">
        <div className="h-full w-full overflow-y-auto">
          <Routes>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider>
      <div className="flex h-screen overflow-hidden">
        <SideBar />
        <main className="flex-1 h-screen overflow-hidden bg-gray-100">
          <Routes>
            <Route path="/" element={<Container />}>
              <Route index element={<Inicio />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="rechazos" element={<Rechazos />} />
              <Route path="reportes" element={<Reportes />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
      <NotificationListener />
    </ConfigProvider>
  );
}

export default App;
