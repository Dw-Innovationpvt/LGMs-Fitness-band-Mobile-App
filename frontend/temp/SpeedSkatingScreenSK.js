// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, Easing, Alert, ScrollView, Dimensions, StyleSheet
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Haptics from 'expo-haptics';
// import { useBLEStore } from '../store/augBleStore';
// import { useSessionStore } from '../store/useSessionStore';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SKATING_MODE_KEY } from '../constants/storageKeys';


// const { width, height } = Dimensions.get('window');

// // Utility functions
// const darkenColor = (color, percent) => {
//   const num = parseInt(color.replace("#", ""), 16);
//   const amt = Math.round(2.55 * percent);
//   const R = (num >> 16) - amt;
//   const G = (num >> 8 & 0x00FF) - amt;
//   const B = (num & 0x0000FF) - amt;
//   return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
//     (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
//     (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
// };

// const formatTime = (seconds) => {
//   const hrs = Math.floor(seconds / 3600);
//   const mins = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;
//   return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// };

// const SpeedSkatingScreenSk = ({ navigation }) => {
//   const { 
//     isConnected, 
//     data: bleData, 
//     sendCommand, 
//     setSpeedSkatingMode,
//     currentMode,
//     bandActive,
//     sessionData,
//     getCurrentModeDisplay,
//     startNewSession
//   } = useBLEStore();
//   const { createSession, fetchSpeedSessions  } = useSessionStore();

  
//   const [isTracking, setIsTracking] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [sessionMaxSpeed, setSessionMaxSpeed] = useState(0);
//   const [sessionMinSpeed, setSessionMinSpeed] = useState(0);
//   const [speedReadings, setSpeedReadings] = useState([]);
//   const [animation] = useState(new Animated.Value(0));
//   const timerRef = useRef(null);

//   // CORRECTED: Hardware already provides speed in km/h, no conversion needed
//   const currentSpeed = bleData?.speed || 0; // Already in km/h from hardware
//   const hardwareMaxSpeed = bleData?.maxSpeed || 0; // From hardware
//   const hardwareMinSpeed = bleData?.minSpeed || 0; // From hardware
//   const strides = bleData?.strideCount || 0;
  
//   // Calculate calories based on speed and duration
//   const calories = Math.floor((currentSpeed * duration * 0.1) + (strides * 0.05));
  
//   // Calculate average speed from session readings
//   const averageSpeed = speedReadings.length > 0 
//     ? speedReadings.reduce((sum, speed) => sum + speed, 0) / speedReadings.length 
//     : 0;

//   // Calculate pace (min/km) - only when moving
//   const currentPace = currentSpeed > 0 ? (60 / currentSpeed).toFixed(1) : '--';

//   useEffect(() => {
//     AsyncStorage.setItem(SKATING_MODE_KEY, 'speed');
//   }, []);

//   useEffect(() => {
//     // Auto-start tracking when connected and in speed skating mode
//     if (isConnected && currentMode === 'SS' && !isTracking) {
//       startTracking();
//     }
    
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isConnected, currentMode]);

//   useEffect(() => {
//     // Update duration timer when tracking
//     if (isTracking) {
//       timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
//     } else if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
    
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isTracking]);

//   useEffect(() => {
//     if (isTracking && currentSpeed > 0) {
//       // Add current speed to readings for average calculation (only valid speeds)
//       setSpeedReadings(prev => {
//         const newReadings = [...prev, currentSpeed];
//         // Keep only last 60 readings (1 minute of data at 1 reading/sec)
//         return newReadings.slice(-60);
//       });

//       // Update session max speed - use the higher of hardware max or our tracked max
//       const effectiveMaxSpeed = Math.max(hardwareMaxSpeed, sessionMaxSpeed, currentSpeed);
//       if (effectiveMaxSpeed > sessionMaxSpeed) {
//         setSessionMaxSpeed(effectiveMaxSpeed);
//       }

//       // Update session min speed (only when we have valid movement)
//       if (currentSpeed > 0.5) { // Ignore very low speeds (standing still)
//         if (sessionMinSpeed === 0 || currentSpeed < sessionMinSpeed) {
//           setSessionMinSpeed(currentSpeed);
//         }
//       }
//     }
//   }, [currentSpeed, isTracking]);

//   // const startTracking = async () => {
//   //   try {
//   //     // Use the new store methods
//   //     await sendCommand('TURN_ON');
//   //     await setSpeedSkatingMode(); // This sends 'SET_MODE SKATING_SPEED'
      
//   //     setIsTracking(true);
//   //     startNewSession(); // Reset session data
//   //     setSessionMaxSpeed(0);
//   //     setSessionMinSpeed(0);
//   //     setSpeedReadings([]);
//   //     setDuration(0);
//   //     animatePulse();
//   //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
//   //     console.log('✅ Speed skating session started');
//   //   } catch (error) {
//   //     Alert.alert('Error', error.message || 'Failed to start tracking');
//   //   }
//   // };

