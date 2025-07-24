// File: StepTracker.js
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useBLEStore } from './bleStore';

export default function StepTracker() {
  const { sendCommand, data } = useBLEStore();

  useEffect(() => {
    console.log("stepTracker.js, 10");
    sendCommand('SET_MODE STEP_COUNTING');
    return () => sendCommand('SET_MODE SKATING_SPEED');
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>👣 Step Tracker</Text>
      <Text>Steps: {data?.s ?? data?.steps ?? 0}</Text>
      <Text>Distance: {data?.d ?? data?.walking_dist ?? 0} m</Text>
    </View>
  );
}
// // File: StepTracker.js
// import React, { useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import { useBLEStore } from './bleStore';

// export default function StepTracker() {
//   const { sendCommand, data } = useBLEStore();

//   useEffect(() => {
//     sendCommand('SET_MODE STEP_COUNTING');
//     return () => sendCommand('SET_MODE SKATING_SPEED');
//   }, []);

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 22 }}>👣 Step Tracker</Text>
//       <Text>Steps: {data?.s ?? data?.steps ?? 0}</Text>
//       <Text>Distance: {data?.d ?? data?.walking_dist ?? 0} m</Text>
//     </View>
//   );
// }// import React, { useEffect } from 'react';
// // import { View, Text, Button } from 'react-native';
// // import { useBLEStore } from './bleStore';

// // export default function StepTracker() {
// //   const { sendCommand, data } = useBLEStore();

// //   useEffect(() => {
// //     sendCommand('SET_MODE STEP_COUNTING');
// //     return () => sendCommand('SET_MODE SKATING_SPEED');
// //   }, []);

// //   return (
// //     <View style={{ padding: 20 }}>
// //       <Text style={{ fontSize: 22 }}>👣 Step Tracker</Text>
// //       <Text>Steps: {data?.s ?? data?.steps ?? 0}</Text>
// //       <Text>Distance: {data?.d ?? data?.walking_dist ?? 0} m</Text>
// //     </View>
// //   );
// // }
// // // // File: StepTracker.js
// // // import React, { useEffect } from 'react';
// // // import { View, Text, StyleSheet } from 'react-native';
// // // import { useBLEStore } from './bleStore';

// // // export default function StepTracker() {
// // //   const { data, sendCommand } = useBLEStore();

// // //   useEffect(() => {
// // //     sendCommand('SET_MODE STEP_COUNTING');
// // //     return () => sendCommand('SET_MODE SKATING_DISTANCE');
// // //   }, []);

// // //   if (!data) return <Text>Waiting for step data...</Text>;

// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.header}>Step Tracker</Text>
// // //       <Text>Mode: {data.mode}</Text>
// // //       <Text>Steps: {data.steps}</Text>
// // //       <Text>Walking Distance: {data.walking_dist} m</Text>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { marginTop: 20 },
// // //   header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
// // // });
// // // // import React, { useEffect, useState } from 'react';
// // // // import { View, Text, Button } from 'react-native';
// // // // import BLEService from './BleManager';

// // // // export default function StepTrackerTwo({ switchScreen }) {
// // // //   const [data, setData] = useState(null);

