// src/pages/ResetPassword.tsx
// Paso 2: El usuario ingresa su nueva contraseña usando el token del email

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FiLock, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { API_URL } from "../context/AuthContext";

type TokenState = "validating" | "valid" | "invalid";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [tokenState, setTokenState] = useState<TokenState>("validating");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validar el token al cargar la página
  useEffect(() => {
    if (!token) {
      setTokenState("invalid");
      return;
    }

    fetch(`${API_URL}/auth/validate-reset-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => setTokenState(data.valid ? "valid" : "invalid"))
      .catch(() => setTokenState("invalid"));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al restablecer");

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // ─── Estados de la página ──────────────────────────────────────────────────

  if (tokenState === "validating") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <FiLoader className="animate-spin text-xl" />
          <span>Verificando enlace...</span>
        </div>
      </div>
    );
  }

  if (tokenState === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Enlace inválido o expirado
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Este enlace ya fue utilizado o expiró. Solicita uno nuevo.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-all"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            ¡Contraseña actualizada!
          </h2>
          <p className="text-gray-500 text-sm">
            Serás redirigido al login en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Nueva contraseña
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Elige una contraseña segura para tu cuenta.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Nueva contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Confirmar contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-100 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              "Guardar nueva contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
