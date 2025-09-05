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


// import create from 'zustand';
// import api from './api'; // Import your custom axios instance

// const useTargetStore = create((set) => ({
//   goals: null,
//   weeklyGoals: [],
//   mealFlag: false,
//   burnFlag: false,
//   fetchGoals: async (date) => {
//     try {
//       const endpoint = date 
//         ? `/goals/get?date=${date.toISOString().split('T')[0]}`
//         : '/goals/get';
      
//       const response = await api.get(endpoint);
      
//       if (date) {
//         set({ goals: response.data.goals, date: response.data.date });
//       } else {
//         set({
//           weeklyGoals: response.data.weeklyGoals,
//           mealFlag: response.data.mealFlag,
//           burnFlag: response.data.burnFlag,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching goals:', error);
//     }
//   },
//   updateProgress: async (goalType, progress, date) => {
//     try {
//       const response = await api.put('/goals/update-progress', {
//         goalType,
//         progress,
//         date: date?.toISOString().split('T')[0]
//       });
      
//       set((state) => ({
//         goals: state.goals && state.goals.date === response.data.date
//           ? { ...state.goals, [goalType]: { ...state.goals[goalType], progress: response.data.progress } }
//           : state.goals,
//       }));
//     } catch (error) {
//       console.error('Error updating progress:', error);
//     }
//   },
//   setTarget: async (goalType, target, date) => {
//     try {
//       const response = await api.put('/goals/set-target', {
//         goalType,
//         target,
//         date: date?.toISOString().split('T')[0]
//       });
      
//       set((state) => ({
//         goals: state.goals && state.goals.date === response.data.date
//           ? { ...state.goals, [goalType]: { ...state.goals[goalType], target: response.data.target } }
//           : state.goals,
//       }));
//     } catch (error) {
//       console.error('Error setting target:', error);
//     }
//   },
// }));

// export default useTargetStore;


// // import create from 'zustand';
// // import axios from 'axios';

// // const useTargetStore = create((set) => ({
// //   goals: null,
// //   weeklyGoals: [],
// //   mealFlag: false,
// //   burnFlag: false,
// //   fetchGoals: async (date) => {
// //     try {
// //       const response = await axios.get(date ? `/api/goals/get?date=${date.toISOString().split('T')[0]}` : '/api/goals/get', {
// //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
// //       });
// //       if (date) {
// //         set({ goals: response.data.goals, date: response.data.date });
// //       } else {
// //         set({
// //           weeklyGoals: response.data.weeklyGoals,
// //           mealFlag: response.data.mealFlag,
// //           burnFlag: response.data.burnFlag,
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error fetching goals:', error);
// //     }
// //   },
// //   updateProgress: async (goalType, progress, date) => {
// //     try {
// //       const response = await axios.put(
// //         '/api/goals/update-progress',
// //         { goalType, progress, date: date?.toISOString().split('T')[0] },
// //         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
// //       );
// //       set((state) => ({
// //         goals: state.goals && state.goals.date === response.data.date
// //           ? { ...state.goals, [goalType]: { ...state.goals[goalType], progress: response.data.progress } }
// //           : state.goals,
// //       }));
// //     } catch (error) {
// //       console.error('Error updating progress:', error);
// //     }
// //   },
// //   setTarget: async (goalType, target, date) => {
// //     try {
// //       const response = await axios.put(
// //         '/api/goals/set-target',
// //         { goalType, target, date: date?.toISOString().split('T')[0] },
// //         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
// //       );
// //       set((state) => ({
// //         goals: state.goals && state.goals.date === response.data.date
// //           ? { ...state.goals, [goalType]: { ...state.goals[goalType], target: response.data.target } }
// //           : state.goals,
// //       }));
// //     } catch (error) {
// //       console.error('Error setting target:', error);
// //     }
// //   },
// // }));

// // export default useTargetStore;



// // // import { create } from 'zustand';
// // // import axios from 'axios';
// // // import { format } from 'date-fns';

// // // const useTargetStore = create((set) => ({
// // //   todayTarget: null,
// // //   isLoading: false,
// // //   error: null,

// // //   // Fetch goals for the current day
// // //   fetchTodayTarget: async () => {
// // //     set({ isLoading: true, error: null });
// // //     try {
// // //       const response = await axios.get('/api/goals/get', {
// // //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
// // //       });
// // //       const todayGoals = response.data.weeklyGoals.find(g => 
// // //         isSameDay(new Date(g.date), new Date())
// // //       );
// // //       set({
// // //         todayTarget: todayGoals ? {
// // //           date: new Date(todayGoals.date),
// // //           targets: {
// // //             water: todayGoals.goals.water.target,
// // //             steps: todayGoals.goals.steps.target,
// // //             caloriesEarn: todayGoals.goals.caloriesEarned.target,
// // //             caloriesBurn: todayGoals.goals.caloriesBurned.target,
// // //           },
// // //           progress: {
// // //             water: todayGoals.goals.water.progress,
// // //             steps: todayGoals.goals.steps.progress,
// // //             caloriesEarn: todayGoals.goals.caloriesEarned.progress,
// // //             caloriesBurn: todayGoals.goals.caloriesBurned.progress,
// // //           },
// // //           completed: {
// // //             water: todayGoals.goals.water.achieved,
// // //             steps: todayGoals.goals.steps.achieved,
// // //             caloriesEarn: todayGoals.goals.caloriesEarned.achieved,
// // //             caloriesBurn: todayGoals.goals.caloriesBurned.achieved,
// // //           },
// // //         } : null,
// // //         isLoading: false,
// // //       });
// // //     } catch (error) {
// // //       set({ error: error.message, isLoading: false });
// // //     }
// // //   },

