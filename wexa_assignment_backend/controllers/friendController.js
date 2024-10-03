// controllers/friendController.js
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

exports.sendFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);

    if (!friend) return res.status(404).json({ msg: 'User not found' });
    if (user.friends.includes(friend._id)) return res.status(400).json({ msg: 'Already friends' });
    if (friend.friendRequests.includes(user._id)) return res.status(400).json({ msg: 'Friend request already sent' });

    friend.friendRequests.push(user._id);
    user.sentfriendRequests.push(friend._id)
    await friend.save();
    await user.save();
    const log = new ActivityLog({ user: user._id, action: `Sent a friend request to ${friend.username}` });
    await log.save();

    res.status(200).json({ msg: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const requester = await User.findById(req.params.id);

    if (!requester) return res.status(404).json({ msg: 'User not found' });

    if (user.friendRequests.includes(requester._id)) {
      user.friends.push(requester._id);
      requester.friends.push(user._id);

      user.friendRequests = user.friendRequests.filter(
        (id) => id.toString() !== requester._id.toString()
      );

      await user.save();
      await requester.save();

      // Log activity
      const log = new ActivityLog({ user: user._id, action: `Accepted friend request from ${requester.username}` });
      await log.save();

      res.status(200).json({ msg: 'Friend request accepted' });
    } else {
      res.status(400).json({ msg: 'No such friend request' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);

    if (!friend) return res.status(404).json({ msg: 'User not found' });

    if (user.friends.includes(friend._id)) {
      user.friends = user.friends.filter(
        (id) => id.toString() !== friend._id.toString()
      );
      friend.friends = friend.friends.filter(
        (id) => id.toString() !== user._id.toString()
      );

      await user.save();
      await friend.save();

      // Log activity
      const log = new ActivityLog({ user: user._id, action: `Removed ${friend.username} from friends` });
      await log.save();

      res.status(200).json({ msg: 'Friend removed' });
    } else {
      res.status(400).json({ msg: 'Not friends' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.viewFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username email profileImage');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
