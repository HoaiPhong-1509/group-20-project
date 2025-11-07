const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, role: role || 'user' });
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

async function me(req, res) {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || '',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email });
    // Trả về 200 ngay cả khi không tồn tại để tránh dò email
    if (!user) return res.status(200).json({ message: 'Reset initiated' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 phút
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset?token=${token}`;
    const html = `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#222">
        <p>Chào ${user.name || 'bạn'},</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào liên kết dưới đây để đặt lại:</p>
        <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>Liên kết có hiệu lực trong 30 phút.</p>
        <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      </div>
    `;
    await sendMail(email, 'Đặt lại mật khẩu', html);

    res.json({ message: 'Reset initiated' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

async function logout(_req, res) {
  res.json({ message: 'Logged out' });
}

module.exports = {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
  logout,
};