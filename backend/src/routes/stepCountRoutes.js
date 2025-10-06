import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js'; // Import the User model
import StepCount from '../models/StepCount.js';

const router = express.Router();
// userId, steps, date, target, completed.

// get steps for the authenticated user, filtered by date if provided

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

        const steps = await StepCount.find(query).sort({ date: -1 });

        res.set('Cache-Control', 'no-store'); // Prevent caching
        res.json(steps);

        // res.send("Hello from step count route");


    } catch (error) {
        console.error('Error fetching intakes:', error); // Error log
        res.status(500).json({ error: error.message });
    }

});


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

    const steps = await StepCount.find(query);
    // console.log(steps);
    const totalSteps = steps.reduce((sum, steps) => sum + steps.steps, 0);

    res.json({ totalSteps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const { date, step } = req.body;
    if (!step || step <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (date && isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const steps = new StepCount({
      userId,
      date: date || new Date(), // Default to today if no date provided
      steps: step });
    await steps.save();
    res.status(201).json(steps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;