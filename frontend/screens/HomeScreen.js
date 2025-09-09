import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator,
  FlatList, Dimensions, Modal, SafeAreaView, TextInput, Linking
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// import stores 
import { useAuthStore } from '../store/authStore';
import useWaterStore from '../store/waterStore';

import { useBLEStore } from '../store/augBleStore';
import { useCaloriesStore } from '../store/caloriesStore';

import foodDatabase from '../constants/foodDatabase';
// import { DrawerActions } from '@react-navigation/native';
import { format } from 'date-fns'; // Added for date formattingrr

const { width, height } = Dimensions.get('window');

// Helper function to calculate the actual amount to add
const calculateActualIntakeAmount = (amount, currentTotal, target) => {
  const remainingAmount = target - currentTotal;
  if (remainingAmount <= 0) {
    return 0; // Already reached or exceeded target
  }
  return Math.min(amount, remainingAmount);
};

const HomeScreen = ({ navigation }) => {
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

  // calories related
  const {
    totalCaloriesEaten,
    totalCaloriesBurned,
    mealTarget,
    mealTargetMet,
    mealFlag,
    fetchCaloriesEaten,
    fetchCaloriesBurned,
    fetchMealTargetStatus,
    burnTarget, setBurnTarget, fetchBurnTarget,
    stepGoal, fetchStepGoal, setStepGoal
  } = useCaloriesStore();

  const {
    connectToDevice,
    isConnected,
    scanForDevices,
    data,
    sendCommand,
    isScanning,
    hasPermissions,
    foundDevices,
    connectedDevice
  } = useBLEStore();

  // Initialize skating data
  const [skatingData, setSkatingData] = useState({
    speed: 0,
    distance: 0,
    strideCount: 0,
    mode: 'N/A'
  });

  // steps related data
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

  // Update skating data when BLE data changes
  useEffect(() => {
    if (isConnected && data) {
      if (data.mode === 'SS') {
        setSkatingData({
          speed: data?.speed || 0,
          distance: data?.skatingDistance || 0,
          strideCount: data?.strideCount || 0,
          mode: data.mode
        });
      }
    }
  }, [data, isConnected]);

  useEffect(() => {
    fetchStepGoal();
    fetchBurnTarget();
  }, [burnTarget, stepGoal]);

  const userName = 'Madan' || 'Madan';
  const [modalVisible, setModalVisible] = useState(null);
  const [mealInputVisible, setMealInputVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('');
  const [mealItem, setMealItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [skatingModalVisible, setSkatingModalVisible] = useState(false);
  const [pairingModalVisible, setPairingModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  const [dailyData, setDailyData] = useState({
    meals: [
      { id: '1', type: 'Breakfast', items: 'Oatmeal (200g)', calories: 0, time: '08:30 AM' },
      { id: '2', type: 'Lunch', items: 'Grilled Chicken (150g), Rice (200g)', calories: 0, time: '01:15 PM' },
      { id: '3', type: 'Snack', items: 'Protein Shake (300ml)', calories: 0, time: '04:45 PM' },
    ],
    waterIntake: [
      { id: '1', amount: '500ml', time: '08:30 AM' },
      { id: '2', amount: '250ml', time: '10:45 AM' },
      { id: '3', amount: '750ml', time: '01:15 PM' },
    ],
    goals: [
      { id: '1', title: 'Drink 2L water', completed: false },
      { id: '2', title: '10,000 steps', completed: false },
      { id: '3', title: '30 min workout', completed: false },
      { id: '4', title: '30 min workout', completed: false },
    ],
  });

  useEffect(() => {
    const dateString = format(new Date(), 'yyyy-MM-dd'); // Fetch for current date
    fetchTodayTotal(dateString); // realted to water store
    fetchTarget();
    
    if (isConnected) {
      sendCommand('SET_MODE STEP_COUNTING');
    }
    return () => {
      if (isConnected) {
        sendCommand('SET_MODE SKATING_SPEED');
      }
    };
  }, [isConnected]);

  useEffect(() => {
    if (waterError) {
      Alert.alert('Water Error', waterError);
    }
  }, [waterError]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = foodDatabase.filter(food => 
        food.food_item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCaloriesEaten();
    fetchMealTargetStatus();
  }, [mealInputVisible, totalCaloriesEaten]);

  const handleScanDevices = async () => {
    setPairingModalVisible(true);
  };

  const handleAddWater = async () => {
    // if (target > todayTotal){

    
    // const amount = 400;
    const amount = calculateActualIntakeAmount(400, todayTotal, target);
    const dateString = format(new Date(), 'yyyy-MM-dd'); // Use current date
    const result = await addIntake(amount, dateString);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to add water intake');
    } else {
      const dateString = format(new Date(), 'yyyy-MM-dd');
      await fetchTodayTotal(dateString); // Refresh total after adding intake
    }
        // }
        
  };

function calculateTotalProgress(goals) {
  // Define the percentage each goal contributes to the total.
  const contributionPerGoal = 25;

  let totalProgress = 0;

  // Function to calculate progress for a single goal
  const calculateGoalProgress = (current, target) => {
    // Handle the case where the target is zero to avoid division by zero.
    if (target === 0) {
      return 0;
    }
    // Calculate the completion percentage for this goal.
    const completionRatio = Math.min(current / target, 1);
    // Add the proportional contribution to the total.
    return completionRatio * contributionPerGoal;
  };

  // Calculate progress for each of the four goals.
  totalProgress += calculateGoalProgress(goals.caloriesEaten.current, goals.caloriesEaten.target);
  totalProgress += calculateGoalProgress(goals.caloriesBurned.current, goals.caloriesBurned.target);
  totalProgress += calculateGoalProgress(goals.water.current, goals.water.target);
  totalProgress += calculateGoalProgress(goals.steps.current, goals.steps.target);

  return totalProgress;
}

  const dailyGoals = {
  caloriesEaten: { current: totalCaloriesEaten, target: mealTarget },
  caloriesBurned: { current: totalCaloriesBurned, target: burnTarget },
  water: { current: todayTotal, target: target },
  steps: { current: stepData.steps ? stepData.steps : 0, target: stepGoal },
};
  // Calculate the total progress
const totalProgress = calculateTotalProgress(dailyGoals);

  const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const completedGoals = dailyData.goals.filter(goal => goal.completed).length;
  const totalGoals = dailyData.goals.length || 0;

  const handleMealCardPress = (mealType) => {
    setModalVisible(null);
    setCurrentMealType(mealType);
    setMealInputVisible(true);
    setMealItem('');
    setQuantity('');
    setSelectedFood(null);

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
  };

  const handleSaveMeal = async () => {
    if (!mealItem.trim() || !quantity.trim()) {
      Alert.alert('Error', 'Please enter both food item and quantity');
      return;
    }

    // Calculate calories if a food is selected from the database
    let calculatedCalories = 0;
    if (selectedFood) {
      calculatedCalories = Math.round(selectedFood.calories_per_serve * (parseFloat(quantity) || 1));
    }

    const newMeal = {
      mealType: currentMealType,
      name: mealItem,
      time: currentTime,
      calories: calculatedCalories,
      id: Date.now().toString(),
      date: format(new Date(), 'yyyy-MM-dd') // Ensure date is included
    };
    
    console.log('New meal to be added:', newMeal);
    const responseMeal = await postMeals(newMeal);
    console.log('postMeals response:', responseMeal);
    
    setDailyData(prev => ({
      ...prev,
      meals: [...prev.meals, newMeal]
    }));

    setMealItem('');
    setQuantity('');
    setMealInputVisible(false);
    setSelectedFood(null);
  };

  const getMealColor = () => {
    switch (currentMealType) {
      case 'Breakfast': return '#FFF3E0';
      case 'Lunch': return '#E8F5E9';
      case 'Snack': return '#F3E5F5';
      case 'Dinner': return '#E3F2FD';
      default: return '#F5F5F5';
    }
  };

  const getMealIcon = () => {
    switch (currentMealType) {
      case 'Breakfast': return <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />;
      case 'Lunch': return <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />;
      case 'Snack': return <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />;
      case 'Dinner': return <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />;
      default: return <MaterialCommunityIcons name="food" size={24} color="#666" />;
    }
  };

  const handleSkatingPress = () => {
    setSkatingModalVisible(true);
  };

  const startSkatingSession = (type) => {
    try {
      setSkatingModalVisible(false);
      navigation.navigate('SkatingTracking', { skatingType: type });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Could not start skating session');
    }
  };

  const handlePairDevicePress = () => {
    navigation.navigate('Simple')
  };

  const renderHomeContent = () => (
    <>
      {mealInputVisible && (
        <View style={[styles.card, styles.cardElevated, { backgroundColor: getMealColor() }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              {getMealIcon()}
              <Text style={styles.cardTitle}>Add {currentMealType}</Text>
            </View>
            <Text style={styles.timeText}>{currentTime}</Text>
          </View>

          <View style={styles.mealInputContainer}>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Search or enter food item"
                style={styles.input}
                value={mealItem}
                onChangeText={(text) => {
                  setMealItem(text);
                  setSearchQuery(text);
                }}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="scale" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Quantity"
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {selectedFood && (
              <View style={styles.foodDetailsContainer}>
                <Text style={styles.foodDetailsText}>
                  {selectedFood.food_item} ({selectedFood.serving_size}): {selectedFood.calories_per_serve} cal
                </Text>
                {quantity && (
                  <Text style={styles.calorieCalculation}>
                    {selectedFood.calories_per_serve} cal × {quantity}g = {Math.round(selectedFood.calories_per_serve * (parseFloat(quantity) || 1))} cal
                  </Text>
                )}
              </View>
            )}

            {filteredFoods.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredFoods}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        setMealItem(item.food_item);
                        setSelectedFood(item);
                        setFilteredFoods([]);
                      }}
                    >
                      <Text style={styles.suggestionText}>{item.food_item}</Text>
                      <Text style={styles.suggestionCalories}>
                        {item.calories_per_serve} cal per {item.serving_size}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>

          <View style={styles.mealButtonRow}>
            <TouchableOpacity
              style={[styles.mealButton, styles.cancelButton]}
              onPress={() => setMealInputVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.mealButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mealButton, styles.saveButton]}
              onPress={handleSaveMeal}
              activeOpacity={0.8}
              disabled={!mealItem || !quantity}
            >
              <Text style={[styles.mealButtonText, { color: '#fff' }]}>Save Meal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={[styles.card, styles.cardElevated]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="chart-line" size={20} color="#2E3A59" />
            <Text style={[styles.cardTitle, { color: '#2E3A59' }]}>Today's Activity</Text>
          </View>
        </View>

        <View style={styles.activityGrid}>
          <View style={[styles.activityMetricCard, { backgroundColor: '#FFF8F0' }]}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#FFEDD5' }]}>
              <MaterialCommunityIcons name="food" size={18} color="#ED8936" />
            </View>
            <Text style={styles.metricValue}>{totalCaloriesEaten}/{mealTarget}</Text>
            <Text style={styles.metricLabel}>Calories In</Text>
            <View style={styles.metricTrend}>
              <Feather name="arrow-up" size={14} color="#48BB78" />
              {/* <Text style={[styles.metricTrendText, { color: '#48BB78' }]}>{(totalCaloriesEaten / mealTarget) * 100}%</Text> */}
              <Text style={[styles.metricTrendText, { color: '#48BB78' }]}>{Math.floor((totalCaloriesEaten / mealTarget) * 100)}%</Text>
            </View>
          </View>

          <View style={[styles.activityMetricCard, { backgroundColor: '#FFF5F5' }]}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#FED7D7' }]}>
              <MaterialCommunityIcons name="fire" size={18} color="#F56565" />
            </View>
            <Text style={styles.metricValue}>{totalCaloriesBurned}/{burnTarget}</Text>
            <Text style={styles.metricLabel}>Calories Out</Text>
            <View style={styles.metricTrend}>
              <Feather name="arrow-up" size={14} color="#FC8181" />
              <Text style={[styles.metricTrendText, { color: '#FC8181' }]}>{Math.floor((totalCaloriesBurned / burnTarget) * 100)}%</Text>
            </View>
          </View>

          <View style={[styles.activityMetricCard, { backgroundColor: '#F0F9FF' }]}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#DBEAFE' }]}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#4299E1" />
            </View>
            <Text style={styles.metricValue}>0</Text>
            <Text style={styles.metricLabel}>Active Min</Text>
            <View style={styles.metricTrend}>
              <Feather name="arrow-down" size={14} color="#ED8936" />
              <Text style={[styles.metricTrendText, { color: '#ED8936' }]}>0%</Text>
            </View>
          </View>

          <View style={[styles.activityMetricCard, { backgroundColor: '#FAF5FF' }]}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#E9D8FD' }]}>
              <MaterialCommunityIcons name="target" size={18} color="#9F7AEA" />
            </View>
            <Text style={styles.metricValue}>
              {completedGoals}/{totalGoals}
            </Text>
            <Text style={styles.metricLabel}>Goals Met</Text>
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>
                {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.activityProgressContainer}>
          <Text style={styles.activityProgressText}>Daily Activity Progress</Text>
          <View style={styles.fullProgressBar}>
            <View style={[styles.activityProgressFill, {
              width: `${totalProgress}%`,
              backgroundColor: '#4C51BF'
            }]} />
          </View>
          <Text style={styles.activityProgressPercent}>{Math.round(totalProgress)}% Complete</Text>
        </View>
      </View>

      <View style={[styles.card, styles.cardElevated]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
            <Text style={styles.cardTitle}>Skating Tracking</Text>
          </View>
          <TouchableOpacity onPress={handleSkatingPress}>
            <Feather name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.recentSessionContainer}>
          <View style={styles.recentSessionIcon}>
            <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
          </View>
          <View style={styles.recentSessionDetails}>
            <Text style={styles.recentSessionTitle}>Speed Skating</Text>
            {isConnected ? (
              <Text style={styles.recentSessionStats}>
                {skatingData.speed ?? 0}km/h • {skatingData.strideCount ?? 0} strides
              </Text>
            ) : (
              <Text style={styles.recentSessionStats}>Connect device to track skating</Text>
            )}
          </View>
          <Text style={styles.recentSessionTime}>Today, 07:30 AM</Text>
        </View>
      </View>

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

        <View style={styles.stepProgressContainer}>
          <View style={styles.stepProgressText}>
            <Text style={styles.stepCount}>{stepData.steps ?? 0}</Text>
            <Text style={styles.stepGoal}> /{stepGoal} steps</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#4B6CB7', '#6B8CE8']}
              style={[styles.progressFill, { width: `${((stepData.steps ?? 0) / 10000) * 100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(((stepData.steps ?? 0) / 10000) * 100)}% of daily goal
          </Text>
        </View>
      </View>

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
            
      <View style={{ height: 30 }} />
    </>
  );

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#4B6CB7', '#182848']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
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
              onPress={() => navigation.navigate('Goal')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
                <MaterialCommunityIcons name="target" size={24} color="#fff" />
              </View>
              <Text style={styles.actionLabel}>Set Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handlePairDevicePress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
                <MaterialCommunityIcons name="watch" size={24} color="#fff" />
              </View>
              <Text style={styles.actionLabel}>
                {isConnected ? 'Connected' : 'Pair Device'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <FlatList
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          data={[{}]} // Single item array
          keyExtractor={() => 'home-screen'}
          renderItem={renderHomeContent}
        />
      </SafeAreaView>

      {/* Meal Type Selection Modal */}
      <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
        <View style={styles.mealModalOverlay}>
          <View style={styles.mealModalContainer}>
            <Text style={styles.mealModalTitle}>Add Your Meal</Text>
            <Text style={styles.mealModalSubtitle}>Select the meal type you want to add</Text>

            <View style={styles.mealOptionsContainer}>
              <TouchableOpacity
                style={[styles.mealOptionCard, styles.breakfastOption]}
                onPress={() => handleMealCardPress('Breakfast')}
              >
                <View style={styles.mealOptionContent}>
                  <View style={[styles.mealIconContainer, styles.breakfastIconBg]}>
                    <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />
                  </View>
                  <Text style={styles.mealOptionText}>Breakfast</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#FF9800" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mealOptionCard, styles.lunchOption]}
                onPress={() => handleMealCardPress('Lunch')}
              >
                <View style={styles.mealOptionContent}>
                  <View style={[styles.mealIconContainer, styles.lunchIconBg]}>
                    <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.mealOptionText}>Lunch</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#4CAF50" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mealOptionCard, styles.snackOption]}
                onPress={() => handleMealCardPress('Snack')}
              >
                <View style={styles.mealOptionContent}>
                  <View style={[styles.mealIconContainer, styles.snackIconBg]}>
                    <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />
                  </View>
                  <Text style={styles.mealOptionText}>Snack</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#9C27B0" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mealOptionCard, styles.dinnerOption]}
                onPress={() => handleMealCardPress('Dinner')}
              >
                <View style={styles.mealOptionContent}>
                  <View style={[styles.mealIconContainer, styles.dinnerIconBg]}>
                    <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.mealOptionText}>Dinner</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#2196F3" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.mealModalCancelButton}
              onPress={() => setModalVisible(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.mealModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Skating Type Selection Modal */}
      <Modal visible={skatingModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Skating Type</Text>

            <TouchableOpacity
              style={[styles.skatingTypeCard, { backgroundColor: '#EDE7F6' }]}
              onPress={() => startSkatingSession('speed')}
            >
              <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
              <Text style={styles.skatingTypeText}>Speed Skating</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.skatingTypeCard, { backgroundColor: '#E3F2FD' }]}
              onPress={() => startSkatingSession('distance')}
            >
              <MaterialCommunityIcons name="map-marker-distance" size={24} color="#2196F3" />
              <Text style={styles.skatingTypeText}>Distance Skating</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSkatingModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};






// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator,
//   ScrollView, Dimensions, Modal, SafeAreaView, TextInput, FlatList, Linking
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// // import stores 
// import { useAuthStore } from '../store/authStore';
// import useWaterStore from '../store/waterStore';

// import { useBLEStore } from '../store/augBleStore';
// import { useCaloriesStore } from '../store/caloriesStore';

// import foodDatabase from '../constants/foodDatabase';
// // import { DrawerActions } from '@react-navigation/native';
// import { format } from 'date-fns'; // Added for date formattingrr

// const { width, height } = Dimensions.get('window');


// const HomeScreen = ({ navigation }) => {
//   const { postMeals } = useAuthStore();

//   // Water store integration
//   const {
//     todayTotal,
//     target,
//     addIntake,
//     fetchTodayTotal,
//     fetchTarget,
//     loading: waterLoading,
//     error: waterError
//   } = useWaterStore();

//   // calories related
//   const {
//     totalCaloriesEaten,
//     totalCaloriesBurned,
//     mealTarget,
//     mealTargetMet,
//     mealFlag,
//     fetchCaloriesEaten,
//     fetchCaloriesBurned,
//     fetchMealTargetStatus,
//     burnTarget, setBurnTarget, fetchBurnTarget,
//     stepGoal, fetchStepGoal, setStepGoal
//   } = useCaloriesStore();

//   const {
//     connectToDevice,
//     isConnected,
//     scanForDevices,
//     data,
//     sendCommand,
//     isScanning,
//     hasPermissions,
//     foundDevices,
//     connectedDevice
//   } = useBLEStore();

//   // Initialize skating data
//   const [skatingData, setSkatingData] = useState({
//     speed: 0,
//     distance: 0,
//     strideCount: 0,
//     mode: 'N/A'
//   });

//   // steps related data
//   const stepData = data && data.mode === 'S' ? {
//     steps: data.stepCount || 0,
//     distance: data.walkingDistance || 0,
//     strideCount: data.strideCount || 0,
//     speed: data.speed || 0,
//     mode: data.mode
//   } : {
//     steps: 0,
//     distance: 0,
//     strideCount: 0,
//     speed: 0,
//     mode: 'N/A'
//   };

//   // Update skating data when BLE data changes
//   useEffect(() => {
//     if (isConnected && data) {
//       if (data.mode === 'SS') {
//         setSkatingData({
//           speed: data?.speed || 0,
//           distance: data?.skatingDistance || 0,
//           strideCount: data?.strideCount || 0,
//           mode: data.mode
//         });
//       }
//     }
//   }, [data, isConnected]);

//   useEffect(() => {
//     fetchStepGoal();
//     fetchBurnTarget();
//   }, [burnTarget, stepGoal]);

//   const userName = 'Madan' || 'Madan';
//   const [modalVisible, setModalVisible] = useState(null);
//   const [mealInputVisible, setMealInputVisible] = useState(false);
//   const [currentMealType, setCurrentMealType] = useState('');
//   const [mealItem, setMealItem] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [currentTime, setCurrentTime] = useState('');
//   const [skatingModalVisible, setSkatingModalVisible] = useState(false);
//   const [pairingModalVisible, setPairingModalVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFoods, setFilteredFoods] = useState([]);
//   const [selectedFood, setSelectedFood] = useState(null);

//   const [dailyData, setDailyData] = useState({
//     meals: [
//       { id: '1', type: 'Breakfast', items: 'Oatmeal (200g)', calories: 0, time: '08:30 AM' },
//       { id: '2', type: 'Lunch', items: 'Grilled Chicken (150g), Rice (200g)', calories: 0, time: '01:15 PM' },
//       { id: '3', type: 'Snack', items: 'Protein Shake (300ml)', calories: 0, time: '04:45 PM' },
//     ],
//     waterIntake: [
//       { id: '1', amount: '500ml', time: '08:30 AM' },
//       { id: '2', amount: '250ml', time: '10:45 AM' },
//       { id: '3', amount: '750ml', time: '01:15 PM' },
//     ],
//     goals: [
//       { id: '1', title: 'Drink 2L water', completed: false },
//       { id: '2', title: '10,000 steps', completed: false },
//       { id: '3', title: '30 min workout', completed: false },
//       { id: '4', title: '30 min workout', completed: false },
//     ],
//   });

//   useEffect(() => {
//     const dateString = format(new Date(), 'yyyy-MM-dd'); // Fetch for current date
//     fetchTodayTotal(dateString); // realted to water store
//     fetchTarget();
    
//     if (isConnected) {
//       sendCommand('SET_MODE STEP_COUNTING');
//     }
//     return () => {
//       if (isConnected) {
//         sendCommand('SET_MODE SKATING_SPEED');
//       }
//     };
//   }, [isConnected]);

//   useEffect(() => {
//     if (waterError) {
//       Alert.alert('Water Error', waterError);
//     }
//   }, [waterError]);

//   useEffect(() => {
//     if (searchQuery.length > 0) {
//       const filtered = foodDatabase.filter(food => 
//         food.food_item.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredFoods(filtered);
//     } else {
//       setFilteredFoods([]);
//     }
//   }, [searchQuery]);

//   useEffect(() => {
//     fetchCaloriesEaten();
//     fetchMealTargetStatus();
//   }, [mealInputVisible, totalCaloriesEaten]);

//   const handleScanDevices = async () => {
//     setPairingModalVisible(true);
//   };

//   const handleAddWater = async () => {
//     if (target > todayTotal){


//     const amount = 400;
//     const dateString = format(new Date(), 'yyyy-MM-dd'); // Use current date
//     const result = await addIntake(amount, dateString);
//     if (!result.success) {
//       Alert.alert('Error', result.error || 'Failed to add water intake');
//     } else {
//       const dateString = format(new Date(), 'yyyy-MM-dd');
//       await fetchTodayTotal(dateString); // Refresh total after adding intake
//     }
//         }
        
//   };

// function calculateTotalProgress(goals) {
//   // Define the percentage each goal contributes to the total.
//   const contributionPerGoal = 25;

//   let totalProgress = 0;

//   // Function to calculate progress for a single goal
//   const calculateGoalProgress = (current, target) => {
//     // Handle the case where the target is zero to avoid division by zero.
//     if (target === 0) {
//       return 0;
//     }
//     // Calculate the completion percentage for this goal.
//     const completionRatio = Math.min(current / target, 1);
//     // Add the proportional contribution to the total.
//     return completionRatio * contributionPerGoal;
//   };

//   // Calculate progress for each of the four goals.
//   totalProgress += calculateGoalProgress(goals.caloriesEaten.current, goals.caloriesEaten.target);
//   totalProgress += calculateGoalProgress(goals.caloriesBurned.current, goals.caloriesBurned.target);
//   totalProgress += calculateGoalProgress(goals.water.current, goals.water.target);
//   totalProgress += calculateGoalProgress(goals.steps.current, goals.steps.target);

//   return totalProgress;
// }
// // {totalCaloriesEaten}/{mealTarget}
// // {totalCaloriesBurned}/{burnTarget}
// // {stepData.steps ?? 0}</Text>
// // //                 <Text style={styles.stepGoal}> /{stepGoal} steps
// // {todayTotal}</Text> /{target} ml
//   const dailyGoals = {
//   caloriesEaten: { current: totalCaloriesEaten, target: mealTarget },
//   caloriesBurned: { current: totalCaloriesBurned, target: burnTarget },
//   water: { current: todayTotal, target: target },
//   steps: { current: stepData.steps ? stepData.steps : 0, target: stepGoal },
// };
//   // Calculate the total progress
// const totalProgress = calculateTotalProgress(dailyGoals);




//   const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
//   const completedGoals = dailyData.goals.filter(goal => goal.completed).length;
//   const totalGoals = dailyData.goals.length || 0;

//   const handleMealCardPress = (mealType) => {
//     setModalVisible(null);
//     setCurrentMealType(mealType);
//     setMealInputVisible(true);
//     setMealItem('');
//     setQuantity('');
//     setSelectedFood(null);

//     const now = new Date();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
//   };

//   const handleSaveMeal = async () => {
//     if (!mealItem.trim() || !quantity.trim()) {
//       Alert.alert('Error', 'Please enter both food item and quantity');
//       return;
//     }

//     // Calculate calories if a food is selected from the database
//     let calculatedCalories = 0;
//     if (selectedFood) {
//       calculatedCalories = Math.round(selectedFood.calories_per_serve * (parseFloat(quantity) || 1));
//     }

//     const newMeal = {
//       mealType: currentMealType,
//       name: mealItem,
//       time: currentTime,
//       calories: calculatedCalories,
//       id: Date.now().toString(),
//       date: format(new Date(), 'yyyy-MM-dd') // Ensure date is included
//     };
    
//     console.log('New meal to be added:', newMeal);
//     const responseMeal = await postMeals(newMeal);
//     console.log('postMeals response:', responseMeal);
    
//     setDailyData(prev => ({
//       ...prev,
//       meals: [...prev.meals, newMeal]
//     }));

//     setMealItem('');
//     setQuantity('');
//     setMealInputVisible(false);
//     setSelectedFood(null);
//   };

//   const getMealColor = () => {
//     switch (currentMealType) {
//       case 'Breakfast': return '#FFF3E0';
//       case 'Lunch': return '#E8F5E9';
//       case 'Snack': return '#F3E5F5';
//       case 'Dinner': return '#E3F2FD';
//       default: return '#F5F5F5';
//     }
//   };

//   const getMealIcon = () => {
//     switch (currentMealType) {
//       case 'Breakfast': return <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />;
//       case 'Lunch': return <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />;
//       case 'Snack': return <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />;
//       case 'Dinner': return <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />;
//       default: return <MaterialCommunityIcons name="food" size={24} color="#666" />;
//     }
//   };

//   const handleSkatingPress = () => {
//     setSkatingModalVisible(true);
//   };

//   const startSkatingSession = (type) => {
//     try {
//       setSkatingModalVisible(false);
//       navigation.navigate('SkatingTracking', { skatingType: type });
//     } catch (error) {
//       console.error('Navigation error:', error);
//       Alert.alert('Error', 'Could not start skating session');
//     }
//   };

//   const handlePairDevicePress = () => {
//     // setPairingModalVisible(true);
//     // navigation.navigate('DevicePairing');
//     navigation.navigate('Simple')
//   };

//   return (
//     <>
//       <SafeAreaView style={styles.safeArea}>
//         <LinearGradient
//           colors={['#4B6CB7', '#182848']}
//           style={styles.headerGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <View style={styles.headerSection}>
//             <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', marginTop: 10 }}>
//               <Text style={styles.greetingText}>Good Morning,</Text>
//               <Text style={styles.headerText}>{userName}</Text>
//             </View>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('Profile')}
//               activeOpacity={0.8}
//             >
//               <View style={styles.profileIcon}>
//                 <Feather name="user" size={20} color="#fff" />
//               </View>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.topActions}>
//             <TouchableOpacity
//               style={styles.actionCard}
//               onPress={() => setModalVisible('meal')}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
//                 <MaterialCommunityIcons name="food" size={24} color="#fff" />
//               </View>
//               <Text style={styles.actionLabel}>Add Meal</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionCard}
//               onPress={() => navigation.navigate('Goal')}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
//                 <MaterialCommunityIcons name="target" size={24} color="#fff" />
//               </View>
//               <Text style={styles.actionLabel}>Set Goal</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionCard}
//               onPress={handlePairDevicePress}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
//                 <MaterialCommunityIcons name="watch" size={24} color="#fff" />
//               </View>
//               <Text style={styles.actionLabel}>
//                 {isConnected ? 'Connected' : 'Pair Device'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>

//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           // keyboardShouldPersistTaps="handled"
//         >
//           {mealInputVisible && (
//             <View style={[styles.card, styles.cardElevated, { backgroundColor: getMealColor() }]}>
//               <View style={styles.cardHeader}>
//                 <View style={styles.cardTitleContainer}>
//                   {getMealIcon()}
//                   <Text style={styles.cardTitle}>Add {currentMealType}</Text>
//                 </View>
//                 <Text style={styles.timeText}>{currentTime}</Text>
//               </View>

//               <View style={styles.mealInputContainer}>
//                 <View style={styles.inputRow}>
//                   <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     placeholder="Search or enter food item"
//                     style={styles.input}
//                     value={mealItem}
//                     onChangeText={(text) => {
//                       setMealItem(text);
//                       setSearchQuery(text);
//                     }}
//                     placeholderTextColor="#999"
//                   />
//                 </View>

//                 <View style={styles.inputRow}>
//                   <MaterialCommunityIcons name="scale" size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     placeholder="Quantity"
//                     style={styles.input}
//                     value={quantity}
//                     onChangeText={setQuantity}
//                     placeholderTextColor="#999"
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 {selectedFood && (
//                   <View style={styles.foodDetailsContainer}>
//                     <Text style={styles.foodDetailsText}>
//                       {selectedFood.food_item} ({selectedFood.serving_size}): {selectedFood.calories_per_serve} cal
//                     </Text>
//                     {quantity && (
//                       <Text style={styles.calorieCalculation}>
//                         {selectedFood.calories_per_serve} cal × {quantity}g = {Math.round(selectedFood.calories_per_serve * (parseFloat(quantity) || 1))} cal
//                       </Text>
//                     )}
//                   </View>
//                 )}

//                 {filteredFoods.length > 0 && (
//                   <View style={styles.suggestionsContainer}>
//                     <FlatList
//                       data={filteredFoods}
//                       // keyExtractor={(item) => item.food_item}
//                       keyExtractor={(item) => item.id}
//                       renderItem={({ item }) => (
//                         <TouchableOpacity
//                           style={styles.suggestionItem}
//                           onPress={() => {
//                             setMealItem(item.food_item);
//                             setSelectedFood(item);
//                             setFilteredFoods([]);
//                           }}
//                          >
//                           <Text style={styles.suggestionText}>{item.food_item}</Text>
//                           <Text style={styles.suggestionCalories}>
//                             {item.calories_per_serve} cal per {item.serving_size}
//                           </Text>
//                         </TouchableOpacity>
//                       )}
//                       style={styles.suggestionsList}
//                     />
//                   </View>
//                 )}
//               </View>

//               <View style={styles.mealButtonRow}>
//                 <TouchableOpacity
//                   style={[styles.mealButton, styles.cancelButton]}
//                   onPress={() => setMealInputVisible(false)}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.mealButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.mealButton, styles.saveButton]}
//                   onPress={handleSaveMeal}
//                   activeOpacity={0.8}
//                   disabled={!mealItem || !quantity}
//                 >
//                   <Text style={[styles.mealButtonText, { color: '#fff' }]}>Save Meal</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           <View style={[styles.card, styles.cardElevated]}>
//             <View style={styles.cardHeader}>
//               <View style={styles.cardTitleContainer}>
//                 <MaterialCommunityIcons name="chart-line" size={20} color="#2E3A59" />
//                 <Text style={[styles.cardTitle, { color: '#2E3A59' }]}>Today's Activity</Text>
//               </View>
//             </View>

//             <View style={styles.activityGrid}>
//               <View style={[styles.activityMetricCard, { backgroundColor: '#FFF8F0' }]}>
//                 <View style={[styles.metricIconContainer, { backgroundColor: '#FFEDD5' }]}>
//                   <MaterialCommunityIcons name="food" size={18} color="#ED8936" />
//                 </View>
//                 <Text style={styles.metricValue}>{totalCaloriesEaten}/{mealTarget}</Text>
//                 {/* <Text style={styles.metricValue}>1000/1000</Text> */}
//                 <Text style={styles.metricLabel}>Calories In</Text>
//                 <View style={styles.metricTrend}>
//                   <Feather name="arrow-up" size={14} color="#48BB78" />
//                   <Text style={[styles.metricTrendText, { color: '#48BB78' }]}>{(totalCaloriesEaten / mealTarget) * 100}%</Text>
//                 </View>
//               </View>

//               <View style={[styles.activityMetricCard, { backgroundColor: '#FFF5F5' }]}>
//                 <View style={[styles.metricIconContainer, { backgroundColor: '#FED7D7' }]}>
//                   <MaterialCommunityIcons name="fire" size={18} color="#F56565" />
//                 </View>
//                 <Text style={styles.metricValue}>{totalCaloriesBurned}/{burnTarget}</Text>
//                 <Text style={styles.metricLabel}>Calories Out</Text>
//                 <View style={styles.metricTrend}>
//                   <Feather name="arrow-up" size={14} color="#FC8181" />
//                   <Text style={[styles.metricTrendText, { color: '#FC8181' }]}>0%</Text>
//                 </View>
//               </View>

//               <View style={[styles.activityMetricCard, { backgroundColor: '#F0F9FF' }]}>
//                 <View style={[styles.metricIconContainer, { backgroundColor: '#DBEAFE' }]}>
//                   <MaterialCommunityIcons name="clock-outline" size={18} color="#4299E1" />
//                 </View>
//                 <Text style={styles.metricValue}>0</Text>
//                 <Text style={styles.metricLabel}>Active Min</Text>
//                 <View style={styles.metricTrend}>
//                   <Feather name="arrow-down" size={14} color="#ED8936" />
//                   <Text style={[styles.metricTrendText, { color: '#ED8936' }]}>0%</Text>
//                 </View>
//               </View>

//               <View style={[styles.activityMetricCard, { backgroundColor: '#FAF5FF' }]}>
//                 <View style={[styles.metricIconContainer, { backgroundColor: '#E9D8FD' }]}>
//                   <MaterialCommunityIcons name="target" size={18} color="#9F7AEA" />
//                 </View>
//                 <Text style={styles.metricValue}>
//                   {completedGoals}/{totalGoals}
//                 </Text>
//                 <Text style={styles.metricLabel}>Goals Met</Text>
//                 <View style={styles.progressCircle}>
//                   <Text style={styles.progressCircleText}>
//                     {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.activityProgressContainer}>
//               <Text style={styles.activityProgressText}>Daily Activity Progress</Text>
//               <View style={styles.fullProgressBar}>
//                 <View style={[styles.activityProgressFill, {
//                   // width: `${totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%`,
//                   width: `${totalProgress}%`,
//                   backgroundColor: '#4C51BF'
//                 }]} />
//               </View>
//               {/* <Text style={styles.activityProgressPercent}>{totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}% Complete</Text> */}
//               <Text style={styles.activityProgressPercent}>{totalProgress}% Complete</Text>
//             </View>
//           </View>

//           <View style={[styles.card, styles.cardElevated]}>
//             <View style={styles.cardHeader}>
//               <View style={styles.cardTitleContainer}>
//                 <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
//                 <Text style={styles.cardTitle}>Skating Tracking</Text>
//               </View>
//               <TouchableOpacity onPress={handleSkatingPress}>
//                 <Feather name="chevron-right" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.recentSessionContainer}>
//               <View style={styles.recentSessionIcon}>
//                 <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
//               </View>
//               <View style={styles.recentSessionDetails}>
//                 <Text style={styles.recentSessionTitle}>Speed Skating</Text>
//                 {isConnected ? (
//                   <Text style={styles.recentSessionStats}>
//                     {skatingData.speed ?? 0}km/h • {skatingData.strideCount ?? 0} strides
//                   </Text>
//                 ) : (
//                   <Text style={styles.recentSessionStats}>Connect device to track skating</Text>
//                 )}
//               </View>
//               <Text style={styles.recentSessionTime}>Today, 07:30 AM</Text>
//             </View>
//           </View>

//           <View style={[styles.card, styles.cardElevated]}>
//             <View style={styles.cardHeader}>
//               <View style={styles.cardTitleContainer}>
//                 <Feather name="activity" size={20} color="#00C853" />
//                 <Text style={styles.cardTitle}>Step Count</Text>
//               </View>
//               <TouchableOpacity onPress={() => navigation.navigate('StepCount')}>
//                 <Feather name="chevron-right" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.stepProgressContainer}>
//               <View style={styles.stepProgressText}>
//                 <Text style={styles.stepCount}>{stepData.steps ?? 0}</Text>
//                 <Text style={styles.stepGoal}> /{stepGoal} steps</Text>
//               </View>
//               <View style={styles.progressBarContainer}>
//                 <LinearGradient
//                   colors={['#4B6CB7', '#6B8CE8']}
//                   style={[styles.progressFill, { width: `${((stepData.steps ?? 0) / 10000) * 100}%` }]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                 />
//               </View>
//               <Text style={styles.progressPercentage}>
//                 {Math.round(((stepData.steps ?? 0) / 10000) * 100)}% of daily goal
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.card, styles.cardElevated]}>
//             <View style={styles.cardHeader}>
//               <View style={styles.cardTitleContainer}>
//                 <MaterialCommunityIcons name="cup-water" size={20} color="#00B0FF" />
//                 <Text style={styles.cardTitle}>Water Intake</Text>
//               </View>
//               <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
//                 <Feather name="chevron-right" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.waterCardContent}>
//               <View style={styles.waterInfo}>
//                 <View style={styles.intakeRow}>
//                   <Text style={styles.intakeText}>
//                     <Text style={styles.intakeBold}>{todayTotal}</Text> /{target} ml
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   style={styles.addButton}
//                   onPress={handleAddWater}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.addButtonText}>+ 400 ml</Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.waterBottleContainer}>
//                 <View style={styles.waterBottle}>
//                   <View style={[
//                     styles.waterFill,
//                     { height: `${Math.min((todayTotal / target) * 100, 100)}%` }
//                   ]} />
//                 </View>
//               </View>
//             </View>
//           </View>
                
//           <View style={{ height: 30 }} />
//         </ScrollView>
//       </SafeAreaView>

//       {/* Meal Type Selection Modal */}
//       <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
//         <View style={styles.mealModalOverlay}>
//           <View style={styles.mealModalContainer}>
//             <Text style={styles.mealModalTitle}>Add Your Meal</Text>
//             <Text style={styles.mealModalSubtitle}>Select the meal type you want to add</Text>

//             <View style={styles.mealOptionsContainer}>
//               <TouchableOpacity
//                 style={[styles.mealOptionCard, styles.breakfastOption]}
//                 onPress={() => handleMealCardPress('Breakfast')}
//               >
//                 <View style={styles.mealOptionContent}>
//                   <View style={[styles.mealIconContainer, styles.breakfastIconBg]}>
//                     <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />
//                   </View>
//                   <Text style={styles.mealOptionText}>Breakfast</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#FF9800" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.mealOptionCard, styles.lunchOption]}
//                 onPress={() => handleMealCardPress('Lunch')}
//               >
//                 <View style={styles.mealOptionContent}>
//                   <View style={[styles.mealIconContainer, styles.lunchIconBg]}>
//                     <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
//                   </View>
//                   <Text style={styles.mealOptionText}>Lunch</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#4CAF50" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.mealOptionCard, styles.snackOption]}
//                 onPress={() => handleMealCardPress('Snack')}
//               >
//                 <View style={styles.mealOptionContent}>
//                   <View style={[styles.mealIconContainer, styles.snackIconBg]}>
//                     <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />
//                   </View>
//                   <Text style={styles.mealOptionText}>Snack</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#9C27B0" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.mealOptionCard, styles.dinnerOption]}
//                 onPress={() => handleMealCardPress('Dinner')}
//               >
//                 <View style={styles.mealOptionContent}>
//                   <View style={[styles.mealIconContainer, styles.dinnerIconBg]}>
//                     <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />
//                   </View>
//                   <Text style={styles.mealOptionText}>Dinner</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#2196F3" />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               style={styles.mealModalCancelButton}
//               onPress={() => setModalVisible(null)}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.mealModalCancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Device Pairing Modal */}
//       {/* <DevicePairingModal
//         visible={pairingModalVisible}
//         onClose={() => setPairingModalVisible(false)}
//         foundDevices={foundDevices}
//         connectToDevice={connectToDevice}
//         isScanning={isScanning}
//         scanForDevices={scanForDevices}
//         isConnected={isConnected}
//         connectedDevice={connectedDevice}
//       /> */}

//       {/* Skating Type Selection Modal */}
//       <Modal visible={skatingModalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Skating Type</Text>

//             <TouchableOpacity
//               style={[styles.skatingTypeCard, { backgroundColor: '#EDE7F6' }]}
//               onPress={() => startSkatingSession('speed')}
//             >
//               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
//               <Text style={styles.skatingTypeText}>Speed Skating</Text>
//               <Feather name="chevron-right" size={20} color="#666" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.skatingTypeCard, { backgroundColor: '#E3F2FD' }]}
//               onPress={() => startSkatingSession('distance')}
//             >
//               <MaterialCommunityIcons name="map-marker-distance" size={24} color="#2196F3" />
//               <Text style={styles.skatingTypeText}>Distance Skating</Text>
//               <Feather name="chevron-right" size={20} color="#666" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setSkatingModalVisible(false)}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 40 : 40,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
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
    overflow: 'hidden',
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
    color: '#2E3A59',
    marginLeft: '2%',
    fontWeight: '500',
  },
  timeText: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
  },
  mealInputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: width * 0.04,
    color: '#333',
    paddingVertical: 12,
  },
  foodDetailsContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  foodDetailsText: {
    fontSize: 16,
    color: '#2E3A59',
    fontWeight: '500',
  },
  calorieCalculation: {
    fontSize: 14,
    color: '#4B6CB7',
    marginTop: 4,
    fontWeight: '600',
  },
  mealButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    borderRadius: 12,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#4B6CB7',
  },
  mealButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#2E3A59',
  },
  activityGradient: {
    padding: '4%',
    borderRadius: 16,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityMetricCard: {
    width: '48%',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '4%',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
  },
  metricValue: {
    fontSize: width * 0.05,
    color: '#2E3A59',
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
    marginBottom: '2%',
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontSize: width * 0.035,
    marginLeft: 4,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
    borderWidth: 1,
    borderColor: 'rgba(74,108,183,0.2)',
  },
  progressCircleText: {
    fontSize: width * 0.035,
    color: '#4B6CB7',
    fontWeight: 'bold',
  },
  activityProgressContainer: {
    marginTop: '4%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: '4%',
    width: '100%',
  },
  activityProgressText: {
    fontSize: width * 0.04,
    color: '#2E3A59',
    marginBottom: '2%',
  },
  fullProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: '2%',
  },
  activityProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  activityProgressPercent: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
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
    color: '#5A6A8C',
    fontSize: width * 0.04,
  },
  intakeBold: {
    fontSize: width * 0.05,
    color: '#2E3A59',
    fontWeight: 'bold',
  },
  recentSessionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  recentSessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(123, 31, 162, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentSessionDetails: {
    flex: 1,
  },
  recentSessionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
  },
  recentSessionStats: {
    fontSize: 14,
    color: '#5A6A8C',
    marginTop: 4,
  },
  recentSessionTime: {
    fontSize: 12,
    color: '#9AA5B9',
    alignSelf: 'flex-start',
  },
  stepProgressContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: '4%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  stepProgressText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  stepCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  stepGoal: {
    fontSize: 16,
    color: '#5A6A8C',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#4B6CB7',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4B6CB7',
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
    fontWeight: '500',
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
    backgroundColor: '#4B6CB7',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 20,
    textAlign: 'center',
  },
  skatingTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  skatingTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
    flex: 1,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    color: '#2E3A59',
    fontSize: 16,
    fontWeight: '500',
  },
  pairingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  pairingModalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1,
  },
  scanningContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  scanningAnimation: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bluetoothIcon: {
    position: 'absolute',
  },
  scanningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  requirementsContainer: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 40,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  requirementText: {
    fontSize: 14,
    color: '#2E3A59',
    marginLeft: 12,
    fontWeight: '500',
  },
  devicesContainer: {
    paddingVertical: 16,
    backgroundColor: '#F8FAFF',
  },
  devicesFoundText: {
    fontSize: 12,
    color: '#5A6A8C',
    marginBottom: 12,
    paddingHorizontal: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceListContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#4B6CB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceInfoContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#9AA5B9',
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
  },
  noDevicesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  noDevicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
  },
  noDevicesSubtitle: {
    fontSize: 14,
    color: '#5A6A8C',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#4B6CB7',
    marginLeft: 8,
    shadowColor: '#4B6CB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#4B6CB7',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  deviceItemConnecting: {
    backgroundColor: '#F0F4FF',
  },
  deviceNameConnecting: {
    color: '#5A6A8C',
  },
  mealModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mealModalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  mealModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E3A59',
    marginBottom: 4,
    textAlign: 'center',
  },
  mealModalSubtitle: {
    fontSize: 14,
    color: '#9AA5B9',
    textAlign: 'center',
    marginBottom: 24,
  },
  mealOptionsContainer: {
    marginBottom: 16,
  },
  mealOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  breakfastOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  lunchOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  snackOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  dinnerOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  mealOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  breakfastIconBg: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  lunchIconBg: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  snackIconBg: {
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
  },
  dinnerIconBg: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  mealOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  mealModalCancelButton: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  mealModalCancelText: {
    color: '#5A6A8C',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 4,
  },
  suggestionsList: {
    padding: 8,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  suggestionCalories: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
});

export default HomeScreen;




