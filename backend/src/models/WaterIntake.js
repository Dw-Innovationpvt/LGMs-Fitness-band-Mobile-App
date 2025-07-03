import mongoose from "mongoose";


const waterIntakeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // Water intake in milliliters
  target: { type: Number, default: 3000 }, // Daily water intake target in milliliters
  completed: { type: Boolean, default: false } // Whether the daily target has been met
});

const WaterIntake = mongoose.model('WaterIntake', waterIntakeSchema);
// console.log("WaterIntake model loaded");

export default WaterIntake;
