import mongoose from "mongoose";

const StepCountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  steps: { type: Number, required: true }, // steps intake in milliliters
  target: { type: Number, default: 10000 }, // Daily water intake target in milliliters
  completed: { type: Boolean, default: false } // Whether the daily target has been met
});

const StepCount = mongoose.model('StepCount', StepCountSchema);
// console.log("WaterIntake model loaded");

export default StepCount;
