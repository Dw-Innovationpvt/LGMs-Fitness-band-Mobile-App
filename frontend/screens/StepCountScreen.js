import React, { useState, useEffect } from 'react';
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

const { width } = Dimensions.get('window');

const StepCountScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [steps, setSteps] = useState(7243);
  const [distance, setDistance] = useState(5.2);
  const [avgSpeed, setAvgSpeed] = useState(4.8); // km/h
  const [calories, setCalories] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [selectedTab, setSelectedTab] = useState('today');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [stepGoal, setStepGoal] = useState(10000);
  const [tempGoal, setTempGoal] = useState('10000');

  // Calculate calories based on distance and speed (MET formula)
  useEffect(() => {
    // MET values: 2.9 for slow walk (2 mph), 3.3 for moderate (3 mph), 3.8 for brisk (4 mph)
    const metValue = avgSpeed < 3 ? 2.9 : avgSpeed < 4 ? 3.3 : 3.8;
    const calculatedCalories = Math.round(distance * metValue * 70 / 1.6); // Assuming 70kg person
    setCalories(calculatedCalories);
  }, [distance, avgSpeed]);

  // Mock data for the chart
  const chartData = {
    labels: ["Steps"],
    data: [steps/stepGoal],
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
      // Simulate data update after sync
      const newSteps = Math.min(steps + 500 + Math.floor(Math.random() * 300), stepGoal);
      const newDistance = +(distance + 0.3 + Math.random() * 0.2).toFixed(1);
      const newSpeed = +(4.5 + Math.random() * 1.5).toFixed(1);
      
      setSteps(newSteps);
      setDistance(newDistance);
      setAvgSpeed(newSpeed);
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
        <Text style={styles.statValue}>{steps.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Steps</Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#4B6CB7', '#6B8CE8']}
            style={[styles.progressFill, { width: `${Math.min(100, (steps/stepGoal)*100)}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((steps/stepGoal)*100)}% of {stepGoal.toLocaleString()} goal
        </Text>
      </View>

      <View style={styles.statCard}>
        <MaterialCommunityIcons name="map-marker-distance" size={24} color="#4B6CB7" />
        <Text style={styles.statValue}>{distance}</Text>
        <Text style={styles.statLabel}>Kilometers</Text>
      </View>

      <View style={styles.statCard}>
        <MaterialCommunityIcons name="speedometer" size={24} color="#4B6CB7" />
        <Text style={styles.statValue}>{avgSpeed}</Text>
        <Text style={styles.statLabel}>Avg Speed (km/h)</Text>
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
          <Text style={styles.chartPercentage}>{Math.round((steps/stepGoal)*100)}%</Text>
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
                <Text style={styles.historyStats}>{steps.toLocaleString()} steps • {distance} km • {avgSpeed} km/h</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyDate}>Yesterday</Text>
                <Text style={styles.historyStats}>8,542 steps • 4.1 km • 4.2 km/h</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyDate}>2 days ago</Text>
                <Text style={styles.historyStats}>7,891 steps • 3.8 km • 3.9 km/h</Text>
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

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   Animated,
//   Easing,useWindowDimensions
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { ProgressChart } from 'react-native-chart-kit';

// const { width } = Dimensions.get('window');

// const StepCountScreen = ({ navigation }) => {
//     const { width, height } = useWindowDimensions();

//   const [steps, setSteps] = useState(7243);
//   const [distance, setDistance] = useState(5.2);
//   const [calories, setCalories] = useState(320);
//   const [activeMinutes, setActiveMinutes] = useState(45);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [animation] = useState(new Animated.Value(0));
//   const [selectedTab, setSelectedTab] = useState('today');

//   // Mock data for the chart
//   const chartData = {
//     labels: ["Steps"],
//     data: [0.72], // 7243/10000
//     colors: ["#4B6CB7"]
//   };

//   const chartConfig = {
//     backgroundColor: "#fff",
//     backgroundGradientFrom: "#fff",
//     backgroundGradientTo: "#fff",
//     decimalPlaces: 0,
//     color: (opacity = 1) => `rgba(75, 108, 183, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     style: {
//       borderRadius: 16
//     },
//     propsForDots: {
//       r: "6",
//       strokeWidth: "2",
//       stroke: "#4B6CB7"
//     }
//   };

//   useEffect(() => {
//     if (isSyncing) {
//       Animated.loop(
//         Animated.timing(animation, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.linear,
//           useNativeDriver: true
//         })
//       ).start();
//     } else {
//       animation.setValue(0);
//     }
//   }, [isSyncing]);

//   const syncWithDevice = () => {
//     setIsSyncing(true);
//     setTimeout(() => {
//       // Simulate data update after sync
//       setSteps(prev => Math.min(prev + 500, 10000));
//       setDistance(prev => +(prev + 0.3).toFixed(1));
//       setCalories(prev => prev + 20);
//       setActiveMinutes(prev => prev + 5);
//       setIsSyncing(false);
//     }, 2000);
//   };

//   const rotateStyle = {
//     transform: [{
//       rotate: animation.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg']
//       })
//     }]
//   };

//   const renderDailyStats = () => (
//     <View style={styles.statsContainer}>
//       <View style={styles.statCard}>
//         <MaterialCommunityIcons name="walk" size={24} color="#4B6CB7" />
//         <Text style={styles.statValue}>{steps.toLocaleString()}</Text>
//         <Text style={styles.statLabel}>Steps</Text>
//         <View style={styles.progressBar}>
//           <View style={[styles.progressFill, { width: `${(steps/10000)*100}%` }]} />
//         </View>
//         <Text style={styles.progressText}>{Math.round((steps/10000)*100)}% of goal</Text>
//       </View>

//       <View style={styles.statCard}>
//         <MaterialCommunityIcons name="map-marker-distance" size={24} color="#4B6CB7" />
//         <Text style={styles.statValue}>{distance}</Text>
//         <Text style={styles.statLabel}>Kilometers</Text>
//       </View>

//       <View style={styles.statCard}>
//         <MaterialCommunityIcons name="fire" size={24} color="#4B6CB7" />
//         <Text style={styles.statValue}>{calories}</Text>
//         <Text style={styles.statLabel}>Calories</Text>
//       </View>

//       <View style={styles.statCard}>
//         <MaterialCommunityIcons name="clock-outline" size={24} color="#4B6CB7" />
//         <Text style={styles.statValue}>{activeMinutes}</Text>
//         <Text style={styles.statLabel}>Active Minutes</Text>
//       </View>
//     </View>
//   );

//   const renderWeeklyStats = () => (
//     <View style={styles.weeklyContainer}>
//       <Text style={styles.sectionTitle}>Weekly Progress</Text>
//       <View style={styles.chartContainer}>
//         <ProgressChart
//           data={chartData}
//           width={width - 40}
//           height={220}
//           strokeWidth={16}
//           radius={80}
//           chartConfig={chartConfig}
//           hideLegend={true}
//         />
//         <View style={styles.chartCenterText}>
//           <Text style={styles.chartPercentage}>{Math.round((steps/10000)*100)}%</Text>
//           <Text style={styles.chartLabel}>Daily Goal</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#4B6CB7', '#182848']}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Feather name="arrow-left" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Step Count</Text>
//         <TouchableOpacity onPress={syncWithDevice}>
//           <Animated.View style={rotateStyle}>
//             <Feather 
//               name="refresh-cw" 
//               size={24} 
//               color="#fff" 
//               style={isSyncing ? null : { opacity: 0.8 }}
//             />
//           </Animated.View>
//         </TouchableOpacity>
//       </LinearGradient>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity 
//           style={[styles.tabButton, selectedTab === 'today' && styles.activeTab]}
//           onPress={() => setSelectedTab('today')}
//         >
//           <Text style={[styles.tabText, selectedTab === 'today' && styles.activeTabText]}>Today</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tabButton, selectedTab === 'weekly' && styles.activeTab]}
//           onPress={() => setSelectedTab('weekly')}
//         >
//           <Text style={[styles.tabText, selectedTab === 'weekly' && styles.activeTabText]}>Weekly</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {selectedTab === 'today' ? renderDailyStats() : renderWeeklyStats()}

//         {/* Activity History */}
//         <View style={styles.historyContainer}>
//           <Text style={styles.sectionTitle}>Recent Activity</Text>
          
//           <View style={styles.historyCard}>
//             <View style={styles.historyItem}>
//               <View style={styles.historyIcon}>
//                 <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
//               </View>
//               <View style={styles.historyDetails}>
//                 <Text style={styles.historyDate}>Today</Text>
//                 <Text style={styles.historyStats}>{steps.toLocaleString()} steps • {distance} km • {calories} cal</Text>
//               </View>
//               <Feather name="chevron-right" size={20} color="#999" />
//             </View>

//             <View style={styles.historyItem}>
//               <View style={styles.historyIcon}>
//                 <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
//               </View>
//               <View style={styles.historyDetails}>
//                 <Text style={styles.historyDate}>Yesterday</Text>
//                 <Text style={styles.historyStats}>8,542 steps • 4.1 km • 280 cal</Text>
//               </View>
//               <Feather name="chevron-right" size={20} color="#999" />
//             </View>

//             <View style={styles.historyItem}>
//               <View style={styles.historyIcon}>
//                 <MaterialCommunityIcons name="walk" size={20} color="#4B6CB7" />
//               </View>
//               <View style={styles.historyDetails}>
//                 <Text style={styles.historyDate}>2 days ago</Text>
//                 <Text style={styles.historyStats}>7,891 steps • 3.8 km • 240 cal</Text>
//               </View>
//               <Feather name="chevron-right" size={20} color="#999" />
//             </View>
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
//     paddingTop: Dimensions.get('window').height * 0.06,
//     paddingHorizontal: '5%',
//     paddingBottom: '5%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   headerTitle: {
//     fontSize: width * 0.055,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginHorizontal: '5%',
//     marginTop: '5%',
//     backgroundColor: '#E0E0E0',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: '3%',
//     alignItems: 'center',
//   },
//   activeTab: {
//     backgroundColor: '#4B6CB7',
//   },
//   tabText: {
//     fontSize: width * 0.04,
//     fontWeight: '600',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   scrollContent: {
//     paddingBottom: '10%',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: '5%',
//     paddingTop: '5%',
//   },
//   statCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '4%',
//     width: width > 400 ? '48%' : '100%',
//     marginBottom: '4%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   statValue: {
//     fontSize: width * 0.07,
//     fontWeight: 'bold',
//     color: '#333',
//     marginVertical: '2%',
//   },
//   statLabel: {
//     fontSize: width * 0.035,
//     color: '#666',
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 3,
//     marginTop: '3%',
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#4B6CB7',
//     borderRadius: 3,
//   },
//   progressText: {
//     fontSize: width * 0.03,
//     color: '#4B6CB7',
//     marginTop: '1%',
//     fontWeight: '500',
//   },
//   weeklyContainer: {
//     paddingHorizontal: '5%',
//     paddingTop: '5%',
//   },
//   sectionTitle: {
//     fontSize: width * 0.045,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: '4%',
//   },
//   chartContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '4%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   chartCenterText: {
//     position: 'absolute',
//     alignItems: 'center',
//   },
//   chartPercentage: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   chartLabel: {
//     fontSize: width * 0.035,
//     color: '#666',
//   },
//   historyContainer: {
//     paddingHorizontal: '5%',
//     marginTop: '2.5%',
//   },
//   historyCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   historyItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: '4%',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   historyIcon: {
//     backgroundColor: 'rgba(75, 108, 183, 0.1)',
//     width: width * 0.1,
//     height: width * 0.1,
//     borderRadius: width * 0.05,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: '3%',
//   },
//   historyDetails: { flex: 1 },
//   historyDate: { fontSize: width * 0.04, color: '#333', fontWeight: '500' },
//   historyStats: { fontSize: width * 0.035, color: '#666', marginTop: '1%' },
// });

// export default StepCountScreen;