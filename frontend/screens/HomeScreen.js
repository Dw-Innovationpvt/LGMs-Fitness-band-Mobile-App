import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,Alert, ActivityIndicator,
  ScrollView, Dimensions, Modal, SafeAreaView, TextInput, FlatList
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store/authStore';
import useWaterStore from '../store/waterStore';

import { useBLEStore } from '../store/bleStore'; // Import the BLE store


const { width, height } = Dimensions.get('window');

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
  const { totalCaloriesBurned, getWorkoutCount } = useAuthStore();
  const {
    connectToDevice,
    disconnect,
    isConnected,
    bandActive,
    toggleBand,
    // data: bleData,
    data,
    sendCommand
  } = useBLEStore();

  const { activateSpeedSkating, activateDistanceSkating, activateFreestyleSkating, skatingMode } = useBLEStore();

  const userName = 'Madan';
  const [modalVisible, setModalVisible] = useState(null);
  const [mealInputVisible, setMealInputVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('');
  const [mealItems, setMealItems] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [skatingModalVisible, setSkatingModalVisible] = useState(false);

  // ble down code
    const [pairingModalVisible, setPairingModalVisible] = useState(false);
  const [foundDevices, setFoundDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

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
    // connectToDevice();
    getWorkoutCount();
        // related to step counting 
        sendCommand('SET_MODE STEP_COUNTING');
        return () => sendCommand('SET_MODE SKATING_SPEED');
  }, []);

  // Handle water errors
  useEffect(() => {
    if (waterError) {
      Alert.alert('Water Error', waterError);
    }
    // if (bleError) Alert.alert('Bluetooth Error', bleError);
  // }, [waterError, bleError]);
  }, [waterError]);

  // Handle BLE device scanning
  const scanForDevices = async () => {
    try {
      setIsScanning(true);
      setFoundDevices([]);
      
      // This would be implemented in your BLE store
      const devices = await useBLEStore.getState().scanForDevices();
      setFoundDevices(devices);
      
      setIsScanning(false);
    } catch (error) {
      Alert.alert('Scan Error', error.message);
      setIsScanning(false);
    }
  };
  // Handle BLE device scanning
  const handleScanDevices = async () => {
    setPairingModalVisible(true);
    try {
      await scanForDevices();
    } catch (error) {
      Alert.alert('Scan Error', error.message);
    }
  };

  // Handle device connection
  // const handleDeviceConnection = async (device) => {
  //   try {
  //     await connectToDevice(device);
  //     setPairingModalVisible(false);
  //     Alert.alert('Success', 'Device connected successfully');
  //   } catch (error) {
  //     Alert.alert('Connection Error', error.message);
  //   }
  // };

  const handleAddWater = async () => {
    const result = await addIntake(400); // Add 400ml
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const completedGoals = dailyData.goals.filter(goal => goal.completed).length;

  const handleMealCardPress = (mealType) => {
    setModalVisible(null);
    setCurrentMealType(mealType);
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
    const handleDeviceConnection = async (device) => {
    try {
      await connectToDevice(device);
      setPairingModalVisible(false);
      Alert.alert('Success', 'Device connected successfully');
    } catch (error) {
      Alert.alert('Connection Error', error.message);
    }
  };
  const handleSaveMeal = async() => {
    if (mealItems.trim()) {
      const newMeal = {
        mealType: currentMealType,
        name: mealItems,
        time: currentTime,
        calories: 10 // You can add calorie calculation logic here
      };

      // post this meal to the backend
      const responseWorkout = await postMeals(newMeal);

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

  const handleSkatingPress = () => {
    setSkatingModalVisible(true);
  };

  const startSkatingSession = async (type) => {
    setSkatingModalVisible(false);
    if (type == 'speed'){
      await activateSpeedSkating();
      // Current mode will be 'speed'
      console.log(skatingMode,'226-home'); 
      console.log('hii-227home');
    }
    else if (type=='distance'){
      await activateDistanceSkating();
      
    }
    else {
      await activateFreestyleSkating();

    }
    navigation.navigate('SkatingTracking', { skatingType: type });
  };
  


  const handlePairDevicePress = () => {
    connectToDevice();
    handleConnect();
    setPairingModalVisible(true);
    scanForDevices();
  };

  const renderDeviceItem = ({ item }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToDevice(item);
      setPairingModalVisible(false);
      Alert.alert('Connected', `Successfully connected to ${item.name || 'device'}`);
    } catch (error) {
      Alert.alert('Connection Failed', error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.deviceItem,
        isConnecting && styles.deviceItemConnecting
      ]}
      onPress={handleConnect}
      disabled={isConnecting}
    >
      <View style={styles.deviceIconContainer}>
        <MaterialCommunityIcons 
          name="bluetooth" 
          size={24} 
          color={isConnecting ? "#999" : "#4B6CB7"} 
        />
      </View>
      
      <View style={styles.deviceInfoContainer}>
        <Text 
          style={[
            styles.deviceName,
            isConnecting && styles.deviceNameConnecting
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name || 'Unknown Device'}
        </Text>
        <Text style={styles.deviceId}>
          {item.id}
        </Text>
      </View>

      {isConnecting ? (
        <ActivityIndicator size="small" color="#4B6CB7" />
      ) : (
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={24} 
          color="#666" 
        />
      )}
    </TouchableOpacity>
  );
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
            // onPress={() => navigation.navigate('PairDevice')}
            onPress={() => handlePairDevicePress()}
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

{/* Enhanced Activity Card - Updated with muted colorful sub-cards */}
<View style={[styles.card, styles.cardElevated]}>
  <View style={styles.cardHeader}>
    <View style={styles.cardTitleContainer}>
      <MaterialCommunityIcons name="chart-line" size={20} color="#2E3A59" />
      <Text style={[styles.cardTitle, { color: '#2E3A59' }]}>Today's Activity</Text>
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('ActivityDetails')}>
      <Feather name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  </View>
  
  <View style={styles.activityGrid}>
    {/* Calories In - Muted orange */}
    <View style={[styles.activityMetricCard, { backgroundColor: '#FFF8F0' }]}>
      <View style={[styles.metricIconContainer, { backgroundColor: '#FFEDD5' }]}>
        <MaterialCommunityIcons name="food" size={18} color="#ED8936" />
      </View>
      <Text style={styles.metricValue}>{totalCalories}</Text>
      <Text style={styles.metricLabel}>Calories In</Text>
      <View style={styles.metricTrend}>
        <Feather name="arrow-up" size={14} color="#48BB78" />
        <Text style={[styles.metricTrendText, { color: '#48BB78' }]}>12%</Text>
      </View>
    </View>
    
    {/* Calories Out - Muted red */}
    <View style={[styles.activityMetricCard, { backgroundColor: '#FFF5F5' }]}>
      <View style={[styles.metricIconContainer, { backgroundColor: '#FED7D7' }]}>
        <MaterialCommunityIcons name="fire" size={18} color="#F56565" />
      </View>
      <Text style={styles.metricValue}>{totalCaloriesBurned}</Text>
      <Text style={styles.metricLabel}>Calories Out</Text>
      <View style={styles.metricTrend}>
        <Feather name="arrow-up" size={14} color="#FC8181" />
        <Text style={[styles.metricTrendText, { color: '#FC8181' }]}>18%</Text>
      </View>
    </View>
    
    {/* Active Minutes - Muted blue */}
    <View style={[styles.activityMetricCard, { backgroundColor: '#F0F9FF' }]}>
      <View style={[styles.metricIconContainer, { backgroundColor: '#DBEAFE' }]}>
        <MaterialCommunityIcons name="clock-outline" size={18} color="#4299E1" />
      </View>
      <Text style={styles.metricValue}>42</Text>
      <Text style={styles.metricLabel}>Active Min</Text>
      <View style={styles.metricTrend}>
        <Feather name="arrow-down" size={14} color="#ED8936" />
        <Text style={[styles.metricTrendText, { color: '#ED8936' }]}>5%</Text>
      </View>
    </View>
    
    {/* Goals Progress - Muted purple */}
    <View style={[styles.activityMetricCard, { backgroundColor: '#FAF5FF' }]}>
      <View style={[styles.metricIconContainer, { backgroundColor: '#E9D8FD' }]}>
        <MaterialCommunityIcons name="target" size={18} color="#9F7AEA" />
      </View>
      <Text style={styles.metricValue}>{completedGoals}/{dailyData.goals.length}</Text>
      <Text style={styles.metricLabel}>Goals Met</Text>
      <View style={styles.progressCircle}>
        <Text style={styles.progressCircleText}>
          {Math.round((completedGoals/dailyData.goals.length)*100)}%
        </Text>
      </View>
    </View>
  </View>
  
  {/* Activity Progress Bar */}
  <View style={styles.activityProgressContainer}>
    <Text style={styles.activityProgressText}>Daily Activity Progress</Text>
    <View style={styles.fullProgressBar}>
      <View style={[styles.activityProgressFill, { 
        width: '65%',
        backgroundColor: '#4C51BF' // More muted blue
      }]} />
    </View>
    <Text style={styles.activityProgressPercent}>65% Complete</Text>
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

  // In the HomeScreen component, replace the Skating Tracking and Step Count cards with these:

{/* Skating Tracking - Updated with recent session */}
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
      <Text style={styles.recentSessionStats}>15.2 km/h • 92 strides • 32 min</Text>
    </View>
    <Text style={styles.recentSessionTime}>Today, 07:30 AM</Text>
  </View>
</View>

{/* Step Count - Updated with today's progress */}
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
      {/* <Text style={styles.stepCount}>3,205</Text> */}
      <Text style={styles.stepCount}>{data?.s ?? data?.steps ?? 0}</Text>
      <Text style={styles.stepGoal}>/ 10,000 steps</Text>
    </View>
    <View style={styles.progressBarContainer}>
      <LinearGradient
        colors={['#4B6CB7', '#6B8CE8']}
        style={[styles.progressFill, { width: `${((data?.s ?? data?.steps ?? 0)/10000)*100}%` }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
    <Text style={styles.progressPercentage}>{Math.round((data?.s ?? data?.steps ?? 0 /10000)*100)}% of daily goal</Text>
  </View>
</View>
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

                       {/* Pairing Device Modal */}
       <Modal visible={pairingModalVisible} animationType="slide" transparent>
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>Pair Your Device</Text>
            
             {isScanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color="#4B6CB7" />
                <Text style={styles.scanningText}>Scanning for devices...</Text>
              </View>
            ) : (
              <FlatList
                data={foundDevices}
                keyExtractor={(item) => item.id}
                renderItem={renderDeviceItem}
                ListEmptyComponent={
                  <Text style={styles.noDevicesText}>No devices found</Text>
                }
                style={styles.deviceList}
              />
            )}

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleScanDevices}
              >
                <Text style={styles.secondaryButtonText}>Rescan</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]}
                onPress={() => setPairingModalVisible(false)}
              >
                <Text style={styles.primaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Skating Type Selection Modal */}
      <Modal visible={skatingModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
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
              style={[styles.skatingTypeCard, { backgroundColor: '#FFF3E0' }]}
              onPress={() => startSkatingSession('freestyle')}
            >
              <MaterialCommunityIcons name="skate" size={24} color="#FF9800" />
              <Text style={styles.skatingTypeText}>Freestyle Skating</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 60 : 60,
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
    color: '#2E3A59',
    textAlign: 'center',
    fontWeight: '500',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
    borderRadius: 12,
    marginBottom: '4%',
    borderWidth: 1,
    borderColor: '#F0F4FF',
  },
  mealCardText: {
    fontSize: width * 0.04,
    color: '#2E3A59',
    marginLeft: '3%',
    flex: 1,
    fontWeight: '500',
  },
  skatingTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
    borderRadius: 12,
    marginBottom: '4%',
    borderWidth: 1,
    borderColor: '#F0F4FF',
  },
  skatingTypeText: {
    fontSize: width * 0.04,
    color: '#2E3A59',
    marginLeft: '3%',
    flex: 1,
    fontWeight: '500',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: '3.5%',
    borderRadius: 12,
    marginTop: '2%',
    backgroundColor: '#F5F7FB',
  },
  cancelText: {
    color: '#5A6A8C',
    textAlign: 'center',
    fontWeight: '500',
  },




  // Pairing Modal Styles
  scanningContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scanningText: {
    marginTop: 10,
    color: '#666',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  noDevicesText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#4B6CB7',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333',
  },

  deviceItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
deviceItemConnecting: {
  opacity: 0.7,
},
deviceIconContainer: {
  marginRight: 12,
},
deviceInfoContainer: {
  flex: 1,
  marginRight: 12,
},
deviceName: {
  fontSize: 16,
  color: '#333',
  marginBottom: 2,
},
deviceNameConnecting: {
  color: '#999',
},
deviceId: {
  fontSize: 12,
  color: '#999',
},


});
export default HomeScreen;


// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, Alert,
//   ScrollView, Dimensions, Modal, SafeAreaView, TextInput,
//   FlatList, ActivityIndicator
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuthStore } from '../store/authStore';
// import useWaterStore from '../store/waterStore';
// import { useBLEStore } from '../store/bleStore';

// const { width, height } = Dimensions.get('window');

// const HomeScreen = ({ navigation }) => {
//   // Store hooks
//   const { postMeals, totalCaloriesBurned, getWorkoutCount } = useAuthStore();
//   const {
//     todayTotal,
//     target,
//     addIntake,
//     fetchTodayTotal,
//     fetchTarget,
//     loading: waterLoading,
//     error: waterError
//   } = useWaterStore();
//   const {
//     connectToDevice,
//     disconnect,
//     isConnected,
//     bandActive,
//     toggleBand,
//     data: bleData,
//     scanForDevices,
//     foundDevices,
//     isScanning,
//     error: bleError,
//     cleanup
//   } = useBLEStore();

//   // Local state
//   const [modalVisible, setModalVisible] = useState(null);
//   const [mealInputVisible, setMealInputVisible] = useState(false);
//   const [currentMealType, setCurrentMealType] = useState('');
//   const [mealItems, setMealItems] = useState('');
//   const [currentTime, setCurrentTime] = useState('');
//   const [skatingModalVisible, setSkatingModalVisible] = useState(false);
//   const [pairingModalVisible, setPairingModalVisible] = useState(false);

//   const userName = 'Madan';

