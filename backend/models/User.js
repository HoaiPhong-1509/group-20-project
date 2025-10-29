const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // cho phép nhiều user không có email mà không vi phạm unique
      index: true,
    },
    // Mật khẩu (hash), không required để không phá vỡ API tạo user hiện tại
    password: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);