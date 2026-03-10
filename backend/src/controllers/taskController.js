const { v4: uuidv4 } = require("uuid");
const { addDeleteJob, hasPendingDeleteJob } = require("../queue/deleteQueue");

let tasks = [
  {
    id: uuidv4(),
    title: "Set up Node.js API server",
    description: "Initialize Express with middleware, CORS, and error handling",
    completed: true,
    priority: "high",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Build React frontend with Tailwind",
    description: "Create task list UI with DaisyUI components and responsive design",
    completed: false,
    priority: "high",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Implement BullMQ queue for async deletes",
    description: "Use array-based queue to simulate background job processing",
    completed: false,
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Add OAuth/JWT authentication",
    description: "Secure endpoints with JWT middleware and refresh tokens",
    completed: false,
    priority: "low",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const pendingDeletion = new Set();

const getAllTasks = (req, res) => {
  try {
    const { status, priority, search } = req.query;

    let filtered = tasks.filter((t) => !pendingDeletion.has(t.id));

    if (status === "completed") filtered = filtered.filter((t) => t.completed);
    if (status === "active") filtered = filtered.filter((t) => !t.completed);
    if (priority) filtered = filtered.filter((t) => t.priority === priority);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, data: filtered, total: filtered.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message });
  }
};

const getTaskById = (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });
  res.json({ success: true, data: task });
};

const createTask = (req, res) => {
  const { title, description, priority = "medium" } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || "",
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json({ success: true, data: task, message: "Task created successfully" });
};

const updateTask = (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);
  if (taskIndex === -1) return res.status(404).json({ success: false, message: "Task not found" });

  const { title, description, completed, priority } = req.body;
  const task = tasks[taskIndex];

  const updated = {
    ...task,
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(completed !== undefined && { completed }),
    ...(priority !== undefined && { priority }),
    updatedAt: new Date().toISOString(),
  };

  tasks[taskIndex] = updated;
  res.json({ success: true, data: updated, message: "Task updated" });
};

const deleteTask = (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  if (hasPendingDeleteJob(req.params.id)) {
    return res.status(409).json({ success: false, message: "Delete already queued for this task" });
  }

  pendingDeletion.add(task.id);
  const job = addDeleteJob(task.id);

  setTimeout(() => {
    tasks = tasks.filter((t) => t.id !== task.id);
    pendingDeletion.delete(task.id);
    console.log(`[Controller] Task ${task.id} permanently deleted`);
  }, 1600);

  res.json({
    success: true,
    message: "Task queued for deletion",
    jobId: job.id,
    taskId: task.id,
  });
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };