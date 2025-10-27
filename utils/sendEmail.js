const nodemailer = require('nodemailer');

console.log('🔧 Checking Email configuration...');
console.log('SMTP User:', process.env.SMTP_USER);
console.log('From email:', process.env.DEFAULT_FROM_EMAIL);

// Create Gmail transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email via Gmail SMTP
 */
async function sendEmail({ to, subject, html }) {
  try {
    console.log('📤 Attempting to send email to:', to);
    
    const mailOptions = {
      from: `${process.env.ORG_NAME} <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully. ID:', result.messageId);
    console.log('📧 Recipient:', to);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
}

// Verify transporter on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server is ready to take our messages');
  }
});

module.exports = { sendEmail };