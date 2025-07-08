import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  RefreshControl,
  Image,useWindowDimensions
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../store/authStore';
// import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const { width } = Dimensions.get('window');

const workoutCategories = {
  '🏋️ Strength': ['Weight Lifting', 'Bodyweight', 'Resistance Bands', 'CrossFit'],
  '🏃 Cardio': ['Running', 'Cycling', 'Swimming', 'HIIT'],
  '🧘 Flexibility': ['Yoga', 'Pilates', 'Stretching'],
  '🛹 Skating': ['Speed Skating', 'Distance Skating', 'Freestyle'],
  '🥊 Combat': ['Boxing', 'MMA', 'Kickboxing']
};

const WorkoutHistoryScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
  // const {  } = useAu
          // postWorkout
          const { loading, error, postWorkout, user, getWorkout, getWorkoutCount, workoutData,  totalCaloriesBurned, totalDurantion, totalExercises } = useAuthStore();

          console.log(workoutData,'\n WOrkout history screen-37' );
          
          const checkUser = () => {
              console.log('User:', user); 
              console.log('getWorkout:', getWorkout.data);
          }
          const getWorkoutCountData = async () => {
              const count = await getWorkoutCount();
              console.log('Workout Count:', count);
              console.warn('Workout Count:', count);
          }
      const handlePostWorkout = async () => {
          const workoutData = {
              // date: new Date().toISOString(),
              duration: 160, // in minutes
              type: 'Running',
              caloriesBurned: 1500,
              exerciseType: 'Cardio',
              distance: 5, // in kilometers
          };
          const responseWorkout = await postWorkout(workoutData);
          console.log('Workout posted:', responseWorkout);
  
      }

  const [workouts, setWorkouts] = useState([
    {
      id: '1',
      type: 'Speed Skating',
      duration: '45',
      calories: '320',
      distance: '5.2',
      date: '2023-06-15',
      time: '07:30 AM',
      notes: 'Morning session at the park'
    },
    {
      id: '2',
      type: 'Weight Lifting',
      duration: '30',
      calories: '240',
      date: '2023-06-14',
      time: '06:00 PM',
      notes: 'Upper body focus'
    },
    {
      id: '3',
      type: 'Yoga',
      duration: '60',
      calories: '180',
      date: '2023-06-13',
      time: '07:00 AM',
      notes: 'Vinyasa flow'
    }
  ]);
   useEffect(() => {
      getWorkoutCount();
      getWorkout();
      // getWorkout();
      setWorkouts(workoutData); // Assuming workoutData is an array of workout objects
      console.log('Workout Data-95:', workoutData);
    }, []); 
    useEffect(() => {
      getWorkout();
    }, [getWorkout]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ 
    type: '', 
    duration: '', 
    calories: '', 
    distance: '', 
    notes: '' 
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleAddWorkout = () => {
    setSelectedCategory(null);
    setSelectedWorkout(null);
    setForm({ type: '', duration: '', calories: '', distance: '', notes: '' });
    setModalVisible(true);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSelectWorkout = (workout) => {
    setSelectedWorkout(workout);
    setForm(prev => ({ ...prev, type: workout }));
  };

  const handleSubmit = async () => {
    // const newlyCreatedWorkout = {
    //   type: selectedWorkout || form.type,
    //   duration: form.duration,
    //   calories: form.calories,
    //   distance: form.distance,

    const newWorkout = {
      id: Date.now().toString(),
      exerciseType: selectedWorkout || form.type,
      duration: form.duration,
      caloriesBurned: form.calories,
      distance: form.distance,
      notes: form.notes,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

            const workoutData = {
            // date: new Date().toISOString(),
            // duration: 10, // in minutes
            duration: form.duration,
            exerciseType: selectedWorkout || form.type,
            caloriesBurned: form.calories,
            // exerciseType: 'warm up',
            // distance: 5, // in kilometers
        };
        const responseWorkout = await postWorkout(workoutData);
        console.log(responseWorkout, 'Workout posted 153');

    // handlePostWorkout(newlyCreatedWorkout);
    handleAddWorkout(newWorkout);
    setWorkouts([newWorkout, ...workouts]);
    setForm({ type: '', duration: '', calories: '', distance: '', notes: '' });
    setModalVisible(false);
    setSelectedCategory(null);
    setSelectedWorkout(null);
  };

  // const renderWorkoutItem = ({ item }) => (
  //   <TouchableOpacity style={styles.workoutCard}>
  //     <View style={styles.workoutHeader}>
  //       <View style={styles.workoutIcon}>
  //         <MaterialCommunityIcons 
  //           name={getWorkoutIcon(item.type)} 
  //           size={24} 
  //           color="#4B6CB7" 
  //         />
  //       </View>
  //       <View style={styles.workoutTitleContainer}>
  //         <Text style={styles.workoutType}>{item.type}</Text>
  //         <Text style={styles.workoutDate}>{item.date} • {item.time}</Text>
  //       </View>
  //       <Feather name="chevron-right" size={20} color="#999" />
  //     </View>
      
  //     <View style={styles.workoutStats}>
  //       <View style={styles.statItem}>
  //         <Text style={styles.statValue}>{item.duration}</Text>
  //         <Text style={styles.statLabel}>min</Text>
  //       </View>
  //       <View style={styles.statItem}>
  //         <Text style={styles.statValue}>{item.calories}</Text>
  //         <Text style={styles.statLabel}>cal</Text>
  //       </View>
  //       {item.distance && (
  //         <View style={styles.statItem}>
  //           <Text style={styles.statValue}>{item.distance}</Text>
  //           <Text style={styles.statLabel}>km</Text>
  //         </View>
  //       )}
  //     </View>
      
  //     {item.notes && (
  //       <View style={styles.notesContainer}>
  //         <Text style={styles.notesText}>"{item.notes}"</Text>
  //       </View>
  //     )}
  //   </TouchableOpacity>
  // );
//   const getWorkoutIcon = (exerciseType) => {
//   switch (exerciseType.toLowerCase()) { // Ensure case-insensitive comparison
//     case 'cardio':
//       return 'heart-pulse';
//     case 'speed skating':
//       return 'skate'; // Example icon for speed skating
//     case 'running':
//       return 'run';
//     case 'weights':
//       return 'dumbbell';
//     case 'swimming':
//       return 'swim';
//     // Add more cases as needed
//     default:
//       return 'run'; // Default icon
//   }
// };

// const renderWorkoutItem = ({ item }) => {
//   // Parse the date string into a Date object
//   const workoutDateTime = new Date(item.date);

//   // Format the date for display (e.g., "July 4, 2025")
//   const formattedDate = workoutDateTime.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   // Format the time for display (e.g., "08:05 AM")
//   const formattedTime = workoutDateTime.toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true, // Use 12-hour format with AM/PM
//   });

//   return (
//     <TouchableOpacity style={styles.workoutCard}>
//       <View style={styles.workoutHeader}>
//         <View style={styles.workoutIcon}>
//           {/* Use item.exerciseType for the icon lookup */}
//           <MaterialCommunityIcons
//             name={getWorkoutIcon(item.exerciseType)}
//             size={24}
//             color="#4B6CB7"
//           />
//         </View>
//         <View style={styles.workoutTitleContainer}>
//           {/* Use item.exerciseType for the workout type text */}
//           <Text style={styles.workoutType}>{item.exerciseType}</Text>
//           {/* Display formatted date and time */}
//           <Text style={styles.workoutDate}>{formattedDate} • {formattedTime}</Text>
//         </View>
//         <Feather name="chevron-right" size={20} color="#999" />
//       </View>

//       <View style={styles.workoutStats}>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{item.duration}</Text>
//           <Text style={styles.statLabel}>min</Text>
//         </View>
//         <View style={styles.statItem}>
//           {/* Use item.caloriesBurned for calories */}
//           <Text style={styles.statValue}>{item.caloriesBurned}</Text>
//           <Text style={styles.statLabel}>cal</Text>
//         </View>
//         {/* Conditionally render distance if it exists in the item */}
//         {item.distance !== undefined && item.distance !== null && (
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>{item.distance}</Text>
//             <Text style={styles.statLabel}>km</Text>
//           </View>
//         )}
//       </View>

//       {/* Conditionally render notes if they exist in the item */}
//       {item.notes !== undefined && item.notes !== null && item.notes.length > 0 && (
//         <View style={styles.notesContainer}>
//           <Text style={styles.notesText}>"{item.notes}"</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };


const renderWorkoutItem = ({ item }) => {
  const getWorkoutIcon = (exerciseType) => {
  if (!exerciseType || typeof exerciseType !== 'string') {
    return 'run'; // Default icon if type is missing or invalid
  }
  switch (exerciseType.toLowerCase()) {
    case 'cardio':
      return 'heart-pulse';
    case 'speed skating':
      return 'skate';
    case 'running':
      return 'run';
    case 'weights':
      return 'dumbbell';
    case 'swimming':
      return 'swim';
    case 'yoga':
      return 'yoga';
    case 'cycling':
      return 'bike';
    // Add more cases for other exercise types as needed
    default:
      return 'run'; // Fallback icon
  }
};
  // Parse the date string into a Date object
  const workoutDateTime = new Date(item.date);

  // Format the date for display (e.g., "July 4, 2025")
  const formattedDate = workoutDateTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the time for display (e.g., "08:05 AM")
  const formattedTime = workoutDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  });

  return (
    <TouchableOpacity style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutIcon}>
          {/* Use item.exerciseType for the icon lookup */}
          <MaterialCommunityIcons
            name={getWorkoutIcon(item.exerciseType)}
            size={24}
            color="#4B6CB7"
          />
        </View>
        <View style={styles.workoutTitleContainer}>
          {/* Use item.exerciseType for the workout type text */}
          <Text style={styles.workoutType}>{item.exerciseType}</Text>
          {/* Display formatted date and time */}
          <Text style={styles.workoutDate}>{formattedDate} • {formattedTime}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#999" />
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.duration}</Text>
          <Text style={styles.statLabel}>min</Text>
        </View>
        <View style={styles.statItem}>
          {/* Use item.caloriesBurned for calories */}
          <Text style={styles.statValue}>{item.caloriesBurned}</Text>
          <Text style={styles.statLabel}>cal</Text>
        </View>
        {/* Removed item.distance rendering as it's not in the provided JSON */}
      </View>

      {/* Removed item.notes rendering as it's not in the provided JSON */}
    </TouchableOpacity>
  );
};


