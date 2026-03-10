import React from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskCard } from "./components/TaskCard";
import { AddTaskForm } from "./components/AddTaskForm";
import { FilterBar } from "./components/FilterBar";

export default function App() {
  const {
    tasks,
    loading,
    error,
    deletingIds,
    filters,
    setFilters,
    createTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  return (
    <div className="min-h-screen bg-base-100" data-theme="dark">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">📋 TaskFlow</h1>
          <p className="text-base-content/50 text-sm mt-1">
            Async task manager with queue-based deletion
          </p>
        </div>

        {/* Add Task Form */}
        <AddTaskForm onAdd={createTask} />

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} totalCount={tasks.length} />

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-md">
            <div>
              <p className="font-bold">Connection Error</p>
              <p className="text-sm">{error} — Make sure the backend is running on port 5000</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-base-content/30">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-lg font-semibold">No tasks found</p>
            <p className="text-sm">Add a new task or clear your filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isDeleting={deletingIds.has(task.id)}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-xs text-base-content/30">
          Deletions are processed via async queue (BullMQ-style simulation)
        </div>
      </div>
    </div>
  );
}