// // //   // Fetch goals for a specific date
// // //   fetchTargetByDate: async (date) => {
// // //     set({ isLoading: true, error: null });
// // //     try {
// // //       const dateString = format(date, 'yyyy-MM-dd');
// // //       const response = await axios.get(`/api/goals/get?date=${dateString}`, {
// // //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
// // //       });
// // //       const goals = response.data.goals ? {
// // //         date: new Date(response.data.date),
// // //         targets: {
// // //           water: response.data.goals.water.target,
// // //           steps: response.data.goals.steps.target,
// // //           caloriesEarn: response.data.goals.caloriesEarned.target,
// // //           caloriesBurn: response.data.goals.caloriesBurned.target,
// // //         },
// // //         progress: {
// // //           water: response.data.goals.water.progress,
// // //           steps: response.data.goals.steps.progress,
// // //           caloriesEarn: response.data.goals.caloriesEarned.progress,
// // //           caloriesBurn: response.data.goals.caloriesBurned.progress,
// // //         },
// // //         completed: {
// // //           water: response.data.goals.water.achieved,
// // //           steps: response.data.goals.steps.achieved,
// // //           caloriesEarn: response.data.goals.caloriesEarned.achieved,
// // //           caloriesBurn: response.data.goals.caloriesBurned.achieved,
// // //         },
// // //       } : null;
// // //       set({ todayTarget: goals, isLoading: false });
// // //     } catch (error) {
// // //       set({ error: error.message, isLoading: false });
// // //     }
// // //   },
// // // }));

// // // export default useTargetStore;


// // // // // stores/targetStore.js
// // // // import { create } from 'zustand';
// // // // import api from './api';
// // // // import { useCaloriesStore } from './caloriesStore';
// // // // import useWaterStore from './waterStore';

// // // // // Define the initial state and actions for your store
// // // // const useTargetStore = create((set, get) => ({
// // // //   // The state properties
// // // //   todayTarget: null, // Will hold the daily target object
// // // //   isLoading: false,
// // // //   error: null,

// // // //   // Actions (functions to interact with the state)

// // // //   /**
// // // //    * Fetches the current day's target data from the backend.
// // // //    * This should be called when the application loads.
// // // //    */
// // // //   fetchTodayTarget: async () => {
// // // //     set({ isLoading: true, error: null });
// // // //     try {
// // // //       // Use axios to make the GET request
// // // //       const response = await api.get('/targets/today');
// // // //       set({ todayTarget: response.data, isLoading: false });
// // // //     } catch (err) {
// // // //       if (err.response && err.response.status === 404) {
// // // //         // If the server responds with a 404 (no target found), we set the state to null
// // // //         set({ todayTarget: null, isLoading: false });
// // // //       } else {
// // // //         console.error("Error fetching today's target:", err);
// // // //         set({ error: err.message, isLoading: false });
// // // //       }
// // // //     }
// // // //   },

// // // //   /**
// // // //    * Fetches the target data for a specific date from the backend.
// // // //    * This is used to retrieve data for any day, including yesterday.
// // // //    *
// // // //    * @param {Date | string} date - The date to fetch data for.
// // // //    */
// // // //   fetchTargetByDate: async (date) => {
// // // //     set({ isLoading: true, error: null });
// // // //     // Convert the date to a 'YYYY-MM-DD' format for the URL
// // // //     const formattedDate = new Date(date).toISOString().split('T')[0];

// // // //     try {
// // // //       // Use axios to make the GET request
// // // //       const response = await api.get(`/targets/${formattedDate}`);
// // // //       set({ todayTarget: response.data, isLoading: false });
// // // //     } catch (err) {
// // // //       if (err.response && err.response.status === 404) {
// // // //         // If the server responds with a 404 (no target found), we set the state to null
// // // //         set({ todayTarget: null, isLoading: false });
// // // //       } else {
// // // //         console.error("Error fetching target by date:", err);
// // // //         set({ error: err.message, isLoading: false });
// // // //       }
// // // //     }
// // // //   },

// // // //   /**
// // // //    * Updates a specific part of the current day's target data on the backend.
// // // //    *
// // // //    * @param {object} updatedFields - An object containing the fields to update (e.g., { "progress.water": 1500 }).
// // // //    */
// // // //   updateTarget: async (updatedFields) => {
// // // //     // Optimistically update the state first for a smoother UI experience
// // // //     const currentState = get().todayTarget;
// // // //     set({
// // // //       todayTarget: {
// // // //         ...currentState,
// // // //         progress: {
// // // //           ...currentState.progress,
// // // //           ...updatedFields.progress,
// // // //         },
// // // //         targets: {
// // // //           ...currentState.targets,
// // // //           ...updatedFields.targets,
// // // //         },
// // // //         completed: {
// // // //           ...currentState.completed,
// // // //           ...updatedFields.completed,
// // // //         },
// // // //       },
// // // //       error: null,
// // // //     });

// // // //     try {
// // // //       // Use axios to make the POST request with the data in the body
// // // //       const response = await api.post('/targets', {
// // // //         date: currentState.date,
// // // //         targets: updatedFields.targets || currentState.targets,
// // // //         progress: updatedFields.progress || currentState.progress,
// // // //         completed: updatedFields.completed || currentState.completed,
// // // //       });

// // // //       // The backend response is the final source of truth
// // // //       set({ todayTarget: response.data, isLoading: false });
// // // //     } catch (err) {
// // // //       console.error("Error updating target:", err);
// // // //       // Revert the state to its previous value if the update fails
// // // //       set({ error: err.message, todayTarget: currentState });
// // // //     }
// // // //   },

// // // //   /**
// // // //    * A new helper function to sync progress data from useWaterStore and useCaloriesStore.
// // // //    */
// // // //   syncProgressWithSources: async () => {
// // // //     // Add a check to prevent running if no target exists
// // // //     if (!get().todayTarget) {
// // // //       console.log("No target found for the current date. Skipping sync.");
// // // //       return;
// // // //     }
    
// // // //     const { totalCaloriesEaten, totalCaloriesBurned } = useCaloriesStore.getState();
// // // //     const { todayTotal } = useWaterStore.getState();
    
// // // //     // Construct the updated fields object for the updateTarget function
// // // //     const updatedFields = {
// // // //       progress: {
// // // //         caloriesEarn: totalCaloriesEaten,
// // // //         caloriesBurn: totalCaloriesBurned,
// // // //         water: todayTotal,
// // // //       }
// // // //     };
    
