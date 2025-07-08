import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,
  ScrollView, Dimensions, Modal, SafeAreaView, TextInput
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store/authStore';
import useWaterStore from '../store/waterStore';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

  // 
    const { postMeals } = useAuthStore();
  // Water store integration
  const {
    todayTotal,
    target,
    addIntake,
    fetchTodayTotal,
        fetchTarget,
    loading: waterLoading,
    error: waterError
  } = useWaterStore();

  // calories realted
  const { totalCaloriesBurned, getWorkoutCount } = useAuthStore();

  const userName = 'Madan';
  const [modalVisible, setModalVisible] = useState(null);
  const [mealInputVisible, setMealInputVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('');
  const [mealItems, setMealItems] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const [dailyData, setDailyData] = useState({
    meals: [
      { id: '1', type: 'Breakfast', items: 'Oatmeal, Banana', calories: 350, time: '08:30 AM' },
      { id: '2', type: 'Lunch', items: 'Grilled Chicken, Rice, Salad', calories: 550, time: '01:15 PM' },
      { id: '3', type: 'Snack', items: 'Protein Shake', calories: 200, time: '04:45 PM' },
    ],
    waterIntake: [
      { id: '1', amount: '500ml', time: '08:30 AM' },
      { id: '2', amount: '250ml', time: '10:45 AM' },
      { id: '3', amount: '750ml', time: '01:15 PM' },
    ],
    goals: [
      { id: '1', title: 'Drink 2L water', completed: false },
      { id: '2', title: '10,000 steps', completed: true },
      { id: '3', title: '30 min workout', completed: true },
    ],
  });
   // Initialize water data
  useEffect(() => {
    fetchTodayTotal();
    fetchTarget();
    getWorkoutCount();
  }, []);

  // Handle water errors
  useEffect(() => {
    if (waterError) {
      Alert.alert('Water Error', waterError);
    }
  }, [waterError]);

  const handleAddWater = async () => {
    const result = await addIntake(400); // Add 400ml
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };


  // const [waterIntake, setWaterIntake] = useState(0);

  // const handleAddWater = () => {
  //   setWaterIntake(prev => prev + 400);
  // };

  const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const caloriesBurned = 600;
  const completedGoals = dailyData.goals.filter(goal => goal.completed).length;

  const handleMealCardPress = (mealType) => {
    setModalVisible(null);
    setCurrentMealType(mealType);
    console.log(mealType, "mealType");
    setMealInputVisible(true);
    
    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
  };

  const handleSaveMeal = async() => {
    if (mealItems.trim()) {
      const newMeal = {
        // id: Date.now().toString(),
        mealType: currentMealType,
        name: mealItems,
        time: currentTime,
        calories: 10 // You can add calorie calculation logic here
      };
      console.log(newMeal, "newMeal");

      // post this meal to the backend
        const responseWorkout = await postMeals(newMeal);
        console.log('Workout posted:', responseWorkout,'hui hui, posted bandara');

      setDailyData(prev => ({
        ...prev,
        meals: [...prev.meals, newMeal]
      }));
      
      setMealItems('');
      setMealInputVisible(false);
    }
  };

  const getMealColor = () => {
    switch (currentMealType) {
      case 'Breakfast':
        return '#FFF3E0';
      case 'Lunch':
        return '#E8F5E9';
      case 'Snack':
        return '#F3E5F5';
      case 'Dinner':
        return '#E3F2FD';
      default:
        return '#F5F5F5';
    }
  };

  const getMealIcon = () => {
    switch (currentMealType) {
      case 'Breakfast':
        return <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />;
      case 'Lunch':
        return <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />;
      case 'Snack':
        return <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />;
      case 'Dinner':
        return <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />;
      default:
        return <MaterialCommunityIcons name="food" size={24} color="#666" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Gradient */}
      <LinearGradient 
        colors={['#4B6CB7', '#182848']} 
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Top Header */}
        <View style={styles.headerSection}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', marginTop: 10 }}>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.headerText}>{userName}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <View style={styles.profileIcon}>
              <Feather name="user" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.topActions}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => setModalVisible('meal')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
              <MaterialCommunityIcons name="food" size={24} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Add Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('SetGoal')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
              <MaterialCommunityIcons name="target" size={24} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Set Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('PairDevice')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
              <MaterialCommunityIcons name="watch" size={24} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Pair Device</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Input Card (shown when adding a meal) */}
        {mealInputVisible && (
          <View style={[styles.card, styles.cardElevated, { backgroundColor: getMealColor() }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                {getMealIcon()}
                <Text style={styles.cardTitle}>Add {currentMealType}</Text>
              </View>
              <Text style={styles.timeText}>{currentTime}</Text>
            </View>
            
            <TextInput
              placeholder={`What did you have for ${currentMealType.toLowerCase()}?`}
              style={styles.input}
              value={mealItems}
              onChangeText={setMealItems}
              placeholderTextColor="#999"
              multiline
            />
            
            <View style={styles.mealButtonRow}>
              <TouchableOpacity 
                style={[styles.mealButton, { backgroundColor: '#E0E0E0' }]} 
                onPress={() => setMealInputVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.mealButtonText, { color: '#333' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.mealButton, { backgroundColor: '#1A2980' }]} 
                onPress={handleSaveMeal}
                activeOpacity={0.8}
              >
                <Text style={[styles.mealButtonText, { color: '#fff' }]}>Save {currentMealType}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Activity Card */}
        <View style={[styles.card, styles.cardElevated]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#1A2980" />
              <Text style={styles.cardTitle}>Today's Activity</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ActivityTracking')}>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
              <Text style={styles.summaryValue}>{totalCalories}</Text>
              <Text style={styles.summaryLabel}>Calories In</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
              {/* <Text style={styles.summaryValue}>{caloriesBurned}</Text> */}
              <Text style={styles.summaryValue}>{totalCaloriesBurned}</Text>
              <Text style={styles.summaryLabel}>Calories Out</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#FFF8E1' }]}>
              <MaterialCommunityIcons name="target" size={24} color="#FF9800" />
              <Text style={styles.summaryValue}>
                {completedGoals}/{dailyData.goals.length}
              </Text>
              <Text style={styles.summaryLabel}>Goals</Text>
            </View>
          </View>
        </View>

        {/* Water Card */}
        <View style={[styles.card, styles.cardElevated]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialCommunityIcons name="cup-water" size={20} color="#00B0FF" />
              <Text style={styles.cardTitle}>Water Intake</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.waterCardContent}>
            <View style={styles.waterInfo}>
              <View style={styles.intakeRow}>
                <Text style={styles.intakeText}>
                  {/* <Text style={styles.intakeBold}>{waterIntake}</Text> /4,000 ml */}
                  <Text style={styles.intakeBold}>{todayTotal}</Text> /{target} ml
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddWater}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>+ 400 ml</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.waterBottleContainer}>
              <View style={styles.waterBottle}>
                <View style={[
                  styles.waterFill,
                  { height: `${Math.min((todayTotal / target) * 100, 100)}%` }
                ]} />
              </View>
            </View>
          </View>
        </View>

        {/* Skating Tracking */}
        <View style={[styles.card, styles.cardElevated]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
              <Text style={styles.cardTitle}>Skating Tracking</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('SkatingTracking')}>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.subCardRow}>
            <View style={[styles.subCard, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
              <Text style={styles.subCardValue}>10.2</Text>
              <Text style={styles.subCardLabel}>Avg Speed</Text>
            </View>
            <View style={[styles.subCard, { backgroundColor: '#F3E5F5' }]}>
              <Feather name="repeat" size={24} color="#FF8C00" />
              <Text style={styles.subCardValue}>3,800</Text>
              <Text style={styles.subCardLabel}>Strides</Text>
            </View>
            <View style={[styles.subCard, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="zap" size={24} color="#FF2D55" />
              <Text style={styles.subCardValue}>89</Text>
              <Text style={styles.subCardLabel}>Stride Rate</Text>
            </View>
          </View>
        </View>

        {/* Step Count */}
        <View style={[styles.card, styles.cardElevated]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Feather name="activity" size={20} color="#00C853" />
              <Text style={styles.cardTitle}>Step Count</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('StepCount')}>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.subCardRow}>
            <View style={[styles.subCard, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="activity" size={24} color="#00C853" />
              <Text style={styles.subCardValue}>3,205</Text>
              <Text style={styles.subCardLabel}>Steps</Text>
            </View>
            <View style={[styles.subCard, { backgroundColor: '#F3E5F5' }]}>
              <Feather name="repeat" size={24} color="#5856D6" />
              <Text style={styles.subCardValue}>1,024</Text>
              <Text style={styles.subCardLabel}>Strides</Text>
            </View>
            <View style={[styles.subCard, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
              <Text style={styles.subCardValue}>145</Text>
              <Text style={styles.subCardLabel}>Calories</Text>
            </View>
          </View>
        </View>

        {/* Workout History */}
        <TouchableOpacity 
          style={[styles.card, styles.workoutCard, styles.cardElevated]}
          onPress={() => navigation.navigate('WorkoutHistory')}
          activeOpacity={0.8}
        >
          <View style={styles.workoutContent}>
            <MaterialCommunityIcons name="dumbbell" size={28} color="#FF2D55" />
            <Text style={styles.workoutText}>Workout History</Text>
            <Feather name="chevron-right" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal - Add Meal */}
      <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Meals</Text>
            
            <TouchableOpacity 
              style={[styles.mealCard, { backgroundColor: '#FFF3E0' }]}
              onPress={() => handleMealCardPress('Breakfast')}
            >
              <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />
              <Text style={styles.mealCardText}>Breakfast</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mealCard, { backgroundColor: '#E8F5E9' }]}
              onPress={() => handleMealCardPress('Lunch')}
            >
              <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
              <Text style={styles.mealCardText}>Lunch</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mealCard, { backgroundColor: '#F3E5F5' }]}
              onPress={() => handleMealCardPress('Snack')}
            >
              <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />
              <Text style={styles.mealCardText}>Snack</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mealCard, { backgroundColor: '#E3F2FD' }]}
              onPress={() => handleMealCardPress('Dinner')}
            >
              <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />
              <Text style={styles.mealCardText}>Dinner</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 0 : 60,
    backgroundColor: '#F5F7FB',
  },
  headerGradient: {
    marginTop: Platform.OS === 'ios' ? -60 : -10,
    paddingHorizontal: '6%',
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
    paddingBottom: height * 0.02,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
    shadowRadius: Platform.OS === 'ios' ? 20 : 0,
    elevation: Platform.OS === 'android' ? 10 : 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8%',
  },
  greetingText: {
    fontSize: width * 0.045,
    marginRight: '2%',
    color: 'rgba(255,255,255,0.9)',
  },
  headerText: {
    fontSize: width * 0.055,
    color: '#fff',
    marginTop: '1%',
  },
  profileIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '-2%',
  },
  actionCard: {
    alignItems: 'center',
    width: '30%',
    paddingHorizontal: '2%',
  },
  actionIconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
  },
  actionIconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionLabel: {
    color: '#fff',
    fontSize: width * 0.033,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: '4%',
    paddingBottom: '8%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: width * 0.045,
    color: '#333',
    marginLeft: '2%',
  },
  timeText: {
    fontSize: width * 0.035,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: '4%',
    minHeight: width * 0.3,
    fontSize: width * 0.04,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: '4%',
    textAlignVertical: 'top',
  },
  mealButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    borderRadius: 12,
    padding: '4%',
    width: '48%',
    alignItems: 'center',
  },
  mealButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  workoutCard: {
    marginBottom: '8%',
  },
  workoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutText: {
    fontSize: width * 0.04,
    color: '#333',
    marginLeft: '3%',
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    borderRadius: 12,
    padding: '4%',
    width: '30%',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: width * 0.05,
    marginVertical: '4%',
    color: '#333',
  },
  summaryLabel: {
    fontSize: width * 0.03,
    color: '#666',
  },
  waterCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  waterInfo: {
    flex: 1,
  },
  intakeRow: {
    marginBottom: '4%',
  },
  intakeText: {
    color: '#333',
    fontSize: width * 0.04,
  },
  intakeBold: {
    fontSize: width * 0.05,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#1A2980',
    borderRadius: 24,
    paddingVertical: '2.5%',
    paddingHorizontal: '5%',
    alignSelf: 'flex-start',
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  waterBottleContainer: {
    marginLeft: '4%',
    alignItems: 'center',
  },
  waterBottle: {
    width: width * 0.15,
    height: width * 0.25,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F7FB',
    justifyContent: 'flex-end',
  },
  waterFill: {
    backgroundColor: '#00B0FF',
    width: '100%',
  },
  subCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subCard: {
    borderRadius: 12,
    padding: '4%',
    width: '30%',
    alignItems: 'center',
  },
  subCardValue: {
    fontSize: width * 0.05,
    marginVertical: '4%',
    color: '#333',
  },
  subCardLabel: {
    fontSize: width * 0.03,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '6%',
  },
  modalTitle: {
    fontSize: width * 0.05,
    marginBottom: '5%',
    color: '#333',
    textAlign: 'center',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
    borderRadius: 12,
    marginBottom: '4%',
  },
  mealCardText: {
    fontSize: width * 0.04,
    color: '#333',
    marginLeft: '3%',
    flex: 1,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: '3.5%',
    borderRadius: 12,
    marginTop: '2%',
  },
  cancelText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;


// import React, { useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,Platform,
//   ScrollView, Dimensions, TextInput, Modal, Image, SafeAreaView
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width ,height} = Dimensions.get('window');

