// const express = require('express');
import express from "express";
const router = express.Router();
import { createSession, getSessions, getSessionById, getTodaySessions, getSessionsByDate, getLastDaysSessions, getSessionSummary, deleteSession} from "../controllers/sessionController.js";
// const sessionController = require('../Controllers/sessionController');
// const auth = require('../Middleware/auth');
import auth from "../middleware/auth.js";
// Create new session
router.post('/sessions', auth, createSession);

// Get sessions with date filtering
router.get('/sessions', auth, getSessions);

// Get session by ID
router.get('/sessions/:id', auth, getSessionById);

// Get today's sessions
router.get('/sessions/today', auth, getTodaySessions);

// Get sessions by specific date
router.get('/sessions/date/:date', auth, getSessionsByDate);

// Get sessions from last N days
router.get('/sessions/last/:days', auth, getLastDaysSessions);

// Get session statistics
router.get('/sessions/stats/summary', auth, getSessionSummary);

// Delete session
router.delete('/sessions/:id', auth, deleteSession);

// module.exports = router;
export default router;