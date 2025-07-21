const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");

router.post("/", chatController.chatWithAI);

module.exports = router;