//const renderWorkoutItem = ({ item }) => {
//   // Parse the date string into a Date object for better formatting
//   const workoutDate = new Date(item.date);
//   const formattedDate = workoutDate.toLocaleDateString(); // e.g., "7/4/2025"
//   const formattedTime = workoutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "08:35 AM"

//   return (
//     <TouchableOpacity style={styles.workoutCard}>
//       <View style={styles.workoutHeader}>
//         <View style={styles.workoutIcon}>
//           <MaterialCommunityIcons
//             name={getWorkoutIcon(item.exerciseType)} // Corrected: use item.exerciseType
//             size={24}
//             color="#4B6CB7"
//           />
//         </View>
//         <View style={styles.workoutTitleContainer}>
//           <Text style={styles.workoutType}>{item.exerciseType}</Text> {/* Corrected: use item.exerciseType */}
//           <Text style={styles.workoutDate}>{formattedDate} • {formattedTime}</Text> {/* Corrected: Use parsed date/time */}
//         </View>
//         <Feather name="chevron-right" size={20} color="#999" />
//       </View>

//       <View style={styles.workoutStats}>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{item.duration}</Text>
//           <Text style={styles.statLabel}>min</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{item.caloriesBurned}</Text> {/* Corrected: use item.caloriesBurned */}
//           <Text style={styles.statLabel}>cal</Text>
//         </View>
//         {item.distance && ( // Assuming distance might exist in some future data
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>{item.distance}</Text>
//             <Text style={styles.statLabel}>km</Text>
//           </View>
//         )}
//       </View>

