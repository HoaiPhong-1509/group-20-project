const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'token';

module.exports = async function auth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || '');
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};