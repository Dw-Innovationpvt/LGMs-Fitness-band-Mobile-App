import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import useWaterStore from '../store/waterStore';
import { useCaloriesStore } from '../store/caloriesStore';

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
  Platform
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays, subDays, isSameDay, isWithinInterval, addHours } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DailyActivitiesScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  const [waterAmount, setWaterAmount] = useState('');
  const [mealsInput, setMealsInput] = useState({
    mealType: 'Breakfast',
    foodName: '',
    description: '',
    calories: '',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: ''
  });
  const [activeTab, setActiveTab] = useState('meals');
  const [animation] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);

  // Zustand store hooks
  const {
    mealData,
    getMeals,
    addMeal,
    totalCaloriesIn,
    workoutData,
    getWorkout,
    // totalCaloriesBurned
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
      setMealTarget // Add this function to your caloriesStore
    } = useCaloriesStore();

  // console.log('Meal Data:', mealData);
  // Goals data
//   const [goals, setGoals] = useState([
//     {
//       id: '1',
//       title: `Drink ${(todayTotal || 0) / 1000}L water out of ${(target || 2000) / 1000}L`,
//       completed: (todayTotal || 0) >= (target || 2000),
//     },
//     { id: '2', title: `${stepGoal} steps`, completed: false },
//     { id: '3', title: `${mealTarget}K calories Earn`, completed: (totalCaloriesEaten || 0) >= (mealTarget || 2000) },
//     { id: '4', title: `${totalCaloriesBurned || 0}kcal out of ${burnTarget || 500}kcal`, completed: (totalCaloriesBurned || 0) >= (burnTarget || 500) },
//   ]);

//   useEffect(() => {
//   setGoals(prevGoals => [
//     {
//       id: '1',
//       title: `Drink ${((todayTotal || 0) / 1000).toFixed(1)}L water out of ${((target || 2000) / 1000).toFixed(1)}L`,
//       completed: (todayTotal || 0) >= (target || 2000),
//     },
//     { id: '2', title: `${stepGoal || 10000} steps`, completed: false },
//     { id: '3', title: `${mealTarget || 2000}Kcal to Earn`, completed: (totalCaloriesEaten || 0) >= (mealTarget || 2000) },
//     { id: '4', title: `${totalCaloriesBurned || 0} cal out of ${burnTarget || 500}`, completed: (totalCaloriesBurned || 0) >= (burnTarget || 500) },
//   ]);
// }, [todayTotal, target, stepGoal, mealTarget, burnTarget, totalCaloriesEaten, totalCaloriesBurned]); // Add all target dependencies


const [goals, setGoals] = useState([
  {
    id: '1',
    title: `Drink ${(todayTotal || 0) / 1000}L out of ${(target || 2000) / 1000}L`,
    completed: (todayTotal || 0) >= (target || 2000),
  },
  { 
    id: '2', 
    title: `0 steps out of ${stepGoal || 10000}`, 
    completed: false 
  },
  { 
    id: '3', 
    title: `${totalCaloriesEaten || 0} cal out of ${mealTarget || 2000}`, 
    completed: (totalCaloriesEaten || 0) >= (mealTarget || 2000) 
  },
  { 
    id: '4', 
    title: `${totalCaloriesBurned || 0} cal out of ${burnTarget || 500}`, 
    completed: (totalCaloriesBurned || 0) >= (burnTarget || 500) 
  },
]);

