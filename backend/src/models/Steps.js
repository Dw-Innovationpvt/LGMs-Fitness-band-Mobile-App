import mongoose from "mongoose";

// Steps Schema
const stepsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true }, // Exact date and time of step entry
  stepCount: { type: Number, required: true }, // Number of steps
  kilometers: { type: Number, required: true }, // Distance in kilometers
  caloriesBurned: { type: Number, required: true }, // Calories burned
  activeMinutes: { type: Number, required: true } // Active minutes during stepping
});

const Steps = mongoose.model('Steps', stepsSchema);
// console.log("steps model loaded");

export default Steps;