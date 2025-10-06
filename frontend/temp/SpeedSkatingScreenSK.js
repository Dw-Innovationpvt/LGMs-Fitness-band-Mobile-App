// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, Easing, Alert, ScrollView, Dimensions, StyleSheet
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Haptics from 'expo-haptics';
// import { useBLEStore } from '../store/augBleStore';
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
//   const { isConnected, data: bleData, sendCommand } = useBLEStore();
//   const [isTracking, setIsTracking] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [maxSpeed, setMaxSpeed] = useState(0);
//   const [animation] = useState(new Animated.Value(0));
//   const timerRef = useRef(null);

//   // Derived metrics
//   const speed = bleData?.speed || 0;
//   const strides = bleData?.strideCount || 0;
//   const calories = Math.floor(speed * 2); // simple calorie calc
//   const currentSpeedKmh = speed * 3.6;

//   useEffect(() => {
//     AsyncStorage.setItem(SKATING_MODE_KEY, 'speed');
//   }, []);

//   useEffect(() => {
//     if (isConnected && !isTracking) startTracking();
//     return () => timerRef.current && clearInterval(timerRef.current);
//   }, [isConnected]);

//   useEffect(() => {
//     if (isTracking) {
//       timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
//     } else if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
//   }, [isTracking]);

//   useEffect(() => {
//     if (currentSpeedKmh > maxSpeed) {
//       setMaxSpeed(currentSpeedKmh);
//     }
//   }, [currentSpeedKmh]);

//   const startTracking = async () => {
//     try {
//       await sendCommand('TURN_ON');
//       await sendCommand('SET_MODE SKATING_SPEED');
//       setIsTracking(true);
//       setMaxSpeed(0);
//       animatePulse();
//       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const stopTracking = async () => {
//     await sendCommand('SET_MODE STEP_COUNTING');
//     setIsTracking(false);
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//   };

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
//     if (speed < 10) return '#4B6CB7'; // Blue - slow
//     if (speed < 20) return '#FF9500'; // Orange - medium
//     return '#FF3B30'; // Red - fast
//   };

//   const getSpeedLevel = (speed) => {
//     if (speed < 5) return 'Beginner';
//     if (speed < 15) return 'Intermediate';
//     if (speed < 25) return 'Advanced';
//     return 'Pro';
//   };

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
//               { color: getSpeedColor(currentSpeedKmh) }
//             ]}>
//               {currentSpeedKmh.toFixed(1)}
//             </Text>
//             <Text style={styles.primaryMetricUnit}>km/h</Text>
//           </View>
//           <Text style={styles.primaryMetricLabel}>Current Speed</Text>
          
//           {/* Speed Level Indicator */}
//           <View style={styles.speedLevelContainer}>
//             <View style={[
//               styles.speedLevelBadge,
//               { backgroundColor: getSpeedColor(currentSpeedKmh) + '20' }
//             ]}>
//               <Text style={[
//                 styles.speedLevelText,
//                 { color: getSpeedColor(currentSpeedKmh) }
//               ]}>
//                 {getSpeedLevel(currentSpeedKmh)}
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
//               <Text style={styles.gaugeLabel}>15</Text>
//               <Text style={styles.gaugeLabel}>30</Text>
//               <Text style={styles.gaugeLabel}>45</Text>
//               <Text style={styles.gaugeLabel}>60+</Text>
//             </View>
//             <View style={styles.gaugeBar}>
//               <View 
//                 style={[
//                   styles.gaugeFill,
//                   { 
//                     width: `${Math.min(currentSpeedKmh / 60 * 100, 100)}%`,
//                     backgroundColor: getSpeedColor(currentSpeedKmh)
//                   }
//                 ]} 
//               />
//             </View>
//             <View style={styles.gaugeMarker} />
//           </View>
//         </View>

