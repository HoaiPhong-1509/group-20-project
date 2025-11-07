const nodemailer = require('nodemailer');

const { SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

transporter.verify()
  .then(() => console.log('SMTP ready'))
  .catch((err) => console.error('SMTP verify failed', err));

async function sendMail(to, subject, html) {
  const from = MAIL_FROM || SMTP_USER;
  return transporter.sendMail({ from, to, subject, html });
}

module.exports = { transporter, sendMail };