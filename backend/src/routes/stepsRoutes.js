import express from "express";
import auth from '../middleware/auth.js';
import Steps from "../models/Steps.js";

const router = express.Router();

// Calculate kilometers from step count (assuming average stride length of 0.000762 km)
const calculateKilometers = (stepCount) => {
  const strideLengthKm = 0.000762; // Average stride length in kilometers
  return Number((stepCount * strideLengthKm).toFixed(2));
};

router.post('/',auth, async (req, res) => {
  try {
        const userId = req.user._id;
        console.log('userId from 16-post', userId);
    // const { userId, date, stepCount, kilometers, caloriesBurned, activeMinutes } = req.body;
    const {  date, stepCount, kilometers, caloriesBurned, activeMinutes } = req.body;
    // Use provided kilometers or calculate from stepCount
    const calculatedKilometers = kilometers || calculateKilometers(stepCount);
    
    const steps = new Steps({
      userId,
      date: date ? new Date(date) : new Date(), // Use provided date or current date/time
      stepCount,
      kilometers: calculatedKilometers,
      caloriesBurned,
      activeMinutes
    });
    await steps.save();
    res.status(201).json(steps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const userId = req.user._id;
    const query = { userId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Fetch only the latest document based on date
    const latestStep = await Steps.findOne(query).sort({ date: -1 });

    if (!latestStep) {
      return res.status(404).json({ message: 'No step data found.' });
    }

    res.json(latestStep);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { stepCount, kilometers, caloriesBurned, activeMinutes } = req.body;
    const steps = await Steps.findById(req.params.id);

    if (!steps) {
      return res.status(404).json({ error: 'Steps record not found' });
    }
    console.log(steps.stepCount, stepCount, 'steps check');
    if (steps) {
        steps.stepCount = stepCount + steps.stepCount;
        steps.kilometers = calculateKilometers(stepCount);
        steps.caloriesBurned = caloriesBurned + steps.caloriesBurned;
        steps.activeMinutes = activeMinutes + steps.activeMinutes;
    }
    else {
        steps.stepCount = stepCount || steps.stepCount;
        steps.kilometers = kilometers || (stepCount ? calculateKilometers(stepCount) : steps.kilometers);
        steps.caloriesBurned = caloriesBurned || steps.caloriesBurned;
        steps.activeMinutes = activeMinutes || steps.activeMinutes;
    }
    await steps.save();
    res.json(steps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Delete a step record
router.delete('/:id', async (req, res) => {
  try {
    const steps = await Steps.findByIdAndDelete(req.params.id);
    if (!steps) {
      return res.status(404).json({ error: 'Steps record not found' });
    }
    res.json({ message: 'Steps record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;





// router.get('/:userId', async (req, res) => {
// router.get('/',auth, async (req, res) => {
// try {
//     const { date, startDate, endDate } = req.query;
//     // const query = { userId: req.params.userId };
//     const userId = req.user._id;
//     const query = { userId: userId }; // Use userId from authenticated user
//     console.log('userId from stepsRoutes', userId);
//     if (date) {
//       // Filter for a specific day (midnight to midnight)
//       const startOfDay = new Date(date);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(date);
//       endOfDay.setHours(23, 59, 59, 999);
//       query.date = { $gte: startOfDay, $lte: endOfDay };
//     } else if (startDate && endDate) {
//       // Filter by date range
//       console.log('startDate and endDate', startDate, endDate);
//       query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }

//     const steps = await Steps.find(query).sort({ date: -1 });
//     res.json(steps);
//   }catch(error) {
//     res.status(500).json({ error: error.message });
//     }
// })