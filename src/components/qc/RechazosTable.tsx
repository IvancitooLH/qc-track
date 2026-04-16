import LoadingSpinner from "../common/LoadingSpinner";
import type { Rechazo } from "../../data/types/rechazo";
import {
  SEVERITY_LABELS,
  STATUS_LABELS,
  SEVERITY_COLORS,
  STATUS_COLORS,
} from "../../data/types/rechazo";

interface Props {
  data: Rechazo[];
  loading?: boolean;
}

export default function RechazosTable({ data, loading = false }: Props) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No se encontraron registros.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-transparent rounded-lg">
      <div className="min-w-full shadow overflow-hidden rounded-lg border border-gray-100">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Item ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Razón
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Severidad
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                  {row.item_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-[220px] truncate">
                  {row.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-[180px] truncate">
                  {row.reason}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {row.responsible_name || row.responsible_id}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${SEVERITY_COLORS[row.severity]}`}
                  >
                    {SEVERITY_LABELS[row.severity]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(row.date).toLocaleDateString("es-MX")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}
                  >
                    {STATUS_LABELS[row.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
