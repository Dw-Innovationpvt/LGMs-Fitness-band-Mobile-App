import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import useWaterStore from '../store/waterStore';
import { useCaloriesStore } from '../store/caloriesStore';
import useTargetStore from '../store/targetStore';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays, subDays, isSameDay, isWithinInterval, addHours } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DailyActivitiesScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('meals');
  const [animation] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [editGoalModal, setEditGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalTargetInput, setGoalTargetInput] = useState('');

  // Zustand store hooks
  const {
    mealData,
    getMeals,
    addMeal,
    totalCaloriesIn,
    workoutData,
    getWorkout,
  } = useAuthStore();
  
  const {
    intakes,
    todayTotal,
    target,
    fetchIntakes,
    fetchTodayTotal,
    fetchTarget,
    addIntake,
    getProgress,
    refreshAll
  } = useWaterStore();

  const {
    totalCaloriesEaten,
    totalCaloriesBurned,
    mealTarget,
    mealTargetMet,
    mealFlag,
    fetchCaloriesEaten,
    fetchCaloriesBurned,
    fetchMealTargetStatus,
    fetchBurnTarget,
    burnTarget, 
    setBurnTarget,
    stepGoal, 
    fetchStepGoal, 
    setStepGoal,
    setMealTarget
  } = useCaloriesStore();

  // Use the new target store for goals
  const { 
    goals, 
    weeklyGoals, 
    mealFlag: targetMealFlag, 
    burnFlag, 
    fetchGoals,
    setGoalTarget,
    updateGoalProgress,
    resetGoalProgress,
    isLoading: isTargetLoading,
    error: targetError
  } = useTargetStore();

  // Calculate total calories from meals
  const calculateTotalCalories = (meals) => {
    return meals.reduce((total, meal) => {
      return total + meal.calories;
    }, 0);
  };
  const totalCalEat = calculateTotalCalories(mealData);

  // Calculate total water intake
  const totalWaterIntake = todayTotal || 0;

  // Get steps data (you'll need to implement this in your steps store)
  // For now, I'll assume you have a steps store or can get steps data
  const [stepsData, setStepsData] = useState(0); // Replace with actual steps data
  const todayVarCheck = new Date();
  console.log(todayVarCheck);
  // Create goals array for the selected date with real-time data mapping
  const selectedGoals = goals && isSameDay(new Date(goals.date), selectedDate) ? [
// const selectedGoals = isSameDay(new Date(goals.date), selectedDate) ? [
  {
    id: '1',
    type: 'water',
    title: `Drink ${(totalWaterIntake || 0) / 1000}L out of ${
      isSameDay(todayVarCheck, selectedDate)
        ? (target || 2000) / 1000
        : (goals.water?.target || 2000) / 1000
    }L`,
    progress: totalWaterIntake || 0,
    target: isSameDay(todayVarCheck, selectedDate) ? (target || 2000) : (goals.water?.target || 2000),
    completed: (totalWaterIntake || 0) >= (isSameDay(todayVarCheck, selectedDate) ? (target || 2000) : (goals.water?.target || 2000)),
    date: selectedDate,
  },
  { 
    id: '2', 
    type: 'steps',
    title: `${stepsData || 0} steps out of ${
      isSameDay(todayVarCheck, selectedDate)
        ? (stepGoal || 7000)
        : (goals.steps?.target || 7000)
    }`, 
    progress: stepsData || 0,
    target: isSameDay(todayVarCheck, selectedDate) ? (stepGoal || 7000) : (goals.steps?.target || 7000),
    completed: (stepsData || 0) >= (isSameDay(todayVarCheck, selectedDate) ? (stepGoal || 7000) : (goals.steps?.target || 7000)),
    date: selectedDate,
  },
  { 
    id: '3', 
    type: 'caloriesEarned',
    title: `${totalCaloriesEaten || 0} cal out of ${
      isSameDay(todayVarCheck, selectedDate)
        ? (mealTarget || 2000)
        : (goals.caloriesEarned?.target || 2000)
    }`, 
    progress: totalCaloriesEaten || 0,
    target: isSameDay(todayVarCheck, selectedDate) ? (mealTarget || 2000) : (goals.caloriesEarned?.target || 2000),
    completed: (totalCaloriesEaten || 0) >= (isSameDay(todayVarCheck, selectedDate) ? (mealTarget || 2000) : (goals.caloriesEarned?.target || 2000)),
    date: selectedDate,
  },
  { 
    id: '4', 
    type: 'caloriesBurned',
    title: `${totalCaloriesBurned || 0} cal out of ${
      isSameDay(todayVarCheck, selectedDate)
        ? (burnTarget || 500)
        : (goals.caloriesBurned?.target || 500)
    }`, 
    progress: totalCaloriesBurned || 0,
    target: isSameDay(todayVarCheck, selectedDate) ? (burnTarget || 500) : (goals.caloriesBurned?.target || 500),
    completed: (totalCaloriesBurned || 0) >= (isSameDay(todayVarCheck, selectedDate) ? (burnTarget || 500) : (goals.caloriesBurned?.target || 500)),
    date: selectedDate,
  },
] : [];    // {
  //     id: '1',
  //     type: 'water',
  //     // title: `Drink ${(totalWaterIntake || 0) / 1000}L out of ${(goals.water?.target || 2000) / 1000}L`,
  //     // title: `Drink ${(totalWaterIntake || 0) / 1000}L out of ${(target || 2000) / 1000}L`,
  //     title: `Drink ${todayVarCheck.getDate()===selectedDate.getDate() ? (totalWaterIntake || 0) / 1000 : 0}L out of ${(target || 2000) / 1000}L`,
  //     progress: totalWaterIntake || 0,
  //     target: target || 2000,
  //     completed: (totalWaterIntake || 0) >= (target || 2000),
  //     date: format(selectedDate, 'yyyy-MM-dd'),
  //   },
  //   { 
  //     id: '2', 
  //     type: 'steps',
  //     // title: `${stepsData || 0} steps out of ${goals.steps?.target || 7000}`, 
  //     title: `${stepsData || 0} steps out of ${goals.steps?.target || 7000}`, 
  //     progress: stepsData || 0,
  //     target: goals.steps?.target || 7000,
  //     completed: (stepsData || 0) >= (goals.steps?.target || 7000),
  //     date: format(selectedDate, 'yyyy-MM-dd'),
  //   },
  //   {
  //   id: '1',
  //   type: 'water',
  //   title: `Drink ${(totalWaterIntake || 0) / 1000}L out of ${
  //     isSameDay(todayVarCheck, selectedDate)
  //       ? (target || 2000) / 1000
  //       : (goals.water?.target || 2000) / 1000
  //   }L`,
  //   progress: totalWaterIntake || 0,
  //   target: isSameDay(todayVarCheck, selectedDate) ? (target || 2000) : (goals.water?.target || 2000),
  //   completed: (totalWaterIntake || 0) >= (target || 2000),
  //   date: selectedDate, // Assuming format() is applied later for display
  // },
  // { 
  //   id: '2', 
  //   type: 'steps',
  //   title: `${stepsData || 0} steps out of ${
  //     isSameDay(todayVarCheck, selectedDate)
  //       ? (stepGoal || 7000)
  //       : (goals.steps?.target || 7000)
  //   }`, 
  //   progress: stepsData || 0,
  //   target: isSameDay(todayVarCheck, selectedDate) ? (stepGoal || 7000) : (goals.steps?.target || 7000),
  //   completed: (stepsData || 0) >= (stepGoal || 7000),
  //   date: selectedDate, // Assuming format() is applied later for display
  // },
  //   { 
  //     id: '3', 
  //     type: 'caloriesEarned',
  //     title: `${totalCaloriesEaten || 0} cal out of ${goals.caloriesEarned?.target || 2000}`, 
  //     progress: totalCaloriesEaten || 0,
  //     target: goals.caloriesEarned?.target || 2000,
  //     completed: (totalCalEat || 0) >= (goals.caloriesEarned?.target || 2000),
  //     date: format(selectedDate, 'yyyy-MM-dd'),
  //   },
  //   { 
  //     id: '4', 
  //     type: 'caloriesBurned',
  //     title: `${totalCaloriesBurned || 0} cal out of ${goals.caloriesBurned?.target || 500}`, 
  //     progress: totalCaloriesBurned || 0,
  //     target: goals.caloriesBurned?.target || 500,
  //     completed: (totalCaloriesBurned || 0) >= (goals.caloriesBurned?.target || 500),
  //     date: format(selectedDate, 'yyyy-MM-dd'),
  //   },
  // ] : [];

  // Fetch data when screen is focused or selectedDate changes
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setRefreshing(true);
          const dateString = format(selectedDate, 'yyyy-MM-dd');
          await Promise.all([
            getMeals(dateString),
            fetchIntakes(dateString),
            fetchTodayTotal(dateString),
            getWorkout(dateString),
            fetchGoals(dateString), // <-- Use this for all dates
          ]);
          // Sync progress after fetching all data
          // if (todayTarget) {
          //   // await syncProgressWithSources();
          // }
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setRefreshing(false);
        }
      };
      fetchData();
    }, [selectedDate, getMeals, fetchIntakes, fetchTodayTotal, getWorkout])
  );

  // Generate 7 days: 6 days before today + today
  const generateWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      dates.push(subDays(today, i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);
  const clickableRange = { start: sevenDaysAgo, end: today };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    try {
      await Promise.all([
        getMeals(dateString),
        fetchIntakes(dateString),
        fetchTodayTotal(dateString),
        getWorkout(dateString),
        fetchGoals(dateString), // <-- Use this for all dates
      ]);
      // Sync progress after refreshing
      // if (todayTarget) {
      //   // await syncProgressWithSources();
      // }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      if (timeString.match(/^\d{1,2}:\d{2} [AP]M$/i)) {
        return timeString;
      }
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  // Handle goal edit
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalTargetInput(goal.target.toString());
    setEditGoalModal(true);
  };

  // Save goal target
  const handleSaveGoalTarget = async () => {
    if (!editingGoal || !goalTargetInput) return;
    
    try {
      const targetValue = parseInt(goalTargetInput);
      if (isNaN(targetValue) || targetValue <= 0) {
        Alert.alert('Error', 'Please enter a valid positive number');
        return;
      }

      await setGoalTarget(editingGoal.type, targetValue, selectedDate);
      setEditGoalModal(false);
      setEditingGoal(null);
      setGoalTargetInput('');
      
      // Refresh goals
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      await fetchGoals(dateString);
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal target');
    }
  };

  // Handle goal progress update
  const handleUpdateProgress = async (goalType, progress) => {
    try {
      await updateGoalProgress(goalType, progress, selectedDate);
      
      // Refresh goals
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      await fetchGoals(dateString);
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  // Handle reset progress
  const handleResetProgress = async (goalType) => {
    try {
      await resetGoalProgress(goalType, selectedDate);
      
      // Refresh goals
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      await fetchGoals(dateString);
    } catch (error) {
      Alert.alert('Error', 'Failed to reset progress');
    }
  };

  // Animate
  const animate = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start(() => animation.setValue(0));
  };

  const completedGoals = selectedGoals.filter(goal => goal.completed).length;

  // console.log('selcted goals', selectedGoals);

  // Render meal item
  const renderMealItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemType}>{item.mealType}</Text>
        <Text style={styles.itemTime}>{formatTime(item.time)}</Text>
      </View>
      <Text style={styles.itemFoodName}>{item.foodName || 'Meal'}</Text>
      {item.calories > 0 && (
        <View style={styles.itemFooter}>
          <Text style={styles.itemCalories}>{item.calories} cal</Text>
        </View>
      )}
      {item.notes && (
        <Text style={styles.itemNotes}>Notes: {item.notes}</Text>
      )}
    </View>
  );

  // Map intakes to display format
  const intakeHistory = intakes.map(intake => {
    const dateObj = new Date(intake.date);
    const istDate = addHours(dateObj, 5.5);
    const isMidnight = dateObj.getUTCHours() === 0 && dateObj.getUTCMinutes() === 0 && dateObj.getUTCSeconds() === 0;
    return {
      _id: intake._id,
      amount: intake.amount,
      timestamp: isMidnight ? 'Manual Entry' : format(istDate, 'hh:mm a')
    };
  });

  // Render water intake
  const renderWaterItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <MaterialCommunityIcons name="cup-water" size={20} color="#00BFFF" />
        <Text style={styles.itemAmount}>{item.amount}ml</Text>
        <Text style={styles.itemTime}>{formatTime(item.date)}</Text>
      </View>
    </View>
  );

  // Render goal
  const renderGoalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      // onPress={() => handleEditGoal(item)}
      // onLongPress={() => {
      //   Alert.alert(
      //     'Reset Progress',
      //     `Are you sure you want to reset ${item.type} progress?`,
      //     [
      //       { text: 'Cancel', style: 'cancel' },
      //       { text: 'Reset', onPress: () => handleResetProgress(item.type) }
      //     ]
      //   );
      // }}
    >
      <View style={styles.goalContent}>
        <MaterialCommunityIcons 
          name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
          size={24} 
          color={item.completed ? "#4CAF50" : "#ccc"} 
        />
        <View style={styles.goalTextContainer}>
          <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
            {item.title}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(100, (item.progress / item.target) * 100)}%`,
                  backgroundColor: item.completed ? '#4CAF50' : '#4B6CB7'
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Daily Activities</Text>
          <Text style={styles.headerDate}>{format(selectedDate, 'MMMM yyyy')}</Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <View style={{height:24, width: 24}}/>
        </TouchableOpacity>
      </LinearGradient>

      {/* Week Calendar */}
      <View style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScroll}
        >
          {weekDates.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            const isClickable = isWithinInterval(date, clickableRange);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateContainer,
                  isSelected && styles.selectedDateContainer,
                  isToday && !isSelected && styles.todayDateContainer,
                  !isClickable && styles.disabledDateContainer
                ]}
                onPress={() => isClickable && setSelectedDate(date)}
                disabled={!isClickable}
              >
                <Text style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isToday && !isSelected && styles.todayDayText,
                  !isClickable && styles.disabledDayText
                ]}>
                  {format(date, 'EEE')}
                </Text>
                <Text style={[
                  styles.dateText,
                  isSelected && styles.selectedDateText,
                  isToday && !isSelected && styles.todayDateText,
                  !isClickable && styles.disabledDateText
                ]}>
                  {format(date, 'd')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'meals' && styles.activeStatCard]}
          onPress={() => setActiveTab('meals')}
        >
          <MaterialCommunityIcons name="food" size={20} color={activeTab === 'meals' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'meals' && styles.activeStatValue]}>{totalCalEat || 0}</Text>
          <Text style={[styles.statLabel, activeTab === 'meals' && styles.activeStatLabel]}>Calories</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'water' && styles.activeStatCard]}
          onPress={() => setActiveTab('water')}
        >
          <MaterialCommunityIcons name="cup-water" size={20} color={activeTab === 'water' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'water' && styles.activeStatValue]}>{totalWaterIntake || 0}ml</Text>
          <Text style={[styles.statLabel, activeTab === 'water' && styles.activeStatLabel]}>Water</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'goals' && styles.activeStatCard]}
          onPress={() => setActiveTab('goals')}
        >
          <MaterialCommunityIcons name="target" size={20} color={activeTab === 'goals' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'goals' && styles.activeStatValue]}>{completedGoals}/{selectedGoals.length}</Text>
          <Text style={[styles.statLabel, activeTab === 'goals' && styles.activeStatLabel]}>Goals</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {activeTab === 'meals' && (
          <FlatList
            data={mealData}
            renderItem={renderMealItem}
            keyExtractor={item => item._id || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No meals recorded for {format(selectedDate, 'MMMM d')}</Text>
            }
          />
        )}

        {activeTab === 'water' && (
          <>
            <FlatList
              data={intakeHistory}
              renderItem={renderWaterItem}
              keyExtractor={item => item._id || Math.random().toString()}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No water intake recorded for {format(selectedDate, 'MMMM d')}</Text>
              }
            />
          </>
        )}

        {activeTab === 'goals' && (
          <FlatList
            data={selectedGoals}
            renderItem={renderGoalItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={() => {
              if (isTargetLoading) {
                return <Text style={styles.emptyText}>Loading goals...</Text>;
              }
              if (targetError) {
                return <Text style={styles.emptyText}>Error loading goals: {targetError}</Text>;
              }
              return <Text style={styles.emptyText}>No goals available for {format(selectedDate, 'MMMM d')}</Text>;
            }}
          />
        )}
      </View>

      {/* Edit Goal Modal */}
      <Modal
        visible={editGoalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditGoalModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editingGoal?.type} Goal</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter target value"
              value={goalTargetInput}
              onChangeText={setGoalTargetInput}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditGoalModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveGoalTarget}
              >
                <Text style={styles.buttonText}>Save</Text>
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
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.04,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: '600',
    color: '#fff',
  },
  headerDate: {
    fontSize: width * 0.035,
    color: 'rgba(255,255,255,0.8)',
    marginTop: height * 0.005,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  calendarScroll: {
    paddingHorizontal: 10,
  },
  dateContainer: {
    width: width * 0.14,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  selectedDateContainer: {
    backgroundColor: '#4B6CB7',
  },
  todayDateContainer: {
    backgroundColor: 'rgba(75, 108, 183, 0.1)',
  },
  disabledDateContainer: {
    backgroundColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#fff',
  },
  todayDayText: {
    color: '#4B6CB7',
  },
  disabledDayText: {
    color: '#aaa',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  todayDateText: {
    color: '#4B6CB7',
  },
  disabledDateText: {
    color: '#aaa',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    backgroundColor: '#fff',
    marginTop: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
  },
  statCard: {
    alignItems: 'center',
    padding: width * 0.02,
    borderRadius: 12,
    width: width * 0.22,
  },
  activeStatCard: {
    backgroundColor: '#4B6CB7',
  },
  statValue: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: height * 0.005,
  },
  activeStatValue: {
    color: '#fff',
  },
  statLabel: {
    fontSize: width * 0.03,
    color: '#666',
  },
  activeStatLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  progressAmount: {
    fontSize: 16,
    color: '#4B6CB7',
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4B6CB7',
    borderRadius: 5,
  },
  progressPercentage: {
    textAlign: 'right',
    color: '#666',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  listContent: {
    // paddingBottom: height * 0.1,
    paddingBottom: 150,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  itemType: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  itemFoodName: {
    fontSize: width * 0.038,
    fontWeight: '400',
    color: '#444',
    marginBottom: height * 0.005,
  },
  itemTime: {
    fontSize: width * 0.035,
    color: '#666',
  },
  itemAmount: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#00BFFF',
    marginLeft: width * 0.02,
    marginRight: 'auto',
  },
  itemDetails: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.01,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemCalories: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#4CAF50',
  },
  itemNotes: {
    fontSize: width * 0.03,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic'
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalText: {
    fontSize: width * 0.04,
    color: '#333',
    marginLeft: width * 0.03,
    flex: 1,
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
  workoutStat: {
    fontSize: width * 0.035,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: height * 0.1,
    fontSize: width * 0.04,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: width * 0.05,
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  input: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: width * 0.035,
    marginHorizontal: width * 0.04,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: width * 0.04,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  saveButton: {
    flex: 1,
    padding: width * 0.04,
    alignItems: 'center',
    backgroundColor: '#4B6CB7',
    borderBottomRightRadius: 16,
  },
  cancelButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#666',
  },
  saveButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#fff',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  mealTypeButton: {
    width: '48%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
  },
  selectedMealType: {
    backgroundColor: '#4B6CB7',
  },
  mealTypeText: {
    fontSize: width * 0.035,
    color: '#333',
  },
  selectedMealTypeText: {
    fontSize: width * 0.035,
    color: '#fff',
  },

  
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: '#4CAF50',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#4B6CB7',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },


});

export default DailyActivitiesScreen;