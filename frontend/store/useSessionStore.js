// store/useSessionStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from './api'; // Import the axios instance
import { API_URL } from '../constants/api';

// Use your actual backend URL - adjust as needed
const API_BASE_URL = API_URL; // Change to your actual backend URL

export const useSessionStore = create(
  persist(
    (set, get) => ({
      // State
      sessions: [],
      loading: false,
      error: null,
      stats: null,
      last7DaysData: {},
      
      // Current date filters
      selectedDate: new Date().toISOString().split('T')[0],
      daysRange: 7,
      
      // Mode filters
      selectedMode: 'all',

      // Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setDaysRange: (days) => set({ daysRange: days }),
      setSelectedMode: (mode) => set({ selectedMode: mode }),

      // Get sessions from last N days - FIXED VERSION
      fetchLastDaysSessions: async (days = 7, mode = null) => {
        try {
          set({ loading: true, error: null });
          
          const token = await get().getToken();
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          let url = `${API_BASE_URL}/sessions/last/${days}`;
          
          if (mode) {
            url += `?mode=${mode}`;
          }
          
          console.log('🔍 Fetching last days sessions from:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('📡 Response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = `Server error: ${response.status}`;
            try {
              const errorText = await response.text();
              console.error('Server error response:', errorText);
              
              // Try to parse as JSON for structured error
              try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
              } catch {
                errorMessage = errorText || errorMessage;
              }
            } catch {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log('✅ Last days sessions fetched successfully, data keys:', Object.keys(result.data || {}));
          
          if (result.success) {
            // Store the last 7 days data
            set({ 
              last7DaysData: result.data || {},
              loading: false 
            });
            return result.data || {};
          } else {
            throw new Error(result.message || 'Unknown error occurred');
          }
        } catch (error) {
          console.error('❌ Error in fetchLastDaysSessions:', error);
          set({ 
            error: error.message, 
            loading: false,
            last7DaysData: {} // Reset on error
          });
          throw error;
        }
      },

      // Get sessions by specific date - FIXED VERSION
      fetchSessionsByDate: async (date, mode = null) => {
        try {
          set({ loading: true, error: null });
          
          const token = await get().getToken();
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          let url = `${API_BASE_URL}/sessions/date/${date}`;
          
          if (mode) {
            url += `?mode=${mode}`;
          }
          
          console.log('🔍 Fetching sessions for date:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('📡 Response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = `Server error: ${response.status}`;
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log('✅ Sessions fetched for date:', result.data?.length || 0, 'sessions');
          
          if (result.success) {
            set({ loading: false });
            return result.data || [];
          } else {
            throw new Error(result.message || 'Unknown error occurred');
          }
        } catch (error) {
          console.error('❌ Error in fetchSessionsByDate:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get all sessions with filters - FIXED VERSION
      fetchSessions: async (filters = {}) => {
        try {
          set({ loading: true, error: null });
          
          const token = await get().getToken();
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          const queryParams = new URLSearchParams();
          
          // Add filters to query params
          Object.keys(filters).forEach(key => {
            if (filters[key]) {
              queryParams.append(key, filters[key]);
            }
          });
          
          const url = `${API_BASE_URL}/sessions?${queryParams.toString()}`;
          console.log('🔍 Fetching sessions from:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('📡 Response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = `Server error: ${response.status}`;
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log('✅ Sessions fetched successfully:', result.data?.length || 0, 'sessions');
          
          if (result.success) {
            set({ 
              sessions: result.data || [],
              loading: false 
            });
            return result.data || [];
          } else {
            throw new Error(result.message || 'Unknown error occurred');
          }
        } catch (error) {
          console.error('❌ Error in fetchSessions:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Create new session
      createSession: async (sessionData) => {
        try {
          set({ loading: true, error: null });
          
          const token = await get().getToken();
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          console.log('🔍 Creating session:', sessionData);
          
          const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(sessionData)
          });

          console.log('📡 Create session response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = `Server error: ${response.status}`;
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const result = await response.json();
          
          if (result.success) {
            set((state) => ({
              sessions: [result.data, ...state.sessions],
              loading: false
            }));
            console.log('✅ Session created successfully:', result.data._id);
            return result.data;
          } else {
            throw new Error(result.message || 'Failed to create session');
          }
        } catch (error) {
          console.error('❌ Error in createSession:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Get session statistics
      fetchSessionStats: async (days = 7, mode = null) => {
        try {
          set({ loading: true, error: null });
          
          const token = await get().getToken();
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          let url = `${API_BASE_URL}/sessions/stats/summary?days=${days}`;
          
          if (mode) {
            url += `&mode=${mode}`;
          }
          
          console.log('🔍 Fetching session stats from:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('📡 Response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = `Server error: ${response.status}`;
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log('✅ Session stats fetched successfully');
          
          if (result.success) {
            set({ 
              stats: result.data,
              loading: false 
            });
            return result.data;
          } else {
            throw new Error(result.message || 'Unknown error occurred');
          }
        } catch (error) {
          console.error('❌ Error in fetchSessionStats:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Helper function to get token from AsyncStorage
      getToken: async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          console.log('🔑 Token retrieved from AsyncStorage:', token ? 'Yes' : 'No');
          return token;
        } catch (error) {
          console.error('❌ Error retrieving token from AsyncStorage:', error);
          return null;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () => set({ 
        sessions: [], 
        stats: null, 
        error: null,
        last7DaysData: {},
        selectedDate: new Date().toISOString().split('T')[0],
        daysRange: 7,
        selectedMode: 'all'
      })
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        sessions: state.sessions,
        selectedDate: state.selectedDate,
        daysRange: state.daysRange,
        selectedMode: state.selectedMode,
        last7DaysData: state.last7DaysData
      })
    }
  )
);

// Custom hooks for specific use cases
export const useSpeedSkatingSessions = () => {
  const { sessions, fetchSessions, fetchLastDaysSessions, last7DaysData } = useSessionStore();
  
  const speedSessions = sessions.filter(session => session.mode === 'SS');
  
  const fetchSpeedSessions = (filters = {}) => {
    return fetchSessions({ ...filters, mode: 'SS' });
  };
  
  const fetchLastDaysSpeedSessions = (days) => {
    return fetchLastDaysSessions(days, 'SS');
  };
  
  // Get speed sessions from last7DaysData
  const getSpeedSessionsFromLast7Days = (date) => {
    const dayData = last7DaysData[date] || [];
    return dayData.filter(session => session.mode === 'SS');
  };
  
  return {
    speedSessions,
    fetchSpeedSessions,
    fetchLastDaysSpeedSessions,
    getSpeedSessionsFromLast7Days
  };
};

export const useDistanceSkatingSessions = () => {
  const { sessions, fetchSessions, fetchLastDaysSessions, last7DaysData } = useSessionStore();
  
  const distanceSessions = sessions.filter(session => session.mode === 'SD');
  
  const fetchDistanceSessions = (filters = {}) => {
    return fetchSessions({ ...filters, mode: 'SD' });
  };
  
  const fetchLastDaysDistanceSessions = (days) => {
    return fetchLastDaysSessions(days, 'SD');
  };
  
  // Get distance sessions from last7DaysData
  const getDistanceSessionsFromLast7Days = (date) => {
    const dayData = last7DaysData[date] || [];
    return dayData.filter(session => session.mode === 'SD');
  };
  
  return {
    distanceSessions,
    fetchDistanceSessions,
    fetchLastDaysDistanceSessions,
    getDistanceSessionsFromLast7Days
  };
};

export const useStepCountingSessions = () => {
  const { sessions, fetchSessions, fetchLastDaysSessions, last7DaysData } = useSessionStore();
  
  const stepSessions = sessions.filter(session => session.mode === 'S');
  
  const fetchStepSessions = (filters = {}) => {
    return fetchSessions({ ...filters, mode: 'S' });
  };
  
  const fetchLastDaysStepSessions = (days) => {
    return fetchLastDaysSessions(days, 'S');
  };
  
  // Get step sessions from last7DaysData
  const getStepSessionsFromLast7Days = (date) => {
    const dayData = last7DaysData[date] || [];
    return dayData.filter(session => session.mode === 'S');
  };
  
  return {
    stepSessions,
    fetchStepSessions,
    fetchLastDaysStepSessions,
    getStepSessionsFromLast7Days
  };
};

// Hook for getting last 7 days data with dates
export const useLast7DaysData = (mode = null) => {
  const { fetchLastDaysSessions, last7DaysData, loading, error } = useSessionStore();
  
  const getLast7DaysWithData = async () => {
    try {
      await fetchLastDaysSessions(7, mode);
      
      // Ensure we have all 7 days, even if no data
      const last7Days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        const daySessions = last7DaysData[dateKey] || [];
        
        // Filter by mode if specified
        const filteredSessions = mode 
          ? daySessions.filter(session => session.mode === mode)
          : daySessions;
        
        last7Days.push({
          date: dateKey,
          displayDate: formatDisplayDate(date),
          sessions: filteredSessions,
          totalDistance: calculateTotalDistance(filteredSessions),
          totalSteps: calculateTotalSteps(filteredSessions),
          maxSpeed: calculateMaxSpeed(filteredSessions)
        });
      }
      
      return last7Days.reverse(); // Return from oldest to newest
    } catch (error) {
      console.error('Error in getLast7DaysWithData:', error);
      return [];
    }
  };
  
  return {
    getLast7DaysWithData,
    last7DaysData,
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

const calculateTotalDistance = (sessions) => {
  return sessions.reduce((total, session) => {
    return total + (session.skatingDistance || session.walkingDistance || 0);
  }, 0);
};

const calculateTotalSteps = (sessions) => {
  return sessions.reduce((total, session) => {
    return total + (session.stepCount || 0);
  }, 0);
};

const calculateMaxSpeed = (sessions) => {
  return sessions.reduce((max, session) => {
    return Math.max(max, session.speedData?.maxSpeed || 0);
  }, 0);
};