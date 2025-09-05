// targetController.js
import { format, startOfDay } from 'date-fns';
// import User from '../models/User.js';
// import Meal from '../models/mealSchema'; // Assuming a Meal schema exists
// import WaterIntake from '../models/waterSchema'; // Assuming a WaterIntake schema exists
import User from '../models/User.js'; // Assuming this is the correct path
import Meal from '../models/Meal.js';
import WaterIntake from '../models/WaterIntake.js';

// --- Helper function to get the user's current day's progress ---
const getDailyProgress = async (userId, dateString) => {
  try {
    const startOfDate = startOfDay(new Date(dateString));
    const endOfDate = new Date(startOfDate);
    endOfDate.setDate(endOfDate.getDate() + 1);

    // 1. Get total water intake for the day
    const waterIntakes = await WaterIntake.find({
      userId,
      date: { $gte: startOfDate, $lt: endOfDate },
    });
    const totalWater = waterIntakes.reduce((sum, intake) => sum + intake.amount, 0);

    // 2. Get total calories from meals for the day
    const meals = await Meal.find({
      userId,
      date: { $gte: startOfDate, $lt: endOfDate },
    });
    const totalCaloriesEaten = meals.reduce((sum, meal) => sum + meal.calories, 0);

    // 3. Get total calories burned from workouts for the day
    // This is a placeholder as the workout schema was not provided.
    // Replace with a real query to your workout/activity collection.
    const workouts = []; // await Workout.find({ userId, date: { $gte: startOfDate, $lt: endOfDate } });
    const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + workout.calories, 0);

    return {
      water: totalWater,
      caloriesEarn: totalCaloriesEaten,
      caloriesBurn: totalCaloriesBurned,
      steps: 0, // Placeholder for step tracking
    };
  } catch (error) {
    console.error("Error calculating daily progress:", error);
    return null;
  }
};


// --- GET handler for fetching the daily target and its progress ---
export const getDailyTarget = async (req, res) => {
  const { userId } = req.params; // Get user from URL parameters
  const dateString = req.query.date || format(new Date(), 'yyyy-MM-dd');

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dailyProgress = await getDailyProgress(userId, dateString);
    if (!dailyProgress) {
      return res.status(500).json({ message: "Failed to calculate daily progress" });
    }

    // This is where we create or update the document
    let dailyTarget = user.targetHistory.find(
      (entry) => format(entry.date, 'yyyy-MM-dd') === dateString
    );

    if (!dailyTarget) {
      // If no entry exists for this date, create a new one
      const newTarget = {
        date: new Date(dateString),
        targets: user.dailyTargets,
        progress: dailyProgress,
        completed: {
          water: dailyProgress.water >= user.dailyTargets.water,
          steps: dailyProgress.steps >= user.dailyTargets.steps,
          caloriesEarn: dailyProgress.caloriesEarn >= user.dailyTargets.caloriesEarn,
          caloriesBurn: dailyProgress.caloriesBurn >= user.dailyTargets.caloriesBurn,
        },
      };

      user.targetHistory.push(newTarget);
      await user.save();
      dailyTarget = newTarget;

    } else {
      // If entry exists, update its progress
      dailyTarget.progress = dailyProgress;
      dailyTarget.completed = {
        water: dailyProgress.water >= dailyTarget.targets.water,
        steps: dailyProgress.steps >= dailyTarget.targets.steps,
        caloriesEarn: dailyProgress.caloriesEarn >= dailyTarget.targets.caloriesEarn,
        caloriesBurn: dailyProgress.caloriesBurn >= dailyTarget.targets.caloriesBurn,
      };
      await user.save();
    }

    res.status(200).json(dailyTarget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- POST handler for manual target updates from the user ---
// This is for cases like when the user manually changes a goal.
export const updateDailyTarget = async (req, res) => {
  const { userId } = req.params;
  const { targets, progress, completed } = req.body;
  const dateString = format(new Date(), 'yyyy-MM-dd'); // Assuming updates are for today

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the daily target for today
    let dailyTarget = user.targetHistory.find(
      (entry) => format(entry.date, 'yyyy-MM-dd') === dateString
    );

    if (!dailyTarget) {
      // If it doesn't exist, create a new one with the provided data
      dailyTarget = {
        date: new Date(),
        targets: targets || user.dailyTargets,
        progress: progress || {
          water: 0,
          steps: 0,
          caloriesEarn: 0,
          caloriesBurn: 0,
        },
        completed: completed || {
          water: false,
          steps: false,
          caloriesEarn: false,
          caloriesBurn: false,
        },
      };
      user.targetHistory.push(dailyTarget);
    } else {
      // Merge the updates with the existing document
      if (targets) Object.assign(dailyTarget.targets, targets);
      if (progress) Object.assign(dailyTarget.progress, progress);
      if (completed) Object.assign(dailyTarget.completed, completed);
    }

    await user.save();
    res.status(200).json(dailyTarget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
