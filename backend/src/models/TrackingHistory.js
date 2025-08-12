import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const coordinateSchema = new mongoose.Schema({
//   latitude: Number,
//   longitude: Number,
//   timestamp: Date,
// });
  
const trackingHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  // startTime: { type: Date, required: true },
  // endTime: { type: Date },
  // distanceCovered: { type: Number }, // in k/meters
  averageSpeed: { type: Number }, // in km/s
  stridesCount: { type: Number, default: 0 },
  strideRate: { type: Number, default: 0 }, // in strides per minute
  stepsCount: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  AltitideGain: { type: Number, default: 0 }, // in meters
  AltitideLoss: { type: Number, default: 0 }, // in meters
  TripDuration: { type: Number, default: 0 }, // in seconds

  // route: [coordinateSchema],
});

// const TrackingHistory = mongoose.models.TraackingHistory || mongoose.model("TrackingHistory", trackingHistorySchema);
const TrackingHistory = mongoose.model("TrackingHistory", trackingHistorySchema);

// console.log("TrackingHistory model loaded");

export default TrackingHistory;