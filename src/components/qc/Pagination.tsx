import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

interface Pagination {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function Pagination({ page, setPage, totalPages }: Pagination) {
  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(totalPages, page + 1));
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Página {page} de {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          className="px-3 py-1 bg-white border rounded text-gray-600 hover:bg-gray-50 text-center"
        >
          <MdNavigateBefore className="text-xl" />
        </button>
        <button
          onClick={next}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-center"
        >
          <MdNavigateNext className="text-xl" />
        </button>
      </div>
    </div>
  );
}