// // // //     // Call the existing updateTarget action with the new fields
// // // //     await get().updateTarget(updatedFields);
// // // //   },

// // // //   /**
// // // //    * A simple setter for the entire state, useful for manual state updates
// // // //    * or when creating a new document after a 404 response.
// // // //    * @param {object} data - The new target object.
// // // //    */
// // // //   setTodayTarget: (data) => set({ todayTarget: data }),

// // // // }));

// // // // export default useTargetStore;






// // // // // stores/targetStore.js

// // // // // import { create } from 'zustand';
// // // // // import api from './api';
// // // // // import { useCaloriesStore } from './caloriesStore';
// // // // // import useWaterStore from './waterStore';

// // // // // // Define the initial state and actions for your store
// // // // // const useTargetStore = create((set, get) => ({
// // // // //   // The state properties
// // // // //   todayTarget: null, // Will hold the daily target object
// // // // //   isLoading: false,
// // // // //   error: null,

// // // // //   // Actions (functions to interact with the state)

// // // // //   /**
// // // // //    * Fetches the current day's target data from the backend.
// // // // //    * This should be called when the application loads.
// // // // //    */
// // // // //   fetchTodayTarget: async () => {
// // // // //     set({ isLoading: true, error: null });
// // // // //     try {
// // // // //       // Use axios to make the GET request
// // // // //       const response = await api.get('/targets/today');
// // // // //       set({ todayTarget: response.data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       if (err.response && err.response.status === 404) {
// // // // //         // If the server responds with a 404 (no target found), we set the state to null
// // // // //         set({ todayTarget: null, isLoading: false });
// // // // //       } else {
// // // // //         console.error("Error fetching today's target:", err);
// // // // //         set({ error: err.message, isLoading: false });
// // // // //       }
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Fetches the target data for a specific date from the backend.
// // // // //    * This is used to retrieve data for any day, including yesterday.
// // // // //    *
// // // // //    * @param {Date | string} date - The date to fetch data for.
// // // // //    */
// // // // //   fetchTargetByDate: async (date) => {
// // // // //     set({ isLoading: true, error: null });
// // // // //     // Convert the date to a 'YYYY-MM-DD' format for the URL
// // // // //     const formattedDate = new Date(date).toISOString().split('T')[0];

// // // // //     try {
// // // // //       // Use axios to make the GET request
// // // // //       const response = await api.get(`/targets/${formattedDate}`);
// // // // //       set({ todayTarget: response.data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       if (err.response && err.response.status === 404) {
// // // // //         // If the server responds with a 404 (no target found), we set the state to null
// // // // //         set({ todayTarget: null, isLoading: false });
// // // // //       } else {
// // // // //         console.error("Error fetching target by date:", err);
// // // // //         set({ error: err.message, isLoading: false });
// // // // //       }
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Updates a specific part of the current day's target data on the backend.
// // // // //    *
// // // // //    * @param {object} updatedFields - An object containing the fields to update (e.g., { "progress.water": 1500 }).
// // // // //    */
// // // // //   updateTarget: async (updatedFields) => {
// // // // //     // Optimistically update the state first for a smoother UI experience
// // // // //     const currentState = get().todayTarget;
// // // // //     set({
// // // // //       todayTarget: {
// // // // //         ...currentState,
// // // // //         progress: {
// // // // //           ...currentState.progress,
// // // // //           ...updatedFields.progress,
// // // // //         },
// // // // //         targets: {
// // // // //           ...currentState.targets,
// // // // //           ...updatedFields.targets,
// // // // //         },
// // // // //         completed: {
// // // // //           ...currentState.completed,
// // // // //           ...updatedFields.completed,
// // // // //         },
// // // // //       },
// // // // //       error: null,
// // // // //     });

// // // // //     try {
// // // // //       // Use axios to make the POST request with the data in the body
// // // // //       const response = await api.post('/targets', {
// // // // //         date: currentState.date,
// // // // //         targets: updatedFields.targets || currentState.targets,
// // // // //         progress: updatedFields.progress || currentState.progress,
// // // // //         completed: updatedFields.completed || currentState.completed,
// // // // //       });

// // // // //       // The backend response is the final source of truth
// // // // //       set({ todayTarget: response.data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       console.error("Error updating target:", err);
// // // // //       // Revert the state to its previous value if the update fails
// // // // //       set({ error: err.message, todayTarget: currentState });
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * A new helper function to sync progress data from useWaterStore and useCaloriesStore.
// // // // //    */
// // // // //   syncProgressWithSources: async () => {
// // // // //     const { totalCaloriesEaten, totalCaloriesBurned } = useCaloriesStore.getState();
// // // // //     const { todayTotal } = useWaterStore.getState();
    
// // // // //     // Construct the updated fields object for the updateTarget function
// // // // //     const updatedFields = {
// // // // //       progress: {
// // // // //         caloriesEarn: totalCaloriesEaten,
// // // // //         caloriesBurn: totalCaloriesBurned,
// // // // //         water: todayTotal,
// // // // //       }
// // // // //     };
    
// // // // //     // Call the existing updateTarget action with the new fields
// // // // //     await get().updateTarget(updatedFields);
// // // // //   },

// // // // //   /**
// // // // //    * A simple setter for the entire state, useful for manual state updates
// // // // //    * or when creating a new document after a 404 response.
// // // // //    * @param {object} data - The new target object.
// // // // //    */
// // // // //   setTodayTarget: (data) => set({ todayTarget: data }),

// // // // // }));

// // // // // export default useTargetStore;

















// // // // // // stores/targetStore.js
// // // // // import { create } from 'zustand';
// // // // // import api from './api';

// // // // // // Define the initial state and actions for your store
// // // // // const useTargetStore = create((set, get) => ({
// // // // //   // The state properties
// // // // //   todayTarget: null, // Will hold the daily target object
// // // // //   isLoading: false,
// // // // //   error: null,

// // // // //   // Actions (functions to interact with the state)

