// File: SkatingTrackerBLE.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useBLEStore } from './bleStore';

export default function SkatingTrackerBLE() {
  const {
    bleManager, connectToDevice, isConnected,
    toggleBand, sendCommand, disconnect,
    bandActive, data
  } = useBLEStore();

  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Update timestamp when data changes
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
      console.log('Data received:', JSON.stringify(data));
    }
  }, [data]);
  
  // Function to render all data fields dynamically
  const renderDataFields = () => {
    if (!data) return null;
    
    // Icons for different types of data
    const icons = {
      steps: '👟',
      s: '👟',
      walking_dist: '🚶',
      wd: '🚶',
      strides: '⚡',
      st: '⚡',
      skating_dist: '🛼',
      sd: '🛼',
      speed: '🏎',
      sp: '🏎',
      laps: '🔄',
      l: '🔄',
      mode: '🌀',
      m: '🌀'
    };
    
    return Object.entries(data).map(([key, value]) => {
      // Skip null or undefined values
      if (value === null || value === undefined) return null;
      
      // Format the field name to be more readable
      const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Add units for distance and speed
      let displayValue = value;
      if (key.includes('dist')) displayValue = `${value} m`;
      if (key.includes('speed')) displayValue = `${value} km/h`;
      
      return (
        <Text key={key} style={styles.dataItem}>
          {icons[key] || '📊'} {fieldName}: {displayValue}
        </Text>
      );
    });
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  const scanDevices = () => {
    setDevices([]);
    setIsScanning(true);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        return;
      }

      if (device?.name?.includes('ESP32')) {
        setDevices((prev) => {
          const exists = prev.find(d => d.id === device.id);
          return exists ? prev : [...prev, device];
        });
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 8000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📱 Skating Band Controller</Text>

      {!isConnected && (
        <>
          <Button title={isScanning ? '🔍 Scanning...' : 'Scan Devices'} onPress={scanDevices} />
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => connectToDevice(item)}>
                <Text style={styles.device}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {isConnected && (
        <>
          <Button title={bandActive ? '🔴 Turn Off Band' : '🟢 Turn On Band'} onPress={toggleBand} />
          <Button title="Set Skating Speed Mode" onPress={() => sendCommand('SET_MODE SKATING_SPEED')} />
          <Button title="Set Step Mode" onPress={() => sendCommand('SET_MODE STEP_COUNTING')} />
          <Button title="❌ Disconnect" onPress={disconnect} color="red" />

          <View style={styles.dataBox}>
            <Text style={styles.dataTitle}>📊 Skating Data</Text>
            {lastUpdate && (
              <View style={styles.updateRow}>
                <View style={styles.indicator} />
                <Text style={styles.dataUpdate}>
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </Text>
              </View>
            )}
            {data && (
              <>
                {/* Dynamically render all data fields */}
                {renderDataFields()}
                
                {/* Show raw data for debugging */}
                <Text style={styles.dataRaw}>Raw data: {JSON.stringify(data)}</Text>
              </>
            )}
            {!data && <Text style={styles.dataItem}>Waiting for data...</Text>}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  device: { padding: 10, fontSize: 16, backgroundColor: '#e6f7ff', marginVertical: 5, borderRadius: 5 },
  dataBox: { marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8, elevation: 2 },
  dataTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5 },
  dataItem: { fontSize: 16, paddingVertical: 5 },
  dataRaw: { marginTop: 15, padding: 10, backgroundColor: '#eee', borderRadius: 5, fontSize: 12, color: '#666' },
  dataUpdate: { fontSize: 12, color: '#666', marginBottom: 10, fontStyle: 'italic' },
  indicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50', marginRight: 5 },
  updateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});
// // File: SkatingTrackerBLE.js
// import React, { useEffect } from 'react';
// import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
// import { useBLEStore } from './bleStore';
// import StepTracker from './StepTracker';

// export default function SkatingTrackerBLE() {
//   const {
//     scanDevices,
//     connectionStatus,
//     bandActive,
//     data,
//     sendCommand,
//     disconnect,
//     set,
//   } = useBLEStore();

//   useEffect(() => {
//     scanDevices();
//     return () => disconnect();
//   }, []);

//   const toggleBand = async () => {
//     const cmd = bandActive ? 'TURN_OFF' : 'TURN_ON';
//     await sendCommand(cmd);
//     set({ bandActive: !bandActive });
//   };

//   if (connectionStatus === 'connecting' || connectionStatus === 'scanning') {
//     return (
//       <View style={styles.container}><ActivityIndicator size="large" color="blue" /><Text>Connecting...</Text></View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Skating Tracker BLE</Text>
//       <Text>Status: {connectionStatus}</Text>
//       <Button title={bandActive ? 'Turn Off Band' : 'Turn On Band'} onPress={toggleBand} />
//       <Button title="Set Skate Config" onPress={() => sendCommand('SET_CONFIG INLINE 90 100')} />
//       <Button title="Set Speed Mode" onPress={() => sendCommand('SET_MODE SKATING_SPEED')} />
//       <Button title="Disconnect" onPress={disconnect} />
//       {data ? (
//         <View style={styles.stats}>
//           <Text>Mode: {data.mode}</Text>
//           <Text>Steps: {data.steps}</Text>
//           <Text>Distance: {data.skating_dist} m</Text>
//           <Text>Speed: {data.speed.toFixed(2)} m/s</Text>
//         </View>
//       ) : (
//         <Text>Waiting for data...</Text>
//       )}
//       <StepTracker />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   title: { fontSize: 20, marginBottom: 10 },
//   stats: { marginTop: 20 },
// });
// // import React, { useEffect, useState } from 'react';
// // import { View, Text, Button, ActivityIndicator } from 'react-native';
// // import BLEService from './BleManager';

// // export default function SkatingTrackerBLE({ switchScreen }) {
// //   const [status, setStatus] = useState('🔍 Scanning...');
// //   const [data, setData] = useState(null);
// //   const [isConnected, setIsConnected] = useState(false);

// //   useEffect(() => {
// //     BLEService.requestPermissions().then(() => {
// //       BLEService.startDeviceScan(
// //         (device) => {
// //           setStatus(📱 Connecting to ${device.name});
// //           BLEService.connectToDevice(device, handleData, setStatus);
// //           setIsConnected(true);
// //         },
// //         (error) => setStatus(❌ Scan Error: ${error.message})
// //       );
// //     });

// //     return () => {
// //       BLEService.disconnect();
// //     };
// //   }, []);

// //   const handleData = (jsonData) => {
// //     setData(jsonData);
// //   };

// //   const turnOnBand = () => BLEService.sendCommand('TURN_ON');
// //   const setSkatingConfig = () => BLEService.sendCommand('SET_CONFIG INLINE 90 100');
// //   const setSpeedMode = () => BLEService.sendCommand('SET_MODE SKATING_SPEED');
// //   const turnOffBand = () => BLEService.sendCommand('TURN_OFF');

// //   return (
// //     <View style={{ padding: 20 }}>
// //       <Text style={{ fontSize: 18, marginBottom: 10 }}>{status}</Text>

// //       {data ? (
// //         <View>
// //           <Text>📊 Mode: {data.mode}</Text>
// //           <Text>👣 Steps: {data.steps}</Text>
// //           <Text>📏 Distance: {data.skating_dist} m</Text>
// //           <Text>🏃‍♂ Speed: {data.speed.toFixed(2)} m/s</Text>
// //         </View>
// //       ) : (
// //         <ActivityIndicator size="large" color="#0000ff" />
// //       )}

// //       {isConnected && (
// //         <View style={{ marginTop: 20 }}>
// //           <Button title="1️⃣ Turn On Band" onPress={turnOnBand} />
// //           <Button title="2️⃣ Set Skate Config" onPress={setSkatingConfig} />
// //           <Button title="3️⃣ Set Speed Mode" onPress={setSpeedMode} />
// //           <Button title="5️⃣ Turn Off Band" onPress={turnOffBand} />
// //           <Button title="➡ Go to Step Tracker" onPress={() => switchScreen('Steps')} />
// //         </View>
// //       )}
// //     </View>
// //   );
// // }
// // // // SkatingTrackerBLE.js
// // // import React, { useEffect, useState } from 'react';
// // // import { View, Button, Text, StyleSheet } from 'react-native';
// // // import BLE from './BleManager';

// // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // const SkatingTrackerBLE = ({ onConnected, onData }) => {
// // //   const [status, setStatus] = useState('Not Connected');

// // //   useEffect(() => {
// // //     BLE.requestPermissions();

// // //     BLE.scanAndConnect(SERVICE_UUID, onData, setStatus);

// // //     return () => {
// // //       BLE.destroy();
// // //     };
// // //   }, []);

// // //   const turnOnBand = () => {
// // //     BLE.sendCommand(SERVICE_UUID, CHARACTERISTIC_UUID, 'TURN_ON');
// // //   };

// // //   const sendConfig = () => {
// // //     BLE.sendCommand(SERVICE_UUID, CHARACTERISTIC_UUID, 'SET_CONFIG SKATES 90 100.0');
// // //   };

// // //   const setMode = (mode) => {
// // //     BLE.sendCommand(SERVICE_UUID, CHARACTERISTIC_UUID, SET_MODE ${mode});
// // //   };

// // //   const turnOffBand = () => {
// // //     BLE.sendCommand(SERVICE_UUID, CHARACTERISTIC_UUID, 'TURN_OFF');
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.status}>🔌 {status}</Text>
// // //       <Button title="1. Turn On Band" onPress={turnOnBand} />
// // //       <Button title="2. Send Skate Config" onPress={sendConfig} />
// // //       <Button title="3. Set Mode - Speed" onPress={() => setMode('SKATING_SPEED')} />
// // //       <Button title="4. Set Mode - Distance" onPress={() => setMode('SKATING_DISTANCE')} />
// // //       <Button title="5. Set Mode - Freestyle" onPress={() => setMode('SKATING_FREESTYLE')} />
// // //       <Button title="6. Turn Off Band" color="red" onPress={turnOffBand} />
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { padding: 20 },
// // //   status: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
// // // });

// // // export default SkatingTrackerBLE;
// // // // import React, { useEffect, useRef, useState } from 'react';
// // // // import {
// // // //   View, Text, Button, FlatList, TouchableOpacity, PermissionsAndroid, Platform
// // // // } from 'react-native';
// // // // import { BleManager } from 'react-native-ble-plx';

// // // // export default function SkatingTrackerBLE({ setConnectedDevice }) {
// // // //   const manager = useRef(new BleManager()).current;
// // // //   const [devices, setDevices] = useState(new Map());
// // // //   const [isScanning, setIsScanning] = useState(false);

// // // //   useEffect(() => {
// // // //     requestPermissions();

// // // //     const stateSub = manager.onStateChange((state) => {
// // // //       if (state === 'PoweredOn') startScan();
// // // //     }, true);

// // // //     return () => {
// // // //       stateSub.remove();
// // // //       manager.destroy();
// // // //     };
// // // //   }, []);

// // // //   const requestPermissions = async () => {
// // // //     if (Platform.OS === 'android') {
// // // //       await PermissionsAndroid.requestMultiple([
// // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // //       ]);
// // // //     }
// // // //   };

// // // //   const startScan = () => {
// // // //     if (isScanning) return;
// // // //     setIsScanning(true);
// // // //     setDevices(new Map());

// // // //     manager.startDeviceScan(null, null, (error, device) => {
// // // //       if (error) {
// // // //         console.log('Scan error:', error.message);
// // // //         return;
// // // //       }

// // // //       if (device?.name?.includes('SkatingBand') && !devices.has(device.id)) {
// // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // //       }
// // // //     });

// // // //     setTimeout(() => {
// // // //       manager.stopDeviceScan();
// // // //       setIsScanning(false);
// // // //     }, 10000);
// // // //   };
// // // // const connect = async (device) => {
// // // //   try {
// // // //     const connected = await manager.connectToDevice(device.id, { autoConnect: true });
// // // //     await connected.discoverAllServicesAndCharacteristics();
// // // //     setConnectedDevice(connected);
// // // //   } catch (e) {
// // // //     console.log("Connection failed:", e.message);
// // // //   }
// // // // };
// // // //   // const connect = async (device) => {
// // // //   //   try {
// // // //   //     const connectedDevice = await manager.connectToDevice(device.id, { autoConnect: true });
// // // //   //     await connectedDevice.discoverAllServicesAndCharacteristics();
// // // //   //     setConnectedDevice(connectedDevice);
// // // //   //   } catch (e) {
// // // //   //     console.log('Connection failed:', e.message);
// // // //   //   }
// // // //   // };

// // // //   return (
// // // //     <View style={{ flex: 1, padding: 20 }}>
// // // //       <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Scan Devices</Text>
// // // //       <Button title={isScanning ? 'Scanning...' : 'Scan Again'} onPress={startScan} />
// // // //       <FlatList
// // // //         data={Array.from(devices.values())}
// // // //         keyExtractor={(item) => item.id}
// // // //         renderItem={({ item }) => (
// // // //           <TouchableOpacity onPress={() => connect(item)} style={{ margin: 10, padding: 10, backgroundColor: '#eee' }}>
// // // //             <Text>{item.name || 'Unnamed'}</Text>
// // // //             <Text>{item.id}</Text>
// // // //           </TouchableOpacity>
// // // //         )}
// // // //       />
// // // //     </View>
// // // //   );
// // // // }
// // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // import {
// // // // //   Alert,
// // // // //   AppState,
// // // // //   Button,
// // // // //   FlatList,
// // // // //   PermissionsAndroid,
// // // // //   Platform,
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   View,
// // // // // } from 'react-native';
// // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // const SkatingTrackerBLE = ({ onConnect, onCharacteristic }) => {
// // // // //   const manager = useRef(new BleManager()).current;
// // // // //   const [devices, setDevices] = useState(new Map());
// // // // //   const [isScanning, setIsScanning] = useState(false);

// // // // //   useEffect(() => {
// // // // //     requestPermissions();

// // // // //     const sub = manager.onStateChange((state) => {
// // // // //       if (state === 'PoweredOn') startScan();
// // // // //     }, true);

// // // // //     const appStateSub = AppState.addEventListener('change', (state) => {
// // // // //       if (state === 'active') startScan();
// // // // //       else stopScan();
// // // // //     });

// // // // //     return () => {
// // // // //       sub.remove();
// // // // //       appStateSub.remove();
// // // // //       stopScan();
// // // // //       manager.destroy();
// // // // //     };
// // // // //   }, []);

// // // // //   const requestPermissions = async () => {
// // // // //     if (Platform.OS === 'android') {
// // // // //       await PermissionsAndroid.requestMultiple([
// // // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // // //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // // //       ]);
// // // // //     }
// // // // //   };

// // // // //   const startScan = () => {
// // // // //     if (isScanning) return;
// // // // //     setIsScanning(true);
// // // // //     setDevices(new Map());

// // // // //     manager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
// // // // //       if (error) {
// // // // //         console.log('Scan error:', error.message);
// // // // //         return;
// // // // //       }

// // // // //       if (device && !devices.has(device.id)) {
// // // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // // //       }
// // // // //     });
// // // // //   };

// // // // //   const stopScan = () => {
// // // // //     manager.stopDeviceScan();
// // // // //     setIsScanning(false);
// // // // //   };

// // // // //   const connectToDevice = async (device) => {
// // // // //     try {
// // // // //       const connectedDevice = await manager.connectToDevice(device.id);
// // // // //       await connectedDevice.discoverAllServicesAndCharacteristics();
// // // // //       const services = await connectedDevice.services();
// // // // //       for (const service of services) {
// // // // //         if (service.uuid === SERVICE_UUID) {
// // // // //           const characteristics = await service.characteristics();
// // // // //           const targetChar = characteristics.find((c) => c.uuid === CHARACTERISTIC_UUID);
// // // // //           if (targetChar) {
// // // // //             onConnect(connectedDevice);
// // // // //             onCharacteristic(targetChar);
// // // // //           }
// // // // //         }
// // // // //       }
// // // // //     } catch (err) {
// // // // //       Alert.alert('Connection Failed', err.message);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <Text style={styles.header}>🛼 Skating BLE Tracker</Text>
// // // // //       <Button title={isScanning ? 'Stop Scan' : 'Start Scan'} onPress={isScanning ? stopScan : startScan} />
// // // // //       <FlatList
// // // // //         data={Array.from(devices.values())}
// // // // //         keyExtractor={(item) => item.id}
// // // // //         renderItem={({ item }) => (
// // // // //           <TouchableOpacity onPress={() => connectToDevice(item)} style={styles.deviceItem}>
// // // // //             <Text>{item.name || 'Unnamed'}</Text>
// // // // //             <Text style={{ fontSize: 10 }}>{item.id}</Text>
// // // // //           </TouchableOpacity>
// // // // //         )}
// // // // //       />
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1 },
// // // // //   header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
// // // // //   deviceItem: {
// // // // //     padding: 10,
// // // // //     backgroundColor: '#f0f0f0',
// // // // //     marginBottom: 8,
// // // // //     borderRadius: 6,
// // // // //   },
// // // // // });

