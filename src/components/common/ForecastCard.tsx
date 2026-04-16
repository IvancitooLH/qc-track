import {
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

type Props = {
  title: string;
  value: string;
  description: string;
  risk?: "low" | "medium" | "high";
};

export default function ForecastCard({
  title,
  value,
  description,
  risk = "low",
}: Props) {
  const colorMap = {
    low: {
      bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100",
      border: "border-emerald-200",
      text: "text-emerald-800",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "text-emerald-600",
      glow: "shadow-emerald-100",
      accent: "from-emerald-400 to-emerald-600",
    },
    medium: {
      bg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100",
      border: "border-amber-200",
      text: "text-amber-800",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      icon: "text-amber-600",
      glow: "shadow-amber-100",
      accent: "from-amber-400 to-amber-600",
    },
    high: {
      bg: "bg-gradient-to-br from-rose-50 via-red-50 to-rose-100",
      border: "border-rose-200",
      text: "text-rose-800",
      badge: "bg-rose-100 text-rose-800 border-rose-300",
      icon: "text-rose-600",
      glow: "shadow-rose-100",
      accent: "from-rose-400 to-rose-600",
    },
  };

  const riskIcons = {
    low: <FiCheckCircle className="w-4 h-4" />,
    medium: <FiClock className="w-4 h-4" />,
    high: <FiAlertTriangle className="w-4 h-4" />,
  };

  const riskLabels = {
    low: "Bajo Riesgo",
    medium: "Riesgo Moderado",
    high: "Alto Riesgo",
  };

  const colors = colorMap[risk];

  return (
    <div
      className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 shadow-xl ${colors.glow} hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:-translate-y-1 group cursor-pointer relative overflow-hidden`}
    >
      {/* Decorative background element */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors.accent} opacity-5 rounded-full -translate-y-6 translate-x-6 group-hover:opacity-10 transition-opacity duration-500`}
      ></div>

      <div className="relative z-10">
        {/* Header with risk badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${colors.badge} border`}>
                {riskIcons[risk]}
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {title}
              </span>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.badge} border`}
            >
              {riskIcons[risk]}
              {riskLabels[risk]}
            </div>
          </div>
          <div
            className={`p-2 rounded-xl bg-gradient-to-br ${colors.accent} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
          >
            <FiTrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Value display */}
        <div className="mb-4">
          <p
            className={`text-4xl font-bold ${colors.text} group-hover:scale-110 transition-transform duration-300`}
          >
            {value}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`w-8 h-0.5 bg-gradient-to-r ${colors.accent} rounded-full`}
            ></div>
            <span className="text-xs text-gray-500 font-medium">
              Proyección estimada
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>

        {/* Bottom accent line */}
        <div className="mt-6 flex justify-end">
          <div
            className={`h-1 w-12 bg-gradient-to-r ${colors.accent} rounded-full opacity-60 group-hover:opacity-100 group-hover:w-16 transition-all duration-500`}
          ></div>
        </div>
      </div>
    </div>
  );
}