// // // // //   /**
// // // // //    * Fetches the current day's target data from the backend.
// // // // //    * This should be called when the application loads.
// // // // //    */
// // // // //   fetchTodayTarget: async () => {
// // // // //     set({ isLoading: true, error: null });
// // // // //     try {
// // // // //       // Use axios to make the GET request
// // // // //       const response = await api.get('/targets/today');
// // // // //       set({ todayTarget: response.data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       if (err.response && err.response.status === 404) {
// // // // //         // If the server responds with a 404 (no target found), we set the state to null
// // // // //         set({ todayTarget: null, isLoading: false });
// // // // //       } else {
// // // // //         console.error("Error fetching today's target:", err);
// // // // //         set({ error: err.message, isLoading: false });
// // // // //       }
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Fetches the target data for a specific date from the backend.
// // // // //    * This is used to retrieve data for any day, including yesterday.
// // // // //    *
// // // // //    * @param {Date | string} date - The date to fetch data for.
// // // // //    */
// // // // //   fetchTargetByDate: async (date) => {
// // // // //     set({ isLoading: true, error: null });
// // // // //     // Convert the date to a 'YYYY-MM-DD' format for the URL
// // // // //     const formattedDate = new Date(date).toISOString().split('T')[0];

// // // // //     try {
// // // // //       // Use axios to make the GET request
// // // // //       const response = await api.get(`/targets/${formattedDate}`);
// // // // //       set({ todayTarget: response.data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       if (err.response && err.response.status === 404) {
// // // // //         // If the server responds with a 404 (no target found), we set the state to null
// // // // //         set({ todayTarget: null, isLoading: false });
// // // // //       } else {
// // // // //         console.error("Error fetching target by date:", err);
// // // // //         set({ error: err.message, isLoading: false });
// // // // //       }
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Updates a specific part of the current day's target data on the backend.
// // // // //    *
// // // // //    * @param {object} updatedFields - An object containing the fields to update (e.g., { "progress.water": 1500 }).
// // // // //    */
// // // // //   updateTarget: async (updatedFields) => {
// // // // //     // Optimistically update the state first for a smoother UI experience
// // // // //     const currentState = get().todayTarget;
// // // // //     set({
// // // // //       todayTarget: {
// // // // //         ...currentState,
// // // // //         progress: {
// // // // //           ...currentState.progress,
// // // // //           ...updatedFields.progress,
// // // // //         },
// // // // //         targets: {
// // // // //           ...currentState.targets,
// // // // //           ...updatedFields.targets,
// // // // //         },
// // // // //         completed: {
// // // // //           ...currentState.completed,
// // // // //           ...updatedFields.completed,
// // // // //         },
// // // // //       },
// // // // //       error: null,
// // // // //     });

// // // // //     try {
// // // // //       // Use axios to make the POST request with the data in the body
// // // // //       const response = await api.post('/targets', {
// // // // //         date: currentState.date,
// // // // //         targets: updatedFields.targets || currentState.targets,
// // // // //         progress: updatedFields.progress || currentState.progress,
// // // // //         completed: updatedFields.completed || currentState.completed,
// // // // //       });

// // // // //       // The backend response is the final source of truth
// // // // //       set({ todayTarget: response.data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       console.error("Error updating target:", err);
// // // // //       // Revert the state to its previous value if the update fails
// // // // //       set({ error: err.message, todayTarget: currentState });
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * A simple setter for the entire state, useful for manual state updates
// // // // //    * or when creating a new document after a 404 response.
// // // // //    * @param {object} data - The new target object.
// // // // //    */
// // // // //   setTodayTarget: (data) => set({ todayTarget: data }),

// // // // // }));

// // // // // export default useTargetStore;
// // // // // // stores/targetStore.js
// // // // // import { create } from 'zustand';
// // // // // import api from './api';
// // // // // import { API_URL } from '../constants/api';

// // // // // // Define the initial state and actions for your store
// // // // // const useTargetStore = create((set, get) => ({
// // // // //   // The state properties
// // // // //   todayTarget: null, // Will hold the daily target object
// // // // //   isLoading: false,
// // // // //   error: null,

// // // // //   // Actions (functions to interact with the state)

// // // // //   /**
// // // // //    * Fetches the current day's target data from the backend.
// // // // //    * This should be called when the application loads.
// // // // //    */
// // // // //   fetchTodayTarget: async () => {
// // // // //     set({ isLoading: true, error: null });
// // // // //     try {
// // // // //             //   const res = await api.put("/meals/set-burn-target", { burnTarget });
// // // // //       const response = await fetch(`${API_URL}/targets/today`);
// // // // //     //   const response = await api.get("/targets/today");
// // // // //       if (!response.ok) {
// // // // //         // If the server responds with a 404 (no target found), we set the state to null
// // // // //         if (response.status === 404) {
// // // // //           set({ todayTarget: null, isLoading: false });
// // // // //           return;
// // // // //         }
// // // // //         throw new Error('Failed to fetch today\'s target data');
// // // // //       }
// // // // //       const data = await response.json();
// // // // //       set({ todayTarget: data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       console.error("Error fetching today's target:", err);
// // // // //       set({ error: err.message, isLoading: false });
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Fetches the target data for a specific date from the backend.
// // // // //    * This is used to retrieve data for any day, including yesterday.
// // // // //    *
// // // // //    * @param {Date | string} date - The date to fetch data for.
// // // // //    */
// // // // //   fetchTargetByDate: async (date) => {
// // // // //     set({ isLoading: true, error: null });
// // // // //     // Convert the date to a 'YYYY-MM-DD' format for the URL
// // // // //     const formattedDate = new Date(date).toISOString().split('T')[0];

