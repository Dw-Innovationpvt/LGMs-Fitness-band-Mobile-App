// File: App.js
import React from 'react';
// import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// import StepTracker from './components/StepTracker';
import SkatingTrackerBLE from './SkatingTrackerBLE';
import StepTracker from './StepTracker';
import { View, Button } from 'react-native';

export default function App() {
  const [showSteps, setShowSteps] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      {showSteps ? <StepTracker /> : <SkatingTrackerBLE />}
      <Button
        title={showSteps ? '⬅️ Back to Skating' : '➡️ Go to Step Tracker'}
        onPress={() => setShowSteps(!showSteps)}
      />
    </View>
  );
}
// // File: App.js
// import React from 'react';
// import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// import StepTracker from './/components/StepTracker';
// import { View, Button } from 'react-native';

// export default function App() {
//   const [showSteps, setShowSteps] = React.useState(false);

//   return (
//     <View style={{ flex: 1 }}>
//       {showSteps ? <StepTracker /> : <SkatingTrackerBLE />}
//       <Button
//         title={showSteps ? '⬅️ Back to Skating' : '➡️ Go to Step Tracker'}
//         onPress={() => setShowSteps(!showSteps)}
//       />
//     </View>
//   );
// }
// // // File: App.js
// // import React from 'react';
// // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // import StepTracker from './components/StepTracker';
// // import { View, Button } from 'react-native';

// // export default function App() {
// //   const [showSteps, setShowSteps] = React.useState(false);

// //   return (
// //     <View style={{ flex: 1 }}>
// //       {showSteps ? <StepTracker /> : <SkatingTrackerBLE />}
// //       <Button
// //         title={showSteps ? '⬅️ Back to Skating' : '➡️ Go to Step Tracker'}
// //         onPress={() => setShowSteps(!showSteps)}
// //       />
// //     </View>
// //   );
// // }
// // // import React from 'react';
// // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';

// // // export default function App() {
// // //   return <SkatingTrackerBLE />;
// // // }
// // // // File: App.js
// // // import React, { useEffect } from 'react';
// // // import { SafeAreaView, StatusBar } from 'react-native';
// // // import SkatingController from './components/SkatingController';
// // // import useBLEStore from './components/useBLEStore';

// // // export default function App() {
// // //   const setIsMounted = useBLEStore((state) => state.setIsMounted);

// // //   useEffect(() => {
// // //     // Set mounted flag on startup
// // //     setIsMounted(true);

// // //     // Clean up on unmount
// // //     return () => {
// // //       setIsMounted(false);
// // //       useBLEStore.getState().cleanupConnections();
// // //     };
// // //   }, []);

// // //   return (
// // //     <SafeAreaView style={{ flex: 1 }}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
// // //       <SkatingController />
// // //     </SafeAreaView>
// // //   );
// // // }
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // import { BleManager } from 'react-native-ble-plx';

// // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // const App = () => {
// // // //   // State management
// // // //   const [devices, setDevices] = useState([]);
// // // //   const [isScanning, setIsScanning] = useState(false);
// // // //   const [connectionStatus, setConnectionStatus] = useState('disconnected');
// // // //   const [bandActive, setBandActive] = useState(false);
// // // //   const [data, setData] = useState({
// // // //     mode: 'S',
// // // //     steps: 0,
// // // //     walking_dist: 0,
// // // //     strides: 0,
// // // //     skating_dist: 0,
// // // //     speed: 0,
// // // //     laps: 0
// // // //   });

// // // //   // Refs for BLE manager and device
// // // //   const bleManager = useRef(new BleManager()).current;
// // // //   const connectedDevice = useRef(null);
// // // //   const monitorSubscription = useRef(null);
// // // //   const isMounted = useRef(true);

// // // //   // Cleanup on unmount
// // // //   useEffect(() => {
// // // //     return () => {
// // // //       isMounted.current = false;
// // // //       cleanupConnections();
// // // //     };
// // // //   }, []);

// // // //   // Handle disconnections
// // // //   useEffect(() => {
// // // //     const subscription = bleManager.onDeviceDisconnected((deviceId, error) => {
// // // //       if (!isMounted.current) return;
      
// // // //       console.log('Device disconnected:', deviceId, error);
// // // //       if (connectedDevice.current && connectedDevice.current.id === deviceId) {
// // // //         handleDisconnection();
// // // //       }
// // // //     });

// // // //     return () => subscription.remove();
// // // //   }, []);

// // // //   const cleanupConnections = async () => {
// // // //     try {
// // // //       // Remove notification subscription
// // // //       if (monitorSubscription.current) {
// // // //         monitorSubscription.current.remove();
// // // //         monitorSubscription.current = null;
// // // //       }

// // // //       // Stop scanning
// // // //       await bleManager.stopDeviceScan().catch(() => {});

// // // //       // Disconnect device if connected
// // // //       if (connectedDevice.current) {
// // // //         try {
// // // //           const isConnected = await connectedDevice.current.isConnected();
// // // //           if (isConnected) {
// // // //             await connectedDevice.current.cancelConnection();
// // // //           }
// // // //         } catch (error) {
// // // //           console.log('Device already disconnected');
// // // //         }
// // // //         connectedDevice.current = null;
// // // //       }

// // // //       if (isMounted.current) {
// // // //         setConnectionStatus('disconnected');
// // // //         setBandActive(false);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Cleanup error:', error);
// // // //     }
// // // //   };

// // // //   const handleDisconnection = () => {
// // // //     if (isMounted.current) {
// // // //       Alert.alert('Disconnected', 'The device was disconnected');
// // // //       cleanupConnections();
// // // //     }
// // // //   };

// // // //   // Scan for BLE devices
// // // //   const scanDevices = async () => {
// // // //     if (isScanning) return;

// // // //     try {
// // // //       setDevices([]);
// // // //       setIsScanning(true);

// // // //       // Check BLE state first
// // // //       const state = await bleManager.state();
// // // //       if (state !== 'PoweredOn') {
// // // //         Alert.alert('Bluetooth Error', 'Please enable Bluetooth');
// // // //         setIsScanning(false);
// // // //         return;
// // // //       }

// // // //       bleManager.startDeviceScan(null, null, (error, device) => {
// // // //         if (error) {
// // // //           console.error('Scan error:', error);
// // // //           setIsScanning(false);
// // // //           return;
// // // //         }

// // // //         // Filter for ESP32 devices only
// // // //         if (device && device.name && device.name.includes('ESP32C6')) {
// // // //           setDevices(prevDevices => {
// // // //             const deviceExists = prevDevices.some(d => d.id === device.id);
// // // //             return deviceExists ? prevDevices : [...prevDevices, device];
// // // //           });
// // // //         }
// // // //       });

// // // //       // Stop scanning after 10 seconds
// // // //       setTimeout(() => {
// // // //         bleManager.stopDeviceScan();
// // // //         setIsScanning(false);
// // // //       }, 10000);
// // // //     } catch (error) {
// // // //       console.error('Scan initialization error:', error);
// // // //       setIsScanning(false);
// // // //     }
// // // //   };

// // // //   // Connect to device with robust error handling
// // // //   const connectToDevice = async (device) => {
// // // //     if (connectionStatus === 'connecting') return;

// // // //     try {
// // // //       setConnectionStatus('connecting');
      
// // // //       // Clean up any existing connection first
// // // //       await cleanupConnections();

// // // //       // Connect to device with timeout
// // // //       const deviceConnected = await Promise.race([
// // // //         device.connect(),
// // // //         new Promise((_, reject) => 
// // // //           setTimeout(() => reject(new Error('Connection timeout')), 10000)
// // // //         )
// // // //       ]);

// // // //       if (!isMounted.current) {
// // // //         await deviceConnected.cancelConnection();
// // // //         return;
// // // //       }

// // // //       connectedDevice.current = deviceConnected;
// // // //       setConnectionStatus('discovering');

// // // //       // Discover services and characteristics
// // // //       await deviceConnected.discoverAllServicesAndCharacteristics();
      
// // // //       if (!isMounted.current) {
// // // //         await deviceConnected.cancelConnection();
// // // //         return;
// // // //       }

// // // //       setConnectionStatus('setting_up');

// // // //       // Request MTU (handle failure gracefully)
// // // //       try {
// // // //         await deviceConnected.requestMTU(185);
// // // //         console.log('MTU set to 185');
// // // //       } catch (mtuError) {
// // // //         console.warn('MTU request failed, continuing with default:', mtuError);
// // // //       }

// // // //       // Setup notifications
// // // //       await setupNotifications(deviceConnected);

// // // //       if (!isMounted.current) {
// // // //         await deviceConnected.cancelConnection();
// // // //         return;
// // // //       }

// // // //       setConnectionStatus('connected');
// // // //       console.log('BLE connection established successfully');
      
// // // //       // Send initial status request
// // // //       setTimeout(() => {
// // // //         if (connectedDevice.current) {
// // // //           sendCommand('STATUS');
// // // //         }
// // // //       }, 2000);

// // // //     } catch (error) {
// // // //       console.error('Connection error:', error);
// // // //       if (isMounted.current) {
// // // //         handleDisconnection();
// // // //       }
// // // //     }
// // // //   };

// // // //   // Setup notifications with proper error handling
// // // //   const setupNotifications = async (device) => {
// // // //     try {
// // // //       // Clear any existing subscription
// // // //       if (monitorSubscription.current) {
// // // //         monitorSubscription.current.remove();
// // // //         monitorSubscription.current = null;
// // // //       }

// // // //       // Add a small delay to ensure the device is ready
// // // //       await new Promise(resolve => setTimeout(resolve, 1000));

// // // //       // Monitor characteristic for notifications
// // // //       monitorSubscription.current = device.monitorCharacteristicForService(
// // // //         SERVICE_UUID,
// // // //         CHARACTERISTIC_UUID,
// // // //         (error, characteristic) => {
// // // //           if (error) {
// // // //             console.error('Notification error:', error);
// // // //             // Only disconnect on specific error codes
// // // //             if (error.errorCode === 201 || error.errorCode === 205) { // Device disconnected
// // // //               handleDisconnection();
// // // //             }
// // // //             return;
// // // //           }

// // // //           try {
// // // //             if (characteristic && characteristic.value) {
// // // //               // Try different decoding methods
// // // //               let jsonString;
// // // //               try {
// // // //                 // First try base64 decoding
// // // //                 jsonString = Buffer.from(characteristic.value, 'base64').toString('utf-8');
// // // //               } catch (decodeError) {
// // // //                 // If base64 fails, try direct string conversion
// // // //                 jsonString = characteristic.value;
// // // //               }
              
// // // //               console.log('Received data:', jsonString);
// // // //               const value = JSON.parse(jsonString);
              
// // // //               // Map the shortened mode identifiers to full names
// // // //               const modeMap = {
// // // //                 'S': 'Step Counting',
// // // //                 'SS': 'Skating Speed',
// // // //                 'SD': 'Skating Distance',
// // // //                 'SF': 'Freestyle'
// // // //               };
              
// // // //               if (isMounted.current) {
// // // //                 setData(prevData => ({
// // // //                   mode: modeMap[value.m] || value.m,
// // // //                   steps: value.s || 0,
// // // //                   walking_dist: value.wd || 0,
// // // //                   strides: value.st || 0,
// // // //                   skating_dist: value.sd || 0,
// // // //                   speed: value.sp || 0,
// // // //                   laps: value.l || 0
// // // //                 }));
// // // //               }
// // // //             }
// // // //           } catch (parseError) {
// // // //             console.error('Data parsing error:', parseError);
// // // //           }
// // // //         }
// // // //       );
// // // //     } catch (error) {
// // // //       console.error('Notification setup error:', error);
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   // Send command with proper error handling
// // // //   const sendCommand = async (command) => {
// // // //     if (connectionStatus !== 'connected' || !connectedDevice.current) {
// // // //       console.warn('No active connection');
// // // //       return false;
// // // //     }

// // // //     try {
// // // //       // Check if device is still connected
// // // //       const isConnected = await connectedDevice.current.isConnected();
// // // //       if (!isConnected) {
// // // //         handleDisconnection();
// // // //         return false;
// // // //       }

// // // //       // Format command as expected by ESP32 (send as plain text, not base64)
// // // //       const formattedCmd = String(command).trim().toUpperCase();
      
// // // //       await connectedDevice.current.writeCharacteristicWithResponseForService(
// // // //         SERVICE_UUID,
// // // //         CHARACTERISTIC_UUID,
// // // //         formattedCmd
// // // //       );
      
// // // //       console.log('Command sent successfully:', formattedCmd);
// // // //       return true;
// // // //     } catch (error) {
// // // //       console.error('Command send error:', error);
// // // //       if (error.errorCode === 201) { // Device disconnected
// // // //         handleDisconnection();
// // // //       }
// // // //       return false;
// // // //     }
// // // //   };

// // // //   // UI rendering
// // // //   const renderDeviceItem = ({ item }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.deviceItem}
// // // //       onPress={() => connectToDevice(item)}
// // // //       disabled={connectionStatus === 'connecting'}
// // // //     >
// // // //       <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
// // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // //       <Text style={styles.deviceRSSI}>RSSI: {item.rssi || 'N/A'}</Text>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   const getStatusColor = (status) => {
// // // //     switch(status) {
// // // //       case 'connected': return '#34C759';
// // // //       case 'connecting': 
// // // //       case 'discovering':
// // // //       case 'setting_up': return '#FF9500';
// // // //       default: return '#FF3B30';
// // // //     }
// // // //   };

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <Text style={styles.title}>Skating Band Controller</Text>

// // // //       <View style={styles.statusContainer}>
// // // //         <Text style={styles.statusText}>
// // // //           Status: <Text style={[styles.statusValue, { color: getStatusColor(connectionStatus) }]}>
// // // //             {connectionStatus.replace('_', ' ').toUpperCase()}
// // // //           </Text>
// // // //         </Text>
// // // //         <Text style={styles.statusText}>
// // // //           Band: <Text style={[styles.statusValue, { color: bandActive ? '#34C759' : '#FF3B30' }]}>
// // // //             {bandActive ? 'ACTIVE' : 'INACTIVE'}
// // // //           </Text>
// // // //         </Text>
// // // //         <Text style={styles.statusText}>
// // // //           Mode: <Text style={styles.statusValue}>{data.mode}</Text>
// // // //         </Text>
// // // //       </View>

// // // //       <View style={styles.buttonContainer}>
// // // //         <Button
// // // //           title={isScanning ? 'SCANNING...' : 'SCAN DEVICES'}
// // // //           onPress={scanDevices}
// // // //           disabled={isScanning || connectionStatus !== 'disconnected'}
// // // //           color="#007AFF"
// // // //         />
// // // //       </View>

// // // //       {connectionStatus === 'connecting' && (
// // // //         <View style={styles.loaderContainer}>
// // // //           <ActivityIndicator size="large" color="#007AFF" />
// // // //           <Text style={styles.loaderText}>Connecting...</Text>
// // // //         </View>
// // // //       )}

// // // //       {devices.length > 0 && connectionStatus === 'disconnected' && (
// // // //         <View style={styles.deviceListContainer}>
// // // //           <Text style={styles.sectionTitle}>AVAILABLE DEVICES</Text>
// // // //           <FlatList
// // // //             data={devices}
// // // //             keyExtractor={(item) => item.id}
// // // //             renderItem={renderDeviceItem}
// // // //             contentContainerStyle={styles.deviceListContent}
// // // //             showsVerticalScrollIndicator={false}
// // // //           />
// // // //         </View>
// // // //       )}

