import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const coordinateSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: Date,
});

const trackingHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  distanceCovered: { type: Number }, // in meters
  route: [coordinateSchema],
});

const TrackingHistory = mongoose.models.TraackingHistory || mongoose.model("TrackingHistory", trackingHistorySchema);

console.log("TrackingHistory model loaded");

export default TrackingHistory;