// // // // // export default SkatingTrackerBLE;
// // // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // // import {
// // // // // //   Alert,
// // // // // //   AppState,
// // // // // //   Button,
// // // // // //   FlatList,
// // // // // //   PermissionsAndroid,
// // // // // //   Platform,
// // // // // //   StyleSheet,
// // // // // //   Text,
// // // // // //   TouchableOpacity,
// // // // // //   View,
// // // // // // } from 'react-native';
// // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // export default function SkatingTrackerBLE({ onConnect, onCharacteristic }) {
// // // // // //   const manager = useRef(new BleManager()).current;
// // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // //   const [devices, setDevices] = useState(new Map());

// // // // // //   useEffect(() => {
// // // // // //     requestPermissions();

// // // // // //     const sub = manager.onStateChange((state) => {
// // // // // //       if (state === 'PoweredOn') {
// // // // // //         startScan();
// // // // // //       }
// // // // // //     }, true);

// // // // // //     const appStateSub = AppState.addEventListener('change', (state) => {
// // // // // //       state === 'active' ? startScan() : stopScan();
// // // // // //     });

// // // // // //     return () => {
// // // // // //       stopScan();
// // // // // //       appStateSub.remove();
// // // // // //       sub.remove();
// // // // // //       manager.destroy();
// // // // // //     };
// // // // // //   }, []);

