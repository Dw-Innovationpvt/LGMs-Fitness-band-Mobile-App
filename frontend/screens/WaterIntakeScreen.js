import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  useWindowDimensions
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Circle } from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';
import useWaterStore from '../store/waterStore';

const WaterIntakeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width);

  // Zustand store integration
  const {
    intakes,
    todayTotal,
    target,
    loading,
    error,
    fetchTarget,
    fetchTodayTotal,
    addIntake,
    updateTarget,
    getProgress
  } = useWaterStore();

  const [inputValue, setInputValue] = useState('');
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [animation] = useState(new Animated.Value(0));

  // Initialize data
  useEffect(() => {
    fetchTodayTotal();
    fetchTarget();
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const animateProgress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  const handleAddWater = async (amount = null) => {
    const intakeAmount = amount || parseInt(inputValue);
    if (intakeAmount > 0) {
      const result = await addIntake(intakeAmount);
      if (result.success) {
        setInputValue('');
        animateProgress();
      }
    }
  };

  const handleUpdateGoal = async () => {
    const parsedGoal = parseInt(goalInput);
    if (parsedGoal > 0) {
      const result = await updateTarget(parsedGoal);
      if (result.success) {
        setGoalInput('');
        setGoalModalVisible(false);
        animateProgress();
      }
    }
  };

  // Format intake history for display
  const intakeHistory = intakes.map(intake => ({
    amount: intake.amount,
    timestamp: new Date(intake.date)
  }));

  const quickAmounts = [200, 250, 300, 500];
  const progress = getProgress() / 100;
  const percentage = Math.round(getProgress());

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4B6CB7', '#182848']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Intake</Text>
        <TouchableOpacity onPress={() => setGoalModalVisible(true)}>
          <Feather name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircleContainer}>
            <Circle
              size={width * 0.6}
              progress={progress}
              color="#00BFFF"
              thickness={15}
              unfilledColor="#E0F7FA"
              borderWidth={0}
              strokeCap="round"
            />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressPercentage}>{percentage}%</Text>
              <Text style={styles.progressAmount}>
                {todayTotal}ml / {target}ml
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddContainer}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickButtonsRow}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => handleAddWater(amount)}
                disabled={loading}
              >
                <Text style={styles.quickButtonText}>+{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount in ml"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddWater()}
              disabled={!inputValue || loading}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Intakes</Text>
          {intakes.length > 0 ? (
            <FlatList
              data={intakeHistory.slice(0, 5)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <MaterialCommunityIcons name="cup-water" size={20} color="#00BFFF" />
                  </View>
                  <Text style={styles.historyAmount}>{item.amount} ml</Text>
                  <Text style={styles.historyTime}>
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyHistory}>No recent water intake recorded</Text>
          )}
        </View>
      </ScrollView>

      {/* Goal Setting Modal */}
      <Modal
        visible={goalModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Daily Water Goal</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`Current goal: ${target}ml`}
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={goalInput}
              onChangeText={setGoalInput}
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setGoalModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateGoal}
                disabled={!goalInput || loading}
              >
                <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Goal'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


// import React, { useEffect, useState } from 'react';
// import {Alert,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   Modal,
//   ScrollView,
//   Dimensions,
//   Animated,
//   Easing,
//   useWindowDimensions
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { Circle } from 'react-native-progress';
// import { LinearGradient } from 'expo-linear-gradient';
// import useWaterStore from '../store/waterStore';

// // import { useAuthStore } from '../store/authStore';
// const WaterIntakeScreen = ({ navigation }) => {
//   const { width, height } = useWindowDimensions();
//   const styles = createStyles(width);

//   const [waterIntake, setWaterIntake] = useState(1200);
//   const [dailyGoal, setDailyGoal] = useState(3000);
//   const [inputValue, setInputValue] = useState('');
//   const [history, setHistory] = useState([
//     { amount: 400, timestamp: new Date(Date.now() - 3600000) },
//     { amount: 300, timestamp: new Date(Date.now() - 7200000) },
//     { amount: 500, timestamp: new Date(Date.now() - 10800000) },
//   ]);
//   const [goalModalVisible, setGoalModalVisible] = useState(false);
//   const [goalInput, setGoalInput] = useState('');
//   const [animation] = useState(new Animated.Value(0));

//   // backend integration
//         // const { user, isLoading, postWater, token } = useAuthStore();
//     const { 
//     intakes, 
//     todayTotal, 
//     target, 
//     fetchIntakes, 
//     fetchTodayTotal, 
//     fetchTarget 
//   } = useWaterStore();

//   useEffect(() => {
//     fetchIntakes();
//     fetchTodayTotal();
//     fetchTarget();
//   }, []);

//   // useEffect(() => {
//   //   console.log('WaterIntakeScreen mounted');
//   //   console.log('User:', user);
//   //   console.log('Token:', token);
//   // }, []);
//   const animateProgress = () => {
//     Animated.timing(animation, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true
//     }).start();
//   };

//   const addWater = async(amount = null) => {
//     amount = 1000; // Default amount for testing
//     // const res_res =  postWater({ amount: 100 })
//     const date = new Date().now();
//             const result = await postWater(amount, date);
//                 if (!result.success) Alert.alert("Error", result.error);
//                 if (result.success) {
//                   Alert.alert("Success", "Account created successfully!");
//                   navigation.navigate('SignIn');
//                 }
//     const parsedAmount = amount || parseInt(inputValue);
//     if (parsedAmount > 0) {
//       const timestamp = new Date();
//       setWaterIntake(prev => prev + parsedAmount);
//       setHistory(prev => [{ amount: parsedAmount, timestamp }, ...prev]);
//       setInputValue('');
//       animateProgress();
//     }
//   };

