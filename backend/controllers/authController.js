const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const COOKIE_NAME = 'token';
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required' });
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.trim().toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hash,
    });

    const token = signToken({ sub: user._id.toString() });
    setAuthCookie(res, token);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: 'Email already in use' });
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ sub: user._id.toString() });
    setAuthCookie(res, token);
    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out' });
}

module.exports = { signup, login, logout };