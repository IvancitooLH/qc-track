// src/data/types/rechazo.ts
// Tipo espejado del backend — NO modificar sin actualizar el backend también

export type Severity = "low" | "medium" | "high" | "critical";
export type RechazoStatus = "pending" | "resolved" | "closed";

export interface Rechazo {
  id: string;
  item_id: string;
  description: string;
  reason: string;
  severity: Severity;
  date: string;
  responsible_id: string;
  responsible_name?: string;
  status: RechazoStatus;
  created_at: string;
  updated_at: string;
}

// Etiquetas en español para la UI
export const SEVERITY_LABELS: Record<Severity, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const STATUS_LABELS: Record<RechazoStatus, string> = {
  pending: "Pendiente",
  resolved: "Resuelto",
  closed: "Cerrado",
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-50 text-yellow-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700",
};

export const STATUS_COLORS: Record<RechazoStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  resolved: "bg-green-50 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};
