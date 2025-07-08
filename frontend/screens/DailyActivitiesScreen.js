import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

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
  RefreshControl
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// import { useMealStore } from '../store/mealStore'; // Make sure this path is correct

const { width } = Dimensions.get('window');

const DailyActivitiesScreen = ({ navigation }) => {
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mealsInput, setMealsInput] = useState({ breakfast: '', lunch: '', snacks: '', dinner: '' });
  const [activeTab, setActiveTab] = useState('meals');
  const [animation] = useState(new Animated.Value(0));
  
  // Zustand store hooks
  const { mealData, getMeals, addMeal } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // Initial data fetch on mount
  useEffect(() => {
    getMeals();
  }, [getMeals]);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getMeals();
    setRefreshing(false);
    if (!result.success) {
      console.log('Refresh failed:', result.error);
    }
  };

  // Organize meals by mealType
  const mealSections = [
    { title: 'Breakfast', data: mealData.filter(meal => meal.mealType === 'Breakfast') },
    { title: 'Lunch', data: mealData.filter(meal => meal.mealType === 'Lunch') },
    { title: 'Snack', data: mealData.filter(meal => meal.mealType === 'Snack') },
    { title: 'Dinner', data: mealData.filter(meal => meal.mealType === 'Dinner') },
  ].filter(section => section.data.length > 0); // Only show sections with data

  // Temporary data for other tabs (water, goals, workouts)
  const [otherData] = useState({
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
    workouts: [
      { id: '1', type: 'Skating', duration: '45 min', calories: '320', time: '07:30 AM' },
      { id: '2', type: 'Yoga', duration: '20 min', calories: '120', time: '06:30 PM' },
    ],
  });

  const animate = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start(() => animation.setValue(0));
  };

  const handleSaveMeal = async () => {
    const mealsToAdd = [];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (mealsInput.breakfast) {
      mealsToAdd.push({
        mealType: 'Breakfast',
        description: mealsInput.breakfast,
        time: currentTime
      });
    }
    if (mealsInput.lunch) {
      mealsToAdd.push({
        mealType: 'Lunch',
        description: mealsInput.lunch,
        time: currentTime
      });
    }
    if (mealsInput.snacks) {
      mealsToAdd.push({
        mealType: 'Snack',
        description: mealsInput.snacks,
        time: currentTime
      });
    }
    if (mealsInput.dinner) {
      mealsToAdd.push({
        mealType: 'Dinner',
        description: mealsInput.dinner,
        time: currentTime
      });
    }

    try {
      for (const meal of mealsToAdd) {
        await addMeal(meal);
      }
      setMealsInput({ breakfast: '', lunch: '', snacks: '', dinner: '' });
      setModalVisible(false);
      animate();
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  };

  const toggleGoalCompletion = (id) => {
    setOtherData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ),
    }));
    animate();
  };

  // Calculate totals
  const totalCalories = mealData.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalWater = otherData.waterIntake.reduce((sum, entry) => sum + parseInt(entry.amount), 0);
  const completedGoals = otherData.goals.filter(goal => goal.completed).length;
  const totalWorkoutCalories = otherData.workouts.reduce((sum, workout) => sum + parseInt(workout.calories), 0);

  const renderMealItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemType}>{item.mealType}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
      <Text style={styles.itemDetails}>{item.description}</Text>
      <View style={styles.itemFooter}>
        {item.calories && <Text style={styles.itemCalories}>{item.calories} cal</Text>}
      </View>
    </View>
  );

  const renderWaterItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <MaterialCommunityIcons name="cup-water" size={20} color="#00BFFF" />
        <Text style={styles.itemAmount}>{item.amount}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
    </View>
  );

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => toggleGoalCompletion(item.id)}
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

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
      <View style={styles.workoutDetails}>
        <Text style={styles.workoutStat}>{item.duration}</Text>
        <Text style={styles.workoutStat}>{item.calories} cal</Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
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
          <Text style={styles.headerDate}>{currentDate}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'meals' && styles.activeStatCard]}
          onPress={() => setActiveTab('meals')}
        >
          <MaterialCommunityIcons name="food" size={20} color={activeTab === 'meals' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'meals' && styles.activeStatValue]}>{totalCalories}</Text>
          <Text style={[styles.statLabel, activeTab === 'meals' && styles.activeStatLabel]}>Calories</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'water' && styles.activeStatCard]}
          onPress={() => setActiveTab('water')}
        >
          <MaterialCommunityIcons name="cup-water" size={20} color={activeTab === 'water' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'water' && styles.activeStatValue]}>{totalWater}ml</Text>
          <Text style={[styles.statLabel, activeTab === 'water' && styles.activeStatLabel]}>Water</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'goals' && styles.activeStatCard]}
          onPress={() => setActiveTab('goals')}
        >
          <MaterialCommunityIcons name="target" size={20} color={activeTab === 'goals' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'goals' && styles.activeStatValue]}>{completedGoals}/{otherData.goals.length}</Text>
          <Text style={[styles.statLabel, activeTab === 'goals' && styles.activeStatLabel]}>Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, activeTab === 'workouts' && styles.activeStatCard]}
          onPress={() => setActiveTab('workouts')}
        >
          <MaterialCommunityIcons name="dumbbell" size={20} color={activeTab === 'workouts' ? '#fff' : '#4B6CB7'} />
          <Text style={[styles.statValue, activeTab === 'workouts' && styles.activeStatValue]}>{totalWorkoutCalories}</Text>
          <Text style={[styles.statLabel, activeTab === 'workouts' && styles.activeStatLabel]}>Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {activeTab === 'meals' && (
          <FlatList
            data={mealData}
            renderItem={renderMealItem}
            keyExtractor={item => item._id || item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No meals recorded today</Text>
            }
          />
        )}

        {activeTab === 'water' && (
          <FlatList
            data={otherData.waterIntake}
            renderItem={renderWaterItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No water intake recorded</Text>
            }
          />
        )}

        {activeTab === 'goals' && (
          <FlatList
            data={otherData.goals}
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
            data={otherData.workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No workouts recorded</Text>
            }
          />
        )}
      </View>

      {/* Add Meal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Meal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>Breakfast</Text>
              <TextInput
                style={styles.input}
                placeholder="What did you eat?"
                value={mealsInput.breakfast}
                onChangeText={(text) => setMealsInput({ ...mealsInput, breakfast: text })}
              />

              <Text style={styles.inputLabel}>Lunch</Text>
              <TextInput
                style={styles.input}
                placeholder="What did you eat?"
                value={mealsInput.lunch}
                onChangeText={(text) => setMealsInput({ ...mealsInput, lunch: text })}
              />

              <Text style={styles.inputLabel}>Snacks</Text>
              <TextInput
                style={styles.input}
                placeholder="What did you eat?"
                value={mealsInput.snacks}
                onChangeText={(text) => setMealsInput({ ...mealsInput, snacks: text })}
              />

              <Text style={styles.inputLabel}>Dinner</Text>
              <TextInput
                style={styles.input}
                placeholder="What did you eat?"
                value={mealsInput.dinner}
                onChangeText={(text) => setMealsInput({ ...mealsInput, dinner: text })}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveMeal}
              >
                <Text style={styles.saveButtonText}>Save Meals</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ... keep your existing styles ...








// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   ScrollView,
//   Dimensions,
//   Animated,
//   Easing
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuthStore } from '../store/authStore';

// const { width } = Dimensions.get('window');

// const DailyActivitiesScreen = ({ navigation }) => {
//   const [currentDate] = useState(new Date().toISOString().split('T')[0]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [meals, setMeals] = useState({ breakfast: '', lunch: '', snacks: '', dinner: '' });
//   const [activeTab, setActiveTab] = useState('meals');
//   const [animation] = useState(new Animated.Value(0));
//   // meals related field state
//   const { mealData, getMeals } = useMealStore();
//   const [refreshing, setRefreshing] = useState(false);

//     // Initial data fetch on mount
//     useEffect(() => {
//       getMeals();
//     }, [getMeals]);
  
//     // Refresh handler
//     const onRefresh = async () => {
//       setRefreshing(true);
//       const result = await getMeals();
//       setRefreshing(false);
//       if (!result.success) {
//         console.log('Refresh failed:', result.error);
//       }
//     };
  
//     // Organize meals by mealType
//     const sections = [
//       { title: 'Breakfast', data: mealData.filter(meal => meal.mealType === 'Breakfast') },
//       { title: 'Lunch', data: mealData.filter(meal => meal.mealType === 'Lunch') },
//       { title: 'Snack', data: mealData.filter(meal => meal.mealType === 'Snack') },
//       { title: 'Dinner', data: mealData.filter(meal => meal.mealType === 'Dinner') },
//     ].filter(section => section.data.length > 0); // Only show sections with data



//   const [dailyData, setDailyData] = useState({
//     // meals: [
//     //   { id: '1', type: 'Breakfast', items: 'Oatmeal, Banana', calories: 350, time: '08:30 AM' },
//     //   { id: '2', type: 'Lunch', items: 'Grilled Chicken, Rice, Salad', calories: 550, time: '12:45 PM' },
//     //   { id: '3', type: 'Snack', items: 'Protein Shake', calories: 200, time: '04:15 PM' },
//     // ]
//     // ,
//     meals: [],
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
//     workouts: [
//       { id: '1', type: 'Skating', duration: '45 min', calories: '320', time: '07:30 AM' },
//       { id: '2', type: 'Yoga', duration: '20 min', calories: '120', time: '06:30 PM' },
//     ],
//   });

//   const animate = () => {
//     Animated.timing(animation, {
//       toValue: 1,
//       duration: 500,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true
//     }).start(() => animation.setValue(0));
//   };

//   const handleSaveMeal = () => {
//     const newMeals = [];
//     if (meals.breakfast) newMeals.push({ 
//       id: Date.now() + '1', 
//       type: 'Breakfast', 
//       items: meals.breakfast, 
//       calories: 300,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     });
//     if (meals.lunch) newMeals.push({ 
//       id: Date.now() + '2', 
//       type: 'Lunch', 
//       items: meals.lunch, 
//       calories: 500,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     });
//     if (meals.snacks) newMeals.push({ 
//       id: Date.now() + '3', 
//       type: 'Snack', 
//       items: meals.snacks, 
//       calories: 200,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     });
//     if (meals.dinner) newMeals.push({ 
//       id: Date.now() + '4', 
//       type: 'Dinner', 
//       items: meals.dinner, 
//       calories: 400,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     });

//     setDailyData(prev => ({
//       ...prev,
//       meals: [...prev.meals, ...newMeals],
//     }));
//     setMeals({ breakfast: '', lunch: '', snacks: '', dinner: '' });
//     setModalVisible(false);
//     animate();
//   };

//   const toggleGoalCompletion = (id) => {
//     setDailyData(prev => ({
//       ...prev,
//       goals: prev.goals.map(goal => 
//         goal.id === id ? { ...goal, completed: !goal.completed } : goal
//       ),
//     }));
//     animate();
//   };

//   const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
//   const totalWater = dailyData.waterIntake.reduce((sum, entry) => sum + parseInt(entry.amount), 0);
//   const completedGoals = dailyData.goals.filter(goal => goal.completed).length;
//   const totalWorkoutCalories = dailyData.workouts.reduce((sum, workout) => sum + parseInt(workout.calories), 0);

//   const renderMealItem = ({ item }) => (
//     <View style={styles.itemCard}>
//       <View style={styles.itemHeader}>
//         <Text style={styles.itemType}>{item.type}</Text>
//         <Text style={styles.itemTime}>{item.time}</Text>
//       </View>
//       <Text style={styles.itemDetails}>{item.items}</Text>
//       <View style={styles.itemFooter}>
//         <Text style={styles.itemCalories}>{item.calories} cal</Text>
//       </View>
//     </View>
//   );

//   const renderWaterItem = ({ item }) => (
//     <View style={styles.itemCard}>
//       <View style={styles.itemHeader}>
//         <MaterialCommunityIcons name="cup-water" size={20} color="#00BFFF" />
//         <Text style={styles.itemAmount}>{item.amount}</Text>
//         <Text style={styles.itemTime}>{item.time}</Text>
//       </View>
//     </View>
//   );

//   const renderGoalItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.itemCard}
//       onPress={() => toggleGoalCompletion(item.id)}
//     >
//       <View style={styles.goalContent}>
//         <MaterialCommunityIcons 
//           name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
//           size={24} 
//           color={item.completed ? "#4CAF50" : "#ccc"} 
//         />
//         <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
//           {item.title}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderWorkoutItem = ({ item }) => (
//     <View style={styles.itemCard}>
//       <View style={styles.itemHeader}>
//         <Text style={styles.itemType}>{item.type}</Text>
//         <Text style={styles.itemTime}>{item.time}</Text>
//       </View>
//       <View style={styles.workoutDetails}>
//         <Text style={styles.workoutStat}>{item.duration}</Text>
//         <Text style={styles.workoutStat}>{item.calories} cal</Text>
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
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Daily Activities</Text>
//           <Text style={styles.headerDate}>{currentDate}</Text>
//         </View>
//         <TouchableOpacity onPress={() => setModalVisible(true)}>
//           <Feather name="plus" size={24} color="#fff" />
//         </TouchableOpacity>
//       </LinearGradient>

//       {/* Stats Overview */}
//       <View style={styles.statsContainer}>
//         <TouchableOpacity 
//           style={[styles.statCard, activeTab === 'meals' && styles.activeStatCard]}
//           onPress={() => setActiveTab('meals')}
//         >
//           <MaterialCommunityIcons name="food" size={20} color={activeTab === 'meals' ? '#fff' : '#4B6CB7'} />
//           <Text style={[styles.statValue, activeTab === 'meals' && styles.activeStatValue]}>{totalCalories}</Text>
//           <Text style={[styles.statLabel, activeTab === 'meals' && styles.activeStatLabel]}>Calories</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={[styles.statCard, activeTab === 'water' && styles.activeStatCard]}
//           onPress={() => setActiveTab('water')}
//         >
//           <MaterialCommunityIcons name="cup-water" size={20} color={activeTab === 'water' ? '#fff' : '#4B6CB7'} />
//           <Text style={[styles.statValue, activeTab === 'water' && styles.activeStatValue]}>{totalWater}ml</Text>
//           <Text style={[styles.statLabel, activeTab === 'water' && styles.activeStatLabel]}>Water</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={[styles.statCard, activeTab === 'goals' && styles.activeStatCard]}
//           onPress={() => setActiveTab('goals')}
//         >
//           <MaterialCommunityIcons name="target" size={20} color={activeTab === 'goals' ? '#fff' : '#4B6CB7'} />
//           <Text style={[styles.statValue, activeTab === 'goals' && styles.activeStatValue]}>{completedGoals}/{dailyData.goals.length}</Text>
//           <Text style={[styles.statLabel, activeTab === 'goals' && styles.activeStatLabel]}>Goals</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={[styles.statCard, activeTab === 'workouts' && styles.activeStatCard]}
//           onPress={() => setActiveTab('workouts')}
//         >
//           <MaterialCommunityIcons name="dumbbell" size={20} color={activeTab === 'workouts' ? '#fff' : '#4B6CB7'} />
//           <Text style={[styles.statValue, activeTab === 'workouts' && styles.activeStatValue]}>{totalWorkoutCalories}</Text>
//           <Text style={[styles.statLabel, activeTab === 'workouts' && styles.activeStatLabel]}>Workout</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Content Area */}
//       <View style={styles.contentContainer}>
//         {activeTab === 'meals' && (
//           <FlatList
//             data={dailyData.meals}
//             renderItem={renderMealItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.listContent}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No meals recorded today</Text>
//             }
//           />
//         )}