// //   const stopTracking = async () => {
// //     try {
// //       // Switch back to step counting mode when stopping
// //       await sendCommand('SET_MODE STEP_COUNTING');
// //       setIsTracking(false);
// //       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
// //       console.log('✅ Speed skating session stopped');
      
// //       // Show comprehensive session summary
// //       // Alert.alert(
// //       //   'Session Complete! 🏆',
// //       //   `Duration: ${formatTime(duration)}\n` +
// //       //   `Max Speed: ${sessionMaxSpeed.toFixed(1)} km/h\n` +
// //       //   `Avg Speed: ${averageSpeed.toFixed(1)} km/h\n` +
// //       //   `Distance: ${(currentSpeed * duration / 3600).toFixed(2)} km\n` +
// //       //   `Strides: ${strides}\n` +
// //       //   `Calories: ${calories}`,
// //       //   [{ text: 'OK', style: 'default' }]
// //       // );

// //       const stopTracking = async () => {
// //   try {
// //     // Switch back to step counting mode when stopping
// //     await sendCommand('SET_MODE STEP_COUNTING');
// //     setIsTracking(false);
// //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// //     console.log('✅ Speed skating session stopped');


// //     // Prepare data object for logging
// //     const sessionSummary = {
// //       duration: formatTime(duration),
// //       durationSeconds: duration,
// //       maxSpeed: sessionMaxSpeed.toFixed(1),
// //       minSpeed: sessionMinSpeed.toFixed(1),
// //       avgSpeed: averageSpeed.toFixed(1),
// //       currentSpeed: currentSpeed.toFixed(1),
// //       distanceKm: (currentSpeed * duration / 3600).toFixed(2),
// //       strides,
// //       calories,
// //       timestamp: new Date().toLocaleString(),
// //       allSpeedReadings: speedReadings,
// //       bleData,
// //       currentMode,
// //       bandActive,
// //       sessionData,
// //     };

// //     // 🧠 Log all the important session data
// //     console.log("📊 FULL SESSION DATA:", JSON.stringify(sessionSummary, null, 2));

// //   } catch (error) {
// //     Alert.alert('Error', error.message || 'Failed to stop tracking');
// //   }
// // };



// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to stop tracking');
// //     }
// //   };

// // const stopTracking = async () => {
// //   try {
// //     // Stop BLE or other tracking mechanisms
// //     await sendCommand('SET_MODE STEP_COUNTING');
// //     setIsTracking(false);
// //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// //     console.log('✅ Speed skating session stopped');

// //     // Prepare session data
// //     const sessionData = {
// //       mode: 'SS', // Speed Skating mode
// //       duration: duration, // in seconds
// //       formattedDuration: formatTime(duration),
// //       maxSpeed: sessionMaxSpeed.toFixed(1),
// //       minSpeed: sessionMinSpeed.toFixed(1),
// //       avgSpeed: averageSpeed.toFixed(1),
// //       currentSpeed: currentSpeed.toFixed(1),
// //       distance: (currentSpeed * duration / 3600).toFixed(2), // km
// //       strides,
// //       calories,
// //       allSpeedReadings: speedReadings,
// //       timestamp: new Date().toISOString(),
// //     };

// //     console.log('📦 Session Data ready to POST:', sessionData);

// //     // ✅ Post to backend via Zustand store
// //     const createdSession = await createSession(sessionData);

// //     console.log('✅ Session successfully saved to backend:', createdSession);

// //     // Show success alert
// //     Alert.alert(
// //       'Session Complete! 🏆',
// //       `Duration: ${formatTime(duration)}\n` +
// //         `Max Speed: ${sessionMaxSpeed.toFixed(1)} km/h\n` +
// //         `Avg Speed: ${averageSpeed.toFixed(1)} km/h\n` +
// //         `Distance: ${(currentSpeed * duration / 3600).toFixed(2)} km\n` +
// //         `Strides: ${strides}\n` +
// //         `Calories: ${calories}`,
// //       [{ text: 'OK', style: 'default' }]
// //     );
// //   } catch (error) {
// //     console.error('❌ Failed to stop tracking or save session:', error);
// //     Alert.alert('Error', error.message || 'Failed to stop tracking');
// //   }
// // };


// // const stopTracking = async () => {
// //     try {
// //       await sendCommand('SET_MODE STEP_COUNTING');
// //       setIsTracking(false);
// //       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// //       console.log('✅ Distance skating session stopped');

