import UserSession from "../models/UserSession.js";
import User from "../models/User.js";

// Create new session
export const createSession = async (req, res) => {
  try {
    const {
      deviceId,
      mode,
      startTime,
      endTime,
      stepCount,
      walkingDistance,
      strideCount,
      skatingDistance,
      speedData,
      laps,
      config
    } = req.body;

    const duration = Math.round((new Date(endTime) - new Date(startTime)) / 1000);

    const session = new UserSession({
      userId: req.user._id,
      deviceId,
      mode,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration,
      stepCount: stepCount || 0,
      walkingDistance: walkingDistance || 0,
      strideCount: strideCount || 0,
      skatingDistance: skatingDistance || 0,
      speedData: speedData || { currentSpeed: 0, maxSpeed: 0, minSpeed: 0, averageSpeed: 0 },
      laps: laps || 0,
      config: config || { wheelDiameter: 0.09, trackLength: 100.0 }
    });

    await session.save();

    // Update user stats - FIXED: use req.user._id
    await updateUserStats(req.user._id, session);

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get sessions with filtering
export const getSessions = async (req, res) => {
  try {
    const { startDate, endDate, mode, page = 1, limit = 10 } = req.query;
    
    // FIXED: use req.user._id
    let filter = { userId: req.user._id };
    
    // Date range filter
    if (startDate && endDate) {
      filter.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Mode filter
    if (mode) {
      filter.mode = mode;
    }

    const sessions = await UserSession.find(filter)
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await UserSession.countDocuments(filter);

    res.json({
      success: true,
      data: sessions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get sessions by specific date
export const getSessionsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    // Get start and end of the target date
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const sessions = await UserSession.find({
      // FIXED: use req.user._id
      userId: req.user._id,
      startTime: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ startTime: -1 });

    res.json({
      success: true,
      data: sessions,
      date: targetDate.toISOString().split('T')[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get sessions from last N days
export const getLastDaysSessions = async (req, res) => {
  try {
    const { days } = req.params;
    const daysAgo = parseInt(days);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const sessions = await UserSession.find({
      // FIXED: use req.user._id
      userId: req.user._id,
      startTime: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ startTime: -1 });

    // Group by date for easier frontend consumption
    const groupedSessions = groupSessionsByDate(sessions);

    res.json({
      success: true,
      data: groupedSessions,
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: daysAgo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get today's sessions
export const getTodaySessions = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const sessions = await UserSession.find({
      // FIXED: use req.user._id
      userId: req.user._id,
      startTime: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ startTime: -1 });

    res.json({
      success: true,
      data: sessions,
      date: today.toISOString().split('T')[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get session summary statistics
export const getSessionSummary = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const sessions = await UserSession.find({
      // FIXED: use req.user._id
      userId: req.user._id,
      startTime: { $gte: startDate }
    });

    const summary = calculateSessionSummary(sessions, days);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get session by ID
export const getSessionById = async (req, res) => {
  try {
    const session = await UserSession.findOne({
      _id: req.params.id,
      // FIXED: use req.user._id
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete session
export const deleteSession = async (req, res) => {
  try {
    const session = await UserSession.findOneAndDelete({
      _id: req.params.id,
      // FIXED: use req.user._id
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions
export const updateUserStats = async (userId, session) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found for stats update');
      return;
    }
    
    user.stats.totalSteps += session.stepCount;
    user.stats.totalWalkingDistance += session.walkingDistance;
    user.stats.totalSkatingDistance += session.skatingDistance;
    user.stats.totalSessions += 1;
    
    if (session.speedData.maxSpeed > user.stats.maxSpeed) {
      user.stats.maxSpeed = session.speedData.maxSpeed;
    }
    
    await user.save();
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

export const groupSessionsByDate = (sessions) => {
  const grouped = {};
  
  sessions.forEach(session => {
    const dateKey = session.startTime.toISOString().split('T')[0];
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(session);
  });
  
  return grouped;
};

export const calculateSessionSummary = (sessions, days) => {
  const summary = {
    totalSessions: sessions.length,
    totalSteps: 0,
    totalWalkingDistance: 0,
    totalSkatingDistance: 0,
    totalDuration: 0,
    maxSpeed: 0,
    averageSpeed: 0,
    sessionsByMode: {
      'S': 0, 'SS': 0, 'SD': 0
    },
    dailyAverages: {
      steps: 0,
      walkingDistance: 0,
      skatingDistance: 0,
      duration: 0
    }
  };

  let totalSpeed = 0;
  let speedCount = 0;

  sessions.forEach(session => {
    summary.totalSteps += session.stepCount;
    summary.totalWalkingDistance += session.walkingDistance;
    summary.totalSkatingDistance += session.skatingDistance;
    summary.totalDuration += session.duration;
    
    summary.sessionsByMode[session.mode]++;
    
    if (session.speedData.maxSpeed > summary.maxSpeed) {
      summary.maxSpeed = session.speedData.maxSpeed;
    }
    
    if (session.speedData.averageSpeed > 0) {
      totalSpeed += session.speedData.averageSpeed;
      speedCount++;
    }
  });

  summary.averageSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
  
  // Calculate daily averages
  if (days > 0) {
    summary.dailyAverages.steps = Math.round(summary.totalSteps / days);
    summary.dailyAverages.walkingDistance = summary.totalWalkingDistance / days;
    summary.dailyAverages.skatingDistance = summary.totalSkatingDistance / days;
    summary.dailyAverages.duration = Math.round(summary.totalDuration / days);
  }

  return summary;
};