import express from "express";
import "dotenv/config";
import authRoutes from './routes/authRoutes.js'
// import auth from './middleware/userAuth.js'
import auth from "./middleware/auth.js";

import trackingRoutes from './routes/trackingRoutes.js'
import challengesRoutes from './routes/challengesRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import stepsRoutes from './routes/stepsRoutes.js';
import mealsRoutes from './routes/mealsRoutes.js';
import bmiRoutes from './routes/bmiRoutes.js';
import userRoutes from './routes/userRoutes.js';

import goalRoutes from './routes/goalRoutes.js';

import targetsRoutes from './routes/targetsRoutes.js';
import skatePrefRoutes from './routes/skatePrefRoutes.js';

// import { createGoalForToday } from "./controllers/goalController.js";
// import { createGoalForToday } from "./controllers/goalController.js";

import { connectDB } from "./lib/db.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Add this line!
app.use(express.urlencoded({ extended: true })); // For form data

app.use(cors());

app.use('/api/auth', authRoutes);
// app.use('')
// app.use('/api/tracking',auth , trackingRoutes);
// app.use('/api/tracking', trackingRoutes);

app.use('/api/track', trackingRoutes);

// /api/challenges
app.use('/api/challenges', challengesRoutes);
// console.log("PORT", PORT);
// api for water
app.use('/api/water', waterRoutes);

// for exercise
app.use('/api/exercises', exerciseRoutes);

// for meals
app.use('/api/meals', mealsRoutes);
// steps count
app.use('/api/steps', stepsRoutes);

// for bmi setup making true... bmiSCreen frontedn
app.use('/api/bmi', bmiRoutes);
app.use('/api/user', userRoutes);
console.log('Targets route loadeinf');

// for daily activities goals targets
// app.use('/api/targets', targetsRoutes);
app.use('/api/targets',targetsRoutes)
app.use('/api/goals', goalRoutes);
console.log('Targets route loaded');

app.use('/api/skate', skatePrefRoutes);

// app.use('/api/goals', goalRoutes);
// console.log('Goal route loaded');

// router.post('/api/create-today', auth, createGoalForToday);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// to get user info from token
// Protected Route
app.get('/me', auth, (req, res) => {
  res.json(req.user); // Will return user info if token is valid
});


app.listen(PORT, () => {

// console.log("listen on localhost 3k");
connectDB()
  .then(() => {
    // console.log(`Server is running on port ${PORT}`);
    console.error("wow we have successfully connected the database.")
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
});