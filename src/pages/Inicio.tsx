import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Inicio() {
  const { user } = useAuth();
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    return () => clearInterval(interval); // limpiar pa que no se acumulen
  }, []);

  return (
    <div className="p-6 justify-center items-center flex flex-col h-full text-6xl font-semibold">
      <h1 className="font-semibold text-black">
        Bienvenido{" "}
        <span className="text-red-600">{user?.name ?? "Usuario"}</span>
      </h1>

      <p className="mt-4 text-2xl text-gray-600">
        {fechaHora.toLocaleDateString()} {fechaHora.toLocaleTimeString()}
      </p>
    </div>
  );
}
