const nodemailer = require('nodemailer');

const createTransport = () => {
  if (!process.env.EMAIL_HOST) {
    console.warn('Email transport not configured. Emails will be skipped.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT || 587) === 465,
    auth: process.env.EMAIL_USER
      ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      : undefined
  });
};

const transport = createTransport();

const sendMail = async ({ to, subject, text, html }) => {
  if (!transport) return;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
};

const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const subject = 'Password reset instructions';
  const text = `You requested a password reset.\n\nUse the link below within the next hour:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;
  const html = `<p>You requested a password reset.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this email.</p>`;
  await sendMail({ to, subject, text, html });
};

module.exports = { sendMail, sendPasswordResetEmail };