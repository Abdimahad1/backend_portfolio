const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
} = require('../controllers/contactController');

// Routes
router.post('/send', createMessage);
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

module.exports = router;
