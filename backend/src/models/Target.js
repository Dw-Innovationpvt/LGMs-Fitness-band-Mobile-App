// models/target.js
// const mongoose = require('mongoose');
import mongoose from "mongoose";

// Define the schema for the daily targets and progress
const targetSchema = new mongoose.Schema({
  // The userId is crucial for multi-user applications, linking the document to a specific user.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model if you have one
    required: true,
  },
  // The date field serves as the unique identifier for the day.
  // We use `Date` type to store the start of the day (e.g., 2023-10-27T00:00:00.000Z).
  date: {
    type: Date,
    required: true,
    index: true, // Indexing this field improves query performance.
    unique: true, // Ensures only one document exists per user per day.
  },
  // An object to store the target values for each metric.
  targets: {
    water: { type: Number, default: 2000 }, // Water in ml
    steps: { type: Number, default: 10000 },
    caloriesEarn: { type: Number, default: 2000 }, // Calories earned/consumed
    caloriesBurn: { type: Number, default: 500 }, // Calories burned
  },
  // An object to track the user's progress for each metric.
  progress: {
    water: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    caloriesEarn: { type: Number, default: 0 },
    caloriesBurn: { type: Number, default: 0 },
  },
  // An object to track which goals have been completed.
  completed: {
    water: { type: Boolean, default: false },
    steps: { type: Boolean, default: false },
    caloriesEarn: { type: Boolean, default: false },
    caloriesBurn: { type: Boolean, default: false },
  },
}, {
  timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
});

// Create a compound index to ensure uniqueness for a given user on a given day.
targetSchema.index({ userId: 1, date: 1 }, { unique: true });

// module.exports = mongoose.model('Target', targetSchema);
const Target = mongoose.models.Target || mongoose.model("Target", targetSchema);
export default Target;


// // models/Target.js
// import mongoose from "mongoose";
// // import auth from "../middleware/auth.js";
// // import User from "./User.js";

// // const user = await User.findById(userId);

// const targetProgressSchema = new mongoose.Schema({
//   water: { type: Number, default: 0 },
//   steps: { type: Number, default: 0 },
//   caloriesEarn: { type: Number, default: 0 },
//   caloriesBurn: { type: Number, default: 0 }
// });

// const targetSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   date: {
//     type: String, // Store as string "YYYY-MM-DD" for easy querying
//     required: true,
//     index: true
//   },
//   targets: {
//     water: { type: Number, default: 0 },
//     steps: { type: Number, default: 0 },
//     caloriesEarn: { type: Number, default: 0 },
//     caloriesBurn: { type: Number, default: 0 }
//   },
//   progress: targetProgressSchema,
//   completed: {
//     water: { type: Boolean, default: false },
//     steps: { type: Boolean, default: false },
//     caloriesEarn: { type: Boolean, default: false },
//     caloriesBurn: { type: Boolean, default: false }
//   }
// }, { timestamps: true });

// // Compound index for fast queries
// targetSchema.index({ user: 1, date: 1 }, { unique: true });

// // Method to check completion
// targetSchema.methods.updateCompletion = function() {
//   this.completed.water = this.progress.water >= this.targets.water;
//   this.completed.steps = this.progress.steps >= this.targets.steps;
//   this.completed.caloriesEarn = this.progress.caloriesEarn >= this.targets.caloriesEarn;
//   this.completed.caloriesBurn = this.progress.caloriesBurn >= this.targets.caloriesBurn;
//   return this.completed;
// };

// // Static method to get or create target for a date
// targetSchema.statics.getOrCreate = async function(userId, dateString) {
//   let target = await this.findOne({ user: userId, date: dateString });
  
//   if (!target) {
//     target = new this({
//       user: userId,
//       date: dateString,
//       targets: { water: 2000, steps: 10000, caloriesEarn: 2000, caloriesBurn: 500 },
//       progress: { water: 0, steps: 0, caloriesEarn: 0, caloriesBurn: 0 }
//     });
//     target.updateCompletion();
//     await target.save();
//   }
  
//   return target;
// };

// const Target = mongoose.models.Target || mongoose.model("Target", targetSchema);
// export default Target;


// // // models/Target.js
// // import mongoose from "mongoose";

// // const targetProgressSchema = new mongoose.Schema({
// //   water: { type: Number, default: 0 },
// //   steps: { type: Number, default: 0 },
// //   caloriesEarn: { type: Number, default: 0 },
// //   caloriesBurn: { type: Number, default: 0 }
// // });

// // const targetSchema = new mongoose.Schema({
// //   user: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   date: {
// //     type: Date,
// //     required: true,
// //     index: true
// //   },
// //   targets: {
// //     water: { type: Number, default: 2000 },
// //     steps: { type: Number, default: 10000 },
// //     caloriesEarn: { type: Number, default: 2000 },
// //     caloriesBurn: { type: Number, default: 500 }
// //   },
// //   progress: targetProgressSchema,
// //   completed: {
// //     water: { type: Boolean, default: false },
// //     steps: { type: Boolean, default: false },
// //     caloriesEarn: { type: Boolean, default: false },
// //     caloriesBurn: { type: Boolean, default: false }
// //   }
// // }, { timestamps: true });

// // // Compound index for fast queries
// // targetSchema.index({ user: 1, date: 1 }, { unique: true });

// // // Method to check completion
// // targetSchema.methods.updateCompletion = function() {
// //   this.completed.water = this.progress.water >= this.targets.water;
// //   this.completed.steps = this.progress.steps >= this.targets.steps;
// //   this.completed.caloriesEarn = this.progress.caloriesEarn >= this.targets.caloriesEarn;
// //   this.completed.caloriesBurn = this.progress.caloriesBurn >= this.targets.caloriesBurn;
// //   return this.completed;
// // };

// // const Target = mongoose.models.Target || mongoose.model("Target", targetSchema);
// // export default Target;