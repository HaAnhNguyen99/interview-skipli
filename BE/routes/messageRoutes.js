const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/message");

// Send message
router.post("/messages", sendMessage);

// Get messages
router.get("/messages", getMessages);

module.exports = router;
