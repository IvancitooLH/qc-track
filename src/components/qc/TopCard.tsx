import { useState, useEffect } from "react";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

type Props = {
  title: string;
  value: string;
  tone?: "red" | "gray" | "green" | "blue";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
};

export default function TopCard({
  title,
  value,
  tone = "red",
  trend = "neutral",
  trendValue,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [animatedValue, setAnimatedValue] = useState("0");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
      let current = 0;
      const increment = numericValue / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current).toString());
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [loading, value]);

  const colorMap = {
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-600",
      accent: "bg-red-500",
    },
    gray: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-700",
      icon: "text-gray-600",
      accent: "bg-gray-500",
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-600",
      accent: "bg-green-500",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-600",
      accent: "bg-blue-500",
    },
  };

  const colors = colorMap[tone];

  const trendIcon = {
    up: <FiTrendingUp className="w-3 h-3" />,
    down: <FiTrendingDown className="w-3 h-3" />,
    neutral: <FiMinus className="w-3 h-3" />,
  };

  const trendColor = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  if (loading) {
    return (
      <div
        className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[140px] flex flex-col items-center justify-center`}
      >
        <div className="w-8 h-8 border-3 border-gray-300 border-t-red-600 rounded-full animate-spin" />
        <p className="mt-3 text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
          <div className={`w-2 h-2 rounded-full ${colors.accent}`}></div>
        </div>
        {trendValue && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColor[trend]}`}
          >
            {trendIcon[trend]}
            {trendValue}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </p>
        <p
          className={`text-3xl font-bold ${colors.text} group-hover:scale-110 transition-transform duration-300`}
        >
          {animatedValue}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          vs período anterior
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <div
          className={`w-12 h-1 ${colors.accent} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}
        ></div>
      </div>
    </div>
  );
}
