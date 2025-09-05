import express from 'express';
// import { getDailyTarget, updateDailyTarget } from '../controllers/targetController';
// import { getDailyTarget, updateDailyTarget } from '../controllers/targetController';
import { getDailyTarget, updateDailyTarget } from '../controllers/targetController.js';
const router = express.Router();

// GET request to fetch a user's daily target for a specific date
// The date is optional and can be passed as a query parameter (?date=YYYY-MM-DD)
router.get('/:userId', getDailyTarget);

// POST request to update a user's daily target
router.post('/:userId', updateDailyTarget);

export default router;





// // routes/targets.js
// // const express = require('express');
// // const router = express.Router();
// // const Target = require('../models/target');
// import express from "express";
// import Target from "../models/Target.js";
// import auth from "../middleware/auth.js";
// // import User from "..models/User.js";


// const router = express.Router();

// // Helper function to format a date to the start of the day in UTC
// const getStartOfDay = (date) => {
//   const d = new Date(date);
//   d.setUTCHours(0, 0, 0, 0);
//   return d;
// };

// /**
//  * @route   POST /
//  * @desc    Create or update a daily target document.
//  * This route is idempotent, meaning it will create a new document if one
//  * does not exist for the day, or update the existing one if it does.
//  *
//  * @body    { date, targets, progress, completed }
//  * @access  Private (requires authentication in a real application)
//  */
// router.post('/',auth, async (req, res) => {
//   // IMPORTANT: In a real application, you would get the userId from the
//   // authenticated user's session or token, not from a hardcoded string.
// //   const userId = '6529c29497e641c888219717';
//   const userId = req.user._id;

//   const { date, targets, progress, completed } = req.body;

//   // Use the helper function to ensure we always search for the start of the day.
//   const startOfDay = getStartOfDay(date);

//   try {
//     // The `findOneAndUpdate` method is the key to this single-document-per-day approach.
//     // `{ upsert: true }` tells MongoDB to create the document if it doesn't exist.
//     const updatedTarget = await Target.findOneAndUpdate(
//       { userId, date: startOfDay }, // Filter to find the correct document
//       { $set: { targets, progress, completed } }, // The data to update
//       { new: true, upsert: true, runValidators: true } // Options for the update
//     );

//     res.json(updatedTarget);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// /**
//  * @route   GET /today
//  * @desc    Get the daily target for the current day.
//  * @access  Private
//  */
// router.get('/today',auth, async (req, res) => {
//     const userId = req.user._id;
// //   const userId = '6529c29497e641c888219717';
//   const todayStart = getStartOfDay(new Date());

//   try {
//     const target = await Target.findOne({ userId, date: todayStart });
//     if (!target) {
//       return res.status(404).json({ msg: 'No target found for today.' });
//     }
//     res.json(target);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// /**
//  * @route   GET /:date
//  * @desc    Get the daily target for a specific date provided in the URL parameter.
//  * @access  Private
//  */
// router.get('/:date',auth, async (req, res) => {
//     const userId = req.user._id;
// //   const userId = '6529c29497e641c888219717';
//   const requestedDate = getStartOfDay(req.params.date);

//   try {
//     const target = await Target.findOne({ userId, date: requestedDate });
//     if (!target) {
//       return res.status(404).json({ msg: 'No target found for this date.' });
//     }
//     res.json(target);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// export default router;

// // module.exports = router;




// // // routes/targets.js
// // import express from "express";
// // import Target from "../models/Target.js";
// // import auth from "../middleware/auth.js";


// // const router = express.Router();

// // // Get target for specific date (YYYY-MM-DD format)
// // router.get("/date/:date", auth, async (req, res) => {
// //   try {
// //     const { date } = req.params;
    
// //     // Validate date format (YYYY-MM-DD)
// //     if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
// //       return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
// //     }

// //     const target = await Target.getOrCreate(req.user._id, date);
// //     res.json(target);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Get targets for date range (fromDate to toDate in YYYY-MM-DD format)
// // router.get("/range", auth, async (req, res) => {
// //   try {
// //     const { fromDate, toDate } = req.query;
    
// //     if (!fromDate || !toDate) {
// //       return res.status(400).json({ error: "fromDate and toDate parameters are required" });
// //     }

// //     // Validate date formats
// //     if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate) || !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
// //       return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
// //     }

// //     const targets = await Target.find({
// //       user: req.user._id,
// //       date: { $gte: fromDate, $lte: toDate }
// //     }).sort({ date: -1 });

