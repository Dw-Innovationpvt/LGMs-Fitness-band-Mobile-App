// caloriesStore.js
import { create } from "zustand";
// import api from "../utils/api"; // adjust the path to your api.js
import api from "./api";
import useTargetStore from './targetStore';

export const useCaloriesStore = create((set) => ({
  totalCaloriesEaten: 0,
  totalCaloriesBurned: 0,
  mealTarget: 0,
  burnTarget: 0,
  stepGoal: 10000, // default step goal
  mealTargetMet: false,
  mealFlag: false,

  //                      router.put('/set-meal-calorie-target', auth, async (req, res) => {
  // Add to your caloriesStore.js
setMealTarget: async (mealTarget) => {
  try {
    const res = await api.put("/meals/set-meal-calorie-target", { mealCalorieTarget: mealTarget });
    // set({ mealTarget: res.data.mealTarget });
    
    // Sync with targetStore
    // await useTargetStore.getState().setGoalTarget('meal', res.data.mealTarget, new Date());
    
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
      // const res = await api.get("/meals/get/burned-today");
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

  //                         router.put('/set-burn-target', auth, async (req, res) => {
  setBurnTarget: async (burnTarget) => {
    try {
      const res = await api.put("/meals/set-burn-target", { burnTarget });
      set({ burnTarget: res.data.burnTarget });

      // Sync with targetStore
      // await useTargetStore.getState().setGoalTarget('burn', res.data.burnTarget, new Date());
      // console.log("Burn target set and synced with targetStore");
      return { success: true, burnTarget: res.data.burnTarget };
    } catch (err) {
      console.error("Error setting burn target:", err);
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      };
    
    }}

}));