// //       // Prepare session data for backend
// //       const sessionData = {
// //         mode: 'SD', // Distance Skating
// //         duration, // seconds
// //         formattedDuration: formatTime(duration),
// //         maxSpeed: sessionMaxSpeed.toFixed(1),
// //         minSpeed: sessionMinSpeed.toFixed(1),
// //         avgSpeed: averageSpeed.toFixed(1),
// //         currentSpeed: currentSpeed.toFixed(1),
// //         distance: distanceKm,
// //         strides,
// //         calories,
// //         allSpeedReadings: speedReadings,
// //         timestamp: new Date().toISOString(),
// //       };

// //       console.log('📦 Sending Distance Skating session data:', sessionData);

// //       // Save session via Zustand store (POST to backend)
// //       const createdSession = await createSession(sessionData);
// //       console.log('✅ Session successfully saved to backend:', createdSession);

// //       Alert.alert(
// //         'Session Saved! 🏆',
// //         `Duration: ${formatTime(duration)}\n` +
// //         `Distance: ${distanceKm} km\n` +
// //         `Avg Speed: ${averageSpeed.toFixed(1)} km/h\n` +
// //         `Max Speed: ${sessionMaxSpeed.toFixed(1)} km/h\n` +
// //         `Strides: ${strides}\n` +
// //         `Calories: ${calories}`,
// //         [{ text: 'OK', style: 'default' }]
// //       );
// //     } catch (error) {
// //       console.error('❌ Failed to stop tracking or save session:', error);
// //       Alert.alert('Error', error.message || 'Failed to save session');
// //     }
// //   };


// const startTracking = async () => {
//   try {
//     // Use the new store methods
//     await sendCommand('TURN_ON');
//     await setSpeedSkatingMode(); // This should send 'SET_MODE SKATING_SPEED' or similar
    
//     setIsTracking(true);
//     startNewSession(); // Reset session data
//     animatePulse();
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
//     console.log('✅ Speed skating session started');
//   } catch (error) {
//     Alert.alert('Error', error.message || 'Failed to start tracking');
//   }
// };

// const stopTracking = async () => {
//   try {
//     // Save session data before stopping
//     await saveCurrentSession();
    
//     // Switch back to step counting mode when stopping
//     await sendCommand('SET_MODE STEP_COUNTING');
//     setIsTracking(false);
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
//     console.log('✅ Speed skating session stopped');
    
//     // Refresh sessions data
//     await fetchSpeedSessions();
    
//   } catch (error) {
//     Alert.alert('Error', error.message || 'Failed to stop tracking');
//   }
// };

// const saveCurrentSession = async () => {
//   try {
//     if (distance > 0 && duration > 0) {
//       const sessionData = {
//         deviceId: 'ESP32C3_SkatingBand_001',
//         mode: 'SS', // Changed to SS for Speed Skating
//         startTime: new Date(Date.now() - (duration * 1000)).toISOString(),
//         endTime: new Date().toISOString(),
//         stepCount: 0,
//         walkingDistance: 0,
//         strideCount: strideCount,
//         skatingDistance: distance,
//         speedData: {
//           currentSpeed: speed,
//           maxSpeed: maxSpeed,
//           minSpeed: minSpeed,
//           averageSpeed: averageSpeed || speed // Use calculated average if available
//         },
//         laps: laps,
//         config: {
//           wheelDiameter: 0.09,
//           trackLength: 100.0
//         }
//       };

//       await createSession(sessionData);
//       console.log('✅ Speed skating session saved successfully');
      
//       Alert.alert(
//         'Session Saved! ⚡',
//         `Distance: ${formatDistance(distance)} ${getDistanceUnit(distance)}\n` +
//         `Duration: ${formatTime(duration)}\n` +
//         `Max Speed: ${maxSpeed.toFixed(1)} km/h\n` +
//         `Avg Speed: ${(averageSpeed || speed).toFixed(1)} km/h\n` +
//         `Total Strides: ${strideCount}`,
//         [{ text: 'OK' }]
//       );
//     }
//   } catch (error) {
//     console.error('Error saving speed skating session:', error);
//     Alert.alert('Error', 'Failed to save speed skating session data');
//   }
// };


//   const animatePulse = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(animation, { 
//           toValue: 1, 
//           duration: 1000, 
//           easing: Easing.out(Easing.ease), 
//           useNativeDriver: true 
//         }),
//         Animated.timing(animation, { 
//           toValue: 0, 
//           duration: 1000, 
//           easing: Easing.out(Easing.ease), 
//           useNativeDriver: true 
//         }),
//       ])
//     ).start();
//   };

//   const pulseStyle = {
//     transform: [{ 
//       scale: animation.interpolate({ 
//         inputRange: [0, 1], 
//         outputRange: [1, 1.05] 
//       }) 
//     }]
//   };

//   const getSpeedColor = (speed) => {
//     if (speed < 5) return '#4CD964'; // Green - very slow
//     if (speed < 10) return '#4B6CB7'; // Blue - slow
//     if (speed < 15) return '#FF9500'; // Orange - medium
//     if (speed < 20) return '#FF3B30'; // Red - fast
//     return '#AF52DE'; // Purple - very fast
//   };

