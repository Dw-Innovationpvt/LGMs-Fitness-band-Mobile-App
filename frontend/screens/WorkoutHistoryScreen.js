import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dummyWorkoutData = [
  {
    id: '1',
    date: '2025-06-01',
    time: '6:30 AM',
    type: 'Running',
    duration: '45 mins',
    calories: '275 kcal',
    distance: '5.2 km',
    steps: '6000 steps',
    pace: '8:00 min/km',
    notes: 'Felt great today!',
  },
  {
    id: '2',
    date: '2025-05-30',
    time: '7:00 AM',
    type: 'Cycling',
    duration: '30 mins',
    calories: '200 kcal',
    distance: '10.5 km',
    steps: '—',
    pace: '21 km/h',
    notes: 'Good weather for a ride.',
  },
  {
    id: '3',
    date: '2025-05-29',
    time: '6:45 AM',
    type: 'Strength Training',
    duration: '40 mins',
    calories: '180 kcal',
    distance: '—',
    steps: '2500 steps',
    pace: '—',
    notes: 'Focused on core today.',
  }
];

const WorkoutHistoryScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date} at {item.time}</Text>
      <Text style={styles.text}>Type: {item.type}</Text>
      <Text style={styles.text}>Duration: {item.duration}</Text>
      <Text style={styles.text}>Calories: {item.calories}</Text>
      <Text style={styles.text}>Distance: {item.distance}</Text>
      <Text style={styles.text}>Steps: {item.steps}</Text>
      <Text style={styles.text}>Pace: {item.pace}</Text>
      <Text style={styles.notes}>"{item.notes}"</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      <FlatList
        data={dummyWorkoutData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
  notes: {
    fontStyle: 'italic',
    marginTop: 8,
    color: '#555',
  },
});

export default WorkoutHistoryScreen;