// // // // //     try {
// // // // //       const response = await fetch(`${API_URL}/targets/${formattedDate}`);
// // // // //       if (!response.ok) {
// // // // //         if (response.status === 404) {
// // // // //           set({ todayTarget: null, isLoading: false });
// // // // //           return;
// // // // //         }
// // // // //         throw new Error('Failed to fetch target data for the specified date.');
// // // // //       }
// // // // //       const data = await response.json();
// // // // //       set({ todayTarget: data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       console.error("Error fetching target by date:", err);
// // // // //       set({ error: err.message, isLoading: false });
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Updates a specific part of the current day's target data on the backend.
// // // // //    *
// // // // //    * @param {object} updatedFields - An object containing the fields to update (e.g., { "progress.water": 1500 }).
// // // // //    */
// // // // //   updateTarget: async (updatedFields) => {
// // // // //     // Optimistically update the state first for a smoother UI experience
// // // // //     const currentState = get().todayTarget;
// // // // //     set({
// // // // //       todayTarget: {
// // // // //         ...currentState,
// // // // //         progress: {
// // // // //           ...currentState.progress,
// // // // //           ...updatedFields.progress,
// // // // //         },
// // // // //         targets: {
// // // // //           ...currentState.targets,
// // // // //           ...updatedFields.targets,
// // // // //         },
// // // // //         completed: {
// // // // //           ...currentState.completed,
// // // // //           ...updatedFields.completed,
// // // // //         },
// // // // //       },
// // // // //       error: null,
// // // // //     });

// // // // //     try {
// // // // //       const response = await fetch(`${API_URL}/api/targets`, {
// // // // //         method: 'POST',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify({
// // // // //           // The body must match the format the backend expects
// // // // //           date: currentState.date,
// // // // //           targets: updatedFields.targets || currentState.targets,
// // // // //           progress: updatedFields.progress || currentState.progress,
// // // // //           completed: updatedFields.completed || currentState.completed,
// // // // //         }),
// // // // //       });

// // // // //       if (!response.ok) {
// // // // //         // If the update fails, revert the state to its previous value
// // // // //         // You might need a more sophisticated rollback strategy in a complex app
// // // // //         set({ todayTarget: currentState });
// // // // //         throw new Error('Failed to update target data');
// // // // //       }

// // // // //       // The backend response is the final source of truth
// // // // //       const data = await response.json();
// // // // //       set({ todayTarget: data, isLoading: false });
// // // // //     } catch (err) {
// // // // //       console.error("Error updating target:", err);
// // // // //       set({ error: err.message });
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * A simple setter for the entire state, useful for manual state updates
// // // // //    * or when creating a new document after a 404 response.
// // // // //    * @param {object} data - The new target object.
// // // // //    */
// // // // //   setTodayTarget: (data) => set({ todayTarget: data }),

// // // // // }));

// // // // // export default useTargetStore;




// // // // // // // store/targetStore.js
// // // // // // import { create } from 'zustand';
// // // // // // // import api from './api';
// // // // // // import api from './api';
// // // // // // import useWaterStore from './waterStore';
// // // // // // import { useCaloriesStore } from './caloriesStore';
// // // // // // import { useAuthStore } from './authStore';

// // // // // // // import { useWaterStore } from './waterStore';
// // // // // // // import { useCaloriesStore } from './caloriesStore';
// // // // // // // import { useAuthStore } from './authStore';

// // // // // // export const useTargetStore = create((set, get) => ({
// // // // // //   // ... existing state and functions ...
// // // // // //     todayTarget: null,
  
// // // // // // //   // Last 7 days target history
// // // // // //   targetHistory: [],
  
// // // // // //   // Loading states
// // // // // //   loading: {
// // // // // //     today: false,
// // // // // //     history: false,
// // // // // //     progress: false,
// // // // // //     goals: false
// // // // // //   },
  
// // // // // //   // Error state
// // // // // //   error: null,
// // // // // //   // SYNC HELPER FUNCTIONS

// // // // // //   // Sync with water store
// // // // // //   syncWithWaterStore: async () => {
// // // // // //     const waterStore = useWaterStore.getState();
// // // // // //     const todayTotal = waterStore.todayTotal || 0;
    
// // // // // //     const result = await get().updateTargetProgress('water', todayTotal);
// // // // // //     return result;
// // // // // //   },

// // // // // //   // Sync with calories store
// // // // // //   syncWithCaloriesStore: async () => {
// // // // // //     const caloriesStore = useCaloriesStore.getState();
// // // // // //     const totalEaten = caloriesStore.totalCaloriesEaten || 0;
// // // // // //     const totalBurned = caloriesStore.totalCaloriesBurned || 0;
    
// // // // // //     await Promise.all([
// // // // // //       get().updateTargetProgress('caloriesEarn', totalEaten),
// // // // // //       get().updateTargetProgress('caloriesBurn', totalBurned)
// // // // // //     ]);
    
// // // // // //     return { success: true };
// // // // // //   },

// // // // // //   // Sync with auth store (meal data)
// // // // // //   syncWithMealData: async () => {
// // // // // //     const authStore = useAuthStore.getState();
// // // // // //     const mealData = authStore.mealData || [];
    
// // // // // //     const totalCalories = mealData.reduce((sum, meal) => sum + (meal.calories || 0), 0);
// // // // // //     const result = await get().updateTargetProgress('caloriesEarn', totalCalories);
// // // // // //     return result;
// // // // // //   },

// // // // // //   // Sync all stores at once
// // // // // //   syncAllStores: async () => {
// // // // // //     try {
// // // // // //       const results = await Promise.all([
// // // // // //         get().syncWithWaterStore(),
// // // // // //         get().syncWithCaloriesStore(),
// // // // // //         get().syncWithMealData()
// // // // // //       ]);
      
// // // // // //       return { 
// // // // // //         success: true, 
// // // // // //         results: {
// // // // // //           water: results[0],
// // // // // //           calories: results[1],
// // // // // //           meals: results[2]
// // // // // //         }
// // // // // //       };
// // // // // //     } catch (error) {
// // // // // //       return { success: false, error: error.message };
// // // // // //     }
// // // // // //   },

// // // // // //   // Initialize and auto-sync with existing stores
// // // // // //   initializeWithStores: async () => {
// // // // // //     // First fetch target data
// // // // // //     await get().fetchTodayTarget();
// // // // // //     await get().fetchTargetHistory();
    
