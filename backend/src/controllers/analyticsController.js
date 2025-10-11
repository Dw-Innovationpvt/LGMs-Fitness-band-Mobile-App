// const UserSession = require('../Models/UserSession');
// const UserSession from "../"

import UserSession from "../models/UserSession.js";
// /xports.getWeeklySummary = async (req, res) => {
const getWeeklySummary = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const sessions = await UserSession.find({
      // userId: req.userId,
      userId: req.user._id,
      startTime: { $gte: startDate }
    });

    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(session => 
        session.startTime.toISOString().split('T')[0] === dateKey
      );
      
      return {
        date: dateKey,
        steps: daySessions.reduce((sum, session) => sum + session.stepCount, 0),
        walkingDistance: daySessions.reduce((sum, session) => sum + session.walkingDistance, 0),
        skatingDistance: daySessions.reduce((sum, session) => sum + session.skatingDistance, 0),
        sessions: daySessions.length
      };
    });

    res.json({
      success: true,
      data: weeklyData.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default getWeeklySummary;
// Add other analytics controllers similarly...