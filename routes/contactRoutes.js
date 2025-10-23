const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage
} = require('../controllers/contactController');

// Routes
router.post('/send', createMessage);  // Users send message
router.get('/', getMessages);         // Get all messages
router.get('/:id', getMessageById);   // Get single message
router.delete('/:id', deleteMessage); // Delete message

module.exports = router;
