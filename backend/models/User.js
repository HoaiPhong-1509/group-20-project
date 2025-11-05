const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
      required: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

UserSchema.add({
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  avatarUrl: { type: String, default: null },
  avatarPublicId: { type: String, default: null },
});

module.exports = mongoose.model('User', UserSchema);
