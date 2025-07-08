import express from 'express';
import auth from '../middleware/auth.js';

import User from '../models/User.js'; // Import the User model

const router = express.Router();


router.post('/',auth, async (req, res) => {
  // req.user is populated by the protect middleware
  const userId = req.user._id;

  // The data sent from your frontend handleSubmit
  // console.log(userData) showed:
  // {"age": 11, "bmiValue": "165.9", "gender": "male", "height": "69", "heightUnit": "cm", "mealTimes": {"breakfast": "07:00", "dinner": "19:30", "lunch": "12:00", "snack": "16:30"}, "weight": "79", "weightUnit": "kg"}
  const { age, gender, height, heightUnit, weight, weightUnit, mealTimes } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      // Update basic profile details
      user.age = age || user.age;
      user.gender = gender || user.gender;
      user.height = height || user.height;
      user.heightUnit = heightUnit || user.heightUnit;
      user.weight = weight || user.weight;
      user.weightUnit = weightUnit || user.weightUnit;

      // Update mealTimes (merge or replace completely)
      // This will replace the entire mealTimes object. If you want to merge,
      // you'd do: user.mealTimes = { ...user.mealTimes, ...mealTimes };
      // But based on your console.log, it seems like the entire object is sent.
      user.mealTimes = mealTimes || user.mealTimes;

      // Set setup to true if this endpoint signifies completion of setup
      user.setup = true; // Assuming this means the user completed the initial setup

      const updatedUser = await user.save();

      res.status(200).json({
        message: 'User profile updated successfully',
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          gender: updatedUser.gender,
          age: updatedUser.age,
          height: updatedUser.height,
          heightUnit: updatedUser.heightUnit,
          weight: updatedUser.weight,
          weightUnit: updatedUser.weightUnit,
          mealTimes: updatedUser.mealTimes,
          setup: updatedUser.setup,
          // Add other fields you want to send back
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    res.status(200).json({ message: "BMI setup route is working" });
  } catch (error) {
    console.error("Error in BMI setup route:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});
router.put('/update-health', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const {
      age, height, weight } = req.body;
    console.log("User ID from token:", userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Update user details
    user.age = age || user.age;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    // Save the updated user
    await user.save();
    res.status(200).json({ message: 'User health details updated successfully', user });
  } catch (error) {
    console.error("Error updating user health details:", error);
    res.status(400).json({ error: error.message });
  }
});

// for auth realted for user data collection for bmi setup
router.get("/check-setup",auth, async (req, res) => {
    try {
            const userId  = req.user._id; // get userId from the token

    // const user = await User.findById(userId);   


    // if (!user) return res.status(400).json({ message: "User not found" });
    // res.status(200).json({ setup: user.setup });
    // }

    const user = await User.findById(req.user._id).select('setup');
    console.log("User setup status:", user.setup);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ setup: user.setup });

    }
    catch (error) {
        console.log("Error in check-setup route", error);
        res.status(500).json({ message: "Internal server error" });
    }

});

export default router;



// router.post('', auth, async (req, res) => {
//   try {
//     // const { userId, date, exerciseType, duration, caloriesBurned } = req.body;
//     const userId = req.user._id; // Get user ID from authenticated request(auth)
//     console.log(userId, "userId from token, 12 exerciseRouters");
//     const { gender, age, height, weight } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//     }
//     // Update user details
//      user.gender = gender;
//         user.age = age;
//         user.height = height;
//         user.weight = weight;
//     // Save the updated user
//     await user.save();
//     res.status(200).json({ message: 'User details updated successfully', user });

//   }
//     catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

