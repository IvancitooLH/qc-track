type Props = {
  title: string;
  message: string;
  type?: "info" | "warning" | "danger";
};

const styleMap = {
  info: "bg-blue-50 border-blue-200 text-blue-700",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  danger: "bg-red-50 border-red-200 text-red-700",
};

export default function NotificationAlert({
  title,
  message,
  type = "info",
}: Props) {
  return (
    <div className={`border-l-4 p-4 rounded-lg shadow-sm ${styleMap[type]}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6">{message}</p>
    </div>
  );
}
