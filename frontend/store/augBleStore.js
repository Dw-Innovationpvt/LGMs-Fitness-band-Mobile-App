// store/useBLEStore.js (Combined Store)
import { create } from 'zustand';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// Storage keys for persistence
const STORAGE_KEYS = {
  SAVED_DEVICE: 'savedDevice',
  CONNECTION_HISTORY: 'connectionHistory',
};

// Helper function to normalize UUIDs
function normalizeUUID(uuid) {
  if (!uuid) return '';
  return uuid.toLowerCase().replace(/-/g, '');
}

// Helper function to fix incomplete JSON
function fixIncompleteJson(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') return '';
  
  const openBraces = (jsonString.match(/{/g) || []).length;
  const closeBraces = (jsonString.match(/}/g) || []).length;
  const openBrackets = (jsonString.match(/\[/g) || []).length;
  const closeBrackets = (jsonString.match(/\]/g) || []).length;
  
  let fixedJson = jsonString.trim();
  
  for (let i = 0; i < openBraces - closeBraces; i++) {
    fixedJson += '}';
  }
  
  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    fixedJson += ']';
  }
  
  return fixedJson;
}

// Map mode abbreviations to display names
const modeMap = {
  'S': 'Step Counting',
  'SS': 'Speed Skating', 
  'SD': 'Distance Skating'
};

// Format BLE data
function formatBLEData(data) {
  if (!data) return null;
  
  console.log('Original BLE data received:', JSON.stringify(data));
  
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
    rawData: data
  };
  
  console.log('Formatted BLE data:', JSON.stringify(formattedData));
  return formattedData;
}

// Request BLE permissions
const requestBLEPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      console.log('Requesting BLE permissions for Android ' + Platform.Version);
      
      const locationPermissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];
      
      if (Platform.Version <= 30) {
        const granted = await PermissionsAndroid.requestMultiple(locationPermissions);
        const hasLocationPermission = 
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        return hasLocationPermission;
      } else {
        const permissions = [
          ...locationPermissions,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ];
        
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        const hasLocationPermission = 
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        
        const hasBluetoothPermission = 
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED;
        
        return hasLocationPermission && hasBluetoothPermission;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
  return true;
};

/**
 * COMBINED BLE STORE
 * Includes both main BLE functionality and auto-reconnection
 */
