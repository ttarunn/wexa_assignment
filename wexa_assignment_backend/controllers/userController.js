// controllers/userController.js
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -twoFactorSecret');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
    const { name, profileImage, email } = req.body;
    console.log('req', req.user.id)
    if (!name && !profileImage && !email) {
      return res.status(400).json({ error: 'At least one field (name, profileImage, email) must be provided to update.' });
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, profileImage, email },
        { new: true, runValidators: true, select: '-password -twoFactorSecret' }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user.id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllUsersExceptCurrent = async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: req.user.id } }).select('-password -twoFactorSecret');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };