import User from '../models/User.js';

export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({
      wheelOptions: user.wheelOptions,
      activeWheelType: user.activeWheelType,
      activeWheelDiameter: user.wheelOptions[user.activeWheelType]
    });
  } catch (error) {
    console.error('Error getting skate preferences:', error);
    return res.status(500).json({ message: 'Failed to retrieve data.', error: error.message });
  }
};

export const setPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skateType, wheelDiameter, setActive } = req.body;

    if (!skateType || !wheelDiameter) {
      return res.status(400).json({ message: 'Skate type and wheel diameter are required.' });
    }

    // Build update object
    const update = {
      [`wheelOptions.${skateType}`]: wheelDiameter
    };
    if (setActive) {
      update.activeWheelType = skateType;
    }

    // Update the user document
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'Skate preferences successfully updated.',
      data: {
        wheelOptions: user.wheelOptions,
        activeWheelType: user.activeWheelType,
        activeWheelDiameter: user.wheelOptions[user.activeWheelType]
      }
    });
  } catch (error) {
    console.error('Error setting skate preferences:', error);
    return res.status(500).json({ message: 'Failed to set data.', error: error.message });
  }
};

// import User from '../models/User.js';
// // import express from 'express';
// // import auth from '../middleware/auth.js';

// export const getPreferences = async (req, res) => {

//   try {
//         // const userId = req.user._id;
//     // const user = await User.findOne({ userId: req.params.userId });
//     // const user = await User.findOne({ req.user._id });
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: 'Users not found.' });
//     }
//     return res.status(200).json(user.wheelOptions);
//   } catch (error) {
//     console.error('Error getting skate preferences:', error);
//     return res.status(500).json({ message: 'Failed to retrieve data.', error: error.message });
//   }
// };

// export const setPreferences = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { skateType, wheelDiameter } = req.body;

//     if (!skateType || !wheelDiameter) {
//       return res.status(400).json({ message: 'Skate type and wheel diameter are required.' });
//     }

//     // Determine which field to update based on skateType
//     const updateField = skateType === 'inline' ? 'wheelOptions.inline' : 'wheelOptions.quad';

//     // Update the correct field in the user document
//     const user = await User.findOneAndUpdate(
//       { _id: userId },
//       { $set: { [updateField]: wheelDiameter } },
//       { new: true, runValidators: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     return res.status(200).json({
//       message: 'Skate preferences successfully updated.',
//       data: user.wheelOptions
//     });
//   } catch (error) {
//     console.error('Error setting skate preferences:', error);
//     return res.status(500).json({ message: 'Failed to set data.', error: error.message });
//   }
// };

// // export const setPreferences = async (req, res) => {
// //   try {

// //     const { userId } = req.user._id;
// //     const { skateType, wheelDiameter } = req.body;

// //     if (!skateType || !wheelDiameter) {
// //       return res.status(400).json({ message: 'Skate type and wheel diameter are required.' });
// //     }

// //     // Determine which field to update based on skateType
// //     const updateField = skateType === 'inline' ? 'wheelOptions.inline' : 'wheelOptions.quad';

// //     // Update the correct field in the user document
// //     const user = await User.findOneAndUpdate(
// //       { userId: userId },
// //       { $set: { [updateField]: wheelDiameter } },
// //       { new: true, upsert: true, runValidators: true }
// //     );

// //     return res.status(200).json({
// //       message: 'Skate preferences successfully updated.',
// //       data: user.wheelOptions
// //     });
// //   } catch (error) {
// //     console.error('Error setting skate preferences:', error);
// //     return res.status(500).json({ message: 'Failed to set data.', error: error.message });
// //   }
// // };