// // // // // //     // Then sync with other stores
// // // // // //     await get().syncAllStores();
    
// // // // // //     return { success: true };
// // // // // //   },

// // // // // //   // Update water target from water store
// // // // // //   syncWaterTarget: async () => {
// // // // // //     const waterStore = useWaterStore.getState();
// // // // // //     const waterTarget = waterStore.target || 2000;
    
// // // // // //     const result = await get().updateTargetGoals({ water: waterTarget });
// // // // // //     return result;
// // // // // //   },

// // // // // //   // Update calorie targets from calories store
// // // // // //   syncCalorieTargets: async () => {
// // // // // //     const caloriesStore = useCaloriesStore.getState();
// // // // // //     const mealTarget = caloriesStore.mealTarget || 2000;
// // // // // //     const burnTarget = caloriesStore.burnTarget || 500;
    
// // // // // //     const result = await get().updateTargetGoals({ 
// // // // // //       caloriesEarn: mealTarget, 
// // // // // //       caloriesBurn: burnTarget 
// // // // // //     });
// // // // // //     return result;
// // // // // //   },

// // // // // //   // Update step target from calories store
// // // // // //   syncStepTarget: async () => {
// // // // // //     const caloriesStore = useCaloriesStore.getState();
// // // // // //     const stepTarget = caloriesStore.stepGoal || 10000;
    
// // // // // //     const result = await get().updateTargetGoals({ steps: stepTarget });
// // // // // //     return result;
// // // // // //   },

// // // // // //   // Sync all targets from existing stores
// // // // // //   syncAllTargets: async () => {
// // // // // //     try {
// // // // // //       const results = await Promise.all([
// // // // // //         get().syncWaterTarget(),
// // // // // //         get().syncCalorieTargets(),
// // // // // //         get().syncStepTarget()
// // // // // //       ]);
      
// // // // // //       return { 
// // // // // //         success: true, 
// // // // // //         results: {
// // // // // //           water: results[0],
// // // // // //           calories: results[1],
// // // // // //           steps: results[2]
// // // // // //         }
// // // // // //       };
// // // // // //     } catch (error) {
// // // // // //       return { success: false, error: error.message };
// // // // // //     }
// // // // // //   },

// // // // // //   // Get mapped data for compatibility with existing components
// // // // // //   getMappedGoals: () => {
// // // // // //     const today = get().todayTarget;
// // // // // //     if (!today) return [];
    
// // // // // //     return [
// // // // // //       {
// // // // // //         id: '1',
// // // // // //         title: `Drink ${today.progress.water}ml out of ${today.targets.water}ml`,
// // // // // //         completed: today.completed.water,
// // // // // //         progress: today.progress.water,
// // // // // //         target: today.targets.water,
// // // // // //         type: 'water'
// // // // // //       },
// // // // // //       { 
// // // // // //         id: '2', 
// // // // // //         title: `${today.progress.steps} steps out of ${today.targets.steps}`, 
// // // // // //         completed: today.completed.steps,
// // // // // //         progress: today.progress.steps,
// // // // // //         target: today.targets.steps,
// // // // // //         type: 'steps'
// // // // // //       },
// // // // // //       { 
// // // // // //         id: '3', 
// // // // // //         title: `${today.progress.caloriesEarn} cal out of ${today.targets.caloriesEarn}`, 
// // // // // //         completed: today.completed.caloriesEarn,
// // // // // //         progress: today.progress.caloriesEarn,
// // // // // //         target: today.targets.caloriesEarn,
// // // // // //         type: 'caloriesEarn'
// // // // // //       },
// // // // // //       { 
// // // // // //         id: '4', 
// // // // // //         title: `${today.progress.caloriesBurn} cal out of ${today.targets.caloriesBurn}`, 
// // // // // //         completed: today.completed.caloriesBurn,
// // // // // //         progress: today.progress.caloriesBurn,
// // // // // //         target: today.targets.caloriesBurn,
// // // // // //         type: 'caloriesBurn'
// // // // // //       },
// // // // // //     ];
// // // // // //   },

// // // // // //   // Get progress for specific type (compatible with existing code)
// // // // // //   getProgressByType: (type) => {
// // // // // //     const today = get().todayTarget;
// // // // // //     if (!today) return 0;
    
// // // // // //     return today.progress[type] || 0;
// // // // // //   },

// // // // // //   // Get target for specific type (compatible with existing code)
// // // // // //   getTargetByType: (type) => {
// // // // // //     const today = get().todayTarget;
// // // // // //     if (!today) return type === 'water' ? 2000 : type === 'steps' ? 10000 : type === 'caloriesEarn' ? 2000 : 500;
    
// // // // // //     return today.targets[type] || 0;
// // // // // //   },

// // // // // //   // Check if specific goal is completed (compatible with existing code)
// // // // // //   isGoalCompleted: (type) => {
// // // // // //     const today = get().todayTarget;
// // // // // //     if (!today) return false;
    
// // // // // //     return today.completed[type] || false;
// // // // // //   },

// // // // // //     // Fetch today's target
// // // // // //   fetchTodayTarget: async () => {
// // // // // //     set({ loading: { ...get().loading, today: true }, error: null });
// // // // // //     try {
// // // // // //       const res = await api.get('/targets/today');
// // // // // //       set({ 
// // // // // //         todayTarget: res.data,
// // // // // //         loading: { ...get().loading, today: false }
// // // // // //       });
// // // // // //       return { success: true, data: res.data };
// // // // // //     } catch (err) {
// // // // // //       set({ 
// // // // // //         error: err.response?.data?.error || 'Failed to fetch today\'s target',
// // // // // //         loading: { ...get().loading, today: false }
// // // // // //       });
// // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // //     }
// // // // // //   },