//   const getSpeedLevel = (speed) => {
//     if (speed < 3) return 'Stopped';
//     if (speed < 8) return 'Beginner';
//     if (speed < 15) return 'Intermediate';
//     if (speed < 22) return 'Advanced';
//     return 'Elite';
//   };

//   const getSpeedIntensity = (speed) => {
//     if (speed < 5) return 'Low';
//     if (speed < 12) return 'Moderate';
//     if (speed < 18) return 'High';
//     return 'Maximum';
//   };

//   // Determine if we should show start or stop button
//   const shouldShowStartButton = !isTracking && currentMode !== 'SS';
//   const shouldShowStopButton = isTracking && currentMode === 'SS';

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient 
//         colors={['#4B6CB7', '#182848']} 
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         <TouchableOpacity 
//           style={styles.headerButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <Feather name="arrow-left" size={24} color="#fff" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>Speed Skating</Text>
//           <View style={styles.connectionStatus}>
//             <MaterialCommunityIcons 
//               name={isConnected ? "bluetooth-connected" : "bluetooth-off"} 
//               size={16} 
//               color={isConnected ? "#4CD964" : "#FF3B30"} 
//             />
//             <Text style={styles.connectionStatusText}>
//               {isConnected ? 'Connected' : 'Disconnected'}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.headerButton} />
//       </LinearGradient>

//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Primary Speed Metric */}
//         <Animated.View style={[styles.card, styles.primaryMetricCard, pulseStyle]}>
//           <View style={styles.metricContainer}>
//             <Text style={[
//               styles.primaryMetricValue, 
//               { color: getSpeedColor(currentSpeed) }
//             ]}>
//               {currentSpeed.toFixed(1)}
//             </Text>
//             <Text style={styles.primaryMetricUnit}>km/h</Text>
//           </View>
//           <Text style={styles.primaryMetricLabel}>Current Speed</Text>
          
//           {/* Speed Level Indicator */}
//           <View style={styles.speedLevelContainer}>
//             <View style={[
//               styles.speedLevelBadge,
//               { backgroundColor: getSpeedColor(currentSpeed) + '20' }
//             ]}>
//               <Text style={[
//                 styles.speedLevelText,
//                 { color: getSpeedColor(currentSpeed) }
//               ]}>
//                 {getSpeedLevel(currentSpeed)} • {getSpeedIntensity(currentSpeed)}
//               </Text>
//             </View>
//           </View>

//           {/* Live Tracking Indicator */}
//           {isTracking && (
//             <View style={styles.liveIndicator}>
//               <Animated.View 
//                 style={[
//                   styles.liveDot,
//                   {
//                     opacity: animation.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [0.3, 1]
//                     })
//                   }
//                 ]} 
//               />
//               <Text style={styles.liveText}>LIVE TRACKING</Text>
//             </View>
//           )}
//         </Animated.View>

//         {/* Speed Gauge Visualization */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Speed Gauge</Text>
//           <View style={styles.speedGauge}>
//             <View style={styles.gaugeLabels}>
//               <Text style={styles.gaugeLabel}>0</Text>
//               <Text style={styles.gaugeLabel}>10</Text>
//               <Text style={styles.gaugeLabel}>20</Text>
//               <Text style={styles.gaugeLabel}>30</Text>
//               <Text style={styles.gaugeLabel}>40+</Text>
//             </View>
//             <View style={styles.gaugeBar}>
//               <View 
//                 style={[
//                   styles.gaugeFill,
//                   { 
//                     width: `${Math.min(currentSpeed / 40 * 100, 100)}%`,
//                     backgroundColor: getSpeedColor(currentSpeed)
//                   }
//                 ]} 
//               />
//             </View>
//             <View style={[
//               styles.gaugeMarker,
//               { left: `${Math.min(currentSpeed / 40 * 100, 100)}%` }
//             ]} />
//           </View>
//           <View style={styles.gaugeStats}>
//             <Text style={styles.gaugeStat}>
//               Min: {sessionMinSpeed > 0 ? sessionMinSpeed.toFixed(1) : '0.0'} km/h
//             </Text>
//             <Text style={styles.gaugeStat}>
//               Max: {sessionMaxSpeed.toFixed(1)} km/h
//             </Text>
//           </View>
//         </View>

//         {/* Control Buttons */}
//         {shouldShowStartButton && (
//           <TouchableOpacity 
//             style={styles.button} 
//             onPress={startTracking}
//             activeOpacity={0.8}
//             disabled={!isConnected}
//           >
//             <LinearGradient 
//               colors={['#4B6CB7', darkenColor('#4B6CB7', 20)]} 
//               style={[
//                 styles.gradientButton,
//                 !isConnected && styles.disabledButton
//               ]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//             >
//               <Feather name="play" size={24} color="#fff" />
//               <Text style={styles.buttonText}>
//                 {isConnected ? 'Start Speed Session' : 'Connect Device First'}
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         )}