//   // Initialize data
//   useEffect(() => {
//     fetchTodayTotal();
//     fetchTarget();
//     getWorkoutCount();

//     // Clean up BLE on unmount
//     return () => {
//       cleanup();
//     };
//   }, []);

//   // Handle errors
//   useEffect(() => {
//     if (waterError) Alert.alert('Water Error', waterError);
//     if (bleError) Alert.alert('Bluetooth Error', bleError);
//   }, [waterError, bleError]);

//   // Handle BLE device scanning
//   const handleScanDevices = async () => {
//     setPairingModalVisible(true);
//     try {
//       await scanForDevices();
//     } catch (error) {
//       Alert.alert('Scan Error', error.message);
//     }
//   };

//   // Handle device connection
//   const handleDeviceConnection = async (device) => {
//     try {
//       await connectToDevice(device);
//       setPairingModalVisible(false);
//       Alert.alert('Success', 'Device connected successfully');
//     } catch (error) {
//       Alert.alert('Connection Error', error.message);
//     }
//   };

//   // Handle meal addition
//   const handleSaveMeal = async () => {
//     if (mealItems.trim()) {
//       const newMeal = {
//         mealType: currentMealType,
//         name: mealItems,
//         time: currentTime,
//         calories: 10
//       };

//       try {
//         await postMeals(newMeal);
//         setMealItems('');
//         setMealInputVisible(false);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to save meal');
//       }
//     }
//   };

//   // Handle water addition
//   const handleAddWater = async () => {
//     try {
//       await addIntake(400);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   // Handle skating session start
//   const startSkatingSession = (type) => {
//     setSkatingModalVisible(false);
//     navigation.navigate('SkatingTracking', { skatingType: type });
//   };

//   // Get current time
//   const updateCurrentTime = () => {
//     const now = new Date();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
//   };

//   // Render methods
//   const renderDeviceItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.deviceItem}
//       onPress={() => handleDeviceConnection(item)}
//       disabled={isScanning}
//     >
//       <MaterialCommunityIcons name="bluetooth" size={24} color="#4B6CB7" />
//       <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
//       <Feather name="chevron-right" size={20} color="#666" />
//     </TouchableOpacity>
//   );

//   const renderSkatingStats = () => {
//     if (!isConnected || !bleData) return null;

//     return (
//       <View style={styles.skatingStatsContainer}>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{bleData.strides || 0}</Text>
//           <Text style={styles.statLabel}>Strides</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{bleData.speed ? bleData.speed.toFixed(1) : 0}</Text>
//           <Text style={styles.statLabel}>m/s</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{bleData.laps || 0}</Text>
//           <Text style={styles.statLabel}>Laps</Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Header Gradient */}
//       <LinearGradient 
//         colors={['#4B6CB7', '#182848']} 
//         style={styles.headerGradient}
//       >
//         {/* Header Content */}
//         <View style={styles.headerSection}>
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.greetingText}>Good Morning,</Text>
//             <Text style={styles.headerText}>{userName}</Text>
//           </View>
//           <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//             <View style={styles.profileIcon}>
//               <Feather name="user" size={20} color="#fff" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.topActions}>
//           <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={() => setModalVisible('meal')}
//           >
//             <View style={styles.actionIconContainer}>
//               <MaterialCommunityIcons name="food" size={24} color="#fff" />
//             </View>
//             <Text style={styles.actionLabel}>Add Meal</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={() => navigation.navigate('SetGoal')}
//           >
//             <View style={styles.actionIconContainer}>
//               <MaterialCommunityIcons name="target" size={24} color="#fff" />
//             </View>
//             <Text style={styles.actionLabel}>Set Goal</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={handleScanDevices}
//           >
//             <View style={styles.actionIconContainer}>
//               <MaterialCommunityIcons 
//                 name={isConnected ? "bluetooth-connected" : "bluetooth"} 
//                 size={24} 
//                 color="#fff" 
//               />
//             </View>
//             <Text style={styles.actionLabel}>
//               {isConnected ? "Connected" : "Pair Device"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {/* Main Content */}
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Meal Input Card */}
//         {mealInputVisible && (
//           <View style={[styles.card, styles.mealInputCard]}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>Add {currentMealType}</Text>
//               <Text style={styles.timeText}>{currentTime}</Text>
//             </View>
//             <TextInput
//               placeholder={`What did you have for ${currentMealType.toLowerCase()}?`}
//               style={styles.input}
//               value={mealItems}
//               onChangeText={setMealItems}
//               multiline
//             />
//             <View style={styles.mealButtonRow}>
//               <TouchableOpacity 
//                 style={styles.cancelMealButton}
//                 onPress={() => setMealInputVisible(false)}
//               >
//                 <Text style={styles.cancelMealButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.saveMealButton}
//                 onPress={handleSaveMeal}
//               >
//                 <Text style={styles.saveMealButtonText}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* Activity Card */}
//         <View style={[styles.card, styles.activityCard]}>
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardTitle}>Today's Activity</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('ActivityDetails')}>
//               <Feather name="chevron-right" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.activityGrid}>
//             {/* Activity metrics */}
//             <View style={styles.activityMetric}>
//               <Text style={styles.metricValue}>{totalCaloriesBurned || 0}</Text>
//               <Text style={styles.metricLabel}>Calories Burned</Text>
//             </View>
//             {/* Add more metrics as needed */}
//           </View>
//         </View>

//         {/* Water Card */}
//         <View style={[styles.card, styles.waterCard]}>
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardTitle}>Water Intake</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
//               <Feather name="chevron-right" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.waterContent}>
//             <Text style={styles.waterAmount}>
//               {todayTotal}ml / {target}ml
//             </Text>
//             <TouchableOpacity 
//               style={styles.addWaterButton}
//               onPress={handleAddWater}
//             >
//               <Text style={styles.addWaterButtonText}>+ 400ml</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Skating Card */}
//         <View style={[styles.card, styles.skatingCard]}>
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardTitle}>Skating Session</Text>
//             <TouchableOpacity onPress={() => setSkatingModalVisible(true)}>
//               <Feather name="chevron-right" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
//           {renderSkatingStats()}
//           <TouchableOpacity 
//             style={styles.startSessionButton}
//             onPress={() => navigation.navigate('SkatingTracking')}
//           >
//             <Text style={styles.startSessionButtonText}>
//               {isConnected ? 'Continue Session' : 'Start New Session'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Pairing Device Modal */}
//       <Modal visible={pairingModalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Pair Your Device</Text>
            
//             {isScanning ? (
//               <View style={styles.scanningContainer}>
//                 <ActivityIndicator size="large" color="#4B6CB7" />
//                 <Text style={styles.scanningText}>Scanning for devices...</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={foundDevices}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderDeviceItem}
//                 ListEmptyComponent={
//                   <Text style={styles.noDevicesText}>No devices found</Text>
//                 }
//                 style={styles.deviceList}
//               />
//             )}

//             <View style={styles.modalButtonRow}>
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.secondaryButton]}
//                 onPress={handleScanDevices}
//               >
//                 <Text style={styles.secondaryButtonText}>Rescan</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.primaryButton]}
//                 onPress={() => setPairingModalVisible(false)}
//               >
//                 <Text style={styles.primaryButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Skating Type Modal */}
//       <Modal visible={skatingModalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Skating Mode</Text>
            
