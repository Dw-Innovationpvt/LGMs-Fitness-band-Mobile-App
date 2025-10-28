// store/useBLEReconnectionStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BleManager } from "react-native-ble-plx";
import { useBLEStore } from "./augBleStore";

export const useBLEReconnectionStore = create((set, get) => ({
  savedDevice: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 30,
  lastDisconnectTime: null,
  isAttemptingReconnect: false,

  /** ✅ Save connection data for future reconnection */
  saveConnectionData: async (device, characteristic) => {
    try {
      const data = {
        id: device.id,
        name: device.name || device.localName || "Unknown",
        characteristicUUID: characteristic?.uuid || null,
      };
      await AsyncStorage.setItem("savedDevice", JSON.stringify(data));
      set({ savedDevice: data });
      console.log("💾 Device connection data saved:", data);
    } catch (error) {
      console.error("Failed to save connection data:", error);
    }
  },

  /** ✅ Load saved device from storage */
  loadSavedDevice: async () => {
    try {
      const data = await AsyncStorage.getItem("savedDevice");
      if (data) {
        const parsed = JSON.parse(data);
        set({ savedDevice: parsed });
        console.log("📦 Loaded saved device:", parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Error loading saved device:", error);
      return null;
    }
  },

  /** ✅ Check if there’s a saved device */
  hasSavedDevice: () => {
    const { savedDevice } = get();
    return savedDevice !== null;
  },

  /** ✅ Manual reconnect */
  manualReconnect: async () => {
    const { savedDevice, maxReconnectAttempts } = get();
    const { connectToDevice } = useBLEStore.getState();

    if (!savedDevice) {
      console.warn("No saved device for reconnection");
      return false;
    }

    set({ isAttemptingReconnect: true, reconnectAttempts: 0 });

    const bleManager = new BleManager();

    for (let i = 0; i < maxReconnectAttempts; i++) {
      try {
        console.log(`🔄 Reconnect attempt ${i + 1}/${maxReconnectAttempts}...`);
        const device = await bleManager.connectToDevice(savedDevice.id);
        console.log("✅ Reconnected successfully to:", savedDevice.name);
        await connectToDevice(device); // reconnect main BLE logic
        set({ isAttemptingReconnect: false, reconnectAttempts: i + 1 });
        return true;
      } catch (err) {
        console.warn(`Attempt ${i + 1} failed:`, err.message);
        set({ reconnectAttempts: i + 1 });
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    set({
      isAttemptingReconnect: false,
      lastDisconnectTime: new Date().toISOString(),
    });
    console.warn("❌ All reconnection attempts failed.");
    return false;
  },

  /** ✅ Start monitoring for disconnection and auto-reconnect */
  startMonitoring: () => {
    const { connectedDevice } = useBLEStore.getState();
    if (!connectedDevice) return;

    connectedDevice.onDisconnected(async () => {
      console.log("🔌 Device disconnected, starting auto-reconnect...");
      set({
        isAttemptingReconnect: true,
        lastDisconnectTime: new Date().toISOString(),
      });
      await get().manualReconnect();
    });
  },

  /** ✅ Return reconnection status summary (used in frontend) */
  getReconnectionStatus: () => {
    const state = get();
    return {
      reconnectAttempts: state.reconnectAttempts,
      maxReconnectAttempts: state.maxReconnectAttempts,
      hasSavedDevice: state.savedDevice !== null,
      isAttemptingReconnect: state.isAttemptingReconnect,
      lastDisconnectTime: state.lastDisconnectTime,
    };
  },
}));