// // // // // //   const requestPermissions = async () => {
// // // // // //     if (Platform.OS === 'android') {
// // // // // //       await PermissionsAndroid.requestMultiple([
// // // // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // // // //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // // // //       ]);
// // // // // //     }
// // // // // //   };

// // // // // //   const startScan = () => {
// // // // // //     if (isScanning) return;
// // // // // //     setIsScanning(true);
// // // // // //     setDevices(new Map());

// // // // // //     manager.startDeviceScan(null, null, (error, device) => {
// // // // // //       if (error) {
// // // // // //         console.error('Scan error:', error.message);
// // // // // //         return;
// // // // // //       }

// // // // // //       if (device?.name?.includes('SkatingBand') && !devices.has(device.id)) {
// // // // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // // // //       }
// // // // // //     });
// // // // // //   };

// // // // // //   const stopScan = () => {
// // // // // //     manager.stopDeviceScan();
// // // // // //     setIsScanning(false);
// // // // // //   };

// // // // // //   const connectToDevice = async (device) => {
// // // // // //     try {
// // // // // //       const d = await manager.connectToDevice(device.id);
// // // // // //       await d.discoverAllServicesAndCharacteristics();
// // // // // //       const services = await d.services();
// // // // // //       const service = services.find((s) => s.uuid === SERVICE_UUID);
// // // // // //       const characteristics = await service.characteristics();
// // // // // //       const characteristic = characteristics.find((c) => c.uuid === CHARACTERISTIC_UUID);
// // // // // //       stopScan();
// // // // // //       onConnect(d);
// // // // // //       onCharacteristic(characteristic);
// // // // // //     } catch (err) {
// // // // // //       Alert.alert('Connection Failed', err.message);
// // // // // //     }
// // // // // //   };

