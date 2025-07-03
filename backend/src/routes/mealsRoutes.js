import express from 'express';
import auth from '../middleware/auth.js';
import Meal from '../models/Meal.js';
import mongoose from 'mongoose';
const router = express.Router();

router.post('', async (req, res) => {
  try {
    const { userId, name, calories, mealType, createdAt } = req.body;
    
    // Validate userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    console.log('meal post request', req.body);
    const meal = new Meal({
      user: userId,
      name,
      calories,
      mealType,
      createdAt: createdAt ? new Date(createdAt) : new Date()
    });
    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/',auth, async (req, res) => {
  try {
    // console.log('32 get authbased get mealsRoutes');
    const userId = req.user._id;
    // console.log('34 get authbased get mealsRoutes');
    console.log('userId from mealsRoutes', userId);
    // console.log('userId from mealsRoutes', userId);
    res.status(200).json({ message: 'Meals API is working', userId: userId });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:userId',  async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    
    // Validate userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    console.log('mealsRoutes, 48')
    const query = { user: req.params.userId };
    
    if (date) {
      // Filter for specific day (midnight to midnight)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      // Filter by date range
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const meals = await Meal.find(query).sort({ createdAt: -1 }).populate('user', '_id');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    // res.status(200).json({ message: 'Meals API is working' });
});

// Get total calories per day for a user
router.get('/:userId/total-calories', async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    console.log(date);
    
    // Validate userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const query = { user: req.params.userId };
    
    if (date) {
      // Filter for specific day (midnight to midnight)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const totalCalories = await Meal.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalCalories: { $sum: '$calories' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          totalCalories: 1,
          _id: 0
        }
      },
      { $sort: { date: -1 } }
    ]);

    res.json(totalCalories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a meal
router.put('/:id', async (req, res) => {
  try {
    // res.send('Update meal endpoint is not implemented yet');
    const { name, calories, mealType } = req.body;
    console.log('Update meal request', req.body);
    // Validate meal ID as ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid meal ID format' });
    }

    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    meal.name = name || meal.name;
    meal.calories = calories || meal.calories;
    meal.mealType = mealType || meal.mealType;
    await meal.save();
    res.json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;