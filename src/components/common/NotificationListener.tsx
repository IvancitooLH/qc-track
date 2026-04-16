import { useEffect, useState, useRef } from "react";
import { useConfig } from "../../context/ConfigContext";
import { getToken, API_URL } from "../../context/AuthContext";
import NotificationToast from "./NotificationToast";

type ForecastResponse = {
  title: string;
  message: string;
  level: "estable" | "moderado" | "alto";
  stats: {
    total: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
};

const intervalMap: Record<string, number> = {
  bimestral: 120000,
  trimestral: 90000,
  semestral: 60000,
  anual: 45000,
};

export default function NotificationListener() {
  const { settings } = useConfig();
  const [notification, setNotification] = useState<ForecastResponse | null>(
    null,
  );
  const timeoutRef = useRef<number | null>(null);

  const fetchForecast = async () => {
    if (!settings.notificacionesForecast) {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const url = new URL(`${API_URL}/notifications/forecast`);
      url.searchParams.set("model", settings.modeloForecast);
      url.searchParams.set(
        "email",
        settings.notificacionesEmail ? "true" : "false",
      );

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as ForecastResponse;
      if (settings.notificacionesPush) {
        setNotification(data);
      }
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    }
  };

  useEffect(() => {
    if (!settings.notificacionesForecast) {
      return;
    }

    fetchForecast();
    const interval = intervalMap[settings.frecuenciaAlertas] ?? 120000;
    if (timeoutRef.current) {
      window.clearInterval(timeoutRef.current);
    }
    timeoutRef.current = window.setInterval(fetchForecast, interval);

    return () => {
      if (timeoutRef.current) {
        window.clearInterval(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.notificacionesForecast,
    settings.frecuenciaAlertas,
    settings.modeloForecast,
    settings.notificacionesEmail,
    settings.notificacionesPush,
  ]);

  if (!notification || !settings.notificacionesPush) {
    return null;
  }

  const toastType =
    notification.level === "alto"
      ? "danger"
      : notification.level === "moderado"
        ? "warning"
        : "info";

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-1rem)] max-w-sm">
      <NotificationToast
        title={notification.title}
        message={notification.message}
        type={toastType}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