export const useBLEStore = create((set, get) => ({
  // ========== Main BLE State ==========
  bleManager: new BleManager(),
  connectedDevice: null,
  characteristic: null,
  isConnected: false,
  bandActive: false,
  data: null,
  foundDevices: [],
  isScanning: false,
  error: null,
  currentMode: 'S',
  sessionData: {
    startTime: null,
    totalSteps: 0,
    totalSkatingDistance: 0,
    totalWalkingDistance: 0,
    maxSpeed: 0,
    sessionDuration: 0
  },

  // ========== Auto-Reconnection State ==========
  savedDevice: null,
  isAttemptingReconnect: false,
  continuousReconnectEnabled: false,
  scanInterval: null,
  connectionHistory: [],
  reconnectAttemptCount: 0,
  isCurrentlyScanning: false,

  // ========== Auto-Reconnection Functions ==========

  /**
   * Save Connection Data for Auto-Reconnection
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
      return true;
    } catch (error) {
      console.error('❌ Failed to save connection data:', error);
      return false;
    }
  },

  /**
   * Load Saved Device on App Start
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
   * Clear Saved Device
   */
  clearSavedDevice: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_DEVICE);
      get().stopContinuousReconnection();
      set({ 
        savedDevice: null,
        continuousReconnectEnabled: false
      });
      console.log('🗑️ Device forgotten');
    } catch (error) {
      console.error('❌ Error clearing saved device:', error);
    }
  },

  /**
   * Check BLE State
   */
  checkBLEState: async () => {
    const { bleManager } = get();
    try {
      const state = await bleManager.state();
      console.log('📡 BLE State:', state);
      return state === 'PoweredOn';
    } catch (error) {
      console.error('❌ Error checking BLE state:', error);
      return false;
    }
  },

  /**
   * Handle Disconnection - Start Auto-Reconnection
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

    get().startContinuousReconnection();
  },

  /**
   * Start Continuous Reconnection Loop
   */
  startContinuousReconnection: () => {
    const { scanInterval, continuousReconnectEnabled } = get();

    if (!continuousReconnectEnabled) {
      console.log('⚠️ Auto-reconnect is disabled');
      return;
    }

    if (scanInterval) {
      clearInterval(scanInterval);
    }

    set({ isAttemptingReconnect: true, reconnectAttemptCount: 0 });

    console.log('🔄 Continuous reconnection started');
    console.log('📡 Scanning every 5 seconds...');

    // Start first attempt immediately
    get().attemptReconnection();

    // Then scan every 5 seconds
    const interval = setInterval(async () => {
      const { continuousReconnectEnabled, isCurrentlyScanning } = get();
      
      if (!continuousReconnectEnabled) {
        console.log('🛑 Auto-reconnect disabled, stopping...');
        clearInterval(interval);
        set({ scanInterval: null, isAttemptingReconnect: false });
        return;
      }

      if (isCurrentlyScanning) {
        console.log('⏭️ Previous scan still running, skipping...');
        return;
      }

      await get().attemptReconnection();
    }, 5000);

    set({ scanInterval: interval });
  },

  /**
   * Stop Continuous Reconnection
   */
  stopContinuousReconnection: () => {
    const { scanInterval, bleManager } = get();

    if (scanInterval) {
      clearInterval(scanInterval);
    }

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
    
    console.log('🛑 Continuous reconnection stopped');
  },

  /**
   * Attempt Reconnection (Single Attempt)
   */
  // attemptReconnection: async () => {
  //   const { savedDevice, bleManager, reconnectAttemptCount, isCurrentlyScanning } = get();

  //   if (!savedDevice || isCurrentlyScanning) return false;

  //   try {
  //     const currentAttempt = reconnectAttemptCount + 1;
  //     set({ reconnectAttemptCount: currentAttempt, isCurrentlyScanning: true });

  //     console.log(`\n🔍 ========== Reconnect Attempt #${currentAttempt} ==========`);
  //     console.log('📱 Looking for:', savedDevice.name, '-', savedDevice.id);

  //     const bleStateOk = await get().checkBLEState();
  //     if (!bleStateOk) {
  //       set({ isCurrentlyScanning: false });
  //       return false;
  //     }

  //     const hasPermissions = await requestBLEPermissions();
  //     if (!hasPermissions) {
  //       set({ isCurrentlyScanning: false });
  //       return false;
  //     }

  //     console.log('📡 Scanning...');
  //     const device = await get().scanForSavedDevice(savedDevice.id);

  //     if (device) {
  //       console.log('✅ DEVICE FOUND! Connecting...');

  //       const connectedDevice = await bleManager.connectToDevice(device.id, {
  //         timeout: 15000,
  //         requestMTU: 185
  //       });

  //       if (connectedDevice) {
  //         console.log('🎉 RECONNECTED SUCCESSFULLY!');
  //         get().stopContinuousReconnection();

  //         // Restore full connection
  //         await get().connectToDevice(connectedDevice);

  //         set({ 
  //           isAttemptingReconnect: false,
  //           isCurrentlyScanning: false,
  //           reconnectAttemptCount: 0
  //         });

  //         await get().addToConnectionHistory('reconnected', savedDevice);

  //         Alert.alert('✅ Reconnected!', `Successfully reconnected to ${savedDevice.name}`);
  //         return true;
  //       }
  //     } else {
  //       console.log(`📵 Device not found (attempt #${currentAttempt})`);
  //       set({ isCurrentlyScanning: false });
  //     }
  //   } catch (error) {
  //     console.error(`❌ Reconnection error:`, error.message);
  //     set({ isCurrentlyScanning: false });
  //   }

  //   return false;
  // },

  /**
 * Attempt Reconnection (Single Attempt)
 */
