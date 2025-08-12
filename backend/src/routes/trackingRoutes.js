import express from 'express';
// import { getSkatingTrackingHistory, postSkatingTrackingHistory } from '../controllers/trackingController.js';
// import TrackingHistory from '../models/TrackingHistory.js';
import TrackerData from '../models/TrackerData.js';
import auth from '../middleware/auth.js';
const router = express.Router();



router.post('/tracker-data', async (req, res) => {
  const { mode, stepCount, walkingDistance, strideCount, skatingDistance, speed, laps } = req.body;

  // Validate incoming data
  if (!mode || stepCount === undefined || walkingDistance === undefined ||
      strideCount === undefined || skatingDistance === undefined || speed === undefined || laps === undefined) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  try {
    const data = new TrackerData({
      mode,
      stepCount,
      walkingDistance,
      strideCount,
      skatingDistance,
      speed,
      laps,
    });
    await data.save();
    console.log('Data inserted:', req.body);
    res.status(200).json({ message: 'Data received' });
  } catch (err) {
    console.error('Error saving data:', err.message);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// GET endpoint for latest data
router.get('/tracker-data/latest', async (req, res) => {
  try {
    const data = await TrackerData.findOne().sort({ timestamp: -1 });
    res.json(data || {});
  } catch (err) {
    console.error('Error fetching latest data:', err.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// GET endpoint for data by mode
router.get('/tracker-data/mode/:mode', async (req, res) => {
  try {
    const data = await TrackerData.find({ mode: req.params.mode }).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    console.error('Error fetching data by mode:', err.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});













// Route to get skating tracking history for a user
// router.get('/skating/:userId', trackingController.getSkatingTrackingHistory);


// router.get("/",auth, getSkatingTrackingHistory); 
// router.post("/", auth, postSkatingTrackingHistory);

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