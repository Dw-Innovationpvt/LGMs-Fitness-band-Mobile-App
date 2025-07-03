import express from 'express';
import auth from '../middleware/auth.js';
import Exercise from '../models/Exercise.js';
const router = express.Router();

// Add exercise for a specific date
// app.use('/api/exercises', exerciseRoutes);
router.post('', async (req, res) => {
  try {
    const { userId, date, exerciseType, duration, caloriesBurned } = req.body;
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
router.get('/:userId', async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const query = { userId: req.params.userId };

    if (date) {
      // Filter for a specific day (midnight to midnight)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      // Filter by date range
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

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

export default router;