
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import useWaterStore from '../store/waterStore';
import { useCaloriesStore } from '../store/caloriesStore';

const { width, height } = Dimensions.get('window');

const GoalSettingScreen = ({ navigation }) => {
  const {
    totalCaloriesEaten,
    totalCaloriesBurned,
    mealTarget,
    mealTargetMet,
    mealFlag,
    fetchCaloriesEaten,
    fetchCaloriesBurned,
    fetchMealTargetStatus,
    fetchBurnTarget,
    burnTarget, 
    setBurnTarget,
    stepGoal, 
    fetchStepGoal, 
    setStepGoal,
    setMealTarget // Add this function to your caloriesStore
  } = useCaloriesStore();

  const {
    target,
    loading: waterLoading,
    error: waterError,
    fetchTarget,
    updateTarget,
  } = useWaterStore();

  const [goals, setGoals] = useState({
    water: target || 2000,
    burn: burnTarget || 500,
    eat: mealTarget || 2000,
    steps: stepGoal || 10000
  });
  
  const [editMode, setEditMode] = useState({
    water: false,
    burn: false,
    eat: false,
    steps: false
  });
  
  const [tempValues, setTempValues] = useState({
    water: '',
    burn: '',
    eat: '',
    steps: ''
  });

  const [saving, setSaving] = useState({
    water: false,
    burn: false,
    eat: false,
    steps: false
  });

  useEffect(() => {
    const loadPreviousGoals = async () => {
      try {
        await fetchTarget();
        await fetchBurnTarget();
        await fetchStepGoal();
        await fetchMealTargetStatus();
        
        setGoals({
          water: target || 2000,
          burn: burnTarget || 500,
          eat: mealTarget || 2000,
          steps: stepGoal || 10000
        });
        
        setTempValues({
          water: (target || 0).toString(),
          burn: (burnTarget || 0).toString(),
          eat: (mealTarget || 0).toString(),
          steps: (stepGoal || 0).toString()
        });
      } catch (error) {
        console.log('Error loading previous goals:', error);
        Alert.alert('Error', 'Failed to load previous goals');
      }
    };
    
    loadPreviousGoals();
  }, [target, burnTarget, mealTarget, stepGoal]);

  useEffect(() => {
    if (waterError) {
      Alert.alert('Water Goal Error', waterError);
    }
  }, [waterError]);

  const toggleEditMode = (goalType) => {
    setEditMode(prev => ({
      ...prev,
      [goalType]: !prev[goalType]
    }));
    
    if (!editMode[goalType]) {
      setTempValues(prev => ({
        ...prev,
        [goalType]: goals[goalType].toString()
      }));
    }
  };

  const handleSaveGoal = async (goalType) => {
    const value = parseInt(tempValues[goalType]);
    
    if (isNaN(value) || value <= 0) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    setSaving(prev => ({ ...prev, [goalType]: true }));

    try {
      let result;

      switch (goalType) {
        case 'water':
          result = await updateTarget(value);
          break;
        case 'burn':
          result = await setBurnTarget(value);
          break;
        case 'eat':
          // You'll need to add setMealTarget function to your caloriesStore
          result = await setMealTarget(value);
          break;
        case 'steps':
          result = await setStepGoal(value);
          break;
        default:
          result = { success: false, error: 'Unknown goal type' };
      }

      if (result.success) {
        setGoals(prev => ({ ...prev, [goalType]: value }));
        setEditMode(prev => ({ ...prev, [goalType]: false }));
        Alert.alert('Success', `${getGoalTitle(goalType)} updated successfully!`);
      } else {
        Alert.alert('Error', result.error || 'Failed to update goal');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal');
    } finally {
      setSaving(prev => ({ ...prev, [goalType]: false }));
    }
  };

  const handleCancelEdit = (goalType) => {
    setEditMode(prev => ({
      ...prev,
      [goalType]: false
    }));
    
    setTempValues(prev => ({
      ...prev,
      [goalType]: goals[goalType].toString()
    }));
  };

  const handleTempValueChange = (goalType, value) => {
    setTempValues(prev => ({
      ...prev,
      [goalType]: value
    }));
  };

  const getGoalUnit = (goalType) => {
    switch (goalType) {
      case 'water': return 'ml';
      case 'burn': return 'cal';
      case 'eat': return 'cal';
      case 'steps': return 'steps';
      default: return '';
    }
  };

  const getGoalHint = (goalType) => {
    switch (goalType) {
      case 'water': return 'Recommended: 2000-3000 ml per day';
      case 'burn': return 'Based on your activity level';
      case 'eat': return 'Daily calorie intake target';
      case 'steps': return 'Recommended: 8000-10000 steps per day';
      default: return '';
    }
  };

  const getGoalTitle = (goalType) => {
    switch (goalType) {
      case 'water': return 'Water Intake';
      case 'burn': return 'Calories to Burn';
      case 'eat': return 'Calories to Eat';
      case 'steps': return 'Step Count';
      default: return '';
    }
  };

  const GoalCard = ({ goalType }) => (
    <View style={[styles.card, styles.cardElevated]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{getGoalTitle(goalType)}</Text>
        </View>
        {!editMode[goalType] ? (
          <TouchableOpacity 
            onPress={() => toggleEditMode(goalType)}
            style={styles.editButton}
            disabled={saving[goalType]}
          >
            <MaterialIcons 
              name="edit" 
              size={20} 
              color={saving[goalType] ? '#CCC' : '#4B6CB7'} 
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity 
              onPress={() => handleSaveGoal(goalType)}
              style={styles.saveIconButton}
              disabled={saving[goalType]}
            >
              <MaterialIcons 
                name="check" 
                size={20} 
                color={saving[goalType] ? '#CCC' : '#4CAF50'} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleCancelEdit(goalType)}
              style={styles.cancelIconButton}
              disabled={saving[goalType]}
            >
              <MaterialIcons name="close" size={20} color={saving[goalType] ? '#CCC' : '#F44336'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.inputRow}>
        {editMode[goalType] ? (
          <TextInput
            style={styles.input}
            placeholder={`e.g., ${goalType === 'steps' ? '10000' : goalType === 'water' ? '2000' : '500'}`}
            keyboardType="numeric"
            value={tempValues[goalType]}
            onChangeText={(text) => handleTempValueChange(goalType, text)}
            autoFocus={true}
            editable={!saving[goalType]}
          />
        ) : (
          <Text style={styles.goalValueText}>
            {saving[goalType] ? 'Saving...' : goals[goalType]}
          </Text>
        )}
        <Text style={styles.unitText}>{getGoalUnit(goalType)}</Text>
      </View>
      
      <Text style={styles.hintText}>{getGoalHint(goalType)}</Text>

      {saving[goalType] && (
        <Text style={styles.loadingText}>Saving...</Text>
      )}
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#1A2980', '#26D0CE']}
        style={styles.headerGradient}
      >
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.greetingText}>Set Your Goals</Text>
            <Text style={styles.headerText}>Track your progress</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIcon}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontSize: 20 }}>×</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <GoalCard goalType="water" />
        <GoalCard goalType="burn" />
        <GoalCard goalType="eat" />
        <GoalCard goalType="steps" />
        <View style={{ height: 170 }} />
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 40 : 40,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: '#F5F7FB',
  },
  headerGradient: {
    marginTop: Platform.OS === 'ios' ? -60 : -10,
    paddingHorizontal: '6%',
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
    paddingBottom: height * 0.02,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
    shadowRadius: Platform.OS === 'ios' ? 20 : 0,
    elevation: Platform.OS === 'android' ? 10 : 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8%',
  },
  greetingText: {
    fontSize: width * 0.045,
    marginRight: '2%',
    color: 'rgba(255,255,255,0.9)',
  },
  headerText: {
    fontSize: width * 0.055,
    color: '#fff',
    marginTop: '1%',
  },
  profileIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: '4%',
    paddingBottom: '8%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
    overflow: 'hidden',
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: width * 0.045,
    color: '#2E3A59',
    marginLeft: '2%',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
  },
  editActions: {
    flexDirection: 'row',
  },
  saveIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    marginRight: 8,
  },
  cancelIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#333',
  },
  goalValueText: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#2E3A59',
    fontWeight: '500',
    paddingVertical: 12,
  },
  unitText: {
    fontSize: width * 0.04,
    color: '#5A6A8C',
    fontWeight: '500',
  },
  hintText: {
    fontSize: width * 0.035,
    color: '#9AA5B9',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
    fontStyle: 'italic',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#4B6CB7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9AA5B9',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});

export default GoalSettingScreen;