// //     res.json(targets);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Get last X days of targets (including today)
// // router.get("/last-days/:days", auth, async (req, res) => {
// //   try {
// //     const days = parseInt(req.params.days) || 7;
    
// //     const today = new Date();
// //     const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
// //     const startDate = new Date(today);
// //     startDate.setDate(startDate.getDate() - (days - 1));
// //     const startDateString = startDate.toISOString().split('T')[0];

// //     const targets = await Target.find({
// //       user: req.user._id,
// //       date: { $gte: startDateString, $lte: todayString }
// //     }).sort({ date: -1 });

// //     // Fill missing days with empty data
// //     const result = [];
// //     for (let i = 0; i < days; i++) {
// //       const currentDate = new Date(today);
// //       currentDate.setDate(currentDate.getDate() - i);
// //       const dateString = currentDate.toISOString().split('T')[0];

// //       const targetForDate = targets.find(t => t.date === dateString);
      
// //       if (targetForDate) {
// //         result.push(targetForDate);
// //       } else {
// //         result.push({
// //           date: dateString,
// //           targets: { water: 2000, steps: 10000, caloriesEarn: 2000, caloriesBurn: 500 },
// //           progress: { water: 0, steps: 0, caloriesEarn: 0, caloriesBurn: 0 },
// //           completed: { water: false, steps: false, caloriesEarn: false, caloriesBurn: false },
// //           exists: false
// //         });
// //       }
// //     }

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Update target progress for specific date
// // router.put("/progress/:date", auth, async (req, res) => {
// //   try {
// //     const { date } = req.params;
// //     const { type, value } = req.body;
// //     const validTypes = ["water", "steps", "caloriesEarn", "caloriesBurn"];

// //     if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
// //       return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
// //     }

// //     if (!validTypes.includes(type)) {
// //       return res.status(400).json({ error: "Invalid target type" });
// //     }

// //     let target = await Target.getOrCreate(req.user._id, date);
// //     target.progress[type] = Math.max(0, value);
// //     target.updateCompletion();
// //     await target.save();

// //     res.json(target);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Update target goals for specific date
// // router.put("/goals/:date", auth, async (req, res) => {
// //   try {
// //     const { date } = req.params;
// //     const { water, steps, caloriesEarn, caloriesBurn } = req.body;

// //     if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
// //       return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
// //     }

// //     let target = await Target.getOrCreate(req.user._id, date);

// //     if (water !== undefined) target.targets.water = water;
// //     if (steps !== undefined) target.targets.steps = steps;
// //     if (caloriesEarn !== undefined) target.targets.caloriesEarn = caloriesEarn;
// //     if (caloriesBurn !== undefined) target.targets.caloriesBurn = caloriesBurn;

// //     target.updateCompletion();
// //     await target.save();

// //     res.json(target);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Get today's target (convenience endpoint)
// // router.get("/today", auth, async (req, res) => {
// //   try {
// //     const todayString = new Date().toISOString().split('T')[0];
// //     const target = await Target.getOrCreate(req.user._id, todayString);
// //     res.json(target);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Bulk update progress for multiple dates
// // router.put("/bulk-progress", auth, async (req, res) => {
// //   try {
// //     const { updates } = req.body; // Array of { date, type, value }
    
// //     if (!Array.isArray(updates)) {
// //       return res.status(400).json({ error: "Updates must be an array" });
// //     }

// //     const results = [];
// //     for (const update of updates) {
// //       const { date, type, value } = update;
      
// //       if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
// //         results.push({ date, type, success: false, error: "Invalid date format" });
// //         continue;
// //       }

// //       if (!["water", "steps", "caloriesEarn", "caloriesBurn"].includes(type)) {
// //         results.push({ date, type, success: false, error: "Invalid target type" });
// //         continue;
// //       }

// //       try {
// //         let target = await Target.getOrCreate(req.user._id, date);
// //         target.progress[type] = Math.max(0, value);
// //         target.updateCompletion();
// //         await target.save();
// //         results.push({ date, type, success: true, data: target });
// //       } catch (error) {
// //         results.push({ date, type, success: false, error: error.message });
// //       }
// //     }

// //     res.json({ results });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // export default router;
// // // // routes/targets.js
// // // import express from "express";
// // // import Target from "../models/Target.js";
// // // import User from "../models/User.js";
// // // import auth from "../middleware/auth.js";
// // // // import Target from "../models/Target.js";
// // // // import User from "../models/User.js";
// // // // import auth from "../middleware/auth.js";

// // // const router = express.Router();

