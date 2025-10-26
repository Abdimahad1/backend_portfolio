const nodemailer = require('nodemailer');

// Debug logging to verify environment variables
console.log('🔧 SMTP Configuration Check:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  user: process.env.SMTP_USER,
  passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'missing',
  from: process.env.DEFAULT_FROM_EMAIL,
  org: process.env.ORG_NAME
});

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  // Add timeout settings to prevent hanging
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 15000,     // 15 seconds
  greetingTimeout: 5000,    // 5 seconds
  // TLS options for better compatibility
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP Connection failed:', err.message);
    console.error('💡 Troubleshooting tips:');
    console.error('1. Check if Gmail App Password has spaces');
    console.error('2. Verify SMTP settings in environment variables');
    console.error('3. Ensure 2FA is enabled and using App Password');
  } else {
    console.log('✅ SMTP Server ready - Gmail configured successfully');
  }
});

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.ORG_NAME}" <${process.env.DEFAULT_FROM_EMAIL}>`,
      to,
      subject,
      html,
      // Add text version for better compatibility
      text: html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    });
    console.log('📧 Email sent successfully:', info.messageId);
    console.log('👤 Recipient:', to);
    return info;
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
    console.error('🔍 Error details:', {
      code: err.code,
      command: err.command
    });
    throw err;
  }
}

module.exports = { sendEmail, transporter };