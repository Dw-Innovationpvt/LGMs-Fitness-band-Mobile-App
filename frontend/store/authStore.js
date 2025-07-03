import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
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
      console.log("Error in nothingtoworry:", error);
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

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
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
    console.warn("🔐 Token from getWater:", token);

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
      // } else {
      //   console.warn("⚠️ No steps data received");
      // }

      // if (!response.ok) throw new Error(data.message || "Failed to fetch steps data");
      // If data is already an array, use it directly; otherwise, wrap it in an array
      // set({ stepsData: Array.isArray(data) ? data : [data] });
      // set({ stepsTotalCount: data.totalCount || 0 });
      // set({ stepsKilometers: data.kilometers || 0 });
      // set({ stepsCaloriesBurned: data.caloriesBurned || 0 });
      // set({ StepsActiveMinutes: data.activeMinutes || 0 });
      // console.log(data.caloriesBurned, "stepsCaloriesBurned");

      // console.log(stepsData)
      // console.log("Steps data fetched successfully:", data);
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




}));