//         {/* Control Button */}
//         {!isTracking ? (
//           <TouchableOpacity 
//             style={styles.button} 
//             onPress={startTracking}
//             activeOpacity={0.8}
//           >
//             <LinearGradient 
//               colors={['#4B6CB7', darkenColor('#4B6CB7', 20)]} 
//               style={styles.gradientButton}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//             >
//               <Feather name="play" size={24} color="#fff" />
//               <Text style={styles.buttonText}>Start Speed Session</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         ) : (
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
//               <MaterialCommunityIcons name="clock-outline" size={24} color="#4B6CB7" />
//               <Text style={styles.statValue}>{formatTime(duration)}</Text>
//               <Text style={styles.statLabel}>Duration</Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="trophy" size={24} color="#FF9500" />
//               <Text style={styles.statValue}>{maxSpeed.toFixed(1)}</Text>
//               <Text style={styles.statLabel}>Max Speed</Text>
//               <Text style={styles.statSubLabel}>km/h</Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="fire" size={24} color="#FF3B30" />
//               <Text style={styles.statValue}>{calories}</Text>
//               <Text style={styles.statLabel}>Calories</Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <MaterialCommunityIcons name="run" size={24} color="#4CD964" />
//               <Text style={styles.statValue}>{strides}</Text>
//               <Text style={styles.statLabel}>Strides</Text>
//             </View>
//           </View>
//         </View>

