import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js'; // Import the User model
// import { getChallenges, updateChallenge, createChallenge, deleteChallenge, getIdChallenges } from '../controllers/trackingChallenges.js';
import WaterIntake from '../models/WaterIntake.js'; // Import the WaterIntake model

const router = express.Router();



router.get("/",auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
//     const { startDate, endDate } = req.query;
//     const query = { userId: req.user._id }; // Get user ID from authenticated request
// s    
//     if (startDate && endDate) {
//       query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }
    
    const intakes = await WaterIntake.find({ userId }).sort({ date: -1 });
    res.json(intakes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// update the water target for the authenticated user
router.put("/target", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const { target } = req.body; // Get the new target from the request body
    if (!target || target <= 0) {
      return res.status(400).json({ error: 'Target must be a positive number' });
    } 
    // Find the user and update the target
    const user = await User.findByIdAndUpdate(
      userId,
      { target }, // Update the target field
      { new: true, runValidators: true } // Return the updated user and validate
    );
    if (!user) {  
      return res.status(404).json({ error: 'User not found' });
    }
    // Return the updated user with the new target
    res.json({ target: user.target });
    // res.json(user.waterTarget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
});

router.get("/target", auth, async (req, res) => {
try {
      // const userId = req.user._id; // Get user ID from authenticated request
    const user = await User.findById(req.user._id).select('target'); // Get the user's water target
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Return the user's water target
    res.json({ target: user.target });
    // res.json(user.waterTarget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 // Get all challenges for the authenticated user
// router.get("/",auth, ); // Get all challenges for the authenticated user
// router.get("/:id", auth, getIdChallenges); // Get a specific challenge by ID (if needed, can be modified to return a single challenge)
// router.post("/", auth, createChallenge); // Create a new challenge
// router.post
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const { date, amount } = req.body;
    // if previous amount exists, add to it
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    // Check if an intake record for the same date already exists
    // const existingIntake = await WaterIntake.findOne({ userId, date: date || new Date() });
    // if (existingIntake) {
    //   // If it exists, update the amount
    //   existingIntake.amount += amount;
    //   await existingIntake.save();
    //   return res.json(existingIntake);
    // }
    const intake = new WaterIntake({
      userId,
      date: date || new Date(), // Default to today if no date provided
      amount
    });
    await intake.save();
    res.status(201).json(intake);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/total", auth, async (req, res) => {
  try{
    const userId = req.user._id; // Get user ID from authenticated request
    // Get today's start and end time
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Query to find all intakes for today
    const query = {
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    };
    
    const intakes = await WaterIntake.find(query);
    const totalAmount = intakes.reduce((sum, intake) => sum + intake.amount, 0);
    
    res.json({ totalAmount });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// router.put("/:id/progress", auth, updateChallenge); // Update challenge progress
// router.put("/:id", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const intake = await WaterIntake.findById(req.params.id);

//     if (!intake) {
//       return res.status(404).json({ error: 'Intake record not found' });
//     }
//     const x = intake.amount || 0; // Ensure amount is initialized
//     intake.amount = Number(amount) + Number(x);
//     if (intake.amount >= intake.target) {
//       intake.completed = true; // Mark as completed if target is reached
//     }
//     await intake.save();
//     res.json(intake);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
// router.delete("/:id", auth, deleteChallenge); // Delete a challenge by ID
// Delete a water intake record
// app.delete('/api/water-intake/:id', async (req, res) => {
//   try {
//     const intake = await WaterIntake.findByIdAndDelete(req.params.id);
//     if (!intake) {
//       return res.status(404).json({ error: 'Intake record not found' });
//     }
//     res.json({ message: 'Intake record deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;