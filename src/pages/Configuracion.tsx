import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import {
  FiUser,
  FiSettings,
  FiLock,
  FiBell,
  FiSliders,
  FiChevronRight,
} from "react-icons/fi";

export default function Configuracion() {
  const { user } = useAuth();
  const { settings: systemSettings, updateSetting, saveSettings } = useConfig();
  const [activeTab, setActiveTab] = useState("perfil");
  const [formData, setFormData] = useState({
    nombre: user?.name || "",
    email: user?.email || "",
    telefono: "",
    departamento: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: "perfil", label: "Perfil", icon: <FiUser className="w-5 h-5" /> },
    {
      id: "sistema",
      label: "Sistema",
      icon: <FiSettings className="w-5 h-5" />,
    },
    {
      id: "notificaciones",
      label: "Notificaciones",
      icon: <FiBell className="w-5 h-5" />,
    },
    {
      id: "seguridad",
      label: "Seguridad",
      icon: <FiLock className="w-5 h-5" />,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 mt-2">
          Administra tu perfil, sistema y preferencias
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 font-medium ${
              activeTab === tab.id
                ? "bg-red-50 border-red-600 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-red-200"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm overflow-y-auto scrollbar-red flex-1 min-h-0">
        {/* Perfil */}
        {activeTab === "perfil" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Información del Perfil
              </h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-10 h-10 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+34 666 666 666"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                >
                  <option value="">Seleccionar departamento</option>
                  <option value="produccion">Producción</option>
                  <option value="calidad">Control de Calidad</option>
                  <option value="logistica">Logística</option>
                  <option value="admin">Administración</option>
                </select>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {/* Sistema */}
        {activeTab === "sistema" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Configuración del Sistema
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition">
                <div>
                  <p className="font-medium text-gray-800">Idioma</p>
                  <p className="text-sm text-gray-600">
                    Selecciona tu idioma preferido
                  </p>
                </div>
                <select
                  value={systemSettings.idioma}
                  onChange={(e) => updateSetting("idioma", e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition">
                <div>
                  <p className="font-medium text-gray-800">Tema</p>
                  <p className="text-sm text-gray-600">
                    Apariencia de la interfaz
                  </p>
                </div>
                <select
                  value={systemSettings.tema}
                  onChange={(e) => updateSetting("tema", e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                >
                  <option value="claro">Claro</option>
                  <option value="oscuro">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition">
                <div>
                  <p className="font-medium text-gray-800">Autoguardado</p>
                  <p className="text-sm text-gray-600">
                    Guardar cambios automáticamente
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting("autoguardado", !systemSettings.autoguardado)
                  }
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    systemSettings.autoguardado
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {systemSettings.autoguardado ? "Activado" : "Desactivado"}
                </button>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {/* Notificaciones */}
        {activeTab === "notificaciones" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Preferencias de Notificaciones
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition">
                <div>
                  <p className="font-medium text-gray-800">
                    Notificaciones por Email
                  </p>
                  <p className="text-sm text-gray-600">
                    Recibe alertas en tu correo electrónico
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting(
                      "notificacionesEmail",
                      !systemSettings.notificacionesEmail,
                    )
                  }
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    systemSettings.notificacionesEmail
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {systemSettings.notificacionesEmail ? "Activo" : "Inactivo"}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition">
                <div>
                  <p className="font-medium text-gray-800">
                    Notificaciones Push
                  </p>
                  <p className="text-sm text-gray-600">
                    Recibe notificaciones en tu navegador
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting(
                      "notificacionesPush",
                      !systemSettings.notificacionesPush,
                    )
                  }
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    systemSettings.notificacionesPush
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {systemSettings.notificacionesPush ? "Activo" : "Inactivo"}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition">
                <div>
                  <p className="font-medium text-gray-800">
                    Alertas de pronóstico
                  </p>
                  <p className="text-sm text-gray-600">
                    Recibe reportes automáticos de pérdidas bimestrales a
                    anuales.
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting(
                      "notificacionesForecast",
                      !systemSettings.notificacionesForecast,
                    )
                  }
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    systemSettings.notificacionesForecast
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {systemSettings.notificacionesForecast
                    ? "Activo"
                    : "Inactivo"}
                </button>
              </div>

              <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg bg-white">
                <label className="font-medium text-gray-800">
                  Frecuencia de alertas
                </label>
                <select
                  value={systemSettings.frecuenciaAlertas}
                  onChange={(e) =>
                    updateSetting("frecuenciaAlertas", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                >
                  <option value="bimestral">Bimestral</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg bg-white">
                <label className="font-medium text-gray-800">
                  Modelo de pronóstico
                </label>
                <select
                  value={systemSettings.modeloForecast}
                  onChange={(e) =>
                    updateSetting(
                      "modeloForecast",
                      e.target.value as "simple" | "avanzado",
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                >
                  <option value="simple">Simple</option>
                  <option value="avanzado">Avanzado</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">
                  Elige si quieres el modelo base simple o un pronóstico más
                  sensible.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Nota:</strong> Las notificaciones críticas se enviarán
                siempre, independientemente de estas configuraciones.
              </p>
            </div>

            <button
              onClick={saveSettings}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {/* Seguridad */}
        {activeTab === "seguridad" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Seguridad</h2>

            <div className="space-y-4">
              <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-3 mb-3">
                  <FiLock className="w-5 h-5 text-red-600" />
                  <p className="font-semibold text-gray-800">
                    Cambiar Contraseña
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Actualiza tu contraseña regularmente para mantener tu cuenta
                  segura
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2">
                  Cambiar Contraseña
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FiSliders className="w-5 h-5 text-gray-600" />
                  <p className="font-semibold text-gray-800">
                    Autenticación de Dos Factores
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Añade una capa extra de seguridad a tu cuenta
                </p>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition">
                  Configurar 2FA
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="font-semibold text-gray-800 mb-3">
                  Dispositivos Activos
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Este navegador
                      </p>
                      <p className="text-xs text-gray-600">
                        Última actividad ahora
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded">
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
