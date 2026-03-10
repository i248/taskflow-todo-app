import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export const taskService = {
  getAll: async (params) => {
    const { data } = await api.get("/tasks", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post("/tasks", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },
};

export const queueService = {
  getStats: async () => {
    const { data } = await api.get("/queue/stats");
    return data;
  },
};