import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SkatingTrackingScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();

  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [strideRate, setStrideRate] = useState(0);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    let timer;
    if (isTracking) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
        setDistance(prev => prev + 0.01);
        setSpeed(Math.random() * 5 + 10);
        setCalories(prev => prev + 3);
        setStrideRate(Math.floor(Math.random() * 20 + 80));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTracking]);

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
    Alert.alert('Session Saved', 'Your skating session has been saved to your history');
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

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B6CB7', '#182848']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skating Tracker</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.controlsContainer}>
        {!isTracking ? (
          <TouchableOpacity style={styles.startButton} onPress={startTracking}>
            <Feather name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>Start Session</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.trackingControls}>
            <Animated.View style={[styles.pulseIndicator, pulseStyle]}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>RECORDING</Text>
            </Animated.View>
            <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
              <Feather name="square" size={24} color="#fff" />
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {(duration > 0 && !isTracking) && (
          <View style={styles.sessionActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetTracking}>
              <Feather name="refresh-ccw" size={20} color="#4B6CB7" />
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveSession}>
              <Feather name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save Session</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4B6CB7" />
            <Text style={styles.statValue}>{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="map-marker-distance" size={24} color="#4B6CB7" />
            <Text style={styles.statValue}>{distance.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Distance (km)</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="speedometer" size={24} color="#4B6CB7" />
            <Text style={styles.statValue}>{speed.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Speed (km/h)</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#4B6CB7" />
            <Text style={styles.statValue}>{calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.historyContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <MaterialCommunityIcons name="skate" size={20} color="#4B6CB7" />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyDate}>Today, 07:30 AM</Text>
              <Text style={styles.historyStats}>5.2 km • 45 min • 320 cal</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <MaterialCommunityIcons name="skate" size={20} color="#4B6CB7" />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyDate}>Yesterday, 06:15 PM</Text>
              <Text style={styles.historyStats}>3.8 km • 32 min • 240 cal</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  header: {
    paddingTop: Dimensions.get('window').height * 0.06,
    paddingHorizontal: '5%',
    paddingBottom: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: { fontSize: width * 0.055, fontWeight: '600', color: '#fff' },
  controlsContainer: { paddingHorizontal: '5%', marginTop: '5%' },
  startButton: {
    backgroundColor: '#4B6CB7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: width * 0.045, fontWeight: '600', marginLeft: '2.5%' },
  trackingControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pulseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 20,
  },
  recordingDot: { width: width * 0.025, height: width * 0.025, borderRadius: width * 0.0125, backgroundColor: '#FF3B30', marginRight: '2%' },
  recordingText: { color: '#FF3B30', fontWeight: '600', fontSize: width * 0.035 },
  stopButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4%',
    borderRadius: 12,
    flex: 1,
    marginLeft: '2.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionActions: { flexDirection: 'row', marginTop: '2.5%' },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3%',
    borderRadius: 12,
    flex: 1,
    marginRight: '2.5%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: { color: '#4B6CB7', fontSize: width * 0.04, fontWeight: '600', marginLeft: '2%' },
  saveButton: {
    backgroundColor: '#32CD32',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3%',
    borderRadius: 12,
    flex: 1,
  },
  statsContainer: { paddingHorizontal: '5%', paddingVertical: '4%' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '4%',
    width: (width - width * 0.15) / 2,
    height: width * 0.3,
    marginBottom: '4%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: width * 0.06, fontWeight: 'bold', color: '#333', marginVertical: '2%' },
  statLabel: { fontSize: width * 0.035, color: '#666' },
  historyContainer: { flex: 1, paddingHorizontal: '5%', marginTop: '2.5%' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3%' },
  sectionTitle: { fontSize: width * 0.045, fontWeight: '600', color: '#333' },
  seeAllText: { fontSize: width * 0.035, color: '#4B6CB7', fontWeight: '500' },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyIcon: {
    backgroundColor: 'rgba(75, 108, 183, 0.1)',
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
  },
  historyDetails: { flex: 1 },
  historyDate: { fontSize: width * 0.04, color: '#333', fontWeight: '500' },
  historyStats: { fontSize: width * 0.035, color: '#666', marginTop: '1%' },
});

export default SkatingTrackingScreen;