// // // // // //   const renderItem = ({ item }) => (
// // // // // //     <TouchableOpacity onPress={() => connectToDevice(item)} style={styles.deviceItem}>
// // // // // //       <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
// // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   return (
// // // // // //     <View style={styles.container}>
// // // // // //       <Text style={styles.header}>🛼 Skating BLE Tracker</Text>
// // // // // //       <Button title={isScanning ? 'Stop Scan' : 'Start Scan'} onPress={isScanning ? stopScan : startScan} />
// // // // // //       <FlatList
// // // // // //         data={Array.from(devices.values())}
// // // // // //         keyExtractor={(item) => item.id}
// // // // // //         renderItem={renderItem}
// // // // // //         style={{ marginTop: 20 }}
// // // // // //       />
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, padding: 16 },
// // // // // //   header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
// // // // // //   deviceItem: {
// // // // // //     padding: 12,
// // // // // //     backgroundColor: '#e6f2ff',
// // // // // //     borderRadius: 8,
// // // // // //     marginBottom: 10,
// // // // // //   },
// // // // // //   deviceName: { fontSize: 16, fontWeight: '600' },
// // // // // //   deviceId: { fontSize: 12, color: '#777' },
// // // // // // });
// // // // // // // // File: components/SkatingTrackerBLE.js
// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   FlatList,
// // // // // // //   TouchableOpacity,
// // // // // // //   StyleSheet,
// // // // // // //   Button,
// // // // // // //   PermissionsAndroid,
// // // // // // //   Platform,
// // // // // // //   Alert,
// // // // // // //   AppState,
// // // // // // // } from 'react-native';

// // // // // // // const SkatingTrackerBLE = ({ manager, onConnect }) => {
// // // // // // //   const [devices, setDevices] = useState(new Map());
// // // // // // //   const [isScanning, setIsScanning] = useState(false);

// // // // // // //   useEffect(() => {
// // // // // // //     requestPermissions();

// // // // // // //     const stateSub = manager.onStateChange((state) => {
// // // // // // //       if (state === 'PoweredOn') startScan();
// // // // // // //     }, true);

// // // // // // //     const appStateSub = AppState.addEventListener('change', (state) => {
// // // // // // //       if (state === 'active') startScan();
// // // // // // //       else stopScan();
// // // // // // //     });

