// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


exports.register = async (req, res) => {
  const { username, email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, email, password, name, });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user_id: user._id, name: user.name, email:user.email, lastLogin: user.lastLogin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, twoFAToken } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    if (user.is2FAEnabled) {
      if (!twoFAToken) return res.status(400).json({ msg: '2FA token required' });

      const isTokenValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFAToken,
      });

      if (!isTokenValid) return res.status(400).json({ msg: 'Invalid 2FA token' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, user_id: user._id, name: user.name, email:user.email, lastLogin: user.lastLogin });
    console.log(user.lastLogin)
    user.lastLogin = new Date();
    await user.save();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.enable2FA = async (req, res) => {
  const user = await User.findById(req.user.id);
  const secret = speakeasy.generateSecret({ length: 20 });

  user.twoFactorSecret = secret.base32;
  await user.save();

  // Generate QR Code
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.ascii,
    label: `MyApp (${user.email})`,
    issuer: 'MyApp',
  });

  const QRCode = require('qrcode');
  QRCode.toDataURL(otpauthUrl, (err, dataURL) => {
    if (err) return res.status(500).json({ msg: 'Error generating QR code' });
    res.json({ qrCode: dataURL, secret: secret.base32 });
  });
};

exports.verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    user.is2FAEnabled = true;
    await user.save();
    res.json({ msg: '2FA enabled successfully' });
  } else {
    res.status(400).json({ msg: 'Invalid token' });
  }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
  
      // Send reset email using Mailtrap
      const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER, 
          pass: process.env.MAILTRAP_PASS,
        },
      });
  
      const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        to: user.email,
        from: 'no-reply@wexa.ai',
        subject: 'Password Reset',
        text: `You are receiving this email because you requested a password reset.\n\n
        Please click the following link to reset your password:\n\n
        ${resetURL}\n\n
        If you did not request this, please ignore this email.`,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ msg: 'Password reset email sent.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired reset token.' });
      }
  
      // Update password
      user.password = newPassword; // The pre-save hook will hash the password
      user.resetPasswordToken = undefined; // Clear reset token
      user.resetPasswordExpires = undefined; // Clear expiration
      await user.save();
  
      res.status(200).json({ msg: 'Password successfully reset.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
