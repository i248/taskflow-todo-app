const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const queueRoutes = require("./routes/queueRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/tasks", taskRoutes);
app.use("/api/queue", queueRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[Error]", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
  console.log(`🔁 Queue API: http://localhost:${PORT}/api/queue/stats`);
});