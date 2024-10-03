// routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/enable-2fa', authMiddleware, authController.enable2FA);
router.post('/verify-2fa', authMiddleware, authController.verify2FA);

module.exports = router;
