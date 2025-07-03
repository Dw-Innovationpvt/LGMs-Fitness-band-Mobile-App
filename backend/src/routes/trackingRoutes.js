import express from 'express';
import { getSkatingTrackingHistory, postSkatingTrackingHistory } from '../controllers/trackingController.js';
import TrackingHistory from '../models/TrackingHistory.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Route to get skating tracking history for a user
// router.get('/skating/:userId', trackingController.getSkatingTrackingHistory);


router.get("/",auth, getSkatingTrackingHistory); 
router.post("/", auth, postSkatingTrackingHistory);

// router.post("/", auth, async (req, res) => {
//   try {
//     const { averageSpeed, caloriesBurned } = req.body;

//     const newTrack = new TrackingHistory({
//       user: req.user._id,
//       averageSpeed,
//       caloriesBurned,
//     });
//     console.log(user._id, "userId from token");

//     await newTrack.save();
//     res.status(201).json(newTrack);
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving tracking data', error: error.message });
//   }
// });

export default router;