//         {activeTab === 'water' && (
//           <FlatList
//             data={dailyData.waterIntake}
//             renderItem={renderWaterItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.listContent}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No water intake recorded</Text>
//             }
//           />
//         )}

//         {activeTab === 'goals' && (
//           <FlatList
//             data={dailyData.goals}
//             renderItem={renderGoalItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.listContent}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No goals set for today</Text>
//             }
//           />
//         )}

//         {activeTab === 'workouts' && (
//           <FlatList
//             data={dailyData.workouts}
//             renderItem={renderWorkoutItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.listContent}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No workouts recorded</Text>
//             }
//           />
//         )}
//       </View>

//       {/* Add Meal Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add Meal</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Feather name="x" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView>
//               <Text style={styles.inputLabel}>Breakfast</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="What did you eat?"
//                 value={meals.breakfast}
//                 onChangeText={(text) => setMeals({ ...meals, breakfast: text })}
//               />

//               <Text style={styles.inputLabel}>Lunch</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="What did you eat?"
//                 value={meals.lunch}
//                 onChangeText={(text) => setMeals({ ...meals, lunch: text })}
//               />

//               <Text style={styles.inputLabel}>Snacks</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="What did you eat?"
//                 value={meals.snacks}
//                 onChangeText={(text) => setMeals({ ...meals, snacks: text })}
//               />

