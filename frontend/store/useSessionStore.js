import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import BASE_URL from "../"
import { API_URL } from '../constants/api';
// const API_BASE_URL = 'http://localhost:3000/api';
// const API_BASE_URL = 

const API_BASE_URL = API_URL;

export const useSessionStore = create(
  persist(
    (set, get) => ({
      // State
      sessions: [],
      loading: false,
      error: null,
      stats: null,
      
      // Current date filters
      selectedDate: new Date().toISOString().split('T')[0],
      daysRange: 7,
      
      // Mode filters
      selectedMode: 'all', // 'all', 'S', 'SS', 'SD'
      
      // Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setDaysRange: (days) => set({ daysRange: days }),
      setSelectedMode: (mode) => set({ selectedMode: mode }),

      // Create new session
      createSession: async (sessionData) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken(); // You'll need to implement getToken
          
          const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(sessionData)
          });

          if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set((state) => ({
              sessions: [result.data, ...state.sessions],
              loading: false
            }));
            return result.data;
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get all sessions with filters
      fetchSessions: async (filters = {}) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken();
          const queryParams = new URLSearchParams();
          
          // Add filters to query params
          Object.keys(filters).forEach(key => {
            if (filters[key]) {
              queryParams.append(key, filters[key]);
            }
          });
          
          const url = `${API_BASE_URL}/sessions?${queryParams.toString()}`;
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch sessions: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set({ 
              sessions: result.data,
              loading: false 
            });
            return result.data;
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get sessions by specific date
      fetchSessionsByDate: async (date, mode = null) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken();
          let url = `${API_BASE_URL}/sessions/date/${date}`;
          
          if (mode) {
            url += `?mode=${mode}`;
          }
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch sessions for date: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set({ loading: false });
            return result.data;
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get sessions from last N days
      fetchLastDaysSessions: async (days, mode = null) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken();
          let url = `${API_BASE_URL}/sessions/last/${days}`;
          
          if (mode) {
            url += `?mode=${mode}`;
          }
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch last ${days} days sessions: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set({ loading: false });
            return result.data; // This returns grouped data by date
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get today's sessions
      fetchTodaySessions: async (mode = null) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken();
          let url = `${API_BASE_URL}/sessions/today`;
          
          if (mode) {
            url += `?mode=${mode}`;
          }
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch today's sessions: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set({ loading: false });
            return result.data;
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get session statistics
      fetchSessionStats: async (days = 7, mode = null) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken();
          let url = `${API_BASE_URL}/sessions/stats/summary?days=${days}`;
          
          if (mode) {
            url += `&mode=${mode}`;
          }
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch session stats: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set({ 
              stats: result.data,
              loading: false 
            });
            return result.data;
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get session by ID
      fetchSessionById: async (sessionId) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken();
          const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch session: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set({ loading: false });
            return result.data;
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Delete session
      deleteSession: async (sessionId) => {
        try {
          set({ loading: true, error: null });
          
          const token = get().getToken();
          const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to delete session: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            set((state) => ({
              sessions: state.sessions.filter(session => session._id !== sessionId),
              loading: false
            }));
            return result.message;
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Helper function to get token (you need to implement this based on your auth)
      getToken: () => {
        // This should return your JWT token from your auth store
        // Example: return useAuthStore.getState().token;
        return 'your_jwt_token_here';
      },

      // Get data for last 7 days with dates
      getLast7DaysData: async (mode = null) => {
        try {
          const last7DaysData = await get().fetchLastDaysSessions(7, mode);
          return last7DaysData;
        } catch (error) {
          console.error('Error fetching last 7 days data:', error);
          return {};
        }
      },

      // Get data for specific date ranges
      getDateRangeData: async (startDate, endDate, mode = null) => {
        try {
          const sessions = await get().fetchSessions({
            startDate,
            endDate,
            mode
          });
          return sessions;
        } catch (error) {
          console.error('Error fetching date range data:', error);
          return [];
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () => set({ 
        sessions: [], 
        stats: null, 
        error: null,
        selectedDate: new Date().toISOString().split('T')[0],
        daysRange: 7,
        selectedMode: 'all'
      })
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({ 
        sessions: state.sessions,
        selectedDate: state.selectedDate,
        daysRange: state.daysRange,
        selectedMode: state.selectedMode
      })
    }
  )
);

// Custom hooks for specific use cases
export const useSpeedSkatingSessions = () => {
  const { sessions, fetchSessions, fetchLastDaysSessions } = useSessionStore();
  
  const speedSessions = sessions.filter(session => session.mode === 'SS');
  
  const fetchSpeedSessions = (filters = {}) => {
    return fetchSessions({ ...filters, mode: 'SS' });
  };
  
  const fetchLastDaysSpeedSessions = (days) => {
    return fetchLastDaysSessions(days, 'SS');
  };
  
  return {
    speedSessions,
    fetchSpeedSessions,
    fetchLastDaysSpeedSessions
  };
};

export const useDistanceSkatingSessions = () => {
  const { sessions, fetchSessions, fetchLastDaysSessions } = useSessionStore();
  
  const distanceSessions = sessions.filter(session => session.mode === 'SD');
  
  const fetchDistanceSessions = (filters = {}) => {
    return fetchSessions({ ...filters, mode: 'SD' });
  };
  
  const fetchLastDaysDistanceSessions = (days) => {
    return fetchLastDaysSessions(days, 'SD');
  };
  
  return {
    distanceSessions,
    fetchDistanceSessions,
    fetchLastDaysDistanceSessions
  };
};

export const useStepCountingSessions = () => {
  const { sessions, fetchSessions, fetchLastDaysSessions } = useSessionStore();
  
  const stepSessions = sessions.filter(session => session.mode === 'S');
  
  const fetchStepSessions = (filters = {}) => {
    return fetchSessions({ ...filters, mode: 'S' });
  };
  
  const fetchLastDaysStepSessions = (days) => {
    return fetchLastDaysSessions(days, 'S');
  };
  
  return {
    stepSessions,
    fetchStepSessions,
    fetchLastDaysStepSessions
  };
};

// Hook for getting last 7 days data with dates
export const useLast7DaysData = (mode = null) => {
  const { fetchLastDaysSessions, loading, error } = useSessionStore();
  
  const getLast7DaysWithData = async () => {
    const data = await fetchLastDaysSessions(7, mode);
    
    // Ensure we have all 7 days, even if no data
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      last7Days.push({
        date: dateKey,
        displayDate: formatDisplayDate(date),
        sessions: data[dateKey] || [],
        totalDistance: calculateTotalDistance(data[dateKey] || [], mode),
        totalSteps: calculateTotalSteps(data[dateKey] || [], mode),
        maxSpeed: calculateMaxSpeed(data[dateKey] || [], mode)
      });
    }
    
    return last7Days.reverse(); // Return from oldest to newest
  };
  
  return {
    getLast7DaysWithData,
    loading,
    error
  };
};

// Utility functions
const formatDisplayDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
};

const calculateTotalDistance = (sessions, mode) => {
  return sessions.reduce((total, session) => {
    if (mode && session.mode !== mode) return total;
    return total + (session.skatingDistance || session.walkingDistance || 0);
  }, 0);
};

const calculateTotalSteps = (sessions, mode) => {
  return sessions.reduce((total, session) => {
    if (mode && session.mode !== mode) return total;
    return total + (session.stepCount || 0);
  }, 0);
};

const calculateMaxSpeed = (sessions, mode) => {
  return sessions.reduce((max, session) => {
    if (mode && session.mode !== mode) return max;
    return Math.max(max, session.speedData?.maxSpeed || 0);
  }, 0);
};