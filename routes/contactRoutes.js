// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
} = require('../controllers/contactController');

const { sendEmail } = require('../utils/sendEmail');

// ✅ Updated /send route
router.post('/send', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    // 1️⃣ Save message to MongoDB
    const savedMessage = await createMessage(req, res);

    // 2️⃣ Compose HTML email
    const html = `
      <h2>📩 New Contact Message from Portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // 3️⃣ Send notification email
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'engmaalik07@gmail.com',
      subject: `New Message: ${subject || 'Portfolio Contact Form'}`,
      html,
    });

    console.log('📧 Notification email sent successfully.');

    // 4️⃣ Respond to frontend
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: savedMessage,
    });
  } catch (error) {
    console.error('❌ Error in contact route:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

// Other routes (unchanged)
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

module.exports = router;
