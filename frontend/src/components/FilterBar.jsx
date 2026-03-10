import React from "react";

export const FilterBar = ({ filters, onChange, totalCount }) => {
  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          className="input input-bordered w-full pl-10"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* Status tabs + Priority filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="tabs tabs-boxed flex-1">
          {["all", "active", "completed"].map((s) => (
            <button
              key={s}
              className={`tab flex-1 capitalize ${
                filters.status === s ? "tab-active" : ""
              }`}
              onClick={() => onChange({ status: s })}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          className="select select-bordered select-sm"
          value={filters.priority}
          onChange={(e) => onChange({ priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      <p className="text-xs text-base-content/50 text-right">
        {totalCount} task{totalCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
};