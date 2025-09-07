// import Goal from '../models/Goal.js';
import User from '../models/User.js';
import Goal from '../models/Goal.js';

export const createGoalForToday = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Create goal using user's targets
    const goal = new Goal({
      userId,
      date: today,
      goals: {
        water: {
          target: user.target ?? 2000,
        },
        steps: {
          target: user.stepGoal ?? 10000,
        },
        caloriesEarned: {
          target: user.mealCalorieTarget ?? 2000,
        },
        caloriesBurned: {
          target: user.burnTarget ?? 500,
        },
      },
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};