// const HomeScreen = ({ navigation }) => {
//   const userName = 'Madan';
//   const [modalVisible, setModalVisible] = useState(null);
//   const [meals, setMeals] = useState({
//     breakfast: '',
//     lunch: '',
//     snacks: '',
//     dinner: '',
//   });

//   const [dailyData, setDailyData] = useState({
//     meals: [
//       { id: '1', type: 'Breakfast', items: 'Oatmeal, Banana', calories: 350 },
//       { id: '2', type: 'Lunch', items: 'Grilled Chicken, Rice, Salad', calories: 550 },
//       { id: '3', type: 'Snack', items: 'Protein Shake', calories: 200 },
//     ],
//     waterIntake: [
//       { id: '1', amount: '500ml', time: '08:30 AM' },
//       { id: '2', amount: '250ml', time: '10:45 AM' },
//       { id: '3', amount: '750ml', time: '01:15 PM' },
//     ],
//     goals: [
//       { id: '1', title: 'Drink 2L water', completed: false },
//       { id: '2', title: '10,000 steps', completed: true },
//       { id: '3', title: '30 min workout', completed: true },
//     ],
//   });

//   const [waterIntake, setWaterIntake] = useState(0);

//   const handleSaveMeal = () => {
//     const newMeals = [];
//     if (meals.breakfast)
//       newMeals.push({ id: Date.now() + '1', type: 'Breakfast', items: meals.breakfast, calories: 300 });
//     if (meals.lunch)
//       newMeals.push({ id: Date.now() + '2', type: 'Lunch', items: meals.lunch, calories: 500 });
//     if (meals.snacks)
//       newMeals.push({ id: Date.now() + '3', type: 'Snack', items: meals.snacks, calories: 200 });
//     if (meals.dinner)
//       newMeals.push({ id: Date.now() + '4', type: 'Dinner', items: meals.dinner, calories: 400 });

