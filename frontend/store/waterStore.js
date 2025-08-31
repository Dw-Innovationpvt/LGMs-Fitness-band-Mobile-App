// store/waterStore.js
import { create } from 'zustand';
// import api from '../api';
import api from './api'; // Adjust the import path as necessary
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

const useWaterStore = create((set, get) => ({
  // State for water intake data
  intakes: [],
  todayTotal: 0,
  target: 0, // Default target (can be overridden by API fetch)
  
  // State for UI management
  loading: false,
  error: null,
  
  // Fetch all water intake entries (sorted by date)
  fetchIntakes: async () => {
    set({ loading: true, error: null });
    try {
    //   const response = await api.get(`${API_URL}/water`);
    const response = await api.get('/water');
      set({ 
        intakes: response.data,
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
    }
  },
  
  // Fetch today's total water intake
  fetchTodayTotal: async () => {
    set({ loading: true, error: null });
    try {
    //   const response = await api.get(`${API_URL}/water/total`);
    const response = await api.get('/water/total');
      set({ 
        todayTotal: response.data.totalAmount,
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
    }
  },
  
  // Fetch user's water target
  fetchTarget: async () => {
    set({ loading: true, error: null });
    try {
    //   const response = await api.get(`${API_URL}/water/target`);
    const response = await api.get('/water/target');
      set({ 
        target: response.data.target,
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
    }
  },
  
  // Update water target
  updateTarget: async (newTarget) => {
    if (!newTarget || newTarget <= 0) {
      set({ error: 'Target must be a positive number' });
      return { success: false, error: 'Target must be a positive number' };
    }
    
    set({ loading: true, error: null });
    try {
      const response = await api.put('/water/target', { target: newTarget });
      set({ 
        target: response.data.target,
        loading: false 
      });
      return { success: true };
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },
  
  // Add new water intake
  addIntake: async (amount, date = new Date()) => {
    if (!amount || amount <= 0) {
      set({ error: 'Amount must be a positive number' });
      return { success: false, error: 'Amount must be a positive number' };
    }
    
    set({ loading: true, error: null });
    try {
      const response = await api.post('/water', { amount, date });
      set(state => ({
        intakes: [response.data, ...state.intakes],
        todayTotal: state.todayTotal + amount,
        loading: false
      }));
      return { success: true };
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },
  
  // Calculate progress percentage
  getProgress: () => {
    const { todayTotal, target } = get();
    return target > 0 ? Math.min((todayTotal / target) * 100, 100) : 0;
  },

  refreshAll: async () => {
    await get().fetchIntakes();
    await get().fetchTodayTotal();
    await get().fetchTarget();
  },
  // Reset all water data
  reset: () => set({ 
    intakes: [], 
    todayTotal: 0, 
    target: 2000,
    error: null,
    loading: false 
  })
}));

export default useWaterStore;