import { useState } from "react";
import { getToken, API_URL } from "../../context/AuthContext";
import type { Severity } from "../../data/types/rechazo";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess?: () => void;
};

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
];

const EMPTY_FORM = {
  item_id: "",
  description: "",
  reason: "",
  severity: "medium" as Severity,
};

export default function AddModal({ isOpen, onClose, onAddSuccess }: Props) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { item_id, description, reason, severity } = formData;

    if (!item_id.trim() || !description.trim() || !reason.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Sesión expirada. Inicia sesión nuevamente.");
      }

      const res = await fetch(`${API_URL}/rechazos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id, description, reason, severity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Error al crear el rechazo");
      }

      // Éxito
      setFormData(EMPTY_FORM);
      onAddSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Rechazo</h2>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Item ID */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Item ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              placeholder="Ej: ITEM-001"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el defecto encontrado"
              rows={2}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
            />
          </div>

          {/* Razón */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Razón del rechazo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Ej: Falla en control de calidad"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Severidad */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Severidad</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Agregar"
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
