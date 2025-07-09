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
import { connectDB } from "./lib/db.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Add this line!
app.use(express.urlencoded({ extended: true })); // For form data

app.use(cors());

app.use('/api/auth', authRoutes);
// app.use('/api/tracking',auth , trackingRoutes);
app.use('/api/tracking', trackingRoutes);

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
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
});