// // // //       {connectionStatus === 'connected' && (
// // // //         <View style={styles.controlPanel}>
// // // //           <TouchableOpacity
// // // //             style={[styles.controlButton, { backgroundColor: bandActive ? '#FF3B30' : '#34C759' }]}
// // // //             onPress={async () => {
// // // //               const success = await sendCommand(bandActive ? 'TURN_OFF' : 'TURN_ON');
// // // //               if (success) setBandActive(!bandActive);
// // // //             }}
// // // //           >
// // // //             <Text style={styles.controlButtonText}>
// // // //               {bandActive ? 'TURN OFF' : 'TURN ON'}
// // // //             </Text>
// // // //           </TouchableOpacity>
          
// // // //           <TouchableOpacity
// // // //             style={[styles.controlButton, { backgroundColor: '#FF3B30' }]}
// // // //             onPress={cleanupConnections}
// // // //           >
// // // //             <Text style={styles.controlButtonText}>DISCONNECT</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       )}

// // // //       <View style={styles.dataContainer}>
// // // //         <Text style={styles.sectionTitle}>CURRENT STATS</Text>
        
// // // //         <View style={styles.dataGrid}>
// // // //           <View style={styles.dataItem}>
// // // //             <Text style={styles.dataLabel}>Steps</Text>
// // // //             <Text style={styles.dataValue}>{data.steps}</Text>
// // // //           </View>
          
// // // //           <View style={styles.dataItem}>
// // // //             <Text style={styles.dataLabel}>Walking Distance</Text>
// // // //             <Text style={styles.dataValue}>{data.walking_dist.toFixed(1)} m</Text>
// // // //           </View>
          
// // // //           <View style={styles.dataItem}>
// // // //             <Text style={styles.dataLabel}>Strides</Text>
// // // //             <Text style={styles.dataValue}>{data.strides}</Text>
// // // //           </View>
          
// // // //           <View style={styles.dataItem}>
// // // //             <Text style={styles.dataLabel}>Skating Distance</Text>
// // // //             <Text style={styles.dataValue}>{data.skating_dist.toFixed(1)} m</Text>
// // // //           </View>
          
// // // //           <View style={styles.dataItem}>
// // // //             <Text style={styles.dataLabel}>Speed</Text>
// // // //             <Text style={styles.dataValue}>{data.speed.toFixed(1)} m/s</Text>
// // // //           </View>
          
// // // //           <View style={styles.dataItem}>
// // // //             <Text style={styles.dataLabel}>Laps</Text>
// // // //             <Text style={styles.dataValue}>{data.laps}</Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // };

// // // // // Styles
// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     padding: 16,
// // // //     backgroundColor: '#F5F5F5',
// // // //   },
// // // //   title: {
// // // //     fontSize: 24,
// // // //     fontWeight: 'bold',
// // // //     marginBottom: 20,
// // // //     textAlign: 'center',
// // // //     color: '#333',
// // // //   },
// // // //   statusContainer: {
// // // //     marginBottom: 20,
// // // //     padding: 16,
// // // //     backgroundColor: '#FFF',
// // // //     borderRadius: 8,
// // // //     elevation: 2,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //   },
// // // //   statusText: {
// // // //     fontSize: 16,
// // // //     marginBottom: 8,
// // // //     color: '#333',
// // // //   },
// // // //   statusValue: {
// // // //     fontWeight: 'bold',
// // // //   },
// // // //   buttonContainer: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   loaderContainer: {
// // // //     alignItems: 'center',
// // // //     marginVertical: 20,
// // // //   },
// // // //   loaderText: {
// // // //     marginTop: 10,
// // // //     fontSize: 16,
// // // //     color: '#666',
// // // //   },
// // // //   deviceListContainer: {
// // // //     marginBottom: 16,
// // // //     maxHeight: 200,
// // // //   },
// // // //   sectionTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: 'bold',
// // // //     marginBottom: 12,
// // // //     color: '#555',
// // // //   },
// // // //   deviceItem: {
// // // //     padding: 16,
// // // //     marginBottom: 8,
// // // //     backgroundColor: '#FFF',
// // // //     borderRadius: 8,
// // // //     elevation: 1,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 2,
// // // //   },
// // // //   deviceName: {
// // // //     fontSize: 16,
// // // //     fontWeight: '500',
// // // //     marginBottom: 4,
// // // //   },
// // // //   deviceId: {
// // // //     fontSize: 12,
// // // //     color: '#777',
// // // //     marginBottom: 2,
// // // //   },
// // // //   deviceRSSI: {
// // // //     fontSize: 12,
// // // //     color: '#999',
// // // //   },
// // // //   deviceListContent: {
// // // //     paddingBottom: 8,
// // // //   },
// // // //   controlPanel: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     marginBottom: 16,
// // // //     gap: 12,
// // // //   },
// // // //   controlButton: {
// // // //     flex: 1,
// // // //     padding: 12,
// // // //     borderRadius: 8,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   controlButtonText: {
// // // //     color: '#FFF',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // //   dataContainer: {
// // // //     padding: 16,
// // // //     backgroundColor: '#FFF',
// // // //     borderRadius: 8,
// // // //     elevation: 2,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //   },
// // // //   dataGrid: {
// // // //     flexDirection: 'row',
// // // //     flexWrap: 'wrap',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   dataItem: {
// // // //     width: '48%',
// // // //     marginBottom: 12,
// // // //     padding: 12,
// // // //     backgroundColor: '#F8F9FA',
// // // //     borderRadius: 6,
// // // //   },
// // // //   dataLabel: {
// // // //     fontSize: 14,
// // // //     color: '#666',
// // // //     marginBottom: 4,
// // // //   },
// // // //   dataValue: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#333',
// // // //   },
// // // // });

// // // // export default App;
// // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // const SkateBandApp = () => {
// // // // //   // State management
// // // // //   const [devices, setDevices] = useState([]);
// // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // //   const [connectionStatus, setConnectionStatus] = useState('disconnected');
// // // // //   const [bandActive, setBandActive] = useState(false);
// // // // //   const [data, setData] = useState({
// // // // //     mode: 'S',
// // // // //     steps: 0,
// // // // //     walking_dist: 0,
// // // // //     strides: 0,
// // // // //     skating_dist: 0,
// // // // //     speed: 0,
// // // // //     laps: 0
// // // // //   });

// // // // //   // Refs for BLE manager and device
// // // // //   const bleManager = useRef(new BleManager()).current;
// // // // //   const connectedDevice = useRef(null);
// // // // //   const monitorSubscription = useRef(null);
// // // // //   const isMounted = useRef(true);

// // // // //   // Cleanup on unmount
// // // // //   useEffect(() => {
// // // // //     return () => {
// // // // //       isMounted.current = false;
// // // // //       cleanupConnections();
// // // // //     };
// // // // //   }, []);

// // // // //   // Handle disconnections
// // // // //   useEffect(() => {
// // // // //     const subscription = bleManager.onDeviceDisconnected((deviceId, error) => {
// // // // //       if (!isMounted.current) return;
      
// // // // //       console.log('Device disconnected:', deviceId, error);
// // // // //       if (connectedDevice.current && connectedDevice.current.id === deviceId) {
// // // // //         handleDisconnection();
// // // // //       }
// // // // //     });

// // // // //     return () => subscription.remove();
// // // // //   }, []);

// // // // //   const cleanupConnections = async () => {
// // // // //     try {
// // // // //       // Remove notification subscription
// // // // //       if (monitorSubscription.current) {
// // // // //         monitorSubscription.current.remove();
// // // // //         monitorSubscription.current = null;
// // // // //       }

// // // // //       // Stop scanning
// // // // //       await bleManager.stopDeviceScan().catch(() => {});

// // // // //       // Disconnect device if connected
// // // // //       if (connectedDevice.current) {
// // // // //         try {
// // // // //           const isConnected = await connectedDevice.current.isConnected();
// // // // //           if (isConnected) {
// // // // //             await connectedDevice.current.cancelConnection();
// // // // //           }
// // // // //         } catch (error) {
// // // // //           console.log('Device already disconnected');
// // // // //         }
// // // // //         connectedDevice.current = null;
// // // // //       }

// // // // //       if (isMounted.current) {
// // // // //         setConnectionStatus('disconnected');
// // // // //         setBandActive(false);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Cleanup error:', error);
// // // // //     }
// // // // //   };

// // // // //   const handleDisconnection = () => {
// // // // //     if (isMounted.current) {
// // // // //       Alert.alert('Disconnected', 'The device was disconnected');
// // // // //       cleanupConnections();
// // // // //     }
// // // // //   };

// // // // //   // Scan for BLE devices
// // // // //   const scanDevices = async () => {
// // // // //     if (isScanning) return;

// // // // //     try {
// // // // //       setDevices([]);
// // // // //       setIsScanning(true);

// // // // //       // Check BLE state first
// // // // //       const state = await bleManager.state();
// // // // //       if (state !== 'PoweredOn') {
// // // // //         Alert.alert('Bluetooth Error', 'Please enable Bluetooth');
// // // // //         setIsScanning(false);
// // // // //         return;
// // // // //       }

// // // // //       bleManager.startDeviceScan(null, null, (error, device) => {
// // // // //         if (error) {
// // // // //           console.error('Scan error:', error);
// // // // //           setIsScanning(false);
// // // // //           return;
// // // // //         }

// // // // //         // Filter for ESP32 devices only
// // // // //         if (device && device.name && device.name.includes('ESP32C6')) {
// // // // //           setDevices(prevDevices => {
// // // // //             const deviceExists = prevDevices.some(d => d.id === device.id);
// // // // //             return deviceExists ? prevDevices : [...prevDevices, device];
// // // // //           });
// // // // //         }
// // // // //       });

// // // // //       // Stop scanning after 10 seconds
// // // // //       setTimeout(() => {
// // // // //         bleManager.stopDeviceScan();
// // // // //         setIsScanning(false);
// // // // //       }, 10000);
// // // // //     } catch (error) {
// // // // //       console.error('Scan initialization error:', error);
// // // // //       setIsScanning(false);
// // // // //     }
// // // // //   };

// // // // //   // Connect to device with robust error handling
// // // // //   const connectToDevice = async (device) => {
// // // // //     if (connectionStatus === 'connecting') return;

// // // // //     try {
// // // // //       setConnectionStatus('connecting');
      
// // // // //       // Clean up any existing connection first
// // // // //       await cleanupConnections();

// // // // //       // Connect to device with timeout
// // // // //       const deviceConnected = await Promise.race([
// // // // //         device.connect(),
// // // // //         new Promise((_, reject) => 
// // // // //           setTimeout(() => reject(new Error('Connection timeout')), 10000)
// // // // //         )
// // // // //       ]);

// // // // //       if (!isMounted.current) {
// // // // //         await deviceConnected.cancelConnection();
// // // // //         return;
// // // // //       }

// // // // //       connectedDevice.current = deviceConnected;
// // // // //       setConnectionStatus('discovering');

// // // // //       // Discover services and characteristics
// // // // //       await deviceConnected.discoverAllServicesAndCharacteristics();
      
// // // // //       if (!isMounted.current) {
// // // // //         await deviceConnected.cancelConnection();
// // // // //         return;
// // // // //       }

// // // // //       setConnectionStatus('setting_up');

// // // // //       // Request MTU (handle failure gracefully)
// // // // //       try {
// // // // //         await deviceConnected.requestMTU(185);
// // // // //         console.log('MTU set to 185');
// // // // //       } catch (mtuError) {
// // // // //         console.warn('MTU request failed, continuing with default:', mtuError);
// // // // //       }

// // // // //       // Setup notifications
// // // // //       await setupNotifications(deviceConnected);

// // // // //       if (!isMounted.current) {
// // // // //         await deviceConnected.cancelConnection();
// // // // //         return;
// // // // //       }

// // // // //       setConnectionStatus('connected');
// // // // //       console.log('BLE connection established successfully');
      
// // // // //       // Send initial status request
// // // // //       setTimeout(() => {
// // // // //         if (connectedDevice.current) {
// // // // //           sendCommand('STATUS');
// // // // //         }
// // // // //       }, 2000);

// // // // //     } catch (error) {
// // // // //       console.error('Connection error:', error);
// // // // //       if (isMounted.current) {
// // // // //         handleDisconnection();
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   // Setup notifications with proper error handling
// // // // //   const setupNotifications = async (device) => {
// // // // //     try {
// // // // //       // Clear any existing subscription
// // // // //       if (monitorSubscription.current) {
// // // // //         monitorSubscription.current.remove();
// // // // //         monitorSubscription.current = null;
// // // // //       }

// // // // //       // Add a small delay to ensure the device is ready
// // // // //       await new Promise(resolve => setTimeout(resolve, 1000));

// // // // //       // Monitor characteristic for notifications
// // // // //       monitorSubscription.current = device.monitorCharacteristicForService(
// // // // //         SERVICE_UUID,
// // // // //         CHARACTERISTIC_UUID,
// // // // //         (error, characteristic) => {
// // // // //           if (error) {
// // // // //             console.error('Notification error:', error);
// // // // //             // Only disconnect on specific error codes
// // // // //             if (error.errorCode === 201 || error.errorCode === 205) { // Device disconnected
// // // // //               handleDisconnection();
// // // // //             }
// // // // //             return;
// // // // //           }

// // // // //           try {
// // // // //             if (characteristic && characteristic.value) {
// // // // //               // Try different decoding methods
// // // // //               let jsonString;
// // // // //               try {
// // // // //                 // First try base64 decoding
// // // // //                 jsonString = Buffer.from(characteristic.value, 'base64').toString('utf-8');
// // // // //               } catch (decodeError) {
// // // // //                 // If base64 fails, try direct string conversion
// // // // //                 jsonString = characteristic.value;
// // // // //               }
              
// // // // //               console.log('Received data:', jsonString);
// // // // //               const value = JSON.parse(jsonString);
              
// // // // //               // Map the shortened mode identifiers to full names
// // // // //               const modeMap = {
// // // // //                 'S': 'Step Counting',
// // // // //                 'SS': 'Skating Speed',
// // // // //                 'SD': 'Skating Distance',
// // // // //                 'SF': 'Freestyle'
// // // // //               };
              
// // // // //               if (isMounted.current) {
// // // // //                 setData(prevData => ({
// // // // //                   mode: modeMap[value.m] || value.m,
// // // // //                   steps: value.s || 0,
// // // // //                   walking_dist: value.wd || 0,
// // // // //                   strides: value.st || 0,
// // // // //                   skating_dist: value.sd || 0,
// // // // //                   speed: value.sp || 0,
// // // // //                   laps: value.l || 0
// // // // //                 }));
// // // // //               }
// // // // //             }
// // // // //           } catch (parseError) {
// // // // //             console.error('Data parsing error:', parseError);
// // // // //           }
// // // // //         }
// // // // //       );
// // // // //     } catch (error) {
// // // // //       console.error('Notification setup error:', error);
// // // // //       throw error;
// // // // //     }
// // // // //   };

// // // // //   // Send command with proper error handling
// // // // //   const sendCommand = async (command) => {
// // // // //     if (connectionStatus !== 'connected' || !connectedDevice.current) {
// // // // //       console.warn('No active connection');
// // // // //       return false;
// // // // //     }

// // // // //     try {
// // // // //       // Check if device is still connected
// // // // //       const isConnected = await connectedDevice.current.isConnected();
// // // // //       if (!isConnected) {
// // // // //         handleDisconnection();
// // // // //         return false;
// // // // //       }

// // // // //       // Format command as expected by ESP32 (send as plain text, not base64)
// // // // //       const formattedCmd = String(command).trim().toUpperCase();
      
// // // // //       await connectedDevice.current.writeCharacteristicWithResponseForService(
// // // // //         SERVICE_UUID,
// // // // //         CHARACTERISTIC_UUID,
// // // // //         formattedCmd
// // // // //       );
      
// // // // //       console.log('Command sent successfully:', formattedCmd);
// // // // //       return true;
// // // // //     } catch (error) {
// // // // //       console.error('Command send error:', error);
// // // // //       if (error.errorCode === 201) { // Device disconnected
// // // // //         handleDisconnection();
// // // // //       }
// // // // //       return false;
// // // // //     }
// // // // //   };

