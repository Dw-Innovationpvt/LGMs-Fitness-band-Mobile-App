import mongoose from "mongoose";

// Schema for tracker data
const trackerSchema = new mongoose.Schema({
  mode: String,
  stepCount: Number,
  walkingDistance: Number,
  strideCount: Number,
  skatingDistance: Number,
  speed: Number,
  laps: Number,
  timestamp: { type: Number, default: Date.now },
});

const TrackerData = mongoose.model('TrackerData', trackerSchema);

export default TrackerData;