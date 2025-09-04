// store/waterStore.js
import { create } from 'zustand';
import api from './api'; // Adjust the import path as necessary
import { format } from 'date-fns';
import { API_URL } from '../constants/api';

const useWaterStore = create((set, get) => ({
  // State for water intake data
  intakes: [],
  todayTotal: 0,
  target: 2000,
  selectedDate: null,

  // State for UI management
  loading: false,
  error: null,

  // Fetch water intake entries for a specific date
  fetchIntakes: async (dateString) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/water?date=${dateString}`);
      set({
        intakes: response.data || [],
        selectedDate: dateString,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || err.message,
        loading: false,
      });
    }
  },

  // Fetch total water intake for a specific date
  fetchTodayTotal: async (dateString) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/water/total?date=${dateString}`);
      set({
        todayTotal: response.data.totalAmount || 0,
        selectedDate: dateString,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || err.message,
        loading: false,
      });
    }
  },

  // Fetch user's water target
  fetchTarget: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/water/target');
      set({
        target: response.data.target || 2000,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || err.message,
        loading: false,
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
        loading: false,
      });
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.error || err.message,
        loading: false,
      });
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },

  // Add new water intake
  addIntake: async (amount, dateString) => {
    if (!amount || amount <= 0) {
      set({ error: 'Amount must be a positive number' });
      return { success: false, error: 'Amount must be a positive number' };
    }
    set({ loading: true, error: null });
    try {
      const response = await api.post('/water', { amount, date: dateString });
      set((state) => {
        const isSameDay = format(new Date(dateString), 'yyyy-MM-dd') === state.selectedDate;
        return {
          intakes: isSameDay ? [response.data, ...state.intakes] : state.intakes,
          todayTotal: isSameDay ? state.todayTotal + amount : state.todayTotal,
          loading: false,
        };
      });
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.error || err.message,
        loading: false,
      });
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },

  // Calculate progress percentage
  getProgress: () => {
    const { todayTotal, target } = get();
    return target > 0 ? Math.min((todayTotal / target) * 100, 100) : 0;
  },

  // Refresh all water data for a specific date
  refreshAll: async (dateString) => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchIntakes(dateString),
        get().fetchTodayTotal(dateString),
        get().fetchTarget(),
      ]);
    } catch (err) {
      set({
        error: err.response?.data?.error || err.message,
        loading: false,
      });
    }
  },

  // Reset all water data
  reset: () => set({
    intakes: [],
    todayTotal: 0,
    target: 2000,
    selectedDate: null,
    error: null,
    loading: false,
  }),
}));

export default useWaterStore;
// // store/waterStore.js
// import { create } from 'zustand';
// import api from './api'; // Adjust the import path as necessary
// import { format } from 'date-fns';
// import { API_URL } from '../constants/api';

// const useWaterStore = create((set, get) => ({
//   // State for water intake data
//   intakes: [],
//   todayTotal: 0,
//   target: 2000, // Default target (can be overridden by API fetch)
//   selectedDate: null, // Store the currently selected date for comparison

//   // State for UI management
//   loading: false,
//   error: null,

//   // Fetch water intake entries for a specific date
//   fetchIntakes: async (dateString) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await api.get(`/api/water-intakes?date=${dateString}`);
//       set({
//         intakes: response.data || [],
//         selectedDate: dateString,
//         loading: false,
//       });
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || err.message,
//         loading: false,
//       });
//     }
//   },

//   // Fetch total water intake for a specific date
//   fetchTodayTotal: async (dateString) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await api.get(`/api/water-intakes/total?date=${dateString}`);
//       set({
//         todayTotal: response.data.totalAmount || 0,
//         selectedDate: dateString,
//         loading: false,
//       });
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || err.message,
//         loading: false,
//       });
//     }
//   },

//   // Fetch user's water target
//   fetchTarget: async () => {
//     set({ loading: true, error: null });
//     try {
//       const response = await api.get('/api/water-intakes/target');
//       set({
//         target: response.data.target || 2000,
//         loading: false,
//       });
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || err.message,
//         loading: false,
//       });
//     }
//   },

//   // Update water target
//   updateTarget: async (newTarget) => {
//     if (!newTarget || newTarget <= 0) {
//       set({ error: 'Target must be a positive number' });
//       return { success: false, error: 'Target must be a positive number' };
//     }
//     set({ loading: true, error: null });
//     try {
//       const response = await api.put('/api/water-intakes/target', { target: newTarget });
//       set({
//         target: response.data.target,
//         loading: false,
//       });
//       return { success: true };
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || err.message,
//         loading: false,
//       });
//       return { success: false, error: err.response?.data?.error || err.message };
//     }
//   },

//   // Add new water intake
//   addIntake: async (amount, dateString) => {
//     if (!amount || amount <= 0) {
//       set({ error: 'Amount must be a positive number' });
//       return { success: false, error: 'Amount must be a positive number' };
//     }
//     set({ loading: true, error: null });
//     try {
//       const response = await api.post('/api/water-intakes', { amount, date: dateString });
//       set((state) => {
//         const isSameDay = format(new Date(dateString), 'yyyy-MM-dd') === state.selectedDate;
//         return {
//           intakes: isSameDay ? [response.data, ...state.intakes] : state.intakes,
//           todayTotal: isSameDay ? state.todayTotal + amount : state.todayTotal,
//           loading: false,
//         };
//       });
//       return { success: true };
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || err.message,
//         loading: false,
//       });
//       return { success: false, error: err.response?.data?.error || err.message };
//     }
//   },

