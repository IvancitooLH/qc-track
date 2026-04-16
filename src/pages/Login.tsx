// src/pages/Login.tsx — REEMPLAZA el archivo original
// Solo se agrega el Link real a /forgot-password en el botón que ya existía

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Panel izquierdo */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-red-600 items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-700 rounded-full -ml-48 -mb-48 opacity-50" />
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl text-white font-bold text-4xl mb-8 border border-white/20 shadow-2xl">
            QC
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6">
            Optimiza tu Control de Calidad
          </h2>
          <p className="text-red-100 text-lg leading-relaxed">
            Gestiona rechazos, genera reportes en tiempo real y mantén los
            estándares de tu operación en un solo lugar.
          </p>
          <div className="mt-12 space-y-4">
            {[
              "Reportes Automatizados",
              "Seguimiento en Vivo",
              "Seguridad de Datos",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-3 text-red-50 justify-center"
              >
                <FiCheckCircle className="text-white" />
                <span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg shadow-red-200">
              QC
            </div>
            <h1 className="text-2xl font-bold text-gray-800">QC Track</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-gray-500 mt-2">
              Bienvenido de nuevo, ingresa tus datos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm">
                <FiAlertCircle className="shrink-0 text-lg" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 lg:bg-gray-100/50 border border-transparent rounded-2xl focus:ring-2 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">
                  Contraseña
                </label>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 lg:bg-gray-100/50 border border-transparent rounded-2xl focus:ring-2 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              {/* ← Enlace real a recuperación de contraseña */}
              <Link
                to="/forgot-password"
                className="block text-xs font-semibold text-red-600 hover:text-red-700 mt-1"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <FiLoader className="animate-spin" /> : "Entrar ahora"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <a href="#" className="font-bold text-red-600 hover:underline">
              Contacta a soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