//         {shouldShowStopButton && (
//           <TouchableOpacity 
//             style={styles.button} 
//             onPress={stopTracking}
//             activeOpacity={0.8}
//           >
//             <LinearGradient 
//               colors={['#FF3B30', '#D32F2F']} 
//               style={styles.gradientButton}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//             >
//               <Feather name="square" size={24} color="#fff" />
//               <Text style={styles.buttonText}>Stop Session</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         )}

//         {/* Performance Stats Grid */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Performance Metrics</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="trophy" size={24} color="#FF9500" />
//               <Text style={styles.statValue}>{sessionMaxSpeed.toFixed(1)}</Text>
//               <Text style={styles.statLabel}>Max Speed</Text>
//               <Text style={styles.statSubLabel}>km/h</Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="speedometer" size={24} color="#4CD964" />
//               <Text style={styles.statValue}>{averageSpeed.toFixed(1)}</Text>
//               <Text style={styles.statLabel}>Avg Speed</Text>
//               <Text style={styles.statSubLabel}>km/h</Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="clock-outline" size={24} color="#4B6CB7" />
//               <Text style={styles.statValue}>{formatTime(duration)}</Text>
//               <Text style={styles.statLabel}>Duration</Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="run" size={24} color="#AF52DE" />
//               <Text style={styles.statValue}>{strides}</Text>
//               <Text style={styles.statLabel}>Strides</Text>
//             </View>
//           </View>
//         </View>

//         {/* Additional Metrics */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Additional Metrics</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="gauge" size={24} color="#007AFF" />
//               <Text style={styles.statValue}>{currentPace}</Text>
//               <Text style={styles.statLabel}>Current Pace</Text>
//               <Text style={styles.statSubLabel}>min/km</Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="fire" size={24} color="#FF3B30" />
//               <Text style={styles.statValue}>{calories}</Text>
//               <Text style={styles.statLabel}>Calories</Text>
//             </View>
//           </View>
//         </View>

//         {/* Session Info */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Session Information</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Status:</Text>
//             <View style={styles.statusBadge}>
//               <View 
//                 style={[
//                   styles.statusDot,
//                   { 
//                     backgroundColor: isTracking && currentMode === 'SS' ? '#4CD964' : 
//                                    isConnected ? '#FF9500' : '#FF3B30' 
//                   }
//                 ]} 
//               />
//               <Text style={styles.infoValue}>
//                 {isTracking && currentMode === 'SS' ? 'Active' : 
//                  isConnected ? 'Ready' : 'Disconnected'}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Current Mode:</Text>
//             <Text style={styles.infoValue}>{getCurrentModeDisplay()}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Band Status:</Text>
//             <Text style={styles.infoValue}>
//               {bandActive ? 'Active' : 'Inactive'}
//             </Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Session Time:</Text>
//             <Text style={styles.infoValue}>{formatTime(sessionData.sessionDuration)}</Text>
//           </View>
//         </View>

//         {/* Connection Help Card */}
//         {!isConnected && (
//           <View style={[styles.card, styles.helpCard]}>
//             <MaterialCommunityIcons name="bluetooth-connect" size={32} color="#007AFF" />
//             <Text style={styles.helpTitle}>Device Not Connected</Text>
//             <Text style={styles.helpText}>
//               Please connect to your skating band from the Devices screen to start tracking your speed skating session.
//             </Text>
//             <TouchableOpacity 
//               style={styles.helpButton}
//               onPress={() => navigation.navigate('Devices')}
//             >
//               <Text style={styles.helpButtonText}>Go to Devices</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, Alert, ScrollView, Dimensions, StyleSheet
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useBLEStore } from '../store/augBleStore';
import { useSessionStore } from '../store/useSessionStore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKATING_MODE_KEY } from '../constants/storageKeys';

const { width, height } = Dimensions.get('window');