//     setDailyData(prev => ({
//       ...prev,
//       meals: [...prev.meals, ...newMeals],
//     }));
//     console.log(dailyData);
//     setMeals({ breakfast: '', lunch: '', snacks: '', dinner: '' });
//     setModalVisible(null);
//   };

//   const handleAddWater = () => {
//     setWaterIntake(prev => prev + 400);
//   };

//   const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
//   const caloriesBurned = 600;
//   const totalWater = dailyData.waterIntake.reduce((sum, entry) => sum + parseInt(entry.amount), 0);
//   const completedGoals = dailyData.goals.filter(goal => goal.completed).length;

//   // Get current date
//   const currentDate = new Date().toLocaleDateString('en-US', {
//     weekday: 'long',
//     month: 'long',
//     day: 'numeric'
//   });

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Header Gradient         colors={['#4B6CB7', '#182848'] */}
//       <LinearGradient 
//         // colors={['orange', 'gold']} 
//         colors={['#4B6CB7', '#182848']} 
//         style={styles.headerGradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//       >
//         {/* Top Header */}
//         <View style={styles.headerSection}>
//           <View style={{ flex: 1 , flexDirection: 'row' , alignItems: 'baseline', justifyContent: 'flex-start', marginTop: 10 }}>
//             <Text style={styles.greetingText}>Good Morning,</Text>
//             <Text style={styles.headerText}>{userName}</Text>
//            </View>
//           <TouchableOpacity 
//             onPress={() => navigation.navigate('Profile')}
//             activeOpacity={0.8}
//           >
//             <View style={styles.profileIcon}>
//               <Feather name="user" size={20} color="#1A2980" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.topActions}>
//           <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={() => setModalVisible('meal')}
//             activeOpacity={0.7}
//           >
//             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
//               <MaterialCommunityIcons name="food" size={24} color="#1A2980" />
//             </View>
//             <Text style={styles.actionLabel}>Add Meal</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={() => navigation.navigate('SetGoal')}
//             activeOpacity={0.7}
//           >
//             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
//               <MaterialCommunityIcons name="target" size={24} color="#1A2980" />
//             </View>
//             <Text style={styles.actionLabel}>Set Goal</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={() => navigation.navigate('PairDevice')}
//             activeOpacity={0.7}
//           >
//             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
//               <MaterialCommunityIcons name="watch" size={24} color="#1A2980" />
//             </View>
//             <Text style={styles.actionLabel}>Pair Device</Text>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {/* Main Content */}
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//   {/* Activity Card */}
// <View style={[styles.card, styles.cardElevated]}>
//   <View style={styles.cardHeader}>
//     <View style={styles.cardTitleContainer}>
//       <MaterialCommunityIcons name="chart-line" size={20} color="#1A2980" />
//       <Text style={styles.cardTitle}>Today's Activity</Text>
//     </View>
//     <TouchableOpacity onPress={() => navigation.navigate('ActivityTracking')}>
//       <Feather name="chevron-right" size={24} color="#666" />
//     </TouchableOpacity>
//   </View>
  
