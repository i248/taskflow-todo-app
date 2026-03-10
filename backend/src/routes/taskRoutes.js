const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const validateTaskBody = (req, res, next) => {
  const { priority } = req.body;
  const validPriorities = ["low", "medium", "high"];

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Priority must be one of: ${validPriorities.join(", ")}`,
    });
  }
  next();
};

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", validateTaskBody, createTask);
router.patch("/:id", validateTaskBody, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;