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

// Format distance in meters with proper formatting
const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}`; // Show whole meters for less than 1km
  } else {
    return `${(meters / 1000).toFixed(2)}`; // Show km with 2 decimals for longer distances
  }
};

// Get appropriate distance unit
const getDistanceUnit = (meters) => {
  return meters < 1000 ? 'm' : 'km';
};

// Format pace in min/km or min/100m based on distance
const formatPace = (speedKmh) => {
  if (speedKmh <= 0) return '--';
  
  const paceMinPerKm = 60 / speedKmh;
  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.round((paceMinPerKm - minutes) * 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const DistanceSkatingScreenSk = ({ navigation }) => {
  const { 
    isConnected, 
    data: bleData, 
    sendCommand, 
    setDistanceSkatingMode,
    currentMode,
    bandActive,
    sessionData,
    getCurrentModeDisplay,
    startNewSession
  } = useBLEStore();
  
  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const timerRef = useRef(null);

  // Updated data extraction from new BLE structure
  const distance = bleData?.skatingDistance || 0; // in meters
  const speed = bleData?.speed || 0; // in km/h (from hardware)
  const maxSpeed = bleData?.maxSpeed || 0; // new metric
  const minSpeed = bleData?.minSpeed || 0; // new metric
  const strideCount = bleData?.strideCount || 0;
  const laps = bleData?.laps || 0;
  
  // Calculate derived metrics IN METERS
  const calories = Math.floor(distance * 0.075); // Based on meters
  const speedMs = speed / 3.6; // Convert km/h to m/s for reference
  const currentPace = speed > 0 ? formatPace(speed) : '--';
  
  // Calculate average stride length in meters
  const avgStrideLength = strideCount > 0 ? (distance / strideCount).toFixed(2) : '0.00';

  useEffect(() => {
    AsyncStorage.setItem(SKATING_MODE_KEY, 'distance');
  }, []);

  useEffect(() => {
    // Auto-start tracking when connected and in distance skating mode
    if (isConnected && currentMode === 'SD' && !isTracking) {
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

  const startTracking = async () => {
    try {
      // Use the new store methods
      await sendCommand('TURN_ON');
      await setDistanceSkatingMode(); // This sends 'SET_MODE SKATING_DISTANCE'
      
      setIsTracking(true);
      startNewSession(); // Reset session data
      animatePulse();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      console.log('✅ Distance skating session started');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to start tracking');
    }
  };

  const stopTracking = async () => {
    try {
      // Switch back to step counting mode when stopping
      await sendCommand('SET_MODE STEP_COUNTING');
      setIsTracking(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      console.log('✅ Distance skating session stopped');
      
      // Show session summary IN METERS
      Alert.alert(
        'Session Complete',
        `Distance: ${formatDistance(distance)} ${getDistanceUnit(distance)}\n` +
        `Duration: ${formatTime(duration)}\n` +
        `Max Speed: ${maxSpeed.toFixed(1)} km/h\n` +
        `Total Strides: ${strideCount}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to stop tracking');
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

  // Determine if we should show start or stop button
  const shouldShowStartButton = !isTracking && currentMode !== 'SD';
  const shouldShowStopButton = isTracking && currentMode === 'SD';

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={['#00B0FF', '#182848']} 
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
          <Text style={styles.headerTitle}>Distance Skating</Text>
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
        {/* Primary Metric Card - NOW IN METERS */}
        <Animated.View style={[styles.card, styles.primaryMetricCard, pulseStyle]}>
          <View style={styles.metricContainer}>
            <Text style={[styles.primaryMetricValue, { color: '#00B0FF' }]}>
              {formatDistance(distance)}
            </Text>
            <Text style={styles.primaryMetricUnit}>
              {getDistanceUnit(distance)}
            </Text>
          </View>
          <Text style={styles.primaryMetricLabel}>Distance Covered</Text>
          
          {/* Distance Progress */}
          <View style={styles.distanceProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min((distance % 1000) / 10, 100)}%`,
                    backgroundColor: '#00B0FF'
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {distance < 1000 ? `${Math.round(distance)}/1000 m` : `${Math.floor(distance / 1000)} km ${Math.round(distance % 1000)} m`}
            </Text>
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
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </Animated.View>

        {/* Control Buttons */}
        {shouldShowStartButton && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={startTracking}
            activeOpacity={0.8}
            disabled={!isConnected}
          >
            <LinearGradient 
              colors={['#00B0FF', darkenColor('#00B0FF', 20)]} 
              style={[
                styles.gradientButton,
                !isConnected && styles.disabledButton
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="play" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                {isConnected ? 'Start Session' : 'Connect Device First'}
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

        {/* Speed Metrics Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Speed Analytics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="speedometer" size={24} color="#4CD964" />
              <Text style={styles.statValue}>{speed.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Current Speed</Text>
              <Text style={styles.statSubLabel}>km/h</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="trending-up" size={24} color="#FF3B30" />
              <Text style={styles.statValue}>{maxSpeed.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Max Speed</Text>
              <Text style={styles.statSubLabel}>km/h</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#00B0FF" />
              <Text style={styles.statValue}>{formatTime(duration)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="fire" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>
        </View>

        {/* Skating Metrics Card - UPDATED FOR METERS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skating Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="walk" size={24} color="#AF52DE" />
              <Text style={styles.statValue}>{strideCount}</Text>
              <Text style={styles.statLabel}>Strides</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="ruler" size={24} color="#34C759" />
              <Text style={styles.statValue}>{avgStrideLength}</Text>
              <Text style={styles.statLabel}>Avg Stride</Text>
              <Text style={styles.statSubLabel}>meters</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="gauge" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{currentPace}</Text>
              <Text style={styles.statLabel}>Current Pace</Text>
              <Text style={styles.statSubLabel}>min/km</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="flag-checkered" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{laps}</Text>
              <Text style={styles.statLabel}>Laps</Text>
            </View>
          </View>
        </View>

        {/* Distance Progress Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Distance Progress</Text>
          <View style={styles.distanceBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Today</Text>
              <Text style={styles.breakdownValue}>{formatDistance(distance)}</Text>
              <Text style={styles.breakdownUnit}>{getDistanceUnit(distance)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Session</Text>
              <Text style={styles.breakdownValue}>{formatDistance(distance)}</Text>
              <Text style={styles.breakdownUnit}>{getDistanceUnit(distance)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Avg Speed</Text>
              <Text style={styles.breakdownValue}>
                {duration > 0 ? (distance / duration).toFixed(1) : '0.0'}
              </Text>
              <Text style={styles.breakdownUnit}>m/s</Text>
            </View>
          </View>
        </View>

        {/* Session Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={styles.statusBadge}>
              <View 
                style={[
                  styles.statusDot,
                  { 
                    backgroundColor: isTracking && currentMode === 'SD' ? '#4CD964' : 
                                   isConnected ? '#FF9500' : '#FF3B30' 
                  }
                ]} 
              />
              <Text style={styles.infoValue}>
                {isTracking && currentMode === 'SD' ? 'Active' : 
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Distance:</Text>
            <Text style={styles.infoValue}>
              {formatDistance(distance)} {getDistanceUnit(distance)}
            </Text>
          </View>
        </View>

        {/* Connection Help Card */}
        {!isConnected && (
          <View style={[styles.card, styles.helpCard]}>
            <MaterialCommunityIcons name="bluetooth-connect" size={32} color="#007AFF" />
            <Text style={styles.helpTitle}>Device Not Connected</Text>
            <Text style={styles.helpText}>
              Please connect to your skating band from the Devices screen to start tracking your distance skating session.
            </Text>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => navigation.navigate('Devices')}
            >
              <Text style={styles.helpButtonText}>Go to Devices</Text>
            </TouchableOpacity>
          </View>
        )}
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
    shadowColor: '#00B0FF',
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
    textShadowColor: 'rgba(0, 176, 255, 0.2)',
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
  distanceProgress: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
    borderColor: 'rgba(0, 176, 255, 0.1)',
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
  distanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#182848',
    marginBottom: 4,
  },
  breakdownUnit: {
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

export default DistanceSkatingScreenSk;