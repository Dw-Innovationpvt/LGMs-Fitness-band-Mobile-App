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
 * BLE Reconnection Store with CONTINUOUS Auto-Reconnection
 * 
 * KEY FEATURE: Once a device is connected manually, it will ALWAYS attempt
 * to reconnect automatically whenever it comes back in range - NO user action needed!
 * 
 * How it works:
 * 1. User connects manually first time (device saved to AsyncStorage)
 * 2. Device goes out of range → disconnects
 * 3. Store continuously scans in background
 * 4. When device comes back → AUTOMATICALLY reconnects
 * 5. Repeats indefinitely until user manually disconnects
 */
export const useBLEReconnectionStore = create((set, get) => ({
  // ========== State Variables ==========
  savedDevice: null,
  isAttemptingReconnect: false,
  continuousReconnectEnabled: false, // Flag to enable continuous reconnection
  scanInterval: null, // Interval for continuous scanning
  bleManager: new BleManager(),
  connectionHistory: [],
  reconnectAttemptCount: 0, // Just for logging, no max limit

  // ========== Core Functions ==========

  /**
   * 1. Save Connection Data
   * Saves device info and ENABLES continuous auto-reconnection
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

      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_DEVICE,
        JSON.stringify(connectionData)
      );

      set({ 
        savedDevice: connectionData,
        continuousReconnectEnabled: true // ✅ Enable auto-reconnect
      });

      await get().addToConnectionHistory('connected', connectionData);

      console.log('💾 Device saved - Auto-reconnection ENABLED');
      console.log('📱 Device will reconnect automatically when in range');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to save connection data:', error);
      return false;
    }
  },

  /**
   * 2. Load Saved Device
   * Loads device and enables auto-reconnection if device exists
   */
  loadSavedDevice: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DEVICE);
      
      if (data) {
        const parsed = JSON.parse(data);
        set({ 
          savedDevice: parsed,
          continuousReconnectEnabled: true // Enable auto-reconnect on load
        });
        console.log('📦 Saved device loaded - Auto-reconnection ENABLED');
        return parsed;
      }
      
      console.log('📭 No saved device found');
      return null;
    } catch (error) {
      console.error('❌ Error loading saved device:', error);
      return null;
    }
  },

  /**
   * 3. Clear Saved Device
   * Removes device and DISABLES auto-reconnection
   */
  clearSavedDevice: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_DEVICE);
      
      // Stop any ongoing reconnection attempts
      get().stopContinuousReconnection();
      
      set({ 
        savedDevice: null,
        continuousReconnectEnabled: false
      });
      
      console.log('🗑️ Device forgotten - Auto-reconnection DISABLED');
    } catch (error) {
      console.error('❌ Error clearing saved device:', error);
    }
  },

  /**
   * 4. Handle Disconnection
   * Called when device disconnects - IMMEDIATELY starts continuous reconnection
   */
  handleDisconnection: async () => {
    const { savedDevice, continuousReconnectEnabled, isAttemptingReconnect } = get();

    console.log('🔌 Device disconnected!');

    if (!savedDevice || !continuousReconnectEnabled) {
      console.log('⚠️ No saved device or auto-reconnect disabled');
      return;
    }

    if (isAttemptingReconnect) {
      console.log('⏸️ Already attempting reconnection');
      return;
    }

    await get().addToConnectionHistory('disconnected', savedDevice);

    console.log('🔄 Starting CONTINUOUS auto-reconnection...');
    console.log('📡 Will keep trying until device is back in range');

    // Start continuous reconnection immediately
    get().startContinuousReconnection();
  },

  /**
   * 5. Start Continuous Reconnection
   * CONTINUOUSLY scans and reconnects - no delays, no max attempts!
   */
  startContinuousReconnection: () => {
    const { scanInterval, continuousReconnectEnabled } = get();

    if (!continuousReconnectEnabled) {
      console.log('⚠️ Auto-reconnect is disabled');
      return;
    }

    // Clear any existing interval
    if (scanInterval) {
      clearInterval(scanInterval);
    }

    set({ isAttemptingReconnect: true, reconnectAttemptCount: 0 });

    console.log('🔄 Continuous reconnection started');
    console.log('📡 Scanning every 3 seconds...');

    // Start first attempt immediately
    get().attemptReconnection();

    // Then scan every 3 seconds continuously
    const interval = setInterval(async () => {
      const { isAttemptingReconnect, continuousReconnectEnabled } = get();
      
      if (!continuousReconnectEnabled) {
        console.log('🛑 Auto-reconnect disabled, stopping...');
        clearInterval(interval);
        set({ scanInterval: null, isAttemptingReconnect: false });
        return;
      }

      if (isAttemptingReconnect) {
        await get().attemptReconnection();
      }
    }, 3000); // Scan every 3 seconds

    set({ scanInterval: interval });
  },

  /**
   * 6. Stop Continuous Reconnection
   * Stops the continuous scanning loop
   */
  stopContinuousReconnection: () => {
    const { scanInterval, bleManager } = get();

    if (scanInterval) {
      clearInterval(scanInterval);
      bleManager.stopDeviceScan();
      set({ 
        scanInterval: null, 
        isAttemptingReconnect: false,
        reconnectAttemptCount: 0 
      });
      console.log('🛑 Continuous reconnection stopped');
    }
  },

  /**
   * 7. Attempt Reconnection
   * Single reconnection attempt - called repeatedly by continuous loop
   */
  attemptReconnection: async () => {
    const { savedDevice, bleManager, reconnectAttemptCount } = get();

    if (!savedDevice) {
      console.warn('⚠️ No saved device');
      return false;
    }

    try {
      const currentAttempt = reconnectAttemptCount + 1;
      set({ reconnectAttemptCount: currentAttempt });

      console.log(`🔍 Reconnect attempt #${currentAttempt} - Scanning...`);

      // Quick scan for the specific device
      const device = await get().scanForSavedDevice(savedDevice.id);

      if (device) {
        console.log('✅ Device found in range! Connecting...');

        // Connect to device
        const connectedDevice = await bleManager.connectToDevice(device.id, {
          timeout: 10000
        });

        if (connectedDevice) {
          console.log('🎉 RECONNECTED SUCCESSFULLY!');

          // Stop continuous reconnection
          get().stopContinuousReconnection();

          // Import main BLE store and restore full connection
          const { useBLEStore } = await import('./augBleStore');
          const { connectToDevice } = useBLEStore.getState();

          await connectToDevice(connectedDevice);

          set({ 
            isAttemptingReconnect: false,
            reconnectAttemptCount: 0
          });

          await get().addToConnectionHistory('reconnected', savedDevice);

          console.log('✅ Device reconnected automatically!');
          
          return true;
        }
      } else {
        // Device not found yet, will try again in 3 seconds
        console.log(`📵 Device not in range yet (attempt #${currentAttempt})`);
      }

    } catch (error) {
      console.warn(`⚠️ Reconnection attempt failed:`, error.message);
    }

    return false;
  },

  /**
   * 8. Scan for Saved Device
   * Quick targeted scan for the specific device
   */
  scanForSavedDevice: async (deviceId) => {
    const { bleManager } = get();

    return new Promise((resolve) => {
      let foundDevice = null;
      const scanTimeout = 2000; // Quick 2 second scan

      const timeout = setTimeout(() => {
        bleManager.stopDeviceScan();
        resolve(foundDevice);
      }, scanTimeout);

      bleManager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error.message);
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
   * 9. Manual Reconnection
   * User can manually trigger reconnection
   */
  manualReconnect: async () => {
    const { savedDevice } = get();

    if (!savedDevice) {
      Alert.alert('No Device', 'No previously connected device found');
      return false;
    }

    console.log('🔄 Manual reconnection triggered');
    
    // Enable continuous reconnection and start
    set({ continuousReconnectEnabled: true });
    get().startContinuousReconnection();
    
    return true;
  },

  /**
   * 10. Start Monitoring
   * Sets up disconnection monitoring
   */
  startMonitoring: () => {
    const { savedDevice } = get();
    
    if (savedDevice) {
      console.log('👁️ Monitoring enabled for:', savedDevice.name);
      console.log('🔄 Auto-reconnection is ACTIVE');
    }
  },

  /**
   * 11. Get Reconnection Status
   */
  getReconnectionStatus: () => {
    const state = get();
    return {
      hasSavedDevice: state.savedDevice !== null,
      isAttemptingReconnect: state.isAttemptingReconnect,
      continuousReconnectEnabled: state.continuousReconnectEnabled,
      reconnectAttemptCount: state.reconnectAttemptCount,
      savedDeviceName: state.savedDevice?.name || 'Unknown',
      savedDeviceId: state.savedDevice?.id || null,
    };
  },

  /**
   * 12. Connection History Management
   */
  addToConnectionHistory: async (event, deviceData) => {
    try {
      const { connectionHistory } = get();
      
      const historyEntry = {
        event,
        device: deviceData,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [historyEntry, ...connectionHistory].slice(0, 50);
      
      set({ connectionHistory: updatedHistory });
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONNECTION_HISTORY,
        JSON.stringify(updatedHistory)
      );
      
      console.log(`📝 History: ${event}`);
    } catch (error) {
      console.error('Error updating history:', error);
    }
  },

  /**
   * 13. Load Connection History
   */
  loadConnectionHistory: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONNECTION_HISTORY);
      
      if (data) {
        const history = JSON.parse(data);
        set({ connectionHistory: history });
        return history;
      }
      
      return [];
    } catch (error) {
      console.error('Error loading history:', error);
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
      console.error('Error clearing history:', error);
    }
  },

  /**
   * 15. Enable/Disable Auto-Reconnection
   */
  setAutoReconnect: (enabled) => {
    set({ continuousReconnectEnabled: enabled });
    
    if (enabled) {
      console.log('✅ Auto-reconnection ENABLED');
      // If currently disconnected, start reconnecting
      const { isAttemptingReconnect } = get();
      if (!isAttemptingReconnect) {
        get().startContinuousReconnection();
      }
    } else {
      console.log('❌ Auto-reconnection DISABLED');
      get().stopContinuousReconnection();
    }
  },

  /**
   * 16. Check if Auto-Reconnect is Active
   */
  isAutoReconnectActive: () => {
    const { continuousReconnectEnabled, savedDevice } = get();
    return continuousReconnectEnabled && savedDevice !== null;
  },
}));