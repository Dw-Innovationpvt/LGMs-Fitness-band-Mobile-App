import { create } from 'zustand';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

import { useBLEReconnectionStore } from './useBLEReconnectionStore';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// Helper function to normalize UUIDs by removing dashes and converting to lowercase
function normalizeUUID(uuid) {
  if (!uuid) return '';
  return uuid.toLowerCase().replace(/-/g, '');
}

// Helper function to fix incomplete JSON
function fixIncompleteJson(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') return '';
  
  // Count opening and closing braces/brackets
  const openBraces = (jsonString.match(/{/g) || []).length;
  const closeBraces = (jsonString.match(/}/g) || []).length;
  const openBrackets = (jsonString.match(/\[/g) || []).length;
  const closeBrackets = (jsonString.match(/\]/g) || []).length;
  
  let fixedJson = jsonString.trim();
  
  // Add missing closing braces
  for (let i = 0; i < openBraces - closeBraces; i++) {
    fixedJson += '}';
  }
  
  // Add missing closing brackets
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

// Format BLE data to a consistent structure with new speed metrics
function formatBLEData(data) {
  if (!data) return null;
  
  console.log('Original BLE data received:', JSON.stringify(data));
  
  // Create formatted data with proper typing
  const formattedData = {
    // Mode information
    mode: data.mode || 'S',
    modeDisplay: modeMap[data.mode] || 'Step Counting',
    
    // Step counting data
    stepCount: parseInt(data.stepCount) || 0,
    walkingDistance: parseFloat(data.walkingDistance) || 0,
    
    // Skating data
    strideCount: parseInt(data.strideCount) || 0,
    skatingDistance: parseFloat(data.skatingDistance) || 0,
    laps: parseInt(data.laps) || 0,
    
    // New speed metrics from hardware
    speed: parseFloat(data.speed) || 0,        // Current speed in km/h
    maxSpeed: parseFloat(data.maxSpeed) || 0,  // Maximum speed in km/h
    minSpeed: parseFloat(data.minSpeed) || 0,  // Minimum speed in km/h
    
    // Raw data for debugging
    rawData: data
  };
  
  console.log('Formatted BLE data:', JSON.stringify(formattedData));
  return formattedData;
}

// Request all required permissions for BLE scanning on Android
const requestBLEPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      console.log('Requesting BLE permissions for Android ' + Platform.Version);
      
      // Always request location permissions (required for BLE scanning on all Android versions)
      const locationPermissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];
      
      // For Android 10 (API 29) and below
      if (Platform.Version <= 30) {
        console.log('Android 10 or below detected, requesting only location permissions');
        const granted = await PermissionsAndroid.requestMultiple(locationPermissions);
        
        const hasLocationPermission = 
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        
        if (!hasLocationPermission) {
          console.log('Location permissions denied on Android 10 or below');
        }
        
        return hasLocationPermission;
      } 
      // For Android 11 (API 30)
      else if (Platform.Version === 30) {
        console.log('Android 11 detected, requesting location permissions');
        const granted = await PermissionsAndroid.requestMultiple(locationPermissions);
        
        const hasLocationPermission = 
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        
        if (!hasLocationPermission) {
          console.log('Location permissions denied on Android 11');
        }
        
        return hasLocationPermission;
      }
      // For Android 12+ (API 31+)
      else {
        console.log('Android 12+ detected, requesting both location and Bluetooth permissions');
        const permissions = [
          ...locationPermissions,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ];
        
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        // Check if location permissions are granted
        const hasLocationPermission = 
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        
        // Check if Bluetooth permissions are granted
        const hasBluetoothPermission = 
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED;
        
        const allPermissionsGranted = hasLocationPermission && hasBluetoothPermission;
        
        if (!hasLocationPermission) {
          console.log('Location permissions denied on Android 12+');
        }
        
        if (!hasBluetoothPermission) {
          console.log('Bluetooth permissions denied on Android 12+');
        }
        
        return allPermissionsGranted;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  } else {
    // iOS handles permissions differently
    return true;
  }
};