// // // //   useEffect(() => {
// // // //     BLEService.sendCommand('SET_MODE STEP_COUNTING');
// // // //     const cleanup = () => BLEService.sendCommand('SET_MODE SKATING_SPEED');
// // // //     return cleanup;
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     const unsubscribe = BLEService.monitorCharacteristic(
// // // //       setData,
// // // //       (msg) => console.log('StepTracker status:', msg)
// // // //     );
// // // //     return () => BLEService.disconnect();
// // // //   }, []);

// // // //   return (
// // // //     <View style={{ padding: 20 }}>
// // // //       <Text style={{ fontSize: 20 }}>🦶 Step Counter</Text>
// // // //       {data ? (
// // // //         <View>
// // // //           <Text>Mode: {data.mode}</Text>
// // // //           <Text>Steps: {data.steps}</Text>
// // // //           <Text>Walking Distance: {data.walking_dist} m</Text>
// // // //         </View>
// // // //       ) : (
// // // //         <Text>⏳ Waiting for data...</Text>
// // // //       )}
// // // //       <Button title="⬅️ Back to Skating" onPress={() => switchScreen('Skating')} />
// // // //     </View>
// // // //   );
// // // // }
// // // // // // StepTracker.js
// // // // // import React from 'react';
// // // // // import { View, Text, StyleSheet } from 'react-native';

// // // // // const StepTrackerTwo = ({ data }) => {
// // // // //   if (!data) {
// // // // //     return <Text style={styles.wait}>⏳ Waiting for data...</Text>;
// // // // //   }

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <Text style={styles.title}>📊 Skating Data</Text>
// // // // //       <Text>Mode: {data.mode}</Text>
// // // // //       <Text>Steps: {data.steps}</Text>
// // // // //       <Text>Walking Distance: {data.walking_dist} m</Text>
// // // // //       <Text>Strides: {data.strides}</Text>
// // // // //       <Text>Skating Distance: {data.skating_dist} m</Text>
// // // // //       <Text>Speed: {data.speed} m/s</Text>
// // // // //       <Text>Laps: {data.laps}</Text>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { padding: 20 },
// // // // //   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
// // // // //   wait: { fontSize: 16, padding: 20, color: 'gray' },
// // // // // });

// // // // // export default StepTrackerTwo;// import React, { useEffect, useState } from 'react';
// // // // // // import { View, Text, Button } from 'react-native';
// // // // // // import base64 from 'react-native-base64';

// // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // export default function StepTrackerTwo({ connectedDevice }) {
// // // // // //   const [data, setData] = useState(null);
// // // // // //   const [monitorSubscription, setMonitorSubscription] = useState(null);

// // // // // //   useEffect(() => {
// // // // // //     if (!connectedDevice) return;

// // // // // //     const setupBLE = async () => {
// // // // // //       try {
// // // // // //         console.log("🔧 Discovering services...");
// // // // // //         await connectedDevice.discoverAllServicesAndCharacteristics();

// // // // // //         console.log("📡 Starting monitor...");
// // // // // //         const subscription = connectedDevice.monitorCharacteristicForService(
// // // // // //           SERVICE_UUID,
// // // // // //           CHARACTERISTIC_UUID,
// // // // // //           (error, characteristic) => {
// // // // // //             if (error) {
// // // // // //               console.log("❌ Monitor error:", error.message);
// // // // // //               return;
// // // // // //             }

// // // // // //             const base64Value = characteristic?.value;
// // // // // //             if (base64Value) {
// // // // // //               try {
// // // // // //                 const decoded = base64.decode(base64Value);
// // // // // //                 console.log("📨 Received:", decoded);
// // // // // //                 const parsed = JSON.parse(decoded);
// // // // // //                 setData(parsed);
// // // // // //               } catch (e) {
// // // // // //                 console.log("❌ JSON parse error:", e.message);
// // // // // //               }
// // // // // //             }
// // // // // //           }
// // // // // //         );

// // // // // //         setMonitorSubscription(() => subscription);

// // // // // //         // ⚡ Send TURN_ON signal AFTER monitor
// // // // // //         await connectedDevice.writeCharacteristicWithResponseForService(
// // // // // //           SERVICE_UUID,
// // // // // //           CHARACTERISTIC_UUID,
// // // // // //           base64.encode('TURN_ON')
// // // // // //         );
// // // // // //         console.log("✅ TURN_ON sent");

// // // // // //       } catch (e) {
// // // // // //         console.log("⚠️ BLE setup failed:", e.message);
// // // // // //       }
// // // // // //     };

// // // // // //     setupBLE();

// // // // // //     return () => {
// // // // // //       if (monitorSubscription) {
// // // // // //         monitorSubscription.remove();
// // // // // //         console.log("🔌 Monitor unsubscribed.");
// // // // // //       }
// // // // // //     };
// // // // // //   }, [connectedDevice]);

// // // // // //   const turnOffBand = async () => {
// // // // // //     try {
// // // // // //       await connectedDevice.writeCharacteristicWithResponseForService(
// // // // // //         SERVICE_UUID,
// // // // // //         CHARACTERISTIC_UUID,
// // // // // //         base64.encode('TURN_OFF')
// // // // // //       );
// // // // // //       console.log("🛑 TURN_OFF sent");
// // // // // //     } catch (e) {
// // // // // //       console.log("Error turning off:", e.message);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <View style={{ padding: 20 }}>
// // // // // //       <Text style={{ fontSize: 20, fontWeight: 'bold' }}>🛼 Step Tracker</Text>
// // // // // //       {data ? (
// // // // // //         <>
// // // // // //           <Text>Mode: {data.mode}</Text>
// // // // // //           <Text>Steps: {data.steps}</Text>
// // // // // //           <Text>Walking Distance: {data.walking_dist} m</Text>
// // // // // //           <Text>Strides: {data.strides}</Text>
// // // // // //           <Text>Skating Distance: {data.skating_dist} m</Text>
// // // // // //           <Text>Speed: {data.speed} m/s</Text>
// // // // // //           <Text>Laps: {data.laps}</Text>
// // // // // //         </>
// // // // // //       ) : (
// // // // // //         <Text>⏳ Waiting for data...</Text>
// // // // // //       )}
// // // // // //       <Button title="Turn Off Band" onPress={turnOffBand} />
// // // // // //     </View>
// // // // // //   );
// // // // // // }
// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import { View, Text, Button } from 'react-native';
// // // // // // // import base64 from 'react-native-base64';

// // // // // // // export default function StepTrackerTwo({ connectedDevice }) {
// // // // // // //   const [data, setData] = useState(null);
// // // // // // //   const [subscription, setSubscription] = useState(null);
// // // // // // //   const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // //   const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // //   useEffect(() => {
// // // // // // //     if (!connectedDevice) return;

// // // // // // //     const setup = async () => {
// // // // // // //       try {
// // // // // // //         const services = await connectedDevice.discoverAllServicesAndCharacteristics();
// // // // // // //         const monitor = connectedDevice.monitorCharacteristicForService(
// // // // // // //           SERVICE_UUID,
// // // // // // //           CHARACTERISTIC_UUID,
// // // // // // //           (error, characteristic) => {
// // // // // // //             if (error) {
// // // // // // //               console.log('Monitor error:', error.message);
// // // // // // //               return;
// // // // // // //             }

// // // // // // //             const rawValue = characteristic?.value;
// // // // // // //             if (rawValue) {
// // // // // // //               try {
// // // // // // //                 const decoded = base64.decode(rawValue);
// // // // // // //                 const json = JSON.parse(decoded);
// // // // // // //                 setData(json);
// // // // // // //               } catch (err) {
// // // // // // //                 console.log('Parse error:', err.message);
// // // // // // //               }
// // // // // // //             }
// // // // // // //           }
// // // // // // //         );

// // // // // // //         setSubscription(() => monitor);
// // // // // // //         await connectedDevice.writeCharacteristicWithResponseForService(
// // // // // // //           SERVICE_UUID,
// // // // // // //           CHARACTERISTIC_UUID,
// // // // // // //           base64.encode('TURN_ON')
// // // // // // //         );
// // // // // // //       } catch (err) {
// // // // // // //         console.log('Setup error:', err.message);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     setup();

// // // // // // //     return () => {
// // // // // // //       if (subscription) subscription.remove();
// // // // // // //     };
// // // // // // //   }, [connectedDevice]);

// // // // // // //   const turnOff = async () => {
// // // // // // //     try {
// // // // // // //       await connectedDevice.writeCharacteristicWithResponseForService(
// // // // // // //         SERVICE_UUID,
// // // // // // //         CHARACTERISTIC_UUID,
// // // // // // //         base64.encode('TURN_OFF')
// // // // // // //       );
// // // // // // //     } catch (err) {
// // // // // // //       console.log('Turn off error:', err.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <View style={{ padding: 20 }}>
// // // // // // //       <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Live Stats</Text>
// // // // // // //       {data ? (
// // // // // // //         <>
// // // // // // //           <Text>Mode: {data.mode}</Text>
// // // // // // //           <Text>Steps: {data.steps}</Text>
// // // // // // //           <Text>Walking Distance: {data.walking_dist} m</Text>
// // // // // // //           <Text>Strides: {data.strides}</Text>
// // // // // // //           <Text>Skating Distance: {data.skating_dist} m</Text>
// // // // // // //           <Text>Speed: {data.speed} m/s</Text>
// // // // // // //           <Text>Laps: {data.laps}</Text>
// // // // // // //         </>
// // // // // // //       ) : (
// // // // // // //         <Text>Waiting for data...</Text>
// // // // // // //       )}
// // // // // // //       <Button title="Turn Off Band" onPress={turnOff} />
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // }
// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
// // // // // // // // import base64 from 'react-native-base64';

// // // // // // // // const StepTrackerTwo = ({ device, characteristic }) => {
// // // // // // // //   const [data, setData] = useState(null);

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!characteristic) return;

