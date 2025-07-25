import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Alert,
  ScrollView,
  useWindowDimensions,
  Linking,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
// import { useBLEStore } from '../store/bleStore';
import { useBLEStore } from './components/bleStore';

const { width } = Dimensions.get('window');

const SkatingTrackingScreen = ({ navigation, route }) => {
  let call = 0;
  console.log(route.params, 'hello noo 26');
  const { skatingType = 'speed' } = route.params || {};
  // if (route.params === 'speed') {
  // }
  // else {
  //   const { skatingType = 'distance' } = route.params || {};
  // }
  const { width, height } = useWindowDimensions();

  // BLE Store integration
  const {
    isConnected,
    // bandActive,
    data: bleData,
    // toggleBand,
    sendCommand,
    disconnect
  } = useBLEStore();

  // Local state
  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const timerRef = useRef(null);

  // Derived metrics from BLE data
const distance = bleData?.skatingDistance || 0;  // Note the camelCase change
const speed = bleData?.speed || 0;
const strides = bleData?.strideCount || 0;      // Changed from strides to strideCount
const laps = bleData?.laps || 0;
const calories = Math.floor(distance * 75);     // Same calorie calculation

  // Skating type configurations
  const skatingConfig = {
    speed: {
      title: 'Speed Skating',
      icon: 'speedometer',
      color: '#4B6CB7',
      metrics: ['Speed', 'Stride Rate', 'Lap Time'],
      unit: 'km/h'
    },
    distance: {
      title: 'Distance Skating',
      icon: 'map-marker-distance',
      color: '#00B0FF',
      metrics: ['Distance', 'Pace', 'Elevation'],
      unit: 'km'
    },
    freestyle: {
      title: 'Freestyle Skating',
      icon: 'skate',
      color: '#9C27B0',
      metrics: ['Tricks', 'Air Time', 'Style Points'],
      unit: ''
    }
  };

  const config = skatingConfig[skatingType] || skatingConfig.speed;

  // const callCommands = () => {
  //   if (call === 0) {
  //      console.log('inside call commands');
  //     if (skatingType === 'speed') {
  //       sendCommand('SET_MODE SKATING_SPEED');
  //     } else  {
  //     sendCommand('SET_MODE SKATING_DISTANCE');
  //   }
  //   call = 1;
  //   }
  //   }

  useEffect(() => {
    // if (route.params.skatingType === 'speed') {
    //   console.log("inside 87 spped skating useEffect");
    //   callCommands();
    //   // sendCommand('SET_MODE SKATING_SPEED');
    // }
    // else {
    //   console.log("inside 91 spped skating useEffect");
    //   callCommands();
    //   // sendCommand('SET_MODE SKATING_DISTANCE');
    //   // SKATING_DISTANCE
    // }

    // console.log('inside skating speed useEffect');
    // if (skatingType === 'speed') {
    //   // sendCommand('SET_SPEED_MODE');
    // }
    console.log('85, setup to speed skating')
    },[]);

  useEffect(() => {
    console.log('SkatingTrackingScreen mounted with skatingType:', skatingType);
    // if (skatingType === 'speed') {
    //   sendCommand('SET_MODE SKATING_SPEED');
    //   // sendCommand('SET_SPEED_MODE');
    // }
    // Start session automatically if device is connected
    if (isConnected && !isTracking) {
      startTracking();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]);



  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]);

  const startTracking = async () => {
    try {
      if (!isConnected) {
        Alert.alert('Device Not Connected', 'Please connect your skating band first');
        return;
      }

      // Send start command to device
      await sendCommand('TURN_ON');
      setIsTracking(true);

      if (skatingType === 'speed') {
        sendCommand('SET_MODE SKATING_SPEED');
        console.log('inside speed skating');
      }else{
        sendCommand('SET_MODE SKATING_DISTANCE');
      }
      animatePulse();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      Alert.alert('Error', 'Failed to start tracking: ' + error.message);
    }
  };

  const stopTracking = async () => {
    try {
      // Send stop command to device
      // await sendCommand('TURN_OFF');
      await sendCommand('SET_MODE STEP_COUNTING');
      setIsTracking(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop tracking: ' + error.message);
    }
  };

  const resetTracking = () => {
    setIsTracking(false);
    setDuration(0);
  };

  const saveSession = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Session Saved', `Your ${config.title} session has been saved to your history`);
    resetTracking();
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to disconnect: ' + error.message);
    }
  };

  const animatePulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const pulseStyle = {
    transform: [{
      scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] })
    }],
    opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] })
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateStrideRate = () => {
    if (duration < 10) return 0;
    return Math.floor((strides / duration) * 60); // Strides per minute
  };

  const renderPrimaryMetric = () => {
    switch (skatingType) {
      case 'speed':
        return (
          <View style={styles.primaryMetricContainer}>
            <Text style={[styles.primaryMetricValue, { color: config.color }]}>
              {(speed * 3.6).toFixed(1)} {/* Convert m/s to km/h */}
            </Text>
            <Text style={styles.primaryMetricUnit}>km/h</Text>
            <Text style={styles.primaryMetricLabel}>Current Speed</Text>
          </View>
        );
      case 'distance':
        return (
          <View style={styles.primaryMetricContainer}>
            <Text style={[styles.primaryMetricValue, { color: config.color }]}>
              {(distance / 1000).toFixed(2)} {/* Convert meters to km */}
            </Text>
            <Text style={styles.primaryMetricUnit}>km</Text>
            <Text style={styles.primaryMetricLabel}>Distance Covered</Text>
          </View>
        );
      case 'freestyle':
        return (
          <View style={styles.primaryMetricContainer}>
            <Text style={[styles.primaryMetricValue, { color: config.color }]}>
              {Math.floor(strides / 10)}
            </Text>
            <Text style={styles.primaryMetricUnit}>tricks</Text>
            <Text style={styles.primaryMetricLabel}>Tricks Landed</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderSecondaryMetrics = () => {
    switch (skatingType) {
      case 'speed':
        return (
          <>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="timer" size={24} color={config.color} />
              <Text style={styles.statValue}>
                {speed > 0 ? formatTime(Math.floor(400 / speed)) : '--:--'}
              </Text>
              <Text style={styles.statLabel}>Lap Time</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="repeat" size={24} color={config.color} />
              <Text style={styles.statValue}>{calculateStrideRate()}</Text>
              <Text style={styles.statLabel}>Stride Rate</Text>
            </View>
          </>
        );
      case 'distance':
        return (
          <>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="timer" size={24} color={config.color} />
              <Text style={styles.statValue}>
                {speed > 0 ? (1000 / (speed * 60)).toFixed(2) : '0.00'}
              </Text>
              <Text style={styles.statLabel}>Min/km</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="trending-up" size={24} color={config.color} />
              <Text style={styles.statValue}>{laps * 10}</Text>
              <Text style={styles.statLabel}>Elevation (m)</Text>
            </View>
          </>
        );
      case 'freestyle':
        return (
          <>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="timer-sand" size={24} color={config.color} />
              <Text style={styles.statValue}>{(duration / 10).toFixed(1)}</Text>
              <Text style={styles.statLabel}>Air Time (s)</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="star" size={24} color={config.color} />
              <Text style={styles.statValue}>
                {Math.min(10, (strides / 20 + 7).toFixed(1))}
              </Text>
              <Text style={styles.statLabel}>Style Points</Text>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#4B6CB7', '#182848']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <TouchableOpacity onPress={handleDisconnect}>
          <MaterialCommunityIcons 
            name={isConnected ? "bluetooth-connected" : "bluetooth-off"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Connection Status */}
        {!isConnected && (
          <View style={[styles.card, { backgroundColor: '#FFF3F3' }]}>
            <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>
              Device Not Connected
            </Text>
            <Text style={styles.connectionText}>
              Please pair your skating band to track your session
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#4B6CB7' }]} 
              onPress={() => navigation.navigate('PairDevice')}
            >
              <LinearGradient
                colors={['#4B6CB7', '#182848']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons name="bluetooth" size={24} color="#fff" />
                <Text style={styles.buttonText}>Pair Device</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Primary Metric Card */}
        <View style={[styles.card, styles.primaryMetricCard]}>
          {renderPrimaryMetric()}
        </View>

        {/* Controls Section */}
        {isConnected && (
          <View style={styles.card}>
            <View>
              {/* <Button title="Set Skating Speed Mode" onPress={() => sendCommand('SET_MODE SKATING_SPEED')} />
                        <Button title="Set Step Mode" onPress={() => sendCommand('SET_MODE STEP_COUNTING')} />
                        <Button title="Set Step Mode" onPress={() => sendCommand('SET_MODE STEP_COUNTING')} /> */}
            </View>
            {!isTracking ? (
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: config.color }]} 
                onPress={startTracking}
              >
                <LinearGradient
                  colors={[config.color, darkenColor(config.color, 20)]}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Feather name="play" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Start Session</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.trackingControls}>
                <Animated.View style={[styles.pulseIndicator, pulseStyle]}>
                  <View style={[styles.recordingDot, { backgroundColor: config.color }]} />
                  <Text style={[styles.recordingText, { color: config.color }]}>
                    LIVE FROM DEVICE
                  </Text>
                </Animated.View>
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: '#FF3B30' }]} 
                  onPress={stopTracking}
                >
                  <LinearGradient
                    colors={['#FF3B30', '#D32F2F']}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Feather name="square" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Stop</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {(duration > 0 && !isTracking) && (
              <View style={styles.sessionActions}>
                <TouchableOpacity 
                  style={[styles.secondaryButton]} 
                  onPress={resetTracking}
                >
                  <Feather name="refresh-ccw" size={20} color="#666" />
                  <Text style={styles.secondaryButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: config.color }]} 
                  onPress={saveSession}
                >
                  <LinearGradient
                    colors={[config.color, darkenColor(config.color, 20)]}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Feather name="save" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Save Session</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Stats Section */}
        {isConnected && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Session Metrics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="clock-outline" size={24} color={config.color} />
                <Text style={styles.statValue}>{formatTime(duration)}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>

              <View style={styles.statCard}>
                <MaterialCommunityIcons name="fire" size={24} color={config.color} />
                <Text style={styles.statValue}>{calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>

              {renderSecondaryMetrics()}
            </View>
          </View>
        )}

        {/* History Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyItem}>
            <View style={[styles.historyIcon, { backgroundColor: `${config.color}20` }]}>
              <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyDate}>Today, 07:30 AM</Text>
              <Text style={styles.historyStats}>
                {skatingType === 'speed' ? `${(speed * 3.6).toFixed(1)} km/h • ${strides} strides` : 
                 skatingType === 'distance' ? `${(distance / 1000).toFixed(2)} km • ${formatTime(duration)}` : 
                 `${Math.floor(strides / 10)} tricks • ${calories} cal`}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to darken color
const darkenColor = (color, percent) => {
  // Convert hex to RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // Darken each component
  r = Math.floor(r * (100 - percent) / 100);
  g = Math.floor(g * (100 - percent) / 100);
  b = Math.floor(b * (100 - percent) / 100);

  // Convert back to hex
  r = r.toString(16).padStart(2, '0');
  g = g.toString(16).padStart(2, '0');
  b = b.toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    paddingTop: Dimensions.get('window').height * 0.06,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryMetricCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  primaryMetricContainer: {
    alignItems: 'center',
  },
  primaryMetricValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: -10,
  },
  primaryMetricUnit: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  primaryMetricLabel: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  trackingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pulseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  recordingText: {
    fontWeight: '600',
    fontSize: 14,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F7FB',
    flex: 1,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B6CB7',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#4B6CB7',
    fontSize: 14,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  historyStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  connectionText: {
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SkatingTrackingScreen;

