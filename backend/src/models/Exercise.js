import mongoose from "mongoose";


const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true }, // Exact date and time of exercise entry
  exerciseType: { type: String, required: true }, // e.g., "Running", "Yoga", "Weightlifting"
  duration: { type: Number, required: true }, // Duration in minutes
  caloriesBurned: { type: Number, required: true } // Calories burned during exercise
});


const Exercise = mongoose.model('Exercise', exerciseSchema);
// console.log("Exercise model loaded");

export default Exercise;