// // // // // //   // Fetch last 7 days history
// // // // // //   fetchTargetHistory: async (days = 7) => {
// // // // // //     set({ loading: { ...get().loading, history: true }, error: null });
// // // // // //     try {
// // // // // //       const res = await api.get(`/targets/last-7-days?days=${days}`);
// // // // // //       set({ 
// // // // // //         targetHistory: res.data,
// // // // // //         loading: { ...get().loading, history: false }
// // // // // //       });
// // // // // //       return { success: true, data: res.data };
// // // // // //     } catch (err) {
// // // // // //       set({ 
// // // // // //         error: err.response?.data?.error || 'Failed to fetch target history',
// // // // // //         loading: { ...get().loading, history: false }
// // // // // //       });
// // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // //     }
// // // // // //   },

// // // // // //   // Update target progress
// // // // // //   updateTargetProgress: async (type, value) => {
// // // // // //     set({ loading: { ...get().loading, progress: true }, error: null });
// // // // // //     try {
// // // // // //       const res = await api.put('/targets/progress', { type, value });
      
// // // // // //       // Update both todayTarget and history if needed
// // // // // //       const updatedToday = res.data;
// // // // // //       set(state => ({
// // // // // //         todayTarget: updatedToday,
// // // // // //         targetHistory: state.targetHistory.map(day => 
// // // // // //           new Date(day.date).toDateString() === new Date(updatedToday.date).toDateString() 
// // // // // //             ? updatedToday 
// // // // // //             : day
// // // // // //         ),
// // // // // //         loading: { ...state.loading, progress: false }
// // // // // //       }));
      
// // // // // //       return { success: true, data: updatedToday };
// // // // // //     } catch (err) {
// // // // // //       set({ 
// // // // // //         error: err.response?.data?.error || 'Failed to update progress',
// // // // // //         loading: { ...get().loading, progress: false }
// // // // // //       });
// // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // //     }
// // // // // //   },

// // // // // //   // Update target goals
// // // // // //   updateTargetGoals: async (goals) => {
// // // // // //     set({ loading: { ...get().loading, goals: true }, error: null });
// // // // // //     try {
// // // // // //       const res = await api.put('/targets/goals', goals);
      
// // // // // //       // Update both todayTarget and history if needed
// // // // // //       const updatedToday = res.data;
// // // // // //       set(state => ({
// // // // // //         todayTarget: updatedToday,
// // // // // //         targetHistory: state.targetHistory.map(day => 
// // // // // //           new Date(day.date).toDateString() === new Date(updatedToday.date).toDateString() 
// // // // // //             ? updatedToday 
// // // // // //             : day
// // // // // //         ),
// // // // // //         loading: { ...state.loading, goals: false }
// // // // // //       }));
      
// // // // // //       return { success: true, data: updatedToday };
// // // // // //     } catch (err) {
// // // // // //       set({ 
// // // // // //         error: err.response?.data?.error || 'Failed to update goals',
// // // // // //         loading: { ...get().loading, goals: false }
// // // // // //       });
// // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // //     }
// // // // // //   },

// // // // // //   // Get specific day's target from history
// // // // // //   getTargetByDate: (dateString) => {
// // // // // //     const history = get().targetHistory;
// // // // // //     const targetDate = new Date(dateString);
// // // // // //     targetDate.setHours(0, 0, 0, 0);
    
// // // // // //     return history.find(day => {
// // // // // //       const dayDate = new Date(day.date);
// // // // // //       dayDate.setHours(0, 0, 0, 0);
// // // // // //       return dayDate.getTime() === targetDate.getTime();
// // // // // //     });
// // // // // //   },

// // // // // //   // Get completion percentage for a specific target type
// // // // // //   getCompletionPercentage: (type = 'all') => {
// // // // // //     const today = get().todayTarget;
// // // // // //     if (!today) return 0;

// // // // // //     if (type === 'all') {
// // // // // //       const totalTarget = today.targets.water + today.targets.steps + today.targets.caloriesEarn + today.targets.caloriesBurn;
// // // // // //       const totalProgress = today.progress.water + today.progress.steps + today.progress.caloriesEarn + today.progress.caloriesBurn;
// // // // // //       return totalTarget > 0 ? Math.min(100, (totalProgress / totalTarget) * 100) : 0;
// // // // // //     }

// // // // // //     if (today.targets[type] > 0) {
// // // // // //       return Math.min(100, (today.progress[type] / today.targets[type]) * 100);
// // // // // //     }
// // // // // //     return 0;
// // // // // //   },

// // // // // //   // Check if all targets are completed today
// // // // // //   areAllTargetsCompleted: () => {
// // // // // //     const today = get().todayTarget;
// // // // // //     return today && 
// // // // // //            today.completed.water && 
// // // // // //            today.completed.steps && 
// // // // // //            today.completed.caloriesEarn && 
// // // // // //            today.completed.caloriesBurn;
// // // // // //   },

// // // // // //   // Reset error
// // // // // //   clearError: () => set({ error: null }),

// // // // // //   // Reset store
// // // // // //   reset: () => set({ 
// // // // // //     todayTarget: null, 
// // // // // //     targetHistory: [], 
// // // // // //     error: null,
// // // // // //     loading: { today: false, history: false, progress: false, goals: false }
// // // // // //   })



// // // // // // }));

// // // // // // // // store/targetStore.js
// // // // // // // import { create } from 'zustand';
// // // // // // // import api from './api'; // adjust path to your api setup

// // // // // // // export const useTargetStore = create((set, get) => ({
// // // // // // //   // Current day target data
// // // // // // //   todayTarget: null,
  
// // // // // // //   // Last 7 days target history
// // // // // // //   targetHistory: [],
  
// // // // // // //   // Loading states
// // // // // // //   loading: {
// // // // // // //     today: false,
// // // // // // //     history: false,
// // // // // // //     progress: false,
// // // // // // //     goals: false
// // // // // // //   },
  
// // // // // // //   // Error state
// // // // // // //   error: null,

