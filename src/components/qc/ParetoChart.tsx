import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  CartesianGrid,
} from "recharts";
import { useMemo, useState, useEffect } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { getToken, API_URL } from "../../context/AuthContext";
import type { Rechazo } from "../../data/types/rechazo";

export default function ParetoChart() {
  const [rechazos, setRechazos] = useState<Rechazo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRechazos = async () => {
      try {
        const res = await fetch(
          `${API_URL}/rechazos?page=1&limit=500&sortBy=date&sortOrder=DESC`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          },
        );

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Error al cargar rechazos");
        }

        setRechazos(json.data ?? []);
      } catch (err) {
        console.error(err);
        setRechazos([]);
      } finally {
        setLoading(false);
      }
    };

    loadRechazos();
  }, []);

  const chartData = useMemo(() => {
    if (rechazos.length === 0) return [];

    // Agrupar por severity y contar
    const counts: Record<string, number> = {};
    rechazos.forEach((r) => {
      counts[r.severity] = (counts[r.severity] || 0) + 1;
    });

    const data = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const total = data.reduce((s, d) => s + d.value, 0);
    let acc = 0;
    return data.map((d) => {
      acc += d.value;
      return { ...d, cumulative: +((acc / total) * 100).toFixed(2) };
    });
  }, [rechazos]);

  if (loading) return <LoadingSpinner />;

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Sin datos para mostrar.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" />
        <Tooltip />
        <Bar yAxisId="left" dataKey="value" fill="#DC2626" name="Cantidad" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cumulative"
          stroke="#374151"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="% Acumulado"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