//               <Text style={styles.inputLabel}>Dinner</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="What did you eat?"
//                 value={meals.dinner}
//                 onChangeText={(text) => setMeals({ ...meals, dinner: text })}
//               />
//             </ScrollView>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity 
//                 style={styles.cancelButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.saveButton}
//                 onPress={handleSaveMeal}
//               >
//                 <Text style={styles.saveButtonText}>Save Meals</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

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
    marginTop: '1%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    backgroundColor: '#fff',
    marginTop: -10,
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
    padding: '3%',
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
    marginVertical: '1%',
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  listContent: {
    paddingBottom: '5%',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '3%',
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
    marginBottom: '2%',
  },
  itemType: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  itemTime: {
    fontSize: width * 0.035,
    color: '#666',
  },
  itemDetails: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: '2%',
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
  itemAmount: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#00BFFF',
    flex: 1,
    marginLeft: '2%',
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalText: {
    fontSize: width * 0.04,
    color: '#333',
    marginLeft: '3%',
    flex: 1,
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutStat: {
    fontSize: width * 0.035,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: '10%',
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
    padding: '4%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: '2%',
    marginTop: '4%',
    paddingHorizontal: '4%',
  },
  input: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: '3.5%',
    marginHorizontal: '4%',
    fontSize: width * 0.04,
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: '4%',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  saveButton: {
    flex: 1,
    padding: '4%',
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
});
export default DailyActivitiesScreen;