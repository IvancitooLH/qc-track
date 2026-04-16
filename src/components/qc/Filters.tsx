import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FiltersModal from "./FiltersModal";
import AddModal from "./AddModal";
import { IoFilterSharp } from "react-icons/io5";
import { RiAddLine } from "react-icons/ri";
import { IoChevronBack } from "react-icons/io5";

type Props = {
  value: {
    itemId: string;
    severity: string;
    status: string;
    scope: "mine" | "all";
    dateFrom: string;
    dateTo: string;
  };
  canViewAll: boolean;
  onChange: (v: {
    itemId: string;
    severity: string;
    status: string;
    scope: "mine" | "all";
    dateFrom: string;
    dateTo: string;
  }) => void;
  onRefresh?: () => void;
};

export default function Filters({
  value,
  canViewAll,
  onChange,
  onRefresh,
}: Props) {
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 flex items-center gap-2"
        >
          <IoChevronBack className="text-2xl" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
          >
            <IoFilterSharp className="text-2xl text-red-100" />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
          >
            <RiAddLine className="text-2xl text-red-100" />
          </button>
        </div>
      </div>

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        value={value}
        canViewAll={canViewAll}
        onChange={onChange}
      />

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={onRefresh} // ← recarga la tabla al crear un rechazo
      />
    </>
  );
}
