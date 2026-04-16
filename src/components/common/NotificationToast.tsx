type NotificationToastProps = {
  title: string;
  message: string;
  type?: "info" | "warning" | "danger";
  onClose: () => void;
};

const styleMap = {
  info: "bg-white border border-gray-200 text-gray-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
  danger: "bg-red-50 border-red-200 text-red-900",
};

export default function NotificationToast({
  title,
  message,
  type = "info",
  onClose,
}: NotificationToastProps) {
  return (
    <div
      className={`max-w-sm shadow-xl rounded-2xl p-4 w-full ${styleMap[type]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-sm md:text-base">{title}</p>
          <p className="mt-2 text-xs md:text-sm leading-5 text-gray-700">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 rounded-full p-1 transition"
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  );
}