// // // // // // //     return () => {
// // // // // // //       stateSub.remove();
// // // // // // //       appStateSub.remove();
// // // // // // //       stopScan();
// // // // // // //     };
// // // // // // //   }, []);

// // // // // // //   const requestPermissions = async () => {
// // // // // // //     if (Platform.OS === 'android') {
// // // // // // //       await PermissionsAndroid.requestMultiple([
// // // // // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // // // // //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // // // // //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // // // // //       ]);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const startScan = () => {
// // // // // // //     setIsScanning(true);
// // // // // // //     setDevices(new Map());
// // // // // // //     manager.startDeviceScan(null, null, (error, device) => {
// // // // // // //       if (error) return console.error(error);
// // // // // // //       if (device?.id && !devices.has(device.id)) {
// // // // // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // // // // //       }
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const stopScan = () => {
// // // // // // //     manager.stopDeviceScan();
// // // // // // //     setIsScanning(false);
// // // // // // //   };

// // // // // // //   const connectToDevice = async (device) => {
// // // // // // //     try {
// // // // // // //       const connectedDevice = await manager.connectToDevice(device.id);
// // // // // // //       await connectedDevice.discoverAllServicesAndCharacteristics();
// // // // // // //       onConnect(connectedDevice);
// // // // // // //     } catch (err) {
// // // // // // //       Alert.alert('Connection Error', err.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <View style={styles.container}>
// // // // // // //       <Text style={styles.title}>Skating Band - BLE Scan</Text>
// // // // // // //       <Button title={isScanning ? 'Stop Scan' : 'Start Scan'} onPress={isScanning ? stopScan : startScan} />
// // // // // // //       <FlatList
// // // // // // //         data={Array.from(devices.values())}
// // // // // // //         keyExtractor={(item) => item.id}
// // // // // // //         renderItem={({ item }) => (
// // // // // // //           <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
// // // // // // //             <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
// // // // // // //             <Text style={styles.deviceId}>{item.id}</Text>
// // // // // // //           </TouchableOpacity>
// // // // // // //         )}
// // // // // // //       />
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: { flex: 1, padding: 20 },
// // // // // // //   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
// // // // // // //   deviceItem: { padding: 12, backgroundColor: '#eee', marginBottom: 10, borderRadius: 6 },
// // // // // // //   deviceName: { fontSize: 16 },
// // // // // // //   deviceId: { fontSize: 12, color: '#555' },
// // // // // // // });

// // // // // // // export default SkatingTrackerBLE;
// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import {
// // // // // // // //   Alert,
// // // // // // // //   AppState,
// // // // // // // //   Button,
// // // // // // // //   FlatList,
// // // // // // // //   PermissionsAndroid,
// // // // // // // //   Platform,
// // // // // // // //   StyleSheet,
// // // // // // // //   Text,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   View,
// // // // // // // // } from 'react-native';

// // // // // // // // const SkatingTrackerBLE = ({ manager, onConnect }) => {
// // // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // // //   const [devices, setDevices] = useState(new Map());

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!manager) return;

// // // // // // // //     requestPermissions();

// // // // // // // //     const stateSub = manager.onStateChange((state) => {
// // // // // // // //       if (state === 'PoweredOn') startScan();
// // // // // // // //     }, true);

// // // // // // // //     const appStateSub = AppState.addEventListener('change', (state) => {
// // // // // // // //       if (state === 'active') startScan();
// // // // // // // //       else stopScan();
// // // // // // // //     });

// // // // // // // //     return () => {
// // // // // // // //       stateSub.remove();
// // // // // // // //       appStateSub.remove();
// // // // // // // //       stopScan();
// // // // // // // //     };
// // // // // // // //   }, [manager]);

