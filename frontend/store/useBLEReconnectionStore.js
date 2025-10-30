// store/useBLEReconnectionStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BleManager } from 'react-native-ble-plx';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

// Storage keys for persistence
const STORAGE_KEYS = {
  SAVED_DEVICE: 'savedDevice',
  CONNECTION_HISTORY: 'connectionHistory',
};

/**
 * BLE Reconnection Store with CONTINUOUS Auto-Reconnection
 * 
 * IMPROVED VERSION: Better device detection with proper scanning
 * - Uses proper BLE state checking
 * - Ensures permissions before scanning
 * - Longer scan windows for better detection
 * - Cleans up previous scans properly
 */
export const useBLEReconnectionStore = create((set, get) => ({
  // ========== State Variables ==========
  savedDevice: null,
  isAttemptingReconnect: false,
  continuousReconnectEnabled: false,
  scanInterval: null,
  bleManager: new BleManager(),
  connectionHistory: [],
  reconnectAttemptCount: 0,
  isCurrentlyScanning: false, // Track if scan is in progress

  // ========== Core Functions ==========

  /**
   * 1. Save Connection Data
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
        continuousReconnectEnabled: true
      });

      await get().addToConnectionHistory('connected', connectionData);

      console.log('💾 Device saved - Auto-reconnection ENABLED');
      console.log('📱 Saved device ID:', connectionData.id);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to save connection data:', error);
      return false;
    }
  },

  /**
   * 2. Load Saved Device
   */
  loadSavedDevice: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DEVICE);
      
      if (data) {
        const parsed = JSON.parse(data);
        set({ 
          savedDevice: parsed,
          continuousReconnectEnabled: true
        });
        console.log('📦 Saved device loaded:', parsed.name);
        console.log('📱 Device ID:', parsed.id);
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
   */
  clearSavedDevice: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_DEVICE);
      
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
   * 4. Request BLE Permissions (Android)
   */
  requestBLEPermissions: async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      console.log('🔐 Checking BLE permissions...');
      
      const locationPermissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      let permissions = [...locationPermissions];

      // Android 12+ requires additional Bluetooth permissions
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

  /**
   * 5. Check BLE State
   */
  checkBLEState: async () => {
    const { bleManager } = get();
    
    try {
      const state = await bleManager.state();
      console.log('📡 BLE State:', state);
      
      if (state !== 'PoweredOn') {
        console.warn('⚠️ Bluetooth is not powered on');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error checking BLE state:', error);
      return false;
    }
  },

  /**
   * 6. Handle Disconnection
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
    console.log('📡 Target device:', savedDevice.name);
    console.log('📱 Target ID:', savedDevice.id);

    // Start continuous reconnection immediately
    get().startContinuousReconnection();
  },

  /**
   * 7. Start Continuous Reconnection
   */
  startContinuousReconnection: () => {
    const { scanInterval, continuousReconnectEnabled } = get();

    if (!continuousReconnectEnabled) {
      console.log('⚠️ Auto-reconnect is disabled');
      return;
    }

    // Clear any existing interval
    if (scanInterval) {
      console.log('🧹 Clearing existing scan interval');
      clearInterval(scanInterval);
    }

    set({ isAttemptingReconnect: true, reconnectAttemptCount: 0 });

    console.log('🔄 Continuous reconnection started');
    console.log('📡 Will scan every 5 seconds for better detection...');

    // Start first attempt immediately
    get().attemptReconnection();

    // Then scan every 5 seconds (longer interval for more reliable scanning)
    const interval = setInterval(async () => {
      const { isAttemptingReconnect, continuousReconnectEnabled, isCurrentlyScanning } = get();
      
      if (!continuousReconnectEnabled) {
        console.log('🛑 Auto-reconnect disabled, stopping...');
        clearInterval(interval);
        set({ scanInterval: null, isAttemptingReconnect: false });
        return;
      }

      // Skip if previous scan is still running
      if (isCurrentlyScanning) {
        console.log('⏭️ Previous scan still running, skipping...');
        return;
      }

      if (isAttemptingReconnect) {
        await get().attemptReconnection();
      }
    }, 5000); // Scan every 5 seconds

    set({ scanInterval: interval });
  },

  /**
   * 8. Stop Continuous Reconnection
   */
  stopContinuousReconnection: () => {
    const { scanInterval, bleManager } = get();

    console.log('🛑 Stopping continuous reconnection...');

    if (scanInterval) {
      clearInterval(scanInterval);
    }

    // Make sure to stop any ongoing scan
    try {
      bleManager.stopDeviceScan();
    } catch (error) {
      console.warn('⚠️ Error stopping device scan:', error);
    }

    set({ 
      scanInterval: null, 
      isAttemptingReconnect: false,
      isCurrentlyScanning: false,
      reconnectAttemptCount: 0 
    });
    
    console.log('✅ Continuous reconnection stopped');
  },

  /**
   * 9. Attempt Reconnection
   */
  attemptReconnection: async () => {
    const { savedDevice, bleManager, reconnectAttemptCount, isCurrentlyScanning } = get();

    if (!savedDevice) {
      console.warn('⚠️ No saved device');
      return false;
    }

    if (isCurrentlyScanning) {
      console.log('⏭️ Scan already in progress, skipping...');
      return false;
    }

    try {
      const currentAttempt = reconnectAttemptCount + 1;
      set({ reconnectAttemptCount: currentAttempt, isCurrentlyScanning: true });

      console.log(`\n🔍 ========== Reconnect Attempt #${currentAttempt} ==========`);
      console.log('📱 Looking for device ID:', savedDevice.id);
      console.log('📝 Device name:', savedDevice.name);

      // Check BLE state
      const bleStateOk = await get().checkBLEState();
      if (!bleStateOk) {
        console.warn('⚠️ BLE not ready, will retry...');
        set({ isCurrentlyScanning: false });
        return false;
      }

      // Check permissions
      const hasPermissions = await get().requestBLEPermissions();
      if (!hasPermissions) {
        console.warn('⚠️ Permissions not granted, will retry...');
        set({ isCurrentlyScanning: false });
        return false;
      }

      // Try to scan for the device
      console.log('📡 Starting device scan...');
      const device = await get().scanForSavedDevice(savedDevice.id);

      if (device) {
        console.log('✅ DEVICE FOUND IN RANGE!');
        console.log('📱 Found device:', device.name || device.id);
        console.log('🔗 Attempting connection...');

        try {
          // Connect to device with extended timeout
          const connectedDevice = await bleManager.connectToDevice(device.id, {
            timeout: 15000,
            requestMTU: 185
          });

          if (connectedDevice) {
            console.log('🎉 RECONNECTION SUCCESSFUL!');

            // Stop continuous reconnection
            get().stopContinuousReconnection();

            // Import main BLE store and restore full connection
            const { useBLEStore } = await import('./augBleStore');
            const { connectToDevice } = useBLEStore.getState();

            console.log('🔄 Restoring full BLE connection...');
            await connectToDevice(connectedDevice);

            set({ 
              isAttemptingReconnect: false,
              isCurrentlyScanning: false,
              reconnectAttemptCount: 0
            });

            await get().addToConnectionHistory('reconnected', savedDevice);

            console.log('✅ Device reconnected and monitoring restored!');
            
            // Show success notification
            Alert.alert(
              '✅ Reconnected!',
              `Successfully reconnected to ${savedDevice.name}`,
              [{ text: 'OK' }]
            );
            
            return true;
          }
        } catch (connectError) {
          console.error('❌ Connection failed:', connectError.message);
          set({ isCurrentlyScanning: false });
          return false;
        }
      } else {
        console.log(`📵 Device not detected yet (attempt #${currentAttempt})`);
        console.log('⏳ Will scan again in 5 seconds...');
        set({ isCurrentlyScanning: false });
      }

    } catch (error) {
      console.error(`❌ Reconnection error:`, error.message);
      set({ isCurrentlyScanning: false });
    }

    return false;
  },

  /**
   * 10. Scan for Saved Device
   * IMPROVED: Longer scan window, better logging
   */
  scanForSavedDevice: async (deviceId) => {
    const { bleManager } = get();

    return new Promise((resolve) => {
      let foundDevice = null;
      const scanTimeout = 4000; // 4 second scan window
      let devicesFound = 0;

      console.log('📡 Starting BLE scan...');
      console.log('🎯 Target device ID:', deviceId);

      const timeout = setTimeout(() => {
        console.log(`📊 Scan complete. Total devices found: ${devicesFound}`);
        bleManager.stopDeviceScan();
        
        if (!foundDevice) {
          console.log('❌ Target device not found in this scan');
        }
        
        resolve(foundDevice);
      }, scanTimeout);

      bleManager.startDeviceScan(
        null, // Scan for all devices
        { 
          allowDuplicates: false,
          scanMode: 2, // Low latency scan mode for faster detection
        },
        (error, device) => {
          if (error) {
            console.error('❌ Scan error:', error.message);
            clearTimeout(timeout);
            bleManager.stopDeviceScan();
            resolve(null);
            return;
          }

          if (device) {
            devicesFound++;
            
            // Log every device found for debugging
            const deviceName = device.name || device.localName || 'Unknown';
            console.log(`📱 Device #${devicesFound}: ${deviceName} (${device.id})`);

            // Check if this is our target device
            if (device.id === deviceId) {
              console.log('🎯 ✅ TARGET DEVICE MATCHED!');
              console.log('📱 Device ID matches:', device.id);
              console.log('📝 Device name:', deviceName);
              
              foundDevice = device;
              clearTimeout(timeout);
              bleManager.stopDeviceScan();
              resolve(device);
            }
          }
        }
      );
    });
  },

  /**
   * 11. Manual Reconnection
   */
  manualReconnect: async () => {
    const { savedDevice } = get();

    if (!savedDevice) {
      Alert.alert('No Device', 'No previously connected device found');
      return false;
    }

    console.log('🔄 Manual reconnection triggered');
    console.log('📱 Target device:', savedDevice.name);
    
    // Enable continuous reconnection and start
    set({ continuousReconnectEnabled: true });
    get().startContinuousReconnection();
    
    Alert.alert(
      'Reconnection Started',
      `Scanning for ${savedDevice.name}...\n\nMake sure Bluetooth is on and device is nearby.`,
      [{ text: 'OK' }]
    );
    
    return true;
  },

  /**
   * 12. Start Monitoring
   */
  startMonitoring: () => {
    const { savedDevice } = get();
    
    if (savedDevice) {
      console.log('👁️ Monitoring enabled for:', savedDevice.name);
      console.log('📱 Device ID:', savedDevice.id);
      console.log('🔄 Auto-reconnection is ACTIVE');
    }
  },

  /**
   * 13. Get Reconnection Status
   */
  getReconnectionStatus: () => {
    const state = get();
    return {
      hasSavedDevice: state.savedDevice !== null,
      isAttemptingReconnect: state.isAttemptingReconnect,
      continuousReconnectEnabled: state.continuousReconnectEnabled,
      reconnectAttemptCount: state.reconnectAttemptCount,
      isCurrentlyScanning: state.isCurrentlyScanning,
      savedDeviceName: state.savedDevice?.name || 'Unknown',
      savedDeviceId: state.savedDevice?.id || null,
    };
  },

  /**
   * 14. Connection History Management
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
   * 15. Load Connection History
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
   * 16. Clear Connection History
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
   * 17. Enable/Disable Auto-Reconnection
   */
  setAutoReconnect: (enabled) => {
    set({ continuousReconnectEnabled: enabled });
    
    if (enabled) {
      console.log('✅ Auto-reconnection ENABLED');
      const { isAttemptingReconnect, savedDevice } = get();
      
      if (!isAttemptingReconnect && savedDevice) {
        console.log('🔄 Starting reconnection process...');
        get().startContinuousReconnection();
      }
    } else {
      console.log('❌ Auto-reconnection DISABLED');
      get().stopContinuousReconnection();
    }
  },

  /**
   * 18. Check if Auto-Reconnect is Active
   */
  isAutoReconnectActive: () => {
    const { continuousReconnectEnabled, savedDevice } = get();
    return continuousReconnectEnabled && savedDevice !== null;
  },

  /**
   * 19. Force Stop All Reconnection Activities
   */
  forceStopReconnection: () => {
    const { scanInterval, bleManager } = get();
    
    console.log('🛑 Force stopping all reconnection activities...');
    
    if (scanInterval) {
      clearInterval(scanInterval);
    }
    
    try {
      bleManager.stopDeviceScan();
    } catch (error) {
      console.warn('Error stopping scan:', error);
    }
    
    set({
      scanInterval: null,
      isAttemptingReconnect: false,
      isCurrentlyScanning: false,
      reconnectAttemptCount: 0,
      continuousReconnectEnabled: false,
    });
    
    console.log('✅ All reconnection activities stopped');
  },

// Add this function to your useBLEReconnectionStore
/**
 * 20. Initialize Auto-Reconnection System
 */
initializeAutoReconnection: async () => {
  try {
    console.log('🚀 Initializing auto-reconnection system...');
    
    // Load saved device
    const savedDevice = await get().loadSavedDevice();
    
    if (savedDevice) {
      console.log('📱 Saved device found:', savedDevice.name);
      console.log('🔄 Auto-reconnection will be active');
      
      // Check if we should start reconnection immediately
      const { isConnected } = await import('./augBleStore').then(module => module.useBLEStore.getState());
      
      if (!isConnected) {
        console.log('🔌 Device not connected, starting auto-reconnection...');
        // Small delay to ensure BLE system is ready
        setTimeout(() => {
          get().startContinuousReconnection();
        }, 2000);
      } else {
        console.log('✅ Device already connected');
      }
    } else {
      console.log('📭 No saved device for auto-reconnection');
    }
    
    return savedDevice;
  } catch (error) {
    console.error('❌ Error initializing auto-reconnection:', error);
    return null;
  }
},

/**
 * 21. Enhanced scan with better device matching
 */
scanForSavedDevice: async (deviceId) => {
  const { bleManager } = get();

  return new Promise((resolve) => {
    let foundDevice = null;
    const scanTimeout = 6000; // Increased to 6 seconds for better detection
    let devicesFound = 0;
    let scanStarted = false;

    console.log('📡 Starting BLE scan for saved device...');
    console.log('🎯 Target device ID:', deviceId);

    const timeout = setTimeout(() => {
      console.log(`📊 Scan complete. Total devices found: ${devicesFound}`);
      if (scanStarted) {
        bleManager.stopDeviceScan();
      }
      
      if (!foundDevice) {
        console.log('❌ Target device not found in this scan');
      }
      
      resolve(foundDevice);
    }, scanTimeout);

    try {
      scanStarted = true;
      bleManager.startDeviceScan(
        null,
        { 
          allowDuplicates: false,
          scanMode: 1, // BALANCED scan mode for better reliability
        },
        (error, device) => {
          if (error) {
            console.error('❌ Scan error:', error.message);
            clearTimeout(timeout);
            if (scanStarted) {
              bleManager.stopDeviceScan();
              scanStarted = false;
            }
            resolve(null);
            return;
          }

          if (device) {
            devicesFound++;
            
            // More flexible device matching
            const deviceName = device.name || device.localName || 'Unknown';
            const isTargetDevice = device.id === deviceId || 
                                 deviceName.includes('ESP32C3_SkatingBand') ||
                                 device.id.toLowerCase() === deviceId.toLowerCase();
            
            if (isTargetDevice) {
              console.log('🎯 ✅ TARGET DEVICE FOUND!');
              console.log('📱 Device:', deviceName);
              console.log('🔗 ID:', device.id);
              
              foundDevice = device;
              clearTimeout(timeout);
              if (scanStarted) {
                bleManager.stopDeviceScan();
                scanStarted = false;
              }
              resolve(device);
            }
          }
        }
      );
    } catch (scanError) {
      console.error('❌ Failed to start scan:', scanError);
      clearTimeout(timeout);
      resolve(null);
    }
  });
},

}));