//   <View style={styles.summaryRow}>
//     <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
//       <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
//       <Text style={styles.summaryValue}>
//         {dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0)}
//       </Text>
//       <Text style={styles.summaryLabel}>Calories In</Text>
//     </View>
//     <View style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
//       <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
//       <Text style={styles.summaryValue}>{caloriesBurned}</Text>
//       <Text style={styles.summaryLabel}>Calories Out</Text>
//     </View>
//     <View style={[styles.summaryCard, { backgroundColor: '#FFF8E1' }]}>
//       <MaterialCommunityIcons name="target" size={24} color="#FF9800" />
//       <Text style={styles.summaryValue}>
//         {dailyData.goals.filter(goal => goal.completed).length}/{dailyData.goals.length}
//       </Text>
//       <Text style={styles.summaryLabel}>Goals</Text>
//     </View>
//   </View>
// </View>

//         {/* Water Card */}
//         <View style={[styles.card, styles.cardElevated]}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardTitleContainer}>
//               <MaterialCommunityIcons name="cup-water" size={20} color="#00B0FF" />
//               <Text style={styles.cardTitle}>Water Intake</Text>
//             </View>
//             <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
//               <Feather name="chevron-right" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.waterCardContent}>
//             <View style={styles.waterInfo}>
//               <View style={styles.intakeRow}>
//                 <Text style={styles.intakeText}>
//                   <Text style={styles.intakeBold}>{waterIntake}</Text> /4,000 ml
//                 </Text>
//               </View>
//               <TouchableOpacity 
//                 style={styles.addButton} 
//                 onPress={handleAddWater}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.addButtonText}>+ 400 ml</Text>
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.waterBottleContainer}>
//               <View style={styles.waterBottle}>
//                 <View style={[
//                   styles.waterFill,
//                   { height: `${Math.min((waterIntake / 4000) * 100, 100)}%` }
//                 ]} />
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Skating Tracking */}
//         <View style={[styles.card, styles.cardElevated]}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardTitleContainer}>
//               <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
//               <Text style={styles.cardTitle}>Skating Tracking</Text>
//             </View>
//             <TouchableOpacity onPress={() => navigation.navigate('SkatingTracking')}>
//               <Feather name="chevron-right" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.subCardRow}>
//             <View style={[styles.subCard, { backgroundColor: '#EDE7F6' }]}>
//               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
//               <Text style={styles.subCardValue}>10.2</Text>
//               <Text style={styles.subCardLabel}>Avg Speed</Text>
//             </View>
//             <View style={[styles.subCard, { backgroundColor: '#F3E5F5' }]}>
//               <Feather name="repeat" size={24} color="#FF8C00" />
//               <Text style={styles.subCardValue}>3,800</Text>
//               <Text style={styles.subCardLabel}>Strides</Text>
//             </View>
//             <View style={[styles.subCard, { backgroundColor: '#E8F5E9' }]}>
//               <Feather name="zap" size={24} color="#FF2D55" />
//               <Text style={styles.subCardValue}>89</Text>
//               <Text style={styles.subCardLabel}>Stride Rate</Text>
//             </View>
//           </View>
//         </View>

