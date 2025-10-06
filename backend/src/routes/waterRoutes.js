import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js'; // Import the User model
import WaterIntake from '../models/WaterIntake.js'; // Import the WaterIntake model

const router = express.Router();

// Get water intakes for the authenticated user, filtered by date if provided


router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;
    const query = { userId };

    if (date) {
      const selectedDate = new Date(date);
      if (isNaN(selectedDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const intakes = await WaterIntake.find(query).sort({ date: -1 });
    // console.log('Sorted intakes:', intakes.map(i => ({ _id: i._id, date: i.date }))); // Debug log
    res.set('Cache-Control', 'no-store'); // Prevent caching
    res.json(intakes);
  } catch (error) {
    console.error('Error fetching intakes:', error); // Error log
    res.status(500).json({ error: error.message });
  }
});

// Get total water intake for the authenticated user, filtered by date if provided
router.get("/total", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const { date } = req.query; // Get date from query parameter
    let startOfDay, endOfDay;

    if (date) {
      // Use the provided date
      const selectedDate = new Date(date);
      if (isNaN(selectedDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
    } else {
      // Default to current day if no date is provided
      const now = new Date();
      startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
    }

    const query = {
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    };

    const intakes = await WaterIntake.find(query);
    const totalAmount = intakes.reduce((sum, intake) => sum + intake.amount, 0);

    res.json({ totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the water target for the authenticated user
router.get("/target", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('target');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ target: user.target });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update the water target for the authenticated user
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
      { target },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ target: user.target });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new water intake
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const { date, amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (date && isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const intake = new WaterIntake({
      userId,
      date: date || new Date(), // Default to today if no date provided
      amount,
    });
    await intake.save();
    res.status(201).json(intake);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;



// router.get("/", auth, async (req, res) => {
//   try {
//     const userId = req.user._id; // Get user ID from authenticated request
//     const { date } = req.query; // Get date from query parameter
//     const query = { userId };

//     if (date) {
//       // Filter intakes for the specified date (start and end of day)
//       const selectedDate = new Date(date);
//       if (isNaN(selectedDate)) {
//         return res.status(400).json({ error: 'Invalid date format' });
//       }
//       const startOfDay = new Date(selectedDate);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(selectedDate);
//       endOfDay.setHours(23, 59, 59, 999);
//       query.date = { $gte: startOfDay, $lte: endOfDay };
//     }

//     const intakes = await WaterIntake.find(query).sort({ date: -1 }); // Sort by date descending
//     res.json(intakes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });