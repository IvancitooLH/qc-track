export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Cargando...</p>
      </div>
    </div>
  );
}