//         {/* Step Count */}
//         <View style={[styles.card, styles.cardElevated]}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardTitleContainer}>
//               <Feather name="activity" size={20} color="#00C853" />
//               <Text style={styles.cardTitle}>Step Count</Text>
//             </View>
//             <TouchableOpacity onPress={() => navigation.navigate('StepCount')}>
//               <Feather name="chevron-right" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.subCardRow}>
//             <View style={[styles.subCard, { backgroundColor: '#E8F5E9' }]}>
//               <Feather name="activity" size={24} color="#00C853" />
//               <Text style={styles.subCardValue}>3,205</Text>
//               <Text style={styles.subCardLabel}>Steps</Text>
//             </View>
//             <View style={[styles.subCard, { backgroundColor: '#F3E5F5' }]}>
//               <Feather name="repeat" size={24} color="#5856D6" />
//               <Text style={styles.subCardValue}>1,024</Text>
//               <Text style={styles.subCardLabel}>Strides</Text>
//             </View>
//             <View style={[styles.subCard, { backgroundColor: '#FFEBEE' }]}>
//               <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
//               <Text style={styles.subCardValue}>145</Text>
//               <Text style={styles.subCardLabel}>Calories</Text>
//             </View>
//           </View>
//         </View>

//         {/* Workout History */}
//         <TouchableOpacity 
//           style={[styles.card, styles.workoutCard, styles.cardElevated]}
//           onPress={() => navigation.navigate('WorkoutHistory')}
//           activeOpacity={0.8}
//         >
//           <View style={styles.workoutContent}>
//             <MaterialCommunityIcons name="dumbbell" size={28} color="#FF2D55" />
//             <Text style={styles.workoutText}>Workout History</Text>
//             <Feather name="chevron-right" size={24} color="#666" />
//           </View>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Modal - Add Meal */}
//       <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Add Meals</Text>

