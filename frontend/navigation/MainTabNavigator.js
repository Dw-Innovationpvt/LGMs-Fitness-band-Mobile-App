import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeStack from './HomeStack';
import ChallengesScreen from '../screens/ChallengesScreen';
import DailyActivitiesScreen from '../screens/DailyActivitiesScreen';
import { useAuthStore } from '../store/authStore';
import Apps from '../screens/components/Apps';

import BleScreen from '../screens/components/comp/BleScreen';
import SimpleBLEComponent from '../helper/SimpleBLEComponent';

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
  const bgOpacity = animated.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] });
  const bgScale = animated.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.7}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale }] }]}>
        <Animated.View 
          style={[
            styles.circleBackground, 
            { 
              opacity: bgOpacity,
              transform: [{ scale: bgScale }],
              backgroundColor: isFocused ? '#4B6CB7' : '#888'
            }
          ]} 
        />
        <Animated.View style={[styles.iconWrapper, { transform: [{ translateY }] }]}>
          <Feather 
            name={iconName} 
            size={24} 
            color={isFocused ? '#4B6CB7' : '#888'} 
          />
        </Animated.View>
      </Animated.View>
      {isFocused && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const MainTabNavigator = () => {
  const { nothingtoworry, login, isLoading, user, token, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    console.log("MaintabMounted");
    const checkBackend = async () => {
      try {
        const response = await nothingtoworry();
        if (response.success) {
          // console.log('Backend is working:', response.data, user, "usr");
          // console.log("Bearer", token);
        } else {
          console.error('Error:', response.error);
        }
      } catch (error) {
        console.error('Error checking backend:', error);
      }
    };
    checkBackend();
    const checkAuth = async () => {
      try {
        const response = await checkAuth();
        if (response.success) {
          // console.log('User is authenticated:', response.data);
        } else {
          // console.error('Authentication failed:', response.error);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    if (isCheckingAuth) return;
    checkAuth();
  }, [])

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Daily Activities" component={DailyActivitiesScreen} />
      <Tab.Screen name="Challenges" component={ChallengesScreen} />
      {/* <Tab.Screen name="Ble" component={Apps} />  */}
      <Tab.Screen name="Blue" component={BleScreen} />
      <Tab.Screen name="Simple" component={SimpleBLEComponent} />
    </Tab.Navigator>
  );
}

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
    paddingVertical: 8,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  circleBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconWrapper: {
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#4B6CB7',
    fontWeight: '500',
  },
});

// import React, { useEffect, useRef } from 'react';
// import { View, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Feather } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import HomeStack from './HomeStack';
// import ChallengesScreen from '../screens/ChallengesScreen';
// import DailyActivitiesScreen from '../screens/DailyActivitiesScreen';
// import BackendCodeCheck from '../screens/BackendCodeCheck';

// import StepsBackendCheck from '../screens/back/StepsBackendCheck';
// import { useAuthStore } from '../store/authStore';
// import TodaysActivityBack from '../screens/back/TodaysActivityBack';
// import SkatingTrackingCheck from '../screens/back/SkatingTrackingCheck';
// import WorkoutHistoryBeckend from '../screens/back/WorkoutHistoryBeckend';
// import TempMealScreen from '../screens/back/TempMealScreen'; // Adjust the import path as necessary


// const { width, height } = Dimensions.get('window');
// const Tab = createBottomTabNavigator();


// const CustomTabBar = ({ state, descriptors, navigation }) => (
//   <View style={styles.tabContainer}>
//     <LinearGradient
//       colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.95)']}
//       style={styles.gradient}
//     >
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });
//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         const iconMap = {
//           Home: 'home',
//           Challenges: 'award',
//           'Daily Activities': 'activity',
//         };

//         return (
//           <TabButton
//             key={route.name}
//             iconName={iconMap[route.name]}
//             isFocused={isFocused}
//             onPress={onPress}
//             label={route.name}
//           />
//         );
//       })}
//     </LinearGradient>
//   </View>
// );

// const TabButton = ({ iconName, isFocused, onPress, label }) => {
//   const animated = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.spring(animated, {
//       toValue: isFocused ? 1 : 0,
//       useNativeDriver: true,
//       friction: 5,
//     }).start();
//   }, [isFocused]);



//   const scale = animated.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
//   const translateY = animated.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

//   return (
//     <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.7}>
//       <Animated.View style={[styles.iconWrapper, { transform: [{ scale }, { translateY }] }]}>
//         <Feather name={iconName} size={24} color={isFocused ? '#4B6CB7' : '#888'} />
//       </Animated.View>
//       {isFocused && <Text style={styles.label}>{label}</Text>}
//     </TouchableOpacity>
//   );
// };

// const MainTabNavigator = () => {
//             const { nothingtoworry, login, isLoading, user, token, checkAuth, isCheckingAuth } = useAuthStore();

//     useEffect(() => {
//   console.log("MaintabMounted");
//   const checkBackend = async () => {
//     try {
//       const response = await nothingtoworry();
//       if (response.success) {
//         // console.log('Backend is working:', response.data, user, "usr");
//         // console.log("Bearer", token);
//       } else {
//         console.error('Error:', response.error);
//       }
//     } catch (error) {
//       console.error('Error checking backend:', error);
//     }
//   };
//   checkBackend();
//   const checkAuth = async () => {
//     try {
//       const response = await checkAuth();
//       if (response.success) {
//         // console.log('User is authenticated:', response.data);
//       } else {
//         // console.error('Authentication failed:', response.error);
//       }
//     } catch (error) {
//       console.error('Error checking authentication:', error);
//     }
//   };
//   if (isCheckingAuth) return;
//   checkAuth();
//   }, [])
//   return (
//   <Tab.Navigator
//     tabBar={(props) => <CustomTabBar {...props} />}
//     screenOptions={{ headerShown: false }}
//   >
//     <Tab.Screen name="Home" component={HomeStack} />
//     <Tab.Screen name="Daily Activities" component={DailyActivitiesScreen} />
//     <Tab.Screen name="Challenges" component={ChallengesScreen} />
//     {/* <Tab.Screen name="Backend" component={BackendCodeCheck} /> */}
//     {/* <Tab.Screen name="Steps" component={StepsBackendCheck} /> */}
//     {/* <Tab.Screen name="Activity" component={TodaysActivityBack} /> */}
//     {/* <Tab.Screen name="Skating" component={SkatingTrackingCheck} /> */}
//     {/* <Tab.Screen name="TodaysWorkout" component={WorkoutHistoryBeckend} /> */}
//     {/* <Tab.Screen name="TMeals" component={TempMealScreen} /> */}

//   </Tab.Navigator>
// );
// }

// export default MainTabNavigator;

// const styles = StyleSheet.create({
//   tabContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//   },
//   gradient: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     elevation: 5,
//   },
//   tabButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   iconWrapper: {
//     padding: 8,
//     borderRadius: 20,
//   },
//   label: {
//     fontSize: 12,
//     marginTop: 4,
//     color: '#4B6CB7',
//     fontWeight: '500',
//   },
// });
