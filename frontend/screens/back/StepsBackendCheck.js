import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import useStepsStore from './useStepsStore';
import { useAuthStore } from '../../store/authStore.js';
const StepsScreen = () => {
  const { steps, loading, error, getStepsTodays, clearSteps, stepsTotalCount, stepsCaloriesBurned, stepsActiveMinutes, stepsKilometers } = useAuthStore();

  const handelGetSteps = () => {
    const ss = getStepsTodays();
    // console.log('Steps fetched:', ss);
  };
  // Fetch today's steps on component mount
  useEffect(() => {
    getStepsTodays(); // Today's date: June 25, 2025
    console.log('11 stepsbackend check');
    // console.log(steps);
  }, []);

  // Render a single step entry
  const renderStepEntry = ({ item }) => (
    <View style={styles.stepCard}>
      <Text style={styles.dateText}>
        {new Date(item.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <Text style={styles.stepText}>Steps: {item.stepCount.toLocaleString()}</Text>
      <Text style={styles.stepText}>Distance: {item.kilometers} km</Text>
      <Text style={styles.stepText}>Calories Burned: {item.caloriesBurned} kcal</Text>
      <Text style={styles.stepText}>Active Minutes: {item.activeMinutes} min</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handelGetSteps()}
        >
          <Text style={styles.buttonText}>Today</Text>
        </TouchableOpacity>

      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
        {stepsTotalCount > 0 && (
            <Text style={styles.dateText}>
            Total Steps Today: {stepsTotalCount.toLocaleString()}
            </Text>
        )}
        {stepsCaloriesBurned > 0 && (
            <Text style={styles.stepText}>
            Total Calories Burned Today: {stepsCaloriesBurned} kcal
            </Text>
        )}
        {stepsActiveMinutes > 0 && (
            <Text style={styles.stepText}>
            Total Active Minutes Today: {stepsActiveMinutes} min  
            </Text>
        )}
        {stepsKilometers > 0 && (
            <Text style={styles.stepText}>
            Total Distance Today: {stepsKilometers} km
            </Text>
        )}
        
      {/* <FlatList
        data={steps}
        renderItem={renderStepEntry}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No steps found</Text>}
        contentContainerStyle={styles.listContent}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stepCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default StepsScreen;
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const StepsBackendCheck = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>StepsBackendCheck</Text>
//     </View>
//   )
// }

// export default StepsBackendCheck

// const styles = StyleSheet.create({})