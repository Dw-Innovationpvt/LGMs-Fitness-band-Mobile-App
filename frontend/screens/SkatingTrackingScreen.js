import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Alert,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SkatingTrackingScreen = ({ navigation, route }) => {
  const { skatingType = 'speed' } = route.params || {};
  const { width, height } = useWindowDimensions();

  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [strideRate, setStrideRate] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const timerRef = useRef(null);

  // Skating type configurations
  const skatingConfig = {
    speed: {
      title: 'Speed Skating',
      icon: 'speedometer',
      color: '#3a86ff',
      metrics: ['Speed', 'Stride Rate', 'Lap Time'],
      unit: 'km/h'
    },
    distance: {
      title: 'Distance Skating',
      icon: 'map-marker-distance',
      color: '#4cc9f0',
      metrics: ['Distance', 'Pace', 'Elevation'],
      unit: 'km'
    },
    freestyle: {
      title: 'Freestyle Skating',
      icon: 'skate',
      color: '#f72585',
      metrics: ['Tricks', 'Air Time', 'Style Points'],
      unit: ''
    }
  };

  const config = skatingConfig[skatingType] || skatingConfig.speed;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        updateMetrics();
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]);

  const updateMetrics = () => {
    setDuration(prev => prev + 1);
    
    // Update metrics based on skating type
    switch (skatingType) {
      case 'speed':
        setDistance(prev => +(prev + 0.0025).toFixed(4));
        setSpeed(+(Math.random() * 5 + 15).toFixed(1));
        setStrideRate(Math.floor(Math.random() * 20 + 90));
        setCalories(prev => prev + 4);
        break;
      case 'distance':
        setDistance(prev => +(prev + 0.01).toFixed(2));
        setSpeed(+(Math.random() * 2 + 10).toFixed(1));
        setCalories(prev => prev + 3);
        break;
      case 'freestyle':
        setDistance(prev => +(prev + 0.005).toFixed(3));
        setSpeed(+(Math.random() * 3 + 8).toFixed(1));
        setCalories(prev => prev + 5);
        break;
      default:
        setDistance(prev => +(prev + 0.01).toFixed(2));
        setSpeed(+(Math.random() * 5 + 10).toFixed(1));
        setCalories(prev => prev + 3);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    animatePulse();
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const resetTracking = () => {
    setIsTracking(false);
    setDuration(0);
    setDistance(0);
    setSpeed(0);
    setCalories(0);
    setStrideRate(0);
  };

  const saveSession = () => {
    Alert.alert('Session Saved', `Your ${config.title} session has been saved to your history`);
    resetTracking();
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
      scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] })
    }],
    opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] })
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderPrimaryMetric = () => {
    switch (skatingType) {
      case 'speed':
        return (
          <View style={styles.primaryMetricContainer}>
            <Text style={[styles.primaryMetricValue, { color: config.color }]}>
              {speed}
            </Text>
            <Text style={styles.primaryMetricUnit}>km/h</Text>
            <Text style={styles.primaryMetricLabel}>Current Speed</Text>
          </View>
        );
      case 'distance':
        return (
          <View style={styles.primaryMetricContainer}>
            <Text style={[styles.primaryMetricValue, { color: config.color }]}>
              {distance.toFixed(2)}
            </Text>
            <Text style={styles.primaryMetricUnit}>km</Text>
            <Text style={styles.primaryMetricLabel}>Distance Covered</Text>
          </View>
        );
      case 'freestyle':
        return (
          <View style={styles.primaryMetricContainer}>
            <Text style={[styles.primaryMetricValue, { color: config.color }]}>
              {Math.floor(duration / 5)}
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
              <Text style={styles.statValue}>{formatTime(Math.floor(3000 / (speed || 1)))}</Text>
              <Text style={styles.statLabel}>Lap Time</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="repeat" size={24} color={config.color} />
              <Text style={styles.statValue}>{strideRate}</Text>
              <Text style={styles.statLabel}>Stride Rate</Text>
            </View>
          </>
        );
      case 'distance':
        return (
          <>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="timer" size={24} color={config.color} />
              <Text style={styles.statValue}>{speed > 0 ? (60 / speed).toFixed(2) : '0.00'}</Text>
              <Text style={styles.statLabel}>Min/km</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="trending-up" size={24} color={config.color} />
              <Text style={styles.statValue}>12</Text>
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
              <Text style={styles.statValue}>8.5</Text>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.primaryMetricCard}>
        {renderPrimaryMetric()}
      </View>

      <View style={styles.controlsContainer}>
        {!isTracking ? (
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: config.color }]} 
            onPress={startTracking}
          >
            <Feather name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>Start Session</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.trackingControls}>
            <Animated.View style={[styles.pulseIndicator, pulseStyle]}>
              <View style={[styles.recordingDot, { backgroundColor: config.color }]} />
              <Text style={[styles.recordingText, { color: config.color }]}>RECORDING</Text>
            </Animated.View>
            <TouchableOpacity 
              style={[styles.stopButton, { backgroundColor: '#FF3B30' }]} 
              onPress={stopTracking}
            >
              <Feather name="square" size={24} color="#fff" />
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {(duration > 0 && !isTracking) && (
          <View style={styles.sessionActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetTracking}>
              <Feather name="refresh-ccw" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: config.color }]} 
              onPress={saveSession}
            >
              <Feather name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save Session</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.historyContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent {config.title} Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View style={[styles.historyIcon, { backgroundColor: `${config.color}20` }]}>
              <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyDate}>Today, 07:30 AM</Text>
              <Text style={styles.historyStats}>
                {skatingType === 'speed' ? `${speed.toFixed(1)} km/h • ${strideRate} strides` : 
                 skatingType === 'distance' ? `${distance.toFixed(2)} km • ${formatTime(duration)}` : 
                 `${Math.floor(duration/5)} tricks • ${calories} cal`}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </View>

          <View style={styles.historyItem}>
            <View style={[styles.historyIcon, { backgroundColor: `${config.color}20` }]}>
              <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyDate}>Yesterday, 06:15 PM</Text>
              <Text style={styles.historyStats}>
                {skatingType === 'speed' ? '15.2 km/h • 92 strides' : 
                 skatingType === 'distance' ? '3.8 km • 32 min' : 
                 '12 tricks • 240 cal'}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  scrollContent: {
    paddingBottom: 40 // Added padding to ensure content is visible
  },
  header: {
    paddingTop: Dimensions.get('window').height * 0.06,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#000' 
  },
  primaryMetricCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  controlsContainer: { 
    paddingHorizontal: 20, 
    marginTop: 20 
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 8 
  },
  trackingControls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
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
    marginRight: 8 
  },
  recordingText: { 
    fontWeight: '600', 
    fontSize: 14 
  },
  stopButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionActions: { 
    flexDirection: 'row', 
    marginTop: 10 
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  secondaryButtonText: { 
    color: '#666', 
    fontSize: 14, 
    fontWeight: '600', 
    marginLeft: 8 
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
  },
  statsContainer: { 
    paddingHorizontal: 20, 
    paddingVertical: 16 
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (Dimensions.get('window').width - 60) / 2,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    marginVertical: 8 
  },
  statLabel: { 
    fontSize: 14, 
    color: '#666' 
  },
  historyContainer: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333' 
  },
  seeAllText: { 
    fontSize: 14, 
    color: '#3a86ff', 
    fontWeight: '500' 
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 40, // Added margin to ensure visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    flex: 1 
  },
  historyDate: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: '500' 
  },
  historyStats: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4 
  },
});

export default SkatingTrackingScreen;