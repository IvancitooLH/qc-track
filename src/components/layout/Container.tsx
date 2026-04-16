import { Outlet } from "react-router-dom";

function Container() {
  return (
    <div className="h-full w-full bg-slate-50 overflow-hidden">
      <div className="mx-auto flex h-full flex-col px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-red bg-white rounded-lg shadow-md p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Container;
