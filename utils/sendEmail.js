// utils/email.js
require('dotenv').config();
const { Resend } = require('resend');

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send an email using Resend
async function sendEmail({ to, subject, html }) {
  try {
    const data = await resend.emails.send({
      from: `${process.env.ORG_NAME} <${process.env.DEFAULT_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.error('🔍 Full error:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = { sendEmail };
