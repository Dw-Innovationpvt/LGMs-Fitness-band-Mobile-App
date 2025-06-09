// In your navigation file (e.g., MainTabNavigator.js)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import ChallengesScreen from '../screens/ChallengesScreen';
import AboutScreen from '../screens/AboutScreen';
 import DailyActivitiesScreen from '../screens/DailyActivitiesScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
      if (route.name === 'Daily Activities') iconName = 'activity';
        if (route.name === 'Challenges') iconName = 'award';
        if (route.name === 'About') iconName = 'info';
        return <Feather name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Daily Activities" component={DailyActivitiesScreen} />
     <Tab.Screen name="Challenges" component={ChallengesScreen} />
    <Tab.Screen name="About" component={AboutScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;