export const useBLEStore = create((set, get) => ({
  bleManager: new BleManager(),
  connectedDevice: null,
  characteristic: null,
  isConnected: false,
  bandActive: false,
  data: null,

  foundDevices: [],
  isScanning: false,
  error: null,

  // Updated mode tracking based on new hardware codes
  currentMode: 'S', // 'S', 'SS', 'SD'
  sessionData: {
    startTime: null,
    totalSteps: 0,
    totalSkatingDistance: 0,
    totalWalkingDistance: 0,
    maxSpeed: 0,
    sessionDuration: 0
  },

  // Scan for BLE devices
  scanForDevices: async () => {
    const { bleManager } = get();
    set({ isScanning: true, foundDevices: [], error: null });
    
    console.log('Starting BLE device scan...');
    
    try {
      // First check if BLE is enabled
      const bleState = await bleManager.state();
      console.log('BLE State:', bleState);
      
      if (bleState !== 'PoweredOn') {
        set({ 
          isScanning: false, 
          error: 'Bluetooth is not enabled. Please turn on Bluetooth and try again.' 
        });
        return [];
      }
      
      // Check for all required permissions (location and Bluetooth)
      const hasPermissions = await requestBLEPermissions();
      if (!hasPermissions) {
        console.error('Required permissions denied - BLE scanning requires location and Bluetooth permissions');
        set({ 
          isScanning: false, 
          error: 'Bluetooth and location permissions are required. Please grant all permissions for Bluetooth scanning to work.'
        });
        return [];
      }
      
      return new Promise((resolve) => {
        // Timeout after 15 seconds
        const timeout = setTimeout(() => {
          console.log('BLE scan timeout reached');
          bleManager.stopDeviceScan();
          set({ isScanning: false });
          
          const devices = get().foundDevices;
          console.log(`Scan completed. Found ${devices.length} devices`);
          
          if (devices.length === 0) {
            console.log('No devices found. Check if Bluetooth is enabled and device is in range');
            set({ error: 'No devices found. Make sure Bluetooth is enabled and your fitness band is nearby.' });
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
          
          // Look specifically for the ESP32C3_SkatingBand device
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

  // connectToDevice: async (device) => {
  //   try {
  //     console.log('Connecting to device:', device.name || device.id);
  //     const bleManager = get().bleManager;
      
  //     // Clear any previous errors
  //     set({ error: null });
      
  //     // Disconnect any existing connection first
  //     const { connectedDevice } = get();
  //     if (connectedDevice) {
  //       console.log('Disconnecting previous device');
  //       try {
  //         await connectedDevice.cancelConnection();
  //       } catch (disconnectError) {
  //         console.warn('Error disconnecting previous device:', disconnectError);
  //       }
  //     }
      
  //     // Stop scanning
  //     bleManager.stopDeviceScan();
      
  //     // Connect to the device with timeout
  //     console.log('Attempting connection...');
  //     const deviceConnection = await Promise.race([
  //       device.connect(),
  //       new Promise((_, reject) => 
  //         setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
  //       )
  //     ]);
      
  //     console.log('Connected successfully, discovering services...');
      
  //     const reconnectionStore = useBLEReconnectionStore.getState();
  //     reconnectionStore.saveConnectionData(deviceConnection, targetCharacteristic);

  //     reconnectionStore.startMonitoring();

  //     // Set connection immediately to provide user feedback
  //     set({ 
  //       connectedDevice: deviceConnection, 
  //       isConnected: true,
  //       error: null,
  //       sessionData: {
  //         startTime: new Date(),
  //         totalSteps: 0,
  //         totalSkatingDistance: 0,
  //         totalWalkingDistance: 0,
  //         maxSpeed: 0,
  //         sessionDuration: 0
  //       }
  //     });
      
  //     // Discover services and characteristics
  //     await deviceConnection.discoverAllServicesAndCharacteristics();

  //     // Try to increase MTU size for larger data packets
  //     try {
  //       await deviceConnection.requestMTU(185);
  //       console.log('MTU set to 185');
  //     } catch (mtuError) {
  //       console.warn('MTU request failed, continuing with default:', mtuError);
  //     }

  //     // Find services
  //     console.log('Finding services and characteristics...');
  //     const services = await deviceConnection.services();
  //     console.log('Available services:', services.map(s => s.uuid));
      
  //     // Look for our specific service
  //     const normalizedTargetServiceUUID = normalizeUUID(SERVICE_UUID);
  //     let targetService = null;
      
  //     for (const service of services) {
  //       const normalizedServiceUUID = normalizeUUID(service.uuid);
  //       console.log(`Comparing service: ${normalizedServiceUUID} with target: ${normalizedTargetServiceUUID}`);
        
  //       if (normalizedServiceUUID === normalizedTargetServiceUUID) {
  //         targetService = service;
  //         console.log('✅ Found target service:', service.uuid);
  //         break;
  //       }
  //     }
      
  //     if (!targetService) {
  //       console.error('Target service not found. Available services:', services.map(s => s.uuid));
  //       throw new Error(`Service ${SERVICE_UUID} not found on device`);
  //     }
      
  //     // Find characteristics for our service
  //     const characteristics = await deviceConnection.characteristicsForService(targetService.uuid);
  //     console.log('Available characteristics:', characteristics.map(c => ({
  //       uuid: c.uuid,
  //       isNotifiable: c.isNotifiable,
  //       isWritableWithResponse: c.isWritableWithResponse,
  //       isWritableWithoutResponse: c.isWritableWithoutResponse
  //     })));
      
  //     // Look for our specific characteristic
  //     const normalizedTargetCharUUID = normalizeUUID(CHARACTERISTIC_UUID);
  //     let targetCharacteristic = null;
      
  //     for (const char of characteristics) {
  //       const normalizedCharUUID = normalizeUUID(char.uuid);
  //       console.log(`Comparing characteristic: ${normalizedCharUUID} with target: ${normalizedTargetCharUUID}`);
        
  //       if (normalizedCharUUID === normalizedTargetCharUUID) {
  //         targetCharacteristic = char;
  //         console.log('✅ Found target characteristic:', char.uuid);
  //         break;
  //       }
  //     }
      
  //     if (!targetCharacteristic) {
  //       console.warn('Target characteristic not found, using first available characteristic');
  //       targetCharacteristic = characteristics[0];
  //     }
      
  //     console.log('Using characteristic:', targetCharacteristic.uuid);
  //     set({ characteristic: targetCharacteristic });

  //     // Set up characteristic monitoring FIRST before sending commands
  //     if (targetCharacteristic.isNotifiable) {
  //       console.log('Setting up characteristic monitoring...');
  //       deviceConnection.monitorCharacteristicForService(
  //         targetService.uuid,
  //         targetCharacteristic.uuid,
  //         (error, characteristic) => {
  //           if (error) {
  //             console.error('❌ Monitor error:', error);
  //             return;
  //           }

  //           const base64Value = characteristic?.value;
  //           if (!base64Value) {
  //             console.warn('⚠ Empty characteristic value');
  //             return;
  //           }
            
  //           try {
  //             const json = Buffer.from(base64Value, 'base64').toString('utf-8');
  //             console.log('📨 Received data:', json);
              
  //             if (!json || json.trim() === '') {
  //               console.warn('⚠ Empty JSON string after decoding');
  //               return;
  //             }

  //             try {
  //               const parsed = JSON.parse(json);
  //               console.log('✅ Successfully parsed JSON data:', parsed);
  //               const formattedData = formatBLEData(parsed);
                
  //               // Update session data with new metrics
  //               set((state) => ({
  //                 data: formattedData,
  //                 currentMode: formattedData.mode,
  //                 bandActive: true,
  //                 sessionData: {
  //                   ...state.sessionData,
  //                   totalSteps: Math.max(state.sessionData.totalSteps, formattedData.stepCount),
  //                   totalWalkingDistance: Math.max(state.sessionData.totalWalkingDistance, formattedData.walkingDistance),
  //                   totalSkatingDistance: Math.max(state.sessionData.totalSkatingDistance, formattedData.skatingDistance),
  //                   maxSpeed: Math.max(state.sessionData.maxSpeed, formattedData.maxSpeed),
  //                   sessionDuration: Math.floor((new Date() - state.sessionData.startTime) / 1000)
  //                 }
  //               }));
  //             } catch (err) {
  //               console.warn('⚠ JSON parse error, trying to fix:', err);
                
  //               // Try to fix incomplete JSON
  //               try {
  //                 const fixedJson = fixIncompleteJson(json);
  //                 if (fixedJson !== json) {
  //                   console.log('Attempting to parse fixed JSON:', fixedJson);
  //                   const parsed = JSON.parse(fixedJson);
  //                   console.log('✅ Successfully parsed after fixing JSON');
  //                   const formattedData = formatBLEData(parsed);
  //                   set({ 
  //                     data: formattedData,
  //                     currentMode: formattedData.mode,
  //                     bandActive: true 
  //                   });
  //                   return;
  //                 }
  //               } catch (fixErr) {
  //                 console.warn('Could not fix JSON:', fixErr);
  //               }
                
  //               // Try to extract JSON from a potentially larger string
  //               try {
  //                 const jsonMatch = json.match(/\{.*\}/s);
  //                 if (jsonMatch && jsonMatch[0]) {
  //                   console.log('Extracted potential JSON:', jsonMatch[0]);
  //                   const parsed = JSON.parse(jsonMatch[0]);
  //                   console.log('✅ Successfully parsed extracted JSON');
  //                   const formattedData = formatBLEData(parsed);
  //                   set({ 
  //                     data: formattedData,
  //                     currentMode: formattedData.mode,
  //                     bandActive: true 
  //                   });
  //                   return;
  //                 }
  //               } catch (extractErr) {
  //                 console.warn('JSON extraction failed:', extractErr);
  //               }
                
  //               // Store raw data if all parsing attempts fail
  //               console.log('📝 Storing as raw data:', json);
  //               set({ data: { rawData: json } });
  //             }
  //           } catch (decodeErr) {
  //             console.error('❌ Base64 decoding error:', decodeErr);
  //           }
  //         }
  //       );
  //     } else {
  //       console.log('Characteristic does not support notifications');
  //     }

  //     // Wait a moment for monitoring setup, then send commands
  //     setTimeout(async () => {
  //       try {
  //         const { sendCommand } = get();
  //         console.log('Sending command: TURN_ON');
  //         await sendCommand('TURN_ON');
  //         console.log('✅ Turn on command sent after connection');
          
  //         // Wait a moment then send step counting mode (default)
  //         setTimeout(async () => {
  //           console.log('Sending command: SET_MODE STEP_COUNTING');
  //           await sendCommand('SET_MODE STEP_COUNTING');
  //           console.log('✅ Step counting mode activated after connection');
  //         }, 1000);
  //       } catch (cmdError) {
  //         console.warn('⚠ Could not send commands after connection:', cmdError);
  //       }
  //     }, 1000);

  //     console.log('✅ Device connected and configured successfully');
  //     Alert.alert('Connected', `Connected to ${device.name || device.id}`);

  //     // Set up disconnect handler
  //     deviceConnection.onDisconnected((error, disconnectedDevice) => {
  //       console.log('Device disconnected:', disconnectedDevice.id);
  //       if (error) {
  //         console.error('Disconnection error:', error);
  //       }
  //       set({ 
  //         isConnected: false, 
  //         connectedDevice: null, 
  //         characteristic: null,
  //         bandActive: false,
  //         data: null,
  //         currentMode: 'S'
  //       });
  //     });

  //   } catch (err) {
  //     console.error('❌ Connection error:', err);
  //     set({ 
  //       isConnected: false, 
  //       connectedDevice: null,
  //       characteristic: null,
  //       error: err.message || 'Failed to connect to device'
  //     });
  //     Alert.alert('Connection Error', err.message || 'Failed to connect to device');
  //     throw err; // Re-throw to handle in UI
  //   }
  // },

  connectToDevice: async (device) => {
  try {
    console.log('🔗 Connecting to device:', device.name || device.id);
    const bleManager = get().bleManager;
    const reconnectionStore = useBLEReconnectionStore.getState();

    // Clear any previous errors
    set({ error: null });

    // Disconnect any existing connection first
    const { connectedDevice } = get();
    if (connectedDevice) {
      console.log('Disconnecting previous device...');
      try {
        await connectedDevice.cancelConnection();
      } catch (disconnectError) {
        console.warn('Error disconnecting previous device:', disconnectError);
      }
    }

    // Stop scanning before connecting
    bleManager.stopDeviceScan();

    // Connect to the new device with a timeout
    console.log('Attempting connection...');
    const deviceConnection = await Promise.race([
      device.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
      ),
    ]);

    console.log('✅ Connected successfully, discovering services...');
    await deviceConnection.discoverAllServicesAndCharacteristics();

    // Try to increase MTU for better data transfer
    try {
      await deviceConnection.requestMTU(185);
      console.log('MTU set to 185');
    } catch (mtuError) {
      console.warn('MTU request failed, continuing with default:', mtuError);
    }

    // Find available services
    const services = await deviceConnection.services();
    console.log('Available services:', services.map(s => s.uuid));

    // Find target service
    const normalizedTargetServiceUUID = normalizeUUID(SERVICE_UUID);
    let targetService = services.find(
      (s) => normalizeUUID(s.uuid) === normalizedTargetServiceUUID
    );

    if (!targetService) {
      console.error('❌ Target service not found on device');
      throw new Error(`Service ${SERVICE_UUID} not found on device`);
    }
    console.log('✅ Found target service:', targetService.uuid);

    // Find characteristics
    const characteristics = await deviceConnection.characteristicsForService(targetService.uuid);
    console.log(
      'Available characteristics:',
      characteristics.map((c) => ({
        uuid: c.uuid,
        isNotifiable: c.isNotifiable,
        isWritableWithResponse: c.isWritableWithResponse,
        isWritableWithoutResponse: c.isWritableWithoutResponse,
      }))
    );

    // Find target characteristic
    const normalizedTargetCharUUID = normalizeUUID(CHARACTERISTIC_UUID);
    let targetCharacteristic = characteristics.find(
      (c) => normalizeUUID(c.uuid) === normalizedTargetCharUUID
    );

    if (!targetCharacteristic) {
      console.warn('⚠️ Target characteristic not found, using first available one.');
      targetCharacteristic = characteristics[0];
    }
    console.log('✅ Using characteristic:', targetCharacteristic.uuid);

    // ✅ Save connection data for future reconnection
    await reconnectionStore.saveConnectionData(deviceConnection, targetCharacteristic);

    // ✅ Start monitoring connection state
    reconnectionStore.startMonitoring();

    // Set connection in store for UI feedback
    set({
      connectedDevice: deviceConnection,
      characteristic: targetCharacteristic,
      isConnected: true,
      bandActive: true,
      error: null,
      sessionData: {
        startTime: new Date(),
        totalSteps: 0,
        totalSkatingDistance: 0,
        totalWalkingDistance: 0,
        maxSpeed: 0,
        sessionDuration: 0,
      },
    });

    // ✅ Set up characteristic monitoring
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
    } else {
      console.log('Characteristic does not support notifications.');
    }

    // ✅ Send commands after connection
    setTimeout(async () => {
      try {
        const { sendCommand } = get();
        await sendCommand('TURN_ON');
        console.log('✅ Sent TURN_ON command');
        setTimeout(async () => {
          await sendCommand('SET_MODE STEP_COUNTING');
          console.log('✅ Activated STEP_COUNTING mode');
        }, 1000);
      } catch (cmdError) {
        console.warn('⚠️ Could not send command after connection:', cmdError);
      }
    }, 1000);

    // ✅ Handle disconnection and trigger reconnection
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
      });

      console.log('🔁 Triggering auto-reconnection process...');
      await reconnectionStore.handleDisconnection();
    });

    Alert.alert('Connected', `Connected to ${device.name || device.id}`);
    console.log('✅ Device connected and configured successfully');
  } catch (err) {
    console.error('❌ Connection error:', err);
    set({
      isConnected: false,
      connectedDevice: null,
      characteristic: null,
      error: err.message || 'Failed to connect to device',
    });
    Alert.alert('Connection Error', err.message || 'Failed to connect to device');
    throw err;
  }
},



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
      // Ensure the command is properly formatted and terminated
      const formattedCmd = cmd.trim();
      console.log('📤 Sending command:', formattedCmd);
      
      // Convert string to base64 for BLE transmission
      const base64Cmd = Buffer.from(formattedCmd, 'utf-8').toString('base64');
      console.log('📤 Base64 encoded command:', base64Cmd);
      
      // Use the correct method based on characteristic capabilities
      if (characteristic.isWritableWithResponse) {
        await connectedDevice.writeCharacteristicWithResponseForService(
          characteristic.serviceUUID,
          characteristic.uuid,
          base64Cmd
        );
        console.log('✅ Command sent with response');
      } else if (characteristic.isWritableWithoutResponse) {
        await connectedDevice.writeCharacteristicWithoutResponseForService(
          characteristic.serviceUUID,
          characteristic.uuid,
          base64Cmd
        );
        console.log('✅ Command sent without response');
      } else {
        console.error('❌ Characteristic is not writable');
        return false;
      }
      
      console.log('✅ Sent command:', formattedCmd);
      return true;
    } catch (err) {
      console.error('❌ Send command error:', err);
      return false;
    }
  },

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

  // Updated mode switching based on new hardware codes
  setStepCountingMode: async () => {
    const success = await get().sendCommand('SET_MODE STEP_COUNTING');
    if (success) {
      set({ currentMode: 'S' });
      console.log('✅ Step counting mode activated');
    }
    return success;
  },

  setSpeedSkatingMode: async () => {
    const success = await get().sendCommand('SET_MODE SKATING_SPEED');
    if (success) {
      set({ currentMode: 'SS' });
      console.log('✅ Speed skating mode activated');
    }
    return success;
  },

  setDistanceSkatingMode: async () => {
    const success = await get().sendCommand('SET_MODE SKATING_DISTANCE');
    if (success) {
      set({ currentMode: 'SD' });
      console.log('✅ Distance skating mode activated');
    }
    return success;
  },

  // Configuration commands
  setSkateConfig: async (wheelDiameterMM, trackLengthM) => {
    const cmd = `SET_CONFIG SKATE ${wheelDiameterMM} ${trackLengthM}`;
    return await get().sendCommand(cmd);
  },

  // Session management
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

  // Get formatted session summary for backend submission
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
        averageSpeed: data?.speed || 0 // Using current speed as average for simplicity
      },
      laps: data?.laps || 0
    };
  },

  disconnect: async () => {
    const { connectedDevice, bleManager } = get();
    try {
      if (connectedDevice) {
        console.log('Disconnecting device...');
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
        sessionData: {
          startTime: null,
          totalSteps: 0,
          totalSkatingDistance: 0,
          totalWalkingDistance: 0,
          maxSpeed: 0,
          sessionDuration: 0
        }
      });
      console.log('Disconnected successfully');
    }
  },

  // Helper to get current mode display name
  getCurrentModeDisplay: () => {
    const { currentMode } = get();
    return modeMap[currentMode] || 'Step Counting';
  },

  // Reset all data
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
  }
}));