import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  goals: {
    water: {
      target: { type: Number, required: true },
      progress: { type: Number, default: 0 },
      achieved: { type: Boolean, default: false },
    },
    steps: {
      target: { type: Number, required: true },
      progress: { type: Number, default: 0 },
      achieved: { type: Boolean, default: false },
    },
    caloriesEarned: {
      target: { type: Number, required: true },
      progress: { type: Number, default: 0 },
      achieved: { type: Boolean, default: false },
    },
    caloriesBurned: {
      target: { type: Number, required: true },
      progress: { type: Number, default: 0 },
      achieved: { type: Boolean, default: false },
    },
  },
}, { timestamps: true });

const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export default Goal;