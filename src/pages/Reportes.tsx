import { useEffect, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import RechazosTable from "../components/qc/RechazosTable";
import { getToken, API_URL } from "../context/AuthContext";
import type { Rechazo } from "../data/types/rechazo";

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

export default function Reportes() {
  const [data, setData] = useState<Rechazo[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReportes = async () => {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("Sesión expirada. Por favor inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        const [statsRes, rechazosRes] = await Promise.all([
          fetch(`${API_URL}/rechazos/statistics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `${API_URL}/rechazos?page=1&limit=100&sortBy=date&sortOrder=DESC`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        const statsJson = await statsRes.json();
        const rechazosJson = await rechazosRes.json();

        if (!statsRes.ok) {
          throw new Error(statsJson.error || "Error al cargar estadísticas");
        }
        if (!rechazosRes.ok) {
          throw new Error(rechazosJson.error || "Error al cargar rechazos");
        }

        setStats(statsJson as Statistics);
        setData(rechazosJson.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadReportes();
  }, []);

  const downloadExcel = () => {
    if (!data.length) return;

    const headers = [
      "ID",
      "Item ID",
      "Descripción",
      "Razón",
      "Severidad",
      "Fecha",
      "Responsable",
      "Estado",
    ];

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const rowsHtml = data
      .map((row, index) => {
        const background = index % 2 === 0 ? "#ffffff" : "#f7f7f7";
        return `
          <tr style="background:${background};">
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(row.id)}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(row.item_id)}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(row.description)}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(row.reason)}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(row.severity)}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(new Date(row.date).toLocaleString("es-MX"))}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(row.responsible_id)}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${escapeHtml(row.status)}</td>
          </tr>`;
      })
      .join("\n");

    const html = `<!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" lang="es">
        <head>
          <meta charset="UTF-8" />
          <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Rechazos</x:Name><x:WorksheetOptions><x:Print><x:ValidPrinterInfo/></x:Print></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head>
        <body>
          <table style="border-collapse:collapse;width:100%;font-family:Arial,Helvetica,sans-serif;">
            <thead>
              <tr style="background:#dc2626;color:#ffffff;">
                ${headers
                  .map(
                    (header) =>
                      `<th style="padding:12px 10px;border:1px solid #d1d5db;text-align:left;">${escapeHtml(header)}</th>`,
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>`;

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reportes_rechazos.xls";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const mostFrequentStatus = () => {
    if (!stats) return "--";
    const { pending, resolved, closed } = stats.statusCount;
    if (pending >= resolved && pending >= closed) return "Pendiente";
    if (resolved >= closed) return "Resuelto";
    return "Cerrado";
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
            Reportes de rechazos
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Datos reales guardados desde rechazos
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Esto carga la información registrada en el sistema y muestra
            estadísticas de severidad y estado.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadExcel}
          disabled={!data.length}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiDownload className="w-4 h-4" /> Exportar Excel
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-4 mb-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total de rechazos</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900">
                {stats?.total ?? "--"}
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Críticos</p>
              <p className="mt-3 text-3xl font-semibold text-red-700">
                {stats?.severityCount.critical ?? "--"}
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="mt-3 text-3xl font-semibold text-yellow-600">
                {stats?.statusCount.pending ?? "--"}
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Resueltos</p>
              <p className="mt-3 text-3xl font-semibold text-green-600">
                {stats?.statusCount.resolved ?? "--"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] mb-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Resumen por severidad
                  </h2>
                  <p className="text-sm text-gray-500">
                    Distribución de rechazos según gravedad.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                  Actualizado ahora
                </span>
              </div>
              <div className="space-y-4">
                {stats ? (
                  [
                    {
                      label: "Baja",
                      value: stats.severityCount.low,
                      color: "bg-green-100 text-green-700",
                    },
                    {
                      label: "Media",
                      value: stats.severityCount.medium,
                      color: "bg-yellow-100 text-yellow-800",
                    },
                    {
                      label: "Alta",
                      value: stats.severityCount.high,
                      color: "bg-orange-100 text-orange-700",
                    },
                    {
                      label: "Crítica",
                      value: stats.severityCount.critical,
                      color: "bg-red-100 text-red-700",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-gray-100 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-gray-600">
                          {item.label}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}
                        >
                          {item.value}
                        </span>
                      </div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-red-600"
                          style={{
                            width: `${Math.min(100, stats.total ? (item.value / stats.total) * 100 : 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Cargando estadísticas...
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles rápidos
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Registros visibles</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {data.length}
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Estado más frecuente</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {mostFrequentStatus()}
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Último rechazo</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {data.length
                      ? new Date(data[0].date).toLocaleDateString("es-MX")
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Rechazos recientes
                </h2>
                <p className="text-sm text-gray-500">
                  Últimos rechazos registrados en el sistema.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-600">
                <FiFileText className="w-4 h-4" /> {data.length} registros
              </div>
            </div>
            <RechazosTable data={data} loading={loading} />
          </div>
        </>
      )}
    </div>
  );
}
