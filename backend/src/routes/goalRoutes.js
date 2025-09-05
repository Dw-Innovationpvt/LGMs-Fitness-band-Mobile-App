import express from 'express';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import Meal from '../models/Meal.js';

const router = express.Router();

// Set goal target (water, steps, caloriesEarned, caloriesBurned)
router.put('/set-target', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { goalType, target, date } = req.body;

    if (!['water', 'steps', 'caloriesEarned', 'caloriesBurned'].includes(goalType)) {
      return res.status(400).json({ error: 'Invalid goal type' });
    }
    if (!target || target <= 0) {
      return res.status(400).json({ error: 'Target must be a positive number' });
    }
    if (date && isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    let goal = await Goal.findOne({ userId, date: selectedDate });
    if (!goal) {
      goal = new Goal({
        userId,
        date: selectedDate,
        goals: {
          water: { target: user.target || 2000, progress: 0, achieved: false },
          steps: { target: user.stepGoal || 7000, progress: 0, achieved: false },
          caloriesEarned: { target: user.mealCalorieTarget || 2000, progress: 0, achieved: false },
          caloriesBurned: { target: user.burnTarget || 500, progress: 0, achieved: false },
        },
      });
    }

    goal.goals[goalType].target = target;
    goal.goals[goalType].achieved = goal.goals[goalType].progress >= target;

    // Update User fields for consistency
    if (goalType === 'water') user.target = target;
    if (goalType === 'steps') user.stepGoal = target;
    if (goalType === 'caloriesEarned') user.mealCalorieTarget = target;
    if (goalType === 'caloriesBurned') user.burnTarget = target;
    if (goalType === 'caloriesEarned') user.mealFlag = goal.goals.caloriesEarned.achieved;
    if (goalType === 'caloriesBurned') user.burnFlag = goal.goals.caloriesBurned.achieved;

    await goal.save();
    await user.save();

    res.json({ date: goal.date, goalType, target: goal.goals[goalType].target });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update goal progress
router.put('/update-progress', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { goalType, progress, date } = req.body;

    if (!['water', 'steps', 'caloriesBurned'].includes(goalType)) {
      return res.status(400).json({ error: 'Invalid goal type or caloriesEarned progress cannot be updated directly' });
    }
    if (progress < 0) {
      return res.status(400).json({ error: 'Progress cannot be negative' });
    }
    if (date && isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    let goal = await Goal.findOne({ userId, date: selectedDate });
    if (!goal) {
      goal = new Goal({
        userId,
        date: selectedDate,
        goals: {
          water: { target: user.target || 2000, progress: 0, achieved: false },
          steps: { target: user.stepGoal || 7000, progress: 0, achieved: false },
          caloriesEarned: { target: user.mealCalorieTarget || 2000, progress: 0, achieved: false },
          caloriesBurned: { target: user.burnTarget || 500, progress: 0, achieved: false },
        },
      });
    }

    goal.goals[goalType].progress = progress;
    goal.goals[goalType].achieved = progress >= goal.goals[goalType].target;
    if (goalType === 'caloriesBurned') user.burnFlag = goal.goals.caloriesBurned.achieved;

    await goal.save();
    await user.save();

    res.json({ date: goal.date, goalType, progress: goal.goals[goalType].progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get goals for a specific day or all available days
router.get('/get', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    let query = { userId };
    if (date) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      query.date = { $gte: sevenDaysAgo };
    }

    const goals = await Goal.find(query).sort({ date: -1 });

    // If specific date requested, update caloriesEarned progress
    if (date) {
      let goal = goals[0];
      if (!goal) {
        goal = new Goal({
          userId,
          date: selectedDate,
          goals: {
            water: { target: user.target || 2000, progress: 0, achieved: false },
            steps: { target: user.stepGoal || 7000, progress: 0, achieved: false },
            caloriesEarned: { target: user.mealCalorieTarget || 2000, progress: 0, achieved: false },
            caloriesBurned: { target: user.burnTarget || 500, progress: 0, achieved: false },
          },
        });
      }

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const result = await Meal.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: '$calories' },
          },
        },
      ]);

      const caloriesEarnedProgress = result.length > 0 ? result[0].totalCalories : 0;
      goal.goals.caloriesEarned.progress = caloriesEarnedProgress;
      goal.goals.caloriesEarned.achieved = caloriesEarnedProgress >= goal.goals.caloriesEarned.target;
      user.mealFlag = goal.goals.caloriesEarned.achieved;
      await goal.save();
      await user.save();

      res.json({ date: goal.date, goals: goal.goals });
    } else {
      // Return goals for the last 7 days, creating missing days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
      }).reverse();

      const result = await Promise.all(dates.map(async d => {
        let goal = goals.find(g => g.date.getTime() === d.getTime());
        if (!goal) {
          goal = new Goal({
            userId,
            date: d,
            goals: {
              water: { target: user.target || 2000, progress: 0, achieved: false },
              steps: { target: user.stepGoal || 7000, progress: 0, achieved: false },
              caloriesEarned: { target: user.mealCalorieTarget || 2000, progress: 0, achieved: false },
              caloriesBurned: { target: user.burnTarget || 500, progress: 0, achieved: false },
            },
          });
          await goal.save();
        }
        return goal;
      }));

      res.json({ weeklyGoals: result.sort((a, b) => b.date - a.date), mealFlag: user.mealFlag, burnFlag: user.burnFlag });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if goal target is met
