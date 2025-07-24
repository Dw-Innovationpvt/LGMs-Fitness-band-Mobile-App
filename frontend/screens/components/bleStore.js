import { create } from 'zustand';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

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

export const useBLEStore = create((set, get) => ({
  bleManager: new BleManager(),
  connectedDevice: null,
  characteristic: null,
  isConnected: false,
  bandActive: false,
  data: null,

  connectToDevice: async (device) => {
    try {
      console.log('Connecting to device:', device.name || device.id);
      const bleManager = get().bleManager;
      
      // Disconnect any existing connection first
      const { connectedDevice } = get();
      if (connectedDevice) {
        console.log('Disconnecting previous device');
        await get().disconnect();
      }
      
      // Connect to the device with timeout
      console.log('Attempting connection...');
      const deviceConnection = await Promise.race([
        device.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 10000))
      ]);
      
      console.log('Connected, discovering services...');
      await deviceConnection.discoverAllServicesAndCharacteristics();

      // Try to increase MTU size for larger data packets
      try {
        await deviceConnection.requestMTU(185);
        // console.log('MTU set to 185');
      } catch (mtuError) {
        console.warn('MTU request failed, continuing with default:', mtuError);
      }

      // Find our service and characteristic
      console.log('Finding services and characteristics...');
      const services = await deviceConnection.services();
      const characteristics = await deviceConnection.characteristicsForService(SERVICE_UUID);
      const char = characteristics.find(c => c.uuid === CHARACTERISTIC_UUID);
      
      if (!char) {
        throw new Error(`Characteristic ${CHARACTERISTIC_UUID} not found`);
      }
      
      console.log('Service and characteristic found');
      set({ connectedDevice: deviceConnection, characteristic: char, isConnected: true });

      deviceConnection.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
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
              console.warn('⚠ JSON parse error:', err);
              
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
            }
          } catch (decodeErr) {
            console.error('❌ Base64 decoding error:', decodeErr);
          }
        }
      );

    } catch (err) {
      console.error('❌ Connection error:', err);
      set({ isConnected: false });
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
      
      // Try with base64 encoding first
      try {
        const encoded = Buffer.from(formattedCmd).toString('base64');
        await connectedDevice.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          encoded
        );
        console.log('✅ Sent command (base64):', formattedCmd);
        return true;
      } catch (encodeErr) {
        console.warn('⚠ Base64 encoding failed, trying raw string:', encodeErr);
        
        // If base64 fails, try with raw string
        await connectedDevice.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          formattedCmd
        );
        console.log('✅ Sent command (raw):', formattedCmd);
        return true;
      }
    } catch (err) {
      console.error('❌ Send command error:', err);
      return false;
    }
  },

  toggleBand: async () => {
    const { bandActive, sendCommand } = get();
    const success = await sendCommand(bandActive ? 'TURN_OFF' : 'TURN_ON');
    if (success) set({ bandActive: !bandActive });
  },

  disconnect: async () => {
    const { connectedDevice, bleManager } = get();
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
    }
    bleManager.stopDeviceScan();
    set({ isConnected: false, bandActive: false, connectedDevice: null });
  }
}));
// import { create } from 'zustand';
// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';

// const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// export const useBLEStore = create((set, get) => {
//   const bleManager = new BleManager();

//   return {
//     bleManager,
//     connectedDevice: null,
//     monitorSubscription: null,
//     connectionStatus: 'disconnected',
//     bandActive: false,
//     data: null,

//     scanDevices: async () => {
//       set({ connectionStatus: 'scanning' });

//       bleManager.startDeviceScan(null, null, async (error, device) => {
//         if (error) {
//           console.error('Scan error:', error);
//           return;
//         }

//         if (device?.name?.includes('ESP32C6')) {
//           await get().connectToDevice(device);
//         }
//       });

//       setTimeout(() => bleManager.stopDeviceScan(), 10000);
//     },

//     connectToDevice: async (device) => {
//       try {
//         set({ connectionStatus: 'connecting' });
//         const connectedDevice = await device.connect();
//         await connectedDevice.discoverAllServicesAndCharacteristics();
//         await connectedDevice.requestMTU(185);

//         get().monitorCharacteristic(connectedDevice);
//         set({ connectedDevice, connectionStatus: 'connected' });

//         setTimeout(() => get().sendCommand('STATUS'), 2000);
//       } catch (e) {
//         console.error('Connection error:', e);
//         set({ connectionStatus: 'disconnected' });
//       }
//     },

//     monitorCharacteristic: (device) => {
//       const monitor = device.monitorCharacteristicForService(
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID,
//         (error, characteristic) => {
//           if (error) {
//             console.error('Monitor error:', error);
//             set({ connectionStatus: 'disconnected' });
//             return;
//           }

//           const value = Buffer.from(characteristic.value, 'base64').toString('utf-8');
//           try {
//             const parsed = JSON.parse(value);
//             set({
//               data: {
//                 mode: parsed.m || 'Unknown',
//                 steps: parsed.s || 0,
//                 walking_dist: parsed.wd || 0,
//                 strides: parsed.st || 0,
//                 skating_dist: parsed.sd || 0,
//                 speed: parsed.sp || 0,
//                 laps: parsed.l || 0,
//               },
//             });
//           } catch (err) {
//             console.error('JSON Parse error:', err);
//           }
//         }
//       );
//       set({ monitorSubscription: monitor });
//     },

//     sendCommand: async (command) => {
//       const { connectedDevice } = get();
//       if (!connectedDevice) return;

//       try {
//         const encoded = Buffer.from(command, 'utf-8').toString('base64');
//         await connectedDevice.writeCharacteristicWithResponseForService(
//           SERVICE_UUID,
//           CHARACTERISTIC_UUID,
//           encoded
//         );
//         console.log('Sent command:', command);
//       } catch (err) {
//         console.error('SendCommand error:', err);
//       }
//     },

//     disconnect: async () => {
//       const { monitorSubscription, connectedDevice } = get();
//       monitorSubscription?.remove();
//       if (connectedDevice) await connectedDevice.cancelConnection();
//       set({ connectedDevice: null, connectionStatus: 'disconnected', bandActive: false });
//     },
//   };
// });