// Utility functions
const darkenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatDistance = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)}`;
  }
  return `${meters.toFixed(0)}`;
};

const getDistanceUnit = (meters) => {
  return meters >= 1000 ? 'km' : 'm';
};

const SpeedSkatingScreenSk = ({ navigation }) => {
  const { 
    isConnected, 
    data: bleData, 
    sendCommand, 
    setSpeedSkatingMode,
    currentMode,
    bandActive,
    sessionData,
    getCurrentModeDisplay,
    startNewSession
  } = useBLEStore();
  
  const { createSession, fetchSessions } = useSessionStore();

  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [sessionMaxSpeed, setSessionMaxSpeed] = useState(0);
  const [sessionMinSpeed, setSessionMinSpeed] = useState(0);
  const [speedReadings, setSpeedReadings] = useState([]);
  const [animation] = useState(new Animated.Value(0));
  const timerRef = useRef(null);

  // CORRECTED: Hardware already provides speed in km/h, no conversion needed
  const currentSpeed = bleData?.speed || 0; // Already in km/h from hardware
  const hardwareMaxSpeed = bleData?.maxSpeed || 0; // From hardware
  const hardwareMinSpeed = bleData?.minSpeed || 0; // From hardware
  const strides = bleData?.strideCount || 0;
  
  // Calculate distance based on speed and duration (convert km/h to m/s then multiply by duration)
  const distance = (currentSpeed / 3.6) * duration; // Distance in meters
  
  // Calculate calories based on speed and duration
  const calories = Math.floor((currentSpeed * duration * 0.1) + (strides * 0.05));
  
  // Calculate average speed from session readings
  const averageSpeed = speedReadings.length > 0 
    ? speedReadings.reduce((sum, speed) => sum + speed, 0) / speedReadings.length 
    : 0;

  // Calculate pace (min/km) - only when moving
  const currentPace = currentSpeed > 0 ? (60 / currentSpeed).toFixed(1) : '--';

  useEffect(() => {
    AsyncStorage.setItem(SKATING_MODE_KEY, 'speed');
  }, []);

  useEffect(() => {
    // Auto-start tracking when connected and in speed skating mode
    if (isConnected && currentMode === 'SS' && !isTracking) {
      startTracking();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected, currentMode]);

  useEffect(() => {
    // Update duration timer when tracking
    if (isTracking) {
      timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]);

  useEffect(() => {
    if (isTracking && currentSpeed > 0) {
      // Add current speed to readings for average calculation (only valid speeds)
      setSpeedReadings(prev => {
        const newReadings = [...prev, currentSpeed];
        // Keep only last 60 readings (1 minute of data at 1 reading/sec)
        return newReadings.slice(-60);
      });

      // Update session max speed - use the higher of hardware max or our tracked max
      const effectiveMaxSpeed = Math.max(hardwareMaxSpeed, sessionMaxSpeed, currentSpeed);
      if (effectiveMaxSpeed > sessionMaxSpeed) {
        setSessionMaxSpeed(effectiveMaxSpeed);
      }

      // Update session min speed (only when we have valid movement)
      if (currentSpeed > 0.5) { // Ignore very low speeds (standing still)
        if (sessionMinSpeed === 0 || currentSpeed < sessionMinSpeed) {
          setSessionMinSpeed(currentSpeed);
        }
      }
    }
  }, [currentSpeed, isTracking]);

  const startTracking = async () => {
    try {
      // Use the new store methods
      await sendCommand('TURN_ON');
      await setSpeedSkatingMode(); // This sends 'SET_MODE SKATING_SPEED'
      
      setIsTracking(true);
      startNewSession(); // Reset session data
      setSessionMaxSpeed(0);
      setSessionMinSpeed(0);
      setSpeedReadings([]);
      setDuration(0);
      animatePulse();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      console.log('✅ Speed skating session started');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to start tracking');
    }
  };

  const stopTracking = async () => {
    try {
      // Save session data before stopping
      await saveCurrentSession();
      
      // Switch back to step counting mode when stopping
      await sendCommand('SET_MODE STEP_COUNTING');
      setIsTracking(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      console.log('✅ Speed skating session stopped');
      
      // Refresh sessions data - fetch only speed skating sessions
      await fetchSessions({ mode: 'SS' });
      
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to stop tracking');
    }
  };

  const saveCurrentSession = async () => {
    try {
      if (distance > 0 && duration > 0) {
        const sessionData = {
          deviceId: 'ESP32C3_SkatingBand_001',
          mode: 'SS', // Speed Skating
          startTime: new Date(Date.now() - (duration * 1000)).toISOString(),
          endTime: new Date().toISOString(),
          stepCount: 0,
          walkingDistance: 0,
          strideCount: strides,
          skatingDistance: distance,
          speedData: {
            currentSpeed: currentSpeed,
            maxSpeed: sessionMaxSpeed,
            minSpeed: sessionMinSpeed,
            averageSpeed: averageSpeed
          },
          laps: 0,
          config: {
            wheelDiameter: 0.09,
            trackLength: 100.0
          }
        };

        await createSession(sessionData);
        console.log('✅ Speed skating session saved successfully');
        
        Alert.alert(
          'Session Saved! ⚡',
          `Distance: ${formatDistance(distance)} ${getDistanceUnit(distance)}\n` +
          `Duration: ${formatTime(duration)}\n` +
          `Max Speed: ${sessionMaxSpeed.toFixed(1)} km/h\n` +
          `Avg Speed: ${averageSpeed.toFixed(1)} km/h\n` +
          `Total Strides: ${strides}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Session Data',
          'Not enough data to save a session. Please skate for longer to record data.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving speed skating session:', error);
      Alert.alert('Error', 'Failed to save speed skating session data');
    }
  };

  const animatePulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, { 
          toValue: 1, 
          duration: 1000, 
          easing: Easing.out(Easing.ease), 
          useNativeDriver: true 
        }),
        Animated.timing(animation, { 
          toValue: 0, 
          duration: 1000, 
          easing: Easing.out(Easing.ease), 
          useNativeDriver: true 
        }),
      ])
    ).start();
  };

  const pulseStyle = {
    transform: [{ 
      scale: animation.interpolate({ 
        inputRange: [0, 1], 
        outputRange: [1, 1.05] 
      }) 
    }]
  };

  const getSpeedColor = (speed) => {
    if (speed < 5) return '#4CD964'; // Green - very slow
    if (speed < 10) return '#4B6CB7'; // Blue - slow
    if (speed < 15) return '#FF9500'; // Orange - medium
    if (speed < 20) return '#FF3B30'; // Red - fast
    return '#AF52DE'; // Purple - very fast
  };

  const getSpeedLevel = (speed) => {
    if (speed < 3) return 'Stopped';
    if (speed < 8) return 'Beginner';
    if (speed < 15) return 'Intermediate';
    if (speed < 22) return 'Advanced';
    return 'Elite';
  };

  const getSpeedIntensity = (speed) => {
    if (speed < 5) return 'Low';
    if (speed < 12) return 'Moderate';
    if (speed < 18) return 'High';
    return 'Maximum';
  };

  // Determine if we should show start or stop button
  const shouldShowStartButton = !isTracking && currentMode !== 'SS';
  const shouldShowStopButton = isTracking && currentMode === 'SS';

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={['#4B6CB7', '#182848']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Speed Skating</Text>
          <View style={styles.connectionStatus}>
            <MaterialCommunityIcons 
              name={isConnected ? "bluetooth-connected" : "bluetooth-off"} 
              size={16} 
              color={isConnected ? "#4CD964" : "#FF3B30"} 
            />
            <Text style={styles.connectionStatusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        <View style={styles.headerButton} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary Speed Metric */}
        <Animated.View style={[styles.card, styles.primaryMetricCard, pulseStyle]}>
          <View style={styles.metricContainer}>
            <Text style={[
              styles.primaryMetricValue, 
              { color: getSpeedColor(currentSpeed) }
            ]}>
              {currentSpeed.toFixed(1)}
            </Text>
            <Text style={styles.primaryMetricUnit}>km/h</Text>
          </View>
          <Text style={styles.primaryMetricLabel}>Current Speed</Text>
          
          {/* Speed Level Indicator */}
          <View style={styles.speedLevelContainer}>
            <View style={[
              styles.speedLevelBadge,
              { backgroundColor: getSpeedColor(currentSpeed) + '20' }
            ]}>
              <Text style={[
                styles.speedLevelText,
                { color: getSpeedColor(currentSpeed) }
              ]}>
                {getSpeedLevel(currentSpeed)} • {getSpeedIntensity(currentSpeed)}
              </Text>
            </View>
          </View>

          {/* Live Tracking Indicator */}
          {isTracking && (
            <View style={styles.liveIndicator}>
              <Animated.View 
                style={[
                  styles.liveDot,
                  {
                    opacity: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1]
                    })
                  }
                ]} 
              />
              <Text style={styles.liveText}>LIVE TRACKING</Text>
            </View>
          )}
        </Animated.View>

        {/* Speed Gauge Visualization */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Speed Gauge</Text>
          <View style={styles.speedGauge}>
            <View style={styles.gaugeLabels}>
              <Text style={styles.gaugeLabel}>0</Text>
              <Text style={styles.gaugeLabel}>10</Text>
              <Text style={styles.gaugeLabel}>20</Text>
              <Text style={styles.gaugeLabel}>30</Text>
              <Text style={styles.gaugeLabel}>40+</Text>
            </View>
            <View style={styles.gaugeBar}>
              <View 
                style={[
                  styles.gaugeFill,
                  { 
                    width: `${Math.min(currentSpeed / 40 * 100, 100)}%`,
                    backgroundColor: getSpeedColor(currentSpeed)
                  }
                ]} 
              />
            </View>
            <View style={[
              styles.gaugeMarker,
              { left: `${Math.min(currentSpeed / 40 * 100, 100)}%` }
            ]} />
          </View>
          <View style={styles.gaugeStats}>
            <Text style={styles.gaugeStat}>
              Min: {sessionMinSpeed > 0 ? sessionMinSpeed.toFixed(1) : '0.0'} km/h
            </Text>
            <Text style={styles.gaugeStat}>
              Max: {sessionMaxSpeed.toFixed(1)} km/h
            </Text>
          </View>
        </View>

        {/* Control Buttons */}
        {shouldShowStartButton && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={startTracking}
            activeOpacity={0.8}
            disabled={!isConnected}
          >
            <LinearGradient 
              // colors={['#4B6CB7', darkenColor('#4B6CB7', 20)]} 
              colors={['#4B6CB7', '#4B6CB7']} 
              style={[
                styles.gradientButton,
                !isConnected && styles.disabledButton
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="play" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                {isConnected ? 'Start Speed Session' : 'Connect Device First'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {shouldShowStopButton && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={stopTracking}
            activeOpacity={0.8}
          >
            <LinearGradient 
              colors={['#FF3B30', '#D32F2F']} 
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="square" size={24} color="#fff" />
              <Text style={styles.buttonText}>Stop Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Performance Stats Grid */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="trophy" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{sessionMaxSpeed.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Max Speed</Text>
              <Text style={styles.statSubLabel}>km/h</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="speedometer" size={24} color="#4CD964" />
              <Text style={styles.statValue}>{averageSpeed.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Speed</Text>
              <Text style={styles.statSubLabel}>km/h</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#4B6CB7" />
              <Text style={styles.statValue}>{formatTime(duration)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="run" size={24} color="#AF52DE" />
              <Text style={styles.statValue}>{strides}</Text>
              <Text style={styles.statLabel}>Strides</Text>
            </View>
          </View>
        </View>

        {/* Additional Metrics */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="gauge" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{currentPace}</Text>
              <Text style={styles.statLabel}>Current Pace</Text>
              <Text style={styles.statSubLabel}>min/km</Text>
            </View>
            
            {/* <View style={styles.statCard}>
              <MaterialCommunityIcons name="fire" size={24} color="#FF3B30" />
              <Text style={styles.statValue}>{calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View> */}

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="map-marker-distance" size={24} color="#34C759" />
              <Text style={styles.statValue}>{formatDistance(distance)}</Text>
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statSubLabel}>{getDistanceUnit(distance)}</Text>
            </View>
          </View>
        </View>

        {/* Session Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={styles.statusBadge}>
              <View 
                style={[
                  styles.statusDot,
                  { 
                    backgroundColor: isTracking && currentMode === 'SS' ? '#4CD964' : 
                                   isConnected ? '#FF9500' : '#FF3B30' 
                  }
                ]} 
              />
              <Text style={styles.infoValue}>
                {isTracking && currentMode === 'SS' ? 'Active' : 
                 isConnected ? 'Ready' : 'Disconnected'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Mode:</Text>
            <Text style={styles.infoValue}>{getCurrentModeDisplay()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Band Status:</Text>
            <Text style={styles.infoValue}>
              {bandActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Session Time:</Text>
            <Text style={styles.infoValue}>{formatTime(sessionData.sessionDuration)}</Text>
          </View>
        </View>

        {/* Connection Help Card */}
        {!isConnected && (
          <View style={[styles.card, styles.helpCard]}>
            <MaterialCommunityIcons name="bluetooth-connect" size={32} color="#007AFF" />
            <Text style={styles.helpTitle}>Device Not Connected</Text>
            <Text style={styles.helpText}>
              Please connect to your skating band from the Devices screen to start tracking your speed skating session.
            </Text>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => navigation.navigate('Simple')}
            >
              <Text style={styles.helpButtonText}>Go to Devices</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{marginBottom: 120}}>
        </View>

      </ScrollView>
    </View>
  );
};


// Add your styles here...

// export default SpeedSkatingScreenSk;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    paddingTop: height * 0.06,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#4B6CB7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectionStatusText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  primaryMetricCard: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  metricContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryMetricValue: {
    fontSize: 56,
    fontWeight: '800',
    marginBottom: -5,
    textShadowColor: 'rgba(75, 108, 183, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  primaryMetricUnit: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 12,
  },
  primaryMetricLabel: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  speedLevelContainer: {
    marginTop: 16,
  },
  speedLevelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(75, 108, 183, 0.3)',
  },
  speedLevelText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF3B30',
  },
  speedGauge: {
    marginTop: 10,
    position: 'relative',
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gaugeLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  gaugeBar: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 6,
    transition: 'width 0.3s ease',
  },
  gaugeMarker: {
    position: 'absolute',
    top: -4,
    width: 3,
    height: 20,
    backgroundColor: '#182848',
    borderRadius: 1.5,
    marginLeft: -1.5, // Center the marker
  },
  gaugeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  gaugeStat: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // elevation: 6,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#182848',
    marginBottom: 20,
  },
  statsGrid: {
    // flexDirection: 'row',
    // flexDirection: 'column',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
        flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    // width: (width - 88) / 2,
    width: (width - 99) / 2,
    alignItems: 'center',
    marginBottom: 15,
    padding: 16,
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 108, 183, 0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#182848',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#182848',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  helpCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#182848',
    marginTop: 12,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  helpButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SpeedSkatingScreenSk;