useEffect(() => {
  setGoals([
    {
      id: '1',
      title: `Drink ${((todayTotal || 0) / 1000).toFixed(1)}L out of ${((target || 2000) / 1000).toFixed(1)}L`,
      completed: (todayTotal || 0) >= (target || 2000),
    },
    { 
      id: '2', 
      title: `0 steps out of ${stepGoal || 10000}`, 
      completed: false // You'll need to implement step tracking
    },
    { 
      id: '3', 
      title: `${totalCaloriesEaten || 0} cal out of ${mealTarget || 2000}`, 
      completed: (totalCaloriesEaten || 0) >= (mealTarget || 2000) 
    },
    { 
      id: '4', 
      title: `${totalCaloriesBurned || 0} cal out of ${burnTarget || 500}`, 
      completed: (totalCaloriesBurned || 0) >= (burnTarget || 500) 
    },
  ]);
}, [todayTotal, target, stepGoal, mealTarget, burnTarget, totalCaloriesEaten, totalCaloriesBurned]);

  const calculateTotalCalories = (meals) => {
  // The reduce method iterates over the array and accumulates a single value.
  // 'total' is the accumulator, initialized to 0.
  // 'meal' is the current item in the array.
  return meals.reduce((total, meal) => {
    // Add the calories from the current meal to the running total.
    return total + meal.calories;
  }, 0); // The 0 is the initial value for the 'total' accumulator.
};
const totalCalEat = calculateTotalCalories(mealData);

  // Update goals when todayTotal or target changes
  useEffect(() => {
    const waterTarget = target || 2000;
    const sumOfIntakes = todayTotal || 0;
    setGoals([
      {
        id: '1',
        title: `Drink ${(sumOfIntakes / 1000).toFixed(1)}L water out of ${(waterTarget / 1000).toFixed(1)}L`,
        completed: sumOfIntakes >= waterTarget,
      },
      ...goals.slice(1),
    ]);
  }, [todayTotal, target]);

  // Fetch data on mount and when screen comes into focus
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
            fetchTarget(),
            getWorkout(dateString),
          ]);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setRefreshing(false);
        }
      };
      fetchData();
    }, [selectedDate])
  );