//             <TouchableOpacity 
//               style={[styles.skatingModeButton, styles.speedMode]}
//               onPress={() => startSkatingSession('speed')}
//             >
//               <MaterialCommunityIcons name="speedometer" size={24} color="#fff" />
//               <Text style={styles.skatingModeText}>Speed Skating</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.skatingModeButton, styles.distanceMode]}
//               onPress={() => startSkatingSession('distance')}
//             >
//               <MaterialCommunityIcons name="map-marker-distance" size={24} color="#fff" />
//               <Text style={styles.skatingModeText}>Distance Skating</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.skatingModeButton, styles.freestyleMode]}
//               onPress={() => startSkatingSession('freestyle')}
//             >
//               <MaterialCommunityIcons name="skate" size={24} color="#fff" />
//               <Text style={styles.skatingModeText}>Freestyle</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={[styles.modalButton, styles.cancelButton]}
//               onPress={() => setSkatingModalVisible(false)}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   headerGradient: {
//     padding: 20,
//     paddingTop: 40,
//   },
//   headerSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   greetingText: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 16,
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   profileIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   topActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   actionCard: {
//     alignItems: 'center',
//     width: '30%',
//   },
//   actionIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   actionLabel: {
//     color: '#fff',
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 15,
//     paddingBottom: 30,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   timeText: {
//     color: '#666',
//     fontSize: 12,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     minHeight: 80,
//     marginBottom: 15,
//   },
//   mealButtonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   cancelMealButton: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: '#eee',
//     borderRadius: 8,
//     marginRight: 5,
//     alignItems: 'center',
//   },
//   saveMealButton: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: '#4B6CB7',
//     borderRadius: 8,
//     marginLeft: 5,
//     alignItems: 'center',
//   },
//   cancelMealButtonText: {
//     color: '#333',
//   },
//   saveMealButtonText: {
//     color: '#fff',
//   },
//   activityGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   activityMetric: {
//     width: '48%',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//   },
//   metricValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4B6CB7',
//   },
//   metricLabel: {
//     color: '#666',
//     fontSize: 12,
//   },
//   waterContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   waterAmount: {
//     fontSize: 18,
//     fontWeight: '500',
//   },
//   addWaterButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     backgroundColor: '#4B6CB7',
//     borderRadius: 20,
//   },
//   addWaterButtonText: {
//     color: '#fff',
//   },
//   skatingStatsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#4B6CB7',
//   },
//   statLabel: {
//     color: '#666',
//     fontSize: 12,
//   },
//   startSessionButton: {
//     padding: 12,
//     backgroundColor: '#4B6CB7',
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   startSessionButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   scanningContainer: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   scanningText: {
//     marginTop: 10,
//     color: '#666',
//   },
//   deviceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   deviceName: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   noDevicesText: {
//     textAlign: 'center',
//     padding: 20,
//     color: '#999',
//   },
//   deviceList: {
//     maxHeight: 300,
//   },
//   modalButtonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   modalButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#4B6CB7',
//     marginLeft: 10,
//   },
//   secondaryButton: {
//     backgroundColor: '#eee',
//     marginRight: 10,
//   },
//   primaryButtonText: {
//     color: '#fff',
//   },
//   secondaryButtonText: {
//     color: '#333',
//   },
//   skatingModeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   speedMode: {
//     backgroundColor: '#7B1FA2',
//   },
//   distanceMode: {
//     backgroundColor: '#2196F3',
//   },
//   freestyleMode: {
//     backgroundColor: '#FF9800',
//   },
//   skatingModeText: {
//     color: '#fff',
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   cancelButton: {
//     backgroundColor: '#eee',
//     marginTop: 10,
//   },
//   cancelButtonText: {
//     color: '#333',
//   },
// });

// export default HomeScreen;



// //   return (
// //     <SafeAreaView style={styles.safeArea}>




// //       {/* Header Gradient */}
// //       <LinearGradient 
// //         colors={['#4B6CB7', '#182848']} 
// //         style={styles.headerGradient}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //       >
// //         {/* Top Header */}
// //         <View style={styles.headerSection}>
// //           <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', marginTop: 10 }}>
// //             <Text style={styles.greetingText}>Good Morning,</Text>
// //             <Text style={styles.headerText}>{userName}</Text>
// //           </View>
// //           <TouchableOpacity 
// //             onPress={() => navigation.navigate('Profile')}
// //             activeOpacity={0.8}
// //           >
// //             <View style={styles.profileIcon}>
// //               <Feather name="user" size={20} color="#fff" />
// //             </View>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Quick Actions */}
// //         <View style={styles.topActions}>
// //           <TouchableOpacity 
// //             style={styles.actionCard} 
// //             onPress={() => setModalVisible('meal')}
// //             activeOpacity={0.7}
// //           >
// //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// //               <MaterialCommunityIcons name="food" size={24} color="#fff" />
// //             </View>
// //             <Text style={styles.actionLabel}>Add Meal</Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity 
// //             style={styles.actionCard} 
// //             onPress={() => navigation.navigate('SetGoal')}
// //             activeOpacity={0.7}
// //           >
// //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// //               <MaterialCommunityIcons name="target" size={24} color="#fff" />
// //             </View>
// //             <Text style={styles.actionLabel}>Set Goal</Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity 
// //             style={styles.actionCard} 
// //             onPress={() => navigation.navigate('PairDevice')}
// //             activeOpacity={0.7}
// //           >
// //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// //               <MaterialCommunityIcons name="watch" size={24} color="#fff" />
// //             </View>
// //             <Text style={styles.actionLabel}>Pair Device</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </LinearGradient>

// //       {/* Main Content */}
// //       <ScrollView 
// //         style={styles.scrollView}
// //         contentContainerStyle={styles.scrollContent}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Meal Input Card (shown when adding a meal) */}
// //         {mealInputVisible && (
// //           <View style={[styles.card, styles.cardElevated, { backgroundColor: getMealColor() }]}>
// //             <View style={styles.cardHeader}>
// //               <View style={styles.cardTitleContainer}>
// //                 {getMealIcon()}
// //                 <Text style={styles.cardTitle}>Add {currentMealType}</Text>
// //               </View>
// //               <Text style={styles.timeText}>{currentTime}</Text>
// //             </View>
            
// //             <TextInput
// //               placeholder={`What did you have for ${currentMealType.toLowerCase()}?`}
// //               style={styles.input}
// //               value={mealItems}
// //               onChangeText={setMealItems}
// //               placeholderTextColor="#999"
// //               multiline
// //             />
            
// //             <View style={styles.mealButtonRow}>
// //               <TouchableOpacity 
// //                 style={[styles.mealButton, { backgroundColor: '#E0E0E0' }]} 
// //                 onPress={() => setMealInputVisible(false)}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={[styles.mealButtonText, { color: '#333' }]}>Cancel</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity 
// //                 style={[styles.mealButton, { backgroundColor: '#1A2980' }]} 
// //                 onPress={handleSaveMeal}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={[styles.mealButtonText, { color: '#fff' }]}>Save {currentMealType}</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         )}

// // {/* Enhanced Activity Card - Updated with muted colorful sub-cards */}
// // <View style={[styles.card, styles.cardElevated]}>
// //   <View style={styles.cardHeader}>
// //     <View style={styles.cardTitleContainer}>
// //       <MaterialCommunityIcons name="chart-line" size={20} color="#2E3A59" />
// //       <Text style={[styles.cardTitle, { color: '#2E3A59' }]}>Today's Activity</Text>
// //     </View>
// //     <TouchableOpacity onPress={() => navigation.navigate('ActivityDetails')}>
// //       <Feather name="chevron-right" size={24} color="#666" />
// //     </TouchableOpacity>
// //   </View>
  
// //   <View style={styles.activityGrid}>
// //     {/* Calories In - Muted orange */}
// //     <View style={[styles.activityMetricCard, { backgroundColor: '#FFF8F0' }]}>
// //       <View style={[styles.metricIconContainer, { backgroundColor: '#FFEDD5' }]}>
// //         <MaterialCommunityIcons name="food" size={18} color="#ED8936" />
// //       </View>
// //       <Text style={styles.metricValue}>{totalCalories}</Text>
// //       <Text style={styles.metricLabel}>Calories In</Text>
// //       <View style={styles.metricTrend}>
// //         <Feather name="arrow-up" size={14} color="#48BB78" />
// //         <Text style={[styles.metricTrendText, { color: '#48BB78' }]}>12%</Text>
// //       </View>
// //     </View>
    
// //     {/* Calories Out - Muted red */}
// //     <View style={[styles.activityMetricCard, { backgroundColor: '#FFF5F5' }]}>
// //       <View style={[styles.metricIconContainer, { backgroundColor: '#FED7D7' }]}>
// //         <MaterialCommunityIcons name="fire" size={18} color="#F56565" />
// //       </View>
// //       <Text style={styles.metricValue}>{totalCaloriesBurned}</Text>
// //       <Text style={styles.metricLabel}>Calories Out</Text>
// //       <View style={styles.metricTrend}>
// //         <Feather name="arrow-up" size={14} color="#FC8181" />
// //         <Text style={[styles.metricTrendText, { color: '#FC8181' }]}>18%</Text>
// //       </View>
// //     </View>
    
// //     {/* Active Minutes - Muted blue */}
// //     <View style={[styles.activityMetricCard, { backgroundColor: '#F0F9FF' }]}>
// //       <View style={[styles.metricIconContainer, { backgroundColor: '#DBEAFE' }]}>
// //         <MaterialCommunityIcons name="clock-outline" size={18} color="#4299E1" />
// //       </View>
// //       <Text style={styles.metricValue}>42</Text>
// //       <Text style={styles.metricLabel}>Active Min</Text>
// //       <View style={styles.metricTrend}>
// //         <Feather name="arrow-down" size={14} color="#ED8936" />
// //         <Text style={[styles.metricTrendText, { color: '#ED8936' }]}>5%</Text>
// //       </View>
// //     </View>
    
// //     {/* Goals Progress - Muted purple */}
// //     <View style={[styles.activityMetricCard, { backgroundColor: '#FAF5FF' }]}>
// //       <View style={[styles.metricIconContainer, { backgroundColor: '#E9D8FD' }]}>
// //         <MaterialCommunityIcons name="target" size={18} color="#9F7AEA" />
// //       </View>
// //       <Text style={styles.metricValue}>{completedGoals}/{dailyData.goals.length}</Text>
// //       <Text style={styles.metricLabel}>Goals Met</Text>
// //       <View style={styles.progressCircle}>
// //         <Text style={styles.progressCircleText}>
// //           {Math.round((completedGoals/dailyData.goals.length)*100)}%
// //         </Text>
// //       </View>
// //     </View>
// //   </View>
  
// //   {/* Activity Progress Bar */}
// //   <View style={styles.activityProgressContainer}>
// //     <Text style={styles.activityProgressText}>Daily Activity Progress</Text>
// //     <View style={styles.fullProgressBar}>
// //       <View style={[styles.activityProgressFill, { 
// //         width: '65%',
// //         backgroundColor: '#4C51BF' // More muted blue
// //       }]} />
// //     </View>
// //     <Text style={styles.activityProgressPercent}>65% Complete</Text>
// //   </View>
// // </View>

// //         {/* Water Card */}
// //         <View style={[styles.card, styles.cardElevated]}>
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <MaterialCommunityIcons name="cup-water" size={20} color="#00B0FF" />
// //               <Text style={styles.cardTitle}>Water Intake</Text>
// //             </View>
// //             <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
// //               <Feather name="chevron-right" size={24} color="#666" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <View style={styles.waterCardContent}>
// //             <View style={styles.waterInfo}>
// //               <View style={styles.intakeRow}>
// //                 <Text style={styles.intakeText}>
// //                   <Text style={styles.intakeBold}>{todayTotal}</Text> /{target} ml
// //                 </Text>
// //               </View>
// //               <TouchableOpacity 
// //                 style={styles.addButton} 
// //                 onPress={handleAddWater}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={styles.addButtonText}>+ 400 ml</Text>
// //               </TouchableOpacity>
// //             </View>
            
// //             <View style={styles.waterBottleContainer}>
// //               <View style={styles.waterBottle}>
// //                 <View style={[
// //                   styles.waterFill,
// //                   { height: `${Math.min((todayTotal / target) * 100, 100)}%` }
// //                 ]} />
// //               </View>
// //             </View>
// //           </View>
// //         </View>

// //   // In the HomeScreen component, replace the Skating Tracking and Step Count cards with these:

// // {/* Skating Tracking - Updated with recent session */}
// // <View style={[styles.card, styles.cardElevated]}>
// //   <View style={styles.cardHeader}>
// //     <View style={styles.cardTitleContainer}>
// //       <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
// //       <Text style={styles.cardTitle}>Skating Tracking</Text>
// //     </View>
// //     <TouchableOpacity onPress={handleSkatingPress}>
// //       <Feather name="chevron-right" size={24} color="#666" />
// //     </TouchableOpacity>
// //   </View>
  
// //   <View style={styles.recentSessionContainer}>
// //     <View style={styles.recentSessionIcon}>
// //       <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// //     </View>
// //     <View style={styles.recentSessionDetails}>
// //       <Text style={styles.recentSessionTitle}>Speed Skating</Text>
// //       <Text style={styles.recentSessionStats}>15.2 km/h • 92 strides • 32 min</Text>
// //     </View>
// //     <Text style={styles.recentSessionTime}>Today, 07:30 AM</Text>
// //   </View>
// // </View>

// // {/* Step Count - Updated with today's progress */}
// // <View style={[styles.card, styles.cardElevated]}>
// //   <View style={styles.cardHeader}>
// //     <View style={styles.cardTitleContainer}>
// //       <Feather name="activity" size={20} color="#00C853" />
// //       <Text style={styles.cardTitle}>Step Count</Text>
// //     </View>
// //     <TouchableOpacity onPress={() => navigation.navigate('StepCount')}>
// //       <Feather name="chevron-right" size={24} color="#666" />
// //     </TouchableOpacity>
// //   </View>
  
// //   <View style={styles.stepProgressContainer}>
// //     <View style={styles.stepProgressText}>
// //       <Text style={styles.stepCount}>3,205</Text>
// //       <Text style={styles.stepGoal}>/ 10,000 steps</Text>
// //     </View>
// //     <View style={styles.progressBarContainer}>
// //       <LinearGradient
// //         colors={['#4B6CB7', '#6B8CE8']}
// //         style={[styles.progressFill, { width: `${(3205/10000)*100}%` }]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //       />
// //     </View>
// //     <Text style={styles.progressPercentage}>{Math.round((3205/10000)*100)}% of daily goal</Text>
// //   </View>
// // </View>
// //       </ScrollView>

// //       {/* Modal - Add Meal */}
// //       <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>Add Meals</Text>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#FFF3E0' }]}
// //               onPress={() => handleMealCardPress('Breakfast')}
// //             >
// //               <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />
// //               <Text style={styles.mealCardText}>Breakfast</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#E8F5E9' }]}
// //               onPress={() => handleMealCardPress('Lunch')}
// //             >
// //               <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
// //               <Text style={styles.mealCardText}>Lunch</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#F3E5F5' }]}
// //               onPress={() => handleMealCardPress('Snack')}
// //             >
// //               <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />
// //               <Text style={styles.mealCardText}>Snack</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#E3F2FD' }]}
// //               onPress={() => handleMealCardPress('Dinner')}
// //             >
// //               <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />
// //               <Text style={styles.mealCardText}>Dinner</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={styles.cancelButton} 
// //               onPress={() => setModalVisible(null)}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={styles.cancelText}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>

// //       {/* Skating Type Selection Modal */}
// //       <Modal visible={skatingModalVisible} animationType="slide" transparent>
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>Select Skating Type</Text>
            
// //             <TouchableOpacity 
// //               style={[styles.skatingTypeCard, { backgroundColor: '#EDE7F6' }]}
// //               onPress={() => startSkatingSession('speed')}
// //             >
// //               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// //               <Text style={styles.skatingTypeText}>Speed Skating</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.skatingTypeCard, { backgroundColor: '#E3F2FD' }]}
// //               onPress={() => startSkatingSession('distance')}
// //             >
// //               <MaterialCommunityIcons name="map-marker-distance" size={24} color="#2196F3" />
// //               <Text style={styles.skatingTypeText}>Distance Skating</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.skatingTypeCard, { backgroundColor: '#FFF3E0' }]}
// //               onPress={() => startSkatingSession('freestyle')}
// //             >
// //               <MaterialCommunityIcons name="skate" size={24} color="#FF9800" />
// //               <Text style={styles.skatingTypeText}>Freestyle Skating</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={styles.cancelButton} 
// //               onPress={() => setSkatingModalVisible(false)}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={styles.cancelText}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };





// // import React, { useState, useEffect } from 'react';
// // import {
// //   View, Text, StyleSheet, TouchableOpacity, Platform, Alert,
// //   ScrollView, Dimensions, Modal, SafeAreaView, TextInput
// // } from 'react-native';
// // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { useAuthStore } from '../store/authStore';
// // import useWaterStore from '../store/waterStore';

// // const { width, height } = Dimensions.get('window');

// // const HomeScreen = ({ navigation }) => {
// //   const { postMeals } = useAuthStore();
  
// //   // Water store integration
// //   const {
// //     todayTotal,
// //     target,
// //     addIntake,
// //     fetchTodayTotal,
// //     fetchTarget,
// //     loading: waterLoading,
// //     error: waterError
// //   } = useWaterStore();

// //   // calories related
// //   const { totalCaloriesBurned, getWorkoutCount } = useAuthStore();

// //   const userName = 'Madan';
// //   const [modalVisible, setModalVisible] = useState(null);
// //   const [mealInputVisible, setMealInputVisible] = useState(false);
// //   const [currentMealType, setCurrentMealType] = useState('');
// //   const [mealItems, setMealItems] = useState('');
// //   const [currentTime, setCurrentTime] = useState('');
// //   const [skatingModalVisible, setSkatingModalVisible] = useState(false);

// //   const [dailyData, setDailyData] = useState({
// //     meals: [
// //       { id: '1', type: 'Breakfast', items: 'Oatmeal, Banana', calories: 350, time: '08:30 AM' },
// //       { id: '2', type: 'Lunch', items: 'Grilled Chicken, Rice, Salad', calories: 550, time: '01:15 PM' },
// //       { id: '3', type: 'Snack', items: 'Protein Shake', calories: 200, time: '04:45 PM' },
// //     ],
// //     waterIntake: [
// //       { id: '1', amount: '500ml', time: '08:30 AM' },
// //       { id: '2', amount: '250ml', time: '10:45 AM' },
// //       { id: '3', amount: '750ml', time: '01:15 PM' },
// //     ],
// //     goals: [
// //       { id: '1', title: 'Drink 2L water', completed: false },
// //       { id: '2', title: '10,000 steps', completed: true },
// //       { id: '3', title: '30 min workout', completed: true },
// //     ],
// //   });

// //   // Initialize water data
// //   useEffect(() => {
// //     fetchTodayTotal();
// //     fetchTarget();
// //     getWorkoutCount();
// //   }, []);

// //   // Handle water errors
// //   useEffect(() => {
// //     if (waterError) {
// //       Alert.alert('Water Error', waterError);
// //     }
// //   }, [waterError]);

// //   const handleAddWater = async () => {
// //     const result = await addIntake(400); // Add 400ml
// //     if (!result.success) {
// //       Alert.alert('Error', result.error);
// //     }
// //   };

// //   const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
// //   const completedGoals = dailyData.goals.filter(goal => goal.completed).length;

// //   const handleMealCardPress = (mealType) => {
// //     setModalVisible(null);
// //     setCurrentMealType(mealType);
// //     setMealInputVisible(true);
    
// //     // Get current time
// //     const now = new Date();
// //     const hours = now.getHours();
// //     const minutes = now.getMinutes();
// //     const ampm = hours >= 12 ? 'PM' : 'AM';
// //     const formattedHours = hours % 12 || 12;
// //     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
// //     setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
// //   };

// //   const handleSaveMeal = async() => {
// //     if (mealItems.trim()) {
// //       const newMeal = {
// //         mealType: currentMealType,
// //         name: mealItems,
// //         time: currentTime,
// //         calories: 10 // You can add calorie calculation logic here
// //       };

// //       // post this meal to the backend
// //       const responseWorkout = await postMeals(newMeal);

// //       setDailyData(prev => ({
// //         ...prev,
// //         meals: [...prev.meals, newMeal]
// //       }));
      
// //       setMealItems('');
// //       setMealInputVisible(false);
// //     }
// //   };

// //   const getMealColor = () => {
// //     switch (currentMealType) {
// //       case 'Breakfast':
// //         return '#FFF3E0';
// //       case 'Lunch':
// //         return '#E8F5E9';
// //       case 'Snack':
// //         return '#F3E5F5';
// //       case 'Dinner':
// //         return '#E3F2FD';
// //       default:
// //         return '#F5F5F5';
// //     }
// //   };

// //   const getMealIcon = () => {
// //     switch (currentMealType) {
// //       case 'Breakfast':
// //         return <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />;
// //       case 'Lunch':
// //         return <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />;
// //       case 'Snack':
// //         return <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />;
// //       case 'Dinner':
// //         return <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />;
// //       default:
// //         return <MaterialCommunityIcons name="food" size={24} color="#666" />;
// //     }
// //   };

// //   const handleSkatingPress = () => {
// //     setSkatingModalVisible(true);
// //   };

// //   const startSkatingSession = (type) => {
// //     setSkatingModalVisible(false);
// //     navigation.navigate('SkatingTracking', { skatingType: type });
// //   };

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       {/* Header Gradient */}
// //       <LinearGradient 
// //         colors={['#4B6CB7', '#182848']} 
// //         style={styles.headerGradient}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //       >
// //         {/* Top Header */}
// //         <View style={styles.headerSection}>
// //           <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', marginTop: 10 }}>
// //             <Text style={styles.greetingText}>Good Morning,</Text>
// //             <Text style={styles.headerText}>{userName}</Text>
// //           </View>
// //           <TouchableOpacity 
// //             onPress={() => navigation.navigate('Profile')}
// //             activeOpacity={0.8}
// //           >
// //             <View style={styles.profileIcon}>
// //               <Feather name="user" size={20} color="#fff" />
// //             </View>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Quick Actions */}
// //         <View style={styles.topActions}>
// //           <TouchableOpacity 
// //             style={styles.actionCard} 
// //             onPress={() => setModalVisible('meal')}
// //             activeOpacity={0.7}
// //           >
// //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// //               <MaterialCommunityIcons name="food" size={24} color="#fff" />
// //             </View>
// //             <Text style={styles.actionLabel}>Add Meal</Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity 
// //             style={styles.actionCard} 
// //             onPress={() => navigation.navigate('SetGoal')}
// //             activeOpacity={0.7}
// //           >
// //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// //               <MaterialCommunityIcons name="target" size={24} color="#fff" />
// //             </View>
// //             <Text style={styles.actionLabel}>Set Goal</Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity 
// //             style={styles.actionCard} 
// //             onPress={() => navigation.navigate('PairDevice')}
// //             activeOpacity={0.7}
// //           >
// //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// //               <MaterialCommunityIcons name="watch" size={24} color="#fff" />
// //             </View>
// //             <Text style={styles.actionLabel}>Pair Device</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </LinearGradient>

// //       {/* Main Content */}
// //       <ScrollView 
// //         style={styles.scrollView}
// //         contentContainerStyle={styles.scrollContent}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Meal Input Card (shown when adding a meal) */}
// //         {mealInputVisible && (
// //           <View style={[styles.card, styles.cardElevated, { backgroundColor: getMealColor() }]}>
// //             <View style={styles.cardHeader}>
// //               <View style={styles.cardTitleContainer}>
// //                 {getMealIcon()}
// //                 <Text style={styles.cardTitle}>Add {currentMealType}</Text>
// //               </View>
// //               <Text style={styles.timeText}>{currentTime}</Text>
// //             </View>
            
// //             <TextInput
// //               placeholder={`What did you have for ${currentMealType.toLowerCase()}?`}
// //               style={styles.input}
// //               value={mealItems}
// //               onChangeText={setMealItems}
// //               placeholderTextColor="#999"
// //               multiline
// //             />
            
// //             <View style={styles.mealButtonRow}>
// //               <TouchableOpacity 
// //                 style={[styles.mealButton, { backgroundColor: '#E0E0E0' }]} 
// //                 onPress={() => setMealInputVisible(false)}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={[styles.mealButtonText, { color: '#333' }]}>Cancel</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity 
// //                 style={[styles.mealButton, { backgroundColor: '#1A2980' }]} 
// //                 onPress={handleSaveMeal}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={[styles.mealButtonText, { color: '#fff' }]}>Save {currentMealType}</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         )}

// //         {/* Activity Card */}
// //         <View style={[styles.card, styles.cardElevated]}>
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <MaterialCommunityIcons name="chart-line" size={20} color="#1A2980" />
// //               <Text style={styles.cardTitle}>Today's Activity</Text>
// //             </View>
// //           </View>
          
// //           <View style={styles.summaryRow}>
// //             <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
// //               <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
// //               <Text style={styles.summaryValue}>{totalCalories}</Text>
// //               <Text style={styles.summaryLabel}>Calories In</Text>
// //             </View>
// //             <View style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
// //               <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
// //               <Text style={styles.summaryValue}>{totalCaloriesBurned}</Text>
// //               <Text style={styles.summaryLabel}>Calories Out</Text>
// //             </View>
// //             <View style={[styles.summaryCard, { backgroundColor: '#FFF8E1' }]}>
// //               <MaterialCommunityIcons name="target" size={24} color="#FF9800" />
// //               <Text style={styles.summaryValue}>
// //                 {completedGoals}/{dailyData.goals.length}
// //               </Text>
// //               <Text style={styles.summaryLabel}>Goals</Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Water Card */}
// //         <View style={[styles.card, styles.cardElevated]}>
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <MaterialCommunityIcons name="cup-water" size={20} color="#00B0FF" />
// //               <Text style={styles.cardTitle}>Water Intake</Text>
// //             </View>
// //             <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
// //               <Feather name="chevron-right" size={24} color="#666" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <View style={styles.waterCardContent}>
// //             <View style={styles.waterInfo}>
// //               <View style={styles.intakeRow}>
// //                 <Text style={styles.intakeText}>
// //                   <Text style={styles.intakeBold}>{todayTotal}</Text> /{target} ml
// //                 </Text>
// //               </View>
// //               <TouchableOpacity 
// //                 style={styles.addButton} 
// //                 onPress={handleAddWater}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={styles.addButtonText}>+ 400 ml</Text>
// //               </TouchableOpacity>
// //             </View>
            
// //             <View style={styles.waterBottleContainer}>
// //               <View style={styles.waterBottle}>
// //                 <View style={[
// //                   styles.waterFill,
// //                   { height: `${Math.min((todayTotal / target) * 100, 100)}%` }
// //                 ]} />
// //               </View>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Skating Tracking - Updated with recent session */}
// //         <View style={[styles.card, styles.cardElevated]}>
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
// //               <Text style={styles.cardTitle}>Skating Tracking</Text>
// //             </View>
// //             <TouchableOpacity onPress={handleSkatingPress}>
// //               <Feather name="chevron-right" size={24} color="#666" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <View style={styles.recentSessionContainer}>
// //             <View style={styles.recentSessionIcon}>
// //               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// //             </View>
// //             <View style={styles.recentSessionDetails}>
// //               <Text style={styles.recentSessionTitle}>Speed Skating</Text>
// //               <Text style={styles.recentSessionStats}>15.2 km/h • 92 strides • 32 min</Text>
// //             </View>
// //             <Text style={styles.recentSessionTime}>Today, 07:30 AM</Text>
// //           </View>
// //         </View>

// //         {/* Step Count - Updated with today's progress */}
// //         <View style={[styles.card, styles.cardElevated]}>
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <Feather name="activity" size={20} color="#00C853" />
// //               <Text style={styles.cardTitle}>Step Count</Text>
// //             </View>
// //             <TouchableOpacity onPress={() => navigation.navigate('StepCount')}>
// //               <Feather name="chevron-right" size={24} color="#666" />
// //             </TouchableOpacity>
// //           </View>
          
// //           <View style={styles.stepProgressContainer}>
// //             <View style={styles.stepProgressText}>
// //               <Text style={styles.stepCount}>3,205</Text>
// //               <Text style={styles.stepGoal}>/ 10,000 steps</Text>
// //             </View>
// //             <View style={styles.progressBarContainer}>
// //               <LinearGradient
// //                 colors={['#4B6CB7', '#6B8CE8']}
// //                 style={[styles.progressFill, { width: `${(3205/10000)*100}%` }]}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 0 }}
// //               />
// //             </View>
// //             <Text style={styles.progressPercentage}>{Math.round((3205/10000)*100)}% of daily goal</Text>
// //           </View>
// //         </View>
// //       </ScrollView>

// //       {/* Modal - Add Meal */}
// //       <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>Add Meals</Text>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#FFF3E0' }]}
// //               onPress={() => handleMealCardPress('Breakfast')}
// //             >
// //               <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />
// //               <Text style={styles.mealCardText}>Breakfast</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#E8F5E9' }]}
// //               onPress={() => handleMealCardPress('Lunch')}
// //             >
// //               <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
// //               <Text style={styles.mealCardText}>Lunch</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#F3E5F5' }]}
// //               onPress={() => handleMealCardPress('Snack')}
// //             >
// //               <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />
// //               <Text style={styles.mealCardText}>Snack</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.mealCard, { backgroundColor: '#E3F2FD' }]}
// //               onPress={() => handleMealCardPress('Dinner')}
// //             >
// //               <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />
// //               <Text style={styles.mealCardText}>Dinner</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={styles.cancelButton} 
// //               onPress={() => setModalVisible(null)}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={styles.cancelText}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>

// //       {/* Skating Type Selection Modal */}
// //       <Modal visible={skatingModalVisible} animationType="slide" transparent>
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>Select Skating Type</Text>
            
// //             <TouchableOpacity 
// //               style={[styles.skatingTypeCard, { backgroundColor: '#EDE7F6' }]}
// //               onPress={() => startSkatingSession('speed')}
// //             >
// //               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// //               <Text style={styles.skatingTypeText}>Speed Skating</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.skatingTypeCard, { backgroundColor: '#E3F2FD' }]}
// //               onPress={() => startSkatingSession('distance')}
// //             >
// //               <MaterialCommunityIcons name="map-marker-distance" size={24} color="#2196F3" />
// //               <Text style={styles.skatingTypeText}>Distance Skating</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.skatingTypeCard, { backgroundColor: '#FFF3E0' }]}
// //               onPress={() => startSkatingSession('freestyle')}
// //             >
// //               <MaterialCommunityIcons name="skate" size={24} color="#FF9800" />
// //               <Text style={styles.skatingTypeText}>Freestyle Skating</Text>
// //               <Feather name="chevron-right" size={20} color="#666" />
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={styles.cancelButton} 
// //               onPress={() => setSkatingModalVisible(false)}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={styles.cancelText}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     paddingBottom: Platform.OS === 'ios' ? 0 : 60,
// //     backgroundColor: '#F5F7FB',
// //   },
// //   headerGradient: {
// //     marginTop: Platform.OS === 'ios' ? -60 : -10,
// //     paddingHorizontal: '6%',
// //     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
// //     paddingBottom: height * 0.02,
// //     borderBottomLeftRadius: 40,
// //     borderBottomRightRadius: 40,
// //     shadowColor: '#1A2980',
// //     shadowOffset: { width: 0, height: 10 },
// //     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
// //     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
// //     elevation: Platform.OS === 'android' ? 10 : 0,
// //   },
// //   headerSection: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     marginBottom: '8%',
// //   },
// //   greetingText: {
// //     fontSize: width * 0.045,
// //     marginRight: '2%',
// //     color: 'rgba(255,255,255,0.9)',
// //   },
// //   headerText: {
// //     fontSize: width * 0.055,
// //     color: '#fff',
// //     marginTop: '1%',
// //   },
// //   profileIcon: {
// //     width: width * 0.1,
// //     height: width * 0.1,
// //     borderRadius: width * 0.05,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   topActions: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginHorizontal: '-2%',
// //   },
// //   actionCard: {
// //     alignItems: 'center',
// //     width: '30%',
// //     paddingHorizontal: '2%',
// //   },
// //   actionIconContainer: {
// //     width: width * 0.14,
// //     height: width * 0.14,
// //     borderRadius: width * 0.07,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: '4%',
// //   },
// //   actionIconShadow: {
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //     elevation: 3,
// //   },
// //   actionLabel: {
// //     color: '#fff',
// //     fontSize: width * 0.033,
// //     textAlign: 'center',
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     padding: '4%',
// //     paddingBottom: '8%',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: '4%',
// //     marginBottom: '4%',
// //   },
// //   cardElevated: {
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: '4%',
// //   },
// //   cardTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   cardTitle: {
// //     fontSize: width * 0.045,
// //     color: '#333',
// //     marginLeft: '2%',
// //   },
// //   timeText: {
// //     fontSize: width * 0.035,
// //     color: '#666',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#E0E0E0',
// //     borderRadius: 12,
// //     padding: '4%',
// //     minHeight: width * 0.3,
// //     fontSize: width * 0.04,
// //     color: '#333',
// //     backgroundColor: '#fff',
// //     marginBottom: '4%',
// //     textAlignVertical: 'top',
// //   },
// //   mealButtonRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   mealButton: {
// //     borderRadius: 12,
// //     padding: '4%',
// //     width: '48%',
// //     alignItems: 'center',
// //   },
// //   mealButtonText: {
// //     fontSize: width * 0.04,
// //     fontWeight: '600',
// //   },
// //   summaryRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   summaryCard: {
// //     borderRadius: 12,
// //     padding: '4%',
// //     width: '30%',
// //     alignItems: 'center',
// //   },
// //   summaryValue: {
// //     fontSize: width * 0.05,
// //     marginVertical: '4%',
// //     color: '#333',
// //   },
// //   summaryLabel: {
// //     fontSize: width * 0.03,
// //     color: '#666',
// //   },
// //   waterCardContent: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-end',
// //   },
// //   waterInfo: {
// //     flex: 1,
// //   },
// //   intakeRow: {
// //     marginBottom: '4%',
// //   },
// //   intakeText: {
// //     color: '#333',
// //     fontSize: width * 0.04,
// //   },
// //   intakeBold: {
// //     fontSize: width * 0.05,
// //     color: '#333',
// //   },
// //   recentSessionContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //     backgroundColor: '#F5F7FB',
// //     borderRadius: 12,
// //     marginTop: 8,
// //   },
// //   recentSessionIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(123, 31, 162, 0.1)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   recentSessionDetails: {
// //     flex: 1,
// //   },
// //   recentSessionTitle: {
// //     fontSize: 16,
// //     fontWeight: '500',
// //     color: '#333',
// //   },
// //   recentSessionStats: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginTop: 4,
// //   },
// //   recentSessionTime: {
// //     fontSize: 12,
// //     color: '#999',
// //     alignSelf: 'flex-start',
// //   },
// //   stepProgressContainer: {
// //     marginTop: 8,
// //   },
// //   stepProgressText: {
// //     flexDirection: 'row',
// //     alignItems: 'baseline',
// //     marginBottom: 8,
// //   },
// //   stepCount: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   stepGoal: {
// //     fontSize: 16,
// //     color: '#666',
// //   },
// //   progressBarContainer: {
// //     height: 6,
// //     backgroundColor: '#f0f0f0',
// //     borderRadius: 3,
// //     overflow: 'hidden',
// //     marginBottom: 4,
// //   },
// //   progressFill: {
// //     height: '100%',
// //     borderRadius: 3,
// //   },
// //   progressPercentage: {
// //     fontSize: 12,
// //     color: '#4B6CB7',
// //     fontWeight: '500',
// //   },
// //   addButton: {
// //     backgroundColor: '#1A2980',
// //     borderRadius: 24,
// //     paddingVertical: '2.5%',
// //     paddingHorizontal: '5%',
// //     alignSelf: 'flex-start',
// //     shadowColor: '#1A2980',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },
// //   addButtonText: {
// //     color: '#fff',
// //     fontSize: width * 0.035,
// //   },
// //   waterBottleContainer: {
// //     marginLeft: '4%',
// //     alignItems: 'center',
// //   },
// //   waterBottle: {
// //     width: width * 0.15,
// //     height: width * 0.25,
// //     borderWidth: 2,
// //     borderColor: '#E0E0E0',
// //     borderBottomLeftRadius: 12,
// //     borderBottomRightRadius: 12,
// //     overflow: 'hidden',
// //     backgroundColor: '#F5F7FB',
// //     justifyContent: 'flex-end',
// //   },
// //   waterFill: {
// //     backgroundColor: '#00B0FF',
// //     width: '100%',
// //   },
// //   subCardRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   subCard: {
// //     borderRadius: 12,
// //     padding: '4%',
// //     width: '30%',
// //     alignItems: 'center',
// //   },
// //   subCardValue: {
// //     fontSize: width * 0.05,
// //     marginVertical: '4%',
// //     color: '#333',
// //   },
// //   subCardLabel: {
// //     fontSize: width * 0.03,
// //     color: '#666',
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContent: {
// //     width: '85%',
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: '6%',
// //   },
// //   modalTitle: {
// //     fontSize: width * 0.05,
// //     marginBottom: '5%',
// //     color: '#333',
// //     textAlign: 'center',
// //   },
// //   mealCard: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: '4%',
// //     borderRadius: 12,
// //     marginBottom: '4%',
// //   },
// //   mealCardText: {
// //     fontSize: width * 0.04,
// //     color: '#333',
// //     marginLeft: '3%',
// //     flex: 1,
// //   },
// //   skatingTypeCard: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: '4%',
// //     borderRadius: 12,
// //     marginBottom: '4%',
// //   },
// //   skatingTypeText: {
// //     fontSize: width * 0.04,
// //     color: '#333',
// //     marginLeft: '3%',
// //     flex: 1,
// //   },
// //   cancelButton: {
// //     borderWidth: 1,
// //     borderColor: '#E0E0E0',
// //     padding: '3.5%',
// //     borderRadius: 12,
// //     marginTop: '2%',
// //   },
// //   cancelText: {
// //     color: '#666',
// //     textAlign: 'center',
// //   },
// // });

// // export default HomeScreen;


// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View, Text, StyleSheet, TouchableOpacity, Platform,Alert,
// // //   ScrollView, Dimensions, Modal, SafeAreaView, TextInput
// // // } from 'react-native';
// // // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // // import { LinearGradient } from 'expo-linear-gradient';
// // // import { useAuthStore } from '../store/authStore';
// // // import useWaterStore from '../store/waterStore';

// // // const { width, height } = Dimensions.get('window');

// // // const HomeScreen = ({ navigation }) => {
// // //   const { postMeals } = useAuthStore();
  
// // //   // Water store integration
// // //   const {
// // //     todayTotal,
// // //     target,
// // //     addIntake,
// // //     fetchTodayTotal,
// // //     fetchTarget,
// // //     loading: waterLoading,
// // //     error: waterError
// // //   } = useWaterStore();

// // //   // calories related
// // //   const { totalCaloriesBurned, getWorkoutCount } = useAuthStore();

// // //   const userName = 'Madan';
// // //   const [modalVisible, setModalVisible] = useState(null);
// // //   const [mealInputVisible, setMealInputVisible] = useState(false);
// // //   const [currentMealType, setCurrentMealType] = useState('');
// // //   const [mealItems, setMealItems] = useState('');
// // //   const [currentTime, setCurrentTime] = useState('');
// // //   const [skatingModalVisible, setSkatingModalVisible] = useState(false);

// // //   const [dailyData, setDailyData] = useState({
// // //     meals: [
// // //       { id: '1', type: 'Breakfast', items: 'Oatmeal, Banana', calories: 350, time: '08:30 AM' },
// // //       { id: '2', type: 'Lunch', items: 'Grilled Chicken, Rice, Salad', calories: 550, time: '01:15 PM' },
// // //       { id: '3', type: 'Snack', items: 'Protein Shake', calories: 200, time: '04:45 PM' },
// // //     ],
// // //     waterIntake: [
// // //       { id: '1', amount: '500ml', time: '08:30 AM' },
// // //       { id: '2', amount: '250ml', time: '10:45 AM' },
// // //       { id: '3', amount: '750ml', time: '01:15 PM' },
// // //     ],
// // //     goals: [
// // //       { id: '1', title: 'Drink 2L water', completed: false },
// // //       { id: '2', title: '10,000 steps', completed: true },
// // //       { id: '3', title: '30 min workout', completed: true },
// // //     ],
// // //   });

// // //   // Initialize water data
// // //   useEffect(() => {
// // //     fetchTodayTotal();
// // //     fetchTarget();
// // //     getWorkoutCount();
// // //   }, []);

// // //   // Handle water errors
// // //   useEffect(() => {
// // //     if (waterError) {
// // //       Alert.alert('Water Error', waterError);
// // //     }
// // //   }, [waterError]);

// // //   const handleAddWater = async () => {
// // //     const result = await addIntake(400); // Add 400ml
// // //     if (!result.success) {
// // //       Alert.alert('Error', result.error);
// // //     }
// // //   };

// // //   const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
// // //   const completedGoals = dailyData.goals.filter(goal => goal.completed).length;

// // //   const handleMealCardPress = (mealType) => {
// // //     setModalVisible(null);
// // //     setCurrentMealType(mealType);
// // //     setMealInputVisible(true);
    
// // //     // Get current time
// // //     const now = new Date();
// // //     const hours = now.getHours();
// // //     const minutes = now.getMinutes();
// // //     const ampm = hours >= 12 ? 'PM' : 'AM';
// // //     const formattedHours = hours % 12 || 12;
// // //     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
// // //     setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
// // //   };

// // //   const handleSaveMeal = async() => {
// // //     if (mealItems.trim()) {
// // //       const newMeal = {
// // //         mealType: currentMealType,
// // //         name: mealItems,
// // //         time: currentTime,
// // //         calories: 10 // You can add calorie calculation logic here
// // //       };

// // //       // post this meal to the backend
// // //       const responseWorkout = await postMeals(newMeal);

// // //       setDailyData(prev => ({
// // //         ...prev,
// // //         meals: [...prev.meals, newMeal]
// // //       }));
      
// // //       setMealItems('');
// // //       setMealInputVisible(false);
// // //     }
// // //   };

// // //   const getMealColor = () => {
// // //     switch (currentMealType) {
// // //       case 'Breakfast':
// // //         return '#FFF3E0';
// // //       case 'Lunch':
// // //         return '#E8F5E9';
// // //       case 'Snack':
// // //         return '#F3E5F5';
// // //       case 'Dinner':
// // //         return '#E3F2FD';
// // //       default:
// // //         return '#F5F5F5';
// // //     }
// // //   };

// // //   const getMealIcon = () => {
// // //     switch (currentMealType) {
// // //       case 'Breakfast':
// // //         return <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />;
// // //       case 'Lunch':
// // //         return <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />;
// // //       case 'Snack':
// // //         return <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />;
// // //       case 'Dinner':
// // //         return <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />;
// // //       default:
// // //         return <MaterialCommunityIcons name="food" size={24} color="#666" />;
// // //     }
// // //   };

// // //   const handleSkatingPress = () => {
// // //     setSkatingModalVisible(true);
// // //   };

// // //   const startSkatingSession = (type) => {
// // //     setSkatingModalVisible(false);
// // //     navigation.navigate('SkatingTracking', { skatingType: type });
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       {/* Header Gradient */}
// // //       <LinearGradient 
// // //         colors={['#4B6CB7', '#182848']} 
// // //         style={styles.headerGradient}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 0 }}
// // //       >
// // //         {/* Top Header */}
// // //         <View style={styles.headerSection}>
// // //           <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', marginTop: 10 }}>
// // //             <Text style={styles.greetingText}>Good Morning,</Text>
// // //             <Text style={styles.headerText}>{userName}</Text>
// // //           </View>
// // //           <TouchableOpacity 
// // //             onPress={() => navigation.navigate('Profile')}
// // //             activeOpacity={0.8}
// // //           >
// // //             <View style={styles.profileIcon}>
// // //               <Feather name="user" size={20} color="#fff" />
// // //             </View>
// // //           </TouchableOpacity>
// // //         </View>

// // //         {/* Quick Actions */}
// // //         <View style={styles.topActions}>
// // //           <TouchableOpacity 
// // //             style={styles.actionCard} 
// // //             onPress={() => setModalVisible('meal')}
// // //             activeOpacity={0.7}
// // //           >
// // //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// // //               <MaterialCommunityIcons name="food" size={24} color="#fff" />
// // //             </View>
// // //             <Text style={styles.actionLabel}>Add Meal</Text>
// // //           </TouchableOpacity>

// // //           <TouchableOpacity 
// // //             style={styles.actionCard} 
// // //             onPress={() => navigation.navigate('SetGoal')}
// // //             activeOpacity={0.7}
// // //           >
// // //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// // //               <MaterialCommunityIcons name="target" size={24} color="#fff" />
// // //             </View>
// // //             <Text style={styles.actionLabel}>Set Goal</Text>
// // //           </TouchableOpacity>

// // //           <TouchableOpacity 
// // //             style={styles.actionCard} 
// // //             onPress={() => navigation.navigate('PairDevice')}
// // //             activeOpacity={0.7}
// // //           >
// // //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// // //               <MaterialCommunityIcons name="watch" size={24} color="#fff" />
// // //             </View>
// // //             <Text style={styles.actionLabel}>Pair Device</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </LinearGradient>

// // //       {/* Main Content */}
// // //       <ScrollView 
// // //         style={styles.scrollView}
// // //         contentContainerStyle={styles.scrollContent}
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {/* Meal Input Card (shown when adding a meal) */}
// // //         {mealInputVisible && (
// // //           <View style={[styles.card, styles.cardElevated, { backgroundColor: getMealColor() }]}>
// // //             <View style={styles.cardHeader}>
// // //               <View style={styles.cardTitleContainer}>
// // //                 {getMealIcon()}
// // //                 <Text style={styles.cardTitle}>Add {currentMealType}</Text>
// // //               </View>
// // //               <Text style={styles.timeText}>{currentTime}</Text>
// // //             </View>
            
// // //             <TextInput
// // //               placeholder={`What did you have for ${currentMealType.toLowerCase()}?`}
// // //               style={styles.input}
// // //               value={mealItems}
// // //               onChangeText={setMealItems}
// // //               placeholderTextColor="#999"
// // //               multiline
// // //             />
            
// // //             <View style={styles.mealButtonRow}>
// // //               <TouchableOpacity 
// // //                 style={[styles.mealButton, { backgroundColor: '#E0E0E0' }]} 
// // //                 onPress={() => setMealInputVisible(false)}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Text style={[styles.mealButtonText, { color: '#333' }]}>Cancel</Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity 
// // //                 style={[styles.mealButton, { backgroundColor: '#1A2980' }]} 
// // //                 onPress={handleSaveMeal}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Text style={[styles.mealButtonText, { color: '#fff' }]}>Save {currentMealType}</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         )}

// // //         {/* Activity Card */}
// // //         <View style={[styles.card, styles.cardElevated]}>
// // //           <View style={styles.cardHeader}>
// // //             <View style={styles.cardTitleContainer}>
// // //               <MaterialCommunityIcons name="chart-line" size={20} color="#1A2980" />
// // //               <Text style={styles.cardTitle}>Today's Activity</Text>
// // //             </View>
           
// // //           </View>
          
// // //           <View style={styles.summaryRow}>
// // //             <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
// // //               <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
// // //               <Text style={styles.summaryValue}>{totalCalories}</Text>
// // //               <Text style={styles.summaryLabel}>Calories In</Text>
// // //             </View>
// // //             <View style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
// // //               <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
// // //               <Text style={styles.summaryValue}>{totalCaloriesBurned}</Text>
// // //               <Text style={styles.summaryLabel}>Calories Out</Text>
// // //             </View>
// // //             <View style={[styles.summaryCard, { backgroundColor: '#FFF8E1' }]}>
// // //               <MaterialCommunityIcons name="target" size={24} color="#FF9800" />
// // //               <Text style={styles.summaryValue}>
// // //                 {completedGoals}/{dailyData.goals.length}
// // //               </Text>
// // //               <Text style={styles.summaryLabel}>Goals</Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Water Card */}
// // //         <View style={[styles.card, styles.cardElevated]}>
// // //           <View style={styles.cardHeader}>
// // //             <View style={styles.cardTitleContainer}>
// // //               <MaterialCommunityIcons name="cup-water" size={20} color="#00B0FF" />
// // //               <Text style={styles.cardTitle}>Water Intake</Text>
// // //             </View>
// // //             <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
// // //               <Feather name="chevron-right" size={24} color="#666" />
// // //             </TouchableOpacity>
// // //           </View>
          
// // //           <View style={styles.waterCardContent}>
// // //             <View style={styles.waterInfo}>
// // //               <View style={styles.intakeRow}>
// // //                 <Text style={styles.intakeText}>
// // //                   <Text style={styles.intakeBold}>{todayTotal}</Text> /{target} ml
// // //                 </Text>
// // //               </View>
// // //               <TouchableOpacity 
// // //                 style={styles.addButton} 
// // //                 onPress={handleAddWater}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Text style={styles.addButtonText}>+ 400 ml</Text>
// // //               </TouchableOpacity>
// // //             </View>
            
// // //             <View style={styles.waterBottleContainer}>
// // //               <View style={styles.waterBottle}>
// // //                 <View style={[
// // //                   styles.waterFill,
// // //                   { height: `${Math.min((todayTotal / target) * 100, 100)}%` }
// // //                 ]} />
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </View>

// // //   // In the HomeScreen component, replace the Skating Tracking and Step Count cards with these:

// // // {/* Skating Tracking - Updated with recent session */}
// // // <View style={[styles.card, styles.cardElevated]}>
// // //   <View style={styles.cardHeader}>
// // //     <View style={styles.cardTitleContainer}>
// // //       <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
// // //       <Text style={styles.cardTitle}>Skating Tracking</Text>
// // //     </View>
// // //     <TouchableOpacity onPress={handleSkatingPress}>
// // //       <Feather name="chevron-right" size={24} color="#666" />
// // //     </TouchableOpacity>
// // //   </View>
  
// // //   <View style={styles.recentSessionContainer}>
// // //     <View style={styles.recentSessionIcon}>
// // //       <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// // //     </View>
// // //     <View style={styles.recentSessionDetails}>
// // //       <Text style={styles.recentSessionTitle}>Speed Skating</Text>
// // //       <Text style={styles.recentSessionStats}>15.2 km/h • 92 strides • 32 min</Text>
// // //     </View>
// // //     <Text style={styles.recentSessionTime}>Today, 07:30 AM</Text>
// // //   </View>
// // // </View>

// // // {/* Step Count - Updated with today's progress */}
// // // <View style={[styles.card, styles.cardElevated]}>
// // //   <View style={styles.cardHeader}>
// // //     <View style={styles.cardTitleContainer}>
// // //       <Feather name="activity" size={20} color="#00C853" />
// // //       <Text style={styles.cardTitle}>Step Count</Text>
// // //     </View>
// // //     <TouchableOpacity onPress={() => navigation.navigate('StepCount')}>
// // //       <Feather name="chevron-right" size={24} color="#666" />
// // //     </TouchableOpacity>
// // //   </View>
  
// // //   <View style={styles.stepProgressContainer}>
// // //     <View style={styles.stepProgressText}>
// // //       <Text style={styles.stepCount}>3,205</Text>
// // //       <Text style={styles.stepGoal}>/ 10,000 steps</Text>
// // //     </View>
// // //     <View style={styles.progressBarContainer}>
// // //       <LinearGradient
// // //         colors={['#4B6CB7', '#6B8CE8']}
// // //         style={[styles.progressFill, { width: `${(3205/10000)*100}%` }]}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 0 }}
// // //       />
// // //     </View>
// // //     <Text style={styles.progressPercentage}>{Math.round((3205/10000)*100)}% of daily goal</Text>
// // //   </View>
// // // </View>
// // //       </ScrollView>

// // //       {/* Modal - Add Meal */}
// // //       <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
// // //         <View style={styles.modalContainer}>
// // //           <View style={styles.modalContent}>
// // //             <Text style={styles.modalTitle}>Add Meals</Text>
            
// // //             <TouchableOpacity 
// // //               style={[styles.mealCard, { backgroundColor: '#FFF3E0' }]}
// // //               onPress={() => handleMealCardPress('Breakfast')}
// // //             >
// // //               <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />
// // //               <Text style={styles.mealCardText}>Breakfast</Text>
// // //               <Feather name="chevron-right" size={20} color="#666" />
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity 
// // //               style={[styles.mealCard, { backgroundColor: '#E8F5E9' }]}
// // //               onPress={() => handleMealCardPress('Lunch')}
// // //             >
// // //               <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
// // //               <Text style={styles.mealCardText}>Lunch</Text>
// // //               <Feather name="chevron-right" size={20} color="#666" />
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity 
// // //               style={[styles.mealCard, { backgroundColor: '#F3E5F5' }]}
// // //               onPress={() => handleMealCardPress('Snack')}
// // //             >
// // //               <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />
// // //               <Text style={styles.mealCardText}>Snack</Text>
// // //               <Feather name="chevron-right" size={20} color="#666" />
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity 
// // //               style={[styles.mealCard, { backgroundColor: '#E3F2FD' }]}
// // //               onPress={() => handleMealCardPress('Dinner')}
// // //             >
// // //               <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />
// // //               <Text style={styles.mealCardText}>Dinner</Text>
// // //               <Feather name="chevron-right" size={20} color="#666" />
// // //             </TouchableOpacity>

// // //             <TouchableOpacity 
// // //               style={styles.cancelButton} 
// // //               onPress={() => setModalVisible(null)}
// // //               activeOpacity={0.8}
// // //             >
// // //               <Text style={styles.cancelText}>Cancel</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>
// // //       </Modal>

// // //       {/* Skating Type Selection Modal */}
// // //       <Modal visible={skatingModalVisible} animationType="slide" transparent>
// // //         <View style={styles.modalContainer}>
// // //           <View style={styles.modalContent}>
// // //             <Text style={styles.modalTitle}>Select Skating Type</Text>
            
// // //             <TouchableOpacity 
// // //               style={[styles.skatingTypeCard, { backgroundColor: '#EDE7F6' }]}
// // //               onPress={() => startSkatingSession('speed')}
// // //             >
// // //               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// // //               <Text style={styles.skatingTypeText}>Speed Skating</Text>
// // //               <Feather name="chevron-right" size={20} color="#666" />
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity 
// // //               style={[styles.skatingTypeCard, { backgroundColor: '#E3F2FD' }]}
// // //               onPress={() => startSkatingSession('distance')}
// // //             >
// // //               <MaterialCommunityIcons name="map-marker-distance" size={24} color="#2196F3" />
// // //               <Text style={styles.skatingTypeText}>Distance Skating</Text>
// // //               <Feather name="chevron-right" size={20} color="#666" />
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity 
// // //               style={[styles.skatingTypeCard, { backgroundColor: '#FFF3E0' }]}
// // //               onPress={() => startSkatingSession('freestyle')}
// // //             >
// // //               <MaterialCommunityIcons name="skate" size={24} color="#FF9800" />
// // //               <Text style={styles.skatingTypeText}>Freestyle Skating</Text>
// // //               <Feather name="chevron-right" size={20} color="#666" />
// // //             </TouchableOpacity>

// // //             <TouchableOpacity 
// // //               style={styles.cancelButton} 
// // //               onPress={() => setSkatingModalVisible(false)}
// // //               activeOpacity={0.8}
// // //             >
// // //               <Text style={styles.cancelText}>Cancel</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     paddingBottom: Platform.OS === 'ios' ? 0 : 60,
// // //     backgroundColor: '#F5F7FB',
// // //   },
// // //   headerGradient: {
// // //     marginTop: Platform.OS === 'ios' ? -60 : -10,
// // //     paddingHorizontal: '6%',
// // //     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
// // //     paddingBottom: height * 0.02,
// // //     borderBottomLeftRadius: 40,
// // //     borderBottomRightRadius: 40,
// // //     shadowColor: '#1A2980',
// // //     shadowOffset: { width: 0, height: 10 },
// // //     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
// // //     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
// // //     elevation: Platform.OS === 'android' ? 10 : 0,
// // //   },
// // //   headerSection: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     marginBottom: '8%',
// // //   },
// // //   greetingText: {
// // //     fontSize: width * 0.045,
// // //     marginRight: '2%',
// // //     color: 'rgba(255,255,255,0.9)',
// // //   },
// // //   headerText: {
// // //     fontSize: width * 0.055,
// // //     color: '#fff',
// // //     marginTop: '1%',
// // //   },
// // //   profileIcon: {
// // //     width: width * 0.1,
// // //     height: width * 0.1,
// // //     borderRadius: width * 0.05,
// // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   topActions: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginHorizontal: '-2%',
// // //   },
// // //   actionCard: {
// // //     alignItems: 'center',
// // //     width: '30%',
// // //     paddingHorizontal: '2%',
// // //   },
// // //   actionIconContainer: {
// // //     width: width * 0.14,
// // //     height: width * 0.14,
// // //     borderRadius: width * 0.07,
// // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: '4%',
// // //   },
// // //   actionIconShadow: {
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 6,
// // //     elevation: 3,
// // //   },
// // //   actionLabel: {
// // //     color: '#fff',
// // //     fontSize: width * 0.033,
// // //     textAlign: 'center',
// // //   },
// // //   scrollView: {
// // //     flex: 1,
// // //   },
// // //   scrollContent: {
// // //     padding: '4%',
// // //     paddingBottom: '8%',
// // //   },
// // //   card: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: '4%',
// // //     marginBottom: '4%',
// // //   },
// // //   cardElevated: {
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.08,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //   },
// // //   cardHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: '4%',
// // //   },
// // //   cardTitleContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   cardTitle: {
// // //     fontSize: width * 0.045,
// // //     color: '#333',
// // //     marginLeft: '2%',
// // //   },
// // //   timeText: {
// // //     fontSize: width * 0.035,
// // //     color: '#666',
// // //   },
// // //   input: {
// // //     borderWidth: 1,
// // //     borderColor: '#E0E0E0',
// // //     borderRadius: 12,
// // //     padding: '4%',
// // //     minHeight: width * 0.3,
// // //     fontSize: width * 0.04,
// // //     color: '#333',
// // //     backgroundColor: '#fff',
// // //     marginBottom: '4%',
// // //     textAlignVertical: 'top',
// // //   },
// // //   mealButtonRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //   },
// // //   mealButton: {
// // //     borderRadius: 12,
// // //     padding: '4%',
// // //     width: '48%',
// // //     alignItems: 'center',
// // //   },
// // //   mealButtonText: {
// // //     fontSize: width * 0.04,
// // //     fontWeight: '600',
// // //   },
// // //   summaryRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //   },
// // //   summaryCard: {
// // //     borderRadius: 12,
// // //     padding: '4%',
// // //     width: '30%',
// // //     alignItems: 'center',
// // //   },
// // //   summaryValue: {
// // //     fontSize: width * 0.05,
// // //     marginVertical: '4%',
// // //     color: '#333',
// // //   },
// // //   summaryLabel: {
// // //     fontSize: width * 0.03,
// // //     color: '#666',
// // //   },
// // //   waterCardContent: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-end',
// // //   },
// // //   waterInfo: {
// // //     flex: 1,
// // //   },
// // //   intakeRow: {
// // //     marginBottom: '4%',
// // //   },
// // //   intakeText: {
// // //     color: '#333',
// // //     fontSize: width * 0.04,
// // //   },
// // //   intakeBold: {
// // //     fontSize: width * 0.05,
// // //     color: '#333',
// // //   },
// // //   recentSessionContainer: {
// // //   flexDirection: 'row',
// // //   alignItems: 'center',
// // //   padding: 12,
// // //   backgroundColor: '#F5F7FB',
// // //   borderRadius: 12,
// // //   marginTop: 8,
// // // },
// // // recentSessionIcon: {
// // //   width: 40,
// // //   height: 40,
// // //   borderRadius: 20,
// // //   backgroundColor: 'rgba(123, 31, 162, 0.1)',
// // //   justifyContent: 'center',
// // //   alignItems: 'center',
// // //   marginRight: 12,
// // // },
// // // recentSessionDetails: {
// // //   flex: 1,
// // // },
// // // recentSessionTitle: {
// // //   fontSize: 16,
// // //   fontWeight: '500',
// // //   color: '#333',
// // // },
// // // recentSessionStats: {
// // //   fontSize: 14,
// // //   color: '#666',
// // //   marginTop: 4,
// // // },
// // // recentSessionTime: {
// // //   fontSize: 12,
// // //   color: '#999',
// // //   alignSelf: 'flex-start',
// // // },
// // // stepProgressContainer: {
// // //   marginTop: 8,
// // // },
// // // stepProgressText: {
// // //   flexDirection: 'row',
// // //   alignItems: 'baseline',
// // //   marginBottom: 8,
// // // },
// // // stepCount: {
// // //   fontSize: 24,
// // //   fontWeight: 'bold',
// // //   color: '#333',
// // // },
// // // stepGoal: {
// // //   fontSize: 16,
// // //   color: '#666',
// // // },
// // // progressBarContainer: {
// // //   height: 6,
// // //   backgroundColor: '#f0f0f0',
// // //   borderRadius: 3,
// // //   overflow: 'hidden',
// // //   marginBottom: 4,
// // // },
// // // progressFill: {
// // //   height: '100%',
// // //   borderRadius: 3,
// // // },
// // // progressPercentage: {
// // //   fontSize: 12,
// // //   color: '#4B6CB7',
// // //   fontWeight: '500',
// // // },
// // //   addButton: {
// // //     backgroundColor: '#1A2980',
// // //     borderRadius: 24,
// // //     paddingVertical: '2.5%',
// // //     paddingHorizontal: '5%',
// // //     alignSelf: 'flex-start',
// // //     shadowColor: '#1A2980',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //   },
// // //   addButtonText: {
// // //     color: '#fff',
// // //     fontSize: width * 0.035,
// // //   },
// // //   waterBottleContainer: {
// // //     marginLeft: '4%',
// // //     alignItems: 'center',
// // //   },
// // //   waterBottle: {
// // //     width: width * 0.15,
// // //     height: width * 0.25,
// // //     borderWidth: 2,
// // //     borderColor: '#E0E0E0',
// // //     borderBottomLeftRadius: 12,
// // //     borderBottomRightRadius: 12,
// // //     overflow: 'hidden',
// // //     backgroundColor: '#F5F7FB',
// // //     justifyContent: 'flex-end',
// // //   },
// // //   waterFill: {
// // //     backgroundColor: '#00B0FF',
// // //     width: '100%',
// // //   },
// // //   subCardRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //   },
// // //   subCard: {
// // //     borderRadius: 12,
// // //     padding: '4%',
// // //     width: '30%',
// // //     alignItems: 'center',
// // //   },
// // //   subCardValue: {
// // //     fontSize: width * 0.05,
// // //     marginVertical: '4%',
// // //     color: '#333',
// // //   },
// // //   subCardLabel: {
// // //     fontSize: width * 0.03,
// // //     color: '#666',
// // //   },
// // //   modalContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //   },
// // //   modalContent: {
// // //     width: '85%',
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: '6%',
// // //   },
// // //   modalTitle: {
// // //     fontSize: width * 0.05,
// // //     marginBottom: '5%',
// // //     color: '#333',
// // //     textAlign: 'center',
// // //   },
// // //   mealCard: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: '4%',
// // //     borderRadius: 12,
// // //     marginBottom: '4%',
// // //   },
// // //   mealCardText: {
// // //     fontSize: width * 0.04,
// // //     color: '#333',
// // //     marginLeft: '3%',
// // //     flex: 1,
// // //   },
// // //   skatingTypeCard: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: '4%',
// // //     borderRadius: 12,
// // //     marginBottom: '4%',
// // //   },
// // //   skatingTypeText: {
// // //     fontSize: width * 0.04,
// // //     color: '#333',
// // //     marginLeft: '3%',
// // //     flex: 1,
// // //   },
// // //   cancelButton: {
// // //     borderWidth: 1,
// // //     borderColor: '#E0E0E0',
// // //     padding: '3.5%',
// // //     borderRadius: 12,
// // //     marginTop: '2%',
// // //   },
// // //   cancelText: {
// // //     color: '#666',
// // //     textAlign: 'center',
// // //   },
// // // });

// // // export default HomeScreen;

// // // // // 9-july wednesday

// // // // import React, { useState, useEffect } from 'react';
// // // // import {
// // // //   View, Text, StyleSheet, TouchableOpacity, Platform,
// // // //   ScrollView, Dimensions, Modal, SafeAreaView, TextInput
// // // // } from 'react-native';
// // // // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // // // import { LinearGradient } from 'expo-linear-gradient';
// // // // import { useAuthStore } from '../store/authStore';
// // // // import useWaterStore from '../store/waterStore';

// // // // const { width, height } = Dimensions.get('window');

// // // // const HomeScreen = ({ navigation }) => {
// // // //   const { postMeals } = useAuthStore();
  
// // // //   // Water store integration
// // // //   const {
// // // //     todayTotal,
// // // //     target,
// // // //     addIntake,
// // // //     fetchTodayTotal,
// // // //     fetchTarget,
// // // //     loading: waterLoading,
// // // //     error: waterError
// // // //   } = useWaterStore();

// // // //   // calories related
// // // //   const { totalCaloriesBurned, getWorkoutCount } = useAuthStore();

// // // //   const userName = 'Madan';
// // // //   const [modalVisible, setModalVisible] = useState(null);
// // // //   const [mealInputVisible, setMealInputVisible] = useState(false);
// // // //   const [currentMealType, setCurrentMealType] = useState('');
// // // //   const [mealItems, setMealItems] = useState('');
// // // //   const [currentTime, setCurrentTime] = useState('');
// // // //   const [skatingModalVisible, setSkatingModalVisible] = useState(false);

// // // //   const [dailyData, setDailyData] = useState({
// // // //     meals: [
// // // //       { id: '1', type: 'Breakfast', items: 'Oatmeal, Banana', calories: 350, time: '08:30 AM' },
// // // //       { id: '2', type: 'Lunch', items: 'Grilled Chicken, Rice, Salad', calories: 550, time: '01:15 PM' },
// // // //       { id: '3', type: 'Snack', items: 'Protein Shake', calories: 200, time: '04:45 PM' },
// // // //     ],
// // // //     waterIntake: [
// // // //       { id: '1', amount: '500ml', time: '08:30 AM' },
// // // //       { id: '2', amount: '250ml', time: '10:45 AM' },
// // // //       { id: '3', amount: '750ml', time: '01:15 PM' },
// // // //     ],
// // // //     goals: [
// // // //       { id: '1', title: 'Drink 2L water', completed: false },
// // // //       { id: '2', title: '10,000 steps', completed: true },
// // // //       { id: '3', title: '30 min workout', completed: true },
// // // //     ],
// // // //   });

// // // //   // Initialize water data
// // // //   useEffect(() => {
// // // //     fetchTodayTotal();
// // // //     fetchTarget();
// // // //     getWorkoutCount();
// // // //   }, []);

// // // //   // Handle water errors
// // // //   useEffect(() => {
// // // //     if (waterError) {
// // // //       Alert.alert('Water Error', waterError);
// // // //     }
// // // //   }, [waterError]);

// // // //   const handleAddWater = async () => {
// // // //     const result = await addIntake(400); // Add 400ml
// // // //     if (!result.success) {
// // // //       Alert.alert('Error', result.error);
// // // //     }
// // // //   };

// // // //   const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
// // // //   const completedGoals = dailyData.goals.filter(goal => goal.completed).length;

// // // //   const handleMealCardPress = (mealType) => {
// // // //     setModalVisible(null);
// // // //     setCurrentMealType(mealType);
// // // //     setMealInputVisible(true);
    
// // // //     // Get current time
// // // //     const now = new Date();
// // // //     const hours = now.getHours();
// // // //     const minutes = now.getMinutes();
// // // //     const ampm = hours >= 12 ? 'PM' : 'AM';
// // // //     const formattedHours = hours % 12 || 12;
// // // //     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
// // // //     setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
// // // //   };

// // // //   const handleSaveMeal = async() => {
// // // //     if (mealItems.trim()) {
// // // //       const newMeal = {
// // // //         mealType: currentMealType,
// // // //         name: mealItems,
// // // //         time: currentTime,
// // // //         calories: 10 // You can add calorie calculation logic here
// // // //       };

// // // //       // post this meal to the backend
// // // //       const responseWorkout = await postMeals(newMeal);

// // // //       setDailyData(prev => ({
// // // //         ...prev,
// // // //         meals: [...prev.meals, newMeal]
// // // //       }));
      
// // // //       setMealItems('');
// // // //       setMealInputVisible(false);
// // // //     }
// // // //   };

// // // //   const getMealColor = () => {
// // // //     switch (currentMealType) {
// // // //       case 'Breakfast':
// // // //         return '#FFF3E0';
// // // //       case 'Lunch':
// // // //         return '#E8F5E9';
// // // //       case 'Snack':
// // // //         return '#F3E5F5';
// // // //       case 'Dinner':
// // // //         return '#E3F2FD';
// // // //       default:
// // // //         return '#F5F5F5';
// // // //     }
// // // //   };

// // // //   const getMealIcon = () => {
// // // //     switch (currentMealType) {
// // // //       case 'Breakfast':
// // // //         return <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />;
// // // //       case 'Lunch':
// // // //         return <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />;
// // // //       case 'Snack':
// // // //         return <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />;
// // // //       case 'Dinner':
// // // //         return <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />;
// // // //       default:
// // // //         return <MaterialCommunityIcons name="food" size={24} color="#666" />;
// // // //     }
// // // //   };

// // // //   const handleSkatingPress = () => {
// // // //     setSkatingModalVisible(true);
// // // //   };

// // // //   const startSkatingSession = (type) => {
// // // //     setSkatingModalVisible(false);
// // // //     navigation.navigate('SkatingTracking', { skatingType: type });
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.safeArea}>
// // // //       {/* Header Gradient */}
// // // //       <LinearGradient 
// // // //         colors={['#4B6CB7', '#182848']} 
// // // //         style={styles.headerGradient}
// // // //         start={{ x: 0, y: 0 }}
// // // //         end={{ x: 1, y: 0 }}
// // // //       >
// // // //         {/* Top Header */}
// // // //         <View style={styles.headerSection}>
// // // //           <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', marginTop: 10 }}>
// // // //             <Text style={styles.greetingText}>Good Morning,</Text>
// // // //             <Text style={styles.headerText}>{userName}</Text>
// // // //           </View>
// // // //           <TouchableOpacity 
// // // //             onPress={() => navigation.navigate('Profile')}
// // // //             activeOpacity={0.8}
// // // //           >
// // // //             <View style={styles.profileIcon}>
// // // //               <Feather name="user" size={20} color="#fff" />
// // // //             </View>
// // // //           </TouchableOpacity>
// // // //         </View>

// // // //         {/* Quick Actions */}
// // // //         <View style={styles.topActions}>
// // // //           <TouchableOpacity 
// // // //             style={styles.actionCard} 
// // // //             onPress={() => setModalVisible('meal')}
// // // //             activeOpacity={0.7}
// // // //           >
// // // //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// // // //               <MaterialCommunityIcons name="food" size={24} color="#fff" />
// // // //             </View>
// // // //             <Text style={styles.actionLabel}>Add Meal</Text>
// // // //           </TouchableOpacity>

// // // //           <TouchableOpacity 
// // // //             style={styles.actionCard} 
// // // //             onPress={() => navigation.navigate('SetGoal')}
// // // //             activeOpacity={0.7}
// // // //           >
// // // //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// // // //               <MaterialCommunityIcons name="target" size={24} color="#fff" />
// // // //             </View>
// // // //             <Text style={styles.actionLabel}>Set Goal</Text>
// // // //           </TouchableOpacity>

// // // //           <TouchableOpacity 
// // // //             style={styles.actionCard} 
// // // //             onPress={() => navigation.navigate('PairDevice')}
// // // //             activeOpacity={0.7}
// // // //           >
// // // //             <View style={[styles.actionIconContainer, styles.actionIconShadow]}>
// // // //               <MaterialCommunityIcons name="watch" size={24} color="#fff" />
// // // //             </View>
// // // //             <Text style={styles.actionLabel}>Pair Device</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       </LinearGradient>

// // // //       {/* Main Content */}
// // // //       <ScrollView 
// // // //         style={styles.scrollView}
// // // //         contentContainerStyle={styles.scrollContent}
// // // //         showsVerticalScrollIndicator={false}
// // // //       >
// // // //         {/* Meal Input Card (shown when adding a meal) */}
// // // //         {mealInputVisible && (
// // // //           <View style={[styles.card, styles.cardElevated, { backgroundColor: getMealColor() }]}>
// // // //             <View style={styles.cardHeader}>
// // // //               <View style={styles.cardTitleContainer}>
// // // //                 {getMealIcon()}
// // // //                 <Text style={styles.cardTitle}>Add {currentMealType}</Text>
// // // //               </View>
// // // //               <Text style={styles.timeText}>{currentTime}</Text>
// // // //             </View>
            
// // // //             <TextInput
// // // //               placeholder={`What did you have for ${currentMealType.toLowerCase()}?`}
// // // //               style={styles.input}
// // // //               value={mealItems}
// // // //               onChangeText={setMealItems}
// // // //               placeholderTextColor="#999"
// // // //               multiline
// // // //             />
            
// // // //             <View style={styles.mealButtonRow}>
// // // //               <TouchableOpacity 
// // // //                 style={[styles.mealButton, { backgroundColor: '#E0E0E0' }]} 
// // // //                 onPress={() => setMealInputVisible(false)}
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <Text style={[styles.mealButtonText, { color: '#333' }]}>Cancel</Text>
// // // //               </TouchableOpacity>
// // // //               <TouchableOpacity 
// // // //                 style={[styles.mealButton, { backgroundColor: '#1A2980' }]} 
// // // //                 onPress={handleSaveMeal}
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <Text style={[styles.mealButtonText, { color: '#fff' }]}>Save {currentMealType}</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         )}

// // // //         {/* Activity Card */}
// // // //         <View style={[styles.card, styles.cardElevated]}>
// // // //           <View style={styles.cardHeader}>
// // // //             <View style={styles.cardTitleContainer}>
// // // //               <MaterialCommunityIcons name="chart-line" size={20} color="#1A2980" />
// // // //               <Text style={styles.cardTitle}>Today's Activity</Text>
// // // //             </View>
// // // //             <TouchableOpacity onPress={() => navigation.navigate('ActivityTracking')}>
// // // //               <Feather name="chevron-right" size={24} color="#666" />
// // // //             </TouchableOpacity>
// // // //           </View>
          
// // // //           <View style={styles.summaryRow}>
// // // //             <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
// // // //               <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
// // // //               <Text style={styles.summaryValue}>{totalCalories}</Text>
// // // //               <Text style={styles.summaryLabel}>Calories In</Text>
// // // //             </View>
// // // //             <View style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
// // // //               <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
// // // //               <Text style={styles.summaryValue}>{totalCaloriesBurned}</Text>
// // // //               <Text style={styles.summaryLabel}>Calories Out</Text>
// // // //             </View>
// // // //             <View style={[styles.summaryCard, { backgroundColor: '#FFF8E1' }]}>
// // // //               <MaterialCommunityIcons name="target" size={24} color="#FF9800" />
// // // //               <Text style={styles.summaryValue}>
// // // //                 {completedGoals}/{dailyData.goals.length}
// // // //               </Text>
// // // //               <Text style={styles.summaryLabel}>Goals</Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* Water Card */}
// // // //         <View style={[styles.card, styles.cardElevated]}>
// // // //           <View style={styles.cardHeader}>
// // // //             <View style={styles.cardTitleContainer}>
// // // //               <MaterialCommunityIcons name="cup-water" size={20} color="#00B0FF" />
// // // //               <Text style={styles.cardTitle}>Water Intake</Text>
// // // //             </View>
// // // //             <TouchableOpacity onPress={() => navigation.navigate('WaterIntake')}>
// // // //               <Feather name="chevron-right" size={24} color="#666" />
// // // //             </TouchableOpacity>
// // // //           </View>
          
// // // //           <View style={styles.waterCardContent}>
// // // //             <View style={styles.waterInfo}>
// // // //               <View style={styles.intakeRow}>
// // // //                 <Text style={styles.intakeText}>
// // // //                   <Text style={styles.intakeBold}>{todayTotal}</Text> /{target} ml
// // // //                 </Text>
// // // //               </View>
// // // //               <TouchableOpacity 
// // // //                 style={styles.addButton} 
// // // //                 onPress={handleAddWater}
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <Text style={styles.addButtonText}>+ 400 ml</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
            
// // // //             <View style={styles.waterBottleContainer}>
// // // //               <View style={styles.waterBottle}>
// // // //                 <View style={[
// // // //                   styles.waterFill,
// // // //                   { height: `${Math.min((todayTotal / target) * 100, 100)}%` }
// // // //                 ]} />
// // // //               </View>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* Skating Tracking */}
// // // //         <View style={[styles.card, styles.cardElevated]}>
// // // //           <View style={styles.cardHeader}>
// // // //             <View style={styles.cardTitleContainer}>
// // // //               <MaterialCommunityIcons name="skate" size={20} color="#7B1FA2" />
// // // //               <Text style={styles.cardTitle}>Skating Tracking</Text>
// // // //             </View>
// // // //             <TouchableOpacity onPress={handleSkatingPress}>
// // // //               <Feather name="chevron-right" size={24} color="#666" />
// // // //             </TouchableOpacity>
// // // //           </View>
          
// // // //           <View style={styles.subCardRow}>
// // // //             <View style={[styles.subCard, { backgroundColor: '#EDE7F6' }]}>
// // // //               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// // // //               <Text style={styles.subCardValue}>10.2</Text>
// // // //               <Text style={styles.subCardLabel}>Avg Speed</Text>
// // // //             </View>
// // // //             <View style={[styles.subCard, { backgroundColor: '#F3E5F5' }]}>
// // // //               <Feather name="repeat" size={24} color="#FF8C00" />
// // // //               <Text style={styles.subCardValue}>3,800</Text>
// // // //               <Text style={styles.subCardLabel}>Strides</Text>
// // // //             </View>
// // // //             <View style={[styles.subCard, { backgroundColor: '#E8F5E9' }]}>
// // // //               <Feather name="zap" size={24} color="#FF2D55" />
// // // //               <Text style={styles.subCardValue}>89</Text>
// // // //               <Text style={styles.subCardLabel}>Stride Rate</Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* Step Count */}
// // // //         <View style={[styles.card, styles.cardElevated]}>
// // // //           <View style={styles.cardHeader}>
// // // //             <View style={styles.cardTitleContainer}>
// // // //               <Feather name="activity" size={20} color="#00C853" />
// // // //               <Text style={styles.cardTitle}>Step Count</Text>
// // // //             </View>
// // // //             <TouchableOpacity onPress={() => navigation.navigate('StepCount')}>
// // // //               <Feather name="chevron-right" size={24} color="#666" />
// // // //             </TouchableOpacity>
// // // //           </View>
          
// // // //           <View style={styles.subCardRow}>
// // // //             <View style={[styles.subCard, { backgroundColor: '#E8F5E9' }]}>
// // // //               <Feather name="activity" size={24} color="#00C853" />
// // // //               <Text style={styles.subCardValue}>3,205</Text>
// // // //               <Text style={styles.subCardLabel}>Steps</Text>
// // // //             </View>
// // // //             <View style={[styles.subCard, { backgroundColor: '#F3E5F5' }]}>
// // // //               <Feather name="repeat" size={24} color="#5856D6" />
// // // //               <Text style={styles.subCardValue}>1,024</Text>
// // // //               <Text style={styles.subCardLabel}>Strides</Text>
// // // //             </View>
// // // //             <View style={[styles.subCard, { backgroundColor: '#FFEBEE' }]}>
// // // //               <MaterialCommunityIcons name="fire" size={24} color="#F44336" />
// // // //               <Text style={styles.subCardValue}>145</Text>
// // // //               <Text style={styles.subCardLabel}>Calories</Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>
// // // //       </ScrollView>

// // // //       {/* Modal - Add Meal */}
// // // //       <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
// // // //         <View style={styles.modalContainer}>
// // // //           <View style={styles.modalContent}>
// // // //             <Text style={styles.modalTitle}>Add Meals</Text>
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.mealCard, { backgroundColor: '#FFF3E0' }]}
// // // //               onPress={() => handleMealCardPress('Breakfast')}
// // // //             >
// // // //               <MaterialCommunityIcons name="weather-sunny" size={24} color="#FF9800" />
// // // //               <Text style={styles.mealCardText}>Breakfast</Text>
// // // //               <Feather name="chevron-right" size={20} color="#666" />
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.mealCard, { backgroundColor: '#E8F5E9' }]}
// // // //               onPress={() => handleMealCardPress('Lunch')}
// // // //             >
// // // //               <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
// // // //               <Text style={styles.mealCardText}>Lunch</Text>
// // // //               <Feather name="chevron-right" size={20} color="#666" />
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.mealCard, { backgroundColor: '#F3E5F5' }]}
// // // //               onPress={() => handleMealCardPress('Snack')}
// // // //             >
// // // //               <MaterialCommunityIcons name="food-apple" size={24} color="#9C27B0" />
// // // //               <Text style={styles.mealCardText}>Snack</Text>
// // // //               <Feather name="chevron-right" size={20} color="#666" />
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.mealCard, { backgroundColor: '#E3F2FD' }]}
// // // //               onPress={() => handleMealCardPress('Dinner')}
// // // //             >
// // // //               <MaterialCommunityIcons name="weather-night" size={24} color="#2196F3" />
// // // //               <Text style={styles.mealCardText}>Dinner</Text>
// // // //               <Feather name="chevron-right" size={20} color="#666" />
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity 
// // // //               style={styles.cancelButton} 
// // // //               onPress={() => setModalVisible(null)}
// // // //               activeOpacity={0.8}
// // // //             >
// // // //               <Text style={styles.cancelText}>Cancel</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>

