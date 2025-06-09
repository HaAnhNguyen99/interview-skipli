const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getAllEmployeesWithMessages,
} = require("../controllers/message");
const { authMiddleware } = require("../middleware/auth");
const { managerOnly } = require("../middleware/role");

// Send message
router.post("/messages", authMiddleware, sendMessage);

// Get messages
router.get("/messages", authMiddleware, getMessages);

// Get all employees with messages
router.get("/messages/employees", authMiddleware, managerOnly, getAllEmployeesWithMessages);

module.exports = router;
