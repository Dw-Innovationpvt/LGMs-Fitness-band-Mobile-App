// caloriesStore.js
import { create } from "zustand";
// import api from "../utils/api"; // adjust the path to your api.js
import api from "./api";

export const useCaloriesStore = create((set) => ({
  totalCaloriesEaten: 0,
  totalCaloriesBurned: 0,
  mealTarget: 0,
  burnTarget: 0,
  stepGoal: 10000, // default step goal
  mealTargetMet: false,
  mealFlag: false,


  // Add to your caloriesStore.js
setMealTarget: async (mealTarget) => {
  try {
    // if (!mealTarget || mealTarget <= 0) {
    //   throw new Error('Meal target must be a positive number');
    // }
    console.log("Setting meal target to:", mealTarget);
    const res = await api.put("/meals/set-meal-calorie-target", { mealCalorieTarget: mealTarget });
    set({ mealTarget: res.data.mealTarget });
    
    return { success: true, mealTarget: res.data.mealTarget };
  } catch (err) {
    console.error("Error setting meal target:", err);
    return { 
      success: false, 
      error: err.response?.data?.error || err.message 
    };
  }
},

   // Fetch step goal
  fetchStepGoal: async () => {
    try {
      const res = await api.get("/meals/get-step-goal");
      set({ stepGoal: res.data.stepGoal || 10000 });
    } catch (err) {
      console.error("Error fetching step goal:", err);
    }
  },

  // Set step goal
  setStepGoal: async (stepGoal) => {
    try {
      if (!stepGoal || stepGoal <= 0) {
        throw new Error('Step goal must be a positive number');
      }
      
      const res = await api.put("/meals/set-step-goal", { stepGoal });
      set({ stepGoal: res.data.stepGoal });
      
      return { success: true, stepGoal: res.data.stepGoal };
    } catch (err) {
      console.error("Error setting step goal:", err);
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      };
    }
  },

  // Fetch total calories eaten today
    // Fetch burn target from server
  fetchBurnTarget: async () => {
    try {
      // You might need to create this endpoint on your backend
      const res = await api.get("/meals/get-burn-target");
      set({ burnTarget: res.data.burnTarget || 0 });
    } catch (err) {
      console.error("Error fetching burn target:", err);
      // If the endpoint doesn't exist yet, you might want to handle this differently
    }
  },

  fetchCaloriesEaten: async () => {
    try {
      const res = await api.get("/meals/get/total-calories");
      set({ totalCaloriesEaten: res.data.totalCalories || 0 });
    } catch (err) {
      console.error("Error fetching calories eaten:", err);
    }
  },

  // Fetch total calories burned today
  fetchCaloriesBurned: async () => {
    try {
      const res = await api.get("/meals/get/burned-today");
      set({ totalCaloriesBurned: res.data.totalBurned || 0 });
    } catch (err) {
      console.error("Error fetching calories burned:", err);
    }
  },

  // Fetch meal target and status
  fetchMealTargetStatus: async () => {
    try {
      const res = await api.get("/meals/get/today-calorie-target");
      set({
        mealTarget: res.data.mealCalorieTarget || 0,
        mealTargetMet: res.data.status || false,
        mealFlag: res.data.mealFlag || false,
      });
    } catch (err) {
      console.error("Error fetching meal target:", err);
    }
  },

   // Fetch meal target and status
  fetchMealTargetStatus: async () => {
    try {
      const res = await api.get("/meals/get/today-calorie-target");
      set({
        mealTarget: res.data.mealCalorieTarget || 0,
        mealTargetMet: res.data.status || false,
        mealFlag: res.data.mealFlag || false,
      });
    } catch (err) {
      console.error("Error fetching meal target:", err);
    }
  },

  // Set burn target
  setBurnTarget: async (burnTarget) => {
    try {
      if (!burnTarget || burnTarget <= 0) {
        throw new Error('Burn target must be a positive number');
      }
      
      const res = await api.put("/meals/set-burn-target", { burnTarget });
      
      // Update the local state with the new burn target
      set({ burnTarget: res.data.burnTarget });
      
      return { success: true, burnTarget: res.data.burnTarget };
    } catch (err) {
      console.error("Error setting burn target:", err);
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      };
    
    }}

}));


// // caloriesStore.js
// import { create } from 'zustand';
// import api from './api';

// export const useCaloriesStore = create((set) => ({
//   totalCaloriesEaten: 0,
//   totalCaloriesBurned: 0,
//   mealTarget: 0,
//   mealTargetMet: false,
//   mealFlag: false,

//   // Fetch total calories eaten today
//   fetchCaloriesEaten: async () => {
//     // const res = await fetch('/api/meals/get/total-calories', {
//     //   headers: { Authorization: `Bearer ${token}` }
//     // });
//     const res = await api.get(`/get/total-calories`);


//         //   const response = await api.get(`/water?date=${dateString}`);
//     const data = await res.json();
//     console.log('Total calories eaten data calories store 22:', data);
//     set({ totalCaloriesEaten: data.totalCalories || 0 });
//   },

//   // Fetch total calories burned today
//   fetchCaloriesBurned: async () => {
//     // const res = await fetch('/api/exercises/get/burned-today', {
//     //   headers: { Authorization: `Bearer ${token}` }
//     // });
//     const res = await api.get(`/get/burned-today`);
//     const data = await res.json();
//     set({ totalCaloriesBurned: res.data.totalBurned || 0 });
//   },

//   // Fetch meal target and if met
//   fetchMealTargetStatus: async () => {
//     // const res = await fetch('/api/meals/get/today-calorie-target', {
//     //   headers: { Authorization: `Bearer ${token}` }
//     // });
//     const res = await api.get(`/meals/get/today-calorie-target`);
//     const data = await res.json();
//     set({
//       mealTarget: data.mealCalorieTarget || 0,
//       mealTargetMet: data.status || false,
//       mealFlag: data.mealFlag || false
//     });
//   },
// }));