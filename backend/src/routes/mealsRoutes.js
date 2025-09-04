import express from 'express';
import auth from '../middleware/auth.js';
import Meal from '../models/Meal.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
const router = express.Router();

// Set step goal
router.put('/set-step-goal', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { stepGoal } = req.body;
    
    if (!stepGoal || stepGoal <= 0) {
      return res.status(400).json({ error: 'Step goal must be a positive number' });
    }
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.stepGoal = stepGoal;
    await user.save();
    
    res.json({ stepGoal: user.stepGoal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get step goal
router.get('/get-step-goal', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ stepGoal: user.stepGoal || 10000 }); // Default to 10,000 steps
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request(auth)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // const { userId, name, calories, mealType, createdAt } = req.body;
    const { name, calories, mealType, createdAt } = req.body;
    
    // temp for fixing mealFlag
    // user.mealCalorieTarget 
    // const temp = 


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

// router.get('/get',auth, async (req, res) => {
//   try {
//     const user = req.user._id;
//     // Validate userId as ObjectId
//     // if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
//     //   return res.status(400).json({ error: 'Invalid user ID format' });
//     // }
//     // Get today's start and end time
//     const now = new Date();
//     const startOfDay = new Date(now);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(now);
//     endOfDay.setHours(23, 59, 59, 999);

//     const query = {
//       // user: req.params.userId,
//       user,
//       createdAt: { $gte: startOfDay, $lte: endOfDay }
//     };

//     const meals = await Meal.find(query).sort({ createdAt: -1 }).populate('user', '_id');
//     res.json(meals);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

//// ----------------- New code for calender based date or data ----------
// GET /meals/get?date=2025-08-23
router.get('/get', auth, async (req, res) => {
  try {
    const user = req.user._id;

    // Get date from query or fallback to today
    const { date } = req.query;
    const selectedDate = date ? new Date(date) : new Date();

    // Start & end of the selected day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Query meals
    const query = {
      user,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };

    const meals = await Meal.find(query)
      .sort({ createdAt: -1 })
      .populate('user', '_id');

    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get total calories per day for a user
// router.get('/:userId/total-calories', async (req, res) => {
//   try {
//     // todays calories eaten total count return
//         // Get today's start and end time
//     const now = new Date();
//     const startOfDay = new Date(now);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(now);
//     endOfDay.setHours(23, 59, 59, 999);

//     const query = {
//       user: req.params.userId,
//       createdAt: { $gte: startOfDay, $lte: endOfDay }
//     };
//     // const date = req.query.date ? new Date(req.query.date) : new Date();
//     console.log(date);
    
//     // Validate userId as ObjectId
//     if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
//       return res.status(400).json({ error: 'Invalid user ID format' });
//     }

//     // const query = { user: req.params.userId };
    
//     if (date) {
//       // Filter for specific day (midnight to midnight)
//       const startOfDay = new Date(date);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(date);
//       endOfDay.setHours(23, 59, 59, 999);
//       query.createdAt = { $gte: startOfDay, $lte: endOfDay };
//     }

//     const totalCalories = await Meal.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' },
//             day: { $dayOfMonth: '$createdAt' }
//           },
//           totalCalories: { $sum: '$calories' }
//         }
//       },
//       {
//         $project: {
//           date: {
//             $dateFromParts: {
//               year: '$_id.year',
//               month: '$_id.month',
//               day: '$_id.day'
//             }
//           },
//           totalCalories: 1,
//           _id: 0
//         }
//       },
//       { $sort: { date: -1 } }
//     ]);

//     res.json(totalCalories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Update a meal

// related to exercise or workout for buring calories
router.put('/set-burn-target', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { burnTarget } = req.body;
    if (!burnTarget || burnTarget <= 0) {
      return res.status(400).json({ error: 'Burn target must be a positive number' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.burnTarget = burnTarget;
    await user.save();
    res.json({ burnTarget: user.burnTarget });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/set-meal-calorie-target', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { mealCalorieTarget } = req.body;
    if (!mealCalorieTarget || mealCalorieTarget <= 0) {
      return res.status(400).json({ error: 'Meal calorie target must be a positive number' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.mealCalorieTarget = mealCalorieTarget;
    await user.save();
    res.json({ mealCalorieTarget: user.mealCalorieTarget });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/get/total-calories',auth, async (req, res) => {
  try {
        const user = req.user._id;

    // Validate userId as ObjectId
    // if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    //   return res.status(400).json({ error: 'Invalid user ID format' });
    // }

    // Get today's start and end time
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Aggregate total calories for today
    const result = await Meal.aggregate([
      {
        $match: {
          // user: new mongoose.Types.ObjectId(req.params.userId),
          user,
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$calories' }
        }
      }
    ]);

    const totalCalories = result.length > 0 ? result[0].totalCalories : 0;
    res.json({ totalCalories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get/today-calorie-target', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId); // Fetch full user document

    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Aggregate total calories for today
    const result = await Meal.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$calories' }
        }
      }
    ]);

    const totalCalories = result.length > 0 ? result[0].totalCalories : 0;
    if (user.mealCalorieTarget <= totalCalories) {
            user.mealFlag = true;
      return res.json({
        status: true,
        message: "You have reached your meal calorie target for today!",
        totalCalories,
        mealCalorieTarget: user.mealCalorieTarget,
        mealFlag: user.mealFlag
      });
    } else {

      return res.json({
        status: false,
        totalCalories,
        mealCalorieTarget: user.mealCalorieTarget,
        mealFlag: user.mealFlag
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-burn-target', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    // console.log('inside burn targetr')
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return the user's burn target, default to 0 if not set
    res.json({ burnTarget: user.burnTarget || 0 });
    
  } catch (error) {
    console.error('Error fetching burn target:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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