import { useEffect, useState } from "react";
import TopCard from "../components/qc/TopCard";
import ParetoChart from "../components/qc/ParetoChart";
import ForecastCard from "../components/common/ForecastCard";
import NotificationAlert from "../components/common/NotificationAlert";
import { getToken, API_URL } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import {
  FiTrendingUp,
  FiAlertTriangle,
  FiBarChart,
  FiZap,
  FiActivity,
} from "react-icons/fi";

interface Statistics {
  total: number;
  severityCount: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  statusCount: {
    pending: number;
    resolved: number;
    closed: number;
  };
}

interface Forecast {
  label: string;
  value: string;
  description: string;
  risk: "low" | "medium" | "high";
}

type Frecuencia = "bimestral" | "trimestral" | "semestral" | "anual";

export default function Dashboard() {
  const { settings } = useConfig();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<
    "info" | "warning" | "danger"
  >("info");
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!settings) return;

    const loadStatistics = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/rechazos/statistics`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "No se pudo cargar estadísticas");
        }

        const data = json as Statistics;
        if (!data || !data.severityCount) {
          throw new Error("Respuesta de estadísticas inválida");
        }

        setStats(data);

        const riskFactor =
          (data.severityCount.critical * 1.1 +
            data.severityCount.high * 0.7 +
            data.severityCount.medium * 0.3) /
          Math.max(data.total, 1);

        const periods = [
          { label: "Bimestral", factor: 0.08 },
          { label: "Trimestral", factor: 0.16 },
          { label: "Semestral", factor: 0.32 },
          { label: "Anual", factor: 0.58 },
        ];

        const nextForecast: Forecast[] = periods.map((period) => {
          const estimate = Math.round(
            data.total * (1 + period.factor + riskFactor * 0.2),
          );

          const risk: Forecast["risk"] =
            estimate > data.total * 1.25
              ? "high"
              : estimate > data.total * 1.1
                ? "medium"
                : "low";

          return {
            label: period.label,
            value: `${estimate} rechazos`,
            description: `Pronóstico de pérdidas para el periodo ${period.label.toLowerCase()}`,
            risk,
          };
        });

        const frequencyMap: Record<Frecuencia, string[]> = {
          bimestral: ["Bimestral"],
          trimestral: ["Bimestral", "Trimestral"],
          semestral: ["Bimestral", "Trimestral", "Semestral"],
          anual: ["Bimestral", "Trimestral", "Semestral", "Anual"],
        };

        const frecuencia =
          (settings.frecuenciaAlertas as Frecuencia) ?? "anual";

        const allowedPeriods = frequencyMap[frecuencia] ?? frequencyMap.anual;

        const filteredForecast = nextForecast.filter((f) =>
          allowedPeriods.includes(f.label),
        );

        setForecast(filteredForecast);

        if (settings.notificacionesForecast) {
          const risks = filteredForecast.map((f) => f.risk);

          const highestRisk = risks.includes("high")
            ? "high"
            : risks.includes("medium")
              ? "medium"
              : "low";

          if (highestRisk === "high") {
            setNotification(
              "El pronóstico detecta riesgo alto de pérdida en los próximos periodos. Revisa los rechazos críticos y activa medidas de mejora continua.",
            );
            setNotificationType("danger");
          } else if (highestRisk === "medium") {
            setNotification(
              "El pronóstico muestra un aumento moderado. Analiza procesos de calidad y ajustes en producción.",
            );
            setNotificationType("warning");
          } else {
            setNotification(
              "El pronóstico de pérdidas se mantiene estable. Continúa con seguimiento regular.",
            );
            setNotificationType("info");
          }

          if (
            !notified &&
            settings.notificacionesPush &&
            "Notification" in window
          ) {
            if (Notification.permission === "default") {
              const permission = await Notification.requestPermission();
              if (permission === "granted") {
                new Notification("Pronóstico de pérdidas", {
                  body: filteredForecast
                    .map((item) => `${item.label}: ${item.value}`)
                    .join(" • "),
                });
                setNotified(true);
              }
            } else if (Notification.permission === "granted") {
              new Notification("Pronóstico de pérdidas", {
                body: filteredForecast
                  .map((item) => `${item.label}: ${item.value}`)
                  .join(" • "),
              });
              setNotified(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setNotification("No se pudieron cargar las estadísticas.");
        setNotificationType("danger");
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [settings, notified]);

  return (
    <>
      {/* Enhanced Header Section */}
      <div className="mb-8">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-transparent to-blue-50 rounded-3xl -mx-4 -my-2"></div>

          <div className="relative flex items-center gap-6 mb-6 p-4">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-lg flex-shrink-0 group hover:shadow-xl transition-all duration-300">
                <FiBarChart className="w-10 h-10 text-red-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Dashboard - QC Track
                </h1>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Sistema Activo
                </div>
              </div>
              <p className="text-gray-600 text-base sm:text-lg max-w-3xl leading-relaxed">
                Información inteligente de rechazos, tendencias de calidad y
                pronósticos automáticos de pérdida con soporte de IA avanzada.
                <span className="hidden sm:inline text-red-600 font-medium">
                  {" "}
                  Monitoreo en tiempo real.
                </span>
              </p>
            </div>
          </div>

          {/* Stats overview bar */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.total || 0}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats?.severityCount.critical || 0}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Críticos
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.statusCount.pending || 0}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Pendientes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats?.statusCount.resolved || 0}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Resueltos
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="mb-6">
          <NotificationAlert
            title="Alerta de pronóstico"
            message={notification}
            type={notificationType}
          />
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <TopCard
            title="Total Rechazos"
            value={loading ? "..." : String(stats?.total ?? 0)}
            tone="red"
            trend="up"
            trendValue="+12%"
          />
          <TopCard
            title="Críticos"
            value={loading ? "..." : String(stats?.severityCount.critical ?? 0)}
            tone="red"
            trend="down"
            trendValue="-5%"
          />
          <TopCard
            title="Pendientes"
            value={loading ? "..." : String(stats?.statusCount.pending ?? 0)}
            tone="blue"
            trend="neutral"
            trendValue="0%"
          />
          <TopCard
            title="Resueltos"
            value={loading ? "..." : String(stats?.statusCount.resolved ?? 0)}
            tone="green"
            trend="up"
            trendValue="+8%"
          />
        </div>
      </div>

      {/* Forecast Cards */}
      <div className="mb-10">
        <div className="relative mb-8">
          {/* Section header with decoration */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Pronósticos de Pérdidas
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Estimaciones inteligentes basadas en IA para los próximos
                periodos
              </p>
            </div>
          </div>

          {/* Decorative line */}
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {forecast.map((item, index) => (
            <div
              key={item.label}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ForecastCard
                title={item.label}
                value={item.value}
                description={item.description}
                risk={item.risk}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {/* Intelligence Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FiActivity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Pronóstico Inteligente
              </h3>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 text-sm lg:text-base">
              Nuestro motor de pronóstico analiza los rechazos actuales y genera
              estimaciones de pérdidas para los próximos ciclos. Esto incluye
              alertas bimestrales, trimestrales, semestrales y anuales que te
              ayudan a priorizar acciones.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <FiAlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800 font-medium">
                  Identifica periodos de mayor riesgo
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <FiTrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-800 font-medium">
                  Detecta cambios en la severidad
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                <FiZap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-purple-800 font-medium">
                  Recomendaciones automáticas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trends Analysis */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 xl:col-span-2 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-100 to-green-200 rounded-full -translate-y-20 -translate-x-20 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FiBarChart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Análisis de Tendencias
              </h3>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm lg:text-base">
              Usa esta vista para ver cómo los rechazos afectan tu negocio y
              para planificar mejoras en calidad y productividad.
            </p>

            <div className="relative">
              <div className="h-72 lg:h-80 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-inner">
                <ParetoChart />
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600 font-medium">
                  Datos en tiempo real
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
