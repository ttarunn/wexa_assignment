// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: new Date() },
  profileImage: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentfriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  activityLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActivityLog' }],
  chatMessages: [{ type: String }],
  role: { type: String, default: 'user' },
  twoFactorSecret: { type: String },
  is2FAEnabled: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
