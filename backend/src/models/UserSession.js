// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['S', 'SS', 'SD'], // Step Counting, Skating Speed, Skating Distance
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  // Step Counting Data
  stepCount: {
    type: Number,
    default: 0
  },
  walkingDistance: {
    type: Number, // in meters
    default: 0
  },
  // Skating Data
  strideCount: {
    type: Number,
    default: 0
  },
  skatingDistance: {
    type: Number, // in meters
    default: 0
  },
  // Speed Metrics
  speedData: {
    currentSpeed: { type: Number, default: 0 }, // km/h
    maxSpeed: { type: Number, default: 0 },     // km/h
    minSpeed: { type: Number, default: 0 },     // km/h
    averageSpeed: { type: Number, default: 0 }  // km/h
  },
  laps: {
    type: Number,
    default: 0
  },
  // Configuration
  config: {
    wheelDiameter: { type: Number, default: 0.09 }, // meters
    trackLength: { type: Number, default: 100.0 }   // meters
  }
}, {
  timestamps: true
});

// Index for efficient date queries
sessionSchema.index({ userId: 1, startTime: -1 });
sessionSchema.index({ startTime: 1 });

// module.exports = mongoose.model('UserSession', sessionSchema);

const UserSession = mongoose.model('UserSession', sessionSchema);


export default UserSession;