// // // // //   // UI rendering
// // // // //   const renderDeviceItem = ({ item }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.deviceItem}
// // // // //       onPress={() => connectToDevice(item)}
// // // // //       disabled={connectionStatus === 'connecting'}
// // // // //     >
// // // // //       <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
// // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // //       <Text style={styles.deviceRSSI}>RSSI: {item.rssi || 'N/A'}</Text>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   const getStatusColor = (status) => {
// // // // //     switch(status) {
// // // // //       case 'connected': return '#34C759';
// // // // //       case 'connecting': 
// // // // //       case 'discovering':
// // // // //       case 'setting_up': return '#FF9500';
// // // // //       default: return '#FF3B30';
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <Text style={styles.title}>Skating Band Controller</Text>

// // // // //       <View style={styles.statusContainer}>
// // // // //         <Text style={styles.statusText}>
// // // // //           Status: <Text style={[styles.statusValue, { color: getStatusColor(connectionStatus) }]}>
// // // // //             {connectionStatus.replace('_', ' ').toUpperCase()}
// // // // //           </Text>
// // // // //         </Text>
// // // // //         <Text style={styles.statusText}>
// // // // //           Band: <Text style={[styles.statusValue, { color: bandActive ? '#34C759' : '#FF3B30' }]}>
// // // // //             {bandActive ? 'ACTIVE' : 'INACTIVE'}
// // // // //           </Text>
// // // // //         </Text>
// // // // //         <Text style={styles.statusText}>
// // // // //           Mode: <Text style={styles.statusValue}>{data.mode}</Text>
// // // // //         </Text>
// // // // //       </View>

// // // // //       <View style={styles.buttonContainer}>
// // // // //         <Button
// // // // //           title={isScanning ? 'SCANNING...' : 'SCAN DEVICES'}
// // // // //           onPress={scanDevices}
// // // // //           disabled={isScanning || connectionStatus !== 'disconnected'}
// // // // //           color="#007AFF"
// // // // //         />
// // // // //       </View>

// // // // //       {connectionStatus === 'connecting' && (
// // // // //         <View style={styles.loaderContainer}>
// // // // //           <ActivityIndicator size="large" color="#007AFF" />
// // // // //           <Text style={styles.loaderText}>Connecting...</Text>
// // // // //         </View>
// // // // //       )}

// // // // //       {devices.length > 0 && connectionStatus === 'disconnected' && (
// // // // //         <View style={styles.deviceListContainer}>
// // // // //           <Text style={styles.sectionTitle}>AVAILABLE DEVICES</Text>
// // // // //           <FlatList
// // // // //             data={devices}
// // // // //             keyExtractor={(item) => item.id}
// // // // //             renderItem={renderDeviceItem}
// // // // //             contentContainerStyle={styles.deviceListContent}
// // // // //             showsVerticalScrollIndicator={false}
// // // // //           />
// // // // //         </View>
// // // // //       )}

// // // // //       {connectionStatus === 'connected' && (
// // // // //         <View style={styles.controlPanel}>
// // // // //           <TouchableOpacity
// // // // //             style={[styles.controlButton, { backgroundColor: bandActive ? '#FF3B30' : '#34C759' }]}
// // // // //             onPress={async () => {
// // // // //               const success = await sendCommand(bandActive ? 'TURN_OFF' : 'TURN_ON');
// // // // //               if (success) setBandActive(!bandActive);
// // // // //             }}
// // // // //           >
// // // // //             <Text style={styles.controlButtonText}>
// // // // //               {bandActive ? 'TURN OFF' : 'TURN ON'}
// // // // //             </Text>
// // // // //           </TouchableOpacity>
          
// // // // //           <TouchableOpacity
// // // // //             style={[styles.controlButton, { backgroundColor: '#FF3B30' }]}
// // // // //             onPress={cleanupConnections}
// // // // //           >
// // // // //             <Text style={styles.controlButtonText}>DISCONNECT</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       <View style={styles.dataContainer}>
// // // // //         <Text style={styles.sectionTitle}>CURRENT STATS</Text>
        