//   useEffect(() => async () => {
//     // await 
//     await fetchTarget();
//         await fetchBurnTarget();
//         await fetchStepGoal();
//         await fetchMealTargetStatus();
// }, [mealData, workoutData, intakes, todayTotal, target, mealTarget, burnTarget, stepGoal]);

    useEffect(() => {
  const fetchTargets = async () => {
    await fetchTarget();
    await fetchBurnTarget();
    await fetchStepGoal();
    await fetchMealTargetStatus();
  };
  fetchTargets();
}, []); // 

  // Generate 10 days: 6 days before today, today, and 3 days after
  const generateWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 1; i--) {
      dates.push(subDays(today, i));
    }
    dates.push(today);
    for (let i = 1; i <= 3; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);
  const clickableRange = { start: sevenDaysAgo, end: today };

  // Load data when selectedDate changes
  const loadData = async () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    try {
      setRefreshing(true);
      await Promise.all([
        getMeals(dateString),
        fetchIntakes(dateString),
        fetchTodayTotal(dateString),
        fetchTarget(),
        getWorkout(dateString),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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

  // Animate
  const animate = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start(() => animation.setValue(0));
  };

  // Save meal
  const handleSaveMeal = async () => {
    if (!mealsInput.foodName) {
      alert('Please enter food name');
      return;
    }

    try {
      const mealToAdd = {
        mealType: mealsInput.mealType,
        foodName: mealsInput.foodName,
        description: mealsInput.description,
        calories: mealsInput.calories ? parseInt(mealsInput.calories) : 0,
        time: mealsInput.time,
        notes: mealsInput.notes,
        date: format(selectedDate, 'yyyy-MM-dd')
      };

      const result = await addMeal(mealToAdd);
      if (result.success) {
        setMealsInput({
          mealType: 'Breakfast',
          foodName: '',
          description: '',
          calories: '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          notes: ''
        });
        setModalVisible(false);
        animate();
        await loadData();
      } else {
        alert(result.error || 'Failed to save meal');
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal');
    }
  };

  // Add water intake
  const handleAddWater = async () => {
    if (!waterAmount || isNaN(waterAmount)) {
      alert('Please enter a valid amount');
      return;
    }
    
    const amount = parseInt(waterAmount);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const result = await addIntake(amount, dateString);
    
    if (result.success) {
      setWaterAmount('');
      setWaterModalVisible(false);
      animate();
      await loadData();
    } else {
      alert(result.error || 'Failed to add water intake');
    }
  };

  // Toggle goal completion
  const toggleGoalCompletion = (id) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
    animate();
  };

  // Progress
  const progress = getProgress();
  const completedGoals = goals.filter(goal => goal.completed).length;

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

  // import { format, addHours } from 'date-fns'; // Import addHours for explicit IST conversion

// Map intakes to display format
const intakeHistory = intakes.map(intake => {
  const dateObj = new Date(intake.date); // UTC timestamp from backend
  const istDate = addHours(dateObj, 5.5); // Convert UTC to IST (+5:30)
  const isMidnight = dateObj.getUTCHours() === 0 && dateObj.getUTCMinutes() === 0 && dateObj.getUTCSeconds() === 0;
  return {
    _id: intake._id,
    amount: intake.amount,
    timestamp: isMidnight ? 'Manual Entry' : format(istDate, 'hh:mm a')
  };
});
  // Sort and format water intake history for display, newest first
// const intakeHistory = intakes
//   .sort((a, b) => new Date(b.date) - new Date(a.date))
//   .map(intake => ({
//     amount: intake.amount,
//     timestamp: new Date(intake.date)
//   }));
// Sort and format water intake history for display, newest first
// const intakeHistory = intakes
//   .sort((a, b) => new Date(b.date) - new Date(a.date))
//   .map(intake => ({
//     _id: intake._id, // Preserve _id for keyExtractor
//     amount: intake.amount,
//     timestamp: format(new Date(intake.date), 'hh:mm a') // Format time as hh:mm AM/PM
//   }));

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
      // onPress={() => toggleGoalCompletion(item.id)}
      onPress={() => {}}
    >
      <View style={styles.goalContent}>
        <MaterialCommunityIcons 
          name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
          size={24} 
          color={item.completed ? "#4CAF50" : "#ccc"} 
        />
        <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
          {item.title}
        </Text>
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
        {/* () => {
          if (activeTab === 'meals') setModalVisible(true);
          if (activeTab === 'water') setWaterModalVisible(true);
        }}> */}
          {/* <Feather name="plus" size={24} color="#fff" /> */}
          {/* <View><Text>mjkh<
          /Text></View> */}
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
          {/* <Text style={[styles.statValue, activeTab === 'meals' && styles.activeStatValue]}>{totalCaloriesIn || 0}</Text> */}
          <Text style={[styles.statValue, activeTab === 'meals' && styles.activeStatValue]}>{totalCalEat || 0}</Text>
          <Text style={[styles.statLabel, activeTab === 'meals' && styles.activeStatLabel]}>Calories</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'water' && styles.activeStatCard]}
          onPress={() => setActiveTab('water')}
        >
          <MaterialCommunityIcons name="cup-water" size={20} color={activeTab === 'water' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'water' && styles.activeStatValue]}>{todayTotal || 0}ml</Text>
          <Text style={[styles.statLabel, activeTab === 'water' && styles.activeStatLabel]}>Water</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'goals' && styles.activeStatCard]}
          onPress={() => setActiveTab('goals')}
        >
          <MaterialCommunityIcons name="target" size={20} color={activeTab === 'goals' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'goals' && styles.activeStatValue]}>{completedGoals}/{goals.length}</Text>
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
          // <ScrollView>
          <>
            {/* <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>Today's Progress</Text>
                <Text style={styles.progressAmount}>{todayTotal || 0}ml / {target || 0}ml</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { width: `${progress}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
            </View> */}
            {/* {console.log('Intake History:', intakes)} */}
            <FlatList
              // data={intakes}
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
            {/* <View style={{ height: '200' }}></View> */}
          {/* </ ScrollView>
           */}
           {/* <View style={{ height: '500' }}></View> */}

           </>
        )}

        {activeTab === 'goals' && (
          <FlatList
            data={goals}
            renderItem={renderGoalItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No goals set for today</Text>
            }
          />
        )}

        {activeTab === 'workouts' && (
          <FlatList
            data={workoutData}
            renderItem={renderWorkoutItem}
            keyExtractor={item => item._id || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No workouts recorded for {format(selectedDate, 'MMMM d')}</Text>
            }
          />
        )}
      </View>

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
});

export default DailyActivitiesScreen;