router.get('/get/today-goal-target', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, goalType } = req.query;

    if (!['water', 'steps', 'caloriesEarned', 'caloriesBurned'].includes(goalType)) {
      return res.status(400).json({ error: 'Invalid or missing goal type' });
    }
    if (date && isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    let goal = await Goal.findOne({ userId, date: selectedDate });
    if (!goal) {
      goal = new Goal({
        userId,
        date: selectedDate,
        goals: {
          water: { target: user.target || 2000, progress: 0, achieved: false },
          steps: { target: user.stepGoal || 7000, progress: 0, achieved: false },
          caloriesEarned: { target: user.mealCalorieTarget || 2000, progress: 0, achieved: false },
          caloriesBurned: { target: user.burnTarget || 500, progress: 0, achieved: false },
        },
      });
    }

    if (goalType === 'caloriesEarned') {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const result = await Meal.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: '$calories' },
          },
        },
      ]);

      const caloriesEarnedProgress = result.length > 0 ? result[0].totalCalories : 0;
      goal.goals.caloriesEarned.progress = caloriesEarnedProgress;
      goal.goals.caloriesEarned.achieved = caloriesEarnedProgress >= goal.goals.caloriesEarned.target;
      user.mealFlag = goal.goals.caloriesEarned.achieved;
      await goal.save();
      await user.save();
    }

    const target = goal.goals[goalType].target;
    const progress = goal.goals[goalType].progress;
    const achieved = goal.goals[goalType].achieved;

    res.json({
      status: achieved,
      message: achieved ? `You have reached your ${goalType} goal for ${selectedDate.toISOString().split('T')[0]}!` : `You have not yet reached your ${goalType} goal.`,
      date: goal.date,
      goalType,
      target,
      progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset progress for a specific goal
router.put('/reset-progress', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { goalType, date } = req.body;

    if (!['water', 'steps', 'caloriesEarned', 'caloriesBurned'].includes(goalType)) {
      return res.status(400).json({ error: 'Invalid goal type' });
    }
    if (date && isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    let goal = await Goal.findOne({ userId, date: selectedDate });
    if (!goal) {
      goal = new Goal({
        userId,
        date: selectedDate,
        goals: {
          water: { target: user.target || 2000, progress: 0, achieved: false },
          steps: { target: user.stepGoal || 7000, progress: 0, achieved: false },
          caloriesEarned: { target: user.mealCalorieTarget || 2000, progress: 0, achieved: false },
          caloriesBurned: { target: user.burnTarget || 500, progress: 0, achieved: false },
        },
      });
    }

    goal.goals[goalType].progress = 0;
    goal.goals[goalType].achieved = false;
    if (goalType === 'caloriesEarned') user.mealFlag = false;
    if (goalType === 'caloriesBurned') user.burnFlag = false;

    await goal.save();
    await user.save();

    res.json({ date: goal.date, goalType, progress: goal.goals[goalType].progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test endpoint
router.get('/', auth, async (req, res) => {
  res.status(200).json({ message: 'Goals API is working', userId: req.user._id });
});

export default router;

// import express from 'express';
// import auth from '../middleware/auth.js';
// import mongoose from 'mongoose';
// import User from '../models/User.js';
// import Meal from '../models/Meal.js';

// const router = express.Router();

// // Set or update a goal target for a specific day
// router.put('/set-goal', auth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { date, goalType, target } = req.body;

//     // Validate goal type
//     if (!['water', 'steps', 'caloriesEarned', 'caloriesBurned'].includes(goalType)) {
//       return res.status(400).json({ error: 'Invalid goal type' });
//     }

//     if (!target || target <= 0) {
//       return res.status(400).json({ error: 'Target must be a positive number' });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Normalize date to start of day
//     const selectedDate = date ? new Date(date) : new Date();
//     selectedDate.setHours(0, 0, 0, 0);

//     // Find the day's goals (should exist due to pre-save hook)
//     let dayGoals = user.weeklyGoals.find(g => g.date.getTime() === selectedDate.getTime());
//     if (!dayGoals) {
//       // Fallback in case day is missing
//       dayGoals = {
//         date: selectedDate,
//         goals: {
//           water: { target: user.target, progress: 0, achieved: false },
//           steps: { target: user.stepGoal, progress: 0, achieved: false },
//           caloriesEarned: { target: user.mealCalorieTarget, progress: 0, achieved: false },
//           caloriesBurned: { target: user.burnTarget, progress: 0, achieved: false },
//         },
//       };
//       user.weeklyGoals.push(dayGoals);
//     }

//     // Update the specific goal target and check achieved status
//     dayGoals.goals[goalType].target = target;
//     dayGoals.goals[goalType].achieved = dayGoals.goals[goalType].progress >= target;

//     // Update legacy fields
//     if (goalType === 'water') user.target = target;
//     if (goalType === 'steps') user.stepGoal = target;
//     if (goalType === 'caloriesEarned') user.mealCalorieTarget = target;
//     if (goalType === 'caloriesBurned') user.burnTarget = target;
//     if (goalType === 'caloriesEarned') user.mealFlag = dayGoals.goals.caloriesEarned.achieved;
//     if (goalType === 'caloriesBurned') user.burnFlag = dayGoals.goals.caloriesBurned.achieved;

//     await user.save();
//     res.json({ date: dayGoals.date, goalType, target: dayGoals.goals[goalType].target });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Update goal progress for a specific day
// router.put('/update-progress', auth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { date, goalType, progress } = req.body;

//     // Validate goal type (exclude caloriesEarned)
//     if (!['water', 'steps', 'caloriesBurned'].includes(goalType)) {
//       return res.status(400).json({ error: 'Invalid goal type or caloriesEarned progress cannot be updated directly' });
//     }

//     if (progress < 0) {
//       return res.status(400).json({ error: 'Progress cannot be negative' });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Normalize date to start of day
//     const selectedDate = date ? new Date(date) : new Date();
//     selectedDate.setHours(0, 0, 0, 0);

//     // Find the day's goals
//     let dayGoals = user.weeklyGoals.find(g => g.date.getTime() === selectedDate.getTime());
//     if (!dayGoals) {
//       dayGoals = {
//         date: selectedDate,
//         goals: {
//           water: { target: user.target, progress: 0, achieved: false },
//           steps: { target: user.stepGoal, progress: 0, achieved: false },
//           caloriesEarned: { target: user.mealCalorieTarget, progress: 0, achieved: false },
//           caloriesBurned: { target: user.burnTarget, progress: 0, achieved: false },
//         },
//       };
//       user.weeklyGoals.push(dayGoals);
//     }

//     // Update progress and achieved flag
//     dayGoals.goals[goalType].progress = progress;
//     dayGoals.goals[goalType].achieved = progress >= dayGoals.goals[goalType].target;

//     // Update legacy burnFlag
//     if (goalType === 'caloriesBurned') user.burnFlag = dayGoals.goals.caloriesBurned.achieved;

//     await user.save();
//     res.json({ date: dayGoals.date, goalType, progress: dayGoals.goals[goalType].progress });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get goals for a specific day or all 7 days
// router.get('/get', auth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { date } = req.query;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Normalize date to start of day
//     const selectedDate = date ? new Date(date) : new Date();
//     selectedDate.setHours(0, 0, 0, 0);

//     // Calculate caloriesEarned progress
//     const startOfDay = new Date(selectedDate);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(selectedDate);
//     endOfDay.setHours(23, 59, 59, 999);

//     const result = await Meal.aggregate([
//       {
//         $match: {
//           user: new mongoose.Types.ObjectId(userId),
//           createdAt: { $gte: startOfDay, $lte: endOfDay },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalCalories: { $sum: '$calories' },
//         },
//       },
//     ]);

//     const caloriesEarnedProgress = result.length > 0 ? result[0].totalCalories : 0;

//     // Update caloriesEarned for the specified day
//     let dayGoals = user.weeklyGoals.find(g => g.date.getTime() === selectedDate.getTime());
//     if (dayGoals) {
//       dayGoals.goals.caloriesEarned.progress = caloriesEarnedProgress;
//       dayGoals.goals.caloriesEarned.achieved = caloriesEarnedProgress >= dayGoals.goals.caloriesEarned.target;
//       user.mealFlag = dayGoals.goals.caloriesEarned.achieved;
//       await user.save();
//     }

//     if (date) {
//       // Return goals for the specified date
//       if (!dayGoals) {
//         return res.json({ date: selectedDate, goals: null });
//       }
//       res.json({ date: dayGoals.date, goals: dayGoals.goals });
//     } else {
//       // Return all 7 days of goals
//       res.json({ weeklyGoals: user.weeklyGoals, mealFlag: user.mealFlag, burnFlag: user.burnFlag });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Check if goal target is met for a specific goal type on a specific day
// router.get('/get/today-goal-target', auth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { date, goalType } = req.query;

//     if (!['water', 'steps', 'caloriesEarned', 'caloriesBurned'].includes(goalType)) {
//       return res.status(400).json({ error: 'Invalid or missing goal type' });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Normalize date to start of day
//     const selectedDate = date ? new Date(date) : new Date();
//     selectedDate.setHours(0, 0, 0, 0);

//     // Find the day's goals
//     let dayGoals = user.weeklyGoals.find(g => g.date.getTime() === selectedDate.getTime());
//     if (!dayGoals) {
//       dayGoals = {
//         date: selectedDate,
//         goals: {
//           water: { target: user.target, progress: 0, achieved: false },
//           steps: { target: user.stepGoal, progress: 0, achieved: false },
//           caloriesEarned: { target: user.mealCalorieTarget, progress: 0, achieved: false },
//           caloriesBurned: { target: user.burnTarget, progress: 0, achieved: false },
//         },
//       };
//       user.weeklyGoals.push(dayGoals);
//     }

//     // Update caloriesEarned progress if needed
//     if (goalType === 'caloriesEarned') {
//       const startOfDay = new Date(selectedDate);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(selectedDate);
//       endOfDay.setHours(23, 59, 59, 999);

//       const result = await Meal.aggregate([
//         {
//           $match: {
//             user: new mongoose.Types.ObjectId(userId),
//             createdAt: { $gte: startOfDay, $lte: endOfDay },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalCalories: { $sum: '$calories' },
//           },
//         },
//       ]);

//       const caloriesEarnedProgress = result.length > 0 ? result[0].totalCalories : 0;
//       dayGoals.goals.caloriesEarned.progress = caloriesEarnedProgress;
//       dayGoals.goals.caloriesEarned.achieved = caloriesEarnedProgress >= dayGoals.goals.caloriesEarned.target;
//       user.mealFlag = dayGoals.goals.caloriesEarned.achieved;
//       await user.save();
//     }

//     const target = dayGoals.goals[goalType].target;
//     const progress = dayGoals.goals[goalType].progress;
//     const achieved = dayGoals.goals[goalType].achieved;

//     res.json({
//       status: achieved,
//       message: achieved ? `You have reached your ${goalType} goal for ${selectedDate.toISOString().split('T')[0]}!` : `You have not yet reached your ${goalType} goal.`,
//       date: dayGoals.date,
//       goalType,
//       target,
//       progress,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Reset progress for a specific goal type on a specific day
// router.put('/reset-progress', auth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { date, goalType } = req.body;

//     if (!['water', 'steps', 'caloriesEarned', 'caloriesBurned'].includes(goalType)) {
//       return res.status(400).json({ error: 'Invalid goal type' });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Normalize date to start of day
//     const selectedDate = date ? new Date(date) : new Date();
//     selectedDate.setHours(0, 0, 0, 0);

//     // Find the day's goals
//     let dayGoals = user.weeklyGoals.find(g => g.date.getTime() === selectedDate.getTime());
//     if (!dayGoals) {
//       dayGoals = {
//         date: selectedDate,
//         goals: {
//           water: { target: user.target, progress: 0, achieved: false },
//           steps: { target: user.stepGoal, progress: 0, achieved: false },
//           caloriesEarned: { target: user.mealCalorieTarget, progress: 0, achieved: false },
//           caloriesBurned: { target: user.burnTarget, progress: 0, achieved: false },
//         },
//       };
//       user.weeklyGoals.push(dayGoals);
//     }

//     dayGoals.goals[goalType].progress = 0;
//     dayGoals.goals[goalType].achieved = false;

//     // Update legacy flags
//     if (goalType === 'caloriesEarned') user.mealFlag = false;
//     if (goalType === 'caloriesBurned') user.burnFlag = false;

//     await user.save();
//     res.json({ date: dayGoals.date, goalType, progress: dayGoals.goals[goalType].progress });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Test endpoint to verify API
// router.get('/', auth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     res.status(200).json({ message: 'Goals API is working', userId });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;