//   // Calculate progress percentage
//   getProgress: () => {
//     const { todayTotal, target } = get();
//     return target > 0 ? Math.min((todayTotal / target) * 100, 100) : 0;
//   },

//   // Refresh all water data for a specific date
//   refreshAll: async (dateString) => {
//     set({ loading: true, error: null });
//     try {
//       await Promise.all([
//         get().fetchIntakes(dateString),
//         get().fetchTodayTotal(dateString),
//         get().fetchTarget(),
//       ]);
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || err.message,
//         loading: false,
//       });
//     }
//   },

//   // Reset all water data
//   reset: () => set({
//     intakes: [],
//     todayTotal: 0,
//     target: 2000,
//     selectedDate: null,
//     error: null,
//     loading: false,
//   }),
// }));

// export default useWaterStore;

// // // store/waterStore.js
// // import { create } from 'zustand';
// // // import api from '../api';
// // import api from './api'; // Adjust the import path as necessary
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_URL } from "../constants/api";

// // const useWaterStore = create((set, get) => ({
// //   // State for water intake data
// //   intakes: [],
// //   todayTotal: 0,
// //   target: 0, // Default target (can be overridden by API fetch)
  
// //   // State for UI management
// //   loading: false,
// //   error: null,
  
// //   // Fetch all water intake entries (sorted by date)
// //   fetchIntakes: async () => {
// //     set({ loading: true, error: null });
// //     try {
// //     //   const response = await api.get(`${API_URL}/water`);
// //     const response = await api.get('/water');
// //       set({ 
// //         intakes: response.data,
// //         loading: false 
// //       });
// //     } catch (err) {
// //       set({ 
// //         error: err.response?.data?.error || err.message,
// //         loading: false 
// //       });
// //     }
// //   },
  
// //   // Fetch today's total water intake
// //   fetchTodayTotal: async () => {
// //     set({ loading: true, error: null });
// //     try {
// //     //   const response = await api.get(`${API_URL}/water/total`);
// //     const response = await api.get('/water/total');
// //       set({ 
// //         todayTotal: response.data.totalAmount,
// //         loading: false 
// //       });
// //     } catch (err) {
// //       set({ 
// //         error: err.response?.data?.error || err.message,
// //         loading: false 
// //       });
// //     }
// //   },
  
// //   // Fetch user's water target
// //   fetchTarget: async () => {
// //     set({ loading: true, error: null });
// //     try {
// //     //   const response = await api.get(`${API_URL}/water/target`);
// //     const response = await api.get('/water/target');
// //       set({ 
// //         target: response.data.target,
// //         loading: false 
// //       });
// //     } catch (err) {
// //       set({ 
// //         error: err.response?.data?.error || err.message,
// //         loading: false 
// //       });
// //     }
// //   },
  
// //   // Update water target
// //   updateTarget: async (newTarget) => {
// //     if (!newTarget || newTarget <= 0) {
// //       set({ error: 'Target must be a positive number' });
// //       return { success: false, error: 'Target must be a positive number' };
// //     }
    
// //     set({ loading: true, error: null });
// //     try {
// //       const response = await api.put('/water/target', { target: newTarget });
// //       set({ 
// //         target: response.data.target,
// //         loading: false 
// //       });
// //       return { success: true };
// //     } catch (err) {
// //       set({ 
// //         error: err.response?.data?.error || err.message,
// //         loading: false 
// //       });
// //       return { success: false, error: err.response?.data?.error || err.message };
// //     }
// //   },
  
// //   // Add new water intake
// //   addIntake: async (amount, date = new Date()) => {
// //     if (!amount || amount <= 0) {
// //       set({ error: 'Amount must be a positive number' });
// //       return { success: false, error: 'Amount must be a positive number' };
// //     }
    
// //     set({ loading: true, error: null });
// //     try {
// //       const response = await api.post('/water', { amount, date });
// //       set(state => ({
// //         intakes: [response.data, ...state.intakes],
// //         todayTotal: state.todayTotal + amount,
// //         loading: false
// //       }));
// //       return { success: true };
// //     } catch (err) {
// //       set({ 
// //         error: err.response?.data?.error || err.message,
// //         loading: false 
// //       });
// //       return { success: false, error: err.response?.data?.error || err.message };
// //     }
// //   },
  
// //   // Calculate progress percentage
// //   getProgress: () => {
// //     const { todayTotal, target } = get();
// //     return target > 0 ? Math.min((todayTotal / target) * 100, 100) : 0;
// //   },

// //   refreshAll: async () => {
// //     await get().fetchIntakes();
// //     await get().fetchTodayTotal();
// //     await get().fetchTarget();
// //   },
// //   // Reset all water data
// //   reset: () => set({ 
// //     intakes: [], 
// //     todayTotal: 0, 
// //     target: 2000,
// //     error: null,
// //     loading: false 
// //   })
// // }));

// // export default useWaterStore;