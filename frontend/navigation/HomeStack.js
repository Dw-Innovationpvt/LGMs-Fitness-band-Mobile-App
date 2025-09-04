// navigation/HomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import StepCountScreen from '../screens/StepCountScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';  
import SkatingTrackingScreen from '../screens/SkatingTrackingScreen';  
import WaterIntakeScreen from '../screens/WaterIntakeScreen';  
import SetGoalScreen from '../screens/SetGoalScreen';  
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import DevicePairingScreen from '../screens/DevicePairingScreen';

import GoalSettingScreen from '../screens/GoalSettingScreen';

// import TempMealScreen from '../screens/back/TempMealScreen'; // Adjust the import path as necessary

const Stack = createNativeStackNavigator();


const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="StepCount" component={StepCountScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />  
  <Stack.Screen name="SkatingTracking" component={SkatingTrackingScreen} /> 
  <Stack.Screen name="SetGoal" component={SetGoalScreen} />
<Stack.Screen name="WaterIntake" component={WaterIntakeScreen} />

    <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
{/* <Stack.Screen name="MealScreen" component={TempMealScreen} /> */}
  <Stack.Screen name="Privacy" component={PrivacyScreen} />
  <Stack.Screen name="DevicePairing" component={DevicePairingScreen} />
  <Stack.Screen name="Goal" component={GoalSettingScreen} />
  </Stack.Navigator>
);
export default HomeStack;

 