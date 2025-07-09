import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import BMIScreen from '../screens/BMIScreen';
import SkatePreferenceScreen from '../screens/SkatePreferenceScreen';
import MealTimingScreen from '../screens/MealTimingScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator 
    initialRouteName="Splash"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="BMI" component={BMIScreen} />
    <Stack.Screen name="SkatePreference" component={SkatePreferenceScreen} />
    <Stack.Screen name="MealTiming" component={MealTimingScreen} />
    <Stack.Screen name="Loading" component={LoadingScreen} />
    <Stack.Screen name="Main" component={MainTabNavigator} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

export default AuthStack;