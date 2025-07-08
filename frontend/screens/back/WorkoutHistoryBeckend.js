import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
// import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';



const WorkoutHistoryBeckend = () => {
  const WorkoutItem = ({ item }) => {
  const date = new Date(item.date).toLocaleString();
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.exerciseType}>{item.exerciseType}</Text>
      <Text>Duration: {item.duration} minutes</Text>
      <Text>Calories Burned: {item.caloriesBurned}</Text>
      <Text>Date: {date}</Text>
    </View>
  );
};
  const WorkoutScreen = () => {
  const { workoutData, getWorkout } = useAuthStore();

  // useEffect(() => {
    // Fetch workout data on component mount
    // getWorkout();
  // }, [getWorkout]);
  const handleRefresh = () => {
    // Refresh workout data
    getWorkout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Workouts</Text>
      <FlatList
        data={workoutData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <WorkoutItem item={item} />}
        ListEmptyComponent={<Text>No workouts found.</Text>}
      />
    </View>
  );
};
        // postWorkout
        const { loading, error, postWorkout, user, getWorkout, workoutData, getWorkoutCount, totalCaloriesBurned, totalDurantion, totalExercises } = useAuthStore();
  useEffect(() => {
            getWorkoutCount();
            // getWorkout();
        }, []);
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
            duration: 10, // in minutes
            type: 'Cardio',
            caloriesBurned: 100,
            exerciseType: 'warm up',
            distance: 5, // in kilometers
        };
        const responseWorkout = await postWorkout(workoutData);
        console.log('Workout posted:', responseWorkout);

    }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>WorkoutHistoryBeckend</Text>
        <Text>Loading: {loading ? 'Yes' : 'No'}</Text>
        <Text>Error: {error ? error : 'No errors'}</Text>
        <Text onPress={handlePostWorkout} style={{ color: 'blue', textDecorationLine: 'underline' }}>
        Post Workout</Text>
        <Text onPress={checkUser} style={{ color: 'blue', textDecorationLine: 'underline' }}>
        Check User</Text>
        <Text onPress={getWorkoutCountData} style={{ color: 'blue', textDecorationLine: 'underline' }}>
        Get Workout Count</Text>
        <Text>Workout Count: {getWorkoutCount.data}</Text>
        <Text>CaloriesBurned{totalCaloriesBurned}</Text>
        <Text>Total Duration: {totalDurantion} minutes</Text>
        <Text>Total Exercises: {totalExercises}</Text>

        {/* <Text>Workout Data: {JSON.stringify(workoutData)}</Text>
        <Text>Workout Data Length: {workoutData.length}</Text> */}

        <WorkoutScreen />
        {/* Add more UI elements to display workout history if needed */}
    </View>
  )
}

// Main WorkoutScreen component


// Basic styles (minimal as per request)




export default WorkoutHistoryBeckend

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  exerciseType: {
    fontSize: 18,
    fontWeight: 'bold',
  },

})