// // // // // // // //     const subscription = characteristic.monitor((error, char) => {
// // // // // // // //       if (error) {
// // // // // // // //         console.log('❌ Monitor error:', error.message);
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       const raw = char?.value;
// // // // // // // //       if (raw) {
// // // // // // // //         try {
// // // // // // // //           const decoded = base64.decode(raw);
// // // // // // // //           const parsed = JSON.parse(decoded);
// // // // // // // //           setData(parsed);
// // // // // // // //         } catch (e) {
// // // // // // // //           console.log('❌ JSON parse error:', e.message);
// // // // // // // //         }
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     return () => {
// // // // // // // //       subscription.remove();
// // // // // // // //     };
// // // // // // // //   }, [characteristic]);

// // // // // // // //   const sendBLECommand = async (cmd) => {
// // // // // // // //     if (!characteristic) return;
// // // // // // // //     try {
// // // // // // // //       await characteristic.writeWithResponse(base64.encode(cmd));
// // // // // // // //     } catch (e) {
// // // // // // // //       console.log('❌ BLE Write Error:', e.message);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <ScrollView contentContainerStyle={styles.container}>
// // // // // // // //       <Text style={styles.title}>📊 Step Tracker</Text>

// // // // // // // //       <View style={styles.section}>
// // // // // // // //         <Button title="1️⃣ Turn Band ON (Step Mode)" onPress={() => sendBLECommand('TURN_ON')} />
// // // // // // // //         <Button
// // // // // // // //           title="2️⃣ Set Skate Config (Wheel: 90mm, Lap: 100m)"
// // // // // // // //           onPress={() => sendBLECommand('SET_CONFIG SKATE 90 100')}
// // // // // // // //         />
// // // // // // // //         <Button title="3️⃣ Skating Speed Mode" onPress={() => sendBLECommand('SET_MODE SKATING_SPEED')} />
// // // // // // // //         <Button title="4️⃣ Switch to Step Count Mode" onPress={() => sendBLECommand('SET_MODE STEP_COUNTING')} />
// // // // // // // //         <Button title="5️⃣ Turn Band OFF" onPress={() => sendBLECommand('TURN_OFF')} color="red" />
// // // // // // // //       </View>

// // // // // // // //       {data ? (
// // // // // // // //         <View style={styles.dataBox}>
// // // // // // // //           <Text>🧭 Mode: {data.mode}</Text>
// // // // // // // //           <Text>🚶 Steps: {data.steps}</Text>
// // // // // // // //           <Text>📏 Walking Distance: {data.walking_dist} m</Text>
// // // // // // // //           <Text>🦶 Strides: {data.strides}</Text>
// // // // // // // //           <Text>⛸️ Skating Distance: {data.skating_dist} m</Text>
// // // // // // // //           <Text>💨 Speed: {data.speed} m/s</Text>
// // // // // // // //           <Text>🔁 Laps: {data.laps}</Text>
// // // // // // // //         </View>
// // // // // // // //       ) : (
// // // // // // // //         <Text style={{ marginTop: 20 }}>⌛ Waiting for data...</Text>
// // // // // // // //       )}
// // // // // // // //     </ScrollView>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: { padding: 20 },
// // // // // // // //   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
// // // // // // // //   section: { marginBottom: 20 },
// // // // // // // //   dataBox: {
// // // // // // // //     padding: 15,
// // // // // // // //     backgroundColor: '#e8f0fe',
// // // // // // // //     borderRadius: 10,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // // export default StepTrackerTwo;// import React, { useEffect, useState } from 'react';
// // // // // // // // // import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
// // // // // // // // // import base64 from 'react-native-base64';

// // // // // // // // // export default function StepTrackerTwo({ device, characteristic }) {
// // // // // // // // //   const [data, setData] = useState(null);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const subscription = characteristic.monitor((error, char) => {
// // // // // // // // //       if (error) {
// // // // // // // // //         console.error('Notification error:', error.message);
// // // // // // // // //         return;
// // // // // // // // //       }
// // // // // // // // //       try {
// // // // // // // // //         const decoded = base64.decode(char.value);
// // // // // // // // //         const json = JSON.parse(decoded);
// // // // // // // // //         setData(json);
// // // // // // // // //         console.log('📨 Data:', json);
// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.log('❌ JSON Parse Error:', err.message);
// // // // // // // // //       }
// // // // // // // // //     });

// // // // // // // // //     return () => subscription.remove();
// // // // // // // // //   }, [characteristic]);

// // // // // // // // //   const sendCommand = async (cmd) => {
// // // // // // // // //     try {
// // // // // // // // //       await characteristic.writeWithResponse(base64.encode(cmd));
// // // // // // // // //       console.log('✅ Sent command:', cmd);
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error('❌ Write error:', err.message);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <ScrollView contentContainerStyle={styles.container}>
// // // // // // // // //       <Text style={styles.title}>📊 Step Tracker</Text>

// // // // // // // // //       {data ? (
// // // // // // // // //         <View>
// // // // // // // // //           <Text style={styles.data}>Mode: {data.mode}</Text>
// // // // // // // // //           <Text style={styles.data}>Steps: {data.steps}</Text>
// // // // // // // // //           <Text style={styles.data}>Walking Distance: {data.walking_dist} m</Text>
// // // // // // // // //           <Text style={styles.data}>Strides: {data.strides}</Text>
// // // // // // // // //           <Text style={styles.data}>Skating Distance: {data.skating_dist} m</Text>
// // // // // // // // //           <Text style={styles.data}>Speed: {data.speed} m/s</Text>
// // // // // // // // //           <Text style={styles.data}>Laps: {data.laps}</Text>
// // // // // // // // //         </View>
// // // // // // // // //       ) : (
// // // // // // // // //         <Text style={styles.waiting}>Waiting for data...</Text>
// // // // // // // // //       )}

// // // // // // // // //       <View style={styles.buttonRow}>
// // // // // // // // //         <Button title="TURN_ON" onPress={() => sendCommand('TURN_ON')} />
// // // // // // // // //         <Button title="TURN_OFF" onPress={() => sendCommand('TURN_OFF')} />
// // // // // // // // //       </View>

// // // // // // // // //       <View style={styles.buttonRow}>
// // // // // // // // //         <Button title="SKATING_SPEED" onPress={() => sendCommand('SET_MODE SKATING_SPEED')} />
// // // // // // // // //         <Button title="SKATING_DISTANCE" onPress={() => sendCommand('SET_MODE SKATING_DISTANCE')} />
// // // // // // // // //       </View>

// // // // // // // // //       <View style={styles.buttonRow}>
// // // // // // // // //         <Button title="Set Config" onPress={() => sendCommand('SET_CONFIG SKATE 90 100')} />
// // // // // // // // //       </View>
// // // // // // // // //     </ScrollView>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: { padding: 20 },
// // // // // // // // //   title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
// // // // // // // // //   data: { fontSize: 16, marginVertical: 4 },
// // // // // // // // //   waiting: { textAlign: 'center', marginTop: 40 },
// // // // // // // // //   buttonRow: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-around',
// // // // // // // // //     marginVertical: 10,
// // // // // // // // //   }
// // // // // // // // // });
// // // // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // // // import { View, Text, StyleSheet, Button } from 'react-native';
// // // // // // // // // // import base64 from 'react-native-base64';

// // // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // // const StepTrackerTwo = ({ device, manager, onDisconnect }) => {
// // // // // // // // // //   const [stepData, setStepData] = useState(null);

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     let subscription;

// // // // // // // // // //     const monitor = async () => {
// // // // // // // // // //       if (!device) return;

// // // // // // // // // //       try {
// // // // // // // // // //         subscription = device.monitorCharacteristicForService(
// // // // // // // // // //           SERVICE_UUID,
// // // // // // // // // //           CHARACTERISTIC_UUID,
// // // // // // // // // //           (error, characteristic) => {
// // // // // // // // // //             if (error) {
// // // // // // // // // //               console.log('Monitor error:', error.message);
// // // // // // // // // //               return;
// // // // // // // // // //             }

// // // // // // // // // //             const base64Data = characteristic?.value;
// // // // // // // // // //             if (base64Data) {
// // // // // // // // // //               try {
// // // // // // // // // //                 const decoded = base64.decode(base64Data);
// // // // // // // // // //                 const json = JSON.parse(decoded);
// // // // // // // // // //                 setStepData(json);
// // // // // // // // // //               } catch (parseErr) {
// // // // // // // // // //                 console.log('❌ JSON Parse Error:', parseErr.message);
// // // // // // // // // //               }
// // // // // // // // // //             }
// // // // // // // // // //           }
// // // // // // // // // //         );
// // // // // // // // // //       } catch (e) {
// // // // // // // // // //         console.log('❌ Monitor setup failed:', e.message);
// // // // // // // // // //       }
// // // // // // // // // //     };

// // // // // // // // // //     monitor();

// // // // // // // // // //     return () => {
// // // // // // // // // //       subscription?.remove();
// // // // // // // // // //     };
// // // // // // // // // //   }, [device]);

// // // // // // // // // //   return (
// // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // //       <Text style={styles.title}>📊 Step Tracker</Text>
// // // // // // // // // //       {stepData ? (
// // // // // // // // // //         <View style={styles.dataBox}>
// // // // // // // // // //           <Text>👣 Steps: {stepData.steps}</Text>
// // // // // // // // // //           <Text>🚶 Distance: {stepData.walking_dist} meters</Text>
// // // // // // // // // //           <Text>🏁 Mode: {stepData.mode}</Text>
// // // // // // // // // //           <Text>🏎️ Speed: {stepData.speed?.toFixed(2)} m/s</Text>
// // // // // // // // // //           <Text>🎯 Laps: {stepData.laps}</Text>
// // // // // // // // // //         </View>
// // // // // // // // // //       ) : (
// // // // // // // // // //         <Text>Waiting for data...</Text>
// // // // // // // // // //       )}

// // // // // // // // // //       <View style={{ marginTop: 20 }}>
// // // // // // // // // //         <Button title="Disconnect" onPress={onDisconnect} />
// // // // // // // // // //       </View>
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: { flex: 1, padding: 24 },
// // // // // // // // // //   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
// // // // // // // // // //   dataBox: {
// // // // // // // // // //     backgroundColor: '#eef',
// // // // // // // // // //     padding: 16,
// // // // // // // // // //     borderRadius: 10,
// // // // // // // // // //   },
// // // // // // // // // // });

// // // // // // // // // // export default StepTrackerTwo;
// // // // // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // // // // import { View, Text, StyleSheet, Button, Alert } from 'react-native';
// // // // // // // // // // // import base64 from 'react-native-base64';

// // // // // // // // // // // // Match these UUIDs exactly with your Arduino code
// // // // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // // // const StepTrackerTwo = ({ device, manager, onDisconnect }) => {
// // // // // // // // // // //   const [data, setData] = useState(null);
// // // // // // // // // // //   const [error, setError] = useState(null);

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     console.log('📡 Connected to device:', device.id);

// // // // // // // // // // //     let subscription;

// // // // // // // // // // //     const monitorData = async () => {
// // // // // // // // // // //       try {
// // // // // // // // // // //         subscription = device.monitorCharacteristicForService(
// // // // // // // // // // //           SERVICE_UUID,
// // // // // // // // // // //           CHARACTERISTIC_UUID,
// // // // // // // // // // //           (error, characteristic) => {
// // // // // // // // // // //             if (error) {
// // // // // // // // // // //               console.log('❌ Monitor error:', error.message);
// // // // // // // // // // //               setError(error.message);
// // // // // // // // // // //               return;
// // // // // // // // // // //             }

// // // // // // // // // // //             if (characteristic?.value) {
// // // // // // // // // // //               const b64 = characteristic.value;
// // // // // // // // // // //               console.log('📨 Raw base64:', b64);

// // // // // // // // // // //               try {
// // // // // // // // // // //                 const decoded = base64.decode(b64);
// // // // // // // // // // //                 console.log('📜 Decoded string:', decoded);

// // // // // // // // // // //                 const json = JSON.parse(decoded);
// // // // // // // // // // //                 console.log('✅ Parsed JSON:', json);

// // // // // // // // // // //                 setData(json);
// // // // // // // // // // //                 setError(null); // clear any previous error
// // // // // // // // // // //               } catch (parseError) {
// // // // // // // // // // //                 console.log('❌ JSON Parse Error:', parseError.message);
// // // // // // // // // // //                 setError('Parse error: ' + parseError.message);
// // // // // // // // // // //               }
// // // // // // // // // // //             }
// // // // // // // // // // //           }
// // // // // // // // // // //         );
// // // // // // // // // // //       } catch (monitorError) {
// // // // // // // // // // //         console.log('❌ Setup error:', monitorError.message);
// // // // // // // // // // //         setError(monitorError.message);
// // // // // // // // // // //       }
// // // // // // // // // // //     };

// // // // // // // // // // //     monitorData();

// // // // // // // // // // //     return () => {
// // // // // // // // // // //       if (subscription) {
// // // // // // // // // // //         subscription.remove();
// // // // // // // // // // //         console.log('🔌 BLE subscription removed');
// // // // // // // // // // //       }
// // // // // // // // // // //     };
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   const handleDisconnect = async () => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       await manager.cancelDeviceConnection(device.id);
// // // // // // // // // // //       onDisconnect();
// // // // // // // // // // //       console.log('🔌 Disconnected manually');
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       Alert.alert('Error disconnecting', err.message);
// // // // // // // // // // //       console.log('❌ Disconnect error:', err.message);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // //       <Text style={styles.title}>📊 Step Tracker</Text>

// // // // // // // // // // //       {error && <Text style={styles.errorText}>Error: {error}</Text>}

// // // // // // // // // // //       {data ? (
// // // // // // // // // // //         <View style={styles.dataBox}>
// // // // // // // // // // //           <Text style={styles.item}>Mode: {data.mode}</Text>
// // // // // // // // // // //           <Text style={styles.item}>Steps: {data.steps}</Text>
// // // // // // // // // // //           <Text style={styles.item}>Walking Distance: {data.walking_dist} m</Text>
// // // // // // // // // // //           <Text style={styles.item}>Strides: {data.strides}</Text>
// // // // // // // // // // //           <Text style={styles.item}>Skating Distance: {data.skating_dist} m</Text>
// // // // // // // // // // //           <Text style={styles.item}>Speed: {data.speed} m/s</Text>
// // // // // // // // // // //           <Text style={styles.item}>Laps: {data.laps}</Text>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       ) : (
// // // // // // // // // // //         <Text style={styles.waitText}>Waiting for data...</Text>
// // // // // // // // // // //       )}

// // // // // // // // // // //       <Button title="🔌 Disconnect" onPress={handleDisconnect} />
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     padding: 20,
// // // // // // // // // // //     backgroundColor: '#fff',
// // // // // // // // // // //   },
// // // // // // // // // // //   title: {
// // // // // // // // // // //     fontSize: 26,
// // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // //     textAlign: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   dataBox: {
// // // // // // // // // // //     paddingVertical: 16,
// // // // // // // // // // //   },
// // // // // // // // // // //   item: {
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     marginBottom: 6,
// // // // // // // // // // //   },
// // // // // // // // // // //   waitText: {
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontStyle: 'italic',
// // // // // // // // // // //     color: '#888',
// // // // // // // // // // //     marginBottom: 20,
// // // // // // // // // // //   },
// // // // // // // // // // //   errorText: {
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     color: 'red',
// // // // // // // // // // //     marginBottom: 10,
// // // // // // // // // // //   },
// // // // // // // // // // // });

// // // // // // // // // // // export default StepTrackerTwo;// import React, { useEffect, useState } from 'react';
// // // // // // // // // // // // import { View, Text, StyleSheet, Button } from 'react-native';
// // // // // // // // // // // // import base64 from 'react-native-base64';

// // // // // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // // // // const StepTrackerTwo = ({ device, manager, onDisconnect }) => {
// // // // // // // // // // // //   const [data, setData] = useState(null);

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     let subscription;

// // // // // // // // // // // //     const monitor = async () => {
// // // // // // // // // // // //       try {
// // // // // // // // // // // //         subscription = device.monitorCharacteristicForService(
// // // // // // // // // // // //           SERVICE_UUID,
// // // // // // // // // // // //           CHARACTERISTIC_UUID,
// // // // // // // // // // // //           (error, characteristic) => {
// // // // // // // // // // // //             if (error) {
// // // // // // // // // // // //               console.log('Notification error:', error.message);
// // // // // // // // // // // //               return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             if (characteristic?.value) {
// // // // // // // // // // // //               try {
// // // // // // // // // // // //                 const decoded = base64.decode(characteristic.value);
// // // // // // // // // // // //                 const json = JSON.parse(decoded);
// // // // // // // // // // // //                 setData(json);
// // // // // // // // // // // //               } catch (e) {
// // // // // // // // // // // //                 console.log('❌ Parse error:', e.message);
// // // // // // // // // // // //               }
// // // // // // // // // // // //             }
// // // // // // // // // // // //           }
// // // // // // // // // // // //         );
// // // // // // // // // // // //       } catch (err) {
// // // // // // // // // // // //         console.log('Monitor error:', err.message);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     monitor();

// // // // // // // // // // // //     return () => {
// // // // // // // // // // // //       if (subscription) subscription.remove();
// // // // // // // // // // // //     };
// // // // // // // // // // // //   }, []);

// // // // // // // // // // // //   const disconnect = async () => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       await manager.cancelDeviceConnection(device.id);
// // // // // // // // // // // //       onDisconnect();
// // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // //       console.log('Disconnect error:', err.message);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // // //       <Text style={styles.title}>📊 Step Tracker</Text>

// // // // // // // // // // // //       {data ? (
// // // // // // // // // // // //         <>
// // // // // // // // // // // //           <Text style={styles.item}>Mode: {data.mode}</Text>
// // // // // // // // // // // //           <Text style={styles.item}>Steps: {data.steps}</Text>
// // // // // // // // // // // //           <Text style={styles.item}>Distance: {data.walking_dist} m</Text>
// // // // // // // // // // // //           <Text style={styles.item}>Speed: {data.speed} m/s</Text>
// // // // // // // // // // // //           <Text style={styles.item}>Laps: {data.laps}</Text>
// // // // // // // // // // // //         </>
// // // // // // // // // // // //       ) : (
// // // // // // // // // // // //         <Text style={styles.item}>Waiting for data...</Text>
// // // // // // // // // // // //       )}

// // // // // // // // // // // //       <Button title="🔌 Disconnect" onPress={disconnect} />
// // // // // // // // // // // //     </View>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // //   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
// // // // // // // // // // // //   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
// // // // // // // // // // // //   item: { fontSize: 18, marginBottom: 10 },
// // // // // // // // // // // // });

// // // // // // // // // // // // export default StepTrackerTwo;
// // // // // // // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // // // // // // import { View, Text, StyleSheet, Button } from 'react-native';
// // // // // // // // // // // // // import { BleManager } from 'react-native-ble-plx';
// // // // // // // // // // // // // import base64 from 'react-native-base64';

// // // // // // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // // // // // const StepTrackerTwo = ({ device, onDisconnect }) => {
// // // // // // // // // // // // //   const [data, setData] = useState(null);
// // // // // // // // // // // // //   const manager = new BleManager();

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     let subscription;

// // // // // // // // // // // // //     const connectAndMonitor = async () => {
// // // // // // // // // // // // //       try {
// // // // // // // // // // // // //         subscription = device.monitorCharacteristicForService(
// // // // // // // // // // // // //           SERVICE_UUID,
// // // // // // // // // // // // //           CHARACTERISTIC_UUID,
// // // // // // // // // // // // //           (error, characteristic) => {
// // // // // // // // // // // // //             if (error) {
// // // // // // // // // // // // //               console.log('Notification error:', error.message);
// // // // // // // // // // // // //               return;
// // // // // // // // // // // // //             }

// // // // // // // // // // // // //             const base64Val = characteristic?.value;
// // // // // // // // // // // // //             if (base64Val) {
// // // // // // // // // // // // //               try {
// // // // // // // // // // // // //                 const decoded = base64.decode(base64Val);
// // // // // // // // // // // // //                 const json = JSON.parse(decoded);
// // // // // // // // // // // // //                 setData(json);
// // // // // // // // // // // // //               } catch (e) {
// // // // // // // // // // // // //                 console.log('Decode error:', e.message);
// // // // // // // // // // // // //               }
// // // // // // // // // // // // //             }
// // // // // // // // // // // // //           }
// // // // // // // // // // // // //         );
// // // // // // // // // // // // //       } catch (err) {
// // // // // // // // // // // // //         console.log('Connection error:', err.message);
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     connectAndMonitor();

// // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // //       if (subscription) subscription.remove();
// // // // // // // // // // // // //       manager.destroy();
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // // // //       <Text style={styles.title}>📊 Step Tracker</Text>
// // // // // // // // // // // // //       {data ? (
// // // // // // // // // // // // //         <>
// // // // // // // // // // // // //           <Text style={styles.item}>Mode: {data.mode}</Text>
// // // // // // // // // // // // //           <Text style={styles.item}>Steps: {data.steps}</Text>
// // // // // // // // // // // // //           <Text style={styles.item}>Distance: {data.walking_dist} m</Text>
// // // // // // // // // // // // //           <Text style={styles.item}>Speed: {data.speed} m/s</Text>
// // // // // // // // // // // // //           <Text style={styles.item}>Laps: {data.laps}</Text>
// // // // // // // // // // // // //         </>
// // // // // // // // // // // // //       ) : (
// // // // // // // // // // // // //         <Text style={styles.item}>Waiting for data...</Text>
// // // // // // // // // // // // //       )}
// // // // // // // // // // // // //       <Button title="🔌 Disconnect" onPress={onDisconnect} />
// // // // // // // // // // // // //     </View>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // //   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
// // // // // // // // // // // // //   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
// // // // // // // // // // // // //   item: { fontSize: 18, marginBottom: 10 },
// // // // // // // // // // // // // });

// // // // // // // // // // // // // export default StepTrackerTwo;
// // // // // // // // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // // // // // // // import { View, Text, StyleSheet, Alert, ScrollView, Button } from 'react-native';
// // // // // // // // // // // // // // import { BleManager } from 'react-native-ble-plx';
// // // // // // // // // // // // // // import base64 from 'react-native-base64';

// // // // // // // // // // // // // // const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
// // // // // // // // // // // // // // const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

// // // // // // // // // // // // // // const StepTrackerTwo = ({ device }) => {
// // // // // // // // // // // // // //   const [steps, setSteps] = useState(0);
// // // // // // // // // // // // // //   const [distance, setDistance] = useState(0);
// // // // // // // // // // // // // //   const [speed, setSpeed] = useState(0);
// // // // // // // // // // // // // //   const [laps, setLaps] = useState(0);
// // // // // // // // // // // // // //   const [rawData, setRawData] = useState('');
// // // // // // // // // // // // // //   const [status, setStatus] = useState('Connecting...');
// // // // // // // // // // // // // //   const manager = new BleManager();

// // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // //     let subscription;

// // // // // // // // // // // // // //     const monitorBLE = async () => {
// // // // // // // // // // // // // //       try {
// // // // // // // // // // // // // //         const connected = await manager.connectToDevice(device.id);
// // // // // // // // // // // // // //         await connected.discoverAllServicesAndCharacteristics();

// // // // // // // // // // // // // //         subscription = connected.monitorCharacteristicForService(
// // // // // // // // // // // // // //           SERVICE_UUID,
// // // // // // // // // // // // // //           CHARACTERISTIC_UUID,
// // // // // // // // // // // // // //           (error, characteristic) => {
// // // // // // // // // // // // // //             if (error) {
// // // // // // // // // // // // // //               console.error('Monitor error:', error.message);
// // // // // // // // // // // // // //               Alert.alert('Monitor Error', error.message);
// // // // // // // // // // // // // //               return;
// // // // // // // // // // // // // //             }

// // // // // // // // // // // // // //             const value = characteristic?.value;
// // // // // // // // // // // // // //             if (value) {
// // // // // // // // // // // // // //               try {
// // // // // // // // // // // // // //                 const decoded = base64.decode(value);
// // // // // // // // // // // // // //                 const json = JSON.parse(decoded);
// // // // // // // // // // // // // //                 setRawData(JSON.stringify(json, null, 2));
// // // // // // // // // // // // // //                 if (json.steps !== undefined) setSteps(json.steps);
// // // // // // // // // // // // // //                 if (json.walking_dist !== undefined) setDistance(json.walking_dist);
// // // // // // // // // // // // // //                 if (json.speed !== undefined) setSpeed(json.speed);
// // // // // // // // // // // // // //                 if (json.laps !== undefined) setLaps(json.laps);
// // // // // // // // // // // // // //                 setStatus('Connected and tracking');
// // // // // // // // // // // // // //               } catch (parseErr) {
// // // // // // // // // // // // // //                 console.error('JSON Parse Error:', parseErr.message);
// // // // // // // // // // // // // //               }
// // // // // // // // // // // // // //             }
// // // // // // // // // // // // // //           }
// // // // // // // // // // // // // //         );
// // // // // // // // // // // // // //       } catch (err) {
// // // // // // // // // // // // // //         console.log('Connection error:', err.message);
// // // // // // // // // // // // // //         Alert.alert('Connection Failed', err.message);
// // // // // // // // // // // // // //         setStatus('Connection failed');
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     monitorBLE();

// // // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // // //       if (subscription) subscription.remove();
// // // // // // // // // // // // // //       manager.destroy();
// // // // // // // // // // // // // //     };
// // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <ScrollView contentContainerStyle={styles.container}>
// // // // // // // // // // // // // //       <Text style={styles.title}>👟 Step Tracker</Text>
// // // // // // // // // // // // // //       <Text style={styles.status}>{status}</Text>

// // // // // // // // // // // // // //       <View style={styles.card}>
// // // // // // // // // // // // // //         <Text style={styles.label}>Steps:</Text>
// // // // // // // // // // // // // //         <Text style={styles.value}>{steps}</Text>
// // // // // // // // // // // // // //       </View>

// // // // // // // // // // // // // //       <View style={styles.card}>
// // // // // // // // // // // // // //         <Text style={styles.label}>Distance Walked (m):</Text>
// // // // // // // // // // // // // //         <Text style={styles.value}>{distance.toFixed(2)}</Text>
// // // // // // // // // // // // // //       </View>

// // // // // // // // // // // // // //       <View style={styles.card}>
// // // // // // // // // // // // // //         <Text style={styles.label}>Speed (m/s):</Text>
// // // // // // // // // // // // // //         <Text style={styles.value}>{speed.toFixed(2)}</Text>
// // // // // // // // // // // // // //       </View>

// // // // // // // // // // // // // //       <View style={styles.card}>
// // // // // // // // // // // // // //         <Text style={styles.label}>Laps:</Text>
// // // // // // // // // // // // // //         <Text style={styles.value}>{laps}</Text>
// // // // // // // // // // // // // //       </View>

// // // // // // // // // // // // // //       <Text style={styles.rawLabel}>Raw BLE JSON:</Text>
// // // // // // // // // // // // // //       <Text style={styles.raw}>{rawData}</Text>
// // // // // // // // // // // // // //     </ScrollView>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // // //   container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
// // // // // // // // // // // // // //   title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
// // // // // // // // // // // // // //   status: { fontSize: 16, textAlign: 'center', color: 'gray', marginBottom: 20 },

// // // // // // // // // // // // // //   card: {
// // // // // // // // // // // // // //     backgroundColor: '#f0f0f0',
// // // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // // // // //     marginBottom: 10,
// // // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // // // //   },
// // // // // // // // // // // // // //   label: { fontSize: 16, fontWeight: '600' },
// // // // // // // // // // // // // //   value: { fontSize: 18, fontWeight: 'bold' },

// // // // // // // // // // // // // //   rawLabel: { marginTop: 20, fontSize: 14, fontWeight: '600' },
// // // // // // // // // // // // // //   raw: {
// // // // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // // // //     fontFamily: 'monospace',
// // // // // // // // // // // // // //     color: '#555',
// // // // // // // // // // // // // //     backgroundColor: '#eee',
// // // // // // // // // // // // // //     padding: 10,
// // // // // // // // // // // // // //     borderRadius: 6,
// // // // // // // // // // // // // //     marginTop: 6,
// // // // // // // // // // // // // //   },
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // export default StepTrackerTwo;
