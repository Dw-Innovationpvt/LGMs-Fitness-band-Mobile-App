import express from 'express';
import auth from '../middleware/auth.js';

import User from '../models/User.js'; // Import the User model

const router = express.Router();


router.get('/', auth, async (req, res) => {
  // req.user is populated by the protect middleware
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userObj = user.toObject();
    const { password, ...userWithoutPassword } = userObj;
    res.status(200).json({
    //   message: 'User profile fetched successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/update-profile', auth, async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated request
  const { username, email, bio } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;