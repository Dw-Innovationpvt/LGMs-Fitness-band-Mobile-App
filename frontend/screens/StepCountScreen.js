import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  useWindowDimensions,
  Modal,
  TextInput
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressChart } from 'react-native-chart-kit';
// import { useBLEStore } from './components/bleStore';

import { useBLEStore } from '../store/augBleStore';

const { width } = Dimensions.get('window');

const StepCountScreen = ({ navigation }) => {
  const { sendCommand, data } = useBLEStore();
  const { width, height } = useWindowDimensions();
  
  // State for UI elements
  const [isSyncing, setIsSyncing] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [selectedTab, setSelectedTab] = useState('today');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [stepGoal, setStepGoal] = useState(10000);
  const [tempGoal, setTempGoal] = useState('10000');

  // Extract data from BLE with fallback values
  const stepData = data && data.mode === 'S' ? {
    steps: data.stepCount || 0,
    distance: data.walkingDistance || 0,
    strideCount: data.strideCount || 0,
    speed: data.speed || 0,
    mode: data.mode
  } : {
    steps: 0,
    distance: 0,
    strideCount: 0,
    speed: 0,
    mode: 'N/A'
  };

  // Calculate derived metrics
  const distanceInKm = +(stepData.distance / 1000).toFixed(2);
  const avgSpeed = stepData.speed || 4.8; // km/h
  const metValue = avgSpeed < 3 ? 2.9 : avgSpeed < 4 ? 3.3 : 3.8;
  const calories = Math.round(distanceInKm * metValue * 70 / 1.6); // Assuming 70kg person

  // Set mode when component mounts
  useEffect(() => {
    sendCommand('SET_MODE STEP_COUNTING');
    return () => sendCommand('SET_MODE SKATING_SPEED');
  }, []);

  // Chart data
  const chartData = {
    labels: ["Steps"],
    data: [stepData.steps/stepGoal],
    colors: ["#4B6CB7"]
  };

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(75, 108, 183, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#4B6CB7"
    }
  };

  useEffect(() => {
    if (isSyncing) {
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      animation.setValue(0);
    }
  }, [isSyncing]);

  const syncWithDevice = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  const rotateStyle = {
    transform: [{
      rotate: animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })
    }]
  };

  const handleGoalSave = () => {
    const newGoal = parseInt(tempGoal) || 10000;
    setStepGoal(newGoal);
    setShowGoalModal(false);
  };

  const renderDailyStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={styles.goalHeader}>
          <MaterialCommunityIcons name="walk" size={24} color="#4B6CB7" />
          <TouchableOpacity onPress={() => setShowGoalModal(true)}>
            <Feather name="edit-2" size={18} color="#4B6CB7" />
          </TouchableOpacity>
        </View>
        <Text style={styles.statValue}>{stepData.steps.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Steps</Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#4B6CB7', '#6B8CE8']}
            style={[styles.progressFill, { width: `${Math.min(100, (stepData.steps/stepGoal)*100)}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((stepData.steps/stepGoal)*100)}% of {stepGoal.toLocaleString()} goal
        </Text>
      </View>

      <View style={styles.statCard}>
        <MaterialCommunityIcons name="map-marker-distance" size={24} color="#4B6CB7" />
        <Text style={styles.statValue}>{distanceInKm}</Text>
        <Text style={styles.statLabel}>Kilometers</Text>
      </View>

      <View style={styles.statCard}>
        <MaterialCommunityIcons name="speedometer" size={24} color="#4B6CB7" />
        <Text style={styles.statValue}>{stepData.speed.toFixed(2)}</Text>
        <Text style={styles.statLabel}>Speed (m/s)</Text>
      </View>

      <View style={styles.statCard}>
        <MaterialCommunityIcons name="fire" size={24} color="#4B6CB7" />
        <Text style={styles.statValue}>{calories}</Text>
        <Text style={styles.statLabel}>Calories Burned</Text>
      </View>
    </View>
  );

  const renderWeeklyStats = () => (
    <View style={styles.weeklyContainer}>
      <Text style={styles.sectionTitle}>Weekly Progress</Text>
      <View style={styles.chartContainer}>
        <ProgressChart
          data={chartData}
          width={width - 40}
          height={220}
          strokeWidth={16}
          radius={80}
          chartConfig={chartConfig}
          hideLegend={true}
        />
        <View style={styles.chartCenterText}>
          <Text style={styles.chartPercentage}>{Math.round((stepData.steps/stepGoal)*100)}%</Text>
          <Text style={styles.chartLabel}>Daily Goal</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4B6CB7', '#182848']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step Count</Text>
        <TouchableOpacity onPress={syncWithDevice}>
          <Animated.View style={rotateStyle}>
            <Feather 
              name="refresh-cw" 
              size={24} 
              color="#fff" 
              style={isSyncing ? null : { opacity: 0.8 }}
            />
          </Animated.View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'today' && styles.activeTab]}
          onPress={() => setSelectedTab('today')}
        >
          <Text style={[styles.tabText, selectedTab === 'today' && styles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'weekly' && styles.activeTab]}
          onPress={() => setSelectedTab('weekly')}
        >
          <Text style={[styles.tabText, selectedTab === 'weekly' && styles.activeTabText]}>Weekly</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.rawDataContainer}>
        <Text style={styles.rawDataTitle}>Raw Step Data</Text>
        <View style={styles.rawDataContent}>
          <Text style={styles.rawDataText}>
            {JSON.stringify(data, null, 2) || 'No data available'}
          </Text>
        </View>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedTab === 'today' ? renderDailyStats() : renderWeeklyStats()}

        {/* Activity History */}
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ActivityHistory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyCard}>
            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyDate}>Today</Text>
                <Text style={styles.historyStats}>
                  {stepData.steps.toLocaleString()} steps • {distanceInKm} km • {stepData.speed.toFixed(2)} m/s
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyDate}>Yesterday</Text>
                <Text style={styles.historyStats}>8,542 steps • 4.1 km • 1.2 m/s</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyDate}>2 days ago</Text>
                <Text style={styles.historyStats}>7,891 steps • 3.8 km • 1.1 m/s</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Goal Setting Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Daily Step Goal</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tempGoal}
                onChangeText={setTempGoal}
                placeholder="Enter step goal"
              />
              <Text style={styles.inputLabel}>steps per day</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleGoalSave}
              >
                <Text style={styles.saveButtonText}>Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};






const styles = StyleSheet.create({

   rawDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rawDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B6CB7',
    marginBottom: 10,
  },
  rawDataContent: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  rawDataText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#333',
  },


  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
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
  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: '600',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginTop: '5%',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: '3%',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4B6CB7',
  },
  tabText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollContent: {
    paddingBottom: '10%',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    width: width > 400 ? '48%' : '100%',
    marginBottom: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: '2%',
  },
  statLabel: {
    fontSize: width * 0.035,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginTop: '3%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: width * 0.03,
    color: '#4B6CB7',
    marginTop: '1%',
    fontWeight: '500',
  },
  weeklyContainer: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartCenterText: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartPercentage: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  chartLabel: {
    fontSize: width * 0.035,
    color: '#666',
  },
  historyContainer: {
    paddingHorizontal: '5%',
    marginTop: '2.5%',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
  },
  seeAllText: {
    color: '#4B6CB7',
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '5%',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
    marginBottom: '8%',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: '8%',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#4B6CB7',
    padding: '3%',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginBottom: '2%',
  },
  inputLabel: {
    textAlign: 'center',
    color: '#666',
    fontSize: width * 0.035,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  modalButton: {
    padding: '4%',
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4B6CB7',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default StepCountScreen;