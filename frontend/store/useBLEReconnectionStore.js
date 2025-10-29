// store/useBLEReconnectionStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BleManager } from 'react-native-ble-plx';
import { Alert } from 'react-native';

// Storage keys for persistence
const STORAGE_KEYS = {
  SAVED_DEVICE: 'savedDevice',
  CONNECTION_HISTORY: 'connectionHistory',
};

/**
 * BLE Reconnection Store
 * Handles automatic reconnection to previously connected BLE devices
 * Features:
 * - Persistent device storage using AsyncStorage
 * - Automatic reconnection with exponential backoff
 * - Connection state monitoring
 * - Connection history tracking
 */
export const useBLEReconnectionStore = create((set, get) => ({
  // ========== State Variables ==========
  savedDevice: null, // Stores device info for reconnection
  reconnectAttempts: 0, // Current reconnection attempt count
  maxReconnectAttempts: 30, // Maximum reconnection attempts
  lastDisconnectTime: null, // Timestamp of last disconnect
  isAttemptingReconnect: false, // Flag for active reconnection
  reconnectInterval: null, // Interval ID for periodic reconnection
  bleManager: new BleManager(), // BLE Manager instance
  connectionHistory: [], // Track connection events

  // ========== Core Functions ==========

  /**
   * 1. Save Connection Data
   * Stores device and characteristic information for future reconnection
   * Called immediately after successful connection
   */
  saveConnectionData: async (device, characteristic) => {
    try {
      if (!device) {
        console.warn('⚠️ Cannot save null device');
        return false;
      }

      const connectionData = {
        id: device.id,
        name: device.name || device.localName || 'Unknown Device',
        characteristicUUID: characteristic?.uuid || null,
        serviceUUID: characteristic?.serviceUUID || null,
        savedAt: new Date().toISOString(),
      };

      // Save to AsyncStorage for persistence across app restarts
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_DEVICE,
        JSON.stringify(connectionData)
      );

      set({ savedDevice: connectionData });

      // Add to connection history
      await get().addToConnectionHistory('connected', connectionData);

      console.log('💾 Device connection data saved successfully:', connectionData);
      return true;
    } catch (error) {
      console.error('❌ Failed to save connection data:', error);
      return false;
    }
  },

  /**
   * 2. Load Saved Device
   * Retrieves previously saved device from AsyncStorage
   * Called on app startup to check for previous connections
   */
  loadSavedDevice: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DEVICE);
      
      if (data) {
        const parsed = JSON.parse(data);
        set({ savedDevice: parsed });
        console.log('📦 Loaded saved device from storage:', parsed);
        return parsed;
      }
      
      console.log('📭 No saved device found in storage');
      return null;
    } catch (error) {
      console.error('❌ Error loading saved device:', error);
      return null;
    }
  },

  /**
   * 3. Check for Saved Device
   * Returns true if there's a device available for reconnection
   */
  hasSavedDevice: () => {
    const { savedDevice } = get();
    return savedDevice !== null && savedDevice.id !== null;
  },

  /**
   * 4. Clear Saved Device
   * Removes saved device from storage (e.g., when user manually disconnects)
   */
  clearSavedDevice: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_DEVICE);
      set({ savedDevice: null });
      console.log('🗑️ Saved device cleared from storage');
    } catch (error) {
      console.error('❌ Error clearing saved device:', error);
    }
  },

  /**
   * 5. Handle Disconnection
   * Called when device disconnects unexpectedly
   * Initiates automatic reconnection process
   */
  handleDisconnection: async () => {
    const { isAttemptingReconnect, savedDevice } = get();

    // Prevent multiple simultaneous reconnection attempts
    if (isAttemptingReconnect) {
      console.log('⏸️ Reconnection already in progress, skipping...');
      return;
    }

    if (!savedDevice) {
      console.warn('⚠️ No saved device for reconnection');
      return;
    }

    const disconnectTime = new Date().toISOString();
    
    set({
      isAttemptingReconnect: true,
      lastDisconnectTime: disconnectTime,
      reconnectAttempts: 0,
    });

    // Add to connection history
    await get().addToConnectionHistory('disconnected', savedDevice);

    console.log('🔌 Device disconnected, starting auto-reconnection process...');

    // Start reconnection with exponential backoff
    await get().attemptReconnection();
  },

  /**
   * 6. Attempt Reconnection
   * Core reconnection logic with exponential backoff
   * Tries to reconnect with increasing delays between attempts
   */
  attemptReconnection: async () => {
    const { 
      savedDevice, 
      maxReconnectAttempts, 
      reconnectAttempts,
      bleManager 
    } = get();

    if (!savedDevice) {
      console.warn('⚠️ No saved device to reconnect to');
      set({ isAttemptingReconnect: false });
      return false;
    }

    // Calculate exponential backoff delay (1s, 2s, 4s, 8s, max 30s)
    const calculateDelay = (attempt) => {
      return Math.min(1000 * Math.pow(2, attempt), 30000);
    };

    for (let attempt = 0; attempt < maxReconnectAttempts; attempt++) {
      try {
        const currentAttempt = attempt + 1;
        console.log(`🔄 Reconnection attempt ${currentAttempt}/${maxReconnectAttempts}...`);
        
        set({ reconnectAttempts: currentAttempt });

        // Try to scan for the device first
        const device = await get().scanForSavedDevice(savedDevice.id);
        
        if (device) {
          console.log('📡 Device found, attempting to connect...');
          
          // Connect to the device
          const connectedDevice = await bleManager.connectToDevice(device.id);
          
          if (connectedDevice) {
            console.log('✅ Reconnection successful!');
            
            // Import and use the main BLE store's connection logic
            const { useBLEStore } = await import('./augBleStore');
            const { connectToDevice } = useBLEStore.getState();
            
            // Restore full connection with characteristics monitoring
            await connectToDevice(connectedDevice);
            
            set({ 
              isAttemptingReconnect: false,
              reconnectAttempts: 0 
            });

            // Add to connection history
            await get().addToConnectionHistory('reconnected', savedDevice);

            // Show success notification
            Alert.alert(
              'Reconnected',
              `Successfully reconnected to ${savedDevice.name}`
            );
            
            return true;
          }
        } else {
          console.log(`📵 Device not found, attempt ${currentAttempt}`);
        }

        // If not the last attempt, wait with exponential backoff
        if (attempt < maxReconnectAttempts - 1) {
          const delay = calculateDelay(attempt);
          console.log(`⏳ Waiting ${delay / 1000}s before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        console.warn(`⚠️ Reconnection attempt ${attempt + 1} failed:`, error.message);
        
        // Continue to next attempt unless it's the last one
        if (attempt < maxReconnectAttempts - 1) {
          const delay = calculateDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All attempts failed
    console.error('❌ All reconnection attempts exhausted');
    
    set({
      isAttemptingReconnect: false,
      lastDisconnectTime: new Date().toISOString(),
    });

    // Add failed reconnection to history
    await get().addToConnectionHistory('reconnection_failed', savedDevice);

    // Notify user
    Alert.alert(
      'Reconnection Failed',
      `Unable to reconnect to ${savedDevice.name}. Please manually reconnect from the devices list.`,
      [{ text: 'OK' }]
    );

    return false;
  },

  /**
   * 7. Scan for Saved Device
   * Scans specifically for the previously connected device
   * Uses a shorter timeout than general scanning
   */
  scanForSavedDevice: async (deviceId) => {
    const { bleManager } = get();
    
    return new Promise((resolve) => {
      let foundDevice = null;
      const scanTimeout = 10000; // 10 second timeout

      const timeout = setTimeout(() => {
        bleManager.stopDeviceScan();
        resolve(foundDevice);
      }, scanTimeout);

      console.log(`🔍 Scanning for device: ${deviceId}...`);

      bleManager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            clearTimeout(timeout);
            bleManager.stopDeviceScan();
            resolve(null);
            return;
          }

          if (device && device.id === deviceId) {
            console.log('✅ Target device found!');
            foundDevice = device;
            clearTimeout(timeout);
            bleManager.stopDeviceScan();
            resolve(device);
          }
        }
      );
    });
  },

  /**
   * 8. Manual Reconnection
   * Allows user to manually trigger reconnection
   * Called from UI when user presses "Reconnect" button
   */
  manualReconnect: async () => {
    const { isAttemptingReconnect, hasSavedDevice } = get();

    if (!hasSavedDevice()) {
      Alert.alert('No Device', 'No previously connected device found');
      return false;
    }

    if (isAttemptingReconnect) {
      Alert.alert('Already Reconnecting', 'Reconnection is already in progress');
      return false;
    }

    console.log('🔄 Manual reconnection initiated...');
    return await get().attemptReconnection();
  },

  /**
   * 9. Start Monitoring
   * Sets up disconnection monitoring for connected device
   * Called after successful connection
   */
  startMonitoring: () => {
    console.log('👁️ Starting connection monitoring...');
    
    // Note: The actual onDisconnected handler is set up in the main
    // BLE store's connectToDevice function. This function ensures
    // that monitoring is properly initialized.
    
    const { savedDevice } = get();
    if (savedDevice) {
      console.log('✅ Monitoring active for device:', savedDevice.name);
    }
  },

  /**
   * 10. Stop Monitoring
   * Stops reconnection attempts and clears monitoring
   */
  stopMonitoring: () => {
    const { reconnectInterval } = get();
    
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
    }
    
    set({
      reconnectInterval: null,
      isAttemptingReconnect: false,
      reconnectAttempts: 0,
    });
    
    console.log('🛑 Connection monitoring stopped');
  },

  /**
   * 11. Get Reconnection Status
   * Returns current reconnection state for UI display
   */
  getReconnectionStatus: () => {
    const state = get();
    return {
      hasSavedDevice: state.savedDevice !== null,
      isAttemptingReconnect: state.isAttemptingReconnect,
      reconnectAttempts: state.reconnectAttempts,
      maxReconnectAttempts: state.maxReconnectAttempts,
      lastDisconnectTime: state.lastDisconnectTime,
      savedDeviceName: state.savedDevice?.name || 'Unknown',
      savedDeviceId: state.savedDevice?.id || null,
    };
  },

  /**
   * 12. Connection History Management
   * Tracks connection events for debugging and analytics
   */
  addToConnectionHistory: async (event, deviceData) => {
    try {
      const { connectionHistory } = get();
      
      const historyEntry = {
        event,
        device: deviceData,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [historyEntry, ...connectionHistory].slice(0, 50); // Keep last 50 events
      
      set({ connectionHistory: updatedHistory });
      
      // Persist to storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONNECTION_HISTORY,
        JSON.stringify(updatedHistory)
      );
      
      console.log(`📝 Connection history updated: ${event}`);
    } catch (error) {
      console.error('Error updating connection history:', error);
    }
  },

  /**
   * 13. Load Connection History
   * Retrieves connection history from storage
   */
  loadConnectionHistory: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONNECTION_HISTORY);
      
      if (data) {
        const history = JSON.parse(data);
        set({ connectionHistory: history });
        console.log(`📚 Loaded ${history.length} connection history entries`);
        return history;
      }
      
      return [];
    } catch (error) {
      console.error('Error loading connection history:', error);
      return [];
    }
  },

  /**
   * 14. Clear Connection History
   */
  clearConnectionHistory: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CONNECTION_HISTORY);
      set({ connectionHistory: [] });
      console.log('🗑️ Connection history cleared');
    } catch (error) {
      console.error('Error clearing connection history:', error);
    }
  },

  /**
   * 15. Reset Reconnection State
   * Resets all reconnection-related state
   */
  resetReconnectionState: () => {
    const { reconnectInterval } = get();
    
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
    }
    
    set({
      reconnectAttempts: 0,
      isAttemptingReconnect: false,
      lastDisconnectTime: null,
      reconnectInterval: null,
    });
    
    console.log('🔄 Reconnection state reset');
  },
}));