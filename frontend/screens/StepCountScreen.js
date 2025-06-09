import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const months = ['May', 'June', 'July', 'August', 'September'];
const days = [
  { day: 'Sun', date: 10 },
  { day: 'Mon', date: 11 },
  { day: 'Tue', date: 12 },
  { day: 'Wed', date: 13 },
  { day: 'Thu', date: 14 },
];

const StepCountScreen = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedDate, setSelectedDate] = useState(12);

  const data = {
    12: { steps: 6000, distance: 4.2, calories: 210 },
    13: { steps: 7500, distance: 5.1, calories: 265 },
  };

  const weekAvg = {
    steps: 7000,
    distance: 4.9,
    calories: 245,
  };

  const metrics = [
    { label: 'Steps', key: 'steps', unit: '', avg: weekAvg.steps },
    { label: 'Distance', key: 'distance', unit: 'km', avg: weekAvg.distance },
    { label: 'Calories', key: 'calories', unit: 'kcal', avg: weekAvg.calories },
  ];

  const selectedData = data[selectedDate] || { steps: 0, distance: 0, calories: 0 };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step Count</Text>
        <View style={{ width: 24 }} />
      </View>

     
      {/* Elevated Month and Day Strip */}
      <View style={styles.elevatedBox}>
        <View style={styles.monthTab}>
          {months.map(month => (
            <TouchableOpacity key={month} onPress={() => setSelectedMonth(month)}>
              <Text
                style={[
                  styles.monthText,
                  selectedMonth === month && styles.selectedMonth,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dayStrip}>
          {days.map(item => (
            <TouchableOpacity
              key={item.date}
              onPress={() => setSelectedDate(item.date)}
              style={[
                styles.dayContainer,
                selectedDate === item.date && styles.selectedDayContainer,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDate === item.date && styles.selectedDayText,
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  selectedDate === item.date && styles.selectedDateText,
                ]}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Metrics */}
      <FlatList
        data={metrics}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.box, styles.card]}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{selectedData[item.key]} {item.unit}</Text>
            </View>
            <View style={[styles.box, styles.card]}>
              <Text style={styles.label}>{item.label} (Avg) this week</Text>
              <Text style={styles.value}>{item.avg} {item.unit}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default StepCountScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  elevatedBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    // Android
    elevation: 5,
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  monthTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  monthText: {
    fontSize: 14,
    color: '#666',
  },
  selectedMonth: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#000',
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedDayContainer: {
    backgroundColor: '#FF4D96',
    borderRadius: 24,
  },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  selectedDateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  box: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    borderRadius: 10,
  },
  card: {
    // Android
    elevation: 4,
    // iOS
     shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
