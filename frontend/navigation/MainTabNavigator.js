import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeStack from './HomeStack';
import ChallengesScreen from '../screens/ChallengesScreen';
import DailyActivitiesScreen from '../screens/DailyActivitiesScreen';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => (
  <View style={styles.tabContainer}>
    <LinearGradient
      colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.95)']}
      style={styles.gradient}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconMap = {
          Home: 'home',
          Challenges: 'award',
          'Daily Activities': 'activity',
        };

        return (
          <TabButton
            key={route.name}
            iconName={iconMap[route.name]}
            isFocused={isFocused}
            onPress={onPress}
            label={route.name}
          />
        );
      })}
    </LinearGradient>
  </View>
);

const TabButton = ({ iconName, isFocused, onPress, label }) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animated, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [isFocused]);

  const scale = animated.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
  const translateY = animated.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.7}>
      <Animated.View style={[styles.iconWrapper, { transform: [{ scale }, { translateY }] }]}>
        <Feather name={iconName} size={24} color={isFocused ? '#4B6CB7' : '#888'} />
      </Animated.View>
      {isFocused && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const MainTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Daily Activities" component={DailyActivitiesScreen} />
    <Tab.Screen name="Challenges" component={ChallengesScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#4B6CB7',
    fontWeight: '500',
  },
});
