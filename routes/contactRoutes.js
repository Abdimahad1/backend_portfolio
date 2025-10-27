const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
} = require('../controllers/contactController');

// POST /api/contact/send - Create new contact message
router.post('/send', createMessage);

// GET /api/contact - Get all messages (for admin)
router.get('/', getMessages);

// GET /api/contact/:id - Get single message by ID
router.get('/:id', getMessageById);

// DELETE /api/contact/:id - Delete a message
router.delete('/:id', deleteMessage);

module.exports = router;