// // // //       {/* Skating Type Selection Modal */}
// // // //       <Modal visible={skatingModalVisible} animationType="slide" transparent>
// // // //         <View style={styles.modalContainer}>
// // // //           <View style={styles.modalContent}>
// // // //             <Text style={styles.modalTitle}>Select Skating Type</Text>
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.skatingTypeCard, { backgroundColor: '#EDE7F6' }]}
// // // //               onPress={() => startSkatingSession('speed')}
// // // //             >
// // // //               <MaterialCommunityIcons name="speedometer" size={24} color="#7B1FA2" />
// // // //               <Text style={styles.skatingTypeText}>Speed Skating</Text>
// // // //               <Feather name="chevron-right" size={20} color="#666" />
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.skatingTypeCard, { backgroundColor: '#E3F2FD' }]}
// // // //               onPress={() => startSkatingSession('distance')}
// // // //             >
// // // //               <MaterialCommunityIcons name="map-marker-distance" size={24} color="#2196F3" />
// // // //               <Text style={styles.skatingTypeText}>Distance Skating</Text>
// // // //               <Feather name="chevron-right" size={20} color="#666" />
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.skatingTypeCard, { backgroundColor: '#FFF3E0' }]}
// // // //               onPress={() => startSkatingSession('freestyle')}
// // // //             >
// // // //               <MaterialCommunityIcons name="skate" size={24} color="#FF9800" />
// // // //               <Text style={styles.skatingTypeText}>Freestyle Skating</Text>
// // // //               <Feather name="chevron-right" size={20} color="#666" />
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity 
// // // //               style={styles.cancelButton} 
// // // //               onPress={() => setSkatingModalVisible(false)}
// // // //               activeOpacity={0.8}
// // // //             >
// // // //               <Text style={styles.cancelText}>Cancel</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   safeArea: {
// // // //     flex: 1,
// // // //     paddingBottom: Platform.OS === 'ios' ? 0 : 60,
// // // //     backgroundColor: '#F5F7FB',
// // // //   },
// // // //   headerGradient: {
// // // //     marginTop: Platform.OS === 'ios' ? -60 : -10,
// // // //     paddingHorizontal: '6%',
// // // //     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
// // // //     paddingBottom: height * 0.02,
// // // //     borderBottomLeftRadius: 40,
// // // //     borderBottomRightRadius: 40,
// // // //     shadowColor: '#1A2980',
// // // //     shadowOffset: { width: 0, height: 10 },
// // // //     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
// // // //     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
// // // //     elevation: Platform.OS === 'android' ? 10 : 0,
// // // //   },
// // // //   headerSection: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'flex-start',
// // // //     marginBottom: '8%',
// // // //   },
// // // //   greetingText: {
// // // //     fontSize: width * 0.045,
// // // //     marginRight: '2%',
// // // //     color: 'rgba(255,255,255,0.9)',
// // // //   },
// // // //   headerText: {
// // // //     fontSize: width * 0.055,
// // // //     color: '#fff',
// // // //     marginTop: '1%',
// // // //   },
// // // //   profileIcon: {
// // // //     width: width * 0.1,
// // // //     height: width * 0.1,
// // // //     borderRadius: width * 0.05,
// // // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   topActions: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     marginHorizontal: '-2%',
// // // //   },
// // // //   actionCard: {
// // // //     alignItems: 'center',
// // // //     width: '30%',
// // // //     paddingHorizontal: '2%',
// // // //   },
// // // //   actionIconContainer: {
// // // //     width: width * 0.14,
// // // //     height: width * 0.14,
// // // //     borderRadius: width * 0.07,
// // // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: '4%',
// // // //   },
// // // //   actionIconShadow: {
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 6,
// // // //     elevation: 3,
// // // //   },
// // // //   actionLabel: {
// // // //     color: '#fff',
// // // //     fontSize: width * 0.033,
// // // //     textAlign: 'center',
// // // //   },
// // // //   scrollView: {
// // // //     flex: 1,
// // // //   },
// // // //   scrollContent: {
// // // //     padding: '4%',
// // // //     paddingBottom: '8%',
// // // //   },
// // // //   card: {
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 16,
// // // //     padding: '4%',
// // // //     marginBottom: '4%',
// // // //   },
// // // //   cardElevated: {
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.08,
// // // //     shadowRadius: 8,
// // // //     elevation: 4,
// // // //   },
// // // //   cardHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: '4%',
// // // //   },
// // // //   cardTitleContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   cardTitle: {
// // // //     fontSize: width * 0.045,
// // // //     color: '#333',
// // // //     marginLeft: '2%',
// // // //   },
// // // //   timeText: {
// // // //     fontSize: width * 0.035,
// // // //     color: '#666',
// // // //   },
// // // //   input: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#E0E0E0',
// // // //     borderRadius: 12,
// // // //     padding: '4%',
// // // //     minHeight: width * 0.3,
// // // //     fontSize: width * 0.04,
// // // //     color: '#333',
// // // //     backgroundColor: '#fff',
// // // //     marginBottom: '4%',
// // // //     textAlignVertical: 'top',
// // // //   },
// // // //   mealButtonRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   mealButton: {
// // // //     borderRadius: 12,
// // // //     padding: '4%',
// // // //     width: '48%',
// // // //     alignItems: 'center',
// // // //   },
// // // //   mealButtonText: {
// // // //     fontSize: width * 0.04,
// // // //     fontWeight: '600',
// // // //   },
// // // //   summaryRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   summaryCard: {
// // // //     borderRadius: 12,
// // // //     padding: '4%',
// // // //     width: '30%',
// // // //     alignItems: 'center',
// // // //   },
// // // //   summaryValue: {
// // // //     fontSize: width * 0.05,
// // // //     marginVertical: '4%',
// // // //     color: '#333',
// // // //   },
// // // //   summaryLabel: {
// // // //     fontSize: width * 0.03,
// // // //     color: '#666',
// // // //   },
// // // //   waterCardContent: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'flex-end',
// // // //   },
// // // //   waterInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   intakeRow: {
// // // //     marginBottom: '4%',
// // // //   },
// // // //   intakeText: {
// // // //     color: '#333',
// // // //     fontSize: width * 0.04,
// // // //   },
// // // //   intakeBold: {
// // // //     fontSize: width * 0.05,
// // // //     color: '#333',
// // // //   },
// // // //   addButton: {
// // // //     backgroundColor: '#1A2980',
// // // //     borderRadius: 24,
// // // //     paddingVertical: '2.5%',
// // // //     paddingHorizontal: '5%',
// // // //     alignSelf: 'flex-start',
// // // //     shadowColor: '#1A2980',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 8,
// // // //     elevation: 4,
// // // //   },
// // // //   addButtonText: {
// // // //     color: '#fff',
// // // //     fontSize: width * 0.035,
// // // //   },
// // // //   waterBottleContainer: {
// // // //     marginLeft: '4%',
// // // //     alignItems: 'center',
// // // //   },
// // // //   waterBottle: {
// // // //     width: width * 0.15,
// // // //     height: width * 0.25,
// // // //     borderWidth: 2,
// // // //     borderColor: '#E0E0E0',
// // // //     borderBottomLeftRadius: 12,
// // // //     borderBottomRightRadius: 12,
// // // //     overflow: 'hidden',
// // // //     backgroundColor: '#F5F7FB',
// // // //     justifyContent: 'flex-end',
// // // //   },
// // // //   waterFill: {
// // // //     backgroundColor: '#00B0FF',
// // // //     width: '100%',
// // // //   },
// // // //   subCardRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   subCard: {
// // // //     borderRadius: 12,
// // // //     padding: '4%',
// // // //     width: '30%',
// // // //     alignItems: 'center',
// // // //   },
// // // //   subCardValue: {
// // // //     fontSize: width * 0.05,
// // // //     marginVertical: '4%',
// // // //     color: '#333',
// // // //   },
// // // //   subCardLabel: {
// // // //     fontSize: width * 0.03,
// // // //     color: '#666',
// // // //   },
// // // //   modalContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //   },
// // // //   modalContent: {
// // // //     width: '85%',
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 16,
// // // //     padding: '6%',
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: width * 0.05,
// // // //     marginBottom: '5%',
// // // //     color: '#333',
// // // //     textAlign: 'center',
// // // //   },
// // // //   mealCard: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     padding: '4%',
// // // //     borderRadius: 12,
// // // //     marginBottom: '4%',
// // // //   },
// // // //   mealCardText: {
// // // //     fontSize: width * 0.04,
// // // //     color: '#333',
// // // //     marginLeft: '3%',
// // // //     flex: 1,
// // // //   },
// // // //   skatingTypeCard: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     padding: '4%',
// // // //     borderRadius: 12,
// // // //     marginBottom: '4%',
// // // //   },
// // // //   skatingTypeText: {
// // // //     fontSize: width * 0.04,
// // // //     color: '#333',
// // // //     marginLeft: '3%',
// // // //     flex: 1,
// // // //   },
// // // //   cancelButton: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#E0E0E0',
// // // //     padding: '3.5%',
// // // //     borderRadius: 12,
// // // //     marginTop: '2%',
// // // //   },
// // // //   cancelText: {
// // // //     color: '#666',
// // // //     textAlign: 'center',
// // // //   },
// // // // });

// // // // export default HomeScreen;