//             <TextInput
//               placeholder="Breakfast"
//               style={styles.input}
//               value={meals.breakfast}
//               onChangeText={(text) => setMeals({ ...meals, breakfast: text })}
//               placeholderTextColor="#999"
//             />
//             <TextInput
//               placeholder="Lunch"
//               style={styles.input}
//               value={meals.lunch}
//               onChangeText={(text) => setMeals({ ...meals, lunch: text })}
//               placeholderTextColor="#999"
//             />
//             <TextInput
//               placeholder="Snacks"
//               style={styles.input}
//               value={meals.snacks}
//               onChangeText={(text) => setMeals({ ...meals, snacks: text })}
//               placeholderTextColor="#999"
//             />
//             <TextInput
//               placeholder="Dinner"
//               style={styles.input}
//               value={meals.dinner}
//               onChangeText={(text) => setMeals({ ...meals, dinner: text })}
//               placeholderTextColor="#999"
//             />

//             <View style={styles.modalButtons}>
//               <TouchableOpacity 
//                 style={styles.cancelButton} 
//                 onPress={() => setModalVisible(null)}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.saveButton} 
//                 onPress={handleSaveMeal}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.saveText}>Save Meal</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     paddingBottom: Platform.OS === 'ios' ? 0 : 60,
//     backgroundColor: '#F5F7FB',
//    },
//    headerGradient: {
//     marginTop: Platform.OS === 'ios' ? -60 : -10,
//     paddingHorizontal: '6%',
//     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
//     paddingBottom: height * 0.02,
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,

