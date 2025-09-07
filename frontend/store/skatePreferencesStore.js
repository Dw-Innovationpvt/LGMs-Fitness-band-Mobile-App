// skatePreferencesStore.js
import { create } from 'zustand';
import api from './api';

export const useSkatePreferencesStore = create((set, get) => ({
  wheelOptions: { inline: 90, quad: 56 },
  activeWheelType: 'inline',
  activeWheelDiameter: 90,
  loading: false,
  error: null,
  // Add a callback system
  updateCallbacks: new Set(),

  // Register callback
  onPreferencesUpdate: (callback) => {
    const { updateCallbacks } = get();
    updateCallbacks.add(callback);
    return () => updateCallbacks.delete(callback);
  },

  // Notify all callbacks
  notifyPreferencesUpdate: (preferences) => {
    const { updateCallbacks } = get();
    updateCallbacks.forEach(callback => callback(preferences));
  },

  // Fetch preferences from backend
  fetchPreferences: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/skate');
      const newPreferences = {
        wheelOptions: res.data.wheelOptions,
        activeWheelType: res.data.activeWheelType,
        activeWheelDiameter: res.data.activeWheelDiameter,
      };
      set({ ...newPreferences, loading: false, error: null });
      return newPreferences;
    } catch (err) {
      const error = err.response?.data?.message || err.message;
      set({ loading: false, error });
      throw new Error(error);
    }
  },

  // Set preferences (update backend and local state)
  setPreferences: async ({ skateType, wheelDiameter, setActive = true }) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/skate', { 
        skateType, 
        wheelDiameter, 
        setActive 
      });
      
      const newPreferences = {
        wheelOptions: res.data.data.wheelOptions,
        activeWheelType: res.data.data.activeWheelType,
        activeWheelDiameter: res.data.data.activeWheelDiameter,
      };
      
      set({ ...newPreferences, loading: false, error: null });
      
      // Notify all registered callbacks
      get().notifyPreferencesUpdate(newPreferences);
      
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || err.message;
      set({ loading: false, error });
      return { success: false, error };
    }
  }
}));