// // // // // // //   // Fetch today's target
// // // // // // //   fetchTodayTarget: async () => {
// // // // // // //     set({ loading: { ...get().loading, today: true }, error: null });
// // // // // // //     try {
// // // // // // //       const res = await api.get('/targets/today');
// // // // // // //       set({ 
// // // // // // //         todayTarget: res.data,
// // // // // // //         loading: { ...get().loading, today: false }
// // // // // // //       });
// // // // // // //       return { success: true, data: res.data };
// // // // // // //     } catch (err) {
// // // // // // //       set({ 
// // // // // // //         error: err.response?.data?.error || 'Failed to fetch today\'s target',
// // // // // // //         loading: { ...get().loading, today: false }
// // // // // // //       });
// // // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // // //     }
// // // // // // //   },

// // // // // // //   // Fetch last 7 days history
// // // // // // //   fetchTargetHistory: async (days = 7) => {
// // // // // // //     set({ loading: { ...get().loading, history: true }, error: null });
// // // // // // //     try {
// // // // // // //       const res = await api.get(`/targets/last-7-days?days=${days}`);
// // // // // // //       set({ 
// // // // // // //         targetHistory: res.data,
// // // // // // //         loading: { ...get().loading, history: false }
// // // // // // //       });
// // // // // // //       return { success: true, data: res.data };
// // // // // // //     } catch (err) {
// // // // // // //       set({ 
// // // // // // //         error: err.response?.data?.error || 'Failed to fetch target history',
// // // // // // //         loading: { ...get().loading, history: false }
// // // // // // //       });
// // // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // // //     }
// // // // // // //   },

// // // // // // //   // Update target progress
// // // // // // //   updateTargetProgress: async (type, value) => {
// // // // // // //     set({ loading: { ...get().loading, progress: true }, error: null });
// // // // // // //     try {
// // // // // // //       const res = await api.put('/targets/progress', { type, value });
      
// // // // // // //       // Update both todayTarget and history if needed
// // // // // // //       const updatedToday = res.data;
// // // // // // //       set(state => ({
// // // // // // //         todayTarget: updatedToday,
// // // // // // //         targetHistory: state.targetHistory.map(day => 
// // // // // // //           new Date(day.date).toDateString() === new Date(updatedToday.date).toDateString() 
// // // // // // //             ? updatedToday 
// // // // // // //             : day
// // // // // // //         ),
// // // // // // //         loading: { ...state.loading, progress: false }
// // // // // // //       }));
      
// // // // // // //       return { success: true, data: updatedToday };
// // // // // // //     } catch (err) {
// // // // // // //       set({ 
// // // // // // //         error: err.response?.data?.error || 'Failed to update progress',
// // // // // // //         loading: { ...get().loading, progress: false }
// // // // // // //       });
// // // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // // //     }
// // // // // // //   },

// // // // // // //   // Update target goals
// // // // // // //   updateTargetGoals: async (goals) => {
// // // // // // //     set({ loading: { ...get().loading, goals: true }, error: null });
// // // // // // //     try {
// // // // // // //       const res = await api.put('/targets/goals', goals);
      
// // // // // // //       // Update both todayTarget and history if needed
// // // // // // //       const updatedToday = res.data;
// // // // // // //       set(state => ({
// // // // // // //         todayTarget: updatedToday,
// // // // // // //         targetHistory: state.targetHistory.map(day => 
// // // // // // //           new Date(day.date).toDateString() === new Date(updatedToday.date).toDateString() 
// // // // // // //             ? updatedToday 
// // // // // // //             : day
// // // // // // //         ),
// // // // // // //         loading: { ...state.loading, goals: false }
// // // // // // //       }));
      
// // // // // // //       return { success: true, data: updatedToday };
// // // // // // //     } catch (err) {
// // // // // // //       set({ 
// // // // // // //         error: err.response?.data?.error || 'Failed to update goals',
// // // // // // //         loading: { ...get().loading, goals: false }
// // // // // // //       });
// // // // // // //       return { success: false, error: err.response?.data?.error };
// // // // // // //     }
// // // // // // //   },

// // // // // // //   // Get specific day's target from history
// // // // // // //   getTargetByDate: (dateString) => {
// // // // // // //     const history = get().targetHistory;
// // // // // // //     const targetDate = new Date(dateString);
// // // // // // //     targetDate.setHours(0, 0, 0, 0);
    
// // // // // // //     return history.find(day => {
// // // // // // //       const dayDate = new Date(day.date);
// // // // // // //       dayDate.setHours(0, 0, 0, 0);
// // // // // // //       return dayDate.getTime() === targetDate.getTime();
// // // // // // //     });
// // // // // // //   },

// // // // // // //   // Get completion percentage for a specific target type
// // // // // // //   getCompletionPercentage: (type = 'all') => {
// // // // // // //     const today = get().todayTarget;
// // // // // // //     if (!today) return 0;

// // // // // // //     if (type === 'all') {
// // // // // // //       const totalTarget = today.targets.water + today.targets.steps + today.targets.caloriesEarn + today.targets.caloriesBurn;
// // // // // // //       const totalProgress = today.progress.water + today.progress.steps + today.progress.caloriesEarn + today.progress.caloriesBurn;
// // // // // // //       return totalTarget > 0 ? Math.min(100, (totalProgress / totalTarget) * 100) : 0;
// // // // // // //     }

// // // // // // //     if (today.targets[type] > 0) {
// // // // // // //       return Math.min(100, (today.progress[type] / today.targets[type]) * 100);
// // // // // // //     }
// // // // // // //     return 0;
// // // // // // //   },

// // // // // // //   // Check if all targets are completed today
// // // // // // //   areAllTargetsCompleted: () => {
// // // // // // //     const today = get().todayTarget;
// // // // // // //     return today && 
// // // // // // //            today.completed.water && 
// // // // // // //            today.completed.steps && 
// // // // // // //            today.completed.caloriesEarn && 
// // // // // // //            today.completed.caloriesBurn;
// // // // // // //   },

// // // // // // //   // Reset error
// // // // // // //   clearError: () => set({ error: null }),

// // // // // // //   // Reset store
// // // // // // //   reset: () => set({ 
// // // // // // //     todayTarget: null, 
// // // // // // //     targetHistory: [], 
// // // // // // //     error: null,
// // // // // // //     loading: { today: false, history: false, progress: false, goals: false }
// // // // // // //   })
// // // // // // // }));