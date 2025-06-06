const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/auth");
const { managerOnly } = require("../middleware/role");

// Create a new task
router.post(
  "/create-task",
  authMiddleware,
  managerOnly,
  taskController.createTask
);

// Update a task
router.put(
  "/update-task/:taskId",
  authMiddleware,
  managerOnly,
  taskController.updateTask
);

// Delete a task
router.delete(
  "/delete-task/:taskId",
  authMiddleware,
  managerOnly,
  taskController.deleteTask
);

// Get all tasks
router.get("/get-tasks", authMiddleware, managerOnly, taskController.getTasks);

// Get a task
router.get(
  "/get-task/:taskId",
  authMiddleware,
  managerOnly,
  taskController.getTask
);

// Create a new task
router.post(
  "/create-task",
  authMiddleware,
  managerOnly,
  taskController.createTask
);

// Get employee dashboard
router.get(
  "/task-dashboard/:employeeId",
  authMiddleware,
  taskController.getEmployeeDashboard
);

// Update task status
router.put(
  "/task-dashboard/:taskId",
  authMiddleware,
  taskController.updateTaskStatus
);
module.exports = router;
