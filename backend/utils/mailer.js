const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  MAIL_FROM,
} = process.env;

// Build transport options from env with sensible defaults.
const transportOptions = {
  host: SMTP_HOST || 'smtp.gmail.com',
  port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 465,
  secure: typeof SMTP_SECURE !== 'undefined' ? SMTP_SECURE === 'true' : (SMTP_PORT ? parseInt(SMTP_PORT, 10) === 465 : true),
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  // timeouts (ms) to avoid very long hangs
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
};

const transporter = nodemailer.createTransport(transportOptions);

// Verify the transport but treat failures as non-fatal: log a warning and continue.
// In some hosting environments outbound SMTP may be blocked or require specific ports/credentials.
transporter.verify()
  .then(() => console.log('SMTP ready'))
  .catch((err) => console.warn('SMTP verify failed (non-fatal):', err && err.message ? err.message : err));

async function sendMail(to, subject, html) {
  const from = MAIL_FROM || SMTP_USER || 'no-reply@example.com';
  return transporter.sendMail({ from, to, subject, html });
}

module.exports = { transporter, sendMail };