attemptReconnection: async () => {
  const { savedDevice, bleManager, reconnectAttemptCount, isCurrentlyScanning } = get();

  if (!savedDevice || isCurrentlyScanning) return false;

  try {
    const currentAttempt = reconnectAttemptCount + 1;
    set({ reconnectAttemptCount: currentAttempt, isCurrentlyScanning: true });

    console.log(`\n🔍 ========== Reconnect Attempt #${currentAttempt} ==========`);
    console.log('📱 Looking for:', savedDevice.name, '-', savedDevice.id);

    const bleStateOk = await get().checkBLEState();
    if (!bleStateOk) {
      set({ isCurrentlyScanning: false });
      return false;
    }

    const hasPermissions = await requestBLEPermissions();
    if (!hasPermissions) {
      set({ isCurrentlyScanning: false });
      return false;
    }

    console.log('📡 Scanning...');
    const device = await get().scanForSavedDevice(savedDevice.id);

    if (device) {
      console.log('✅ DEVICE FOUND! Connecting...');

      const connectedDevice = await bleManager.connectToDevice(device.id, {
        timeout: 15000,
        requestMTU: 185
      });

      if (connectedDevice) {
        console.log('🎉 RECONNECTED SUCCESSFULLY!');
        get().stopContinuousReconnection();

        // 🛠️ FIX: Pass isReconnection = true to preserve session data
        await get().connectToDevice(connectedDevice, true);

        set({ 
          isAttemptingReconnect: false,
          isCurrentlyScanning: false,
          reconnectAttemptCount: 0
        });

        await get().addToConnectionHistory('reconnected', savedDevice);

        Alert.alert('✅ Reconnected!', `Successfully reconnected to ${savedDevice.name}\n\nSession data preserved.`);
        return true;
      }
    } else {
      console.log(`📵 Device not found (attempt #${currentAttempt})`);
      set({ isCurrentlyScanning: false });
    }
  } catch (error) {
    console.error(`❌ Reconnection error:`, error.message);
    set({ isCurrentlyScanning: false });
  }

  return false;
},

  /**
   * Scan for Saved Device
   */
  scanForSavedDevice: async (deviceId) => {
    const { bleManager } = get();

    return new Promise((resolve) => {
      let foundDevice = null;
      const scanTimeout = 4000;
      let devicesFound = 0;

      console.log('📡 Scanning for:', deviceId);

      const timeout = setTimeout(() => {
        console.log(`📊 Scan complete. Devices found: ${devicesFound}`);
        bleManager.stopDeviceScan();
        resolve(foundDevice);
      }, scanTimeout);

      bleManager.startDeviceScan(
        null,
        { 
          allowDuplicates: false,
          scanMode: 2,
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
            const deviceName = device.name || device.localName || 'Unknown';
            console.log(`📱 Device #${devicesFound}: ${deviceName} (${device.id})`);

            if (device.id === deviceId) {
              console.log('🎯 ✅ TARGET DEVICE MATCHED!');
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
   * Manual Reconnection Trigger
   */
  manualReconnect: async () => {
    const { savedDevice } = get();

    if (!savedDevice) {
      Alert.alert('No Device', 'No previously connected device found');
      return false;
    }

    console.log('🔄 Manual reconnection triggered');
    set({ continuousReconnectEnabled: true });
    get().startContinuousReconnection();
    
    Alert.alert('Reconnection Started', `Scanning for ${savedDevice.name}...`);
    return true;
  },

  /**
   * Set Auto-Reconnect On/Off
   */
  setAutoReconnect: (enabled) => {
    set({ continuousReconnectEnabled: enabled });
    
    if (enabled) {
      console.log('✅ Auto-reconnection ENABLED');
      const { isAttemptingReconnect, savedDevice } = get();
      if (!isAttemptingReconnect && savedDevice) {
        get().startContinuousReconnection();
      }
    } else {
      console.log('❌ Auto-reconnection DISABLED');
      get().stopContinuousReconnection();
    }
  },

  /**
   * Connection History Management
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
    } catch (error) {
      console.error('Error updating history:', error);
    }
  },

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

  clearConnectionHistory: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CONNECTION_HISTORY);
      set({ connectionHistory: [] });
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  /**
   * Get Reconnection Status
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

  // ========== Main BLE Functions ==========

  /**
   * Scan for BLE Devices
   */
  scanForDevices: async () => {
    const { bleManager } = get();
    set({ isScanning: true, foundDevices: [], error: null });
    
    console.log('Starting BLE device scan...');
    
    try {
      const bleState = await bleManager.state();
      console.log('BLE State:', bleState);
      
      if (bleState !== 'PoweredOn') {
        set({ 
          isScanning: false, 
          error: 'Bluetooth is not enabled. Please turn on Bluetooth and try again.' 
        });
        return [];
      }
      
      const hasPermissions = await requestBLEPermissions();
      if (!hasPermissions) {
        set({ 
          isScanning: false, 
          error: 'Bluetooth and location permissions are required.'
        });
        return [];
      }
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          bleManager.stopDeviceScan();
          set({ isScanning: false });
          
          const devices = get().foundDevices;
          console.log(`Scan completed. Found ${devices.length} devices`);
          
          if (devices.length === 0) {
            set({ error: 'No devices found. Make sure Bluetooth is enabled and your device is nearby.' });
          }
          
          resolve(devices);
        }, 15000);

        bleManager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
          if (error) {
            console.error('BLE Scan error:', error.message);
            clearTimeout(timeout);
            bleManager.stopDeviceScan();
            set({ isScanning: false, error: `Bluetooth error: ${error.message}` });
            resolve([]);
            return;
          }
          
          const deviceName = device.name || device.localName || '';
          if (deviceName.includes('ESP32C3_SkatingBand')) {
            console.log(`Found target device: ${deviceName} (${device.id})`);
            set((state) => {
              const exists = state.foundDevices.some(d => d.id === device.id);
              if (!exists) {
                return { foundDevices: [...state.foundDevices, device] };
              }
              return state;
            });
          }
        });
      });
    } catch (e) {
      console.error('Unexpected error during BLE scan:', e);
      bleManager.stopDeviceScan();
      set({ isScanning: false, error: `Unexpected error: ${e.message}` });
      return [];
    }
  },

  /**
   * Connect to BLE Device
   */
  // connectToDevice: async (device) => {
  //   try {
  //     console.log('🔗 Connecting to device:', device.name || device.id);
  //     const bleManager = get().bleManager;

  //     set({ error: null });

  //     // Disconnect any existing connection
  //     const { connectedDevice } = get();
  //     if (connectedDevice) {
  //       try {
  //         await connectedDevice.cancelConnection();
  //       } catch (disconnectError) {
  //         console.warn('Error disconnecting previous device:', disconnectError);
  //       }
  //     }

  //     bleManager.stopDeviceScan();

  //     console.log('Attempting connection...');
  //     const deviceConnection = await Promise.race([
  //       device.connect(),
  //       new Promise((_, reject) =>
  //         setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
  //       ),
  //     ]);

  //     console.log('✅ Connected successfully, discovering services...');
  //     await deviceConnection.discoverAllServicesAndCharacteristics();

  //     try {
  //       await deviceConnection.requestMTU(185);
  //       console.log('MTU set to 185');
  //     } catch (mtuError) {
  //       console.warn('MTU request failed:', mtuError);
  //     }

  //     const services = await deviceConnection.services();
  //     console.log('Available services:', services.map(s => s.uuid));

  //     const normalizedTargetServiceUUID = normalizeUUID(SERVICE_UUID);
  //     let targetService = services.find(
  //       (s) => normalizeUUID(s.uuid) === normalizedTargetServiceUUID
  //     );

  //     if (!targetService) {
  //       throw new Error(`Service ${SERVICE_UUID} not found on device`);
  //     }
  //     console.log('✅ Found target service:', targetService.uuid);

  //     const characteristics = await deviceConnection.characteristicsForService(targetService.uuid);
  //     const normalizedTargetCharUUID = normalizeUUID(CHARACTERISTIC_UUID);
  //     let targetCharacteristic = characteristics.find(
  //       (c) => normalizeUUID(c.uuid) === normalizedTargetCharUUID
  //     );

  //     if (!targetCharacteristic) {
  //       console.warn('⚠️ Target characteristic not found, using first available');
  //       targetCharacteristic = characteristics[0];
  //     }
  //     console.log('✅ Using characteristic:', targetCharacteristic.uuid);

  //     // ✅ Save connection data for auto-reconnection
  //     await get().saveConnectionData(deviceConnection, targetCharacteristic);

  //     set({
  //       connectedDevice: deviceConnection,
  //       characteristic: targetCharacteristic,
  //       isConnected: true,
  //       bandActive: true,
  //       error: null,
  //       sessionData: {
  //         startTime: new Date(),
  //         totalSteps: 0,
  //         totalSkatingDistance: 0,
  //         totalWalkingDistance: 0,
  //         maxSpeed: 0,
  //         sessionDuration: 0,
  //       },
  //     });

  //     // Set up characteristic monitoring
  //     if (targetCharacteristic.isNotifiable) {
  //       console.log('📡 Setting up characteristic monitoring...');
  //       deviceConnection.monitorCharacteristicForService(
  //         targetService.uuid,
  //         targetCharacteristic.uuid,
  //         (error, characteristic) => {
  //           if (error) {
  //             console.error('❌ Monitor error:', error);
  //             return;
  //           }

  //           const base64Value = characteristic?.value;
  //           if (!base64Value) return;

  //           try {
  //             const json = Buffer.from(base64Value, 'base64').toString('utf-8');
  //             const parsed = JSON.parse(json);
  //             console.log('📨 Received data:', parsed);

  //             const formattedData = formatBLEData(parsed);
  //             set((state) => ({
  //               data: formattedData,
  //               currentMode: formattedData.mode,
  //               bandActive: true,
  //               sessionData: {
  //                 ...state.sessionData,
  //                 totalSteps: Math.max(state.sessionData.totalSteps, formattedData.stepCount),
  //                 totalWalkingDistance: Math.max(state.sessionData.totalWalkingDistance, formattedData.walkingDistance),
  //                 totalSkatingDistance: Math.max(state.sessionData.totalSkatingDistance, formattedData.skatingDistance),
  //                 maxSpeed: Math.max(state.sessionData.maxSpeed, formattedData.maxSpeed),
  //                 sessionDuration: Math.floor((new Date() - state.sessionData.startTime) / 1000),
  //               },
  //             }));
  //           } catch (parseError) {
  //             console.warn('⚠️ Parse error:', parseError.message);
  //           }
  //         }
  //       );
  //     }

  //     // Send initial commands
  //     setTimeout(async () => {
  //       try {
  //         await get().sendCommand('TURN_ON');
  //         console.log('✅ Sent TURN_ON command');
  //         setTimeout(async () => {
  //           await get().sendCommand('SET_MODE STEP_COUNTING');
  //           console.log('✅ Activated STEP_COUNTING mode');
  //         }, 1000);
  //       } catch (cmdError) {
  //         console.warn('⚠️ Could not send command:', cmdError);
  //       }
  //     }, 1000);

  //     // ✅ Handle disconnection and trigger auto-reconnection
  //     deviceConnection.onDisconnected(async (error, disconnectedDevice) => {
  //       console.log('🔌 Device disconnected:', disconnectedDevice?.id);
  //       if (error) console.error('Disconnection error:', error);

  //       set({
  //         isConnected: false,
  //         connectedDevice: null,
  //         characteristic: null,
  //         bandActive: false,
  //         data: null,
  //         currentMode: 'S',
  //       });

  //       console.log('🔄 Triggering auto-reconnection...');
  //       await get().handleDisconnection();
  //     });

  //     Alert.alert(
  //       'Connected', 
  //       `Connected to ${device.name || device.id}\n\nAuto-reconnection is now enabled.`
  //     );
  //     console.log('✅ Device connected successfully');
      
  //   } catch (err) {
  //     console.error('❌ Connection error:', err);
  //     set({
  //       isConnected: false,
  //       connectedDevice: null,
  //       characteristic: null,
  //       error: err.message || 'Failed to connect to device',
  //     });
  //     Alert.alert('Connection Error', err.message || 'Failed to connect to device');
  //     throw err;
  //   }
  // },

  /**
 * Connect to BLE Device (Fixed to preserve session data)
 */
