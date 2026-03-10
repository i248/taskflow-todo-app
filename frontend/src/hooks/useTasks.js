import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [filters, setFiltersState] = useState({
    status: "all",
    priority: "",
    search: "",
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.status !== "all") params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const res = await taskService.getAll(params);
      setTasks(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const setFilters = (f) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  };

  const createTask = async (title, description, priority) => {
    const res = await taskService.create({ title, description, priority });
    setTasks((prev) => [res.data, ...prev]);
  };

  const toggleTask = async (id, completed) => {
    const res = await taskService.update(id, { completed });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await taskService.delete(id);
      setTimeout(() => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 1700);
    } catch (err) {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    deletingIds,
    filters,
    setFilters,
    createTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
}