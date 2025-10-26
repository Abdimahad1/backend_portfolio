// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage
} = require('../controllers/contactController');

const { sendEmail } = require('../utils/sendEmail');

// ✅ Updated /send route
router.post('/send', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  try {
    // Save message in DB using your existing controller function
    await createMessage(req, res);

    // Compose HTML email content
    const html = `
      <h2>📩 New Contact Message from Portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Send email notification
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'engmaalik07@gmail.com',
      subject: `New Message: ${subject || 'Portfolio Contact Form'}`,
      html,
    });

    console.log('📧 Notification email sent successfully.');
  } catch (error) {
    console.error('❌ Error in contact route:', error.message);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

// Other routes (unchanged)
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

module.exports = router;
