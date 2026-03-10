import React, { useState } from "react";

export const AddTaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onAdd(title.trim(), description.trim(), priority);
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-200 shadow-md mb-6">
      <div className="card-body p-4">
        <h2 className="card-title text-base mb-3">➕ Add New Task</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Task title *"
            className={`input input-bordered w-full ${error ? "input-error" : ""}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-error text-xs -mt-2">{error}</p>}

          <input
            type="text"
            placeholder="Description (optional)"
            className="input input-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <select
              className="select select-bordered flex-1"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>

            <button
              className={`btn btn-primary flex-1 ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};