// // // // //         <View style={styles.dataGrid}>
// // // // //           <View style={styles.dataItem}>
// // // // //             <Text style={styles.dataLabel}>Steps</Text>
// // // // //             <Text style={styles.dataValue}>{data.steps}</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.dataItem}>
// // // // //             <Text style={styles.dataLabel}>Walking Distance</Text>
// // // // //             <Text style={styles.dataValue}>{data.walking_dist.toFixed(1)} m</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.dataItem}>
// // // // //             <Text style={styles.dataLabel}>Strides</Text>
// // // // //             <Text style={styles.dataValue}>{data.strides}</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.dataItem}>
// // // // //             <Text style={styles.dataLabel}>Skating Distance</Text>
// // // // //             <Text style={styles.dataValue}>{data.skating_dist.toFixed(1)} m</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.dataItem}>
// // // // //             <Text style={styles.dataLabel}>Speed</Text>
// // // // //             <Text style={styles.dataValue}>{data.speed.toFixed(1)} m/s</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.dataItem}>
// // // // //             <Text style={styles.dataLabel}>Laps</Text>
// // // // //             <Text style={styles.dataValue}>{data.laps}</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // // Styles
// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     padding: 16,
// // // // //     backgroundColor: '#F5F5F5',
// // // // //   },
// // // // //   title: {
// // // // //     fontSize: 24,
// // // // //     fontWeight: 'bold',
// // // // //     marginBottom: 20,
// // // // //     textAlign: 'center',
// // // // //     color: '#333',
// // // // //   },
// // // // //   statusContainer: {
// // // // //     marginBottom: 20,
// // // // //     padding: 16,
// // // // //     backgroundColor: '#FFF',
// // // // //     borderRadius: 8,
// // // // //     elevation: 2,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //   },
// // // // //   statusText: {
// // // // //     fontSize: 16,
// // // // //     marginBottom: 8,
// // // // //     color: '#333',
// // // // //   },
// // // // //   statusValue: {
// // // // //     fontWeight: 'bold',
// // // // //   },
// // // // //   buttonContainer: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   loaderContainer: {
// // // // //     alignItems: 'center',
// // // // //     marginVertical: 20,
// // // // //   },
// // // // //   loaderText: {
// // // // //     marginTop: 10,
// // // // //     fontSize: 16,
// // // // //     color: '#666',
// // // // //   },
// // // // //   deviceListContainer: {
// // // // //     marginBottom: 16,
// // // // //     maxHeight: 200,
// // // // //   },
// // // // //   sectionTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: 'bold',
// // // // //     marginBottom: 12,
// // // // //     color: '#555',
// // // // //   },
// // // // //   deviceItem: {
// // // // //     padding: 16,
// // // // //     marginBottom: 8,
// // // // //     backgroundColor: '#FFF',
// // // // //     borderRadius: 8,
// // // // //     elevation: 1,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 1 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 2,
// // // // //   },
// // // // //   deviceName: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '500',
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   deviceId: {
// // // // //     fontSize: 12,
// // // // //     color: '#777',
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   deviceRSSI: {
// // // // //     fontSize: 12,
// // // // //     color: '#999',
// // // // //   },
// // // // //   deviceListContent: {
// // // // //     paddingBottom: 8,
// // // // //   },
// // // // //   controlPanel: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     marginBottom: 16,
// // // // //     gap: 12,
// // // // //   },
// // // // //   controlButton: {
// // // // //     flex: 1,
// // // // //     padding: 12,
// // // // //     borderRadius: 8,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   controlButtonText: {
// // // // //     color: '#FFF',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   dataContainer: {
// // // // //     padding: 16,
// // // // //     backgroundColor: '#FFF',
// // // // //     borderRadius: 8,
// // // // //     elevation: 2,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //   },
// // // // //   dataGrid: {
// // // // //     flexDirection: 'row',
// // // // //     flexWrap: 'wrap',
// // // // //     justifyContent: 'space-between',
// // // // //   },
// // // // //   dataItem: {
// // // // //     width: '48%',
// // // // //     marginBottom: 12,
// // // // //     padding: 12,
// // // // //     backgroundColor: '#F8F9FA',
// // // // //     borderRadius: 6,
// // // // //   },
// // // // //   dataLabel: {
// // // // //     fontSize: 14,
// // // // //     color: '#666',
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   dataValue: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#333',
// // // // //   },
// // // // // });

// // // // // export default SkateBandApp;
// // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // const App = () => {
// // // // // //   // State management
// // // // // //   const [devices, setDevices] = useState([]);
// // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // //   const [connectionStatus, setConnectionStatus] = useState('disconnected');
// // // // // //   const [bandActive, setBandActive] = useState(false);
// // // // // //   const [data, setData] = useState({
// // // // // //     mode: 'S',
// // // // // //     steps: 0,
// // // // // //     walking_dist: 0,
// // // // // //     strides: 0,
// // // // // //     skating_dist: 0,
// // // // // //     speed: 0,
// // // // // //     laps: 0
// // // // // //   });

// // // // // //   // Refs for BLE manager and device
// // // // // //   const bleManager = useRef(new BleManager()).current;
// // // // // //   const connectedDevice = useRef(null);
// // // // // //   const monitorSubscription = useRef(null);
// // // // // //   const isMounted = useRef(true);

// // // // // //   // Cleanup on unmount
// // // // // //   useEffect(() => {
// // // // // //     return () => {
// // // // // //       isMounted.current = false;
// // // // // //       cleanupConnections();
// // // // // //     };
// // // // // //   }, []);

// // // // // //   // Handle disconnections
// // // // // //   useEffect(() => {
// // // // // //     const subscription = bleManager.onDeviceDisconnected((deviceId, error) => {
// // // // // //       if (!isMounted.current) return;
      
// // // // // //       console.log('Device disconnected:', deviceId, error);
// // // // // //       if (connectedDevice.current && connectedDevice.current.id === deviceId) {
// // // // // //         handleDisconnection();
// // // // // //       }
// // // // // //     });

// // // // // //     return () => subscription.remove();
// // // // // //   }, []);

// // // // // //   const cleanupConnections = async () => {
// // // // // //     try {
// // // // // //       // Remove notification subscription
// // // // // //       if (monitorSubscription.current) {
// // // // // //         monitorSubscription.current.remove();
// // // // // //         monitorSubscription.current = null;
// // // // // //       }

// // // // // //       // Stop scanning
// // // // // //       await bleManager.stopDeviceScan().catch(() => {});

// // // // // //       // Disconnect device if connected
// // // // // //       if (connectedDevice.current) {
// // // // // //         try {
// // // // // //           const isConnected = await connectedDevice.current.isConnected();
// // // // // //           if (isConnected) {
// // // // // //             await connectedDevice.current.cancelConnection();
// // // // // //           }
// // // // // //         } catch (error) {
// // // // // //           console.log('Device already disconnected');
// // // // // //         }
// // // // // //         connectedDevice.current = null;
// // // // // //       }

// // // // // //       if (isMounted.current) {
// // // // // //         setConnectionStatus('disconnected');
// // // // // //         setBandActive(false);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error('Cleanup error:', error);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleDisconnection = () => {
// // // // // //     if (isMounted.current) {
// // // // // //       Alert.alert('Disconnected', 'The device was disconnected');
// // // // // //       cleanupConnections();
// // // // // //     }
// // // // // //   };

// // // // // //   // Scan for BLE devices
// // // // // //   const scanDevices = async () => {
// // // // // //     if (isScanning) return;

// // // // // //     try {
// // // // // //       setDevices([]);
// // // // // //       setIsScanning(true);

// // // // // //       // Check BLE state first
// // // // // //       const state = await bleManager.state();
// // // // // //       if (state !== 'PoweredOn') {
// // // // // //         Alert.alert('Bluetooth Error', 'Please enable Bluetooth');
// // // // // //         setIsScanning(false);
// // // // // //         return;
// // // // // //       }

// // // // // //       bleManager.startDeviceScan(null, null, (error, device) => {
// // // // // //         if (error) {
// // // // // //           console.error('Scan error:', error);
// // // // // //           setIsScanning(false);
// // // // // //           return;
// // // // // //         }

// // // // // //         // Filter for ESP32 devices only
// // // // // //         if (device && device.name && device.name.includes('ESP32C6')) {
// // // // // //           setDevices(prevDevices => {
// // // // // //             const deviceExists = prevDevices.some(d => d.id === device.id);
// // // // // //             return deviceExists ? prevDevices : [...prevDevices, device];
// // // // // //           });
// // // // // //         }
// // // // // //       });

// // // // // //       // Stop scanning after 10 seconds
// // // // // //       setTimeout(() => {
// // // // // //         bleManager.stopDeviceScan();
// // // // // //         setIsScanning(false);
// // // // // //       }, 10000);
// // // // // //     } catch (error) {
// // // // // //       console.error('Scan initialization error:', error);
// // // // // //       setIsScanning(false);
// // // // // //     }
// // // // // //   };

// // // // // //   // Connect to device with robust error handling
// // // // // //   const connectToDevice = async (device) => {
// // // // // //     if (connectionStatus === 'connecting') return;

// // // // // //     try {
// // // // // //       setConnectionStatus('connecting');
      
// // // // // //       // Clean up any existing connection first
// // // // // //       await cleanupConnections();

// // // // // //       // Connect to device
// // // // // //       const deviceConnected = await device.connect();
// // // // // //       if (!isMounted.current) {
// // // // // //         await deviceConnected.cancelConnection();
// // // // // //         return;
// // // // // //       }

// // // // // //       connectedDevice.current = deviceConnected;
// // // // // //       setConnectionStatus('discovering');

// // // // // //       // Discover services and characteristics
// // // // // //       await deviceConnected.discoverAllServicesAndCharacteristics();
// // // // // //       setConnectionStatus('setting_up');

// // // // // //       // Request MTU (handle failure gracefully)
// // // // // //       try {
// // // // // //         await deviceConnected.requestMTU(185);
// // // // // //       } catch (mtuError) {
// // // // // //         console.warn('MTU request failed, continuing with default:', mtuError);
// // // // // //       }

// // // // // //       // Setup notifications
// // // // // //       await setupNotifications(deviceConnected);

// // // // // //       setConnectionStatus('connected');
// // // // // //       console.log('BLE connection established successfully');
// // // // // //     } catch (error) {
// // // // // //       console.error('Connection error:', error);
// // // // // //       handleDisconnection();
// // // // // //     }
// // // // // //   };

// // // // // //   // Setup notifications with proper error handling
// // // // // //   const setupNotifications = async (device) => {
// // // // // //     try {
// // // // // //       // Clear any existing subscription
// // // // // //       if (monitorSubscription.current) {
// // // // // //         monitorSubscription.current.remove();
// // // // // //         monitorSubscription.current = null;
// // // // // //       }

// // // // // //       // Monitor characteristic for notifications
// // // // // //       monitorSubscription.current = device.monitorCharacteristicForService(
// // // // // //         SERVICE_UUID,
// // // // // //         CHARACTERISTIC_UUID,
// // // // // //         (error, characteristic) => {
// // // // // //           if (error) {
// // // // // //             console.error('Notification error:', error);
// // // // // //             // Don't immediately disconnect on notification errors
// // // // // //             if (error.errorCode === 201) { // Device disconnected
// // // // // //               handleDisconnection();
// // // // // //             }
// // // // // //             return;
// // // // // //           }

// // // // // //           try {
// // // // // //             if (characteristic && characteristic.value) {
// // // // // //               const jsonString = Buffer.from(characteristic.value, 'base64').toString('utf-8');
// // // // // //               const value = JSON.parse(jsonString);
              
// // // // // //               // Map the shortened mode identifiers to full names
// // // // // //               const modeMap = {
// // // // // //                 'S': 'Step Counting',
// // // // // //                 'SS': 'Skating Speed',
// // // // // //                 'SD': 'Skating Distance',
// // // // // //                 'SF': 'Freestyle'
// // // // // //               };
              
// // // // // //               if (isMounted.current) {
// // // // // //                 setData(prevData => ({
// // // // // //                   mode: modeMap[value.m] || value.m,
// // // // // //                   steps: value.s || 0,
// // // // // //                   walking_dist: value.wd || 0,
// // // // // //                   strides: value.st || 0,
// // // // // //                   skating_dist: value.sd || 0,
// // // // // //                   speed: value.sp || 0,
// // // // // //                   laps: value.l || 0
// // // // // //                 }));
// // // // // //               }
// // // // // //             }
// // // // // //           } catch (parseError) {
// // // // // //             console.error('Data parsing error:', parseError);
// // // // // //           }
// // // // // //         }
// // // // // //       );
// // // // // //     } catch (error) {
// // // // // //       console.error('Notification setup error:', error);
// // // // // //       throw error;
// // // // // //     }
// // // // // //   };

// // // // // //   // Send command with proper error handling
// // // // // //   const sendCommand = async (command) => {
// // // // // //     if (connectionStatus !== 'connected' || !connectedDevice.current) {
// // // // // //       console.warn('No active connection');
// // // // // //       return false;
// // // // // //     }

// // // // // //     try {
// // // // // //       // Check if device is still connected
// // // // // //       const isConnected = await connectedDevice.current.isConnected();
// // // // // //       if (!isConnected) {
// // // // // //         handleDisconnection();
// // // // // //         return false;
// // // // // //       }

// // // // // //       // Format command as expected by ESP32
// // // // // //       const formattedCmd = String(command).trim().toUpperCase();
// // // // // //       const buffer = Buffer.from(formattedCmd, 'utf-8').toString('base64');
      
// // // // // //       await connectedDevice.current.writeCharacteristicWithResponseForService(
// // // // // //         SERVICE_UUID,
// // // // // //         CHARACTERISTIC_UUID,
// // // // // //         buffer
// // // // // //       );
      
// // // // // //       console.log('Command sent successfully:', formattedCmd);
// // // // // //       return true;
// // // // // //     } catch (error) {
// // // // // //       console.error('Command send error:', error);
// // // // // //       if (error.errorCode === 201) { // Device disconnected
// // // // // //         handleDisconnection();
// // // // // //       }
// // // // // //       return false;
// // // // // //     }
// // // // // //   };

// // // // // //   // UI rendering
// // // // // //   const renderDeviceItem = ({ item }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={styles.deviceItem}
// // // // // //       onPress={() => connectToDevice(item)}
// // // // // //       disabled={connectionStatus === 'connecting'}
// // // // // //     >
// // // // // //       <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
// // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // //       <Text style={styles.deviceRSSI}>RSSI: {item.rssi || 'N/A'}</Text>
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   const getStatusColor = (status) => {
// // // // // //     switch(status) {
// // // // // //       case 'connected': return '#34C759';
// // // // // //       case 'connecting': 
// // // // // //       case 'discovering':
// // // // // //       case 'setting_up': return '#FF9500';
// // // // // //       default: return '#FF3B30';
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <View style={styles.container}>
// // // // // //       <Text style={styles.title}>Skating Band Controller</Text>

// // // // // //       <View style={styles.statusContainer}>
// // // // // //         <Text style={styles.statusText}>
// // // // // //           Status: <Text style={[styles.statusValue, { color: getStatusColor(connectionStatus) }]}>
// // // // // //             {connectionStatus.replace('_', ' ').toUpperCase()}
// // // // // //           </Text>
// // // // // //         </Text>
// // // // // //         <Text style={styles.statusText}>
// // // // // //           Band: <Text style={[styles.statusValue, { color: bandActive ? '#34C759' : '#FF3B30' }]}>
// // // // // //             {bandActive ? 'ACTIVE' : 'INACTIVE'}
// // // // // //           </Text>
// // // // // //         </Text>
// // // // // //         <Text style={styles.statusText}>
// // // // // //           Mode: <Text style={styles.statusValue}>{data.mode}</Text>
// // // // // //         </Text>
// // // // // //       </View>

// // // // // //       <View style={styles.buttonContainer}>
// // // // // //         <Button
// // // // // //           title={isScanning ? 'SCANNING...' : 'SCAN DEVICES'}
// // // // // //           onPress={scanDevices}
// // // // // //           disabled={isScanning || connectionStatus !== 'disconnected'}
// // // // // //           color="#007AFF"
// // // // // //         />
// // // // // //       </View>

// // // // // //       {connectionStatus === 'connecting' && (
// // // // // //         <View style={styles.loaderContainer}>
// // // // // //           <ActivityIndicator size="large" color="#007AFF" />
// // // // // //           <Text style={styles.loaderText}>Connecting...</Text>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {devices.length > 0 && connectionStatus === 'disconnected' && (
// // // // // //         <View style={styles.deviceListContainer}>
// // // // // //           <Text style={styles.sectionTitle}>AVAILABLE DEVICES</Text>
// // // // // //           <FlatList
// // // // // //             data={devices}
// // // // // //             keyExtractor={(item) => item.id}
// // // // // //             renderItem={renderDeviceItem}
// // // // // //             contentContainerStyle={styles.deviceListContent}
// // // // // //             showsVerticalScrollIndicator={false}
// // // // // //           />
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {connectionStatus === 'connected' && (
// // // // // //         <View style={styles.controlPanel}>
// // // // // //           <TouchableOpacity
// // // // // //             style={[styles.controlButton, { backgroundColor: bandActive ? '#FF3B30' : '#34C759' }]}
// // // // // //             onPress={async () => {
// // // // // //               const success = await sendCommand(bandActive ? 'TURN_OFF' : 'TURN_ON');
// // // // // //               if (success) setBandActive(!bandActive);
// // // // // //             }}
// // // // // //           >
// // // // // //             <Text style={styles.controlButtonText}>
// // // // // //               {bandActive ? 'TURN OFF' : 'TURN ON'}
// // // // // //             </Text>
// // // // // //           </TouchableOpacity>
          
// // // // // //           <TouchableOpacity
// // // // // //             style={[styles.controlButton, { backgroundColor: '#FF3B30' }]}
// // // // // //             onPress={cleanupConnections}
// // // // // //           >
// // // // // //             <Text style={styles.controlButtonText}>DISCONNECT</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       <View style={styles.dataContainer}>
// // // // // //         <Text style={styles.sectionTitle}>CURRENT STATS</Text>
        
// // // // // //         <View style={styles.dataGrid}>
// // // // // //           <View style={styles.dataItem}>
// // // // // //             <Text style={styles.dataLabel}>Steps</Text>
// // // // // //             <Text style={styles.dataValue}>{data.steps}</Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.dataItem}>
// // // // // //             <Text style={styles.dataLabel}>Walking Distance</Text>
// // // // // //             <Text style={styles.dataValue}>{data.walking_dist.toFixed(1)} m</Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.dataItem}>
// // // // // //             <Text style={styles.dataLabel}>Strides</Text>
// // // // // //             <Text style={styles.dataValue}>{data.strides}</Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.dataItem}>
// // // // // //             <Text style={styles.dataLabel}>Skating Distance</Text>
// // // // // //             <Text style={styles.dataValue}>{data.skating_dist.toFixed(1)} m</Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.dataItem}>
// // // // // //             <Text style={styles.dataLabel}>Speed</Text>
// // // // // //             <Text style={styles.dataValue}>{data.speed.toFixed(1)} m/s</Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.dataItem}>
// // // // // //             <Text style={styles.dataLabel}>Laps</Text>
// // // // // //             <Text style={styles.dataValue}>{data.laps}</Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );
// // // // // // };

// // // // // // // Styles
// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     padding: 16,
// // // // // //     backgroundColor: '#F5F5F5',
// // // // // //   },
// // // // // //   title: {
// // // // // //     fontSize: 24,
// // // // // //     fontWeight: 'bold',
// // // // // //     marginBottom: 20,
// // // // // //     textAlign: 'center',
// // // // // //     color: '#333',
// // // // // //   },
// // // // // //   statusContainer: {
// // // // // //     marginBottom: 20,
// // // // // //     padding: 16,
// // // // // //     backgroundColor: '#FFF',
// // // // // //     borderRadius: 8,
// // // // // //     elevation: 2,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 4,
// // // // // //   },
// // // // // //   statusText: {
// // // // // //     fontSize: 16,
// // // // // //     marginBottom: 8,
// // // // // //     color: '#333',
// // // // // //   },
// // // // // //   statusValue: {
// // // // // //     fontWeight: 'bold',
// // // // // //   },
// // // // // //   buttonContainer: {
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   loaderContainer: {
// // // // // //     alignItems: 'center',
// // // // // //     marginVertical: 20,
// // // // // //   },
// // // // // //   loaderText: {
// // // // // //     marginTop: 10,
// // // // // //     fontSize: 16,
// // // // // //     color: '#666',
// // // // // //   },
// // // // // //   deviceListContainer: {
// // // // // //     marginBottom: 16,
// // // // // //     maxHeight: 200,
// // // // // //   },
// // // // // //   sectionTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: 'bold',
// // // // // //     marginBottom: 12,
// // // // // //     color: '#555',
// // // // // //   },
// // // // // //   deviceItem: {
// // // // // //     padding: 16,
// // // // // //     marginBottom: 8,
// // // // // //     backgroundColor: '#FFF',
// // // // // //     borderRadius: 8,
// // // // // //     elevation: 1,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 2,
// // // // // //   },
// // // // // //   deviceName: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '500',
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   deviceId: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#777',
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   deviceRSSI: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#999',
// // // // // //   },
// // // // // //   deviceListContent: {
// // // // // //     paddingBottom: 8,
// // // // // //   },
// // // // // //   controlPanel: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     marginBottom: 16,
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   controlButton: {
// // // // // //     flex: 1,
// // // // // //     padding: 12,
// // // // // //     borderRadius: 8,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   controlButtonText: {
// // // // // //     color: '#FFF',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   dataContainer: {
// // // // // //     padding: 16,
// // // // // //     backgroundColor: '#FFF',
// // // // // //     borderRadius: 8,
// // // // // //     elevation: 2,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 4,
// // // // // //   },
// // // // // //   dataGrid: {
// // // // // //     flexDirection: 'row',
// // // // // //     flexWrap: 'wrap',
// // // // // //     justifyContent: 'space-between',
// // // // // //   },
// // // // // //   dataItem: {
// // // // // //     width: '48%',
// // // // // //     marginBottom: 12,
// // // // // //     padding: 12,
// // // // // //     backgroundColor: '#F8F9FA',
// // // // // //     borderRadius: 6,
// // // // // //   },
// // // // // //   dataLabel: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#666',
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   dataValue: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#333',
// // // // // //   },
// // // // // // });

// // // // // // export default App;
// // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // const SkateBandApp = () => {
// // // // // // //   // State management
// // // // // // //   const [devices, setDevices] = useState([]);
// // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // //   const [connectionStatus, setConnectionStatus] = useState('disconnected');
// // // // // // //   const [bandActive, setBandActive] = useState(false);
// // // // // // //   const [data, setData] = useState({
// // // // // // //     mode: 'S', // Matches ESP32's shortened mode identifiers
// // // // // // //     steps: 0,
// // // // // // //     walking_dist: 0,
// // // // // // //     strides: 0,
// // // // // // //     skating_dist: 0,
// // // // // // //     speed: 0,
// // // // // // //     laps: 0
// // // // // // //   });

// // // // // // //   // Refs for BLE manager and subscriptions
// // // // // // //   const bleManager = useRef(new BleManager()).current;
// // // // // // //   const monitorSubscription = useRef(null);
// // // // // // //   const isMounted = useRef(true);

// // // // // // //   // Cleanup on unmount
// // // // // // //   useEffect(() => {
// // // // // // //     return () => {
// // // // // // //       isMounted.current = false;
// // // // // // //       cleanupConnections();
// // // // // // //     };
// // // // // // //   }, []);

// // // // // // //   // Handle disconnections
// // // // // // //   useEffect(() => {
// // // // // // //     const subscription = bleManager.onDeviceDisconnected((deviceId, error) => {
// // // // // // //       if (!isMounted.current) return;
// // // // // // //       if (connectionStatus === 'connected') {
// // // // // // //         console.log('Device disconnected:', error);
// // // // // // //         handleDisconnection();
// // // // // // //       }
// // // // // // //     });

// // // // // // //     return () => subscription.remove();
// // // // // // //   }, [connectionStatus]);

// // // // // // //   const cleanupConnections = async () => {
// // // // // // //     try {
// // // // // // //       if (monitorSubscription.current) {
// // // // // // //         monitorSubscription.current.remove();
// // // // // // //         monitorSubscription.current = null;
// // // // // // //       }
// // // // // // //       await bleManager.stopDeviceScan();
// // // // // // //       setConnectionStatus('disconnected');
// // // // // // //       setBandActive(false);
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Cleanup error:', error);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleDisconnection = () => {
// // // // // // //     Alert.alert('Disconnected', 'The device was disconnected');
// // // // // // //     cleanupConnections();
// // // // // // //   };

// // // // // // //   // Scan for BLE devices (optimized for ESP32)
// // // // // // //   const scanDevices = async () => {
// // // // // // //     if (isScanning) return;

// // // // // // //     try {
// // // // // // //       setDevices([]);
// // // // // // //       setIsScanning(true);

// // // // // // //       bleManager.startDeviceScan(null, null, (error, device) => {
// // // // // // //         if (error) {
// // // // // // //           console.error('Scan error:', error);
// // // // // // //           setIsScanning(false);
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         // Filter for ESP32 devices only
// // // // // // //         if (device.name && device.name.includes('ESP32C6')) {
// // // // // // //           setDevices(prevDevices => {
// // // // // // //             const deviceExists = prevDevices.some(d => d.id === device.id);
// // // // // // //             return deviceExists ? prevDevices : [...prevDevices, device];
// // // // // // //           });
// // // // // // //         }
// // // // // // //       });

// // // // // // //       // Stop scanning after 5 seconds
// // // // // // //       setTimeout(() => {
// // // // // // //         bleManager.stopDeviceScan();
// // // // // // //         setIsScanning(false);
// // // // // // //       }, 5000);
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Scan initialization error:', error);
// // // // // // //       setIsScanning(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Connect to device with robust error handling
// // // // // // //   const connectToDevice = async (device) => {
// // // // // // //     if (connectionStatus === 'connecting') return;

// // // // // // //     try {
// // // // // // //       setConnectionStatus('connecting');

// // // // // // //       // Clean up any existing connection first
// // // // // // //       await cleanupConnections();

// // // // // // //       // Connect to device
// // // // // // //       const deviceConnected = await device.connect();
// // // // // // //       if (!isMounted.current) {
// // // // // // //         await deviceConnected.cancelConnection();
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       setConnectionStatus('discovering');

// // // // // // //       // Discover services and characteristics
// // // // // // //       await deviceConnected.discoverAllServicesAndCharacteristics();
// // // // // // //       setConnectionStatus('setting_up');

// // // // // // //       // Setup notifications with proper MTU size
// // // // // // //       await deviceConnected.requestMTU(185).catch(() => {});

// // // // // // //       const characteristic = await deviceConnected.readCharacteristicForService(
// // // // // // //         SERVICE_UUID,
// // // // // // //         CHARACTERISTIC_UUID
// // // // // // //       );

// // // // // // //       // Clear any existing subscription
// // // // // // //       if (monitorSubscription.current) {
// // // // // // //         monitorSubscription.current.remove();
// // // // // // //       }

// // // // // // //       // Create new subscription with proper error handling
// // // // // // //       monitorSubscription.current = characteristic.monitor((error, char) => {
// // // // // // //         if (error) {
// // // // // // //           console.error('Notification error:', error);
// // // // // // //           handleDisconnection();
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         try {
// // // // // // //           if (char?.value) {
// // // // // // //             const jsonString = atob(char.value); // Decode base64 from BLE
// // // // // // //             const value = JSON.parse(jsonString);
            
// // // // // // //             // Map the shortened mode identifiers to full names
// // // // // // //             const modeMap = {
// // // // // // //               'S': 'STEP_COUNTING',
// // // // // // //               'SS': 'SKATING_SPEED',
// // // // // // //               'SD': 'SKATING_DISTANCE',
// // // // // // //               'SF': 'SKATING_FREESTYLE'
// // // // // // //             };
            
// // // // // // //             if (isMounted.current) {
// // // // // // //               setData(prev => ({
// // // // // // //                 ...prev,
// // // // // // //                 ...value,
// // // // // // //                 mode: modeMap[value.m] || value.m
// // // // // // //               }));
// // // // // // //             }
// // // // // // //           }
// // // // // // //         } catch (e) {
// // // // // // //           console.error('Data parsing error:', e);
// // // // // // //         }
// // // // // // //       });

// // // // // // //       setConnectionStatus('connected');
// // // // // // //       console.log('BLE connection established successfully');
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Connection error:', error);
// // // // // // //       handleDisconnection();
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Send command with proper formatting
// // // // // // //   const sendCommand = async (command) => {
// // // // // // //     if (connectionStatus !== 'connected') {
// // // // // // //       console.warn('No active connection');
// // // // // // //       return false;
// // // // // // //     }

// // // // // // //     try {
// // // // // // //       // Format command as expected by ESP32 (uppercase, no extra whitespace)
// // // // // // //       const formattedCmd = String(command).trim().toUpperCase();
      
// // // // // // //       const device = await bleManager.devices([connectedDeviceId]);
// // // // // // //       await device.writeCharacteristicWithResponseForService(
// // // // // // //         SERVICE_UUID,
// // // // // // //         CHARACTERISTIC_UUID,
// // // // // // //         formattedCmd
// // // // // // //       );
      
// // // // // // //       console.log('Command sent successfully:', formattedCmd);
// // // // // // //       return true;
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Command error:', error);
// // // // // // //       handleDisconnection();
// // // // // // //       return false;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // UI rendering
// // // // // // //   const renderDeviceItem = ({ item }) => (
// // // // // // //     <TouchableOpacity
// // // // // // //       style={styles.deviceItem}
// // // // // // //       onPress={() => connectToDevice(item)}
// // // // // // //       disabled={connectionStatus === 'connecting'}
// // // // // // //     >
// // // // // // //       <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
// // // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // // //     </TouchableOpacity>
// // // // // // //   );

// // // // // // //   // Get full mode name for display
// // // // // // //   const getModeName = (mode) => {
// // // // // // //     switch(mode) {
// // // // // // //       case 'S': return 'Step Counting';
// // // // // // //       case 'SS': return 'Skating Speed';
// // // // // // //       case 'SD': return 'Skating Distance';
// // // // // // //       case 'SF': return 'Freestyle';
// // // // // // //       default: return mode;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <View style={styles.container}>
// // // // // // //       <Text style={styles.title}>Skating Band Controller</Text>

// // // // // // //       <View style={styles.statusContainer}>
// // // // // // //         <Text style={styles.statusText}>
// // // // // // //           Status: <Text style={styles[connectionStatus]}>
// // // // // // //             {connectionStatus.toUpperCase()}
// // // // // // //           </Text>
// // // // // // //         </Text>
// // // // // // //         <Text style={styles.statusText}>
// // // // // // //           Band: {bandActive ? 'ACTIVE' : 'INACTIVE'}
// // // // // // //         </Text>
// // // // // // //         <Text style={styles.statusText}>
// // // // // // //           Mode: {getModeName(data.mode)}
// // // // // // //         </Text>
// // // // // // //       </View>

// // // // // // //       <Button
// // // // // // //         title={isScanning ? 'SCANNING...' : 'SCAN DEVICES'}
// // // // // // //         onPress={scanDevices}
// // // // // // //         disabled={isScanning || connectionStatus === 'connected'}
// // // // // // //         color="#007AFF"
// // // // // // //       />

// // // // // // //       {connectionStatus === 'connecting' && (
// // // // // // //         <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
// // // // // // //       )}

// // // // // // //       {devices.length > 0 && connectionStatus === 'disconnected' && (
// // // // // // //         <View style={styles.deviceListContainer}>
// // // // // // //           <Text style={styles.sectionTitle}>AVAILABLE DEVICES</Text>
// // // // // // //           <FlatList
// // // // // // //             data={devices}
// // // // // // //             keyExtractor={(item) => item.id}
// // // // // // //             renderItem={renderDeviceItem}
// // // // // // //             contentContainerStyle={styles.deviceListContent}
// // // // // // //           />
// // // // // // //         </View>
// // // // // // //       )}

// // // // // // //       {connectionStatus === 'connected' && (
// // // // // // //         <View style={styles.controlPanel}>
// // // // // // //           <Button
// // // // // // //             title={bandActive ? 'TURN OFF' : 'TURN ON'}
// // // // // // //             onPress={async () => {
// // // // // // //               const success = await sendCommand(bandActive ? 'TURN_OFF' : 'TURN_ON');
// // // // // // //               if (success) setBandActive(!bandActive);
// // // // // // //             }}
// // // // // // //             color="#34C759"
// // // // // // //           />
// // // // // // //           <Button
// // // // // // //             title="DISCONNECT"
// // // // // // //             onPress={cleanupConnections}
// // // // // // //             color="#FF3B30"
// // // // // // //           />
// // // // // // //         </View>
// // // // // // //       )}

// // // // // // //       <View style={styles.dataContainer}>
// // // // // // //         <Text style={styles.sectionTitle}>CURRENT STATS</Text>
        
// // // // // // //         <View style={styles.dataRow}>
// // // // // // //           <Text>Steps:</Text>
// // // // // // //           <Text style={styles.dataValue}>{data.steps}</Text>
// // // // // // //         </View>
        
// // // // // // //         <View style={styles.dataRow}>
// // // // // // //           <Text>Walking Distance:</Text>
// // // // // // //           <Text style={styles.dataValue}>{data.walking_dist.toFixed(1)} m</Text>
// // // // // // //         </View>
        
// // // // // // //         <View style={styles.dataRow}>
// // // // // // //           <Text>Strides:</Text>
// // // // // // //           <Text style={styles.dataValue}>{data.strides}</Text>
// // // // // // //         </View>
        
// // // // // // //         <View style={styles.dataRow}>
// // // // // // //           <Text>Skating Distance:</Text>
// // // // // // //           <Text style={styles.dataValue}>{data.skating_dist.toFixed(1)} m</Text>
// // // // // // //         </View>
        
// // // // // // //         <View style={styles.dataRow}>
// // // // // // //           <Text>Speed:</Text>
// // // // // // //           <Text style={styles.dataValue}>{data.speed.toFixed(1)} m/s</Text>
// // // // // // //         </View>
        
// // // // // // //         <View style={styles.dataRow}>
// // // // // // //           <Text>Laps:</Text>
// // // // // // //           <Text style={styles.dataValue}>{data.laps}</Text>
// // // // // // //         </View>
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // };

// // // // // // // // Styles
// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     padding: 16,
// // // // // // //     backgroundColor: '#F5F5F5',
// // // // // // //   },
// // // // // // //   title: {
// // // // // // //     fontSize: 24,
// // // // // // //     fontWeight: 'bold',
// // // // // // //     marginBottom: 20,
// // // // // // //     textAlign: 'center',
// // // // // // //     color: '#333',
// // // // // // //   },
// // // // // // //   statusContainer: {
// // // // // // //     marginBottom: 20,
// // // // // // //     padding: 16,
// // // // // // //     backgroundColor: '#FFF',
// // // // // // //     borderRadius: 8,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   statusText: {
// // // // // // //     fontSize: 16,
// // // // // // //     marginBottom: 4,
// // // // // // //   },
// // // // // // //   connecting: {
// // // // // // //     color: '#FF9500',
// // // // // // //     fontWeight: 'bold',
// // // // // // //   },
// // // // // // //   connected: {
// // // // // // //     color: '#34C759',
// // // // // // //     fontWeight: 'bold',
// // // // // // //   },
// // // // // // //   disconnected: {
// // // // // // //     color: '#FF3B30',
// // // // // // //     fontWeight: 'bold',
// // // // // // //   },
// // // // // // //   deviceListContainer: {
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   sectionTitle: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: 'bold',
// // // // // // //     marginBottom: 8,
// // // // // // //     color: '#555',
// // // // // // //   },
// // // // // // //   deviceItem: {
// // // // // // //     padding: 16,
// // // // // // //     marginBottom: 8,
// // // // // // //     backgroundColor: '#FFF',
// // // // // // //     borderRadius: 8,
// // // // // // //     elevation: 1,
// // // // // // //   },
// // // // // // //   deviceName: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   deviceId: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#777',
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   deviceListContent: {
// // // // // // //     paddingBottom: 8,
// // // // // // //   },
// // // // // // //   controlPanel: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     marginBottom: 16,
// // // // // // //     padding: 16,
// // // // // // //     backgroundColor: '#FFF',
// // // // // // //     borderRadius: 8,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   dataContainer: {
// // // // // // //     padding: 16,
// // // // // // //     backgroundColor: '#FFF',
// // // // // // //     borderRadius: 8,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   dataRow: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     marginVertical: 6,
// // // // // // //   },
// // // // // // //   dataValue: {
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   loader: {
// // // // // // //     marginVertical: 16,
// // // // // // //   },
// // // // // // // });

// // // // // // // export default SkateBandApp;

// // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // const App = () => {
// // // // // // // //   const [devices, setDevices] = useState([]);
// // // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);
// // // // // // // //   const [bandActive, setBandActive] = useState(false);
// // // // // // // //   const [data, setData] = useState({
// // // // // // // //     mode: 'STEP_COUNTING',
// // // // // // // //     steps: 0,
// // // // // // // //     walking_dist: 0,
// // // // // // // //     strides: 0,
// // // // // // // //     skating_dist: 0,
// // // // // // // //     speed: 0,
// // // // // // // //     laps: 0
// // // // // // // //   });
// // // // // // // //   const [isConnecting, setIsConnecting] = useState(false);
// // // // // // // //   const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
// // // // // // // //   const bleManager = useRef(new BleManager()).current;
// // // // // // // //   const monitorSubscription = useRef(null);

// // // // // // // //   // Handle disconnections and cleanup
// // // // // // // //   useEffect(() => {
// // // // // // // //     const disconnectSubscription = bleManager.onDeviceDisconnected((deviceId, error) => {
// // // // // // // //       if (connectedDevice && deviceId === connectedDevice.id) {
// // // // // // // //         console.log('Device disconnected:', error);
// // // // // // // //         handleDisconnection();
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     return () => {
// // // // // // // //       disconnectSubscription.remove();
// // // // // // // //       cleanupConnections();
// // // // // // // //     };
// // // // // // // //   }, [connectedDevice]);

// // // // // // // //   const cleanupConnections = async () => {
// // // // // // // //     try {
// // // // // // // //       if (monitorSubscription.current) {
// // // // // // // //         monitorSubscription.current.remove();
// // // // // // // //         monitorSubscription.current = null;
// // // // // // // //       }
// // // // // // // //       if (connectedDevice) {
// // // // // // // //         await bleManager.cancelDeviceConnection(connectedDevice.id).catch(() => {});
// // // // // // // //       }
// // // // // // // //       setConnectedDevice(null);
// // // // // // // //       setBandActive(false);
// // // // // // // //       setConnectionStatus('disconnected');
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Cleanup error:', error);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleDisconnection = () => {
// // // // // // // //     Alert.alert('Disconnected', 'The device was disconnected');
// // // // // // // //     cleanupConnections();
// // // // // // // //   };

// // // // // // // //   // Scan for BLE devices
// // // // // // // //   const scanDevices = async () => {
// // // // // // // //     try {
// // // // // // // //       setDevices([]);
// // // // // // // //       setIsScanning(true);
      
// // // // // // // //       bleManager.startDeviceScan(null, null, (error, device) => {
// // // // // // // //         if (error) {
// // // // // // // //           console.error('Scan error:', error);
// // // // // // // //           setIsScanning(false);
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         if (device.name && device.name.includes('ESP32C6')) {
// // // // // // // //           setDevices(prevDevices => {
// // // // // // // //             const deviceExists = prevDevices.some(d => d.id === device.id);
// // // // // // // //             return deviceExists ? prevDevices : [...prevDevices, device];
// // // // // // // //           });
// // // // // // // //         }
// // // // // // // //       });

// // // // // // // //       setTimeout(() => {
// // // // // // // //         bleManager.stopDeviceScan();
// // // // // // // //         setIsScanning(false);
// // // // // // // //       }, 5000);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Scan initialization error:', error);
// // // // // // // //       setIsScanning(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Connect to a specific device
// // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // //     if (isConnecting) return;
    
// // // // // // // //     setIsConnecting(true);
// // // // // // // //     setConnectionStatus('connecting');
    
// // // // // // // //     try {
// // // // // // // //       // Cancel any existing connection first
// // // // // // // //       await bleManager.cancelDeviceConnection(device.id).catch(() => {});
      
// // // // // // // //       const deviceConnected = await device.connect();
// // // // // // // //       setConnectedDevice(deviceConnected);
// // // // // // // //       setConnectionStatus('discovering');
      
// // // // // // // //       await deviceConnected.discoverAllServicesAndCharacteristics();
      
// // // // // // // //       // Setup notifications - ensure we're using the correct types
// // // // // // // //       const characteristic = await deviceConnected.readCharacteristicForService(
// // // // // // // //         SERVICE_UUID,
// // // // // // // //         CHARACTERISTIC_UUID
// // // // // // // //       );
      
// // // // // // // //       // Clear any existing subscription
// // // // // // // //       if (monitorSubscription.current) {
// // // // // // // //         monitorSubscription.current.remove();
// // // // // // // //       }
      
// // // // // // // //       monitorSubscription.current = characteristic.monitor((error, char) => {
// // // // // // // //         if (error) {
// // // // // // // //           console.error('Notification error:', error);
// // // // // // // //           handleDisconnection();
// // // // // // // //           return;
// // // // // // // //         }
        
// // // // // // // //         if (char?.value) {
// // // // // // // //           try {
// // // // // // // //             // Ensure we're passing a string, not an object
// // // // // // // //             const value = JSON.parse(char.value);
// // // // // // // //             setData(prev => ({ ...prev, ...value }));
// // // // // // // //           } catch (e) {
// // // // // // // //             console.error('Error parsing data:', e);
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //       });
      
// // // // // // // //       setConnectionStatus('connected');
// // // // // // // //       console.log('Connected and notifications set up');
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Connection error:', error);
// // // // // // // //       handleDisconnection();
// // // // // // // //     } finally {
// // // // // // // //       setIsConnecting(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Disconnect from device
// // // // // // // //   const disconnectDevice = async () => {
// // // // // // // //     try {
// // // // // // // //       await cleanupConnections();
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Disconnection error:', error);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Send command to device with retry logic
// // // // // // // //   const sendCommand = async (command, retries = 3) => {
// // // // // // // //     if (!connectedDevice) {
// // // // // // // //       console.warn('No device connected');
// // // // // // // //       return false;
// // // // // // // //     }
    
// // // // // // // //     try {
// // // // // // // //       // Ensure command is a string
// // // // // // // //       const commandString = String(command);
// // // // // // // //       await connectedDevice.writeCharacteristicWithResponseForService(
// // // // // // // //         SERVICE_UUID,
// // // // // // // //         CHARACTERISTIC_UUID,
// // // // // // // //         commandString
// // // // // // // //       );
// // // // // // // //       console.log('Command sent successfully:', commandString);
// // // // // // // //       return true;
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Command error:', error);
// // // // // // // //       if (retries > 0) {
// // // // // // // //         console.log(`Retrying command (${retries} attempts left)`);
// // // // // // // //         await new Promise(resolve => setTimeout(resolve, 300));
// // // // // // // //         return sendCommand(command, retries - 1);
// // // // // // // //       }
// // // // // // // //       handleDisconnection();
// // // // // // // //       return false;
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Turn band on/off with confirmation
// // // // // // // //   const toggleBand = async () => {
// // // // // // // //     const command = bandActive ? 'TURN_OFF' : 'TURN_ON';
// // // // // // // //     const success = await sendCommand(command);
    
// // // // // // // //     if (success) {
// // // // // // // //       setBandActive(!bandActive);
// // // // // // // //     } else {
// // // // // // // //       Alert.alert('Error', 'Failed to send command to device');
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const renderDeviceItem = ({ item }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       style={styles.deviceItem}
// // // // // // // //       onPress={() => connectToDevice(item)}
// // // // // // // //       disabled={isConnecting}
// // // // // // // //     >
// // // // // // // //       <Text style={styles.deviceText}>{item.name || 'Unknown Device'}</Text>
// // // // // // // //       <Text style={styles.deviceId}>{item.id}</Text>
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <View style={styles.container}>
// // // // // // // //       <Text style={styles.title}>Skating Band Controller</Text>
      
// // // // // // // //       <View style={styles.statusContainer}>
// // // // // // // //         <Text>Status: {connectionStatus}</Text>
// // // // // // // //         <Text>Band: {bandActive ? 'ON' : 'OFF'}</Text>
// // // // // // // //       </View>
      
// // // // // // // //       <Button
// // // // // // // //         title={isScanning ? 'Scanning...' : 'Scan for Devices'}
// // // // // // // //         onPress={scanDevices}
// // // // // // // //         disabled={isScanning || connectedDevice}
// // // // // // // //       />
      
// // // // // // // //       {isConnecting && <ActivityIndicator style={styles.loader} size="large" />}
      
// // // // // // // //       {devices.length > 0 && (
// // // // // // // //         <View style={styles.deviceList}>
// // // // // // // //           <Text style={styles.subtitle}>Available Devices:</Text>
// // // // // // // //           <FlatList
// // // // // // // //             data={devices}
// // // // // // // //             keyExtractor={(item) => item.id}
// // // // // // // //             renderItem={renderDeviceItem}
// // // // // // // //             contentContainerStyle={styles.listContent}
// // // // // // // //           />
// // // // // // // //         </View>
// // // // // // // //       )}
      
// // // // // // // //       {connectedDevice && (
// // // // // // // //         <View style={styles.controlPanel}>
// // // // // // // //           <Button
// // // // // // // //             title={bandActive ? 'Turn OFF' : 'Turn ON'}
// // // // // // // //             onPress={toggleBand}
// // // // // // // //             disabled={isConnecting}
// // // // // // // //           />
// // // // // // // //           <Button
// // // // // // // //             title="Disconnect"
// // // // // // // //             onPress={disconnectDevice}
// // // // // // // //             color="red"
// // // // // // // //             disabled={isConnecting}
// // // // // // // //           />
// // // // // // // //         </View>
// // // // // // // //       )}
      
// // // // // // // //       <View style={styles.dataContainer}>
// // // // // // // //         <Text style={styles.subtitle}>Current Data:</Text>
// // // // // // // //         <Text>Mode: {data.mode}</Text>
// // // // // // // //         <Text>Steps: {data.steps}</Text>
// // // // // // // //         <Text>Walking Distance: {data.walking_dist.toFixed(2)} m</Text>
// // // // // // // //         <Text>Strides: {data.strides}</Text>
// // // // // // // //         <Text>Skating Distance: {data.skating_dist.toFixed(2)} m</Text>
// // // // // // // //         <Text>Speed: {data.speed.toFixed(2)} m/s</Text>
// // // // // // // //         <Text>Laps: {data.laps}</Text>
// // // // // // // //       </View>
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: {
// // // // // // // //     flex: 1,
// // // // // // // //     padding: 20,
// // // // // // // //     backgroundColor: '#f5f5f5',
// // // // // // // //   },
// // // // // // // //   title: {
// // // // // // // //     fontSize: 22,
// // // // // // // //     fontWeight: 'bold',
// // // // // // // //     marginBottom: 20,
// // // // // // // //     textAlign: 'center',
// // // // // // // //     color: '#333',
// // // // // // // //   },
// // // // // // // //   statusContainer: {
// // // // // // // //     marginBottom: 20,
// // // // // // // //     padding: 10,
// // // // // // // //     backgroundColor: '#fff',
// // // // // // // //     borderRadius: 8,
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   subtitle: {
// // // // // // // //     fontWeight: 'bold',
// // // // // // // //     marginTop: 10,
// // // // // // // //     marginBottom: 5,
// // // // // // // //     fontSize: 16,
// // // // // // // //     color: '#444',
// // // // // // // //   },
// // // // // // // //   deviceList: {
// // // // // // // //     marginTop: 20,
// // // // // // // //     marginBottom: 20,
// // // // // // // //     maxHeight: 200,
// // // // // // // //   },
// // // // // // // //   listContent: {
// // // // // // // //     paddingBottom: 10,
// // // // // // // //   },
// // // // // // // //   deviceItem: {
// // // // // // // //     padding: 15,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#ddd',
// // // // // // // //     backgroundColor: '#fff',
// // // // // // // //   },
// // // // // // // //   deviceText: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     color: '#333',
// // // // // // // //   },
// // // // // // // //   deviceId: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#666',
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   controlPanel: {
// // // // // // // //     marginTop: 20,
// // // // // // // //     marginBottom: 20,
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-around',
// // // // // // // //     backgroundColor: '#fff',
// // // // // // // //     padding: 15,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   dataContainer: {
// // // // // // // //     marginTop: 20,
// // // // // // // //     padding: 15,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#ddd',
// // // // // // // //     borderRadius: 8,
// // // // // // // //     backgroundColor: '#fff',
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   loader: {
// // // // // // // //     marginVertical: 20,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // // export default App;
// // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
// // // // // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // const App = () => {
// // // // // // // // //   const [devices, setDevices] = useState([]);
// // // // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);
// // // // // // // // //   const [bandActive, setBandActive] = useState(false);
// // // // // // // // //   const [data, setData] = useState({
// // // // // // // // //     mode: 'STEP_COUNTING',
// // // // // // // // //     steps: 0,
// // // // // // // // //     walking_dist: 0,
// // // // // // // // //     strides: 0,
// // // // // // // // //     skating_dist: 0,
// // // // // // // // //     speed: 0,
// // // // // // // // //     laps: 0
// // // // // // // // //   });
// // // // // // // // //   const [isConnecting, setIsConnecting] = useState(false);
  
// // // // // // // // //   const bleManager = useRef(new BleManager()).current;
// // // // // // // // //   const monitorSubscription = useRef(null);

// // // // // // // // //   // Handle disconnections
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const subscription = bleManager.onDeviceDisconnected(deviceId => {
// // // // // // // // //       if (connectedDevice && deviceId === connectedDevice.id) {
// // // // // // // // //         handleDisconnection();
// // // // // // // // //       }
// // // // // // // // //     });

// // // // // // // // //     return () => {
// // // // // // // // //       subscription.remove();
// // // // // // // // //       cleanupConnections();
// // // // // // // // //     };
// // // // // // // // //   }, [connectedDevice]);

// // // // // // // // //   const cleanupConnections = () => {
// // // // // // // // //     if (monitorSubscription.current) {
// // // // // // // // //       monitorSubscription.current.remove();
// // // // // // // // //       monitorSubscription.current = null;
// // // // // // // // //     }
// // // // // // // // //     if (connectedDevice) {
// // // // // // // // //       bleManager.cancelDeviceConnection(connectedDevice.id).catch(() => {});
// // // // // // // // //       setConnectedDevice(null);
// // // // // // // // //     }
// // // // // // // // //     setBandActive(false);
// // // // // // // // //   };

// // // // // // // // //   const handleDisconnection = () => {
// // // // // // // // //     Alert.alert('Disconnected', 'The device was disconnected');
// // // // // // // // //     cleanupConnections();
// // // // // // // // //   };

// // // // // // // // //   // Scan for BLE devices
// // // // // // // // //   const scanDevices = async () => {
// // // // // // // // //     try {
// // // // // // // // //       setDevices([]);
// // // // // // // // //       setIsScanning(true);
      
// // // // // // // // //       bleManager.startDeviceScan(null, null, (error, device) => {
// // // // // // // // //         if (error) {
// // // // // // // // //           console.error('Scan error:', error);
// // // // // // // // //           setIsScanning(false);
// // // // // // // // //           return;
// // // // // // // // //         }

// // // // // // // // //         if (device.name && device.name.includes('ESP32C6')) {
// // // // // // // // //           setDevices(prevDevices => {
// // // // // // // // //             const deviceExists = prevDevices.some(d => d.id === device.id);
// // // // // // // // //             return deviceExists ? prevDevices : [...prevDevices, device];
// // // // // // // // //           });
// // // // // // // // //         }
// // // // // // // // //       });

// // // // // // // // //       setTimeout(() => {
// // // // // // // // //         bleManager.stopDeviceScan();
// // // // // // // // //         setIsScanning(false);
// // // // // // // // //       }, 5000);
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Scan initialization error:', error);
// // // // // // // // //       setIsScanning(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Connect to a specific device
// // // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // // //     if (isConnecting) return;
    
// // // // // // // // //     setIsConnecting(true);
// // // // // // // // //     try {
// // // // // // // // //       // Cancel any existing connection first
// // // // // // // // //       await bleManager.cancelDeviceConnection(device.id).catch(() => {});
      
// // // // // // // // //       const deviceConnected = await device.connect();
// // // // // // // // //       setConnectedDevice(deviceConnected);
      
// // // // // // // // //       await deviceConnected.discoverAllServicesAndCharacteristics();
      
// // // // // // // // //       // Setup notifications
// // // // // // // // //       const characteristic = await deviceConnected.readCharacteristicForService(
// // // // // // // // //         SERVICE_UUID,
// // // // // // // // //         CHARACTERISTIC_UUID
// // // // // // // // //       );
      
// // // // // // // // //       monitorSubscription.current = characteristic.monitor((error, characteristic) => {
// // // // // // // // //         if (error) {
// // // // // // // // //           console.error('Notification error:', error);
// // // // // // // // //           handleDisconnection();
// // // // // // // // //           return;
// // // // // // // // //         }
        
// // // // // // // // //         if (characteristic?.value) {
// // // // // // // // //           try {
// // // // // // // // //             const value = JSON.parse(characteristic.value);
// // // // // // // // //             setData(value);
// // // // // // // // //           } catch (e) {
// // // // // // // // //             console.error('Error parsing data:', e);
// // // // // // // // //           }
// // // // // // // // //         }
// // // // // // // // //       });
      
// // // // // // // // //       console.log('Connected and notifications set up');
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Connection error:', error);
// // // // // // // // //       handleDisconnection();
// // // // // // // // //     } finally {
// // // // // // // // //       setIsConnecting(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Disconnect from device
// // // // // // // // //   const disconnectDevice = async () => {
// // // // // // // // //     try {
// // // // // // // // //       await cleanupConnections();
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Disconnection error:', error);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Send command to device with retry logic
// // // // // // // // //   const sendCommand = async (command, retries = 3) => {
// // // // // // // // //     if (!connectedDevice) {
// // // // // // // // //       console.warn('No device connected');
// // // // // // // // //       return false;
// // // // // // // // //     }
    
// // // // // // // // //     try {
// // // // // // // // //       await connectedDevice.writeCharacteristicWithResponseForService(
// // // // // // // // //         SERVICE_UUID,
// // // // // // // // //         CHARACTERISTIC_UUID,
// // // // // // // // //         command
// // // // // // // // //       );
// // // // // // // // //       console.log('Command sent successfully:', command);
// // // // // // // // //       return true;
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Command error:', error);
// // // // // // // // //       if (retries > 0) {
// // // // // // // // //         console.log(`Retrying command (${retries} attempts left)`);
// // // // // // // // //         await new Promise(resolve => setTimeout(resolve, 300));
// // // // // // // // //         return sendCommand(command, retries - 1);
// // // // // // // // //       }
// // // // // // // // //       handleDisconnection();
// // // // // // // // //       return false;
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Turn band on/off with confirmation
// // // // // // // // //   const toggleBand = async () => {
// // // // // // // // //     const command = bandActive ? 'TURN_OFF' : 'TURN_ON';
// // // // // // // // //     const success = await sendCommand(command);
    
// // // // // // // // //     if (success) {
// // // // // // // // //       setBandActive(!bandActive);
// // // // // // // // //     } else {
// // // // // // // // //       Alert.alert('Error', 'Failed to send command to device');
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <Text style={styles.title}>Skating Band Controller</Text>
      
// // // // // // // // //       <View style={styles.statusContainer}>
// // // // // // // // //         <Text>Status: {connectedDevice ? 'Connected' : 'Disconnected'}</Text>
// // // // // // // // //         <Text>Band: {bandActive ? 'ON' : 'OFF'}</Text>
// // // // // // // // //       </View>
      
// // // // // // // // //       <Button
// // // // // // // // //         title={isScanning ? 'Scanning...' : 'Scan for Devices'}
// // // // // // // // //         onPress={scanDevices}
// // // // // // // // //         disabled={isScanning || connectedDevice}
// // // // // // // // //       />
      
// // // // // // // // //       {devices.length > 0 && (
// // // // // // // // //         <View style={styles.deviceList}>
// // // // // // // // //           <Text style={styles.subtitle}>Available Devices:</Text>
// // // // // // // // //           <FlatList
// // // // // // // // //             data={devices}
// // // // // // // // //             keyExtractor={(item) => item.id}
// // // // // // // // //             renderItem={({ item }) => (
// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 style={styles.deviceItem}
// // // // // // // // //                 onPress={() => connectToDevice(item)}
// // // // // // // // //                 disabled={isConnecting}
// // // // // // // // //               >
// // // // // // // // //                 <Text>{item.name || 'Unknown Device'} - {item.id}</Text>
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             )}
// // // // // // // // //           />
// // // // // // // // //         </View>
// // // // // // // // //       )}
      
// // // // // // // // //       {connectedDevice && (
// // // // // // // // //         <View style={styles.controlPanel}>
// // // // // // // // //           <Button
// // // // // // // // //             title={bandActive ? 'Turn OFF' : 'Turn ON'}
// // // // // // // // //             onPress={toggleBand}
// // // // // // // // //             disabled={isConnecting}
// // // // // // // // //           />
// // // // // // // // //           <Button
// // // // // // // // //             title="Disconnect"
// // // // // // // // //             onPress={disconnectDevice}
// // // // // // // // //             color="red"
// // // // // // // // //             disabled={isConnecting}
// // // // // // // // //           />
// // // // // // // // //         </View>
// // // // // // // // //       )}
      
// // // // // // // // //       <View style={styles.dataContainer}>
// // // // // // // // //         <Text style={styles.subtitle}>Current Data:</Text>
// // // // // // // // //         <Text>Mode: {data.mode}</Text>
// // // // // // // // //         <Text>Steps: {data.steps}</Text>
// // // // // // // // //         <Text>Walking Distance: {data.walking_dist.toFixed(2)} m</Text>
// // // // // // // // //         <Text>Strides: {data.strides}</Text>
// // // // // // // // //         <Text>Skating Distance: {data.skating_dist.toFixed(2)} m</Text>
// // // // // // // // //         <Text>Speed: {data.speed.toFixed(2)} m/s</Text>
// // // // // // // // //         <Text>Laps: {data.laps}</Text>
// // // // // // // // //       </View>
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     padding: 20,
// // // // // // // // //   },
// // // // // // // // //   title: {
// // // // // // // // //     fontSize: 20,
// // // // // // // // //     fontWeight: 'bold',
// // // // // // // // //     marginBottom: 20,
// // // // // // // // //     textAlign: 'center',
// // // // // // // // //   },
// // // // // // // // //   statusContainer: {
// // // // // // // // //     marginBottom: 20,
// // // // // // // // //   },
// // // // // // // // //   subtitle: {
// // // // // // // // //     fontWeight: 'bold',
// // // // // // // // //     marginTop: 10,
// // // // // // // // //     marginBottom: 5,
// // // // // // // // //   },
// // // // // // // // //   deviceList: {
// // // // // // // // //     marginTop: 20,
// // // // // // // // //     marginBottom: 20,
// // // // // // // // //     maxHeight: 200,
// // // // // // // // //   },
// // // // // // // // //   deviceItem: {
// // // // // // // // //     padding: 10,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: '#ccc',
// // // // // // // // //   },
// // // // // // // // //   controlPanel: {
// // // // // // // // //     marginTop: 20,
// // // // // // // // //     marginBottom: 20,
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-around',
// // // // // // // // //   },
// // // // // // // // //   dataContainer: {
// // // // // // // // //     marginTop: 20,
// // // // // // // // //     padding: 10,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: '#ccc',
// // // // // // // // //     borderRadius: 5,
// // // // // // // // //   },
// // // // // // // // // });

// // // // // // // // // export default App;
// // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
// // // // // // // // // // import { BleManager } from 'react-native-ble-plx';

// // // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // // const App = () => {
// // // // // // // // // //   const [devices, setDevices] = useState([]);
// // // // // // // // // //   const [isScanning, setIsScanning] = useState(false);
// // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);
// // // // // // // // // //   const [bandActive, setBandActive] = useState(false);
// // // // // // // // // //   const [data, setData] = useState({
// // // // // // // // // //     mode: 'STEP_COUNTING',
// // // // // // // // // //     steps: 0,
// // // // // // // // // //     walking_dist: 0,
// // // // // // // // // //     strides: 0,
// // // // // // // // // //     skating_dist: 0,
// // // // // // // // // //     speed: 0,
// // // // // // // // // //     laps: 0
// // // // // // // // // //   });
// // // // // // // // // //   const [bleManager] = useState(new BleManager());

// // // // // // // // // //   // Scan for BLE devices
// // // // // // // // // //   const scanDevices = () => {
// // // // // // // // // //     setDevices([]);
// // // // // // // // // //     setIsScanning(true);
    
// // // // // // // // // //     bleManager.startDeviceScan(null, null, (error, device) => {
// // // // // // // // // //       if (error) {
// // // // // // // // // //         console.error('Scan error:', error);
// // // // // // // // // //         setIsScanning(false);
// // // // // // // // // //         return;
// // // // // // // // // //       }

// // // // // // // // // //       // Only show devices with names
// // // // // // // // // //       if (device.name) {
// // // // // // // // // //         setDevices(prevDevices => {
// // // // // // // // // //           // Check if device already exists in the list
// // // // // // // // // //           const deviceExists = prevDevices.some(d => d.id === device.id);
// // // // // // // // // //           if (!deviceExists) {
// // // // // // // // // //             return [...prevDevices, device];
// // // // // // // // // //           }
// // // // // // // // // //           return prevDevices;
// // // // // // // // // //         });
// // // // // // // // // //       }
// // // // // // // // // //     });

// // // // // // // // // //     // Stop scanning after 5 seconds
// // // // // // // // // //     setTimeout(() => {
// // // // // // // // // //       bleManager.stopDeviceScan();
// // // // // // // // // //       setIsScanning(false);
// // // // // // // // // //     }, 5000);
// // // // // // // // // //   };

// // // // // // // // // //   // Connect to a specific device
// // // // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const deviceConnected = await device.connect();
// // // // // // // // // //       setConnectedDevice(deviceConnected);
      
// // // // // // // // // //       // Discover services and characteristics
// // // // // // // // // //       await deviceConnected.discoverAllServicesAndCharacteristics();
      
// // // // // // // // // //       // Setup notifications
// // // // // // // // // //       const characteristic = await deviceConnected.readCharacteristicForService(
// // // // // // // // // //         SERVICE_UUID,
// // // // // // // // // //         CHARACTERISTIC_UUID
// // // // // // // // // //       );
      
// // // // // // // // // //       characteristic.monitor((error, characteristic) => {
// // // // // // // // // //         if (error) {
// // // // // // // // // //           console.error('Notification error:', error);
// // // // // // // // // //           return;
// // // // // // // // // //         }
        
// // // // // // // // // //         if (characteristic?.value) {
// // // // // // // // // //           try {
// // // // // // // // // //             const value = JSON.parse(characteristic.value);
// // // // // // // // // //             setData(value);
// // // // // // // // // //             console.log('Received data:', value);
// // // // // // // // // //           } catch (e) {
// // // // // // // // // //             console.error('Error parsing data:', e);
// // // // // // // // // //           }
// // // // // // // // // //         }
// // // // // // // // // //       });
      
// // // // // // // // // //       console.log('Connected and set up notifications');
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error('Connection error:', error);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // Disconnect from device
// // // // // // // // // //   const disconnectDevice = async () => {
// // // // // // // // // //     if (connectedDevice) {
// // // // // // // // // //       try {
// // // // // // // // // //         await connectedDevice.cancelConnection();
// // // // // // // // // //         setConnectedDevice(null);
// // // // // // // // // //         setBandActive(false);
// // // // // // // // // //         console.log('Disconnected');
// // // // // // // // // //       } catch (error) {
// // // // // // // // // //         console.error('Disconnection error:', error);
// // // // // // // // // //       }
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // Send command to device
// // // // // // // // // //   const sendCommand = async (command) => {
// // // // // // // // // //     if (!connectedDevice) return;
    
// // // // // // // // // //     try {
// // // // // // // // // //       await connectedDevice.writeCharacteristicWithResponseForService(
// // // // // // // // // //         SERVICE_UUID,
// // // // // // // // // //         CHARACTERISTIC_UUID,
// // // // // // // // // //         command
// // // // // // // // // //       );
// // // // // // // // // //       console.log('Command sent:', command);
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error('Command error:', error);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // Turn band on/off
// // // // // // // // // //   const toggleBand = () => {
// // // // // // // // // //     if (bandActive) {
// // // // // // // // // //       sendCommand('TURN_OFF');
// // // // // // // // // //       setBandActive(false);
// // // // // // // // // //     } else {
// // // // // // // // // //       sendCommand('TURN_ON');
// // // // // // // // // //       setBandActive(true);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // Clean up on unmount
// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     return () => {
// // // // // // // // // //       bleManager.destroy();
// // // // // // // // // //     };
// // // // // // // // // //   }, []);

// // // // // // // // // //   return (
// // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // //       <Text style={styles.title}>Skating Band Controller</Text>
      
// // // // // // // // // //       <View style={styles.statusContainer}>
// // // // // // // // // //         <Text>Status: {connectedDevice ? 'Connected' : 'Disconnected'}</Text>
// // // // // // // // // //         <Text>Band: {bandActive ? 'ON' : 'OFF'}</Text>
// // // // // // // // // //       </View>
      
// // // // // // // // // //       <Button
// // // // // // // // // //         title={isScanning ? 'Scanning...' : 'Scan for Devices'}
// // // // // // // // // //         onPress={scanDevices}
// // // // // // // // // //         disabled={isScanning || connectedDevice}
// // // // // // // // // //       />
      
// // // // // // // // // //       {devices.length > 0 && (
// // // // // // // // // //         <View style={styles.deviceList}>
// // // // // // // // // //           <Text style={styles.subtitle}>Available Devices:</Text>
// // // // // // // // // //           <FlatList
// // // // // // // // // //             data={devices}
// // // // // // // // // //             keyExtractor={(item) => item.id}
// // // // // // // // // //             renderItem={({ item }) => (
// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 style={styles.deviceItem}
// // // // // // // // // //                 onPress={() => connectToDevice(item)}
// // // // // // // // // //               >
// // // // // // // // // //                 <Text>{item.name} - {item.id}</Text>
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             )}
// // // // // // // // // //           />
// // // // // // // // // //         </View>
// // // // // // // // // //       )}
      
// // // // // // // // // //       {connectedDevice && (
// // // // // // // // // //         <View style={styles.controlPanel}>
// // // // // // // // // //           <Button
// // // // // // // // // //             title={bandActive ? 'Turn OFF' : 'Turn ON'}
// // // // // // // // // //             onPress={toggleBand}
// // // // // // // // // //           />
// // // // // // // // // //           <Button
// // // // // // // // // //             title="Disconnect"
// // // // // // // // // //             onPress={disconnectDevice}
// // // // // // // // // //             color="red"
// // // // // // // // // //           />
// // // // // // // // // //         </View>
// // // // // // // // // //       )}
      
// // // // // // // // // //       <View style={styles.dataContainer}>
// // // // // // // // // //         <Text style={styles.subtitle}>Current Data:</Text>
// // // // // // // // // //         <Text>Mode: {data.mode}</Text>
// // // // // // // // // //         <Text>Steps: {data.steps}</Text>
// // // // // // // // // //         <Text>Walking Distance: {data.walking_dist.toFixed(2)} m</Text>
// // // // // // // // // //         <Text>Strides: {data.strides}</Text>
// // // // // // // // // //         <Text>Skating Distance: {data.skating_dist.toFixed(2)} m</Text>
// // // // // // // // // //         <Text>Speed: {data.speed.toFixed(2)} m/s</Text>
// // // // // // // // // //         <Text>Laps: {data.laps}</Text>
// // // // // // // // // //       </View>
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     padding: 20,
// // // // // // // // // //   },
// // // // // // // // // //   title: {
// // // // // // // // // //     fontSize: 20,
// // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // //     marginBottom: 20,
// // // // // // // // // //     textAlign: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   statusContainer: {
// // // // // // // // // //     marginBottom: 20,
// // // // // // // // // //   },
// // // // // // // // // //   subtitle: {
// // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // //     marginTop: 10,
// // // // // // // // // //     marginBottom: 5,
// // // // // // // // // //   },
// // // // // // // // // //   deviceList: {
// // // // // // // // // //     marginTop: 20,
// // // // // // // // // //     marginBottom: 20,
// // // // // // // // // //   },
// // // // // // // // // //   deviceItem: {
// // // // // // // // // //     padding: 10,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: '#ccc',
// // // // // // // // // //   },
// // // // // // // // // //   controlPanel: {
// // // // // // // // // //     marginTop: 20,
// // // // // // // // // //     marginBottom: 20,
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     justifyContent: 'space-around',
// // // // // // // // // //   },
// // // // // // // // // //   dataContainer: {
// // // // // // // // // //     marginTop: 20,
// // // // // // // // // //     padding: 10,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: '#ccc',
// // // // // // // // // //     borderRadius: 5,
// // // // // // // // // //   },
// // // // // // // // // // });

// // // // // // // // // // export default App;
// // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
// // // // // // // // // // // import { BleManager } from 'react-nrative-ble-plx';

// // // // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // // // const App = () => {
// // // // // // // // // // //   const [isConnected, setIsConnected] = useState(false);
// // // // // // // // // // //   const [device, setDevice] = useState(null);
// // // // // // // // // // //   const [bandActive, setBandActive] = useState(false);
// // // // // // // // // // //   const [data, setData] = useState({
// // // // // // // // // // //     mode: 'STEP_COUNTING',
// // // // // // // // // // //     steps: 0,
// // // // // // // // // // //     walking_dist: 0,
// // // // // // // // // // //     strides: 0,
// // // // // // // // // // //     skating_dist: 0,
// // // // // // // // // // //     speed: 0,
// // // // // // // // // // //     laps: 0
// // // // // // // // // // //   });
// // // // // // // // // // //   const [wheelDiameter, setWheelDiameter] = useState(90); // in mm
// // // // // // // // // // //   const [trackLength, setTrackLength] = useState(100); // in meters
// // // // // // // // // // //   const [bleManager] = useState(new BleManager());

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     const subscription = bleManager.onStateChange((state) => {
// // // // // // // // // // //       if (state === 'PoweredOn') {
// // // // // // // // // // //         scanAndConnect();
// // // // // // // // // // //       }
// // // // // // // // // // //     }, true);

// // // // // // // // // // //     return () => {
// // // // // // // // // // //       subscription.remove();
// // // // // // // // // // //       bleManager.destroy();
// // // // // // // // // // //     };
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   const scanAndConnect = () => {
// // // // // // // // // // //     bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
// // // // // // // // // // //       if (error) {
// // // // // // // // // // //         console.error(error);
// // // // // // // // // // //         return;
// // // // // // // // // // //       }

// // // // // // // // // // //       if (scannedDevice.name === 'ESP32C6_SkatingBand') {
// // // // // // // // // // //         bleManager.stopDeviceScan();
// // // // // // // // // // //         connectToDevice(scannedDevice);
// // // // // // // // // // //       }
// // // // // // // // // // //     });
// // // // // // // // // // //   };

// // // // // // // // // // //   const connectToDevice = async (device) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const connectedDevice = await device.connect();
// // // // // // // // // // //       setIsConnected(true);
// // // // // // // // // // //       setDevice(connectedDevice);
      
// // // // // // // // // // //       await connectedDevice.discoverAllServicesAndCharacteristics();
// // // // // // // // // // //       startNotification(connectedDevice);
      
// // // // // // // // // // //       console.log('Connected to device');
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error('Connection error:', error);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const startNotification = async (device) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const characteristic = await device.readCharacteristicForService(
// // // // // // // // // // //         SERVICE_UUID,
// // // // // // // // // // //         CHARACTERISTIC_UUID
// // // // // // // // // // //       );
      
// // // // // // // // // // //       characteristic.monitor((error, characteristic) => {
// // // // // // // // // // //         if (error) {
// // // // // // // // // // //           console.error('Notification error:', error);
// // // // // // // // // // //           return;
// // // // // // // // // // //         }
        
// // // // // // // // // // //         if (characteristic?.value) {
// // // // // // // // // // //           const value = JSON.parse(characteristic.value);
// // // // // // // // // // //           setData(value);
// // // // // // // // // // //           console.log('Received:', value);
// // // // // // // // // // //         }
// // // // // // // // // // //       });
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error('Notification setup error:', error);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const sendCommand = async (command) => {
// // // // // // // // // // //     if (!device) return;
    
// // // // // // // // // // //     try {
// // // // // // // // // // //       await device.writeCharacteristicWithResponseForService(
// // // // // // // // // // //         SERVICE_UUID,
// // // // // // // // // // //         CHARACTERISTIC_UUID,
// // // // // // // // // // //         command
// // // // // // // // // // //       );
// // // // // // // // // // //       console.log('Command sent:', command);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error('Command error:', error);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const turnOn = () => {
// // // // // // // // // // //     sendCommand('TURN_ON');
// // // // // // // // // // //     setBandActive(true);
// // // // // // // // // // //   };

// // // // // // // // // // //   const turnOff = () => {
// // // // // // // // // // //     sendCommand('TURN_OFF');
// // // // // // // // // // //     setBandActive(false);
// // // // // // // // // // //   };

// // // // // // // // // // //   const setConfig = () => {
// // // // // // // // // // //     const command = `SET_CONFIG SKATE ${wheelDiameter} ${trackLength}`;
// // // // // // // // // // //     sendCommand(command);
// // // // // // // // // // //   };

// // // // // // // // // // //   const setMode = (mode) => {
// // // // // // // // // // //     sendCommand(`SET_MODE ${mode}`);
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // //       <Text style={styles.title}>Skating Band Controller</Text>
      
// // // // // // // // // // //       <Text>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
// // // // // // // // // // //       <Text>Band: {bandActive ? 'ON' : 'OFF'}</Text>
      
// // // // // // // // // // //       <View style={styles.buttonContainer}>
// // // // // // // // // // //         <Button title="Turn ON" onPress={turnOn} disabled={!isConnected || bandActive} />
// // // // // // // // // // //         <Button title="Turn OFF" onPress={turnOff} disabled={!isConnected || !bandActive} />
// // // // // // // // // // //       </View>
      
// // // // // // // // // // //       <View style={styles.section}>
// // // // // // // // // // //         <Text style={styles.sectionTitle}>Current Data</Text>
// // // // // // // // // // //         <Text>Mode: {data.mode}</Text>
// // // // // // // // // // //         <Text>Steps: {data.steps}</Text>
// // // // // // // // // // //         <Text>Walking Distance: {data.walking_dist.toFixed(2)} m</Text>
// // // // // // // // // // //         <Text>Strides: {data.strides}</Text>
// // // // // // // // // // //         <Text>Skating Distance: {data.skating_dist.toFixed(2)} m</Text>
// // // // // // // // // // //         <Text>Speed: {data.speed.toFixed(2)} m/s</Text>
// // // // // // // // // // //         <Text>Laps: {data.laps}</Text>
// // // // // // // // // // //       </View>
      
// // // // // // // // // // //       <View style={styles.section}>
// // // // // // // // // // //         <Text style={styles.sectionTitle}>Configuration</Text>
        
// // // // // // // // // // //         <View style={styles.inputRow}>
// // // // // // // // // // //           <Text>Wheel Diameter (mm):</Text>
// // // // // // // // // // //           <TextInput
// // // // // // // // // // //             style={styles.input}
// // // // // // // // // // //             keyboardType="numeric"
// // // // // // // // // // //             value={wheelDiameter.toString()}
// // // // // // // // // // //             onChangeText={(text) => setWheelDiameter(parseInt(text) || 0)}
// // // // // // // // // // //           />
// // // // // // // // // // //         </View>
        
// // // // // // // // // // //         <View style={styles.inputRow}>
// // // // // // // // // // //           <Text>Track Length (m):</Text>
// // // // // // // // // // //           <TextInput
// // // // // // // // // // //             style={styles.input}
// // // // // // // // // // //             keyboardType="numeric"
// // // // // // // // // // //             value={trackLength.toString()}
// // // // // // // // // // //             onChangeText={(text) => setTrackLength(parseFloat(text) || 0)}
// // // // // // // // // // //           />
// // // // // // // // // // //         </View>
        
// // // // // // // // // // //         <Button title="Update Config" onPress={setConfig} disabled={!isConnected} />
// // // // // // // // // // //       </View>
      
// // // // // // // // // // //       <View style={styles.section}>
// // // // // // // // // // //         <Text style={styles.sectionTitle}>Mode Selection</Text>
// // // // // // // // // // //         <View style={styles.buttonContainer}>
// // // // // // // // // // //           <Button title="Step Counting" onPress={() => setMode('STEP_COUNTING')} disabled={!isConnected} />
// // // // // // // // // // //           <Button title="Skating Speed" onPress={() => setMode('SKATING_SPEED')} disabled={!isConnected} />
// // // // // // // // // // //         </View>
// // // // // // // // // // //         <View style={styles.buttonContainer}>
// // // // // // // // // // //           <Button title="Skating Distance" onPress={() => setMode('SKATING_DISTANCE')} disabled={!isConnected} />
// // // // // // // // // // //           <Button title="Freestyle" onPress={() => setMode('SKATING_FREESTYLE')} disabled={!isConnected} />
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </View>
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     padding: 20,
// // // // // // // // // // //   },
// // // // // // // // // // //   title: {
// // // // // // // // // // //     fontSize: 20,
// // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // //     marginBottom: 20,
// // // // // // // // // // //   },
// // // // // // // // // // //   section: {
// // // // // // // // // // //     marginVertical: 10,
// // // // // // // // // // //     padding: 10,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: '#ccc',
// // // // // // // // // // //     borderRadius: 5,
// // // // // // // // // // //   },
// // // // // // // // // // //   sectionTitle: {
// // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // //     marginBottom: 5,
// // // // // // // // // // //   },
// // // // // // // // // // //   buttonContainer: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-around',
// // // // // // // // // // //     marginVertical: 10,
// // // // // // // // // // //   },
// // // // // // // // // // //   inputRow: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     marginVertical: 5,
// // // // // // // // // // //   },
// // // // // // // // // // //   input: {
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: '#ccc',
// // // // // // // // // // //     borderRadius: 5,
// // // // // // // // // // //     padding: 5,
// // // // // // // // // // //     marginLeft: 10,
// // // // // // // // // // //     width: 100,
// // // // // // // // // // //   },
// // // // // // // // // // // });

// // // // // // // // // // // export default App;
// // // // // // // // // // // // // File: App.js
// // // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // // import { SafeAreaView } from 'react-native';
// // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';

// // // // // // // // // // // // export default function App() {
// // // // // // // // // // // //   const [currentScreen, setCurrentScreen] = useState('Skating');

// // // // // // // // // // // //   const switchScreen = (screen) => setCurrentScreen(screen);

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <SafeAreaView style={{ flex: 1 }}>
// // // // // // // // // // // //       {currentScreen === 'Skating' ? (
// // // // // // // // // // // //         <SkatingTrackerBLE switchScreen={switchScreen} />
// // // // // // // // // // // //       ) : (
// // // // // // // // // // // //         <StepTrackerTwo switchScreen={switchScreen} />
// // // // // // // // // // // //       )}
// // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }
// // // // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // // // import { View } from 'react-native';
// // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // // //import StepTrackerTwo from './StepTracker';
// // // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';
// // // // // // // // // // // // // export default function App() {
// // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <View style={{ flex: 1 }}>
// // // // // // // // // // // // //       {connectedDevice ? (
// // // // // // // // // // // // //         <StepTrackerTwo connectedDevice={connectedDevice} />
// // // // // // // // // // // // //       ) : (
// // // // // // // // // // // // //         <SkatingTrackerBLE setConnectedDevice={setConnectedDevice} />
// // // // // // // // // // // // //       )}
// // // // // // // // // // // // //     </View>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }
// // // // // // // // // // // // // // export default function App() {
// // // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <View style={{ flex: 1 }}>
// // // // // // // // // // // // // //       {!connectedDevice ? (
// // // // // // // // // // // // // //         <SkatingTrackerBLE setConnectedDevice={setConnectedDevice} />
// // // // // // // // // // // // // //       ) : (
// // // // // // // // // // // // // //         <StepTrackerTwo connectedDevice={connectedDevice} />
// // // // // // // // // // // // // //       )}
// // // // // // // // // // // // // //     </View>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }
// // // // // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // // // // import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
// // // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';

// // // // // // // // // // // // // // export default function App() {
// // // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);
// // // // // // // // // // // // // //   const [bleCharacteristic, setBleCharacteristic] = useState(null);

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // // // // //         {connectedDevice && bleCharacteristic ? (
// // // // // // // // // // // // // //           <StepTrackerTwo device={connectedDevice} characteristic={bleCharacteristic} />
// // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // //           <SkatingTrackerBLE onConnect={setConnectedDevice} onCharacteristic={setBleCharacteristic} />
// // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // // // // //   container: { flex: 1, padding: 16 },
// // // // // // // // // // // // // // });// import React, { useEffect, useRef, useState } from 'react';
// // // // // // // // // // // // // // // import { SafeAreaView, View, StatusBar, StyleSheet, Text } from 'react-native';
// // // // // // // // // // // // // // // import { BleManager } from 'react-native-ble-plx';
// // // // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';

// // // // // // // // // // // // // // // const App = () => {
// // // // // // // // // // // // // // //   const bleManagerRef = useRef(null);
// // // // // // // // // // // // // // //   const [managerReady, setManagerReady] = useState(false);
// // // // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);

// // // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // // //     bleManagerRef.current = new BleManager();
// // // // // // // // // // // // // // //     setManagerReady(true);

// // // // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // // // //       bleManagerRef.current?.destroy();
// // // // // // // // // // // // // // //     };
// // // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // // // // // //         {!managerReady ? (
// // // // // // // // // // // // // // //           <Text style={styles.loadingText}>Initializing BLE Manager...</Text>
// // // // // // // // // // // // // // //         ) : !connectedDevice ? (
// // // // // // // // // // // // // // //           <SkatingTrackerBLE
// // // // // // // // // // // // // // //             manager={bleManagerRef.current}
// // // // // // // // // // // // // // //             onConnect={(device) => setConnectedDevice(device)}
// // // // // // // // // // // // // // //           />
// // // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // // //           <StepTrackerTwo
// // // // // // // // // // // // // // //             device={connectedDevice}
// // // // // // // // // // // // // // //             manager={bleManagerRef.current}
// // // // // // // // // // // // // // //             onDisconnect={() => setConnectedDevice(null)}
// // // // // // // // // // // // // // //           />
// // // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // // // // // //   container: { flex: 1 },
// // // // // // // // // // // // // // //   loadingText: {
// // // // // // // // // // // // // // //     marginTop: 40,
// // // // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // // // //     textAlign: 'center',
// // // // // // // // // // // // // // //   },
// // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // export default App;

// // // // // // // // // // // // // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // // // // // // // // // // // // import { SafeAreaView, View, StatusBar, StyleSheet } from 'react-native';
// // // // // // // // // // // // // // // // import { BleManager } from 'react-native-ble-plx';
// // // // // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';

// // // // // // // // // // // // // // // // const App = () => {
// // // // // // // // // // // // // // // //   const bleManagerRef = useRef(null);
// // // // // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);

// // // // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // // // //     bleManagerRef.current = new BleManager();
// // // // // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // // // // //       bleManagerRef.current?.destroy();
// // // // // // // // // // // // // // // //     };
// // // // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // // // // // // //         {connectedDevice && bleManagerRef.current ? (
// // // // // // // // // // // // // // // //          <StepTrackerTwo
// // // // // // // // // // // // // // // //             device={connectedDevice}
// // // // // // // // // // // // // // // //             manager={bleManagerRef.current}
// // // // // // // // // // // // // // // //             onDisconnect={() => setConnectedDevice(null)}
// // // // // // // // // // // // // // // //           /> 
// // // // // // // // // // // // // // // //         ) : ( 

// // // // // // // // // // // // // // // //          <SkatingTrackerBLE
// // // // // // // // // // // // // // // //             manager={bleManagerRef.current}
// // // // // // // // // // // // // // // //             onConnect={(device) => setConnectedDevice(device)}
// // // // // // // // // // // // // // // //           /> 
// // // // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // // // // // // //   container: { flex: 1 },
// // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // export default App;
// // // // // // // // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // // // // // // // import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
// // // // // // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';

// // // // // // // // // // // // // // // // // const App = () => {
// // // // // // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);
// // // // // // // // // // // // // // // // //   const [bleManager, setBleManager] = useState(null);

// // // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // // // // // // // //         {!connectedDevice ? (
// // // // // // // // // // // // // // // // //           <SkatingTrackerBLE
// // // // // // // // // // // // // // // // //             onConnect={(device, manager) => {
// // // // // // // // // // // // // // // // //               setConnectedDevice(device);
// // // // // // // // // // // // // // // // //               setBleManager(manager);
// // // // // // // // // // // // // // // // //             }}
// // // // // // // // // // // // // // // // //           />
// // // // // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // // // // //           <StepTrackerTwo
// // // // // // // // // // // // // // // // //             device={connectedDevice}
// // // // // // // // // // // // // // // // //             manager={bleManager}
// // // // // // // // // // // // // // // // //             onDisconnect={() => setConnectedDevice(null)}
// // // // // // // // // // // // // // // // //           />
// // // // // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // // // // // // // //   container: { flex: 1 },
// // // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // // export default App;

// // // // // // // // // // // // // // // // // // import React, { useRef, useState } from 'react';
// // // // // // // // // // // // // // // // // // import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
// // // // // // // // // // // // // // // // // // import { BleManager } from 'react-native-ble-plx';
// // // // // // // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';

// // // // // // // // // // // // // // // // // // const App = () => {
// // // // // // // // // // // // // // // // // //   const manager = useRef(new BleManager()).current;
// // // // // // // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);

// // // // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // // // // // // // // //         {connectedDevice ? (
// // // // // // // // // // // // // // // // // //           <StepTrackerTwo
// // // // // // // // // // // // // // // // // //             device={connectedDevice}
// // // // // // // // // // // // // // // // // //             manager={manager}
// // // // // // // // // // // // // // // // // //             onDisconnect={() => setConnectedDevice(null)}
// // // // // // // // // // // // // // // // // //           />
// // // // // // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // // // // // //           <SkatingTrackerBLE
// // // // // // // // // // // // // // // // // //             manager={manager}
// // // // // // // // // // // // // // // // // //             onDeviceConnected={setConnectedDevice}
// // // // // // // // // // // // // // // // // //           />
// // // // // // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // // // // // // // // //   container: { flex: 1 },
// // // // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // // // export default App;
// // // // // // // // // // // // // // // // // // // // import React from 'react';
// // // // // // // // // // // // // // // // // // // // import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
// // // // // // // // // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';

// // // // // // // // // // // // // // // // // // // // const App = () => {
// // // // // // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // // // // // // // // // // //         <SkatingTrackerBLE />
// // // // // // // // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // // // // // // // // // // //   container: { flex: 1, padding: 16 },
// // // // // // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // // // // // export default App;


// // // // // // // // // // // // // // // // // // // // // import { StatusBar } from 'expo-status-bar';
// // // // // // // // // // // // // // // // // // // // // import { StyleSheet, Text, View } from 'react-native';

// // // // // // // // // // // // // // // // // // // // // export default function App() {
// // // // // // // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // // // // // // // // // // // //       <Text>Open up App.js to start working on your app!</Text>
// // // // // // // // // // // // // // // // // // // // //       <StatusBar style="auto" />
// // // // // // // // // // // // // // // // // // // // //     </View>
// // // // // // // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // // // // // // // // //   container: {
// // // // // // // // // // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // // // // // // // // // //     backgroundColor: '#fff',
// // // // // // // // // // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // // // // // // // // // //   },
// // // // // // // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // // // // //App.js
// // // // // // // // // // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // // // // // // // // // import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
// // // // // // // // // // // // // // // // // // // import SkatingTrackerBLE from './components/SkatingTrackerBLE';
// // // // // // // // // // // // // // // // // // // //import StepTracker from './components/StepTracker';
// // // // // // // // // // // // // // // // // // // //import StepTracker from './components/StepTracker';
// // // // // // // // // // // // // // // // // // // //import StepTracker from './components/StepTracker';
// // // // // // // // // // // // // // // // // // // //import StepTracker from './components/StepTrackerTwo';
// // // // // // // // // // // // // // // // // // // import StepTrackerTwo from './components/StepTrackerTwo';
// // // // // // // // // // // // // // // // // // // const App = () => {
// // // // // // // // // // // // // // // // // // //   const [connectedDevice, setConnectedDevice] = useState(null);

// // // // // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // // // // // // // // // //       <StatusBar barStyle="dark-content" />
// // // // // // // // // // // // // // // // // // //       <View style={styles.container}>
// // // // // // // // // // // // // // // // // // //         {connectedDevice ? (
// // // // // // // // // // // // // // // // // // //           <StepTrackerTwo device={connectedDevice} />
// // // // // // // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // // // // // // //           <SkatingTrackerBLE onDeviceConnected={setConnectedDevice} />
// // // // // // // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // // // // // // //   safeArea: { flex: 1, backgroundColor: '#fff' },
// // // // // // // // // // // // // // // // // // //   container: { flex: 1, padding: 16 },
// // // // // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // // // // export default App;
