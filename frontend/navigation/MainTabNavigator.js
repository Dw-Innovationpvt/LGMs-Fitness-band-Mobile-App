import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import AboutScreen from '../screens/AboutScreen';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        if (route.name === 'Challenges') iconName = 'award';
        if (route.name === 'About') iconName = 'info';
        return <Feather name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Challenges" component={ChallengesScreen} />
    <Tab.Screen name="About" component={AboutScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;