// targetController.js
import User from '../models/User.js'; // Assuming this is the correct path
import Meal from '../models/Meal.js'; // Assuming a Meal schema exists
import WaterIntake from '../models/WaterIntake.js'; // Assuming a WaterIntake schema exists
import { format, startOfDay } from 'date-fns';
// import Challenge from '../models/Challenge.js';
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
  const dateQuery = req.query.date;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse the date query. If no dates are provided, default to today.
    const dateStrings = dateQuery ? dateQuery.split(',') : [format(new Date(), 'yyyy-MM-dd')];
    const results = [];

    for (const dateString of dateStrings) {
        const dailyProgress = await getDailyProgress(userId, dateString);
        if (!dailyProgress) {
          results.push({ date: dateString, message: "Failed to calculate daily progress" });
          continue;
        }

        // Find or create the target entry for the specific date
        let dailyTarget = user.targetHistory.find(
          (entry) => format(entry.date, 'yyyy-MM-dd') === dateString
        );
        
        if (!dailyTarget) {
            // Create a new entry if one doesn't exist
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
            dailyTarget = newTarget;
        } else {
            // Update the existing entry's progress
            dailyTarget.progress = dailyProgress;
            dailyTarget.completed = {
                water: dailyProgress.water >= dailyTarget.targets.water,
                steps: dailyProgress.steps >= dailyTarget.targets.steps,
                caloriesEarn: dailyProgress.caloriesEarn >= dailyTarget.targets.caloriesEarn,
                caloriesBurn: dailyProgress.caloriesBurn >= dailyTarget.targets.caloriesBurn,
            };
        }
        results.push(dailyTarget);
    }
    
    // Save the user document after processing all dates
    await user.save();
    
    res.status(200).json(results);
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





// // const TrackingHistory = require('../models/TrackingHistory');
// // import express from 'express';
// // import TrackingHistory from '../models/TrackingHistory';
// import TrackingHistory from '../models/TrackingHistory.js';

// // Get skating session summary for a user
// export const getSkatingTrackingHistory = async (req, res) => {
//     try {
//         // const userId = req.params.userId;
//         // get user Id from logged in user
//         const userId = req.user._id; // Assuming user ID is stored in req.user after authentication

//             const query = { userId };
//                 const latestTrip = await TrackingHistory.findOne(query).sort({ date: -1 });

//                     if (!latestTrip) {
//       return res.status(404).json({ message: 'No step data found.' });
//     }

//     res.json(latestTrip);

//         // res.json({
//         //     totalSessions: sessions.length,
//         //     totalDistance,
//         //     totalDuration,
//         //     totalCalories,
//         //     userId
//         //     // averageSpeed: totalDistance > 0 ? (totalDistance / totalDuration) : 0, // Average speed in distance/time
//         //     // stridesCount,
//         // });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to get skating session summary23' });
//     }
// };

// export const postSkatingTrackingHistory = async (req, res) => {
    
//     try {
//         if (!req.user || !req.user._id) {
//             return res.status(400).json({ message: 'User information is missing from request.' });
//         }
//         const { averageSpeed, caloriesBurned } = req.body;

//         const newTrack = new TrackingHistory({
//             userId: req.user._id,
//             averageSpeed,
//             caloriesBurned,
//         });
//         console.log(req.user._id, "userId from token");

//         await newTrack.save();
//         res.status(201).json(newTrack);
//     } catch (error) {
//         res.status(500).json({ message: 'Error saving tracking data', error: error.message });
//     }

//     }

// // export default {
// //     getSkatingTrackingHistory
// // };

//         // res.json({
//         //     // totalSessions: sessions.length,
//         //     // totalDistance,
//         //     // totalDuration,
//         //     // totalCalories,
//         //     panjabi,
//         //     userId
//         //     // averageSpeed: totalDistance > 0 ? (totalDistance / totalDuration) : 0, // Average speed in distance/time
//         //     // stridesCount,

//         // });
//         // } catch (error) {
//         //     res.status(500).json({ error: 'Failed to get skating session summary53' });
//         // }



// // // Find all skating sessions for the user
// // // const sessions = await TrackingHistory.find({ user: userId, activityType: 'skating' });
// // // create a new empty session
// // const sessions = await TrackingHistory.find({ userId: userId }).sort({ date: -1 }); // Sort by date, most recent first
// // // console.log("userId", userId);
// // // get users recent skating sessions


// // console.log("sessions", sessions);
// // if (!sessions || sessions.length === 0) {
// //     return res.status(404).json({ message: 'No skating sessions found for this user.' });
// // }
// // // Calculate summary
// // let totalDistance = 0;
// // let totalDuration = 0;
// // let totalCalories = 0;

// // for (const session of sessions) {
// //     totalDistance += session.distance || 0;
// //     totalDuration += session.duration || 0;
// //     totalCalories += session.calories || 0;
// // }
// // // save session for this user
// // // const stridesCount = sessions.reduce((acc, session) => acc + (session.stridesCount || 0), 0);
// // // const totalSpeed = totalDistance / totalDuration; // Average speed in distance/time
// // // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time
// // // const averageSpeed = totalSpeed > 0 ? (totalSpeed / sessions.length) : 0; // Average speed in distance/time
// // // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time
// // // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time
// // // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time

// // // Save updated totals to the database (optional: create a summary document)
// // // Example: Save a summary for this user (you may want to use a separate model for summaries)
// // // Uncomment and adapt the following if you have a Summary model:
// // /*
// // await Summary.findOneAndUpdate(
// //     { user: userId, activityType: 'skating' },
// //     {
// //         totalSessions: sessions.length,
// //         totalDistance,
// //         totalDuration,
// //         totalCalories
// //     },
// //     { upsert: true, new: true }
// // );
// // */
