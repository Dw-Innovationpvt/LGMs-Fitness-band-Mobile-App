import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, ScrollView,
  TouchableOpacity, FlatList, TextInput
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const DailyActivitiesScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(null);
  const [meals, setMeals] = useState({ breakfast: '', lunch: '', snacks: '', dinner: '' });

  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState({
    meals: [
      { id: '1', type: 'Breakfast', items: 'Oatmeal, Banana', calories: 350 },
      { id: '2', type: 'Lunch', items: 'Grilled Chicken, Rice, Salad', calories: 550 },
      { id: '3', type: 'Snack', items: 'Protein Shake', calories: 200 },
    ],
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
  });

  const handleSaveMeal = () => {
    const newMeals = [];
    if (meals.breakfast)
      newMeals.push({ id: Date.now() + '1', type: 'Breakfast', items: meals.breakfast, calories: 300 });
    if (meals.lunch)
      newMeals.push({ id: Date.now() + '2', type: 'Lunch', items: meals.lunch, calories: 500 });
    if (meals.snacks)
      newMeals.push({ id: Date.now() + '3', type: 'Snack', items: meals.snacks, calories: 200 });
    if (meals.dinner)
      newMeals.push({ id: Date.now() + '4', type: 'Dinner', items: meals.dinner, calories: 400 });

    setDailyData(prev => ({
      ...prev,
      meals: [...prev.meals, ...newMeals],
    }));
    setMeals({ breakfast: '', lunch: '', snacks: '', dinner: '' });
    setModalVisible(null);
  };

  const totalCalories = dailyData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalWater = dailyData.waterIntake.reduce((sum, entry) => sum + parseInt(entry.amount), 0);
  const completedGoals = dailyData.goals.filter(goal => goal.completed).length;

  return (
    <LinearGradient colors={['#ffffff', '#e3e3e3']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Activities</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="food" size={24} color="#4CAF50" />
            <Text style={styles.summaryValue}>{totalCalories}</Text>
            <Text style={styles.summaryLabel}>Calories</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="cup-water" size={24} color="#2196F3" />
            <Text style={styles.summaryValue}>{totalWater}ml</Text>
            <Text style={styles.summaryLabel}>Water</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="target" size={24} color="#FF9800" />
            <Text style={styles.summaryValue}>{completedGoals}/{dailyData.goals.length}</Text>
            <Text style={styles.summaryLabel}>Goals</Text>
          </View>
        </View>

        {/* Meals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity onPress={() => setModalVisible('meal')}>
              <Feather name="plus" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {dailyData.meals.length > 0 ? (
            <FlatList
              data={dailyData.meals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.type}</Text>
                    <Text style={styles.itemCalories}>{item.calories} cal</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{item.items}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No meals recorded today</Text>
          )}
        </View>

        {/* Water Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Water Intake</Text>
          </View>
          {dailyData.waterIntake.length > 0 ? (
            <FlatList
              data={dailyData.waterIntake}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.amount}</Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No water intake recorded today</Text>
          )}
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Goals</Text>
          </View>
          {dailyData.goals.length > 0 ? (
            <FlatList
              data={dailyData.goals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.itemCard, styles.goalCard]}>
                  <MaterialCommunityIcons 
                    name={item.completed ? "check-circle" : "checkbox-blank-circle-outline"} 
                    size={20} 
                    color={item.completed ? "#4CAF50" : "#ccc"} 
                  />
                  <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
                    {item.title}
                  </Text>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No goals set for today</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.workoutButton}
          onPress={() => navigation.navigate('WorkoutHistory')}
        >
          <MaterialCommunityIcons name="dumbbell" size={24} color="#fff" />
          <Text style={styles.workoutButtonText}>Workout History</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible === 'meal'} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Meals</Text>

            <TextInput
              placeholder="Breakfast"
              style={styles.input}
              value={meals.breakfast}
              onChangeText={(text) => setMeals({ ...meals, breakfast: text })}
            />
            <TextInput
              placeholder="Lunch"
              style={styles.input}
              value={meals.lunch}
              onChangeText={(text) => setMeals({ ...meals, lunch: text })}
            />
            <TextInput
              placeholder="Snacks"
              style={styles.input}
              value={meals.snacks}
              onChangeText={(text) => setMeals({ ...meals, snacks: text })}
            />
            <TextInput
              placeholder="Dinner"
              style={styles.input}
              value={meals.dinner}
              onChangeText={(text) => setMeals({ ...meals, dinner: text })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal}>
              <Text style={styles.saveText}>Save Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(null)}>
              <Text style={{ textAlign: 'center', marginTop: 10, color: '#007AFF' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
        marginTop: 50,

    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#000',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  itemCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemTime: {
    fontSize: 14,
    color: '#2196F3',
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 10,
  },
   modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  workoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  workoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default DailyActivitiesScreen;