//         {/* Speed Insights */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Speed Insights</Text>
//           <View style={styles.insightRow}>
//             <View style={styles.insightItem}>
//               <Text style={styles.insightLabel}>Avg. Pace</Text>
//               <Text style={styles.insightValue}>
//                 {speed > 0 ? (1000 / (speed * 60)).toFixed(2) : '--'}
//               </Text>
//               <Text style={styles.insightUnit}>min/km</Text>
//             </View>
//             <View style={styles.insightItem}>
//               <Text style={styles.insightLabel}>Current Zone</Text>
//               <Text style={[styles.insightValue, { color: getSpeedColor(currentSpeedKmh) }]}>
//                 {getSpeedLevel(currentSpeedKmh)}
//               </Text>
//               <Text style={styles.insightUnit}>Level</Text>
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
//                   { backgroundColor: isTracking ? '#4CD964' : '#FF3B30' }
//                 ]} 
//               />
//               <Text style={styles.infoValue}>
//                 {isTracking ? 'Active' : 'Ready'}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Mode:</Text>
//             <Text style={styles.infoValue}>Speed Skating</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Device:</Text>
//             <Text style={styles.infoValue}>
//               {isConnected ? 'Connected' : 'Disconnected'}
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FB',
//   },
//   header: {
//     paddingTop: height * 0.06,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: '#4B6CB7',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   headerButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   headerTitleContainer: {
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   connectionStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   connectionStatusText: {
//     fontSize: 12,
//     color: '#fff',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 24,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 6,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.8)',
//   },
//   primaryMetricCard: {
//     alignItems: 'center',
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//   },
//   metricContainer: {
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   primaryMetricValue: {
//     fontSize: 56,
//     fontWeight: '800',
//     marginBottom: -5,
//     textShadowColor: 'rgba(75, 108, 183, 0.2)',
//     textShadowOffset: { width: 0, height: 4 },
//     textShadowRadius: 8,
//   },
//   primaryMetricUnit: {
//     fontSize: 18,
//     color: '#666',
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   primaryMetricLabel: {
//     fontSize: 16,
//     color: '#888',
//     fontWeight: '500',
//   },
//   speedLevelContainer: {
//     marginTop: 16,
//   },
//   speedLevelBadge: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(75, 108, 183, 0.3)',
//   },
//   speedLevelText: {
//     fontSize: 14,
//     fontWeight: '700',
//     textAlign: 'center',
//   },
//   liveIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,59,48,0.1)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginTop: 16,
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#FF3B30',
//     marginRight: 8,
//   },
//   liveText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#FF3B30',
//   },
//   speedGauge: {
//     marginTop: 10,
//   },
//   gaugeLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   gaugeLabel: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   gaugeBar: {
//     height: 12,
//     backgroundColor: '#F0F0F0',
//     borderRadius: 6,
//     overflow: 'hidden',
//   },
//   gaugeFill: {
//     height: '100%',
//     borderRadius: 6,
//   },
//   gaugeMarker: {
//     position: 'absolute',
//     top: -4,
//     width: 3,
//     height: 20,
//     backgroundColor: '#182848',
//     borderRadius: 1.5,
//   },
//   button: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   gradientButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//     marginLeft: 12,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#182848',
//     marginBottom: 20,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: (width - 88) / 2,
//     alignItems: 'center',
//     marginBottom: 15,
//     padding: 16,
//     backgroundColor: '#F8FAFF',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(75, 108, 183, 0.1)',
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#182848',
//     marginVertical: 8,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   statSubLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 2,
//   },
//   insightRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   insightItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   insightLabel: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//     marginBottom: 8,
//   },
//   insightValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#182848',
//     marginBottom: 4,
//   },
//   insightUnit: {
//     fontSize: 12,
//     color: '#999',
//     fontWeight: '500',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },
//   infoLabel: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#182848',
//     fontWeight: '600',
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(76, 217, 100, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginRight: 6,
//   },
// });

// export default SpeedSkatingScreenSk;




























import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, Alert, ScrollView, Dimensions, StyleSheet
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useBLEStore } from '../store/augBleStore';
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

const SpeedSkatingScreenSk = ({ navigation }) => {
  const { isConnected, data: bleData, sendCommand } = useBLEStore();
  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [minSpeed, setMinSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [speedReadings, setSpeedReadings] = useState([]);
  const [animation] = useState(new Animated.Value(0));
  const timerRef = useRef(null);

  // Derived metrics
  const speed = bleData?.speed || 0;
  const strides = bleData?.strideCount || 0;
  const calories = Math.floor(speed * 2); // simple calorie calc
  const currentSpeedKmh = speed * 3.6;

  useEffect(() => {
    AsyncStorage.setItem(SKATING_MODE_KEY, 'speed');
  }, []);

  useEffect(() => {
    if (isConnected && !isTracking) startTracking();
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [isConnected]);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isTracking]);

  useEffect(() => {
    if (isTracking && currentSpeedKmh > 0) {
      // Update speed readings for average calculation
      setSpeedReadings(prev => [...prev, currentSpeedKmh]);
      
      // Update max speed
      if (currentSpeedKmh > maxSpeed) {
        setMaxSpeed(currentSpeedKmh);
      }
      
      // Update min speed (only if we have valid readings)
      if (minSpeed === 0 || currentSpeedKmh < minSpeed) {
        setMinSpeed(currentSpeedKmh);
      }
      
      // Calculate average speed
      const total = speedReadings.reduce((sum, reading) => sum + reading, 0) + currentSpeedKmh;
      const avg = total / (speedReadings.length + 1);
      setAverageSpeed(avg);
    }
  }, [currentSpeedKmh, isTracking]);

  const startTracking = async () => {
    try {
      await sendCommand('TURN_ON');
      await sendCommand('SET_MODE SKATING_SPEED');
      setIsTracking(true);
      setMaxSpeed(0);
      setMinSpeed(0);
      setAverageSpeed(0);
      setSpeedReadings([]);
      animatePulse();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const stopTracking = async () => {
    await sendCommand('SET_MODE STEP_COUNTING');
    setIsTracking(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    if (speed < 10) return '#4B6CB7'; // Blue - slow
    if (speed < 20) return '#FF9500'; // Orange - medium
    return '#FF3B30'; // Red - fast
  };

  const getSpeedLevel = (speed) => {
    if (speed < 5) return 'Beginner';
    if (speed < 15) return 'Intermediate';
    if (speed < 25) return 'Advanced';
    return 'Pro';
  };

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
              { color: getSpeedColor(currentSpeedKmh) }
            ]}>
              {currentSpeedKmh.toFixed(1)}
            </Text>
            <Text style={styles.primaryMetricUnit}>km/h</Text>
          </View>
          <Text style={styles.primaryMetricLabel}>Current Speed</Text>
          
          {/* Speed Level Indicator */}
          <View style={styles.speedLevelContainer}>
            <View style={[
              styles.speedLevelBadge,
              { backgroundColor: getSpeedColor(currentSpeedKmh) + '20' }
            ]}>
              <Text style={[
                styles.speedLevelText,
                { color: getSpeedColor(currentSpeedKmh) }
              ]}>
                {getSpeedLevel(currentSpeedKmh)}
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
              <Text style={styles.gaugeLabel}>15</Text>
              <Text style={styles.gaugeLabel}>30</Text>
              <Text style={styles.gaugeLabel}>45</Text>
              <Text style={styles.gaugeLabel}>60+</Text>
            </View>
            <View style={styles.gaugeBar}>
              <View 
                style={[
                  styles.gaugeFill,
                  { 
                    width: `${Math.min(currentSpeedKmh / 60 * 100, 100)}%`,
                    backgroundColor: getSpeedColor(currentSpeedKmh)
                  }
                ]} 
              />
            </View>
            <View style={styles.gaugeMarker} />
          </View>
        </View>

        {/* Control Button */}
        {!isTracking ? (
          <TouchableOpacity 
            style={styles.button} 
            onPress={startTracking}
            activeOpacity={0.8}
          >
            <LinearGradient 
              colors={['#4B6CB7', darkenColor('#4B6CB7', 20)]} 
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="play" size={24} color="#fff" />
              <Text style={styles.buttonText}>Start Speed Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
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
              <MaterialCommunityIcons name="clock-outline" size={24} color="#4B6CB7" />
              <Text style={styles.statValue}>{formatTime(duration)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="trophy" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{maxSpeed.toFixed(1)}</Text>
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
              <MaterialCommunityIcons name="gauge-low" size={24} color="#4B6CB7" />
              <Text style={styles.statValue}>{minSpeed.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Min Speed</Text>
              <Text style={styles.statSubLabel}>km/h</Text>
            </View>
          </View>
        </View>

        {/* Additional Stats Row */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="fire" size={24} color="#FF3B30" />
              <Text style={styles.statValue}>{calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="run" size={24} color="#4CD964" />
              <Text style={styles.statValue}>{strides}</Text>
              <Text style={styles.statLabel}>Strides</Text>
            </View>
          </View>
        </View>

        {/* Speed Insights */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Speed Insights</Text>
          <View style={styles.insightRow}>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Avg. Pace</Text>
              <Text style={styles.insightValue}>
                {speed > 0 ? (1000 / (speed * 60)).toFixed(2) : '--'}
              </Text>
              <Text style={styles.insightUnit}>min/km</Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Current Zone</Text>
              <Text style={[styles.insightValue, { color: getSpeedColor(currentSpeedKmh) }]}>
                {getSpeedLevel(currentSpeedKmh)}
              </Text>
              <Text style={styles.insightUnit}>Level</Text>
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
                  { backgroundColor: isTracking ? '#4CD964' : '#FF3B30' }
                ]} 
              />
              <Text style={styles.infoValue}>
                {isTracking ? 'Active' : 'Ready'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mode:</Text>
            <Text style={styles.infoValue}>Speed Skating</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device:</Text>
            <Text style={styles.infoValue}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 6,
  },
  gaugeMarker: {
    position: 'absolute',
    top: -4,
    width: 3,
    height: 20,
    backgroundColor: '#182848',
    borderRadius: 1.5,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 88) / 2,
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
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#182848',
    marginBottom: 4,
  },
  insightUnit: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
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
});

export default SpeedSkatingScreenSk;