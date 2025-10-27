import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import axios from 'axios';
import api from './api'; // Import the axios instance


export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setup: null, // to check if user is setup or not for BMI
  isLoading: false,
  loading: false,
  error: null,
  isCheckingAuth: true,
  waterLogs: [],
  waterData: null,
  postWaterId: null,
  stepsData: [],
  steps: [], // Array to store fetched step entries 
  stepsTotalCount: 0,
  stepsKilometers: 0,
  stepsCaloriesBurned: 0,
  StepsActiveMinutes: 0,
  postStepsId: null,
  // to store workout data
  totalCaloriesBurned: 0,
  totalDurantion: 0,
  totalExercises: 0,
  workoutData: [], // Array to store fetched workout entries
  mealData:[],
  totalCaloriesIn: 0,
  // bmi
  preferences: null,
  setupComplete: false,

  setStepsData: (data) =>
    set({
      stepsTotalCount: data.stepCount,
      stepsCaloriesBurned: data.caloriesBurned,
      stepsKilometers: data.kilometers,
      stepsActiveMinutes: data.activeMinutes,
    }),

  setPostWaterId: (data) => set({ postWaterId: data }),

  nothingtoworry: async() => {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },});
              const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");
      return { success: true, data: data.message };
    } catch (error) {
      // console.log("Error in nothingtoworry:", error);
    }

  },
  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      // const response = await fetch(`${API_URL}/auth/login`, {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  homeMainLocal: async () => {
  set({ isLoading: true });

  try {
    const token = await AsyncStorage.getItem("token");
    const userString = await AsyncStorage.getItem("user");

    if (!token || !userString) {
      set({ isLoading: false });
      return { success: false, error: "No stored credentials" };
    }

    const user = JSON.parse(userString);

    // Set the token and user in state without verification
    // Actual validation will happen when making API calls
    set({ 
      token: token, 
      user: user, 
      isLoading: false 
    });

    return { success: true };
  } catch (error) {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ 
      token: null, 
      user: null, 
      isLoading: false 
    });
    return { success: false, error: error.message };
  }
},
  changePassword: async (newPassword) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      // console.log(data, "changePasswordData");

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
      // console.log(user, userJson, token);
    } catch (error) {
      console.log("Auth check failed", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },

  // to reset password first send email then receive otp
  forgotReq: async (email) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/send-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  forgotRes: async (email, newPassword, otp) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  getWater: async () => {
  try {
    // const { token } = useAuthStore.getState();
    const token = await AsyncStorage.getItem("token");
    // console.warn("🔐 Token from getWater:", token);

    const response = await fetch(`${API_URL}/water`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch water data");
      }const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      set({ waterLogs: sorted, isLoading: false });
  } catch (error) {
    console.error("❌ Error fetching water data:", error.message);
    // optionally handle error state here
  }
},
  
  postWater: async (amount) => {
    try {
      // const { token } = useAuthStore.getState();
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
//       const text = await response.text(); // get raw response
// console.log("🔍 Raw response:", text);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Post failed');
      console.log(data._id);
      set({ postWaterId: data._id })
      console.log(data._id)

      // set({ postWaterId: data._id })
      // console.log('✅ Water POST Success:', postWaterId);
      return data;
    } catch (err) {
      console.error('❌ POST Error:', err.message);
    }
  },

  putWater: async (id, amount) => {
    try {
            // console.log([postWaterId, "postWaterId"]);
      const token = await AsyncStorage.getItem("token");
      // const { token } = useAuthStore.getState();
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Put failed');
            console.log([postWaterId, "postWaterId"]);

      set({ waterData: data });
      console.log('✅ Water PUT Success:', data);
      return data;
    } catch (err) {
      console.error('❌ PUT Error:', err.message);
    }
  },

  // here comes code related to steps count
  getStepsTodays: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/steps`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      });
      const data = await response.json();
      console.log(data, "stepsData");
      //  if (Array.isArray(data) && data.length > 0) {
        set({
          stepsTotalCount: data.stepCount,
          stepsCaloriesBurned: data.caloriesBurned,
          stepsKilometers: data.kilometers,
          stepsActiveMinutes: data.activeMinutes,
        });
        console.log("✅ Steps data stored:", data);

      return data;

    }catch (error) {console.error("Error fetching steps data:", error);}
  },

  // post today's steps data
  postStepsTodays: async (stepsCount, kilometers, caloriesBurned, activeMinutes) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/steps`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stepsCount, kilometers, caloriesBurned, activeMinutes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to post today's steps data");
      set({
        stepsTotalCount: data.stepCount,
        stepsCaloriesBurned: data.caloriesBurned,
        stepsKilometers: data.kilometers,
        stepsActiveMinutes: data.activeMinutes,
      });
      // console.log("✅ Today's steps data posted successfully:", data);
      return data;

    }
    catch (error) {
      console.error("Error posting today's steps data:", error);
    }
  },

  // put todays steps data

  getSkatingTracking: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/tracking`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data, "skatingData");
      if (!response.ok) throw new Error(data.message || "Failed to fetch skating tracking data");
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching s  kating tracking data:", error);
      return { success: false, error: error.message };
    }
  },

  // now work on workout related data.
  postWorkout: async (workoutData) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });
      const data = await response.json();
      // call getWorkoutCount to update the workout count after posting new data
      await useAuthStore.getState().getWorkoutCount();
      if (!response.ok) throw new Error(data.message || "Failed to post workout data");
      return { success: true, data };
    } catch (error) {
      console.error("Error posting workout data:", error);
      return { success: false, error: error.message };
    }
  },
  getWorkout: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/exercises`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch workout data");
      console.log(data, "workoutData");
      set({ workoutData: data });
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching workout data:", error);
      return { success: false, error: error.message };
    }
  },
  getWorkoutCount: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/exercises/summary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data, "workoutCountData");
      set({
        totalCaloriesBurned: data.totalCaloriesBurned || 0,
        totalDurantion: data.totalDuration || 0,
        totalExercises: data.totalExercises || 0,
      });
      if (!response.ok) throw new Error(data.message || "Failed to fetch workout count");
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching workout count:", error);
      return { success: false, error: error.message };
    }
  },

  // meals related stuff
  postMeals: async (mealData) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mealData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to post meal data");
      return { success: true, data };
    } catch (error) {
      console.error("Error posting meal data:", error);
      return { success: false, error: error.message };
    }
  },

  getMeals: async (date) => {
  try {
    const token = await AsyncStorage.getItem("token");

    // Build API URL with date query param
    const url = date 
      ? `${API_URL}/meals/get?date=${date}` 
      : `${API_URL}/meals/get`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch meal data");

    set({ mealData: data });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching meal data:", error);
    return { success: false, error: error.message };
  }
},

  checkSetup: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/bmi/check-setup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to check setup status");
      // set({ setup: data.setup });
      return { success: true, setup: data.setup };
    } catch (error) {
      console.error("Error checking setup status:", error);
      return { success: false, error: error.message };
    }
  },

  // Save meal preferences and user data
  savePreferences: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/bmi', userData);
      set({ 
        preferences: response.data.user.mealTimes,
        setupComplete: response.data.user.setup,
        setup: response.data.user.setup,
        loading: false,
        user: response.data.user,
      });
      // console.log("Preferences saved successfully:", response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message,
        loading: false 
      });
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // Check if setup is complete
  checkSetupStatus: async () => {
    set({ loading: true, error: null });
    try {
      // const response = await api.get('/bmi/check-setup');
      const response = await fetch(`${API_URL}/bmi/check-setup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token from the store
        },
      });
      // if (!response.ok) {

      set({ 
        setupComplete: response.data.setup,
        loading: false
      });
      return response.data.setup;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message,
        loading: false 
      });
      return false;
    }
  },
  updateHealtData: async (healthData) => {
    set({ loading: true, error: null });
    try {
      const token = await AsyncStorage.getItem("token");
      // const response = await api.put('/update-health', healthData);
      const response = await fetch(`${API_URL}/bmi/update-health`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token from the store
        },
        body: JSON.stringify(healthData),
      });
      // set({ 
        // preferences: response.data.user.mealTimes,
        // setupComplete: response.data.user.setup,
        // setup: response.data.user.setup,
        // loading: false,
        // user: response.data.user,
      // });
      // console.log("Health data updated successfully:", response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message,
        loading: false 
      });
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // Get current preferences (if already loaded)
  getPreferences: () => {
    return get().preferences;
  },

  // Clear preferences (for logout)
  clearPreferences: () => {
    set({
      preferences: null,
      setupComplete: false,
      error: null
    });
  },
  // getUserData: () => {
  //   const { user } = get();
  //   return user;
  // },
  getUserData: async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token from the store
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      set({ user: data.user });

      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },
  updateAccountUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token from the store
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update user data");
      set({ user: data.user, loading: false });
      return { success: true, user: data.user };
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message,
        loading: false 
      });
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }


}));