// // // // Get today's target or create if not exists
// // // router.get("/today", auth, async (req, res) => {
// // //   try {
// // //     const today = new Date();
// // //     today.setHours(0, 0, 0, 0);

// // //     let target = await Target.findOne({
// // //       user: req.user._id,
// // //       date: today
// // //     });

// // //     if (!target) {
// // //       // Create new target for today with user's preferred defaults
// // //       const user = await User.findById(req.user._id);
// // //       target = new Target({
// // //         user: req.user._id,
// // //         date: today,
// // //         targets: {
// // //           water: 2000,
// // //           steps: 10000,
// // //           caloriesEarn: 2000,
// // //           caloriesBurn: 500
// // //         },
// // //         progress: { water: 0, steps: 0, caloriesEarn: 0, caloriesBurn: 0 }
// // //       });
// // //       target.updateCompletion();
// // //       await target.save();
// // //     }

// // //     res.json(target);
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Get last 7 days of targets (including today)
// // // router.get("/last-7-days", auth, async (req, res) => {
// // //   try {
// // //     const today = new Date();
// // //     today.setHours(0, 0, 0, 0);
    
// // //     const sevenDaysAgo = new Date(today);
// // //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days including today

// // //     const targets = await Target.find({
// // //       user: req.user._id,
// // //       date: { $gte: sevenDaysAgo, $lte: today }
// // //     }).sort({ date: -1 });

// // //     // Fill in missing days with empty data
// // //     const result = [];
// // //     for (let i = 0; i < 7; i++) {
// // //       const date = new Date(today);
// // //       date.setDate(date.getDate() - i);
// // //       date.setHours(0, 0, 0, 0);

// // //       const targetForDate = targets.find(t => 
// // //         t.date.getTime() === date.getTime()
// // //       );

// // //       if (targetForDate) {
// // //         result.push(targetForDate);
// // //       } else {
// // //         // Return empty target for missing days
// // //         result.push({
// // //           date,
// // //           targets: { water: 2000, steps: 10000, caloriesEarn: 2000, caloriesBurn: 500 },
// // //           progress: { water: 0, steps: 0, caloriesEarn: 0, caloriesBurn: 0 },
// // //           completed: { water: false, steps: false, caloriesEarn: false, caloriesBurn: false },
// // //           exists: false
// // //         });
// // //       }
// // //     }

// // //     res.json(result);
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Update target progress
// // // router.put("/progress", auth, async (req, res) => {
// // //   try {
// // //     const { type, value } = req.body;
// // //     const validTypes = ["water", "steps", "caloriesEarn", "caloriesBurn"];

// // //     if (!validTypes.includes(type)) {
// // //       return res.status(400).json({ error: "Invalid target type" });
// // //     }

// // //     const today = new Date();
// // //     today.setHours(0, 0, 0, 0);

// // //     let target = await Target.findOne({
// // //       user: req.user._id,
// // //       date: today
// // //     });

// // //     if (!target) {
// // //       target = new Target({
// // //         user: req.user._id,
// // //         date: today,
// // //         targets: { water: 2000, steps: 10000, caloriesEarn: 2000, caloriesBurn: 500 },
// // //         progress: { water: 0, steps: 0, caloriesEarn: 0, caloriesBurn: 0 }
// // //       });
// // //     }

// // //     target.progress[type] = Math.max(0, value);
// // //     target.updateCompletion();
// // //     await target.save();

// // //     res.json(target);
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Update targets (set new goals)
// // // router.put("/goals", auth, async (req, res) => {
// // //   try {
// // //     const { water, steps, caloriesEarn, caloriesBurn } = req.body;
// // //     const today = new Date();
// // //     today.setHours(0, 0, 0, 0);

// // //     let target = await Target.findOne({
// // //       user: req.user._id,
// // //       date: today
// // //     });

// // //     if (!target) {
// // //       target = new Target({
// // //         user: req.user._id,
// // //         date: today,
// // //         progress: { water: 0, steps: 0, caloriesEarn: 0, caloriesBurn: 0 }
// // //       });
// // //     }

// // //     if (water !== undefined) target.targets.water = water;
// // //     if (steps !== undefined) target.targets.steps = steps;
// // //     if (caloriesEarn !== undefined) target.targets.caloriesEarn = caloriesEarn;
// // //     if (caloriesBurn !== undefined) target.targets.caloriesBurn = caloriesBurn;

// // //     target.updateCompletion();
// // //     await target.save();

// // //     res.json(target);
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // export default router;