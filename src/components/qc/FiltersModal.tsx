type Props = {
  isOpen: boolean;
  onClose: () => void;
  value: {
    itemId: string;
    severity: string;
    status: string;
    scope: "mine" | "all";
    dateFrom: string;
    dateTo: string;
  };
  canViewAll: boolean;
  onChange: (v: {
    itemId: string;
    severity: string;
    status: string;
    scope: "mine" | "all";
    dateFrom: string;
    dateTo: string;
  }) => void;
};

const severities = ["", "low", "medium", "high", "critical"];
const statuses = ["", "pending", "resolved", "closed"];

export default function FiltersModal({
  isOpen,
  onClose,
  value,
  canViewAll,
  onChange,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>

        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                ID o Producto
              </label>
              <input
                type="text"
                value={value.itemId}
                onChange={(e) => onChange({ ...value, itemId: e.target.value })}
                placeholder="Buscar por item"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Desde</label>
              <input
                type="date"
                value={value.dateFrom}
                onChange={(e) =>
                  onChange({ ...value, dateFrom: e.target.value })
                }
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Hasta</label>
              <input
                type="date"
                value={value.dateTo}
                onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Severidad</label>
              <select
                value={value.severity}
                onChange={(e) =>
                  onChange({ ...value, severity: e.target.value })
                }
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="">-- Todas --</option>
                {severities.map((option) => (
                  <option key={option} value={option}>
                    {option || "Todos"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Estado</label>
              <select
                value={value.status}
                onChange={(e) => onChange({ ...value, status: e.target.value })}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="">-- Todos --</option>
                {statuses.map((option) => (
                  <option key={option} value={option}>
                    {option || "Todos"}
                  </option>
                ))}
              </select>
            </div>
            {canViewAll ? (
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Ver</label>
                <select
                  value={value.scope}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      scope: e.target.value as "mine" | "all",
                    })
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option value="all">Todos los rechazos</option>
                  <option value="mine">Solo los míos</option>
                </select>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() =>
              onChange({
                itemId: "",
                severity: "",
                status: "",
                scope: canViewAll ? "all" : "mine",
                dateFrom: "",
                dateTo: "",
              })
            }
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
