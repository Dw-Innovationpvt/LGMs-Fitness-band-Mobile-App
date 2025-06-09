import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { ProgressCircle } from 'react-native-svg-charts';

const goalTypes = [
  { key: 'time', title: 'Time Duration', colors: ['#FFA17F', '#00223E'], icon: 'clock' },
  { key: 'speed', title: 'Speed', colors: ['#89CFF0', '#005f99'], icon: 'fast-forward' },
  { key: 'calories', title: 'Calorie Burn', colors: ['#FF6B6B', '#C44D58'], icon: 'activity' },
  { key: 'cadence', title: 'Cadence', colors: ['#A3D977', '#009933'], icon: 'trending-up' },
  { key: 'distance', title: 'Distance', colors: ['#B19CD9', '#5D3FD3'], icon: 'map-pin' },
];

const SetGoalScreen = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goals, setGoals] = useState({
    time: { value: '', unit: 'minutes', note: '', completed: false },
    speed: { avg: '', max: '', unit: 'km/h', note: '', completed: false },
    calories: { value: '', unit: 'cal', note: '', completed: false },
    cadence: { value: '', unit: 'pushes/min', note: '', completed: false },
    distance: { value: '', unit: 'km', note: '', completed: false },
  });

  const handleReset = (key) => {
    const initial = {
      note: '', completed: false,
      ...(key === 'speed'
        ? { avg: '', max: '', unit: 'km/h' }
        : { value: '', unit: goals[key].unit }),
    };
    setGoals((prevGoals) => ({
      ...prevGoals,
      [key]: initial,
    }));
  };

 

  const handleInputChange = (key, field, value) => {
    setGoals({
      ...goals,
      [key]: {
        ...goals[key],
        [field]: value,
      },
    });
  };

  const filteredGoalTypes = goalTypes.filter(({ key }) => {
    if (selectedTab === 'completed') return goals[key].completed;
    if (selectedTab === 'ongoing') return !goals[key].completed && (goals[key].value || goals[key].avg || goals[key].max);
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {['all', 'ongoing', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, tab === 'all' ? styles.blueTab : tab === 'ongoing' ? styles.orangeTab : styles.greenTab, selectedTab === tab && styles.activeTab]}
          >
            <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goal Mini Cards */}
      <View style={styles.miniCardRow}>
        {goalTypes.map(({ key, icon, title }) => (
          <TouchableOpacity
            key={key}
            style={styles.miniCard}
            onPress={() => setSelectedGoal(key)}
          >
            <Icon name={icon} size={18} color="#333" />
            <Text style={styles.miniCardText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goal Full Cards */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
       {filteredGoalTypes.map(({ key, icon, title, colors }) => (
  <LinearGradient key={key} colors={colors} style={styles.fullCard}>
    <View style={styles.cardHeader}>
      <Icon name={icon} size={20} color="#fff" />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>

    <View style={styles.cardBody}>
      <View style={{ flex: 1 }}>
        {key === 'speed' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Avg Speed"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
              value={goals[key].avg}
              onChangeText={(text) => handleInputChange(key, 'avg', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Max Speed"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
              value={goals[key].max}
              onChangeText={(text) => handleInputChange(key, 'max', text)}
            />
          </>
        ) : (
          <TextInput
            style={styles.input}
            placeholder={`Enter ${title}`}
            placeholderTextColor="#ddd"
            keyboardType="numeric"
            value={goals[key].value}
            onChangeText={(text) => handleInputChange(key, 'value', text)}
          />
        )}

        <TextInput
          style={styles.note}
          placeholder="Add a note (optional)"
          placeholderTextColor="#ccc"
          value={goals[key].note}
          onChangeText={(text) => handleInputChange(key, 'note', text)}
        />
      </View>

      <View style={{ marginLeft: 12, justifyContent: 'center', alignItems: 'center' }}>
        <ProgressCircle
          style={{ height: 60, width: 60 }}
          progress={goals[key].completed ? 1 : 0.4}
          progressColor="#fff"
        />
        <Text style={{ color: '#fff', marginTop: 4 }}>
          {goals[key].completed ? '✓' : '40%'}
        </Text>
      </View>
    </View>

    <View style={styles.actionRow}>
      <TouchableOpacity onPress={() => handleReset(key)} style={styles.button}>
        <Icon name="rotate-ccw" size={16} color="#fff" />
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setGoals({ ...goals, [key]: { ...goals[key], completed: !goals[key].completed } });
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Icon name="check-circle" size={16} color="#fff" />
        <Text style={styles.buttonText}>
          {goals[key].completed ? 'Undo Complete' : 'Mark Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
))}

      </ScrollView>

      {/* Modal for Input */}
      <Modal visible={!!selectedGoal} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Goal for {selectedGoal && goalTypes.find(g => g.key === selectedGoal)?.title}</Text>

            {/* Close */}
            <TouchableOpacity onPress={() => setSelectedGoal(null)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            {/* Same Input Fields */}
            {/* You can reuse components here */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SetGoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 20,
            marginTop: 50,

  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  cardBody: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},
actionRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
button: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#888',
  padding: 8,
  borderRadius: 10,
  marginHorizontal: 4,
},
buttonText: {
  color: '#fff',
  marginLeft: 6,
  fontWeight: 'bold',
},

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  blueTab: {
    backgroundColor: '#007bff',
  },
  orangeTab: {
    backgroundColor: '#ffa500',
  },
  greenTab: {
    backgroundColor: '#28a745',
  },
  activeTab: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  miniCardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  miniCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    margin: 6,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  miniCardText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  fullCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ffffff99',
    borderRadius: 10,
    padding: 10,
    color: '#000',
    marginVertical: 6,
  },
  note: {
    backgroundColor: '#ffffffaa',
    borderRadius: 10,
    padding: 10,
    color: '#000',
    marginTop: 8,
  },
  noteText: {
    color: '#fff',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeText: {
    color: '#007bff',
  },
});

