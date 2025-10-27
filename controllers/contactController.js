const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../utils/sendEmail');

/**
 * Create a new contact message
 */
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    console.log('📝 Received contact form submission:', { name, email });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields',
      });
    }

    // Save message to database
    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      subject: subject ? subject.trim() : 'No Subject',
      message: message.trim(),
    });

    console.log('💾 Message saved to database:', newMessage._id);

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">📩 New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <p><strong>👤 Name:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>📞 Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>📋 Subject:</strong> ${subject || 'No subject'}</p>
          <p><strong>💬 Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    `;

    // Send email notification
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || process.env.SMTP_USER,
        subject: `New Contact: ${name} - ${subject || 'Portfolio Message'}`,
        html: emailHtml,
      });
      console.log('✅ Notification email sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email sending failed, but message was saved:', emailError.message);
      // Continue - don't fail the request if email fails
    }

    // Success response
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      data: {
        id: newMessage._id,
        name: newMessage.name,
        email: newMessage.email
      }
    });

  } catch (error) {
    console.error('❌ Error in createMessage:', error);
    
    // Specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all contact messages
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: messages.length,
      data: messages 
    });
  } catch (err) {
    console.error('❌ Error in getMessages:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Get single message by ID
 */
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: message 
    });
  } catch (err) {
    console.error('❌ Error in getMessageById:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch message',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Delete a message
 */
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Message deleted successfully',
      data: { id: message._id }
    });
  } catch (err) {
    console.error('❌ Error in deleteMessage:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete message',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};