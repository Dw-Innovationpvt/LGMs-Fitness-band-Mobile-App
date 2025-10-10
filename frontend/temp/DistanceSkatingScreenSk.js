import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, Alert, ScrollView, Dimensions, StyleSheet,
  Modal, FlatList
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useBLEStore } from '../store/augBleStore';
import { useSessionStore, useDistanceSkatingSessions, useLast7DaysData } from '../store/useSessionStore';
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

// Generate last 7 dates from today
const getLast7Days = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    let displayName;
    if (i === 0) displayName = 'Today';
    else if (i === 1) displayName = 'Yesterday';
    else displayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    dates.push({
      date: dateString,
      displayName,
      isToday: i === 0
    });
  }
  return dates;
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
  
  const { createSession, fetchSessionsByDate } = useSessionStore();
  const { distanceSessions, fetchDistanceSessions } = useDistanceSkatingSessions();
  const { getLast7DaysWithData, loading: sessionsLoading } = useLast7DaysData('SD');
  
  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDateData, setSelectedDateData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [last7Days, setLast7Days] = useState([]);
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
    setLast7Days(getLast7Days());
    loadInitialData();
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

  const loadInitialData = async () => {
    try {
      await fetchDistanceSessions();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

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
      // Save session data before stopping
      await saveCurrentSession();
      
      // Switch back to step counting mode when stopping
      await sendCommand('SET_MODE STEP_COUNTING');
      setIsTracking(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      console.log('✅ Distance skating session stopped');
      
      // Refresh sessions data
      await fetchDistanceSessions();
      
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to stop tracking');
    }
  };

  const saveCurrentSession = async () => {
    try {
      if (distance > 0 && duration > 0) {
        const sessionData = {
          deviceId: 'ESP32C3_SkatingBand_001',
          mode: 'SD',
          startTime: new Date(Date.now() - (duration * 1000)).toISOString(),
          endTime: new Date().toISOString(),
          stepCount: 0,
          walkingDistance: 0,
          strideCount: strideCount,
          skatingDistance: distance,
          speedData: {
            currentSpeed: speed,
            maxSpeed: maxSpeed,
            minSpeed: minSpeed,
            averageSpeed: speed // Using current speed as average for simplicity
          },
          laps: laps,
          config: {
            wheelDiameter: 0.09,
            trackLength: 100.0
          }
        };

        await createSession(sessionData);
        console.log('✅ Session saved successfully');
        
        Alert.alert(
          'Session Saved!',
          `Distance: ${formatDistance(distance)} ${getDistanceUnit(distance)}\n` +
          `Duration: ${formatTime(duration)}\n` +
          `Max Speed: ${maxSpeed.toFixed(1)} km/h\n` +
          `Total Strides: ${strideCount}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session data');
    }
  };

  const viewPreviousData = () => {
    setShowHistoryModal(true);
  };

  const selectDate = async (date) => {
    try {
      setSelectedDate(date);
      const sessions = await fetchSessionsByDate(date, 'SD');
      setSelectedDateData(sessions);
    } catch (error) {
      console.error('Error fetching date data:', error);
      Alert.alert('Error', 'Failed to load data for selected date');
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

  // Calculate total metrics for selected date
  const calculateDateMetrics = (sessions) => {
    return sessions.reduce((acc, session) => ({
      totalDistance: acc.totalDistance + (session.skatingDistance || 0),
      totalDuration: acc.totalDuration + (session.duration || 0),
      maxSpeed: Math.max(acc.maxSpeed, session.speedData?.maxSpeed || 0),
      totalStrides: acc.totalStrides + (session.strideCount || 0),
      sessionCount: acc.sessionCount + 1
    }), {
      totalDistance: 0,
      totalDuration: 0,
      maxSpeed: 0,
      totalStrides: 0,
      sessionCount: 0
    });
  };

  const selectedDateMetrics = calculateDateMetrics(selectedDateData);

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
              <Text style={styles.buttonText}>Stop & Save Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* View Previous Data Button */}
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={viewPreviousData}
          activeOpacity={0.8}
        >
          <LinearGradient 
            colors={['#667eea', '#764ba2']} 
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="calendar" size={24} color="#fff" />
            <Text style={styles.buttonText}>View Previous Data</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Current Session Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Current Session</Text>
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

        {/* Additional current session metrics */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session Details</Text>
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

      {/* History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Previous Distance Skating Sessions</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Feather name="x" size={24} color="#182848" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateSelector}>
            <Text style={styles.dateSelectorTitle}>Select Date:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {last7Days.map((day, index) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dateButton,
                    selectedDate === day.date && styles.dateButtonSelected
                  ]}
                  onPress={() => selectDate(day.date)}
                >
                  <Text style={[
                    styles.dateButtonText,
                    selectedDate === day.date && styles.dateButtonTextSelected
                  ]}>
                    {day.displayName}
                  </Text>
                </TouchableOpacity>
              ))}
                      </ScrollView>
          </View>

          {selectedDate && (
            <View style={styles.selectedDateSection}>
              <Text style={styles.selectedDateTitle}>
                Sessions for {selectedDate}
              </Text>
              
              {selectedDateData.length === 0 ? (
                <View style={styles.noDataContainer}>
                  <MaterialCommunityIcons name="skateboarding" size={48} color="#CCCCCC" />
                  <Text style={styles.noDataText}>No distance skating sessions</Text>
                  <Text style={styles.noDataSubText}>on this date</Text>
                </View>
              ) : (
                <ScrollView style={styles.sessionsList}>
                  {/* Date Summary */}
                  <View style={styles.dateSummaryCard}>
                    <Text style={styles.dateSummaryTitle}>Date Summary</Text>
                    <View style={styles.dateSummaryGrid}>
                      <View style={styles.dateSummaryItem}>
                        <Text style={styles.dateSummaryValue}>{selectedDateMetrics.sessionCount}</Text>
                        <Text style={styles.dateSummaryLabel}>Sessions</Text>
                      </View>
                      <View style={styles.dateSummaryItem}>
                        <Text style={styles.dateSummaryValue}>
                          {formatDistance(selectedDateMetrics.totalDistance)}
                        </Text>
                        <Text style={styles.dateSummaryLabel}>Distance</Text>
                        <Text style={styles.dateSummaryUnit}>
                          {getDistanceUnit(selectedDateMetrics.totalDistance)}
                        </Text>
                      </View>
                      <View style={styles.dateSummaryItem}>
                        <Text style={styles.dateSummaryValue}>
                          {formatTime(selectedDateMetrics.totalDuration)}
                        </Text>
                        <Text style={styles.dateSummaryLabel}>Duration</Text>
                      </View>
                      <View style={styles.dateSummaryItem}>
                        <Text style={styles.dateSummaryValue}>
                          {selectedDateMetrics.maxSpeed.toFixed(1)}
                        </Text>
                        <Text style={styles.dateSummaryLabel}>Max Speed</Text>
                        <Text style={styles.dateSummaryUnit}>km/h</Text>
                      </View>
                    </View>
                  </View>

                  {/* Individual Sessions */}
                  <Text style={styles.sessionsListTitle}>Individual Sessions</Text>
                  {selectedDateData.map((session, index) => (
                    <View key={session._id || index} style={styles.sessionCard}>
                      <View style={styles.sessionHeader}>
                        <Text style={styles.sessionTime}>
                          {new Date(session.startTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Text>
                        <Text style={styles.sessionDuration}>
                          {formatTime(session.duration)}
                        </Text>
                      </View>
                      
                      <View style={styles.sessionMetrics}>
                        <View style={styles.sessionMetric}>
                          <Text style={styles.sessionMetricValue}>
                            {formatDistance(session.skatingDistance)}
                          </Text>
                          <Text style={styles.sessionMetricLabel}>
                            Distance ({getDistanceUnit(session.skatingDistance)})
                          </Text>
                        </View>
                        
                        <View style={styles.sessionMetric}>
                          <Text style={styles.sessionMetricValue}>
                            {session.speedData?.maxSpeed?.toFixed(1) || '0.0'}
                          </Text>
                          <Text style={styles.sessionMetricLabel}>Max Speed (km/h)</Text>
                        </View>
                        
                        <View style={styles.sessionMetric}>
                          <Text style={styles.sessionMetricValue}>
                            {session.strideCount || 0}
                          </Text>
                          <Text style={styles.sessionMetricLabel}>Strides</Text>
                        </View>
                      </View>
                      
                      {session.laps > 0 && (
                        <View style={styles.sessionLaps}>
                          <MaterialCommunityIcons name="flag-checkered" size={16} color="#007AFF" />
                          <Text style={styles.sessionLapsText}>
                            {session.laps} lap{session.laps !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </Modal>
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
  historyButton: {
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#182848',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  dateSelector: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#182848',
    marginBottom: 15,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateButtonSelected: {
    backgroundColor: '#00B0FF',
    borderColor: '#00B0FF',
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dateButtonTextSelected: {
    color: '#fff',
  },
  selectedDateSection: {
    flex: 1,
    padding: 20,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#182848',
    marginBottom: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  noDataSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  sessionsList: {
    flex: 1,
  },
  dateSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dateSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#182848',
    marginBottom: 15,
  },
  dateSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  dateSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00B0FF',
    marginBottom: 4,
  },
  dateSummaryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dateSummaryUnit: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  sessionsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#182848',
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#182848',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sessionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sessionMetric: {
    alignItems: 'center',
    flex: 1,
  },
  sessionMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#182848',
    marginBottom: 4,
  },
  sessionMetricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sessionLaps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  sessionLapsText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default DistanceSkatingScreenSk;