// Enhanced Water Intake Tracker with Circular Progress and Averages
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Circle } from 'react-native-progress';

const WaterIntakeScreen = ({ navigation }) => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const addWater = (amount = null) => {
    const parsedAmount = amount || parseInt(inputValue);
    if (parsedAmount > 0) {
      const timestamp = new Date();
      setWaterIntake(prev => prev + parsedAmount);
      setHistory(prev => [...prev, { amount: parsedAmount, timestamp }]);
      setInputValue('');
    }
  };

  const updateGoal = () => {
    const parsedGoal = parseInt(goalInput);
    if (parsedGoal > 0) {
      setDailyGoal(parsedGoal);
      setGoalInput('');
      setGoalModalVisible(false);
    }
  };

  const getAverage = (days) => {
    const now = new Date();
    const filtered = history.filter(entry => {
      const diff = (now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24);
      return diff <= days;
    });
    const daily = {};
    filtered.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      daily[date] = (daily[date] || 0) + entry.amount;
    });
    const total = Object.values(daily).reduce((a, b) => a + b, 0);
    return total / days;
  };

  const progress = Math.min(waterIntake / dailyGoal, 1);

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Intake</Text>
        <TouchableOpacity onPress={() => setGoalModalVisible(true)}>
          <Feather name="settings" size={28} color="#000" />
        </TouchableOpacity>
      </View>

    <View style={styles.progressSection}>
  <Circle
    size={150}
    progress={progress}
    showsText={true}
    formatText={() => `${Math.round(progress * 100)}%`}
    color="#007AFF"
    thickness={10}
    unfilledColor="#E0E0E0"
    borderWidth={0}
  />
  <Text style={styles.progressLabel}>{waterIntake}ml / {dailyGoal}ml</Text>
</View>



      {/* Averages */}
      <View style={styles.averagesContainer}>
        <Text style={styles.averageText}>Daily Avg: {getAverage(1).toFixed(0)}ml</Text>
        <Text style={styles.averageText}>Weekly Avg: {getAverage(7).toFixed(0)}ml</Text>
        <Text style={styles.averageText}>Monthly Avg: {getAverage(30).toFixed(0)}ml</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount (ml)"
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <View style={styles.quickButtonsContainer}>
          {[250, 500, 1000].map(val => (
            <TouchableOpacity key={val} style={styles.quickButton} onPress={() => addWater(val)}>
              <Text style={styles.quickButtonText}>{val}ml</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => addWater()}>
          <MaterialCommunityIcons name="cup-water" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Water</Text>
        </TouchableOpacity>
      </View>

      {/* History */}
      <FlatList
        data={history.slice().reverse()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>{item.amount} ml at {new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Goal Modal */}
      <Modal
        visible={goalModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Daily Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter goal (ml)"
              keyboardType="numeric"
              value={goalInput}
              onChangeText={setGoalInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={updateGoal}>
              <Text style={styles.addButtonText}>Save Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F9FF'  },
  header: {         marginTop: 50,
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#007AFF' },
  progressSection: { alignItems: 'center', marginBottom: 20 },
  progressLabel: { marginTop: 10, fontSize: 18, fontWeight: '500', color: '#000' },
  averagesContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  averageText: { fontSize: 14, color: '#333', backgroundColor: '#e0f7ff', padding: 8, borderRadius: 8 },
  inputContainer: { alignItems: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 10, width: '80%', marginBottom: 10 },
  addButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  addButtonText: { color: '#fff', fontWeight: '600', marginLeft: 5 },
  quickButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  quickButton: { backgroundColor: '#D0E8FF', padding: 10, borderRadius: 10, marginHorizontal: 5 },
  quickButtonText: { fontWeight: '500', color: '#007AFF' },
  historyItem: { padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 10, marginBottom: 5 },
  cardBody: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
});

export default WaterIntakeScreen;