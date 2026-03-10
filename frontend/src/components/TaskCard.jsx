import React from "react";

const PRIORITY_BADGE = {
  high: "badge-error",
  medium: "badge-warning",
  low: "badge-success",
};

export const TaskCard = ({ task, isDeleting, onToggle, onDelete }) => {
  return (
    <div
      className={`card bg-base-200 shadow-sm transition-all duration-500 ${
        isDeleting ? "opacity-40 scale-95 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="card-body p-4 gap-2">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            className="checkbox checkbox-primary mt-1 shrink-0"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold text-base leading-snug ${
                task.completed
                  ? "line-through text-base-content/40"
                  : "text-base-content"
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-base-content/60 mt-1 truncate">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge badge-sm ${PRIORITY_BADGE[task.priority]}`}>
                {task.priority}
              </span>
              <span className="text-xs text-base-content/40">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Delete Button */}
          <button
            className={`btn btn-ghost btn-sm btn-square text-error ${
              isDeleting ? "loading" : ""
            }`}
            onClick={() => onDelete(task.id)}
            disabled={isDeleting}
            title="Delete task"
          >
            {!isDeleting && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};