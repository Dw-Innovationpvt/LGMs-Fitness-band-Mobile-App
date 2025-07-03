import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // description: String,
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  duration: { type: Number, required: true }, // Duration in days
  startDate: { type: Date, required: true },
  userId: { type: String, required: true },
  progress: [{
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    details: { type: Map, of: String } // For storing additional data like protein grams
  }]
});

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
// console.log("Challenge model loaded");