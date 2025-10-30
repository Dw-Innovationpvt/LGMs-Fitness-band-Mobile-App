// store/useBLEStore.js
import { create } from 'zustand';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

// ===============================
// 🔧 Constants
// ===============================
const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';
const STORAGE_KEYS = {
  SAVED_DEVICE: 'savedDevice',
  CONNECTION_HISTORY: 'connectionHistory',
};

// ===============================
// ⚙️ Helper Functions
// ===============================
function normalizeUUID(uuid) {
  if (!uuid) return '';
  return uuid.toLowerCase().replace(/-/g, '');
}

function fixIncompleteJson(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') return '';
  const openBraces = (jsonString.match(/{/g) || []).length;
  const closeBraces = (jsonString.match(/}/g) || []).length;
  const openBrackets = (jsonString.match(/\[/g) || []).length;
  const closeBrackets = (jsonString.match(/\]/g) || []).length;
  let fixedJson = jsonString.trim();
  for (let i = 0; i < openBraces - closeBraces; i++) fixedJson += '}';
  for (let i = 0; i < openBrackets - closeBrackets; i++) fixedJson += ']';
  return fixedJson;
}

const modeMap = {
  S: 'Step Counting',
  SS: 'Speed Skating',
  SD: 'Distance Skating',
};

function formatBLEData(data) {
  if (!data) return null;
  const formattedData = {
    mode: data.mode || 'S',
    modeDisplay: modeMap[data.mode] || 'Step Counting',
    stepCount: parseInt(data.stepCount) || 0,
    walkingDistance: parseFloat(data.walkingDistance) || 0,
    strideCount: parseInt(data.strideCount) || 0,
    skatingDistance: parseFloat(data.skatingDistance) || 0,
    laps: parseInt(data.laps) || 0,
    speed: parseFloat(data.speed) || 0,
    maxSpeed: parseFloat(data.maxSpeed) || 0,
    minSpeed: parseFloat(data.minSpeed) || 0,
    rawData: data,
  };
  return formattedData;
}

