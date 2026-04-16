import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface UserSettings {
  idioma: string;
  tema: string;
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  notificacionesForecast: boolean;
  frecuenciaAlertas: string;
  modeloForecast: "simple" | "avanzado";
  autoguardado: boolean;
}

interface ConfigContextType {
  settings: UserSettings;
  updateSetting: (key: keyof UserSettings, value: any) => void;
  saveSettings: () => void;
  loadSettings: () => void;
}

const defaultSettings: UserSettings = {
  idioma: "es",
  tema: "claro",
  notificacionesEmail: true,
  notificacionesPush: false,
  notificacionesForecast: true,
  frecuenciaAlertas: "bimestral",
  modeloForecast: "simple",
  autoguardado: true,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem("userSettings");
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem("userSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (settings.autoguardado) {
      // Save immediately if auto-save is enabled
      setTimeout(() => {
        const newSettings = { ...settings, [key]: value };
        localStorage.setItem("userSettings", JSON.stringify(newSettings));
      }, 0);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettings,
        loadSettings,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
