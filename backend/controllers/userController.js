// backend/controllers/userController.js
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, height, weight, notificationPreferences } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    
    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      height: updatedUser.height,
      weight: updatedUser.weight,
      notificationPreferences: updatedUser.notificationPreferences
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  updateUserProfile
};