// ===============================
// 🚀 Unified BLE + Reconnection Store
// ===============================
export const useBLEStore = create((set, get) => ({
  // ====== BLE State ======
  bleManager: new BleManager(),
  connectedDevice: null,
  characteristic: null,
  isConnected: false,
  bandActive: false,
  data: null,
  foundDevices: [],
  isScanning: false,
  error: null,

  // ====== Mode & Session Tracking ======
  currentMode: 'S',
  sessionData: {
    startTime: null,
    totalSteps: 0,
    totalSkatingDistance: 0,
    totalWalkingDistance: 0,
    maxSpeed: 0,
    sessionDuration: 0,
  },

  // ====== Reconnection State ======
  savedDevice: null,
  continuousReconnectEnabled: false,
  isAttemptingReconnect: false,
  scanInterval: null,
  reconnectAttemptCount: 0,
  isCurrentlyScanning: false,
  connectionHistory: [],

  // ===============================
  // 📲 BLE Permissions
  // ===============================
  requestBLEPermissions: async () => {
    if (Platform.OS !== 'android') return true;
    try {
      console.log('🔐 Checking BLE permissions...');
      const locationPermissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];
      let permissions = [...locationPermissions];
      if (Platform.Version >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );
      }
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const hasLocationPermission =
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;

      if (Platform.Version >= 31) {
        const hasBluetoothPermission =
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED;
        const allGranted = hasLocationPermission && hasBluetoothPermission;
        console.log('✅ Permissions granted:', allGranted);
        return allGranted;
      }
      console.log('✅ Permissions granted:', hasLocationPermission);
      return hasLocationPermission;
    } catch (error) {
      console.error('❌ Permission request error:', error);
      return false;
    }
  },

  // ===============================
  // 🔍 Scan for Devices
  // ===============================
  scanForDevices: async () => {
    const { bleManager } = get();
    set({ isScanning: true, foundDevices: [], error: null });
    console.log('Starting BLE scan...');
    try {
      const hasPermissions = await get().requestBLEPermissions();
      if (!hasPermissions) {
        Alert.alert('Permission Denied', 'Bluetooth permissions required.');
        set({ isScanning: false });
        return [];
      }
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          bleManager.stopDeviceScan();
          set({ isScanning: false });
          resolve(get().foundDevices);
        }, 15000);
        bleManager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            clearTimeout(timeout);
            set({ isScanning: false });
            resolve([]);
            return;
          }
          const name = device.name || device.localName || '';
          if (name.includes('ESP32C3_SkatingBand')) {
            set((state) => {
              const exists = state.foundDevices.some((d) => d.id === device.id);
              if (!exists) return { foundDevices: [...state.foundDevices, device] };
              return state;
            });
          }
        });
      });
    } catch (err) {
      console.error('Scan failed:', err);
      set({ isScanning: false });
      return [];
    }
  },

  // ===============================
  // 🔗 Connect to Device
  // ===============================
  connectToDevice: async (device) => {
    const bleManager = get().bleManager;
    try {
      console.log('🔗 Connecting to device:', device.name || device.id);
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      const services = await device.services();
      const targetService = services.find((s) => normalizeUUID(s.uuid) === normalizeUUID(SERVICE_UUID));
      const characteristics = await device.characteristicsForService(targetService.uuid);
      const targetCharacteristic = characteristics.find(
        (c) => normalizeUUID(c.uuid) === normalizeUUID(CHARACTERISTIC_UUID)
      );

      set({
        connectedDevice: device,
        characteristic: targetCharacteristic,
        isConnected: true,
        bandActive: true,
        error: null,
        sessionData: { ...get().sessionData, startTime: new Date() },
      });

      await get().saveConnectionData(device, targetCharacteristic);
      get().startMonitoring();

      // Setup notifications
      if (targetCharacteristic.isNotifiable) {
        device.monitorCharacteristicForService(
          targetService.uuid,
          targetCharacteristic.uuid,
          (error, characteristic) => {
            if (error) {
              console.error('Monitor error:', error);
              return;
            }
            const base64Value = characteristic?.value;
            if (!base64Value) return;
            try {
              const json = Buffer.from(base64Value, 'base64').toString('utf-8');
              const parsed = JSON.parse(json);
              const formattedData = formatBLEData(parsed);
              set((state) => ({
                data: formattedData,
                currentMode: formattedData.mode,
                bandActive: true,
                sessionData: {
                  ...state.sessionData,
                  totalSteps: Math.max(state.sessionData.totalSteps, formattedData.stepCount),
                  totalWalkingDistance: Math.max(
                    state.sessionData.totalWalkingDistance,
                    formattedData.walkingDistance
                  ),
                  totalSkatingDistance: Math.max(
                    state.sessionData.totalSkatingDistance,
                    formattedData.skatingDistance
                  ),
                  maxSpeed: Math.max(state.sessionData.maxSpeed, formattedData.maxSpeed),
                  sessionDuration: Math.floor((new Date() - state.sessionData.startTime) / 1000),
                },
              }));
            } catch (e) {
              console.warn('⚠️ Parse error:', e.message);
            }
          }
        );
      }

      Alert.alert('Connected', `Connected to ${device.name || device.id}`);
      console.log('✅ Device connected successfully');
    } catch (err) {
      console.error('❌ Connection error:', err);
      set({ isConnected: false, error: err.message });
      Alert.alert('Connection Error', err.message);
    }
  },

  // ===============================
  // 💾 Save Connection Data
  // ===============================
  saveConnectionData: async (device, characteristic) => {
    try {
      const data = {
        id: device.id,
        name: device.name || 'Unknown Device',
        characteristicUUID: characteristic?.uuid || null,
        serviceUUID: characteristic?.serviceUUID || null,
        savedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_DEVICE, JSON.stringify(data));
      set({ savedDevice: data, continuousReconnectEnabled: true });
      await get().addToConnectionHistory('connected', data);
      console.log('💾 Device saved for auto-reconnect');
    } catch (e) {
      console.error('Save connection error:', e);
    }
  },

  loadSavedDevice: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DEVICE);
      if (data) {
        const parsed = JSON.parse(data);
        set({ savedDevice: parsed, continuousReconnectEnabled: true });
        console.log('📦 Loaded saved device:', parsed.name);
        return parsed;
      }
      return null;
    } catch (e) {
      console.error('Load saved device error:', e);
      return null;
    }
  },

  clearSavedDevice: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_DEVICE);
      set({ savedDevice: null, continuousReconnectEnabled: false });
      console.log('🗑️ Device forgotten');
    } catch (e) {
      console.error('Clear saved device error:', e);
    }
  },

  // ===============================
  // 🔁 Reconnection Logic
  // ===============================
  startContinuousReconnection: () => {
    const { continuousReconnectEnabled, scanInterval } = get();
    if (!continuousReconnectEnabled) return;
    if (scanInterval) clearInterval(scanInterval);
    console.log('🔄 Continuous reconnection started');
    get().attemptReconnection();
    const interval = setInterval(() => {
      if (get().isCurrentlyScanning) return;
      get().attemptReconnection();
    }, 5000);
    set({ scanInterval: interval });
  },

  stopContinuousReconnection: () => {
    const { scanInterval, bleManager } = get();
    if (scanInterval) clearInterval(scanInterval);
    bleManager.stopDeviceScan();
    set({
      scanInterval: null,
      isAttemptingReconnect: false,
      isCurrentlyScanning: false,
      reconnectAttemptCount: 0,
    });
    console.log('🛑 Continuous reconnection stopped');
  },

  attemptReconnection: async () => {
    const { savedDevice, bleManager, reconnectAttemptCount } = get();
    if (!savedDevice) return false;
    try {
      set({
        reconnectAttemptCount: reconnectAttemptCount + 1,
        isCurrentlyScanning: true,
      });
      console.log(`🔍 Attempting reconnection #${reconnectAttemptCount + 1}`);
      const device = await get().scanForSavedDevice(savedDevice.id);
      if (device) {
        console.log('✅ Saved device found, reconnecting...');
        get().stopContinuousReconnection();
        await get().connectToDevice(device);
        await get().addToConnectionHistory('reconnected', savedDevice);
        Alert.alert('Reconnected', `Connected to ${savedDevice.name}`);
        set({ isCurrentlyScanning: false });
        return true;
      }
      set({ isCurrentlyScanning: false });
      return false;
    } catch (e) {
      console.error('Reconnection error:', e);
      set({ isCurrentlyScanning: false });
      return false;
    }
  },

  scanForSavedDevice: async (deviceId) => {
    const { bleManager } = get();
    return new Promise((resolve) => {
      let foundDevice = null;
      const timeout = setTimeout(() => {
        bleManager.stopDeviceScan();
        resolve(foundDevice);
      }, 6000);
      bleManager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
        if (error) {
          clearTimeout(timeout);
          bleManager.stopDeviceScan();
          resolve(null);
          return;
        }
        const name = device.name || device.localName || '';
        if (device.id === deviceId || name.includes('ESP32C3_SkatingBand')) {
          foundDevice = device;
          clearTimeout(timeout);
          bleManager.stopDeviceScan();
          resolve(device);
        }
      });
    });
  },

  initializeAutoReconnection: async () => {
    console.log('🚀 Initializing auto reconnection system...');
    const savedDevice = await get().loadSavedDevice();
    if (savedDevice && !get().isConnected) {
      setTimeout(() => get().startContinuousReconnection(), 2000);
    }
  },

  addToConnectionHistory: async (event, device) => {
    try {
      const { connectionHistory } = get();
      const newHistory = [
        { event, device, timestamp: new Date().toISOString() },
        ...connectionHistory,
      ].slice(0, 50);
      set({ connectionHistory: newHistory });
      await AsyncStorage.setItem(STORAGE_KEYS.CONNECTION_HISTORY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('History error:', e);
    }
  },

  // ===============================
  // 📡 Send Command
  // ===============================
  sendCommand: async (cmd) => {
    const { connectedDevice, characteristic } = get();
    if (!connectedDevice || !characteristic) return false;
    try {
      const base64Cmd = Buffer.from(cmd, 'utf-8').toString('base64');
      await connectedDevice.writeCharacteristicWithResponseForService(
        characteristic.serviceUUID,
        characteristic.uuid,
        base64Cmd
      );
      console.log('✅ Command sent:', cmd);
      return true;
    } catch (e) {
      console.error('Send command error:', e);
      return false;
    }
  },
}));
