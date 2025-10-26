const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
} = require('../controllers/contactController');

// POST /send - just call the controller
router.post('/send', createMessage);

// Other routes
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

module.exports = router;
