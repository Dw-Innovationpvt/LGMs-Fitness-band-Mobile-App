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

  </Stack.Navigator>
);
export default HomeStack;

 