connectToDevice: async (device, isReconnection = false) => {
  try {
    console.log('🔗 Connecting to device:', device.name || device.id);
    const bleManager = get().bleManager;

    set({ error: null });

    // Disconnect any existing connection
    const { connectedDevice } = get();
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
      } catch (disconnectError) {
        console.warn('Error disconnecting previous device:', disconnectError);
      }
    }

    bleManager.stopDeviceScan();

    console.log('Attempting connection...');
    const deviceConnection = await Promise.race([
      device.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
      ),
    ]);

    console.log('✅ Connected successfully, discovering services...');
    await deviceConnection.discoverAllServicesAndCharacteristics();

    try {
      await deviceConnection.requestMTU(185);
      console.log('MTU set to 185');
    } catch (mtuError) {
      console.warn('MTU request failed:', mtuError);
    }

    const services = await deviceConnection.services();
    console.log('Available services:', services.map(s => s.uuid));

    const normalizedTargetServiceUUID = normalizeUUID(SERVICE_UUID);
    let targetService = services.find(
      (s) => normalizeUUID(s.uuid) === normalizedTargetServiceUUID
    );

    if (!targetService) {
      throw new Error(`Service ${SERVICE_UUID} not found on device`);
    }
    console.log('✅ Found target service:', targetService.uuid);

    const characteristics = await deviceConnection.characteristicsForService(targetService.uuid);
    const normalizedTargetCharUUID = normalizeUUID(CHARACTERISTIC_UUID);
    let targetCharacteristic = characteristics.find(
      (c) => normalizeUUID(c.uuid) === normalizedTargetCharUUID
    );

    if (!targetCharacteristic) {
      console.warn('⚠️ Target characteristic not found, using first available');
      targetCharacteristic = characteristics[0];
    }
    console.log('✅ Using characteristic:', targetCharacteristic.uuid);

    // ✅ Save connection data for auto-reconnection
    await get().saveConnectionData(deviceConnection, targetCharacteristic);

    // 🛠️ FIX: Only reset session data for new sessions, not reconnections
    const currentState = get();
    const shouldResetSession = !isReconnection || !currentState.sessionData.startTime;

    set({
      connectedDevice: deviceConnection,
      characteristic: targetCharacteristic,
      isConnected: true,
      bandActive: true,
      error: null,
      sessionData: shouldResetSession ? {
        startTime: new Date(),
        totalSteps: 0,
        totalSkatingDistance: 0,
        totalWalkingDistance: 0,
        maxSpeed: 0,
        sessionDuration: 0,
      } : currentState.sessionData, // ← Preserve existing session data during reconnection
    });

    // Set up characteristic monitoring
    if (targetCharacteristic.isNotifiable) {
      console.log('📡 Setting up characteristic monitoring...');
      deviceConnection.monitorCharacteristicForService(
        targetService.uuid,
        targetCharacteristic.uuid,
        (error, characteristic) => {
          if (error) {
            console.error('❌ Monitor error:', error);
            return;
          }

          const base64Value = characteristic?.value;
          if (!base64Value) return;

          try {
            const json = Buffer.from(base64Value, 'base64').toString('utf-8');
            const parsed = JSON.parse(json);
            console.log('📨 Received data:', parsed);

            const formattedData = formatBLEData(parsed);
            set((state) => ({
              data: formattedData,
              currentMode: formattedData.mode,
              bandActive: true,
              sessionData: {
                ...state.sessionData,
                totalSteps: Math.max(state.sessionData.totalSteps, formattedData.stepCount),
                totalWalkingDistance: Math.max(state.sessionData.totalWalkingDistance, formattedData.walkingDistance),
                totalSkatingDistance: Math.max(state.sessionData.totalSkatingDistance, formattedData.skatingDistance),
                maxSpeed: Math.max(state.sessionData.maxSpeed, formattedData.maxSpeed),
                sessionDuration: Math.floor((new Date() - state.sessionData.startTime) / 1000),
              },
            }));
          } catch (parseError) {
            console.warn('⚠️ Parse error:', parseError.message);
          }
        }
      );
    }

    // Send initial commands (only for new connections, not reconnections)
    if (!isReconnection) {
      setTimeout(async () => {
        try {
          await get().sendCommand('TURN_ON');
          console.log('✅ Sent TURN_ON command');
          setTimeout(async () => {
            await get().sendCommand('SET_MODE STEP_COUNTING');
            console.log('✅ Activated STEP_COUNTING mode');
          }, 1000);
        } catch (cmdError) {
          console.warn('⚠️ Could not send command:', cmdError);
        }
      }, 1000);
    }

    // ✅ Handle disconnection and trigger auto-reconnection
    deviceConnection.onDisconnected(async (error, disconnectedDevice) => {
      console.log('🔌 Device disconnected:', disconnectedDevice?.id);
      if (error) console.error('Disconnection error:', error);

      set({
        isConnected: false,
        connectedDevice: null,
        characteristic: null,
        bandActive: false,
        data: null,
        currentMode: 'S',
        // 🛠️ FIX: Don't reset sessionData here - preserve it for reconnection
      });

      console.log('🔄 Triggering auto-reconnection...');
      await get().handleDisconnection();
    });

    if (isReconnection) {
      console.log('✅ Device reconnected successfully - Session data preserved');
    } else {
      Alert.alert(
        'Connected', 
        `Connected to ${device.name || device.id}\n\nAuto-reconnection is now enabled.`
      );
      console.log('✅ Device connected successfully');
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err);
    set({
      isConnected: false,
      connectedDevice: null,
      characteristic: null,
      error: err.message || 'Failed to connect to device',
    });
    
    if (!isReconnection) {
      Alert.alert('Connection Error', err.message || 'Failed to connect to device');
    }
    
    throw err;
  }
},

  /**
   * Send Command to Device
   */
  sendCommand: async (cmd) => {
    const { connectedDevice, characteristic } = get();
    if (!connectedDevice || !characteristic) {
      console.warn('⚠ Cannot send command - no device or characteristic');
      return false;
    }

    if (!cmd || typeof cmd !== 'string') {
      console.error('❌ Invalid command format:', cmd);
      return false;
    }

    try {
      const formattedCmd = cmd.trim();
      console.log('📤 Sending command:', formattedCmd);
      
      const base64Cmd = Buffer.from(formattedCmd, 'utf-8').toString('base64');
      
      if (characteristic.isWritableWithResponse) {
        await connectedDevice.writeCharacteristicWithResponseForService(
          characteristic.serviceUUID,
          characteristic.uuid,
          base64Cmd
        );
      } else if (characteristic.isWritableWithoutResponse) {
        await connectedDevice.writeCharacteristicWithoutResponseForService(
          characteristic.serviceUUID,
          characteristic.uuid,
          base64Cmd
        );
      } else {
        console.error('❌ Characteristic is not writable');
        return false;
      }
      
      console.log('✅ Command sent:', formattedCmd);
      return true;
    } catch (err) {
      console.error('❌ Send command error:', err);
      return false;
    }
  },

  /**
   * Toggle Band On/Off
   */
  toggleBand: async () => {
    const { bandActive, sendCommand } = get();
    const success = await sendCommand(bandActive ? 'TURN_OFF' : 'TURN_ON');
    if (success) {
      set({ 
        bandActive: !bandActive,
        sessionData: !bandActive ? {
          startTime: new Date(),
          totalSteps: 0,
          totalSkatingDistance: 0,
          totalWalkingDistance: 0,
          maxSpeed: 0,
          sessionDuration: 0
        } : get().sessionData
      });
    }
    return success;
  },

  /**
   * Mode Switching Functions
   */
  setStepCountingMode: async () => {
    const success = await get().sendCommand('SET_MODE STEP_COUNTING');
    if (success) {
      set({ currentMode: 'S' });
    }
    return success;
  },

  setSpeedSkatingMode: async () => {
    const success = await get().sendCommand('SET_MODE SKATING_SPEED');
    if (success) {
      set({ currentMode: 'SS' });
    }
    return success;
  },

  setDistanceSkatingMode: async () => {
    const success = await get().sendCommand('SET_MODE SKATING_DISTANCE');
    if (success) {
      set({ currentMode: 'SD' });
    }
    return success;
  },

  /**
   * Configuration Commands
   */
  setSkateConfig: async (wheelDiameterMM, trackLengthM) => {
    const cmd = `SET_CONFIG SKATE ${wheelDiameterMM} ${trackLengthM}`;
    return await get().sendCommand(cmd);
  },

  /**
   * Session Management
   */
  startNewSession: () => {
    set({
      sessionData: {
        startTime: new Date(),
        totalSteps: 0,
        totalSkatingDistance: 0,
        totalWalkingDistance: 0,
        maxSpeed: 0,
        sessionDuration: 0
      },
      data: null
    });
  },

  /**
   * Get Session Summary
   */
  getSessionSummary: () => {
    const { sessionData, data, currentMode } = get();
    
    return {
      mode: currentMode,
      startTime: sessionData.startTime,
      endTime: new Date(),
      duration: sessionData.sessionDuration,
      stepCount: data?.stepCount || 0,
      walkingDistance: data?.walkingDistance || 0,
      strideCount: data?.strideCount || 0,
      skatingDistance: data?.skatingDistance || 0,
      speedData: {
        currentSpeed: data?.speed || 0,
        maxSpeed: data?.maxSpeed || 0,
        minSpeed: data?.minSpeed || 0,
        averageSpeed: data?.speed || 0
      },
      laps: data?.laps || 0
    };
  },

  /**
   * Disconnect Device
   */
  // disconnect: async (forgetDevice = false) => {
  //   const { connectedDevice, bleManager } = get();
    
  //   try {
  //     console.log('🔌 Manual disconnect requested...');
      
  //     // Stop auto-reconnection if forgetting device
  //     if (forgetDevice) {
  //       console.log('🗑️ Forgetting device - Auto-reconnection DISABLED');
  //       await get().clearSavedDevice();
  //     } else {
  //       console.log('💾 Keeping device saved - Auto-reconnection temporarily DISABLED');
  //       get().stopContinuousReconnection();
  //       get().setAutoReconnect(false);
  //     }
      
  //     if (connectedDevice) {
  //       await connectedDevice.cancelConnection();
  //     }
  //   } catch (error) {
  //     console.warn('Error during disconnect:', error);
  //   } finally {
  //     bleManager.stopDeviceScan();
  //     set({ 
  //       isConnected: false, 
  //       bandActive: false, 
  //       connectedDevice: null,
  //       characteristic: null,
  //       data: null,
  //       error: null,
  //       currentMode: 'S',
  //       sessionData: {
  //         startTime: null,
  //         totalSteps: 0,
  //         totalSkatingDistance: 0,
  //         totalWalkingDistance: 0,
  //         maxSpeed: 0,
  //         sessionDuration: 0
  //       }
  //     });
      
  //     if (forgetDevice) {
  //       console.log('✅ Disconnected and device forgotten');
  //       Alert.alert('Disconnected', 'Device has been disconnected and forgotten.');
  //     } else {
  //       console.log('✅ Disconnected (device saved)');
  //       Alert.alert(
  //         'Disconnected', 
  //         'Device disconnected. Auto-reconnection is temporarily disabled.',
  //         [
  //           { text: 'OK' },
  //           {
  //             text: 'Enable Auto-Reconnect',
  //             onPress: () => get().setAutoReconnect(true)
  //           }
  //         ]
  //       );
  //     }
  //   }
  // },


  /**
 * Disconnect Device
 */
