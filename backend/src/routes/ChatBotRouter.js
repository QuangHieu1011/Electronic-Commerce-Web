const express = require('express');
const router = express.Router();
const ChatBotController = require('../controllers/ChatBotController');

// POST /api/chatbot/message - Gửi tin nhắn và nhận phản hồi
router.post('/message', ChatBotController.handleMessage);

module.exports = router;
