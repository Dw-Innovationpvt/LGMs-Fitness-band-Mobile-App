// store/targetStore.js
import { create } from 'zustand';
import { format } from 'date-fns';
// import api from '../services/api';
import api from './api';

const useTargetStore = create((set, get) => ({
  goals: null,
  weeklyGoals: [],
  mealFlag: false,
  burnFlag: false,
  isLoading: false,
  error: null,

  // Fetch goals for a specific date
  fetchGoals: async (dateString) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/goals/get?date=${dateString}`);
      if (response.data.weeklyGoals) {
        // Weekly data returned
        set({
          weeklyGoals: response.data.weeklyGoals,
          mealFlag: response.data.mealFlag,
          burnFlag: response.data.burnFlag,
          isLoading: false,
        });
      } else {
        // Single day data returned
        set({
          goals: response.data,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      set({ 
        error: error.response?.data?.error || 'Failed to fetch goals',
        isLoading: false 
      });
    }
  },

  // Set goal target
  setGoalTarget: async (goalType, target, date) => {
    try {
      const response = await api.put('/goals/set-target', {
        goalType,
        target,
        date: date || new Date(),
      });
      
      // Update local state
      const { goals } = get();
      if (goals && goals.date === response.data.date) {
        const updatedGoals = { ...goals };
        updatedGoals.goals[goalType].target = target;
        set({ goals: updatedGoals });
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to set goal target:', error);
      throw error;
    }
  },

  // Update goal progress
  updateGoalProgress: async (goalType, progress, date) => {
    try {
      const response = await api.put('/goals/update-progress', {
        goalType,
        progress,
        date: date || new Date(),
      });
      
      // Update local state
      const { goals } = get();
      if (goals && goals.date === response.data.date) {
        const updatedGoals = { ...goals };
        updatedGoals.goals[goalType].progress = progress;
        updatedGoals.goals[goalType].achieved = progress >= updatedGoals.goals[goalType].target;
        set({ goals: updatedGoals });
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      throw error;
    }
  },

  // Reset goal progress
  resetGoalProgress: async (goalType, date) => {
    try {
      const response = await api.put('/goals/reset-progress', {
        goalType,
        date: date || new Date(),
      });
      
      // Update local state
      const { goals } = get();
      if (goals && goals.date === response.data.date) {
        const updatedGoals = { ...goals };
        updatedGoals.goals[goalType].progress = 0;
        updatedGoals.goals[goalType].achieved = false;
        set({ goals: updatedGoals });
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to reset goal progress:', error);
      throw error;
    }
  },

  // Check if goal target is met
  checkGoalTarget: async (goalType, date) => {
    try {
      const dateParam = date ? format(date, 'yyyy-MM-dd') : '';
      const response = await api.get(`/goals/get/today-goal-target?goalType=${goalType}&date=${dateParam}`);
      return response.data;
    } catch (error) {
      console.error('Failed to check goal target:', error);
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTargetStore;
