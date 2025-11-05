const crypto = require('crypto');

const DEFAULT_EXPIRY_MINUTES = Number(process.env.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES || 60);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expires = new Date(Date.now() + DEFAULT_EXPIRY_MINUTES * 60 * 1000);

  return { token, tokenHash, expires };
};

module.exports = { generateResetToken, hashToken };