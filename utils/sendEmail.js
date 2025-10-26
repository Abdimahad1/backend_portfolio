// utils/sendEmail.js
require('dotenv').config();
const { Resend } = require('resend');

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send an email using Resend
async function sendEmail({ to, subject, html }) {
  try {
    const response = await resend.emails.send({
      // ✅ Use verified sender (Resend default for testing)
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    console.log('✅ Email sent successfully:', response?.data?.id || 'no id');
    return response;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.error('🔍 Full error:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = { sendEmail };
