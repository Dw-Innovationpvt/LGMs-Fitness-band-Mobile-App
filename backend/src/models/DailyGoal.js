import mongoose from 'mongoose';

const dailyGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  targets: {
    water: { type: Number, default: 2000 },
    steps: { type: Number, default: 10000 },
    caloriesIn: { type: Number, default: 2000 },
    caloriesBurn: { type: Number, default: 500 }
  },
  actual: {
    water: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    caloriesIn: { type: Number, default: 0 },
    caloriesBurn: { type: Number, default: 0 }
  },
  completed: {
    water: { type: Boolean, default: false },
    steps: { type: Boolean, default: false },
    caloriesIn: { type: Boolean, default: false },
    caloriesBurn: { type: Boolean, default: false }
  }
});

// Index for efficient querying by date
dailyGoalSchema.index({ date: -1 });

export default mongoose.model('DailyGoal', dailyGoalSchema);