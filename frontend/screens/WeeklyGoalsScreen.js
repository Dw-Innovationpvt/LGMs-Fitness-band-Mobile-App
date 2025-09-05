import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTargetStore } from '../store/targetStore';

const WeeklyGoalsScreen = () => {
  const { 
    targetHistory, 
    fetchTargetHistory, 
    updateTargetProgress,
    loading,
    error 
  } = useTargetStore();
  
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await fetchTargetHistory();
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to load data');
    }
  };

  const getDayName = (index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Yesterday';
    const date = new Date(targetHistory[index]?.date);
    return format(date, 'EEE');
  };

  const getDateString = (index) => {
    if (!targetHistory[index]) return '';
    const date = new Date(targetHistory[index].date);
    return format(date, 'MMM d');
  };

  const testUpdateProgress = async (type, value) => {
    const result = await updateTargetProgress(type, value);
    if (result.success) {
      Alert.alert('Success', `${type} updated to ${value}`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (loading.history) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4B6CB7" />
        <Text style={styles.loadingText}>Loading weekly goals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Goals Overview</Text>
      
      {/* Day Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
        {targetHistory.slice(0, 7).map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonSelected
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[
              styles.dayText,
              selectedDay === index && styles.dayTextSelected
            ]}>
              {getDayName(index)}
            </Text>
            <Text style={styles.dateText}>{getDateString(index)}</Text>
            
            {/* Completion indicator */}
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>
                {Math.round((Object.values(day.completed).filter(Boolean).length / 4) * 100)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Day Details */}
      {targetHistory[selectedDay] && (
        <View style={styles.dayDetails}>
          <Text style={styles.dayTitle}>
            {getDayName(selectedDay)}'s Progress
          </Text>

          {/* Goal Cards */}
          <View style={styles.goalsContainer}>
            {/* Water Goal */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <MaterialCommunityIcons name="cup-water" size={20} color="#00BFFF" />
                <Text style={styles.goalName}>Water</Text>
                <Text style={styles.goalStats}>
                  {targetHistory[selectedDay].progress.water}ml / {targetHistory[selectedDay].targets.water}ml
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { 
                    width: `${(targetHistory[selectedDay].progress.water / targetHistory[selectedDay].targets.water) * 100}%`,
                    backgroundColor: '#00BFFF'
                  }
                ]} />
              </View>
              {targetHistory[selectedDay].completed.water && (
                <Text style={styles.completedText}>✅ Completed</Text>
              )}
            </View>

            {/* Steps Goal */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <MaterialCommunityIcons name="walk" size={20} color="#4CAF50" />
                <Text style={styles.goalName}>Steps</Text>
                <Text style={styles.goalStats}>
                  {targetHistory[selectedDay].progress.steps} / {targetHistory[selectedDay].targets.steps}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { 
                    width: `${(targetHistory[selectedDay].progress.steps / targetHistory[selectedDay].targets.steps) * 100}%`,
                    backgroundColor: '#4CAF50'
                  }
                ]} />
              </View>
              {targetHistory[selectedDay].completed.steps && (
                <Text style={styles.completedText}>✅ Completed</Text>
              )}
            </View>

            {/* Calories In Goal */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <MaterialCommunityIcons name="food" size={20} color="#FF6B6B" />
                <Text style={styles.goalName}>Calories In</Text>
                <Text style={styles.goalStats}>
                  {targetHistory[selectedDay].progress.caloriesEarn} / {targetHistory[selectedDay].targets.caloriesEarn}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { 
                    width: `${(targetHistory[selectedDay].progress.caloriesEarn / targetHistory[selectedDay].targets.caloriesEarn) * 100}%`,
                    backgroundColor: '#FF6B6B'
                  }
                ]} />
              </View>
              {targetHistory[selectedDay].completed.caloriesEarn && (
                <Text style={styles.completedText}>✅ Completed</Text>
              )}
            </View>

            {/* Calories Out Goal */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <MaterialCommunityIcons name="fire" size={20} color="#FFA726" />
                <Text style={styles.goalName}>Calories Out</Text>
                <Text style={styles.goalStats}>
                  {targetHistory[selectedDay].progress.caloriesBurn} / {targetHistory[selectedDay].targets.caloriesBurn}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { 
                    width: `${(targetHistory[selectedDay].progress.caloriesBurn / targetHistory[selectedDay].targets.caloriesBurn) * 100}%`,
                    backgroundColor: '#FFA726'
                  }
                ]} />
              </View>
              {targetHistory[selectedDay].completed.caloriesBurn && (
                <Text style={styles.completedText}>✅ Completed</Text>
              )}
            </View>
          </View>

          {/* Test Buttons */}
          <View style={styles.testButtons}>
            <Text style={styles.testTitle}>Test Updates:</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.testButton}
                onPress={() => testUpdateProgress('water', 1500)}
              >
                <Text style={styles.buttonText}>+ Water</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.testButton}
                onPress={() => testUpdateProgress('steps', 5000)}
              >
                <Text style={styles.buttonText}>+ Steps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  dayScroll: {
    marginBottom: 20,
  },
  dayButton: {
    padding: 12,
    marginHorizontal: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayButtonSelected: {
    backgroundColor: '#4B6CB7',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dayTextSelected: {
    color: 'white',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 4,
  },
  completionBadge: {
    backgroundColor: '#e9ecef',
    padding: 4,
    borderRadius: 8,
    minWidth: 30,
  },
  completionText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dayDetails: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  goalsContainer: {
    flex: 1,
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
    color: '#2c3e50',
  },
  goalStats: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 12,
  },
  testButtons: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  testButton: {
    backgroundColor: '#4B6CB7',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4B6CB7',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default WeeklyGoalsScreen;
// // import React, { useState, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   TouchableOpacity,
// //   ScrollView,
// //   Dimensions,
// //   RefreshControl,
// //   Platform
// // } from 'react-native';
// // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { format, subDays, isSameDay, isWithinInterval } from 'date-fns';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { useTargetStore } from '../store/targetStore';

// // const { width } = Dimensions.get('window');

// // const WeeklyGoalsScreen = ({ navigation }) => {
// //   const [selectedDate, setSelectedDate] = useState(new Date());
// //   const [refreshing, setRefreshing] = useState(false);

// //   // Zustand store hooks
// //   const {
// //     targetHistory,
// //     loading,
// //     error,
// //     fetchTargetHistory,
// //     clearError
// //   } = useTargetStore();

// //   // Generate 7 days: 6 days before today and today
// //   const generateWeekDates = () => {
// //     const today = new Date();
// //     const dates = [];
// //     for (let i = 6; i >= 0; i--) {
// //       dates.push(subDays(today, i));
// //     }
// //     return dates;
// //   };

// //   const weekDates = generateWeekDates();
// //   const today = new Date();
// //   const sevenDaysAgo = subDays(today, 6);
// //   const clickableRange = { start: sevenDaysAgo, end: today };

// //   // Fetch target history on mount and when screen comes into focus
// //   useFocusEffect(
// //     useCallback(() => {
// //       const fetchData = async () => {
// //         try {
// //           setRefreshing(true);
// //           await fetchTargetHistory(7);
// //         } catch (error) {
// //           console.error('Failed to fetch target history:', error);
// //         } finally {
// //           setRefreshing(false);
// //         }
// //       };
// //       fetchData();
// //     }, [])
// //   );

// //   // Pull to refresh
// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     try {
// //       await fetchTargetHistory(7);
// //     } catch (error) {
// //       console.error('Failed to refresh target history:', error);
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   // Get goals for the selected date
// //   const selectedDayData = targetHistory.find(day => 
// //     isSameDay(new Date(day.date), selectedDate)
// //   );

// //   const goals = selectedDayData ? [
// //     {
// //       id: '1',
// //       title: `Drink ${((selectedDayData.progress.water || 0) / 1000).toFixed(1)}L out of ${((selectedDayData.targets.water || 2000) / 1000).toFixed(1)}L`,
// //       completed: selectedDayData.completed.water || false
// //     },
// //     {
// //       id: '2',
// //       title: `${selectedDayData.progress.steps || 0} steps out of ${selectedDayData.targets.steps || 10000}`,
// //       completed: selectedDayData.completed.steps || false
// //     },
// //     {
// //       id: '3',
// //       title: `${selectedDayData.progress.caloriesEarn || 0} cal out of ${selectedDayData.targets.caloriesEarn || 2000}`,
// //       completed: selectedDayData.completed.caloriesEarn || false
// //     },
// //     {
// //       id: '4',
// //       title: `${selectedDayData.progress.caloriesBurn || 0} cal out of ${selectedDayData.targets.caloriesBurn || 500}`,
// //       completed: selectedDayData.completed.caloriesBurn || false
// //     },
// //   ] : [];

// //   // Render goal item
// //   const renderGoalItem = ({ item }) => (
// //     <View style={styles.itemCard}>
// //       <View style={styles.goalContent}>
// //         <MaterialCommunityIcons 
// //           name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
// //           size={24} 
// //           color={item.completed ? "#4CAF50" : "#ccc"} 
// //         />
// //         <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
// //           {item.title}
// //         </Text>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <LinearGradient
// //         colors={['#4B6CB7', '#182848']}
// //         style={styles.header}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //       >
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Feather name="arrow-left" size={24} color="#fff" />
// //         </TouchableOpacity>
// //         <View style={styles.headerCenter}>
// //           <Text style={styles.headerTitle}>Weekly Goals</Text>
// //           <Text style={styles.headerDate}>{format(selectedDate, 'MMMM yyyy')}</Text>
// //         </View>
// //         <View style={{ width: 24 }} />
// //       </LinearGradient>

// //       {/* Week Calendar */}
// //       <View style={styles.calendarContainer}>
// //         <ScrollView 
// //           horizontal 
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={styles.calendarScroll}
// //         >
// //           {weekDates.map((date, index) => {
// //             const isSelected = isSameDay(date, selectedDate);
// //             const isToday = isSameDay(date, new Date());
// //             const isClickable = isWithinInterval(date, clickableRange);
            
// //             return (
// //               <TouchableOpacity
// //                 key={index}
// //                 style={[
// //                   styles.dateContainer,
// //                   isSelected && styles.selectedDateContainer,
// //                   isToday && !isSelected && styles.todayDateContainer,
// //                   !isClickable && styles.disabledDateContainer
// //                 ]}
// //                 onPress={() => isClickable && setSelectedDate(date)}
// //                 disabled={!isClickable}
// //               >
// //                 <Text style={[
// //                   styles.dayText,
// //                   isSelected && styles.selectedDayText,
// //                   isToday && !isSelected && styles.todayDayText,
// //                   !isClickable && styles.disabledDayText
// //                 ]}>
// //                   {format(date, 'EEE')}
// //                 </Text>
// //                 <Text style={[
// //                   styles.dateText,
// //                   isSelected && styles.selectedDateText,
// //                   isToday && !isSelected && styles.todayDateText,
// //                   !isClickable && styles.disabledDateText
// //                 ]}>
// //                   {format(date, 'd')}
// //                 </Text>
// //               </TouchableOpacity>
// //             );
// //           })}
// //         </ScrollView>
// //       </View>

// //       {/* Goals Section */}
// //       <View style={styles.contentContainer}>
// //         <View style={styles.statsContainer}>
// //           <View style={styles.statCard}>
// //             <MaterialCommunityIcons name="target" size={20} color="#4B6CB7" />
// //             <Text style={styles.statValue}>
// //               {goals.filter(g => g.completed).length}/{goals.length}
// //             </Text>
// //             <Text style={styles.statLabel}>Goals Completed</Text>
// //           </View>
// //         </View>

// //         <FlatList
// //           data={goals}
// //           renderItem={renderGoalItem}
// //           keyExtractor={item => item.id}
// //           contentContainerStyle={styles.listContent}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //             />
// //           }
// //           ListEmptyComponent={
// //             <Text style={styles.emptyText}>
// //               {loading.history ? 'Loading goals...' : `No goals data for ${format(selectedDate, 'MMMM d')}`}
// //             </Text>
// //           }
// //         />
// //       </View>

// //       {/* Error Display */}
// //       {error && (
// //         <View style={styles.errorContainer}>
// //           <Text style={styles.errorText}>{error}</Text>
// //           <TouchableOpacity onPress={clearError}>
// //             <Text style={styles.clearErrorText}>Dismiss</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     padding: 16,
// //     paddingTop: Platform.OS === 'ios' ? 50 : 30,
// //   },
// //   headerCenter: {
// //     alignItems: 'center',
// //   },
// //   headerTitle: {
// //     color: '#fff',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },
// //   headerDate: {
// //     color: '#fff',
// //     fontSize: 14,
// //   },
// //   calendarContainer: {
// //     paddingVertical: 10,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   calendarScroll: {
// //     paddingHorizontal: 10,
// //   },
// //   dateContainer: {
// //     alignItems: 'center',
// //     padding: 10,
// //     marginHorizontal: 5,
// //     borderRadius: 8,
// //   },
// //   selectedDateContainer: {
// //     backgroundColor: '#4B6CB7',
// //   },
// //   todayDateContainer: {
// //     borderWidth: 1,
// //     borderColor: '#4B6CB7',
// //   },
// //   disabledDateContainer: {
// //     opacity: 0.5,
// //   },
// //   dayText: {
// //     fontSize: 12,
// //     color: '#333',
// //   },
// //   dateText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   selectedDayText: {
// //     color: '#fff',
// //   },
// //   selectedDateText: {
// //     color: '#fff',
// //   },
// //   todayDayText: {
// //     color: '#4B6CB7',
// //   },
// //   todayDateText: {
// //     color: '#4B6CB7',
// //   },
// //   disabledDayText: {
// //     color: '#999',
// //   },
// //   disabledDateText: {
// //     color: '#999',
// //   },
// //   statsContainer: {
// //     padding: 16,
// //     backgroundColor: '#fff',
// //   },
// //   statCard: {
// //     alignItems: 'center',
// //     padding: 16,
// //     backgroundColor: '#f8f9fa',
// //     borderRadius: 12,
// //     width: width - 32,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   statValue: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginTop: 8,
// //   },
// //   statLabel: {
// //     fontSize: 12,
// //     color: '#666',
// //     marginTop: 4,
// //   },
// //   contentContainer: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //   },
// //   listContent: {
// //     padding: 16,
// //     paddingBottom: 100,
// //   },
// //   itemCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   goalContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   goalText: {
// //     fontSize: 16,
// //     color: '#333',
// //     marginLeft: 8,
// //   },
// //   completedGoal: {
// //     textDecorationLine: 'line-through',
// //     color: '#666',
// //   },
// //   emptyText: {
// //     textAlign: 'center',
// //     color: '#666',
// //     fontSize: 16,
// //     marginTop: 20,
// //   },
// //   errorContainer: {
// //     backgroundColor: '#ffe6e6',
// //     padding: 16,
// //     margin: 16,
// //     borderRadius: 8,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   errorText: {
// //     color: '#d32f2f',
// //     fontSize: 14,
// //   },
// //   clearErrorText: {
// //     color: '#d32f2f',
// //     fontWeight: 'bold',
// //   },
// // });

// // export default WeeklyGoalsScreen;

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity,
//   Dimensions 
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { format, subDays, isToday, isYesterday } from 'date-fns';
// import { useTargetStore } from '../store/targetStore';

// const { width } = Dimensions.get('window');

// const WeeklyGoalsScreen = () => {
//   const { targetHistory, fetchTargetHistory, loading } = useTargetStore();
//   const [selectedDay, setSelectedDay] = useState(0); // 0 = today, 1 = yesterday, etc.

//   useEffect(() => {
//     fetchTargetHistory();
//   }, []);

//   const getDayLabel = (date, index) => {
//     if (index === 0) return 'Today';
//     if (index === 1) return 'Yesterday';
//     return format(date, 'EEE');
//   };

//   const getProgressBars = (targetData) => {
//     if (!targetData) return null;

//     const goals = [
//       { type: 'water', label: 'Water', color: '#00BFFF', icon: 'cup-water' },
//       { type: 'steps', label: 'Steps', color: '#4CAF50', icon: 'walk' },
//       { type: 'caloriesEarn', label: 'Calories In', color: '#FF6B6B', icon: 'food' },
//       { type: 'caloriesBurn', label: 'Calories Out', color: '#FFA726', icon: 'fire' }
//     ];

//     return goals.map((goal, index) => {
//       const progress = targetData.progress[goal.type] || 0;
//       const target = targetData.targets[goal.type] || 1; // Avoid division by zero
//       const percentage = Math.min(100, (progress / target) * 100);
//       const completed = targetData.completed?.[goal.type] || false;

//       return (
//         <View key={goal.type} style={styles.goalItem}>
//           <View style={styles.goalHeader}>
//             <MaterialCommunityIcons 
//               name={goal.icon} 
//               size={16} 
//               color={goal.color} 
//             />
//             <Text style={styles.goalLabel}>{goal.label}</Text>
//             <Text style={styles.goalStats}>
//               {progress}/{target}
//             </Text>
//           </View>
          
//           <View style={styles.progressBarBackground}>
//             <View 
//               style={[
//                 styles.progressBarFill,
//                 { 
//                   width: `${percentage}%`,
//                   backgroundColor: goal.color
//                 }
//               ]}
//             />
//           </View>
          
//           <View style={styles.goalFooter}>
//             <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
//             {completed && (
//               <MaterialCommunityIcons 
//                 name="check-circle" 
//                 size={16} 
//                 color="#4CAF50" 
//               />
//             )}
//           </View>
//         </View>
//       );
//     });
//   };

//   const getCompletionScore = (targetData) => {
//     if (!targetData) return 0;
//     const goals = ['water', 'steps', 'caloriesEarn', 'caloriesBurn'];
//     const completedCount = goals.filter(goal => targetData.completed?.[goal]).length;
//     return (completedCount / goals.length) * 100;
//   };

//   if (loading.history) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading weekly goals...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Day Selector */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         style={styles.daySelector}
//         contentContainerStyle={styles.daySelectorContent}
//       >
//         {targetHistory.slice(0, 7).map((dayData, index) => {
//           const date = new Date(dayData.date);
//           const completionScore = getCompletionScore(dayData);
//           const isSelected = selectedDay === index;

//           return (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.dayButton,
//                 isSelected && styles.dayButtonSelected
//               ]}
//               onPress={() => setSelectedDay(index)}
//             >
//               <Text style={[
//                 styles.dayButtonText,
//                 isSelected && styles.dayButtonTextSelected
//               ]}>
//                 {getDayLabel(date, index)}
//               </Text>
//               <Text style={styles.dayDateText}>
//                 {format(date, 'MMM d')}
//               </Text>
              
//               {/* Completion indicator */}
//               <View style={styles.completionCircle}>
//                 <Text style={styles.completionText}>
//                   {Math.round(completionScore)}%
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>

//       {/* Selected Day Details */}
//       {targetHistory[selectedDay] && (
//         <View style={styles.detailsContainer}>
//           <View style={styles.detailsHeader}>
//             <Text style={styles.detailsTitle}>
//               {getDayLabel(new Date(targetHistory[selectedDay].date), selectedDay)}
//             </Text>
//             <Text style={styles.detailsDate}>
//               {format(new Date(targetHistory[selectedDay].date), 'MMMM d, yyyy')}
//             </Text>
//           </View>

//           <View style={styles.goalsContainer}>
//             {getProgressBars(targetHistory[selectedDay])}
//           </View>

//           {/* Summary */}
//           <View style={styles.summaryContainer}>
//             <Text style={styles.summaryTitle}>Daily Summary</Text>
//             <View style={styles.summaryStats}>
//               <View style={styles.summaryStat}>
//                 <Text style={styles.summaryNumber}>
//                   {Object.values(targetHistory[selectedDay].completed).filter(Boolean).length}
//                 </Text>
//                 <Text style={styles.summaryLabel}>Goals Completed</Text>
//               </View>
//               <View style={styles.summaryStat}>
//                 <Text style={styles.summaryNumber}>
//                   {Math.round(getCompletionScore(targetHistory[selectedDay]))}%
//                 </Text>
//                 <Text style={styles.summaryLabel}>Overall Completion</Text>
//               </View>
//             </View>
//           </View>
//           <View style={{ height: 20, marginBottom: 200 } }/>
//         </View>
//       )}
//       <View style={{ height:300 }}></ View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     margin: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   daySelector: {
//     marginBottom: 20,
//   },
//   daySelectorContent: {
//     paddingHorizontal: 8,
//   },
//   dayButton: {
//     alignItems: 'center',
//     padding: 12,
//     marginHorizontal: 6,
//     borderRadius: 12,
//     backgroundColor: '#f8f9fa',
//     minWidth: 80,
//   },
//   dayButtonSelected: {
//     backgroundColor: '#4B6CB7',
//   },
//   dayButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 4,
//   },
//   dayButtonTextSelected: {
//     color: '#fff',
//   },
//   dayDateText: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 8,
//   },
//   completionCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#e9ecef',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   completionText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#495057',
//   },
//   detailsContainer: {
//     flex: 1,
//   },
//   detailsHeader: {
//     marginBottom: 20,
//   },
//   detailsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 4,
//   },
//   detailsDate: {
//     fontSize: 14,
//     color: '#7f8c8d',
//   },
//   goalsContainer: {
//     marginBottom: 20,
//   },
//   goalItem: {
//     marginBottom: 16,
//   },
//   goalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   goalLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginLeft: 8,
//     flex: 1,
//   },
//   goalStats: {
//     fontSize: 12,
//     color: '#7f8c8d',
//     fontWeight: '500',
//   },
//   progressBarBackground: {
//     height: 6,
//     backgroundColor: '#e9ecef',
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginBottom: 4,
//   },
//   progressBarFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   goalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   percentageText: {
//     fontSize: 12,
//     color: '#7f8c8d',
//     fontWeight: '500',
//   },
//   summaryContainer: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 12,
//   },
//   summaryStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   summaryStat: {
//     alignItems: 'center',
//   },
//   summaryNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4B6CB7',
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     color: '#7f8c8d',
//   },
// });

// export default WeeklyGoalsScreen;