//       {item.notes && ( // Assuming notes might exist in your schema
//         <View style={styles.notesContainer}>
//           <Text style={styles.notesText}>"{item.notes}"</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };
  const [refreshing, setRefreshing] = useState(false);
const onRefresh = async () => {
    setRefreshing(true);
    const result = await getWorkout();
    setRefreshing(false);
    if (!result.success) {
      // Optionally handle error (e.g., show alert)
      console.log('Refresh failed:', result.error);
    }
  };

  const getWorkoutIcon = (type) => {
    if (type.includes('Skating')) return 'skate';
    if (type.includes('Yoga') || type.includes('Pilates')) return 'yoga';
    if (type.includes('Running') || type.includes('Cycling')) return 'run';
    if (type.includes('Weight') || type.includes('Bodyweight')) return 'dumbbell';
    return 'arm-flex';
  };

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
        <Text style={styles.headerTitle}>Workout History</Text>
        <TouchableOpacity onPress={handleAddWorkout}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="calendar-month" size={24} color="#4B6CB7" />
          <Text style={styles.summaryValue}>{totalExercises}</Text>
          <Text style={styles.summaryLabel}>Workouts</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#4B6CB7" />
          <Text style={styles.summaryValue}>
            {/* {workouts.reduce((sum, w) => sum + parseInt(w.duration), 0)} */}
            {totalDurantion}
          </Text>
          <Text style={styles.summaryLabel}>Minutes</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="fire" size={24} color="#4B6CB7" />
          <Text style={styles.summaryValue}>
            {totalCaloriesBurned}
            {/* {workouts.reduce((sum, w) => sum + parseInt(w.calories), 0)} */}
          </Text>
          <Text style={styles.summaryLabel}>Calories</Text>
        </View>
      </View>

      {/* Workout List */}
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image 
              source={require('../assets/88.png')} 
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No workouts recorded yet</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddWorkout}
            >
              <Text style={styles.addButtonText}>Add Your First Workout</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add Workout Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Workout</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {!selectedCategory ? (
                <View style={styles.categoryContainer}>
                  <Text style={styles.sectionTitle}>Select Category</Text>
                  {Object.keys(workoutCategories).map(category => (
                    <TouchableOpacity
                      key={category}
                      style={styles.categoryCard}
                      onPress={() => handleSelectCategory(category)}
                    >
                      <Text style={styles.categoryText}>{category}</Text>
                      <Feather name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : !selectedWorkout ? (
                <View style={styles.workoutSelection}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setSelectedCategory(null)}
                  >
                    <Feather name="chevron-left" size={20} color="#4B6CB7" />
                    <Text style={styles.backText}>{selectedCategory}</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.sectionTitle}>Select Workout</Text>
                  {workoutCategories[selectedCategory].map(workout => (
                    <TouchableOpacity
                      key={workout}
                      style={styles.workoutOption}
                      onPress={() => handleSelectWorkout(workout)}
                    >
                      <Text style={styles.workoutOptionText}>{workout}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setSelectedWorkout(null)}
                  >
                    <Feather name="chevron-left" size={20} color="#4B6CB7" />
                    <Text style={styles.backText}>{selectedWorkout}</Text>
                  </TouchableOpacity>

                  <Text style={styles.inputLabel}>Duration (minutes)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 45"
                    keyboardType="numeric"
                    value={form.duration}
                    onChangeText={(text) => setForm({ ...form, duration: text })}
                  />

                  <Text style={styles.inputLabel}>Calories burned</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 320"
                    keyboardType="numeric"
                    value={form.calories}
                    onChangeText={(text) => setForm({ ...form, calories: text })}
                  />

                  {(selectedWorkout.includes('Skating') || selectedWorkout.includes('Running') || selectedWorkout.includes('Cycling')) && (
                    <>
                      <Text style={styles.inputLabel}>Distance (km)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. 5.2"
                        keyboardType="numeric"
                        value={form.distance}
                        onChangeText={(text) => setForm({ ...form, distance: text })}
                      />
                    </>
                  )}

                  <Text style={styles.inputLabel}>Notes</Text>
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    placeholder="Any notes about your workout"
                    multiline
                    value={form.notes}
                    onChangeText={(text) => setForm({ ...form, notes: text })}
                  />
                </View>
              )}
            </ScrollView>

            {selectedWorkout && (
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSubmit}
                disabled={!form.duration || !form.calories}
              >
                <Text style={styles.saveButtonText}>Save Workout</Text>
              </TouchableOpacity>
            )}
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
  summaryContainer: {
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
  summaryCard: {
    alignItems: 'center',
    width: width / 3.5,
  },
  summaryValue: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: '1%',
  },
  summaryLabel: {
    fontSize: width * 0.035,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
    paddingBottom: '10%',
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
  },
  workoutIcon: {
    backgroundColor: 'rgba(75, 108, 183, 0.1)',
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
  },
  workoutTitleContainer: {
    flex: 1,
  },
  workoutType: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  workoutDate: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: '1%',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: '2%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#4B6CB7',
  },
  statLabel: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: '1%',
  },
  notesContainer: {
    marginTop: '2%',
    paddingTop: '2%',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesText: {
    fontSize: width * 0.035,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '10%',
  },
  emptyImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: '5%',
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#666',
    marginBottom: '5%',
  },
  addButton: {
    backgroundColor: '#4B6CB7',
    padding: '4%',
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
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
  modalScrollContent: {
    padding: '4%',
  },
  categoryContainer: {
    paddingBottom: '4%',
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
    marginBottom: '4%',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4%',
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    marginBottom: '3%',
  },
  categoryText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  workoutSelection: {
    paddingBottom: '4%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
  },
  backText: {
    fontSize: width * 0.04,
    color: '#4B6CB7',
    marginLeft: '2%',
    fontWeight: '500',
  },
  workoutOption: {
    padding: '4%',
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    marginBottom: '3%',
  },
  workoutOptionText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: '2%',
    marginTop: '4%',
  },
  input: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: '3.5%',
    fontSize: width * 0.04,
  },
  notesInput: {
    height: width * 0.2,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4B6CB7',
    padding: '4%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});

export default WorkoutHistoryScreen;