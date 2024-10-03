// routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile-update', authMiddleware, userController.updateProfile);
router.get('/activity-logs', authMiddleware, userController.getActivityLogs);
router.get('/get-users', authMiddleware, userController.getAllUsersExceptCurrent);

module.exports = router;