// // // // // // // //   const requestPermissions = async () => {
// // // // // // // //     if (Platform.OS === 'android') {
// // // // // // // //       try {
// // // // // // // //         await PermissionsAndroid.requestMultiple([
// // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // // // // // //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // // // // // //         ]);
// // // // // // // //       } catch (err) {
// // // // // // // //         Alert.alert('Permission Error', err.message);
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const startScan = () => {
// // // // // // // //     if (isScanning) return;

// // // // // // // //     setIsScanning(true);
// // // // // // // //     setDevices(new Map());

// // // // // // // //     manager.startDeviceScan(null, null, (error, device) => {
// // // // // // // //       if (error) {
// // // // // // // //         console.log('Scan error:', error.message);
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       if (device?.name?.includes('SkatingBand')) {
// // // // // // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     console.log('🔍 Scanning...');
// // // // // // // //   };

// // // // // // // //   const stopScan = () => {
// // // // // // // //     manager.stopDeviceScan();
// // // // // // // //     setIsScanning(false);
// // // // // // // //     console.log('🛑 Scan stopped');
// // // // // // // //   };

// // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // //     try {
// // // // // // // //       const connectedDevice = await manager.connectToDevice(device.id);
// // // // // // // //       await connectedDevice.discoverAllServicesAndCharacteristics();
// // // // // // // //       await connectedDevice.requestMTU(185);
// // // // // // // //       stopScan();
// // // // // // // //       onConnect(connectedDevice);
// // // // // // // //     } catch (err) {
// // // // // // // //       Alert.alert('Connection Failed', err.message);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const renderItem = ({ item }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       onPress={() => connectToDevice(item)}
// // // // // // // //       style={styles.deviceItem}
// // // // // // // //     >
// // // // // // // //       <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
// // // // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <View style={styles.container}>
// // // // // // // //       <Text style={styles.header}>🛼 Skating BLE Tracker</Text>
// // // // // // // //       <Button title={isScanning ? 'Stop Scan' : 'Start Scan'} onPress={isScanning ? stopScan : startScan} />
// // // // // // // //       <FlatList
// // // // // // // //         data={Array.from(devices.values())}
// // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // //         renderItem={renderItem}
// // // // // // // //         style={{ marginTop: 20 }}
// // // // // // // //       />
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: { flex: 1, padding: 20 },
// // // // // // // //   header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
// // // // // // // //   deviceItem: {
// // // // // // // //     padding: 12,
// // // // // // // //     backgroundColor: '#f0f0f0',
// // // // // // // //     marginVertical: 6,
// // // // // // // //     borderRadius: 8,
// // // // // // // //   },
// // // // // // // //   deviceName: { fontSize: 16, fontWeight: '600' },
// // // // // // // //   deviceId: { fontSize: 12, color: '#888' },
// // // // // // // // });

// // // // // // // // export default SkatingTrackerBLE;
// // // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // // import {
// // // // // // // // //   Alert,
// // // // // // // // //   AppState,
// // // // // // // // //   Button,
// // // // // // // // //   FlatList,
// // // // // // // // //   PermissionsAndroid,
// // // // // // // // //   Platform,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   Text,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   View,
// // // // // // // // // } from 'react-native';

// // // // // // // // // const SkatingTrackerBLE = ({ manager, onDeviceConnected }) => {
// // // // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // // // //   const [devices, setDevices] = useState(new Map());

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     requestPermissions();

// // // // // // // // //     const stateSub = manager.onStateChange((state) => {
// // // // // // // // //       if (state === 'PoweredOn') startScan();
// // // // // // // // //     }, true);

// // // // // // // // //     const appStateSub = AppState.addEventListener('change', (state) => {
// // // // // // // // //       if (state === 'active') startScan();
// // // // // // // // //       else stopScan();
// // // // // // // // //     });

// // // // // // // // //     return () => {
// // // // // // // // //       stateSub.remove();
// // // // // // // // //       appStateSub.remove();
// // // // // // // // //       stopScan();
// // // // // // // // //     };
// // // // // // // // //   }, []);

// // // // // // // // //   const requestPermissions = async () => {
// // // // // // // // //     if (Platform.OS === 'android') {
// // // // // // // // //       try {
// // // // // // // // //         await PermissionsAndroid.requestMultiple([
// // // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // // // // // // //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // // // // // // //         ]);
// // // // // // // // //       } catch (err) {
// // // // // // // // //         Alert.alert('Permission Error', err.message);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const startScan = () => {
// // // // // // // // //     if (isScanning) return;

// // // // // // // // //     setIsScanning(true);
// // // // // // // // //     setDevices(new Map());

// // // // // // // // //     manager.startDeviceScan(null, null, (error, device) => {
// // // // // // // // //       if (error) {
// // // // // // // // //         console.log('Scan error:', error.message);
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       if (device?.id && !devices.has(device.id)) {
// // // // // // // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // // // // // // //       }
// // // // // // // // //     });

// // // // // // // // //     console.log('🔍 Scanning started...');
// // // // // // // // //   };

// // // // // // // // //   const stopScan = () => {
// // // // // // // // //     manager.stopDeviceScan();
// // // // // // // // //     setIsScanning(false);
// // // // // // // // //     console.log('🛑 Scanning stopped.');
// // // // // // // // //   };

// // // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // // //   try {
// // // // // // // // //    // console.log(🔗 Connecting to ${device.name || device.id});
// // // // // // // // //     const connectedDevice = await manager.connectToDevice(device.id);
// // // // // // // // //     await connectedDevice.discoverAllServicesAndCharacteristics();

// // // // // // // // //     // Increase MTU
// // // // // // // // //     await connectedDevice.requestMTU(185);

// // // // // // // // //     //Alert.alert('Connected', Connected to ${device.name || device.id});
// // // // // // // // //     Alert.alert('Connected',` Connected to ${device.name || device.id}`);
// // // // // // // // //     setConnectedDevice(connectedDevice);
// // // // // // // // //   } catch (err) {
// // // // // // // // //     Alert.alert('Connection Failed', err.message);
// // // // // // // // //     console.log('❌ Connection error:', err.message);
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // //   const renderItem = ({ item }) => (
// // // // // // // // //     <TouchableOpacity
// // // // // // // // //       onPress={() => connectToDevice(item)}
// // // // // // // // //       style={styles.deviceItem}
// // // // // // // // //     >
// // // // // // // // //       <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
// // // // // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // //   );

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <Text style={styles.header}>🛼 Skating BLE Tracker</Text>
// // // // // // // // //       <Button
// // // // // // // // //         title={isScanning ? 'Stop Scan' : 'Start Scan'}
// // // // // // // // //         onPress={isScanning ? stopScan : startScan}
// // // // // // // // //       />
// // // // // // // // //       <FlatList
// // // // // // // // //         data={Array.from(devices.values())}
// // // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // // //         renderItem={renderItem}
// // // // // // // // //         style={{ marginTop: 20 }}
// // // // // // // // //       />
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
// // // // // // // // //   header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
// // // // // // // // //   deviceItem: {
// // // // // // // // //     padding: 12,
// // // // // // // // //     backgroundColor: '#f0f0f0',
// // // // // // // // //     marginBottom: 10,
// // // // // // // // //     borderRadius: 6,
// // // // // // // // //   },
// // // // // // // // //   deviceName: { fontSize: 16, fontWeight: '600' },
// // // // // // // // //   deviceId: { fontSize: 12, color: '#888' },
// // // // // // // // // });

// // // // // // // // // export default SkatingTrackerBLE;
// // // // // // // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // // // // // // import {
// // // // // // // // // //   Alert,
// // // // // // // // // //   AppState,
// // // // // // // // // //   Button,
// // // // // // // // // //   FlatList,
// // // // // // // // // //   PermissionsAndroid,
// // // // // // // // // //   Platform,
// // // // // // // // // //   StyleSheet,
// // // // // // // // // //   Text,
// // // // // // // // // //   TouchableOpacity,
// // // // // // // // // //   View,
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // // // // // const SkatingTrackerBLE = ({ onDeviceConnected }) => {
// // // // // // // // // //   const manager = useRef(new BleManager()).current;
// // // // // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // // // // //   const [devices, setDevices] = useState(new Map());

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     requestPermissions();

// // // // // // // // // //     const stateSub = manager.onStateChange((state) => {
// // // // // // // // // //       if (state === 'PoweredOn') {
// // // // // // // // // //         startScan();
// // // // // // // // // //       }
// // // // // // // // // //     }, true);

// // // // // // // // // //     const appStateSub = AppState.addEventListener('change', (state) => {
// // // // // // // // // //       if (state === 'active') {
// // // // // // // // // //         startScan();
// // // // // // // // // //       } else {
// // // // // // // // // //         stopScan();
// // // // // // // // // //       }
// // // // // // // // // //     });

// // // // // // // // // //     return () => {
// // // // // // // // // //       stateSub.remove();
// // // // // // // // // //       appStateSub.remove();
// // // // // // // // // //       stopScan();
// // // // // // // // // //       manager.destroy();
// // // // // // // // // //     };
// // // // // // // // // //   }, []);

// // // // // // // // // //   const requestPermissions = async () => {
// // // // // // // // // //     if (Platform.OS === 'android') {
// // // // // // // // // //       try {
// // // // // // // // // //         await PermissionsAndroid.requestMultiple([
// // // // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // // // // // // // //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // // // // // // // //         ]);
// // // // // // // // // //       } catch (err) {
// // // // // // // // // //         Alert.alert('Permission Error', err.message);
// // // // // // // // // //       }
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const startScan = () => {
// // // // // // // // // //     if (isScanning) return;

// // // // // // // // // //     setIsScanning(true);
// // // // // // // // // //     setDevices(new Map());

// // // // // // // // // //     manager.startDeviceScan(null, null, (error, device) => {
// // // // // // // // // //       if (error) {
// // // // // // // // // //         console.log('Scan error:', error.message);
// // // // // // // // // //         return;
// // // // // // // // // //       }

// // // // // // // // // //       if (device?.id && !devices.has(device.id)) {
// // // // // // // // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // // // // // // // //       }
// // // // // // // // // //     });

// // // // // // // // // //     console.log('🔍 Scanning started...');
// // // // // // // // // //   };

// // // // // // // // // //   const stopScan = () => {
// // // // // // // // // //     manager.stopDeviceScan();
// // // // // // // // // //     setIsScanning(false);
// // // // // // // // // //     console.log('🛑 Scanning stopped.');
// // // // // // // // // //   };

// // // // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // // // //     try {
// // // // // // // // // //       console.log(🔗 Connecting to ${device.name || device.id});
// // // // // // // // // //       const connectedDevice = await manager.connectToDevice(device.id);
// // // // // // // // // //       await connectedDevice.discoverAllServicesAndCharacteristics();
// // // // // // // // // //       stopScan();

// // // // // // // // // //       Alert.alert('Connected', Connected to ${device.name || device.id});
// // // // // // // // // //       console.log('✅ Connected:', connectedDevice);

// // // // // // // // // //       if (onDeviceConnected) {
// // // // // // // // // //         onDeviceConnected(connectedDevice);
// // // // // // // // // //       }
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       Alert.alert('Connection Failed', err.message);
// // // // // // // // // //       console.log('❌ Connection error:', err.message);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const renderItem = ({ item }) => (
// // // // // // // // // //     <TouchableOpacity
// // // // // // // // // //       onPress={() => connectToDevice(item)}
// // // // // // // // // //       style={styles.deviceItem}
// // // // // // // // // //     >
// // // // // // // // // //       <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
// // // // // // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // // // // // //     </TouchableOpacity>
// // // // // // // // // //   );

// // // // // // // // // //   return (
// // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // //       <Text style={styles.header}>🛼 Skating BLE Tracker</Text>
// // // // // // // // // //       <Button
// // // // // // // // // //         title={isScanning ? 'Stop Scan' : 'Start Scan'}
// // // // // // // // // //         onPress={isScanning ? stopScan : startScan}
// // // // // // // // // //       />
// // // // // // // // // //       <FlatList
// // // // // // // // // //         data={Array.from(devices.values())}
// // // // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // // // //         renderItem={renderItem}
// // // // // // // // // //         style={{ marginTop: 20 }}
// // // // // // // // // //       />
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
// // // // // // // // // //   header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
// // // // // // // // // //   deviceItem: {
// // // // // // // // // //     padding: 12,
// // // // // // // // // //     backgroundColor: '#f0f0f0',
// // // // // // // // // //     marginBottom: 10,
// // // // // // // // // //     borderRadius: 6,
// // // // // // // // // //   },
// // // // // // // // // //   deviceName: { fontSize: 16, fontWeight: '600' },
// // // // // // // // // //   deviceId: { fontSize: 12, color: '#888' },
// // // // // // // // // // });

// // // // // // // // // // export default SkatingTrackerBLE;
// // // // // // // // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // // // // // // // import {
// // // // // // // // // // //   Alert,
// // // // // // // // // // //   AppState,
// // // // // // // // // // //   Button,
// // // // // // // // // // //   FlatList,
// // // // // // // // // // //   PermissionsAndroid,
// // // // // // // // // // //   Platform,
// // // // // // // // // // //   StyleSheet,
// // // // // // // // // // //   Text,
// // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // //   View,
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // // // // // // const SkatingTrackerBLE = () => {
// // // // // // // // // // //   const manager = useRef(new BleManager()).current;

  
// // // // // // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // // // // // //   const [devices, setDevices] = useState(new Map());

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     requestPermissions();

// // // // // // // // // // //     const stateSub = manager.onStateChange((state) => {
// // // // // // // // // // //       if (state === 'PoweredOn') {
// // // // // // // // // // //         startScan();
// // // // // // // // // // //       }
// // // // // // // // // // //     }, true);

// // // // // // // // // // //     const appStateSub = AppState.addEventListener('change', (state) => {
// // // // // // // // // // //       if (state === 'active') {
// // // // // // // // // // //         startScan();
// // // // // // // // // // //       } else {
// // // // // // // // // // //         stopScan();
// // // // // // // // // // //       }
// // // // // // // // // // //     });

// // // // // // // // // // //     return () => {
// // // // // // // // // // //       stateSub.remove();
// // // // // // // // // // //       appStateSub.remove();
// // // // // // // // // // //       stopScan();
// // // // // // // // // // //       manager.destroy();
// // // // // // // // // // //     };
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   const requestPermissions = async () => {
// // // // // // // // // // //     if (Platform.OS === 'android') {
// // // // // // // // // // //       try {
// // // // // // // // // // //         const result = await PermissionsAndroid.requestMultiple([
// // // // // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
// // // // // // // // // // //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
// // // // // // // // // // //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // // // // // // // // // //         ]);

// // // // // // // // // // //         Object.entries(result).forEach(([perm, status]) => {
// // // // // // // // // // //           console.log(Permission: ${perm} -> ${status});
// // // // // // // // // // //         });
// // // // // // // // // // //       } catch (err) {
// // // // // // // // // // //         Alert.alert('Permission Error', err.message);
// // // // // // // // // // //       }
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const startScan = () => {
// // // // // // // // // // //     if (isScanning) return;

// // // // // // // // // // //     setIsScanning(true);
// // // // // // // // // // //     setDevices(new Map());

// // // // // // // // // // //     manager.startDeviceScan(null, null, (error, device) => {
// // // // // // // // // // //       if (error) {
// // // // // // // // // // //         console.log('Scan error:', error.message);
// // // // // // // // // // //         return;
// // // // // // // // // // //       }

// // // // // // // // // // //       if (device?.id && !devices.has(device.id)) {
// // // // // // // // // // //         setDevices((prev) => new Map(prev).set(device.id, device));
// // // // // // // // // // //       }
// // // // // // // // // // //     });

// // // // // // // // // // //     console.log('🔍 Scanning started...');
// // // // // // // // // // //   };

// // // // // // // // // // //   const stopScan = () => {
// // // // // // // // // // //     manager.stopDeviceScan();
// // // // // // // // // // //     setIsScanning(false);
// // // // // // // // // // //     console.log('🛑 Scanning stopped.');
// // // // // // // // // // //   };

// // // // // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       console.log(🔗 Connecting to ${device.name || device.id});
// // // // // // // // // // //       const connectedDevice = await manager.connectToDevice(device.id);
// // // // // // // // // // //       await connectedDevice.discoverAllServicesAndCharacteristics();
// // // // // // // // // // //       Alert.alert('Connected', Successfully connected to ${device.name || device.id});
// // // // // // // // // // //       console.log('✅ Connected:', connectedDevice);
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       Alert.alert('Connection Failed', err.message);
// // // // // // // // // // //       console.log('❌ Connection error:', err.message);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const renderItem = ({ item }) => (
// // // // // // // // // // //     <TouchableOpacity
// // // // // // // // // // //       onPress={() => connectToDevice(item)}
// // // // // // // // // // //       style={styles.deviceItem}
// // // // // // // // // // //     >
// // // // // // // // // // //       <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
// // // // // // // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // // // // // // //     </TouchableOpacity>
// // // // // // // // // // //   );

// // // // // // // // // // //   return (
// // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // //       <Text style={styles.header}>🛼 Skating BLE Tracker</Text>
// // // // // // // // // // //       <Button
// // // // // // // // // // //         title={isScanning ? 'Stop Scan' : 'Start Scan'}
// // // // // // // // // // //         onPress={isScanning ? stopScan : startScan}
// // // // // // // // // // //       />
// // // // // // // // // // //       <FlatList
// // // // // // // // // // //         data={Array.from(devices.values())}
// // // // // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // // // // //         renderItem={renderItem}
// // // // // // // // // // //         style={{ marginTop: 20 }}
// // // // // // // // // // //       />
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
// // // // // // // // // // //   header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
// // // // // // // // // // //   deviceItem: {
// // // // // // // // // // //     padding: 12,
// // // // // // // // // // //     backgroundColor: '#f0f0f0',
// // // // // // // // // // //     marginBottom: 10,
// // // // // // // // // // //     borderRadius: 6,
// // // // // // // // // // //   },
// // // // // // // // // // //   deviceName: { fontSize: 16, fontWeight: '600' },
// // // // // // // // // // //   deviceId: { fontSize: 12, color: '#888' },
// // // // // // // // // // // });

// // // // // // // // // // // export default SkatingTrackerBLE;
// // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
// // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // import StepTracker from './components/StepTracker'; // You'll create this below

// // // // // // // // // // // const App = () => {
// // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // //         {connectedDevice ? (
// // // // // // // // // // //           <StepTracker device={connectedDevice} onDisconnect={() => setConnectedDevice(null)} />
// // // // // // // // // // //         ) : (
// // // // // // // // // // //           <SkatingTrackerBLE onDeviceConnected={setConnectedDevice} />
// // // // // // // // // // //         )}
// // // // // // // // // // //       </View>
// // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // //   container: { flex: 1 },
// // // // // // // // // // // });

// // // // // // // // // // // export default App;