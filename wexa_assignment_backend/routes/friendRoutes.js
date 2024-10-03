// routes/friendRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const friendController = require('../controllers/friendController');

const router = express.Router();

router.post('/send-request/:id', authMiddleware, friendController.sendFriendRequest);
router.post('/accept-request/:id', authMiddleware, friendController.acceptFriendRequest);
router.delete('/remove-friend/:id', authMiddleware, friendController.removeFriend);
router.get('/list', authMiddleware, friendController.viewFriends);

module.exports = router;
