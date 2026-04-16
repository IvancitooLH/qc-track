import Filters from "../components/qc/Filters";
import RechazosTable from "../components/qc/RechazosTable";
import Pagination from "../components/qc/Pagination";
import { useState, useEffect, useCallback } from "react";
import { getToken, API_URL, useAuth } from "../context/AuthContext";
import type { Rechazo } from "../data/types/rechazo";
import { IoMdRefresh } from "react-icons/io";

const PAGE_SIZE = 6;

type RechazoFilters = {
  itemId: string;
  severity: string;
  status: string;
  scope: "mine" | "all";
  dateFrom: string;
  dateTo: string;
};

const initialFilters: RechazoFilters = {
  itemId: "",
  severity: "",
  status: "",
  scope: "all",
  dateFrom: "",
  dateTo: "",
};

export default function Rechazos() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<RechazoFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Rechazo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canViewAll = user?.role !== "operator";
  const currentScope = canViewAll ? filters.scope : "mine";

  const fetchRechazos = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(PAGE_SIZE),
          sortBy: "date",
          sortOrder: "DESC",
        });

        if (filters.itemId) params.append("item_id", filters.itemId);
        if (filters.severity) params.append("severity", filters.severity);
        if (filters.status) params.append("status", filters.status);
        if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.append("dateTo", filters.dateTo);
        params.append("scope", currentScope);

        const token = getToken();
        if (!token) {
          throw new Error(
            "Sesión expirada. Por favor inicia sesión nuevamente.",
          );
        }

        const res = await fetch(`${API_URL}/rechazos?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Error al cargar rechazos");
        }

        setData(json.data);
        setTotalPages(json.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    },
    [filters, currentScope],
  );

  useEffect(() => {
    fetchRechazos(page);
  }, [page, fetchRechazos]);

  const handleFiltersChange = (newFilters: RechazoFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-red-700">
            Histórico de Rechazos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentScope === "mine"
              ? "Viendo solo tus rechazos"
              : "Viendo todos los rechazos disponibles"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRechazos(1)}
          className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200"
        >
          <IoMdRefresh className="text-xl" />
        </button>
      </div>

      <div className="mb-6">
        <Filters
          value={filters}
          onChange={handleFiltersChange}
          canViewAll={canViewAll}
          onRefresh={() => fetchRechazos(page)}
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <RechazosTable data={data} loading={loading} />
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}
