import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, TextInput, Modal
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

 const HomeScreen = ({ navigation }) => {
  const userName = 'Charan';

  const [modalVisible, setModalVisible] = useState(null);
  const [meals, setMeals] = useState({
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
  });

  const [waterIntake, setWaterIntake] = useState(0); // in ml

  const handleSaveMeal = () => {
    console.log('Meals Saved:', meals);
    setModalVisible(null);
  };

  const handleAddWater = () => {
    setWaterIntake(prev => prev + 400);
  };

  return (
    <LinearGradient colors={['#ffffff', '#e3e3e3']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome, {userName}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Feather name="user" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Pair Device Card */}
     <TouchableOpacity style={[styles.card, styles.rowCard]}>
  <Text style={styles.cardTitle}>Pair with Device</Text>
  <Feather name="bluetooth" size={28} color="#007AFF" />
</TouchableOpacity>


       {/* Bubble Row (excluding Water) */}
<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bubbleRow}>
  <TouchableOpacity style={styles.bubbleCard} onPress={() => setModalVisible('meal')}>
    <MaterialCommunityIcons name="food" size={36} color="#000" />
    <Text style={styles.bubbleLabel}>Add Meal</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.bubbleCard} onPress={() => navigation.navigate('SetGoal')}>
    <MaterialCommunityIcons name="target" size={36} color="#000" />
    <Text style={styles.bubbleLabel}>Set Goal</Text>
  </TouchableOpacity>
</ScrollView>

        {/* Water Card */}

<TouchableOpacity
  style={[styles.waterCard]}
  onPress={() => navigation.navigate('WaterIntake')}>
  <View style={styles.waterCardContent}>
    <View>
      <View style={styles.intakeRow}>
      <MaterialCommunityIcons name="cup-water" size={24} color="#00BFFF" />
        <Text style={styles.intakeText}>
          <Text style={styles.intakeBold}>{waterIntake}</Text> /2,000 ml
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddWater}>
        <Text style={styles.addButtonText}>+ 250 ml</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.glassContainer}>
      <View style={styles.glassOutline}>
        <View style={[
          styles.waterLevel,
          { height: `${(waterIntake / 2000) * 100}%` }
        ]} />
      </View>
    </View>
  </View>
</TouchableOpacity>


        {/* Skating Tracking */}
        <TouchableOpacity 
       style={[styles.card, ]} onPress={() => navigation.navigate('SkatingTracking')}>
          <Text style={styles.cardTitle}>Skating Tracking</Text>
          <View style={styles.subCardRow}>
            <View style={styles.subCard}>
              <Text style={styles.subCardValue}>10.2</Text>
              <Feather name="wind" size={24} color="black" />
              <Text style={styles.subCardLabel}>Avg Speed</Text>
            </View>
            <View style={styles.subCard}>
              <Text style={styles.subCardValue}>3,800</Text>
              <Feather name="repeat" size={24} color="black" />
              <Text style={styles.subCardLabel}>Strides</Text>
            </View>
            <View style={styles.subCard}>
              <Text style={styles.subCardValue}>89</Text>
              <Feather name="zap" size={24} color="black" />
              <Text style={styles.subCardLabel}>Stride Rate</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Step Count */}
        <TouchableOpacity 
       style={[styles.card, ]}         onPress={() => navigation.navigate('StepCount')}>
          <Text style={styles.cardTitle}>Step Count</Text>
          <View style={styles.subCardRow}>
            <View style={styles.subCard}>
              <Text style={styles.subCardValue}>3,205</Text>
              <Feather name="activity" size={24} color="black" />
              <Text style={styles.subCardLabel}>Steps</Text>
            </View>
            <View style={styles.subCard}>
              <Text style={styles.subCardValue}>1,024</Text>
              <Feather name="repeat" size={24} color="black" />
              <Text style={styles.subCardLabel}>Strides</Text>
            </View>
            <View style={styles.subCard}>
              <Text style={styles.subCardValue}>145</Text>
              <Feather name="fire" size={24} color="black" />
              <Text style={styles.subCardLabel}>Calories</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Workout History */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WorkoutHistory')}>
          <Feather name="bar-chart-2" size={28} color="#000" />
          <Text style={styles.cardTitle}>Workout History</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal - Add Meal */}
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
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default HomeScreen;

// styles remain unchanged

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  
  waterText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  tapToAdd: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
    color: '#000',
  },
  subCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  },
  subCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  subCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  subCardLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  barGraphImage: {
    width: '100%',
    height: 150,
    marginTop: 10,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
bubbleCard: {
  backgroundColor: '#fff', // You can customize this per card below if needed
  paddingVertical: 20,
   borderRadius: 25,
  marginRight: 12,
  marginHorizontal: 40,
  alignItems: 'center',
  justifyContent: 'center',
  width: 120, // Increased width
  height: 120, // Increased height
   shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
},
 
 
 

 waterCard: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 20,
  marginVertical: 10,
   shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#bbb',
},

waterCardContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

intakeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

iconCircle: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#000',
  marginRight: 10,
},

intakeText: {
  color: '#000',
  fontSize: 16,
  paddingLeft: 10,
},

intakeBold: {
  color: '#000',
  fontWeight: 'bold',
  fontSize: 18,
},

addButton: {
  backgroundColor: '#444',
  borderRadius: 20,
  paddingVertical: 6,
  paddingHorizontal: 16,
  alignSelf: 'flex-start',
},

addButtonText: {
  color: '#fff',
  fontSize: 16,
},

glassContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},

glassOutline: {
  width: 40,
  height: 80,
  borderWidth: 2,
  borderColor: '#444',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  overflow: 'hidden',
  backgroundColor: '#fff',
  justifyContent: 'flex-end',
},

waterLevel: {
  backgroundColor: '#00BFFF',
  width: '100%',
}
,

  rowCard: {
    backgroundColor: '#fff',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 40,
  alignItems: 'center',
},

  bubbleLabel: {
    color: '#000',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
