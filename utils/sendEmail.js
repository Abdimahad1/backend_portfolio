const { Resend } = require('resend');

console.log('🔧 Checking Resend configuration...');
console.log('API Key present:', !!process.env.RESEND_API_KEY);
console.log('From email:', process.env.DEFAULT_FROM_EMAIL);

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email via Resend
 */
async function sendEmail({ to, subject, html }) {
  try {
    console.log('📤 Attempting to send email to:', to);
    
    const { data, error } = await resend.emails.send({
      from: `${process.env.ORG_NAME} <${process.env.DEFAULT_FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log('✅ Email sent successfully. ID:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
}

module.exports = { sendEmail };