//   const updateGoal = () => {
//     const parsedGoal = parseInt(goalInput);
//     if (parsedGoal > 0) {
//       setDailyGoal(parsedGoal);
//       setGoalInput('');
//       setGoalModalVisible(false);
//       animateProgress();
//     }
//   };

//   const getAverage = (days) => {
//     const now = new Date();
//     const filtered = history.filter(entry => {
//       const diff = (now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24);
//       return diff <= days;
//     });
//     const daily = {};
//     filtered.forEach(entry => {
//       const date = new Date(entry.timestamp).toDateString();
//       daily[date] = (daily[date] || 0) + entry.amount;
//     });
//     const total = Object.values(daily).reduce((a, b) => a + b, 0);
//     return total / days;
//   };

//   const progress = Math.min(waterIntake / dailyGoal, 1);
//   const percentage = Math.round(progress * 100);
//   const quickAmounts = [200, 250, 300, 500];

//   return (
//     <View style={styles.container}>
//       {/* Header         colors={['#4B6CB7', '#182848']} */}
//       <LinearGradient
//         colors={['orange', 'yellow']}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Feather name="arrow-left" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Water Intake</Text>
//         <TouchableOpacity onPress={() => setGoalModalVisible(true)}>
//           <Feather name="settings" size={24} color="#fff" />
//         </TouchableOpacity>
//       </LinearGradient>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Progress Section */}
//         <View style={styles.progressContainer}>
//           <View style={styles.progressCircleContainer}>
//             <Circle
//               size={width * 0.6}
//               progress={progress}
//               color="#00BFFF"
//               thickness={15}
//               unfilledColor="#E0F7FA"
//               borderWidth={0}
//               strokeCap="round"
//             />
//             <View style={styles.progressTextContainer}>
//               <Text style={styles.progressPercentage}>{percentage}%</Text>
//               <Text style={styles.progressAmount}>
//                 {waterIntake}ml / {dailyGoal}ml
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Quick Add Buttons */}
//         <View style={styles.quickAddContainer}>
//           <Text style={styles.sectionTitle}>Quick Add</Text>
//           <View style={styles.quickButtonsRow}>
//             {quickAmounts.map((amount) => (
//               <TouchableOpacity
//                 key={amount}
//                 style={styles.quickButton}
//                 onPress={() => addWater(amount)}
//               >
//                 <Text style={styles.quickButtonText}>+{amount}ml</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Custom Input */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.sectionTitle}>Custom Amount</Text>
//           <View style={styles.inputRow}>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter amount in ml"
//               placeholderTextColor="#999"
//               keyboardType="numeric"
//               value={inputValue}
//               onChangeText={setInputValue}
//             />
//             <TouchableOpacity
//               style={styles.addButton}
//               onPress={() => addWater()}
//               disabled={!inputValue}
//             >
//               <MaterialCommunityIcons name="plus" size={24} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Stats Cards */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <MaterialCommunityIcons name="calendar-today" size={24} color="#4B6CB7" />
//             <Text style={styles.statValue}>{getAverage(1).toFixed(0)}ml</Text>
//             <Text style={styles.statLabel}>Today's Avg</Text>
//           </View>
//           <View style={styles.statCard}>
//             <MaterialCommunityIcons name="calendar-week" size={24} color="#4B6CB7" />
//             <Text style={styles.statValue}>{getAverage(7).toFixed(0)}ml</Text>
//             <Text style={styles.statLabel}>Weekly Avg</Text>
//           </View>
//           <View style={styles.statCard}>
//             <MaterialCommunityIcons name="calendar-month" size={24} color="#4B6CB7" />
//             <Text style={styles.statValue}>{getAverage(30).toFixed(0)}ml</Text>
//             <Text style={styles.statLabel}>Monthly Avg</Text>
//           </View>
//         </View>

//         {/* History Section */}
//         <View style={styles.historyContainer}>
//           <Text style={styles.sectionTitle}>Recent Intakes</Text>
//           {history.length > 0 ? (
//             <FlatList
//               data={history.slice(0, 5)}
//               keyExtractor={(_, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.historyItem}>
//                   <View style={styles.historyIcon}>
//                     <MaterialCommunityIcons name="cup-water" size={20} color="#00BFFF" />
//                   </View>
//                   <Text style={styles.historyAmount}>{item.amount} ml</Text>
//                   <Text style={styles.historyTime}>
//                     {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </Text>
//                 </View>
//               )}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.emptyHistory}>No recent water intake recorded</Text>
//           )}
//         </View>
//       </ScrollView>

//       {/* Goal Setting Modal */}
//       <Modal
//         visible={goalModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setGoalModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Set Daily Water Goal</Text>
//             <TextInput
//               style={styles.modalInput}
//               placeholder="Enter goal in ml"
//               placeholderTextColor="#999"
//               keyboardType="numeric"
//               value={goalInput}
//               onChangeText={setGoalInput}
//               autoFocus={true}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setGoalModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.saveButton]}
//                 onPress={updateGoal}
//                 disabled={!goalInput}
//               >
//                 <Text style={styles.saveButtonText}>Save Goal</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

const createStyles = (width) => StyleSheet.create({
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#333',
  },
  progressAmount: {
    fontSize: width * 0.04,
    color: '#666',
    marginTop: 4,
  },
  quickAddContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickButton: {
    backgroundColor: '#E0F7FA',
    padding: 14,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#00BFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#00BFFF',
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'center',
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historyIcon: {
    backgroundColor: '#E0F7FA',
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: width * 0.045,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyAmount: {
    flex: 1,
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
  },
  historyTime: {
    fontSize: width * 0.035,
    color: '#666',
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: 14,
    fontSize: width * 0.04,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FB',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4B6CB7',
    marginLeft: 10,
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

export default WaterIntakeScreen;