import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiMail,
  FiLogOut,
  FiSettings,
  FiBarChart,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", label: "Inicio", icon: <FiHome className="w-5 h-5" /> },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <FiBarChart className="w-5 h-5" />,
  },
  { to: "/rechazos", label: "Rechazos", icon: <FiInfo className="w-5 h-5" /> },
  { to: "/reportes", label: "Reportes", icon: <FiMail className="w-5 h-5" /> },
  {
    to: "/configuracion",
    label: "Configuración",
    icon: <FiSettings className="w-5 h-5" />,
  },
];

function SideBar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-3 fixed top-4 left-4 z-50 lg:hidden bg-white rounded-md shadow-md text-red-600 border border-red-50"
          aria-label="Abrir menú"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-0 left-0 h-screen z-50 bg-white border-r border-red-50 transition-all duration-300 ease-in-out group
          ${open ? "w-64 translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:h-auto ${open || hovered ? "lg:w-64" : "lg:w-20"}`}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center h-16 px-4 border-b border-red-50">
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold shadow-lg shadow-red-200">
              QC
            </div>
            <span
              className={`text-red-600 font-bold text-xl transition-opacity duration-300 ${open || hovered ? "opacity-100" : "opacity-0"}`}
            >
              QC Track
            </span>
          </div>

          <button
            className="ml-auto lg:hidden text-red-600"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="mt-6 px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center h-12 rounded-xl transition-all duration-200 overflow-hidden ${isActive ? "bg-red-50 text-red-700" : "text-gray-500 hover:bg-red-50/50 hover:text-red-600"}`
              }
              onClick={() => setOpen(false)}
            >
              {/* Icon container */}
              <div className="w-14 flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={`font-medium whitespace-nowrap transition-opacity duration-300 ${open || hovered ? "opacity-100" : "opacity-0"}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* User info and Logout */}
        <div className="absolute bottom-6 left-0 w-full px-3 space-y-3">
          {/* User info */}
          {user && (
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-xl bg-red-50 transition-opacity duration-300 ${open || hovered ? "opacity-100" : "opacity-0"}`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full h-12 rounded-xl text-gray-500 hover:bg-red-600 hover:text-white transition-all duration-200 overflow-hidden"
          >
            <div className="w-14 flex-shrink-0 flex items-center justify-center">
              <FiLogOut className="w-5 h-5" />
            </div>
            <span
              className={`font-medium whitespace-nowrap transition-opacity duration-300 ${open || hovered ? "opacity-100" : "opacity-0"}`}
            >
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
