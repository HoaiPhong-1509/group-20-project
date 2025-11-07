const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatarUrl: { type: String, default: '' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

<<<<<<< HEAD
UserSchema.add({
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  avatarUrl: { type: String, default: null },
  avatarPublicId: { type: String, default: null },
});

=======
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (e) {
    next(e);
  }
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

>>>>>>> 9459f33e (finish hd 4)
module.exports = mongoose.model('User', UserSchema);
