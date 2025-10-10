import express from "express";
// const express = require('express');
const router = express.Router();
// const analyticsController = require('../Controllers/analyticsController');
// const auth = require('../Middleware/auth');
import auth from "../middleware/auth.js";
// import analyticsController from "../controllers/analyticsController.js"
import getWeeklySummary from "../controllers/analyticsController.js";

// Get weekly summary
router.get('/analytics/weekly', auth, getWeeklySummary);

// Get monthly progress
// router.get('/analytics/monthly', auth, analyticsController.getMonthlyProgress);

// Get speed analytics
// router.get('/analytics/speed', auth, analyticsController.getSpeedAnalytics);

// Get distance trends
// router.get('/analytics/distance-trends', auth, analyticsController.getDistanceTrends);

// module.exports = router;
export default router;