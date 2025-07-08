import express from 'express';
import auth from '../middleware/auth.js';
import Exercise from '../models/Exercise.js';
const router = express.Router();

// Add exercise for a specific date
// app.use('/api/exercises', exerciseRoutes);
router.post('', auth, async (req, res) => {
  try {
    // const { userId, date, exerciseType, duration, caloriesBurned } = req.body;
    const userId = req.user._id; // Get user ID from authenticated request(auth)
    console.log(userId, "userId from token, 12 exerciseRouters");
    const {  date, exerciseType, duration, caloriesBurned } = req.body;
    const exercise = new Exercise({
      userId,
      date: date ? new Date(date) : new Date(), // Use provided date or current date/time
      exerciseType,
      duration,
      caloriesBurned
    });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get exercise records for a user (optionally filtered by date range)
// router.get('/api/exercises/:userId', async (req, res) => {
// router.get('/', auth, async (req, res) => {
//   try {
//     const userId = req.user._id; // Get userId from authenticated user
//     console.log(userId, "workout get hit");
//     const { date, startDate, endDate } = req.query;

//     let query = { userId };

//     if (date) {
//       // Filter for a specific day (midnight to midnight)
//       const startOfDay = new Date(date);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(date);
//       endOfDay.setHours(23, 59, 59, 999);
//       query.date = { $gte: startOfDay, $lte: endOfDay };
//     } else if (startDate && endDate) {
//       // Filter by date range
//       query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     } else {
//       // Default: last 24 hours from now
//       const now = new Date();
//       const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
//       query.date = { $gte: last24h, $lte: now };
//     }

//     const exercises = await Exercise.find(query).sort({ date: -1 });
//     res.json(exercises);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/', auth, async (req, res) => {
//   try {
//     const userId = req.user._id; // Get userId from authenticated user
//     console.log(userId, "workout get hit");

//     // Get today's date
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to the beginning of today

//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1); // Set to the beginning of tomorrow

//     // Construct the query to get documents posted today
//     const query = {
//       userId,
//       date: { $gte: today, $lt: tomorrow } // Documents where date is today or later, but before tomorrow
//     };

//     const exercises = await Exercise.find(query).sort({ date: -1 });
//     res.json(exercises);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from authenticated user
        // 1. Get the current date in Solapur (IST)
    const nowInIST = new Date(); // This creates a Date object in your server's local timezone (IST)

    // 2. Calculate the start of "today" in IST
    const startOfTodayIST = new Date(nowInIST);
    startOfTodayIST.setHours(0, 0, 0, 0); // Sets to 00:00:00.000 of the current IST day

    // 3. Calculate the start of "tomorrow" in IST
    const startOfTomorrowIST = new Date(nowInIST);
    startOfTomorrowIST.setDate(startOfTomorrowIST.getDate() + 1);
    startOfTomorrowIST.setHours(0, 0, 0, 0); // Sets to 00:00:00.000 of the next IST day

    // Construct the query to get documents posted today in IST
    const query = {
      userId,
      date: { $gte: startOfTodayIST, $lt: startOfTomorrowIST }
    };
    // console.log(userId, "workout get hit");

    // // 1. Get the current date in Solapur (IST)
    // const nowInIST = new Date(); // This creates a Date object in your server's local timezone (IST)

    // // 2. Calculate the start of "today" in IST
    // const startOfTodayIST = new Date(nowInIST);
    // startOfTodayIST.setHours(0, 0, 0, 0); // Sets to 00:00:00.000 of the current IST day

    // // 3. Calculate the start of "tomorrow" in IST
    // const startOfTomorrowIST = new Date(nowInIST);
    // startOfTomorrowIST.setDate(startOfTomorrowIST.getDate() + 1);
    // startOfTomorrowIST.setHours(0, 0, 0, 0); // Sets to 00:00:00.000 of the next IST day

    // MongoDB stores dates as UTC. When you create a new Date() in Node.js,
    // it's created with the server's local timezone, but when it's saved to MongoDB,
    // it's typically stored as a UTC date.
    // So, 'startOfTodayIST' and 'startOfTomorrowIST' are already Date objects
    // that when used in a MongoDB query, will be correctly compared against the
    // UTC dates stored in the database.
    // Example: If startOfTodayIST is "Jul 4 2025 00:00:00 GMT+0530 (IST)",
    // MongoDB will treat its UTC equivalent "Jul 3 2025 18:30:00 GMT+0000 (UTC)"
    // when comparing with stored UTC dates. This is exactly what we want.

    // Construct the query to get documents posted today in IST
    // const query = {
    //   userId,
    //   date: { $gte: startOfTodayIST, $lt: startOfTomorrowIST }
    // };

    const exercises = await Exercise.find(query).sort({ date: -1 });
    res.json(exercises);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exercise record
router.put('/:id', async (req, res) => {
  try {
    const { exerciseType, duration, caloriesBurned } = req.body;
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise record not found' });
    }

    exercise.exerciseType = exerciseType || exercise.exerciseType;
    exercise.duration = duration || exercise.duration;
    exercise.caloriesBurned = caloriesBurned || exercise.caloriesBurned;
    await exercise.save();
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an exercise record
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise record not found' });

    }
    res.json({ message: 'Exercise record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// calculate total duration
// calculate total calories burned
// router.get('/summary', auth, async (req, res) => {
//   try {
//     const userId = req.user._id; // Get userId from authenticated user
//     const { startDate, endDate } = req.query;
//     const query = { userId };

//     if (startDate && endDate) {
//       query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }

//     const exercises = await Exercise.find(query);
//     // console.log(exercises.length, "exercises in summary");
//     const totalDuration = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
//     const totalCaloriesBurned = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
//     const totalExercises = exercises.length;
//     res.json({ totalDuration, totalCaloriesBurned, totalExercises });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from authenticated user

    // 1. Get the current date in Solapur (IST)
    const nowInIST = new Date(); // This creates a Date object in your server's local timezone (IST)

    // 2. Calculate the start of "today" in IST
    const startOfTodayIST = new Date(nowInIST);
    startOfTodayIST.setHours(0, 0, 0, 0); // Sets to 00:00:00.000 of the current IST day

    // 3. Calculate the start of "tomorrow" in IST
    const startOfTomorrowIST = new Date(nowInIST);
    startOfTomorrowIST.setDate(startOfTomorrowIST.getDate() + 1);
    startOfTomorrowIST.setHours(0, 0, 0, 0); // Sets to 00:00:00.000 of the next IST day

    // Construct the query to get documents posted today in IST
    const query = {
      userId,
      date: { $gte: startOfTodayIST, $lt: startOfTomorrowIST }
    };

    const exercises = await Exercise.find(query);
    // console.log(exercises.length, "exercises in summary"); // This console log is helpful for debugging

    // Calculate summaries based on the filtered exercises
    const totalDuration = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
    const totalCaloriesBurned = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
    const totalExercises = exercises.length;

    res.json({ totalDuration, totalCaloriesBurned, totalExercises });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;