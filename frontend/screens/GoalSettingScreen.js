import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import useWaterStore from '../store/waterStore';
import { useCaloriesStore } from '../store/caloriesStore';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const GoalSettingScreen = ({ navigation }) => {
  const {
    burnTarget, 
    setBurnTarget,
    stepGoal, 
    fetchStepGoal, 
    setStepGoal,
    mealTarget,
    setMealTarget,
    fetchBurnTarget,
    fetchMealTargetStatus,
  } = useCaloriesStore();

  const {
    target,
    error: waterError,
    fetchTarget,
    updateTarget,
  } = useWaterStore();

  const [goals, setGoals] = useState({
    water: 2000,
    burn: 500,
    eat: 2000,
    steps: 10000
  });
  
  const [editingGoal, setEditingGoal] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [saving, setSaving] = useState(false);
  
  const inputRefs = {
    water: useRef(null),
    burn: useRef(null),
    eat: useRef(null),
    steps: useRef(null)
  };

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
      } catch (error) {
        console.log('Error loading previous goals:', error);
        Alert.alert('Error', 'Failed to load previous goals');
      }
    };
    
    loadPreviousGoals();
  }, []);

  useEffect(() => {
    if (waterError) {
      Alert.alert('Water Goal Error', waterError);
    }
  }, [waterError]);

  // Update local goals when store values change
  useEffect(() => {
    setGoals(prev => ({
      ...prev,
      water: target || prev.water,
      burn: burnTarget || prev.burn,
      eat: mealTarget || prev.eat,
      steps: stepGoal || prev.steps
    }));
  }, [target, burnTarget, mealTarget, stepGoal]);

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

  const GoalCard = ({ goalType, goalValue, updateGoal }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(goalValue.toString());
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    const startEditing = () => {
      setIsEditing(true);
      setTempValue(goalValue.toString());

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    const handleSaveGoal = async () => {
      const value = parseInt(tempValue);

      if (isNaN(value) || value <= 0) {
        Alert.alert('Error', 'Please enter a valid number');
        return;
      }

      setSaving(true);

      try {
        const result = await updateGoal(value);

        if (result.success) {
          Alert.alert('Success', `${getGoalTitle(goalType)} updated successfully!`);
          
          // Update the local state immediately
          setGoals(prev => ({ ...prev, [goalType]: value }));
          
          setIsEditing(false);
        } else {
          Alert.alert('Error', result.error || 'Failed to update goal');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update goal');
      } finally {
        setSaving(false);
      }
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      Keyboard.dismiss();
    };

    return (
      <View style={[styles.card, styles.cardElevated]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{getGoalTitle(goalType)}</Text>
          </View>
          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={handleSaveGoal}
                style={styles.saveIconButton}
                disabled={saving}
              >
                <MaterialIcons
                  name="check"
                  size={20}
                  color={saving ? '#CCC' : '#4CAF50'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={styles.cancelIconButton}
                disabled={saving}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color={saving ? '#CCC' : '#F44336'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => !isEditing && startEditing()}
          style={styles.inputRow}
          activeOpacity={0.7}
        >
          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={`e.g., ${goalType === 'steps' ? '10000' : goalType === 'water' ? '2000' : '500'}`}
              keyboardType="numeric"
              value={tempValue}
              onChangeText={setTempValue}
              editable={!saving}
              returnKeyType="done"
            />
          ) : (
            <View style={styles.valueContainer}>
              <Text style={styles.goalValueText}>
                {goalValue}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="#5A6A8C"
                style={styles.rightIcon}
              />
            </View>
          )}
          <Text style={styles.unitText}>{getGoalUnit(goalType)}</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>{getGoalHint(goalType)}</Text>

        {saving && isEditing && (
          <Text style={styles.loadingText}>Saving...</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#1A2980', '#26D0CE']}
        style={styles.headerGradient}
      >
        <View style={styles.headerSection}>
          <TouchableOpacity 
            style={styles.profileIcon}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Set Your Goals</Text>
          </View>
          <View style={styles.profileIconPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <GoalCard
          goalType="water"
          goalValue={goals.water}
          updateGoal={updateTarget}
        />
        <GoalCard
          goalType="burn"
          goalValue={goals.burn}
          updateGoal={setBurnTarget}
        />
        <GoalCard
          goalType="eat"
          goalValue={goals.eat}
          updateGoal={setMealTarget}
        />
        <GoalCard
          goalType="steps"
          goalValue={goals.steps}
          updateGoal={setStepGoal}
        />
        <View style={{ height: 170 }} />
      </ScrollView>
    </View>
  );
};






// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Dimensions,
//   Alert,
//   Keyboard,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialIcons } from '@expo/vector-icons';
// import useWaterStore from '../store/waterStore';
// import { useCaloriesStore } from '../store/caloriesStore';
// import { Feather } from '@expo/vector-icons';

// const { width, height } = Dimensions.get('window');

// const GoalSettingScreen = ({ navigation }) => {
//   const {
//     burnTarget, 
//     setBurnTarget,
//     stepGoal, 
//     fetchStepGoal, 
//     setStepGoal,
//     mealTarget,
//     setMealTarget,
//     fetchBurnTarget,
//     fetchMealTargetStatus,
//   } = useCaloriesStore();

//   const {
//     target,
//     error: waterError,
//     fetchTarget,
//     updateTarget,
//   } = useWaterStore();

//   const [goals, setGoals] = useState({
//     water: 2000,
//     burn: 500,
//     eat: 2000,
//     steps: 10000
//   });
  
//   const [editingGoal, setEditingGoal] = useState(null);
//   const [tempValue, setTempValue] = useState('');
//   const [saving, setSaving] = useState(false);
  
//   const inputRefs = {
//     water: useRef(null),
//     burn: useRef(null),
//     eat: useRef(null),
//     steps: useRef(null)
//   };

//   useEffect(() => {
//     const loadPreviousGoals = async () => {
//       try {
//         await fetchTarget();
//         await fetchBurnTarget();
//         await fetchStepGoal();
//         await fetchMealTargetStatus();
        
//         setGoals({
//           water: target || 2000,
//           burn: burnTarget || 500,
//           eat: mealTarget || 2000,
//           steps: stepGoal || 10000
//         });
//       } catch (error) {
//         console.log('Error loading previous goals:', error);
//         Alert.alert('Error', 'Failed to load previous goals');
//       }
//     };
    
//     loadPreviousGoals();
//   }, []);

//   useEffect(() => {
//     if (waterError) {
//       Alert.alert('Water Goal Error', waterError);
//     }
//   }, [waterError]);

//   const startEditing = (goalType) => {
//     setEditingGoal(goalType);
//     setTempValue(goals[goalType].toString());
    
//     // Focus the input after a small delay to ensure it's rendered
//     setTimeout(() => {
//       if (inputRefs[goalType].current) {
//         inputRefs[goalType].current.focus();
//       }
//     }, 100);
//   };

// const handleSaveGoal = async () => {
//   if (!editingGoal) return;
  
//   const value = parseInt(tempValue);
  
//   if (isNaN(value) || value <= 0) {
//     Alert.alert('Error', 'Please enter a valid number');
//     return;
//   }

//   setSaving(true);

//   try {
//     let result;

//     switch (editingGoal) {
//       case 'water':
//         result = await updateTarget(value);
//         break;
//       case 'burn':
//         result = await setBurnTarget(value);
//         break;
//       case 'eat':
//         result = await setMealTarget(value);
//         break;
//       case 'steps':
//         result = await setStepGoal(value);
//         break;
//       default:
//         result = { success: false, error: 'Unknown goal type' };
//     }

//     if (result.success) {
//       setGoals(prev => ({ ...prev, [editingGoal]: value }));

//       Alert.alert('Success', `${getGoalTitle(editingGoal)} updated successfully!`);

//       // Delay before resetting editingGoal to allow UI to settle
//       setTimeout(() => {
//         setEditingGoal(null);
//       }, 300);

//     } else {
//       Alert.alert('Error', result.error || 'Failed to update goal');
//     }
//   } catch (error) {
//     Alert.alert('Error', 'Failed to update goal');
//   } finally {
//     setSaving(false);
//   }
// };


//  const handleCancelEdit = () => {
//   setEditingGoal(null);
//   Keyboard.dismiss();
// };


//   const getGoalUnit = (goalType) => {
//     switch (goalType) {
//       case 'water': return 'ml';
//       case 'burn': return 'cal';
//       case 'eat': return 'cal';
//       case 'steps': return 'steps';
//       default: return '';
//     }
//   };

//   const getGoalHint = (goalType) => {
//     switch (goalType) {
//       case 'water': return 'Recommended: 2000-3000 ml per day';
//       case 'burn': return 'Based on your activity level';
//       case 'eat': return 'Daily calorie intake target';
//       case 'steps': return 'Recommended: 8000-10000 steps per day';
//       default: return '';
//     }
//   };

//   const getGoalTitle = (goalType) => {
//     switch (goalType) {
//       case 'water': return 'Water Intake';
//       case 'burn': return 'Calories to Burn';
//       case 'eat': return 'Calories to Eat';
//       case 'steps': return 'Step Count';
//       default: return '';
//     }
//   };

// const GoalCard = ({ goalType, goalValue, updateGoal }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempValue, setTempValue] = useState(goalValue.toString());
//   const [saving, setSaving] = useState(false);
//   const inputRef = useRef(null);

//   const startEditing = () => {
//     setIsEditing(true);
//     setTempValue(goalValue.toString());

//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 100);
//   };

//   const handleSaveGoal = async () => {
//     const value = parseInt(tempValue);

//     if (isNaN(value) || value <= 0) {
//       Alert.alert('Error', 'Please enter a valid number');
//       return;
//     }

//     setSaving(true);

//     try {
//       const result = await updateGoal(value);

//       if (result.success) {
//         Alert.alert('Success', `${getGoalTitle(goalType)} updated successfully!`);

//         setIsEditing(false); // Only reset local editing state
//       } else {
//         Alert.alert('Error', result.error || 'Failed to update goal');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update goal');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     Keyboard.dismiss();
//   };

//   return (
//     <View style={[styles.card, styles.cardElevated]}>
//       <View style={styles.cardHeader}>
//         <View style={styles.cardTitleContainer}>
//           <Text style={styles.cardTitle}>{getGoalTitle(goalType)}</Text>
//         </View>
//         {isEditing && (
//           <View style={styles.editActions}>
//             <TouchableOpacity
//               onPress={handleSaveGoal}
//               style={styles.saveIconButton}
//               disabled={saving}
//             >
//               <MaterialIcons
//                 name="check"
//                 size={20}
//                 color={saving ? '#CCC' : '#4CAF50'}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={handleCancelEdit}
//               style={styles.cancelIconButton}
//               disabled={saving}
//             >
//               <MaterialIcons
//                 name="close"
//                 size={20}
//                 color={saving ? '#CCC' : '#F44336'}
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       <TouchableOpacity
//         onPress={() => !isEditing && startEditing()}
//         style={styles.inputRow}
//         activeOpacity={0.7}
//       >
//         {isEditing ? (
//           <TextInput
//             ref={inputRef}
//             style={styles.input}
//             placeholder={`e.g., ${goalType === 'steps' ? '10000' : goalType === 'water' ? '2000' : '500'}`}
//             keyboardType="numeric"
//             value={tempValue}
//             onChangeText={setTempValue}
//             editable={!saving}
//             returnKeyType="done"
//           />
//         ) : (
//           <View style={styles.valueContainer}>
//             <Text style={styles.goalValueText}>
//               {goalValue}
//             </Text>
//             <MaterialIcons
//               name="keyboard-arrow-right"
//               size={20}
//               color="#5A6A8C"
//               style={styles.rightIcon}
//             />
//           </View>
//         )}
//         <Text style={styles.unitText}>{getGoalUnit(goalType)}</Text>
//       </TouchableOpacity>

//       <Text style={styles.hintText}>{getGoalHint(goalType)}</Text>

//       {saving && isEditing && (
//         <Text style={styles.loadingText}>Saving...</Text>
//       )}
//     </View>
//   );
// };


//   return (
//     <View style={styles.safeArea}>
//       <LinearGradient
//         colors={['#1A2980', '#26D0CE']}
//         style={styles.headerGradient}
//       >
//         <View style={styles.headerSection}>
//           <TouchableOpacity 
//             style={styles.profileIcon}
//             onPress={() => navigation.goBack()}
//           >
//             <Feather name="arrow-left" size={24} color="#fff" />
//           </TouchableOpacity>
//           <View style={styles.titleContainer}>
//             <Text style={styles.headerTitle}>Set Your Goals</Text>
//           </View>
//           <View style={styles.profileIconPlaceholder} />
//         </View>
//       </LinearGradient>

//     <ScrollView 
//   style={styles.scrollView} 
//   contentContainerStyle={styles.scrollContent}
//   keyboardShouldPersistTaps="handled"
// >
//   <GoalCard
//     goalType="water"
//     goalValue={goals.water}
//     updateGoal={updateTarget}
//   />
//   <GoalCard
//     goalType="burn"
//     goalValue={goals.burn}
//     updateGoal={setBurnTarget}
//   />
//   <GoalCard
//     goalType="eat"
//     goalValue={goals.eat}
//     updateGoal={setMealTarget}
//   />
//   <GoalCard
//     goalType="steps"
//     goalValue={goals.steps}
//     updateGoal={setStepGoal}
//   />
//   <View style={{ height: 170 }} />
// </ScrollView>

//     </View>
//   );
// };

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
    alignItems: 'center',
    marginBottom: '8%',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: width * 0.055,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
  profileIconPlaceholder: {
    width: width * 0.1,
    height: width * 0.1,
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
    justifyContent: 'space-between',
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#333',
  },
  goalValueText: {
    fontSize: width * 0.04,
    color: '#2E3A59',
    fontWeight: '500',
    paddingVertical: 12,
  },
  rightIcon: {
    marginLeft: 8,
  },
  unitText: {
    fontSize: width * 0.04,
    color: '#5A6A8C',
    fontWeight: '500',
    marginLeft: 8,
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
});

export default GoalSettingScreen;










// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Dimensions,
//   Alert,
//   Keyboard,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialIcons } from '@expo/vector-icons';
// import useWaterStore from '../store/waterStore';
// import { useCaloriesStore } from '../store/caloriesStore';
// import { Feather } from '@expo/vector-icons';

// const { width, height } = Dimensions.get('window');

// const GoalSettingScreen = ({ navigation }) => {
//   const {
//     burnTarget, 
//     setBurnTarget,
//     stepGoal, 
//     fetchStepGoal, 
//     setStepGoal,
//     mealTarget,
//     setMealTarget,
//     fetchBurnTarget,
//     fetchMealTargetStatus,
//   } = useCaloriesStore();

//   const {
//     target,
//     loading: waterLoading,
//     error: waterError,
//     fetchTarget,
//     updateTarget,
//   } = useWaterStore();

//   const [goals, setGoals] = useState({
//     water: 2000,
//     burn: 500,
//     eat: 2000,
//     steps: 10000
//   });
  
//   const [editMode, setEditMode] = useState({
//     water: false,
//     burn: false,
//     eat: false,
//     steps: false
//   });
  
//   const [tempValues, setTempValues] = useState({
//     water: '',
//     burn: '',
//     eat: '',
//     steps: ''
//   });

//   const [saving, setSaving] = useState({
//     water: false,
//     burn: false,
//     eat: false,
//     steps: false
//   });

//   const [keyboardVisible, setKeyboardVisible] = useState(false);

//   useEffect(() => {
//     const loadPreviousGoals = async () => {
//       try {
//         await fetchTarget();
//         await fetchBurnTarget();
//         await fetchStepGoal();
//         await fetchMealTargetStatus();
        
//         setGoals({
//           water: target || 2000,
//           burn: burnTarget || 500,
//           eat: mealTarget || 2000,
//           steps: stepGoal || 10000
//         });
        
//         setTempValues({
//           water: (target || 0).toString(),
//           burn: (burnTarget || 0).toString(),
//           eat: (mealTarget || 0).toString(),
//           steps: (stepGoal || 0).toString()
//         });
//       } catch (error) {
//         console.log('Error loading previous goals:', error);
//         Alert.alert('Error', 'Failed to load previous goals');
//       }
//     };
    
//     loadPreviousGoals();
//   }, []);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       'keyboardDidShow',
//       () => {
//         setKeyboardVisible(true);
//       }
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       'keyboardDidHide',
//       () => {
//         setKeyboardVisible(false);
//       }
//     );

//     return () => {
//       keyboardDidHideListener.remove();
//       keyboardDidShowListener.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (waterError) {
//       Alert.alert('Water Goal Error', waterError);
//     }
//   }, [waterError]);

//   const toggleEditMode = useCallback((goalType) => {
//     setEditMode(prev => ({
//       ...prev,
//       [goalType]: !prev[goalType]
//     }));
    
//     if (!editMode[goalType]) {
//       setTempValues(prev => ({
//         ...prev,
//         [goalType]: goals[goalType].toString()
//       }));
//     }
//   }, [editMode, goals]);

//   const handleSaveGoal = async (goalType) => {
//     const value = parseInt(tempValues[goalType]);
    
//     if (isNaN(value) || value <= 0) {
//       Alert.alert('Error', 'Please enter a valid number');
//       return;
//     }

//     setSaving(prev => ({ ...prev, [goalType]: true }));

//     try {
//       let result;

//       switch (goalType) {
//         case 'water':
//           result = await updateTarget(value);
//           break;
//         case 'burn':
//           result = await setBurnTarget(value);
//           break;
//         case 'eat':
//           result = await setMealTarget(value);
//           break;
//         case 'steps':
//           result = await setStepGoal(value);
//           break;
//         default:
//           result = { success: false, error: 'Unknown goal type' };
//       }

//       if (result.success) {
//         setGoals(prev => ({ ...prev, [goalType]: value }));
//         setEditMode(prev => ({ ...prev, [goalType]: false }));
//         Alert.alert('Success', `${getGoalTitle(goalType)} updated successfully!`);
//       } else {
//         Alert.alert('Error', result.error || 'Failed to update goal');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update goal');
//     } finally {
//       setSaving(prev => ({ ...prev, [goalType]: false }));
//     }
//   };

//   const handleCancelEdit = useCallback((goalType) => {
//     setEditMode(prev => ({
//       ...prev,
//       [goalType]: false
//     }));
    
//     setTempValues(prev => ({
//       ...prev,
//       [goalType]: goals[goalType].toString()
//     }));
    
//     if (keyboardVisible) {
//       Keyboard.dismiss();
//     }
//   }, [goals, keyboardVisible]);

//   const handleTempValueChange = useCallback((goalType, value) => {
//     setTempValues(prev => ({
//       ...prev,
//       [goalType]: value
//     }));
//   }, []);

//   const getGoalUnit = useCallback((goalType) => {
//     switch (goalType) {
//       case 'water': return 'ml';
//       case 'burn': return 'cal';
//       case 'eat': return 'cal';
//       case 'steps': return 'steps';
//       default: return '';
//     }
//   }, []);

//   const getGoalHint = useCallback((goalType) => {
//     switch (goalType) {
//       case 'water': return 'Recommended: 2000-3000 ml per day';
//       case 'burn': return 'Based on your activity level';
//       case 'eat': return 'Daily calorie intake target';
//       case 'steps': return 'Recommended: 8000-10000 steps per day';
//       default: return '';
//     }
//   }, []);

//   const getGoalTitle = useCallback((goalType) => {
//     switch (goalType) {
//       case 'water': return 'Water Intake';
//       case 'burn': return 'Calories to Burn';
//       case 'eat': return 'Calories to Eat';
//       case 'steps': return 'Step Count';
//       default: return '';
//     }
//   }, []);

//   const GoalCard = React.memo(({ goalType }) => {
//     const isEditing = editMode[goalType];
    
//     return (
//       <View style={[styles.card, styles.cardElevated]}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <Text style={styles.cardTitle}>{getGoalTitle(goalType)}</Text>
//           </View>
//           {isEditing ? (
//             <View style={styles.editActions}>
//               <TouchableOpacity 
//                 onPress={() => handleSaveGoal(goalType)}
//                 style={styles.saveIconButton}
//                 disabled={saving[goalType]}
//               >
//                 <MaterialIcons 
//                   name="check" 
//                   size={20} 
//                   color={saving[goalType] ? '#CCC' : '#4CAF50'} 
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 onPress={() => handleCancelEdit(goalType)}
//                 style={styles.cancelIconButton}
//                 disabled={saving[goalType]}
//               >
//                 <MaterialIcons name="close" size={20} color={saving[goalType] ? '#CCC' : '#F44336'} />
//               </TouchableOpacity>
//             </View>
//           ) : null}
//         </View>
        
//         <TouchableOpacity 
//           onPress={() => !isEditing && toggleEditMode(goalType)}
//           style={styles.inputRow}
//           activeOpacity={0.7}
//         >
//           {isEditing ? (
//             <TextInput
//               style={styles.input}
//               placeholder={`e.g., ${goalType === 'steps' ? '10000' : goalType === 'water' ? '2000' : '500'}`}
//               keyboardType="numeric"
//               value={tempValues[goalType]}
//               onChangeText={(text) => handleTempValueChange(goalType, text)}
//               autoFocus={true}
//               editable={!saving[goalType]}
//               onBlur={() => !keyboardVisible && handleCancelEdit(goalType)}
//             />
//           ) : (
//             <View style={styles.valueContainer}>
//               <Text style={styles.goalValueText}>
//                 {saving[goalType] ? 'Saving...' : goals[goalType]}
//               </Text>
//               {!saving[goalType] && (
//                 <MaterialIcons 
//                   name="keyboard-arrow-right" 
//                   size={20} 
//                   color="#5A6A8C" 
//                   style={styles.rightIcon}
//                 />
//               )}
//             </View>
//           )}
//           <Text style={styles.unitText}>{getGoalUnit(goalType)}</Text>
//         </TouchableOpacity>
        
//         <Text style={styles.hintText}>{getGoalHint(goalType)}</Text>

//         {saving[goalType] && (
//           <Text style={styles.loadingText}>Saving...</Text>
//         )}
//       </View>
//     );
//   });

//   return (
//     <View style={styles.safeArea}>
//       <LinearGradient
//         colors={['#1A2980', '#26D0CE']}
//         style={styles.headerGradient}
//       >
//         <View style={styles.headerSection}>
//           <TouchableOpacity 
//             style={styles.profileIcon}
//             onPress={() => navigation.goBack()}
//           >
//             <Feather name="arrow-left" size={24} color="#fff" />
//           </TouchableOpacity>
//           <View style={styles.titleContainer}>
//             <Text style={styles.headerTitle}>Set Your Goals</Text>
//           </View>
//           <View style={styles.profileIconPlaceholder} />
//         </View>
//       </LinearGradient>

//       <ScrollView 
//         style={styles.scrollView} 
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         <GoalCard goalType="water" />
//         <GoalCard goalType="burn" />
//         <GoalCard goalType="eat" />
//         <GoalCard goalType="steps" />
//         <View style={{ height: 170 }} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     marginBottom: Platform.OS === 'ios' ? 40 : 40,
//     paddingBottom: Platform.OS === 'ios' ? 0 : 0,
//     backgroundColor: '#F5F7FB',
//   },
//   headerGradient: {
//     marginTop: Platform.OS === 'ios' ? -60 : -10,
//     paddingHorizontal: '6%',
//     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
//     paddingBottom: height * 0.02,
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     shadowColor: '#1A2980',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
//     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
//     elevation: Platform.OS === 'android' ? 10 : 0,
//   },
//   headerSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '8%',
//   },
//   titleContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitle: {
//     fontSize: width * 0.055,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   profileIcon: {
//     width: width * 0.1,
//     height: width * 0.1,
//     borderRadius: width * 0.05,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   profileIconPlaceholder: {
//     width: width * 0.1,
//     height: width * 0.1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: '4%',
//     paddingBottom: '8%',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '4%',
//     marginBottom: '4%',
//     overflow: 'hidden',
//   },
//   cardElevated: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '4%',
//   },
//   cardTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: width * 0.045,
//     color: '#2E3A59',
//     marginLeft: '2%',
//     fontWeight: '500',
//   },
//   editActions: {
//     flexDirection: 'row',
//   },
//   saveIconButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: '#E8F5E9',
//     marginRight: 8,
//   },
//   cancelIconButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: '#FFEBEE',
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     marginBottom: 8,
//     height: 50,
//     justifyContent: 'space-between',
//   },
//   valueContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   input: {
//     flex: 1,
//     fontSize: width * 0.04,
//     color: '#333',
//   },
//   goalValueText: {
//     fontSize: width * 0.04,
//     color: '#2E3A59',
//     fontWeight: '500',
//     paddingVertical: 12,
//   },
//   rightIcon: {
//     marginLeft: 8,
//   },
//   unitText: {
//     fontSize: width * 0.04,
//     color: '#5A6A8C',
//     fontWeight: '500',
//     marginLeft: 8,
//   },
//   hintText: {
//     fontSize: width * 0.035,
//     color: '#9AA5B9',
//     fontStyle: 'italic',
//   },
//   loadingText: {
//     fontSize: width * 0.035,
//     color: '#5A6A8C',
//     fontStyle: 'italic',
//     marginTop: 4,
//   },
// });

// export default GoalSettingScreen;


















// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TextInput,
// //   TouchableOpacity,
// //   Platform,
// //   Dimensions,
// //   Alert,
// // } from 'react-native';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { MaterialIcons } from '@expo/vector-icons';
// // import useWaterStore from '../store/waterStore';
// // import { useCaloriesStore } from '../store/caloriesStore';
// // import { Feather } from '@expo/vector-icons';

// // const { width, height } = Dimensions.get('window');

// // const GoalSettingScreen = ({ navigation }) => {
// //   const {
// //     totalCaloriesEaten,
// //     totalCaloriesBurned,
// //     mealTarget,
// //     mealTargetMet,
// //     mealFlag,
// //     fetchCaloriesEaten,
// //     fetchCaloriesBurned,
// //     fetchMealTargetStatus,
// //     fetchBurnTarget,
// //     burnTarget, 
// //     setBurnTarget,
// //     stepGoal, 
// //     fetchStepGoal, 
// //     setStepGoal,
// //     setMealTarget
// //   } = useCaloriesStore();

// //   const {
// //     target,
// //     loading: waterLoading,
// //     error: waterError,
// //     fetchTarget,
// //     updateTarget,
// //   } = useWaterStore();

// //   const [goals, setGoals] = useState({
// //     water: target || 2000,
// //     burn: burnTarget || 500,
// //     eat: mealTarget || 2000,
// //     steps: stepGoal || 10000
// //   });
  
// //   const [editMode, setEditMode] = useState({
// //     water: false,
// //     burn: false,
// //     eat: false,
// //     steps: false
// //   });
  
// //   const [tempValues, setTempValues] = useState({
// //     water: '',
// //     burn: '',
// //     eat: '',
// //     steps: ''
// //   });

// //   const [saving, setSaving] = useState({
// //     water: false,
// //     burn: false,
// //     eat: false,
// //     steps: false
// //   });

// //   useEffect(() => {
// //     const loadPreviousGoals = async () => {
// //       try {
// //         await fetchTarget();
// //         await fetchBurnTarget();
// //         await fetchStepGoal();
// //         await fetchMealTargetStatus();
        
// //         setGoals({
// //           water: target || 2000,
// //           burn: burnTarget || 500,
// //           eat: mealTarget || 2000,
// //           steps: stepGoal || 10000
// //         });
        
// //         setTempValues({
// //           water: (target || 0).toString(),
// //           burn: (burnTarget || 0).toString(),
// //           eat: (mealTarget || 0).toString(),
// //           steps: (stepGoal || 0).toString()
// //         });
// //       } catch (error) {
// //         console.log('Error loading previous goals:', error);
// //         Alert.alert('Error', 'Failed to load previous goals');
// //       }
// //     };
    
// //     loadPreviousGoals();
// //   }, []); // Removed dependencies to prevent re-rendering

// //   useEffect(() => {
// //     if (waterError) {
// //       Alert.alert('Water Goal Error', waterError);
// //     }
// //   }, [waterError]);

// //   const toggleEditMode = (goalType) => {
// //     setEditMode(prev => ({
// //       ...prev,
// //       [goalType]: !prev[goalType]
// //     }));
    
// //     if (!editMode[goalType]) {
// //       setTempValues(prev => ({
// //         ...prev,
// //         [goalType]: goals[goalType].toString()
// //       }));
// //     }
// //   };

// //   const handleSaveGoal = async (goalType) => {
// //     const value = parseInt(tempValues[goalType]);
    
// //     if (isNaN(value) || value <= 0) {
// //       Alert.alert('Error', 'Please enter a valid number');
// //       return;
// //     }

// //     setSaving(prev => ({ ...prev, [goalType]: true }));

// //     try {
// //       let result;

// //       switch (goalType) {
// //         case 'water':
// //           result = await updateTarget(value);
// //           break;
// //         case 'burn':
// //           result = await setBurnTarget(value);
// //           break;
// //         case 'eat':
// //           result = await setMealTarget(value);
// //           break;
// //         case 'steps':
// //           result = await setStepGoal(value);
// //           break;
// //         default:
// //           result = { success: false, error: 'Unknown goal type' };
// //       }

// //       if (result.success) {
// //         setGoals(prev => ({ ...prev, [goalType]: value }));
// //         setEditMode(prev => ({ ...prev, [goalType]: false }));
// //         Alert.alert('Success', `${getGoalTitle(goalType)} updated successfully!`);
// //       } else {
// //         Alert.alert('Error', result.error || 'Failed to update goal');
// //       }
// //     } catch (error) {
// //       Alert.alert('Error', 'Failed to update goal');
// //     } finally {
// //       setSaving(prev => ({ ...prev, [goalType]: false }));
// //     }
// //   };

// //   const handleCancelEdit = (goalType) => {
// //     setEditMode(prev => ({
// //       ...prev,
// //       [goalType]: false
// //     }));
    
// //     setTempValues(prev => ({
// //       ...prev,
// //       [goalType]: goals[goalType].toString()
// //     }));
// //   };

// //   const handleTempValueChange = (goalType, value) => {
// //     setTempValues(prev => ({
// //       ...prev,
// //       [goalType]: value
// //     }));
// //   };

// //   const getGoalUnit = (goalType) => {
// //     switch (goalType) {
// //       case 'water': return 'ml';
// //       case 'burn': return 'cal';
// //       case 'eat': return 'cal';
// //       case 'steps': return 'steps';
// //       default: return '';
// //     }
// //   };

// //   const getGoalHint = (goalType) => {
// //     switch (goalType) {
// //       case 'water': return 'Recommended: 2000-3000 ml per day';
// //       case 'burn': return 'Based on your activity level';
// //       case 'eat': return 'Daily calorie intake target';
// //       case 'steps': return 'Recommended: 8000-10000 steps per day';
// //       default: return '';
// //     }
// //   };

// //   const getGoalTitle = (goalType) => {
// //     switch (goalType) {
// //       case 'water': return 'Water Intake';
// //       case 'burn': return 'Calories to Burn';
// //       case 'eat': return 'Calories to Eat';
// //       case 'steps': return 'Step Count';
// //       default: return '';
// //     }
// //   };

// //   const GoalCard = ({ goalType }) => (
// //     <View style={[styles.card, styles.cardElevated]}>
// //       <View style={styles.cardHeader}>
// //         <View style={styles.cardTitleContainer}>
// //           <Text style={styles.cardTitle}>{getGoalTitle(goalType)}</Text>
// //         </View>
// //         {editMode[goalType] && (
// //           <View style={styles.editActions}>
// //             <TouchableOpacity 
// //               onPress={() => handleSaveGoal(goalType)}
// //               style={styles.saveIconButton}
// //               disabled={saving[goalType]}
// //             >
// //               <MaterialIcons 
// //                 name="check" 
// //                 size={20} 
// //                 color={saving[goalType] ? '#CCC' : '#4CAF50'} 
// //               />
// //             </TouchableOpacity>
// //             <TouchableOpacity 
// //               onPress={() => handleCancelEdit(goalType)}
// //               style={styles.cancelIconButton}
// //               disabled={saving[goalType]}
// //             >
// //               <MaterialIcons name="close" size={20} color={saving[goalType] ? '#CCC' : '#F44336'} />
// //             </TouchableOpacity>
// //           </View>
// //         )}
// //       </View>
      
// //       <TouchableOpacity 
// //         onPress={() => !editMode[goalType] && toggleEditMode(goalType)}
// //         style={styles.inputRow}
// //         activeOpacity={0.7}
// //       >
// //         {editMode[goalType] ? (
// //           <TextInput
// //             style={styles.input}
// //             placeholder={`e.g., ${goalType === 'steps' ? '10000' : goalType === 'water' ? '2000' : '500'}`}
// //             keyboardType="numeric"
// //             value={tempValues[goalType]}
// //             onChangeText={(text) => handleTempValueChange(goalType, text)}
// //             autoFocus={true}
// //             editable={!saving[goalType]}
// //           />
// //         ) : (
// //           <View style={styles.valueContainer}>
// //             <Text style={styles.goalValueText}>
// //               {saving[goalType] ? 'Saving...' : goals[goalType]}
// //             </Text>
// //             {!saving[goalType] && (
// //               <MaterialIcons 
// //                 name="keyboard-arrow-right" 
// //                 size={20} 
// //                 color="#5A6A8C" 
// //                 style={styles.rightIcon}
// //               />
// //             )}
// //           </View>
// //         )}
// //         <Text style={styles.unitText}>{getGoalUnit(goalType)}</Text>
// //       </TouchableOpacity>
      
// //       <Text style={styles.hintText}>{getGoalHint(goalType)}</Text>

// //       {saving[goalType] && (
// //         <Text style={styles.loadingText}>Saving...</Text>
// //       )}
// //     </View>
// //   );

// //   return (
// //     <View style={styles.safeArea}>
// //       <LinearGradient
// //         colors={['#1A2980', '#26D0CE']}
// //         style={styles.headerGradient}
// //       >
// //         <View style={styles.headerSection}>
// //           <TouchableOpacity 
// //             style={styles.profileIcon}
// //             onPress={() => navigation.goBack()}
// //           >
// //             <Feather name="arrow-left" size={24} color="#fff" />
// //           </TouchableOpacity>
// //           <View style={styles.titleContainer}>
// //             <Text style={styles.headerTitle}>Set Your Goals</Text>
// //           </View>
// //           <View style={styles.profileIconPlaceholder} />
// //         </View>
// //       </LinearGradient>

// //       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
// //         <GoalCard goalType="water" />
// //         <GoalCard goalType="burn" />
// //         <GoalCard goalType="eat" />
// //         <GoalCard goalType="steps" />
// //         <View style={{ height: 170 }} />
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     marginBottom: Platform.OS === 'ios' ? 40 : 40,
// //     paddingBottom: Platform.OS === 'ios' ? 0 : 0,
// //     backgroundColor: '#F5F7FB',
// //   },
// //   headerGradient: {
// //     marginTop: Platform.OS === 'ios' ? -60 : -10,
// //     paddingHorizontal: '6%',
// //     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
// //     paddingBottom: height * 0.02,
// //     borderBottomLeftRadius: 40,
// //     borderBottomRightRadius: 40,
// //     shadowColor: '#1A2980',
// //     shadowOffset: { width: 0, height: 10 },
// //     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
// //     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
// //     elevation: Platform.OS === 'android' ? 10 : 0,
// //   },
// //   headerSection: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: '8%',
// //   },
// //   titleContainer: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   headerTitle: {
// //     fontSize: width * 0.055,
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //   },
// //   profileIcon: {
// //     width: width * 0.1,
// //     height: width * 0.1,
// //     borderRadius: width * 0.05,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   profileIconPlaceholder: {
// //     width: width * 0.1,
// //     height: width * 0.1,
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     padding: '4%',
// //     paddingBottom: '8%',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: '4%',
// //     marginBottom: '4%',
// //     overflow: 'hidden',
// //   },
// //   cardElevated: {
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: '4%',
// //   },
// //   cardTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   cardTitle: {
// //     fontSize: width * 0.045,
// //     color: '#2E3A59',
// //     marginLeft: '2%',
// //     fontWeight: '500',
// //   },
// //   editActions: {
// //     flexDirection: 'row',
// //   },
// //   saveIconButton: {
// //     padding: 8,
// //     borderRadius: 20,
// //     backgroundColor: '#E8F5E9',
// //     marginRight: 8,
// //   },
// //   cancelIconButton: {
// //     padding: 8,
// //     borderRadius: 20,
// //     backgroundColor: '#FFEBEE',
// //   },
// //   inputRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#E0E0E0',
// //     borderRadius: 12,
// //     paddingHorizontal: 12,
// //     marginBottom: 8,
// //     height: 50,
// //     justifyContent: 'space-between',
// //   },
// //   valueContainer: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: width * 0.04,
// //     color: '#333',
// //   },
// //   goalValueText: {
// //     fontSize: width * 0.04,
// //     color: '#2E3A59',
// //     fontWeight: '500',
// //     paddingVertical: 12,
// //   },
// //   rightIcon: {
// //     marginLeft: 8,
// //   },
// //   unitText: {
// //     fontSize: width * 0.04,
// //     color: '#5A6A8C',
// //     fontWeight: '500',
// //     marginLeft: 8,
// //   },
// //   hintText: {
// //     fontSize: width * 0.035,
// //     color: '#9AA5B9',
// //     fontStyle: 'italic',
// //   },
// //   loadingText: {
// //     fontSize: width * 0.035,
// //     color: '#5A6A8C',
// //     fontStyle: 'italic',
// //     marginTop: 4,
// //   },
// // });

// // export default GoalSettingScreen;

















// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   ScrollView,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   Platform,
// // //   Dimensions,
// // //   Alert,
// // // } from 'react-native';
// // // import { LinearGradient } from 'expo-linear-gradient';
// // // import { MaterialIcons } from '@expo/vector-icons';
// // // import useWaterStore from '../store/waterStore';
// // // import { useCaloriesStore } from '../store/caloriesStore';
// // // import { Feather } from '@expo/vector-icons';

// // // const { width, height } = Dimensions.get('window');

// // // const GoalSettingScreen = ({ navigation }) => {
// // //   const {
// // //     totalCaloriesEaten,
// // //     totalCaloriesBurned,
// // //     mealTarget,
// // //     mealTargetMet,
// // //     mealFlag,
// // //     fetchCaloriesEaten,
// // //     fetchCaloriesBurned,
// // //     fetchMealTargetStatus,
// // //     fetchBurnTarget,
// // //     burnTarget, 
// // //     setBurnTarget,
// // //     stepGoal, 
// // //     fetchStepGoal, 
// // //     setStepGoal,
// // //     setMealTarget // Add this function to your caloriesStore
// // //   } = useCaloriesStore();

// // //   const {
// // //     target,
// // //     loading: waterLoading,
// // //     error: waterError,
// // //     fetchTarget,
// // //     updateTarget,
// // //   } = useWaterStore();

// // //   const [goals, setGoals] = useState({
// // //     water: target || 2000,
// // //     burn: burnTarget || 500,
// // //     eat: mealTarget || 2000,
// // //     steps: stepGoal || 10000
// // //   });
  
// // //   const [editMode, setEditMode] = useState({
// // //     water: false,
// // //     burn: false,
// // //     eat: false,
// // //     steps: false
// // //   });
  
// // //   const [tempValues, setTempValues] = useState({
// // //     water: '',
// // //     burn: '',
// // //     eat: '',
// // //     steps: ''
// // //   });

// // //   const [saving, setSaving] = useState({
// // //     water: false,
// // //     burn: false,
// // //     eat: false,
// // //     steps: false
// // //   });

// // //   useEffect(() => {
// // //     const loadPreviousGoals = async () => {
// // //       try {
// // //         await fetchTarget();
// // //         await fetchBurnTarget();
// // //         await fetchStepGoal();
// // //         await fetchMealTargetStatus();
        
// // //         setGoals({
// // //           water: target || 2000,
// // //           burn: burnTarget || 500,
// // //           eat: mealTarget || 2000,
// // //           steps: stepGoal || 10000
// // //         });
        
// // //         setTempValues({
// // //           water: (target || 0).toString(),
// // //           burn: (burnTarget || 0).toString(),
// // //           eat: (mealTarget || 0).toString(),
// // //           steps: (stepGoal || 0).toString()
// // //         });
// // //       } catch (error) {
// // //         console.log('Error loading previous goals:', error);
// // //         Alert.alert('Error', 'Failed to load previous goals');
// // //       }
// // //     };
    
// // //     loadPreviousGoals();
// // //   }, [target, burnTarget, mealTarget, stepGoal]);

// // //   useEffect(() => {
// // //     if (waterError) {
// // //       Alert.alert('Water Goal Error', waterError);
// // //     }
// // //   }, [waterError]);

// // //   const toggleEditMode = (goalType) => {
// // //     setEditMode(prev => ({
// // //       ...prev,
// // //       [goalType]: !prev[goalType]
// // //     }));
    
// // //     if (!editMode[goalType]) {
// // //       setTempValues(prev => ({
// // //         ...prev,
// // //         [goalType]: goals[goalType].toString()
// // //       }));
// // //     }
// // //   };

// // //   const handleSaveGoal = async (goalType) => {
// // //     const value = parseInt(tempValues[goalType]);
    
// // //     if (isNaN(value) || value <= 0) {
// // //       Alert.alert('Error', 'Please enter a valid number');
// // //       return;
// // //     }

// // //     setSaving(prev => ({ ...prev, [goalType]: true }));

// // //     try {
// // //       let result;

// // //       switch (goalType) {
// // //         case 'water':
// // //           result = await updateTarget(value);
// // //           break;
// // //         case 'burn':
// // //           result = await setBurnTarget(value);
// // //           break;
// // //         case 'eat':
// // //           // You'll need to add setMealTarget function to your caloriesStore
// // //           result = await setMealTarget(value);
// // //           break;
// // //         case 'steps':
// // //           result = await setStepGoal(value);
// // //           break;
// // //         default:
// // //           result = { success: false, error: 'Unknown goal type' };
// // //       }

// // //       if (result.success) {
// // //         setGoals(prev => ({ ...prev, [goalType]: value }));
// // //         setEditMode(prev => ({ ...prev, [goalType]: false }));
// // //         Alert.alert('Success', `${getGoalTitle(goalType)} updated successfully!`);
// // //       } else {
// // //         Alert.alert('Error', result.error || 'Failed to update goal');
// // //       }
// // //     } catch (error) {
// // //       Alert.alert('Error', 'Failed to update goal');
// // //     } finally {
// // //       setSaving(prev => ({ ...prev, [goalType]: false }));
// // //     }
// // //   };

// // //   const handleCancelEdit = (goalType) => {
// // //     setEditMode(prev => ({
// // //       ...prev,
// // //       [goalType]: false
// // //     }));
    
// // //     setTempValues(prev => ({
// // //       ...prev,
// // //       [goalType]: goals[goalType].toString()
// // //     }));
// // //   };

// // //   const handleTempValueChange = (goalType, value) => {
// // //     setTempValues(prev => ({
// // //       ...prev,
// // //       [goalType]: value
// // //     }));
// // //   };

// // //   const getGoalUnit = (goalType) => {
// // //     switch (goalType) {
// // //       case 'water': return 'ml';
// // //       case 'burn': return 'cal';
// // //       case 'eat': return 'cal';
// // //       case 'steps': return 'steps';
// // //       default: return '';
// // //     }
// // //   };

// // //   const getGoalHint = (goalType) => {
// // //     switch (goalType) {
// // //       case 'water': return 'Recommended: 2000-3000 ml per day';
// // //       case 'burn': return 'Based on your activity level';
// // //       case 'eat': return 'Daily calorie intake target';
// // //       case 'steps': return 'Recommended: 8000-10000 steps per day';
// // //       default: return '';
// // //     }
// // //   };

// // //   const getGoalTitle = (goalType) => {
// // //     switch (goalType) {
// // //       case 'water': return 'Water Intake';
// // //       case 'burn': return 'Calories to Burn';
// // //       case 'eat': return 'Calories to Eat';
// // //       case 'steps': return 'Step Count';
// // //       default: return '';
// // //     }
// // //   };

// // //   const GoalCard = ({ goalType }) => (
// // //     <View style={[styles.card, styles.cardElevated]}>
// // //       <View style={styles.cardHeader}>
// // //         <View style={styles.cardTitleContainer}>
// // //           <Text style={styles.cardTitle}>{getGoalTitle(goalType)}</Text>
// // //         </View>
// // //         {!editMode[goalType] ? (
// // //           <TouchableOpacity 
// // //             onPress={() => toggleEditMode(goalType)}
// // //             style={styles.editButton}
// // //             disabled={saving[goalType]}
// // //           >
// // //             <MaterialIcons 
// // //               name="edit" 
// // //               size={20} 
// // //               color={saving[goalType] ? '#CCC' : '#4B6CB7'} 
// // //             />
// // //           </TouchableOpacity>
// // //         ) : (
// // //           <View style={styles.editActions}>
// // //             <TouchableOpacity 
// // //               onPress={() => handleSaveGoal(goalType)}
// // //               style={styles.saveIconButton}
// // //               disabled={saving[goalType]}
// // //             >
// // //               <MaterialIcons 
// // //                 name="check" 
// // //                 size={20} 
// // //                 color={saving[goalType] ? '#CCC' : '#4CAF50'} 
// // //               />
// // //             </TouchableOpacity>
// // //             <TouchableOpacity 
// // //               onPress={() => handleCancelEdit(goalType)}
// // //               style={styles.cancelIconButton}
// // //               disabled={saving[goalType]}
// // //             >
// // //               <MaterialIcons name="close" size={20} color={saving[goalType] ? '#CCC' : '#F44336'} />
// // //             </TouchableOpacity>
// // //           </View>
// // //         )}
// // //       </View>
      
// // //       <View style={styles.inputRow}>
// // //         {editMode[goalType] ? (
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder={`e.g., ${goalType === 'steps' ? '10000' : goalType === 'water' ? '2000' : '500'}`}
// // //             keyboardType="numeric"
// // //             value={tempValues[goalType]}
// // //             onChangeText={(text) => handleTempValueChange(goalType, text)}
// // //             autoFocus={true}
// // //             editable={!saving[goalType]}
// // //           />
// // //         ) : (
// // //           <Text style={styles.goalValueText}>
// // //             {saving[goalType] ? 'Saving...' : goals[goalType]}
// // //           </Text>
// // //         )}
// // //         <Text style={styles.unitText}>{getGoalUnit(goalType)}</Text>
// // //       </View>
      
// // //       <Text style={styles.hintText}>{getGoalHint(goalType)}</Text>

// // //       {saving[goalType] && (
// // //         <Text style={styles.loadingText}>Saving...</Text>
// // //       )}
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={styles.safeArea}>
// // //       <LinearGradient
// // //         colors={['#1A2980', '#26D0CE']}
// // //         style={styles.headerGradient}
// // //       >
// // //         <View style={styles.headerSection}>
// // //              <TouchableOpacity 
// // //             style={styles.profileIcon}
// // //             onPress={() => navigation.goBack()}
// // //           >
// // //                       <Feather name="arrow-left" size={24} color="#fff" />
// // //             {/* <Text style={{ color: '#fff', fontSize: 20 }}>×</Text> */}
// // //           </TouchableOpacity>
// // //           <View style={{ }}>
// // //             <Text style={styles.greetingText}>Set Your Goals</Text>
// // //             {/* <Text style={styles.headerText}>Track your progress</Text> */}
// // //           </View>
       
// // //         </View>
// // //       </LinearGradient>

// // //       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
// // //         <GoalCard goalType="water" />
// // //         <GoalCard goalType="burn" />
// // //         <GoalCard goalType="eat" />
// // //         <GoalCard goalType="steps" />
// // //         <View style={{ height: 170 }} />
// // //       </ScrollView>
// // //     </View>
// // //   );
// // // };


// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     marginBottom: Platform.OS === 'ios' ? 40 : 40,
// // //     paddingBottom: Platform.OS === 'ios' ? 0 : 0,
// // //     backgroundColor: '#F5F7FB',
// // //   },
// // //   headerGradient: {
// // //     marginTop: Platform.OS === 'ios' ? -60 : -10,
// // //     paddingHorizontal: '6%',
// // //     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
// // //     paddingBottom: height * 0.02,
// // //     borderBottomLeftRadius: 40,
// // //     borderBottomRightRadius: 40,
// // //     shadowColor: '#1A2980',
// // //     shadowOffset: { width: 0, height: 10 },
// // //     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
// // //     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
// // //     elevation: Platform.OS === 'android' ? 10 : 0,
// // //   },
// // //   headerSection: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     // justifyContent: 'center',
// // //     // justifyContent: 'flex-start',
// // //     // alignItems: 'flex-start',
// // //     alignItems: 'center',
// // //     marginBottom: '8%',
// // //   },
// // //   greetingText: {
// // //     fontSize: width * 0.045,
// // //     marginRight: '2%',
// // //     color: 'rgba(255,255,255,0.9)',
// // //   },
// // //   headerText: {
// // //     fontSize: width * 0.055,
// // //     color: '#fff',
// // //     marginTop: '1%',
// // //   },
// // //   profileIcon: {
// // //     width: width * 0.1,
// // //     height: width * 0.1,
// // //     borderRadius: width * 0.05,
// // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   scrollView: {
// // //     flex: 1,
// // //   },
// // //   scrollContent: {
// // //     padding: '4%',
// // //     paddingBottom: '8%',
// // //   },
// // //   card: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: '4%',
// // //     marginBottom: '4%',
// // //     overflow: 'hidden',
// // //   },
// // //   cardElevated: {
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.08,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //   },
// // //   cardHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: '4%',
// // //   },
// // //   cardTitleContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   cardTitle: {
// // //     fontSize: width * 0.045,
// // //     color: '#2E3A59',
// // //     marginLeft: '2%',
// // //     fontWeight: '500',
// // //   },
// // //   editButton: {
// // //     padding: 8,
// // //     borderRadius: 20,
// // //     backgroundColor: '#F0F4FF',
// // //   },
// // //   editActions: {
// // //     flexDirection: 'row',
// // //   },
// // //   saveIconButton: {
// // //     padding: 8,
// // //     borderRadius: 20,
// // //     backgroundColor: '#E8F5E9',
// // //     marginRight: 8,
// // //   },
// // //   cancelIconButton: {
// // //     padding: 8,
// // //     borderRadius: 20,
// // //     backgroundColor: '#FFEBEE',
// // //   },
// // //   inputRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#E0E0E0',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 12,
// // //     marginBottom: 8,
// // //     height: 50,
// // //   },
// // //   input: {
// // //     flex: 1,
// // //     fontSize: width * 0.04,
// // //     color: '#333',
// // //   },
// // //   goalValueText: {
// // //     flex: 1,
// // //     fontSize: width * 0.04,
// // //     color: '#2E3A59',
// // //     fontWeight: '500',
// // //     paddingVertical: 12,
// // //   },
// // //   unitText: {
// // //     fontSize: width * 0.04,
// // //     color: '#5A6A8C',
// // //     fontWeight: '500',
// // //   },
// // //   hintText: {
// // //     fontSize: width * 0.035,
// // //     color: '#9AA5B9',
// // //     fontStyle: 'italic',
// // //   },
// // //   loadingText: {
// // //     fontSize: width * 0.035,
// // //     color: '#5A6A8C',
// // //     fontStyle: 'italic',
// // //     marginTop: 4,
// // //   },
// // //   saveButton: {
// // //     backgroundColor: '#4B6CB7',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     alignItems: 'center',
// // //     marginTop: 16,
// // //     shadowColor: '#1A2980',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //   },
// // //   saveButtonDisabled: {
// // //     backgroundColor: '#9AA5B9',
// // //   },
// // //   saveButtonText: {
// // //     color: '#fff',
// // //     fontSize: width * 0.04,
// // //     fontWeight: '600',
// // //   },
// // // });

// // // export default GoalSettingScreen;
