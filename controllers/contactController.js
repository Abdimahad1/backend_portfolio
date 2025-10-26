// controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../utils/sendEmail');

/**
 * Create a new contact message
 * Saves to MongoDB and sends email notification via Resend
 */
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    // Save message to DB
    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Compose HTML email
    const emailHtml = `
      <h2>📩 New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

    // Send notification email using Resend
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'engmaalik07@gmail.com',
      subject: `New Contact Message from ${name}`,
      html: emailHtml,
    });

    console.log('📧 Notification email sent successfully.');

    // Respond to frontend
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('❌ Error in createMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

/**
 * Get all messages
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error('❌ Error in getMessages:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get a single message by ID
 */
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message)
      return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    console.error('❌ Error in getMessageById:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete a message by ID
 */
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message)
      return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error('❌ Error in deleteMessage:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