//     // iOS shadow
//     shadowColor: '#1A2980',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
//     shadowRadius: Platform.OS === 'ios' ? 20 : 0,

//     // Android elevation
//     elevation: Platform.OS === 'android' ? 10 : 0,
//   },
//   headerSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: '8%',
//   },
//   greetingText: {
//     fontSize: width * 0.045,
//     marginRight: '2%',
//     color: 'rgba(255,255,255,0.9)',
//   },
//   headerText: {
//     fontSize: width * 0.055,
//     color: '#fff',
//     marginTop: '1%',
//   },
//   dateText: {
//     fontSize: width * 0.035,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: '1%',
//   },
//   profileIcon: {
//     width: width * 0.1,
//     height: width * 0.1,
//     borderRadius: width * 0.05,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   topActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: '-2%',
//   },
//   actionCard: {
//     alignItems: 'center',
//     width: '30%',
//     paddingHorizontal: '2%',
//   },
//   actionIconContainer: {
//     width: width * 0.14,
//     height: width * 0.14,
//     borderRadius: width * 0.07,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: '4%',
//   },
//   actionIconShadow: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   actionLabel: {
//     color: '#fff',
//     fontSize: width * 0.033,
//     textAlign: 'center',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: '4%',
//     paddingBottom: '8%',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '4%',
//     marginBottom: '4%',
//   },
//   cardElevated: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '4%',
//   },
//   cardTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: width * 0.045,
//     color: '#333',
//     marginLeft: '2%',
//   },
//   workoutCard: {
//     marginBottom: '8%',
//   },
//   workoutContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   workoutText: {
//     fontSize: width * 0.04,
//     color: '#333',
//     marginLeft: '3%',
//     flex: 1,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   summaryCard: {
//     borderRadius: 12,
//     padding: '4%',
//     width: '30%',
//     alignItems: 'center',
//   },
//   summaryValue: {
//     fontSize: width * 0.05,
//     marginVertical: '4%',
//     color: '#333',
//   },
//   summaryLabel: {
//     fontSize: width * 0.03,
//     color: '#666',
//   },
//   waterCardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//   },
//   waterInfo: {
//     flex: 1,
//   },
//   intakeRow: {
//     marginBottom: '4%',
//   },
//   intakeText: {
//     color: '#333',
//     fontSize: width * 0.04,
//   },
//   intakeBold: {
//     fontSize: width * 0.05,
//     color: '#333',
//   },
//   addButton: {
//     backgroundColor: '#1A2980',
//     borderRadius: 24,
//     paddingVertical: '2.5%',
//     paddingHorizontal: '5%',
//     alignSelf: 'flex-start',
//     shadowColor: '#1A2980',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: width * 0.035,
//   },
//   waterBottleContainer: {
//     marginLeft: '4%',
//     alignItems: 'center',
//   },
//   waterBottle: {
//     width: width * 0.15,
//     height: width * 0.25,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//     overflow: 'hidden',
//     backgroundColor: '#F5F7FB',
//     justifyContent: 'flex-end',
//   },
//   waterFill: {
//     backgroundColor: '#00B0FF',
//     width: '100%',
//   },
//   subCardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   subCard: {
//     borderRadius: 12,
//     padding: '4%',
//     width: '30%',
//     alignItems: 'center',
//   },
//   subCardValue: {
//     fontSize: width * 0.05,
//     marginVertical: '4%',
//     color: '#333',
//   },
//   subCardLabel: {
//     fontSize: width * 0.03,
//     color: '#666',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '6%',
//   },
//   modalTitle: {
//     fontSize: width * 0.05,
//     marginBottom: '5%',
//     color: '#333',
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 12,
//     padding: '3.5%',
//     marginBottom: '4%',
//     fontSize: width * 0.04,
//     color: '#333',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: '2%',
//   },
//   saveButton: {
//     backgroundColor: '#1A2980',
//     padding: '3.5%',
//     borderRadius: 12,
//     flex: 1,
//     marginLeft: '2%',
//   },
//   saveText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
//   cancelButton: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     padding: '3.5%',
//     borderRadius: 12,
//     flex: 1,
//     marginRight: '2%',
//   },
//   cancelText: {
//     color: '#666',
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;