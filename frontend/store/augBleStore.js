import { create } from 'zustand';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

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

// Format BLE data to a consistent structure
function formatBLEData(data) {
  if (!data) return null;
  
  console.log('Original BLE data received:', JSON.stringify(data));
  
  // Keep the original data as is - don't try to normalize field names
  // This ensures we don't lose any data that might have unexpected field names
  const formattedData = { ...data };
  
  // Log the data we're returning
  console.log('Returning BLE data:', JSON.stringify(formattedData));
  return formattedData;
}

// Request all required permissions for BLE scanning on Android
const requestBLEPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      console.log('Requesting BLE permissions for Android ' + Platform.Version);
      
      // For Android 10 (API 29) and below, only location permission is needed for BLE
      // For Android 12+ (API 31+), explicit Bluetooth permissions are also required
      
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

  skatingMode: null,

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
          
          // Log all discovered devices for debugging
          if (device && device.name) {
            console.log(`Found device: ${device.name} (${device.id})`);
          } else if (device) {
            console.log(`Found unnamed device: ${device.id}`);
          }

          // Accept any device with a name OR devices that might be your fitness band
          if (device && (device.name || device.localName)) {
            set((state) => {
              const exists = state.foundDevices.some(d => d.id === device.id);
              if (!exists) {
                const displayName = device.name || device.localName || 'Unknown Device';
                console.log(`Adding device to list: ${displayName}`);
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

  connectToDevice: async (device) => {
    try {
      console.log('Connecting to device:', device.name || device.id);
      const bleManager = get().bleManager;
      
      // Clear any previous errors
      set({ error: null });
      
      // Disconnect any existing connection first
      const { connectedDevice } = get();
      if (connectedDevice) {
        console.log('Disconnecting previous device');
        try {
          await connectedDevice.cancelConnection();
        } catch (disconnectError) {
          console.warn('Error disconnecting previous device:', disconnectError);
        }
      }
      
      // Stop scanning
      bleManager.stopDeviceScan();
      
      // Connect to the device with timeout
      console.log('Attempting connection...');
      const deviceConnection = await Promise.race([
        device.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
        )
      ]);
      
      console.log('Connected successfully, discovering services...');
      
      // Set connection immediately to provide user feedback
      set({ 
        connectedDevice: deviceConnection, 
        isConnected: true,
        error: null 
      });
      
      // Discover services and characteristics
      await deviceConnection.discoverAllServicesAndCharacteristics();

      // Try to increase MTU size for larger data packets
      try {
        await deviceConnection.requestMTU(185);
        console.log('MTU set to 185');
      } catch (mtuError) {
        console.warn('MTU request failed, continuing with default:', mtuError);
      }

      // Find services
      console.log('Finding services and characteristics...');
      const services = await deviceConnection.services();
      console.log('Available services:', services.map(s => s.uuid));
      
      // Check if our specific service exists
      const targetService = services.find(s => 
        s.uuid.toLowerCase().includes(SERVICE_UUID.toLowerCase().replace(/-/g, '')) ||
        SERVICE_UUID.toLowerCase().includes(s.uuid.toLowerCase().replace(/-/g, ''))
      );
      
      if (!targetService) {
        // If specific service not found, try to find any service with characteristics
        console.warn(`Target service ${SERVICE_UUID} not found. Available services:`, 
          services.map(s => s.uuid));
        
        // For testing, try to find a service with writable characteristics
        let foundService = null;
        let foundChar = null;
        
        for (const service of services) {
          try {
            const characteristics = await deviceConnection.characteristicsForService(service.uuid);
            console.log(`Service ${service.uuid} characteristics:`, characteristics.map(c => ({
              uuid: c.uuid,
              isNotifiable: c.isNotifiable,
              isWritableWithResponse: c.isWritableWithResponse,
              isWritableWithoutResponse: c.isWritableWithoutResponse
            })));
            
            // Look for a characteristic that can be used for communication
            const suitableChar = characteristics.find(c => 
              c.isNotifiable || c.isWritableWithResponse || c.isWritableWithoutResponse
            );
            
            if (suitableChar) {
              foundService = service;
              foundChar = suitableChar;
              console.log(`Found suitable service: ${service.uuid}, characteristic: ${suitableChar.uuid}`);
              break;
            }
          } catch (charError) {
            console.warn(`Error getting characteristics for service ${service.uuid}:`, charError);
          }
        }
        
        if (foundService && foundChar) {
          console.log(`Using service: ${foundService.uuid}, characteristic: ${foundChar.uuid}`);
          
          set({ 
            characteristic: foundChar,
            isConnected: true,
            error: null 
          });
          
          // Send turn on command after successful connection
          try {
            const { sendCommand } = get();
            await sendCommand('TURN_ON');
            console.log('✅ Turn on command sent after connection');
            
            // Wait a moment then send step counting mode
            setTimeout(async () => {
              await sendCommand('SET_MODE STEP_COUNTING');
              console.log('✅ Step counting mode activated after connection');
            }, 500);
          } catch (cmdError) {
            console.warn('⚠ Could not send commands after connection:', cmdError);
          }
          
          // Set up monitoring if characteristic supports notifications
          if (foundChar.isNotifiable) {
            console.log('Setting up characteristic monitoring...');
            deviceConnection.monitorCharacteristicForService(
              foundService.uuid,
              foundChar.uuid,
              (error, characteristic) => {
                if (error) {
                  console.error('❌ Monitor error:', error);
                  return;
                }

                const base64Value = characteristic?.value;
                if (!base64Value) {
                  console.warn('⚠ Empty characteristic value');
                  return;
                }
                
                try {
                  const json = Buffer.from(base64Value, 'base64').toString('utf-8');
                  console.log('Received data:', json);
                  
                  if (!json || json.trim() === '') {
                    console.warn('⚠ Empty JSON string after decoding');
                    return;
                  }

                  try {
                    const parsed = JSON.parse(json);
                    console.log('Successfully parsed JSON data');
                    const formattedData = formatBLEData(parsed);
                    set({ data: formattedData });
                  } catch (err) {
                    console.warn('⚠ JSON parse error, trying to fix:', err);
                    
                    // Try to fix incomplete JSON
                    try {
                      const fixedJson = fixIncompleteJson(json);
                      if (fixedJson !== json) {
                        console.log('Attempting to parse fixed JSON:', fixedJson);
                        const parsed = JSON.parse(fixedJson);
                        console.log('Successfully parsed after fixing JSON');
                        const formattedData = formatBLEData(parsed);
                        set({ data: formattedData });
                        return;
                      }
                    } catch (fixErr) {
                      console.warn('Could not fix JSON:', fixErr);
                    }
                    
                    // Store raw data if JSON parsing fails
                    set({ data: { rawData: json } });
                  }
                } catch (decodeErr) {
                  console.error('❌ Base64 decoding error:', decodeErr);
                }
              }
            );
          } else {
            console.log('Characteristic does not support notifications');
          }
          
          Alert.alert('Connected', `Connected to ${device.name || device.id}`);
          return; // Exit successfully
        }
        
        throw new Error(`No suitable service/characteristic found on device. Available services: ${services.map(s => s.uuid).join(', ')}`);
      }
      
      // If we found our target service, proceed as before
      const characteristics = await deviceConnection.characteristicsForService(targetService.uuid);
      const char = characteristics.find(c => 
        c.uuid.toLowerCase().includes(CHARACTERISTIC_UUID.toLowerCase().replace(/-/g, '')) ||
        CHARACTERISTIC_UUID.toLowerCase().includes(c.uuid.toLowerCase().replace(/-/g, ''))
      ) || characteristics[0]; // Fallback to first characteristic
      
      if (!char) {
        throw new Error(`No suitable characteristic found in service ${targetService.uuid}`);
      }
      
      console.log('Target service and characteristic found');
      set({ characteristic: char });

      // Send turn on command after successful connection
      try {
        const { sendCommand } = get();
        await sendCommand('TURN_ON');
        console.log('✅ Turn on command sent after connection');
        
        // Wait a moment then send step counting mode
        setTimeout(async () => {
          await sendCommand('SET_MODE STEP_COUNTING');
          console.log('✅ Step counting mode activated after connection');
        }, 500);
      } catch (cmdError) {
        console.warn('⚠ Could not send commands after connection:', cmdError);
      }

      // Set up characteristic monitoring
      if (char.isNotifiable) {
        console.log('Setting up characteristic monitoring...');
        deviceConnection.monitorCharacteristicForService(
          targetService.uuid,
          char.uuid,
          (error, characteristic) => {
            if (error) {
              console.error('❌ Monitor error:', error);
              return;
            }

            const base64Value = characteristic?.value;
            if (!base64Value) {
              console.warn('⚠ Empty characteristic value');
              return;
            }
            
            try {
              const json = Buffer.from(base64Value, 'base64').toString('utf-8');
              console.log('Received data:', json);
              
              if (!json || json.trim() === '') {
                console.warn('⚠ Empty JSON string after decoding');
                return;
              }

              try {
                const parsed = JSON.parse(json);
                console.log('Successfully parsed JSON data');
                const formattedData = formatBLEData(parsed);
                set({ data: formattedData });
              } catch (err) {
                console.warn('⚠ JSON parse error, trying to fix:', err);
                
                // Try to fix incomplete JSON
                try {
                  const fixedJson = fixIncompleteJson(json);
                  if (fixedJson !== json) {
                    console.log('Attempting to parse fixed JSON:', fixedJson);
                    const parsed = JSON.parse(fixedJson);
                    console.log('Successfully parsed after fixing JSON');
                    const formattedData = formatBLEData(parsed);
                    set({ data: formattedData });
                    return;
                  }
                } catch (fixErr) {
                  console.warn('Could not fix JSON:', fixErr);
                }
                
                // Try to extract JSON from a potentially larger string
                try {
                  const jsonMatch = json.match(/\{.*\}/s);
                  if (jsonMatch && jsonMatch[0]) {
                    console.log('Extracted potential JSON:', jsonMatch[0]);
                    const parsed = JSON.parse(jsonMatch[0]);
                    console.log('Successfully parsed extracted JSON');
                    const formattedData = formatBLEData(parsed);
                    set({ data: formattedData });
                    return;
                  }
                } catch (extractErr) {
                  console.warn('JSON extraction failed:', extractErr);
                }
                
                // Store raw data if all parsing attempts fail
                set({ data: { rawData: json } });
              }
            } catch (decodeErr) {
              console.error('❌ Base64 decoding error:', decodeErr);
            }
          }
        );
      }

      console.log('✅ Device connected and configured successfully');
      Alert.alert('Connected', `Connected to ${device.name || device.id}`);

      // Set up disconnect handler
      deviceConnection.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice.id);
        if (error) {
          console.error('Disconnection error:', error);
        }
        set({ 
          isConnected: false, 
          connectedDevice: null, 
          characteristic: null,
          bandActive: false,
          data: null
        });
      });

    } catch (err) {
      console.error('❌ Connection error:', err);
      set({ 
        isConnected: false, 
        connectedDevice: null,
        characteristic: null,
        error: err.message || 'Failed to connect to device'
      });
      Alert.alert('Connection Error', err.message || 'Failed to connect to device');
      throw err; // Re-throw to handle in UI
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
      // Ensure the command is properly formatted
      const formattedCmd = cmd.trim();
      console.log('Sending command:', formattedCmd);
      
      // Encode as base64
      const encoded = Buffer.from(formattedCmd).toString('base64');
      
      // Use the correct method based on characteristic capabilities
      if (characteristic.isWritableWithResponse) {
        await connectedDevice.writeCharacteristicWithResponseForService(
          characteristic.serviceUUID,
          characteristic.uuid,
          encoded
        );
      } else if (characteristic.isWritableWithoutResponse) {
        await connectedDevice.writeCharacteristicWithoutResponseForService(
          characteristic.serviceUUID,
          characteristic.uuid,
          encoded
        );
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
    if (success) set({ bandActive: !bandActive });
    return success;
  },

  // Activate Speed Skating Mode
  activateSpeedSkating: async () => {
    const success = await get().sendCommand('SET_MODE SKATING_SPEED');
    if (success) {
      set({ skatingMode: 'speed' });
    }
    return success;
  },

  // Activate Distance Skating Mode
  activateDistanceSkating: async () => {
    const success = await get().sendCommand('SET_MODE SKATING_DISTANCE');
    if (success) {
      set({ skatingMode: 'distance' });
    }
    return success;
  },

  // Activate Step Counting Mode
  activateStepCounting: async () => {
    const success = await get().sendCommand('SET_MODE STEP_COUNTING');
    if (success) {
      set({ skatingMode: 'step_counting' });
    }
    return success;
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
        skatingMode: null
      });
      console.log('Disconnected successfully');
    }
  }
}));