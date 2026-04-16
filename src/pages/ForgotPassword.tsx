// src/pages/ForgotPassword.tsx
// Paso 1: El usuario ingresa su email para solicitar el enlace

import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiLoader, FiCheckCircle } from "react-icons/fi";
import { API_URL } from "../context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error ?? "Error al procesar la solicitud");

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Correo enviado
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Si el correo <strong>{email}</strong> está registrado, recibirás un
            enlace de recuperación. Revisa tu bandeja de entrada o spam.
          </p>
          <Link
            to="/login"
            className="text-red-600 font-semibold text-sm hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <FiArrowLeft /> Volver al login
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Ingresa tu email y te enviaremos un enlace para restablecerla.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Correo electrónico
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
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
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