disconnect: async (forgetDevice = false, resetSession = false) => {
  const { connectedDevice, bleManager } = get();
  
  try {
    console.log('🔌 Manual disconnect requested...');
    
    // Stop auto-reconnection if forgetting device
    if (forgetDevice) {
      console.log('🗑️ Forgetting device - Auto-reconnection DISABLED');
      await get().clearSavedDevice();
    } else {
      console.log('💾 Keeping device saved - Auto-reconnection temporarily DISABLED');
      get().stopContinuousReconnection();
      get().setAutoReconnect(false);
    }
    
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
    }
  } catch (error) {
    console.warn('Error during disconnect:', error);
  } finally {
    bleManager.stopDeviceScan();
    set({ 
      isConnected: false, 
      bandActive: false, 
      connectedDevice: null,
      characteristic: null,
      data: null,
      error: null,
      currentMode: 'S',
      // 🛠️ FIX: Only reset session data if explicitly requested
      ...(resetSession && {
        sessionData: {
          startTime: null,
          totalSteps: 0,
          totalSkatingDistance: 0,
          totalWalkingDistance: 0,
          maxSpeed: 0,
          sessionDuration: 0
        }
      })
    });
    
    if (forgetDevice) {
      console.log('✅ Disconnected and device forgotten');
      Alert.alert('Disconnected', 'Device has been disconnected and forgotten.');
    } else {
      console.log('✅ Disconnected (device saved)');
      Alert.alert(
        'Disconnected', 
        'Device disconnected. Auto-reconnection is temporarily disabled.',
        [
          { text: 'OK' },
          {
            text: 'Enable Auto-Reconnect',
            onPress: () => get().setAutoReconnect(true)
          }
        ]
      );
    }
  }
},
  /**
   * Get Current Mode Display Name
   */
  getCurrentModeDisplay: () => {
    const { currentMode } = get();
    return modeMap[currentMode] || 'Step Counting';
  },

  /**
   * Reset All Data
   */
  resetData: () => {
    set({
      data: null,
      sessionData: {
        startTime: new Date(),
        totalSteps: 0,
        totalSkatingDistance: 0,
        totalWalkingDistance: 0,
        maxSpeed: 0,
        sessionDuration: 0
      }
    });
  },
}));