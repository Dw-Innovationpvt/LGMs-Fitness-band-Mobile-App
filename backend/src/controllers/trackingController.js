// const TrackingHistory = require('../models/TrackingHistory');
// import express from 'express';
// import TrackingHistory from '../models/TrackingHistory';
import TrackingHistory from '../models/TrackingHistory.js';

// Get skating session summary for a user
export const getSkatingTrackingHistory = async (req, res) => {
    try {
        // const userId = req.params.userId;
        // get user Id from logged in user
        const userId = req.user._id; // Assuming user ID is stored in req.user after authentication

            const query = { userId };
                const latestTrip = await TrackingHistory.findOne(query).sort({ date: -1 });

                    if (!latestTrip) {
      return res.status(404).json({ message: 'No step data found.' });
    }

    res.json(latestTrip);

        // res.json({
        //     totalSessions: sessions.length,
        //     totalDistance,
        //     totalDuration,
        //     totalCalories,
        //     userId
        //     // averageSpeed: totalDistance > 0 ? (totalDistance / totalDuration) : 0, // Average speed in distance/time
        //     // stridesCount,
        // });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get skating session summary23' });
    }
};

export const postSkatingTrackingHistory = async (req, res) => {
    
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: 'User information is missing from request.' });
        }
        const { averageSpeed, caloriesBurned } = req.body;

        const newTrack = new TrackingHistory({
            userId: req.user._id,
            averageSpeed,
            caloriesBurned,
        });
        console.log(req.user._id, "userId from token");

        await newTrack.save();
        res.status(201).json(newTrack);
    } catch (error) {
        res.status(500).json({ message: 'Error saving tracking data', error: error.message });
    }

    }

// export default {
//     getSkatingTrackingHistory
// };

        // res.json({
        //     // totalSessions: sessions.length,
        //     // totalDistance,
        //     // totalDuration,
        //     // totalCalories,
        //     panjabi,
        //     userId
        //     // averageSpeed: totalDistance > 0 ? (totalDistance / totalDuration) : 0, // Average speed in distance/time
        //     // stridesCount,

        // });
        // } catch (error) {
        //     res.status(500).json({ error: 'Failed to get skating session summary53' });
        // }



// // Find all skating sessions for the user
// // const sessions = await TrackingHistory.find({ user: userId, activityType: 'skating' });
// // create a new empty session
// const sessions = await TrackingHistory.find({ userId: userId }).sort({ date: -1 }); // Sort by date, most recent first
// // console.log("userId", userId);
// // get users recent skating sessions


// console.log("sessions", sessions);
// if (!sessions || sessions.length === 0) {
//     return res.status(404).json({ message: 'No skating sessions found for this user.' });
// }
// // Calculate summary
// let totalDistance = 0;
// let totalDuration = 0;
// let totalCalories = 0;

// for (const session of sessions) {
//     totalDistance += session.distance || 0;
//     totalDuration += session.duration || 0;
//     totalCalories += session.calories || 0;
// }
// // save session for this user
// // const stridesCount = sessions.reduce((acc, session) => acc + (session.stridesCount || 0), 0);
// // const totalSpeed = totalDistance / totalDuration; // Average speed in distance/time
// // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time
// // const averageSpeed = totalSpeed > 0 ? (totalSpeed / sessions.length) : 0; // Average speed in distance/time
// // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time
// // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time
// // const averageSpeed = totalDistance > 0 ? (totalDistance / totalDuration) : 0; // Average speed in distance/time

// // Save updated totals to the database (optional: create a summary document)
// // Example: Save a summary for this user (you may want to use a separate model for summaries)
// // Uncomment and adapt the following if you have a Summary model:
// /*
// await Summary.findOneAndUpdate(
//     { user: userId, activityType: 'skating' },
//     {
//         totalSessions: sessions.length,
//         totalDistance,
//         totalDuration,
//         totalCalories
//     },
//     { upsert: true, new: true }
// );
// */
