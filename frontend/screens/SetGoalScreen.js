import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  Dimensions,
  useWindowDimensions,
  Platform
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle } from 'react-native-progress';

const goalTypes = [
  { 
    key: 'time', 
    title: 'Time Duration', 
    color: '#FF6B6B', 
    icon: 'clock',
    unit: 'min'
  },
  { 
    key: 'speed', 
    title: 'Speed', 
    color: '#4B6CB7', 
    icon: 'speedometer',
    unit: 'km/h'
  },
  { 
    key: 'calories', 
    title: 'Calorie Burn', 
    color: '#FFA500', 
    icon: 'fire',
    unit: 'kcal'
  },
  { 
    key: 'distance', 
    title: 'Distance', 
    color: '#32CD32', 
    icon: 'map-marker-distance',
    unit: 'km'
  },
  { 
    key: 'cadence', 
    title: 'Stride Rate', 
    color: '#9370DB', 
    icon: 'repeat',
    unit: 'spm'
  },
  { 
    key: 'steps', 
    title: 'Step Count', 
    color: '#00BFFF', 
    icon: 'walk',
    unit: 'steps'
  },
];

const SetGoalScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [selectedTab, setSelectedTab] = useState('daily');
  const [goals, setGoals] = useState({
    time: { target: 30, finished: 12 },
    speed: { target: 20, finished: 8 },
    calories: { target: 500, finished: 320 },
    distance: { target: 10, finished: 6.5 },
    cadence: { target: 90, finished: 75 },
    steps: { target: 10000, finished: 6500 },
  });
  const [animation] = useState(new Animated.Value(0));

  const animateProgress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  const handleCategoryPress = (key) => {
    const goalType = goalTypes.find(g => g.key === key);
    
    // For Android, we'll use a simpler Alert with a single button
    if (Platform.OS === 'android') {
      Alert.prompt(
        `Set ${goalType.title} Goal`,
        `Enter your ${selectedTab} target in ${goalType.unit}:`,
        (text) => {
          const value = parseFloat(text);
          if (!isNaN(value) && value > 0) {
            setGoals(prev => ({
              ...prev,
              [key]: { ...prev[key], target: value }
            }));
            animateProgress();
          }
        },
        'plain-text',
        '',
        'numeric'
      );
    } else {
      // iOS can use the more complex version
      Alert.prompt(
        `Set ${goalType.title} Goal`,
        `Enter your ${selectedTab} target in ${goalType.unit}:`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Set Goal',
            onPress: (text) => {
              const value = parseFloat(text);
              if (!isNaN(value) && value > 0) {
                setGoals(prev => ({
                  ...prev,
                  [key]: { ...prev[key], target: value }
                }));
                animateProgress();
              }
            },
          },
        ],
        'plain-text',
        '',
        'numeric'
      );
    }
  };

  const filteredGoalTypes = selectedTab === 'all' 
    ? goalTypes 
    : goalTypes.filter(({ key }) => selectedTab === 'daily' || selectedTab === 'weekly');

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4B6CB7', '#182848']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Goals</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['daily', 'weekly', 'all'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setSelectedTab(tab);
                animateProgress();
              }}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Goals Grid */}
        <View style={styles.goalsGrid}>
          {filteredGoalTypes.map(({ key, title, color, icon, unit }) => {
            const progress = goals[key].finished / goals[key].target;
            const percentage = Math.round(progress * 100);
            
            return (
              <TouchableOpacity
                key={key}
                style={styles.goalCard}
                onPress={() => handleCategoryPress(key)}
                activeOpacity={0.8}
              >
                <View style={styles.goalHeader}>
                  <View style={[styles.goalIcon, { backgroundColor: `${color}20` }]}>
                    <MaterialCommunityIcons 
                      name={icon} 
                      size={20} 
                      color={color} 
                    />
                  </View>
                  <Text style={styles.goalTitle}>{title}</Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressCircleContainer}>
                    <Circle
                      size={width * 0.25}
                      progress={progress}
                      color={color}
                      thickness={6}
                      unfilledColor="#f0f0f0"
                      borderWidth={0}
                      strokeCap="round"
                    />
                    <View style={styles.progressTextContainer}>
                      <Text style={styles.progressText}>{percentage}%</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.goalStats}>
                  <Text style={styles.currentValue}>
                    {goals[key].finished}{unit}
                  </Text>
                  <Text style={styles.targetValue}>
                    / {goals[key].target}{unit}
                  </Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: color
                      }
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
            <Text style={styles.tipText}>Set realistic, achievable targets</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
            <Text style={styles.tipText}>Increase goals gradually by 10-15% weekly</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
            <Text style={styles.tipText}>Focus on consistency over intensity</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    paddingTop: Dimensions.get('window').height * 0.06,
    paddingHorizontal: '5%',
    paddingBottom: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: Dimensions.get('window').width * 0.055,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContainer: {
    padding: '5%',
    paddingBottom: '10%',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: '5%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: '3%',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#4B6CB7',
  },
  tabText: {
    fontSize: Dimensions.get('window').width * 0.035,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: Dimensions.get('window').width > 400 ? '48%' : '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
  },
  goalIcon: {
    width: Dimensions.get('window').width * 0.09,
    height: Dimensions.get('window').width * 0.09,
    borderRadius: Dimensions.get('window').width * 0.045,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2%',
  },
  goalTitle: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').width * 0.25,
    marginVertical: '2%',
  },
  progressCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: Dimensions.get('window').width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: '2%',
  },
  currentValue: {
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  targetValue: {
    fontSize: Dimensions.get('window').width * 0.04,
    color: '#666',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginTop: '2%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: Dimensions.get('window').width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: '3%',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2%',
  },
  tipText: {
    fontSize: Dimensions.get('window').width * 0.035,
    color: '#666',
    marginLeft: '2%',
    flex: 1,
  },
});

export default SetGoalScreen;



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   Animated,
//   Easing,
//   Dimensions,
//   useWindowDimensions
// } from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Circle } from 'react-native-progress';

// const goalTypes = [
//   { 
//     key: 'time', 
//     title: 'Time Duration', 
//     color: '#FF6B6B', 
//     icon: 'clock',
//     unit: 'min'
//   },
//   { 
//     key: 'speed', 
//     title: 'Speed', 
//     color: '#4B6CB7', 
//     icon: 'speedometer',
//     unit: 'km/h'
//   },
//   { 
//     key: 'calories', 
//     title: 'Calorie Burn', 
//     color: '#FFA500', 
//     icon: 'fire',
//     unit: 'kcal'
//   },
//   { 
//     key: 'distance', 
//     title: 'Distance', 
//     color: '#32CD32', 
//     icon: 'map-marker-distance',
//     unit: 'km'
//   },
//   { 
//     key: 'cadence', 
//     title: 'Stride Rate', 
//     color: '#9370DB', 
//     icon: 'repeat',
//     unit: 'spm'
//   },
//   { 
//     key: 'steps', 
//     title: 'Step Count', 
//     color: '#00BFFF', 
//     icon: 'walk',
//     unit: 'steps'
//   },
// ];

// const SetGoalScreen = ({ navigation }) => {
//   const { width, height } = useWindowDimensions();
//   const [selectedTab, setSelectedTab] = useState('daily');
//   const [goals, setGoals] = useState({
//     time: { target: 30, finished: 12 },
//     speed: { target: 20, finished: 8 },
//     calories: { target: 500, finished: 320 },
//     distance: { target: 10, finished: 6.5 },
//     cadence: { target: 90, finished: 75 },
//     steps: { target: 10000, finished: 6500 },
//   });
//   const [animation] = useState(new Animated.Value(0));

//   const animateProgress = () => {
//     Animated.timing(animation, {
//       toValue: 1,
//       duration: 800,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true
//     }).start();
//   };

//   const handleCategoryPress = (key) => {
//     Alert.prompt(
//       `Set ${goalTypes.find(g => g.key === key).title} Goal`,
//       `Enter your ${selectedTab} target:`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Set Goal',
//           onPress: (text) => {
//             const value = parseInt(text);
//             if (!isNaN(value) && value > 0) {
//               setGoals(prev => ({
//                 ...prev,
//                 [key]: { ...prev[key], target: value }
//               }));
//               animateProgress();
//             }
//           },
//         },
//       ],
//       'plain-text',
//       '',
//       'numeric'
//     );
//   };

//   const filteredGoalTypes = selectedTab === 'all' 
//     ? goalTypes 
//     : goalTypes.filter(({ key }) => selectedTab === 'daily' || selectedTab === 'weekly');

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#4B6CB7', '#182848']}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Feather name="arrow-left" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Set Goals</Text>
//         <View style={{ width: 24 }} />
//       </LinearGradient>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Tabs */}
//         <View style={styles.tabContainer}>
//           {['daily', 'weekly', 'all'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => {
//                 setSelectedTab(tab);
//                 animateProgress();
//               }}
//               style={[
//                 styles.tabButton,
//                 selectedTab === tab && styles.activeTabButton,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   selectedTab === tab && styles.activeTabText,
//                 ]}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Goals Grid */}
//         <View style={styles.goalsGrid}>
//           {filteredGoalTypes.map(({ key, title, color, icon, unit }) => {
//             const progress = goals[key].finished / goals[key].target;
//             const percentage = Math.round(progress * 100);
            
//             return (
//               <TouchableOpacity
//                 key={key}
//                 style={styles.goalCard}
//                 onPress={() => handleCategoryPress(key)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.goalHeader}>
//                   <View style={[styles.goalIcon, { backgroundColor: `${color}20` }]}>
//                     <MaterialCommunityIcons 
//                       name={icon} 
//                       size={20} 
//                       color={color} 
//                     />
//                   </View>
//                   <Text style={styles.goalTitle}>{title}</Text>
//                 </View>
                
//                 <View style={styles.progressContainer}>
//                   <View style={styles.progressCircleContainer}>
//                     <Circle
//                       size={width * 0.25}
//                       progress={progress}
//                       color={color}
//                       thickness={6}
//                       unfilledColor="#f0f0f0"
//                       borderWidth={0}
//                       strokeCap="round"
//                     />
//                     <View style={styles.progressTextContainer}>
//                       <Text style={styles.progressText}>{percentage}%</Text>
//                     </View>
//                   </View>
//                 </View>
                
//                 <View style={styles.goalStats}>
//                   <Text style={styles.currentValue}>
//                     {goals[key].finished}{unit}
//                   </Text>
//                   <Text style={styles.targetValue}>
//                     / {goals[key].target}{unit}
//                   </Text>
//                 </View>
                
//                 <View style={styles.progressBarContainer}>
//                   <View 
//                     style={[
//                       styles.progressBar,
//                       { 
//                         width: `${Math.min(percentage, 100)}%`,
//                         backgroundColor: color
//                       }
//                     ]}
//                   />
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Tips Section */}
//         <View style={styles.tipsCard}>
//           <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
//           <View style={styles.tipItem}>
//             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
//             <Text style={styles.tipText}>Set realistic, achievable targets</Text>
//           </View>
//           <View style={styles.tipItem}>
//             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
//             <Text style={styles.tipText}>Increase goals gradually by 10-15% weekly</Text>
//           </View>
//           <View style={styles.tipItem}>
//             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
//             <Text style={styles.tipText}>Focus on consistency over intensity</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FB',
//   },
//   header: {
//     paddingTop: Dimensions.get('window').height * 0.06,
//     paddingHorizontal: '5%',
//     paddingBottom: '5%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   headerTitle: {
//     fontSize: Dimensions.get('window').width * 0.055,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   scrollContainer: {
//     padding: '5%',
//     paddingBottom: '10%',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#E0E0E0',
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: '5%',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: '3%',
//     alignItems: 'center',
//   },
//   activeTabButton: {
//     backgroundColor: '#4B6CB7',
//   },
//   tabText: {
//     fontSize: Dimensions.get('window').width * 0.035,
//     fontWeight: '600',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   goalsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   goalCard: {
//     width: Dimensions.get('window').width > 400 ? '48%' : '100%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '4%',
//     marginBottom: '4%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   goalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: '3%',
//   },
//   goalIcon: {
//     width: Dimensions.get('window').width * 0.09,
//     height: Dimensions.get('window').width * 0.09,
//     borderRadius: Dimensions.get('window').width * 0.045,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: '2%',
//   },
//   goalTitle: {
//     fontSize: Dimensions.get('window').width * 0.04,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//   },
//   progressContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: Dimensions.get('window').width * 0.25,
//     marginVertical: '2%',
//   },
//   progressCircleContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   progressTextContainer: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   progressText: {
//     fontSize: Dimensions.get('window').width * 0.045,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   goalStats: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     justifyContent: 'center',
//     marginBottom: '2%',
//   },
//   currentValue: {
//     fontSize: Dimensions.get('window').width * 0.05,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   targetValue: {
//     fontSize: Dimensions.get('window').width * 0.04,
//     color: '#666',
//   },
//   progressBarContainer: {
//     height: 6,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressBar: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   tipsCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '4%',
//     marginTop: '2%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   tipsTitle: {
//     fontSize: Dimensions.get('window').width * 0.045,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: '3%',
//   },
//   tipItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: '2%',
//   },
//   tipText: {
//     fontSize: Dimensions.get('window').width * 0.035,
//     color: '#666',
//     marginLeft: '2%',
//     flex: 1,
//   },
// });

// export default SetGoalScreen;

// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ScrollView,
// //   StyleSheet,
// //   Alert,
// //   Animated,
// //   Easing,
// //   Dimensions,
// //   useWindowDimensions
// // } from 'react-native';
// // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { Circle } from 'react-native-progress';

// // const goalTypes = [
// //   { 
// //     key: 'time', 
// //     title: 'Time Duration', 
// //     color: '#FF6B6B', 
// //     icon: 'clock',
// //     unit: 'min'
// //   },
// //   { 
// //     key: 'speed', 
// //     title: 'Speed', 
// //     color: '#4B6CB7', 
// //     icon: 'speedometer',
// //     unit: 'km/h'
// //   },
// //   { 
// //     key: 'calories', 
// //     title: 'Calorie Burn', 
// //     color: '#FFA500', 
// //     icon: 'fire',
// //     unit: 'kcal'
// //   },
// //   { 
// //     key: 'distance', 
// //     title: 'Distance', 
// //     color: '#32CD32', 
// //     icon: 'map-marker-distance',
// //     unit: 'km'
// //   },
// //   { 
// //     key: 'cadence', 
// //     title: 'Stride Rate', 
// //     color: '#9370DB', 
// //     icon: 'repeat',
// //     unit: 'spm'
// //   },
// //   { 
// //     key: 'steps', 
// //     title: 'Step Count', 
// //     color: '#00BFFF', 
// //     icon: 'walk',
// //     unit: 'steps'
// //   },
// // ];

// // const SetGoalScreen = ({ navigation }) => {
// //   const { width, height } = useWindowDimensions();
// //   const [selectedTab, setSelectedTab] = useState('daily');
// //   const [goals, setGoals] = useState({
// //     time: { target: 30, finished: 12 },
// //     speed: { target: 20, finished: 8 },
// //     calories: { target: 500, finished: 320 },
// //     distance: { target: 10, finished: 6.5 },
// //     cadence: { target: 90, finished: 75 },
// //     steps: { target: 10000, finished: 6500 },
// //   });
// //   const [animation] = useState(new Animated.Value(0));

// //   const animateProgress = () => {
// //     Animated.timing(animation, {
// //       toValue: 1,
// //       duration: 800,
// //       easing: Easing.out(Easing.ease),
// //       useNativeDriver: true
// //     }).start();
// //   };

// //   const handleCategoryPress = (key) => {
// //     Alert.prompt(
// //       `Set ${goalTypes.find(g => g.key === key).title} Goal`,
// //       `Enter your ${selectedTab} target:`,
// //       [
// //         {
// //           text: 'Cancel',
// //           style: 'cancel',
// //         },
// //         {
// //           text: 'Set Goal',
// //           onPress: (text) => {
// //             const value = parseInt(text);
// //             if (!isNaN(value) && value > 0) {
// //               setGoals(prev => ({
// //                 ...prev,
// //                 [key]: { ...prev[key], target: value }
// //               }));
// //               animateProgress();
// //             }
// //           },
// //         },
// //       ],
// //       'plain-text',
// //       '',
// //       'numeric'
// //     );
// //   };

// //   const filteredGoalTypes = selectedTab === 'all' 
// //     ? goalTypes 
// //     : goalTypes.filter(({ key }) => selectedTab === 'daily' || selectedTab === 'weekly');

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <LinearGradient
// //         colors={['#4B6CB7', '#182848']}
// //         style={styles.header}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //       >
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Feather name="arrow-left" size={24} color="#fff" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Set Goals</Text>
// //         <View style={{ width: 24 }} />
// //       </LinearGradient>

// //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// //         {/* Tabs */}
// //         <View style={styles.tabContainer}>
// //           {['daily', 'weekly', 'all'].map((tab) => (
// //             <TouchableOpacity
// //               key={tab}
// //               onPress={() => {
// //                 setSelectedTab(tab);
// //                 animateProgress();
// //               }}
// //               style={[
// //                 styles.tabButton,
// //                 selectedTab === tab && styles.activeTabButton,
// //               ]}
// //             >
// //               <Text
// //                 style={[
// //                   styles.tabText,
// //                   selectedTab === tab && styles.activeTabText,
// //                 ]}
// //               >
// //                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //               </Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* Goals Grid */}
// //         <View style={styles.goalsGrid}>
// //           {filteredGoalTypes.map(({ key, title, color, icon, unit }) => {
// //             const progress = goals[key].finished / goals[key].target;
// //             const percentage = Math.round(progress * 100);
            
// //             return (
// //               <TouchableOpacity
// //                 key={key}
// //                 style={styles.goalCard}
// //                 onPress={() => handleCategoryPress(key)}
// //                 activeOpacity={0.8}
// //               >
// //                 <View style={styles.goalHeader}>
// //                   <View style={[styles.goalIcon, { backgroundColor: `${color}20` }]}>
// //                     <MaterialCommunityIcons 
// //                       name={icon} 
// //                       size={20} 
// //                       color={color} 
// //                     />
// //                   </View>
// //                   <Text style={styles.goalTitle}>{title}</Text>
// //                 </View>
                
// //                 <View style={styles.progressContainer}>
// //                   <View style={styles.progressCircleContainer}>
// //                     <Circle
// //                       size={width * 0.25}
// //                       progress={progress}
// //                       color={color}
// //                       thickness={6}
// //                       unfilledColor="#f0f0f0"
// //                       borderWidth={0}
// //                       strokeCap="round"
// //                     />
// //                     <View style={styles.progressTextContainer}>
// //                       <Text style={styles.progressText}>{percentage}%</Text>
// //                     </View>
// //                   </View>
// //                 </View>
                
// //                 <View style={styles.goalStats}>
// //                   <Text style={styles.currentValue}>
// //                     {goals[key].finished}{unit}
// //                   </Text>
// //                   <Text style={styles.targetValue}>
// //                     / {goals[key].target}{unit}
// //                   </Text>
// //                 </View>
                
// //                 <View style={styles.progressBarContainer}>
// //                   <View 
// //                     style={[
// //                       styles.progressBar,
// //                       { 
// //                         width: `${Math.min(percentage, 100)}%`,
// //                         backgroundColor: color
// //                       }
// //                     ]}
// //                   />
// //                 </View>
// //               </TouchableOpacity>
// //             );
// //           })}
// //         </View>

// //         {/* Tips Section */}
// //         <View style={styles.tipsCard}>
// //           <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
// //           <View style={styles.tipItem}>
// //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// //             <Text style={styles.tipText}>Set realistic, achievable targets</Text>
// //           </View>
// //           <View style={styles.tipItem}>
// //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// //             <Text style={styles.tipText}>Increase goals gradually by 10-15% weekly</Text>
// //           </View>
// //           <View style={styles.tipItem}>
// //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// //             <Text style={styles.tipText}>Focus on consistency over intensity</Text>
// //           </View>
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F5F7FB',
// //   },
// //   header: {
// //     paddingTop: Dimensions.get('window').height * 0.06,
// //     paddingHorizontal: '5%',
// //     paddingBottom: '5%',
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     borderBottomLeftRadius: 20,
// //     borderBottomRightRadius: 20,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 8,
// //     elevation: 8,
// //   },
// //   headerTitle: {
// //     fontSize: Dimensions.get('window').width * 0.055,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   scrollContainer: {
// //     padding: '5%',
// //     paddingBottom: '10%',
// //   },
// //   tabContainer: {
// //     flexDirection: 'row',
// //     backgroundColor: '#E0E0E0',
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //     marginBottom: '5%',
// //   },
// //   tabButton: {
// //     flex: 1,
// //     paddingVertical: '3%',
// //     alignItems: 'center',
// //   },
// //   activeTabButton: {
// //     backgroundColor: '#4B6CB7',
// //   },
// //   tabText: {
// //     fontSize: Dimensions.get('window').width * 0.035,
// //     fontWeight: '600',
// //     color: '#666',
// //   },
// //   activeTabText: {
// //     color: '#fff',
// //   },
// //   goalsGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //   },
// //   goalCard: {
// //     width: Dimensions.get('window').width > 400 ? '48%' : '100%',
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: '4%',
// //     marginBottom: '4%',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //     elevation: 3,
// //   },
// //   goalHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: '3%',
// //   },
// //   goalIcon: {
// //     width: Dimensions.get('window').width * 0.09,
// //     height: Dimensions.get('window').width * 0.09,
// //     borderRadius: Dimensions.get('window').width * 0.045,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: '2%',
// //   },
// //   goalTitle: {
// //     fontSize: Dimensions.get('window').width * 0.04,
// //     fontWeight: '600',
// //     color: '#333',
// //     flex: 1,
// //   },
// //   progressContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     height: Dimensions.get('window').width * 0.25,
// //     marginVertical: '2%',
// //   },
// //   progressCircleContainer: {
// //     position: 'relative',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   progressTextContainer: {
// //     position: 'absolute',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   progressText: {
// //     fontSize: Dimensions.get('window').width * 0.045,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   goalStats: {
// //     flexDirection: 'row',
// //     alignItems: 'baseline',
// //     justifyContent: 'center',
// //     marginBottom: '2%',
// //   },
// //   currentValue: {
// //     fontSize: Dimensions.get('window').width * 0.05,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   targetValue: {
// //     fontSize: Dimensions.get('window').width * 0.04,
// //     color: '#666',
// //   },
// //   progressBarContainer: {
// //     height: 6,
// //     backgroundColor: '#f0f0f0',
// //     borderRadius: 3,
// //     overflow: 'hidden',
// //   },
// //   progressBar: {
// //     height: '100%',
// //     borderRadius: 3,
// //   },
// //   tipsCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: '4%',
// //     marginTop: '2%',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //     elevation: 3,
// //   },
// //   tipsTitle: {
// //     fontSize: Dimensions.get('window').width * 0.045,
// //     fontWeight: '600',
// //     color: '#333',
// //     marginBottom: '3%',
// //   },
// //   tipItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: '2%',
// //   },
// //   tipText: {
// //     fontSize: Dimensions.get('window').width * 0.035,
// //     color: '#666',
// //     marginLeft: '2%',
// //     flex: 1,
// //   },
// // });

// // export default SetGoalScreen;



// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   StyleSheet,
// // //   Alert,
// // //   Animated,
// // //   Easing,
// // //   Dimensions,
// // //   useWindowDimensions
// // // } from 'react-native';
// // // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // // import { LinearGradient } from 'expo-linear-gradient';
// // // import { Circle } from 'react-native-progress';

// // // const goalTypes = [
// // //   { 
// // //     key: 'time', 
// // //     title: 'Time Duration', 
// // //     color: '#FF6B6B', 
// // //     icon: 'clock',
// // //     unit: 'min'
// // //   },
// // //   { 
// // //     key: 'speed', 
// // //     title: 'Speed', 
// // //     color: '#4B6CB7', 
// // //     icon: 'speedometer',
// // //     unit: 'km/h'
// // //   },
// // //   { 
// // //     key: 'calories', 
// // //     title: 'Calorie Burn', 
// // //     color: '#FFA500', 
// // //     icon: 'fire',
// // //     unit: 'kcal'
// // //   },
// // //   { 
// // //     key: 'distance', 
// // //     title: 'Distance', 
// // //     color: '#32CD32', 
// // //     icon: 'map-marker-distance',
// // //     unit: 'km'
// // //   },
// // //   { 
// // //     key: 'cadence', 
// // //     title: 'Stride Rate', 
// // //     color: '#9370DB', 
// // //     icon: 'repeat',
// // //     unit: 'spm'
// // //   },
// // //   { 
// // //     key: 'steps', 
// // //     title: 'Step Count', 
// // //     color: '#00BFFF', 
// // //     icon: 'walk',
// // //     unit: 'steps'
// // //   },
// // // ];

// // // const SetGoalScreen = ({ navigation }) => {
// // //   const { width, height } = useWindowDimensions();
// // //   const [selectedTab, setSelectedTab] = useState('daily');
// // //   const [goals, setGoals] = useState({
// // //     time: { target: 30, finished: 12 },
// // //     speed: { target: 20, finished: 8 },
// // //     calories: { target: 500, finished: 320 },
// // //     distance: { target: 10, finished: 6.5 },
// // //     cadence: { target: 90, finished: 75 },
// // //     steps: { target: 10000, finished: 6500 },
// // //   });
// // //   const [animation] = useState(new Animated.Value(0));

// // //   const animateProgress = () => {
// // //     Animated.timing(animation, {
// // //       toValue: 1,
// // //       duration: 800,
// // //       easing: Easing.out(Easing.ease),
// // //       useNativeDriver: true
// // //     }).start();
// // //   };

// // //   const handleCategoryPress = (key) => {
// // //     Alert.prompt(
// // //       `Set ${goalTypes.find(g => g.key === key).title} Goal`,
// // //       `Enter your ${selectedTab} target:`,
// // //       [
// // //         {
// // //           text: 'Cancel',
// // //           style: 'cancel',
// // //         },
// // //         {
// // //           text: 'Set Goal',
// // //           onPress: (text) => {
// // //             const value = parseInt(text);
// // //             if (!isNaN(value) && value > 0) {
// // //               setGoals(prev => ({
// // //                 ...prev,
// // //                 [key]: { ...prev[key], target: value }
// // //               }));
// // //               animateProgress();
// // //             }
// // //           },
// // //         },
// // //       ],
// // //       'plain-text',
// // //       '',
// // //       'numeric'
// // //     );
// // //   };

// // //   const filteredGoalTypes = selectedTab === 'all' 
// // //     ? goalTypes 
// // //     : goalTypes.filter(({ key }) => selectedTab === 'daily' || selectedTab === 'weekly');

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Header */}
// // //       <LinearGradient
// // //         colors={['#4B6CB7', '#182848']}
// // //         style={styles.header}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 0 }}
// // //       >
// // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // //           <Feather name="arrow-left" size={24} color="#fff" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>Set Goals</Text>
// // //         <View style={{ width: 24 }} />
// // //       </LinearGradient>

// // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// // //         {/* Tabs */}
// // //         <View style={styles.tabContainer}>
// // //           {['daily', 'weekly', 'all'].map((tab) => (
// // //             <TouchableOpacity
// // //               key={tab}
// // //               onPress={() => {
// // //                 setSelectedTab(tab);
// // //                 animateProgress();
// // //               }}
// // //               style={[
// // //                 styles.tabButton,
// // //                 selectedTab === tab && styles.activeTabButton,
// // //               ]}
// // //             >
// // //               <Text
// // //                 style={[
// // //                   styles.tabText,
// // //                   selectedTab === tab && styles.activeTabText,
// // //                 ]}
// // //               >
// // //                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </View>

// // //         {/* Goals Grid */}
// // //         <View style={styles.goalsGrid}>
// // //           {filteredGoalTypes.map(({ key, title, color, icon, unit }) => {
// // //             const progress = goals[key].finished / goals[key].target;
// // //             const percentage = Math.round(progress * 100);
            
// // //             return (
// // //               <TouchableOpacity
// // //                 key={key}
// // //                 style={styles.goalCard}
// // //                 onPress={() => handleCategoryPress(key)}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <View style={styles.goalHeader}>
// // //                   <View style={[styles.goalIcon, { backgroundColor: `${color}20` }]}>
// // //                     <MaterialCommunityIcons 
// // //                       name={icon} 
// // //                       size={20} 
// // //                       color={color} 
// // //                     />
// // //                   </View>
// // //                   <Text style={styles.goalTitle}>{title}</Text>
// // //                 </View>
                
// // //                 <View style={styles.progressContainer}>
// // //                   <View style={styles.progressCircleContainer}>
// // //                     <Circle
// // //                       size={width * 0.25}
// // //                       progress={progress}
// // //                       color={color}
// // //                       thickness={6}
// // //                       unfilledColor="#f0f0f0"
// // //                       borderWidth={0}
// // //                       strokeCap="round"
// // //                     />
// // //                     <View style={styles.progressTextContainer}>
// // //                       <Text style={styles.progressText}>{percentage}%</Text>
// // //                     </View>
// // //                   </View>
// // //                 </View>
                
// // //                 <View style={styles.goalStats}>
// // //                   <Text style={styles.currentValue}>
// // //                     {goals[key].finished}{unit}
// // //                   </Text>
// // //                   <Text style={styles.targetValue}>
// // //                     / {goals[key].target}{unit}
// // //                   </Text>
// // //                 </View>
                
// // //                 <View style={styles.progressBarContainer}>
// // //                   <View 
// // //                     style={[
// // //                       styles.progressBar,
// // //                       { 
// // //                         width: `${Math.min(percentage, 100)}%`,
// // //                         backgroundColor: color
// // //                       }
// // //                     ]}
// // //                   />
// // //                 </View>
// // //               </TouchableOpacity>
// // //             );
// // //           })}
// // //         </View>

// // //         {/* Tips Section */}
// // //         <View style={styles.tipsCard}>
// // //           <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
// // //           <View style={styles.tipItem}>
// // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // //             <Text style={styles.tipText}>Set realistic, achievable targets</Text>
// // //           </View>
// // //           <View style={styles.tipItem}>
// // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // //             <Text style={styles.tipText}>Increase goals gradually by 10-15% weekly</Text>
// // //           </View>
// // //           <View style={styles.tipItem}>
// // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // //             <Text style={styles.tipText}>Focus on consistency over intensity</Text>
// // //           </View>
// // //         </View>
// // //       </ScrollView>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F5F7FB',
// // //   },
// // //   header: {
// // //     paddingTop: Dimensions.get('window').height * 0.06,
// // //     paddingHorizontal: '5%',
// // //     paddingBottom: '5%',
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     borderBottomLeftRadius: 20,
// // //     borderBottomRightRadius: 20,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 8,
// // //   },
// // //   headerTitle: {
// // //     fontSize: Dimensions.get('window').width * 0.055,
// // //     fontWeight: '600',
// // //     color: '#fff',
// // //   },
// // //   scrollContainer: {
// // //     padding: '5%',
// // //     paddingBottom: '10%',
// // //   },
// // //   tabContainer: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#E0E0E0',
// // //     borderRadius: 12,
// // //     overflow: 'hidden',
// // //     marginBottom: '5%',
// // //   },
// // //   tabButton: {
// // //     flex: 1,
// // //     paddingVertical: '3%',
// // //     alignItems: 'center',
// // //   },
// // //   activeTabButton: {
// // //     backgroundColor: '#4B6CB7',
// // //   },
// // //   tabText: {
// // //     fontSize: Dimensions.get('window').width * 0.035,
// // //     fontWeight: '600',
// // //     color: '#666',
// // //   },
// // //   activeTabText: {
// // //     color: '#fff',
// // //   },
// // //   goalsGrid: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     justifyContent: 'space-between',
// // //   },
// // //   goalCard: {
// // //     width: Dimensions.get('window').width > 400 ? '48%' : '100%',
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: '4%',
// // //     marginBottom: '4%',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 6,
// // //     elevation: 3,
// // //   },
// // //   goalHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: '3%',
// // //   },
// // //   goalIcon: {
// // //     width: Dimensions.get('window').width * 0.09,
// // //     height: Dimensions.get('window').width * 0.09,
// // //     borderRadius: Dimensions.get('window').width * 0.045,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: '2%',
// // //   },
// // //   goalTitle: {
// // //     fontSize: Dimensions.get('window').width * 0.04,
// // //     fontWeight: '600',
// // //     color: '#333',
// // //     flex: 1,
// // //   },
// // //   progressContainer: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     height: Dimensions.get('window').width * 0.25,
// // //     marginVertical: '2%',
// // //   },
// // //   progressCircleContainer: {
// // //     position: 'relative',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   progressTextContainer: {
// // //     position: 'absolute',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   progressText: {
// // //     fontSize: Dimensions.get('window').width * 0.045,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   goalStats: {
// // //     flexDirection: 'row',
// // //     alignItems: 'baseline',
// // //     justifyContent: 'center',
// // //     marginBottom: '2%',
// // //   },
// // //   currentValue: {
// // //     fontSize: Dimensions.get('window').width * 0.05,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   targetValue: {
// // //     fontSize: Dimensions.get('window').width * 0.04,
// // //     color: '#666',
// // //   },
// // //   progressBarContainer: {
// // //     height: 6,
// // //     backgroundColor: '#f0f0f0',
// // //     borderRadius: 3,
// // //     overflow: 'hidden',
// // //   },
// // //   progressBar: {
// // //     height: '100%',
// // //     borderRadius: 3,
// // //   },
// // //   tipsCard: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: '4%',
// // //     marginTop: '2%',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 6,
// // //     elevation: 3,
// // //   },
// // //   tipsTitle: {
// // //     fontSize: Dimensions.get('window').width * 0.045,
// // //     fontWeight: '600',
// // //     color: '#333',
// // //     marginBottom: '3%',
// // //   },
// // //   tipItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: '2%',
// // //   },
// // //   tipText: {
// // //     fontSize: Dimensions.get('window').width * 0.035,
// // //     color: '#666',
// // //     marginLeft: '2%',
// // //     flex: 1,
// // //   },
// // // });

// // // export default SetGoalScreen;






// // // // import React, { useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   ScrollView,
// // // //   StyleSheet,
// // // //   Alert,
// // // //   Animated,
// // // //   Easing,
// // // //   Dimensions,
// // // //   useWindowDimensions
// // // // } from 'react-native';
// // // // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // // // import { LinearGradient } from 'expo-linear-gradient';
// // // // import { Circle } from 'react-native-progress';

// // // // const goalTypes = [
// // // //   { 
// // // //     key: 'time', 
// // // //     title: 'Time Duration', 
// // // //     color: '#FF6B6B', 
// // // //     icon: 'clock',
// // // //     unit: 'min'
// // // //   },
// // // //   { 
// // // //     key: 'speed', 
// // // //     title: 'Speed', 
// // // //     color: '#4B6CB7', 
// // // //     icon: 'speedometer',
// // // //     unit: 'km/h'
// // // //   },
// // // //   { 
// // // //     key: 'calories', 
// // // //     title: 'Calorie Burn', 
// // // //     color: '#FFA500', 
// // // //     icon: 'fire',
// // // //     unit: 'kcal'
// // // //   },
// // // //   { 
// // // //     key: 'distance', 
// // // //     title: 'Distance', 
// // // //     color: '#32CD32', 
// // // //     icon: 'map-marker-distance',
// // // //     unit: 'km'
// // // //   },
// // // //   { 
// // // //     key: 'cadence', 
// // // //     title: 'Stride Rate', 
// // // //     color: '#9370DB', 
// // // //     icon: 'repeat',
// // // //     unit: 'spm'
// // // //   },
// // // //   { 
// // // //     key: 'steps', 
// // // //     title: 'Step Count', 
// // // //     color: '#00BFFF', 
// // // //     icon: 'walk',
// // // //     unit: 'steps'
// // // //   },
// // // // ];

// // // // const SetGoalScreen = ({ navigation }) => {
// // // //   const { width, height } = useWindowDimensions();
// // // //   const [selectedTab, setSelectedTab] = useState('daily');
// // // //   const [goals, setGoals] = useState({
// // // //     time: { target: 30, finished: 12 },
// // // //     speed: { target: 20, finished: 8 },
// // // //     calories: { target: 500, finished: 320 },
// // // //     distance: { target: 10, finished: 6.5 },
// // // //     cadence: { target: 90, finished: 75 },
// // // //     steps: { target: 10000, finished: 6500 },
// // // //   });
// // // //   const [animation] = useState(new Animated.Value(0));

// // // //   const animateProgress = () => {
// // // //     Animated.timing(animation, {
// // // //       toValue: 1,
// // // //       duration: 800,
// // // //       easing: Easing.out(Easing.ease),
// // // //       useNativeDriver: true
// // // //     }).start();
// // // //   };

// // // //   const handleCategoryPress = (key) => {
// // // //     Alert.prompt(
// // // //       `Set ${goalTypes.find(g => g.key === key).title} Goal`,
// // // //       `Enter your ${selectedTab} target:`,
// // // //       [
// // // //         {
// // // //           text: 'Cancel',
// // // //           style: 'cancel',
// // // //         },
// // // //         {
// // // //           text: 'Set Goal',
// // // //           onPress: (text) => {
// // // //             const value = parseInt(text);
// // // //             if (!isNaN(value) && value > 0) {
// // // //               setGoals(prev => ({
// // // //                 ...prev,
// // // //                 [key]: { ...prev[key], target: value }
// // // //               }));
// // // //               animateProgress();
// // // //             }
// // // //           },
// // // //         },
// // // //       ],
// // // //       'plain-text',
// // // //       '',
// // // //       'numeric'
// // // //     );
// // // //   };

// // // //   const filteredGoalTypes = selectedTab === 'all' 
// // // //     ? goalTypes 
// // // //     : goalTypes.filter(({ key }) => selectedTab === 'daily' || selectedTab === 'weekly');

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       {/* Header */}
// // // //       <LinearGradient
// // // //         colors={['#4B6CB7', '#182848']}
// // // //         style={styles.header}
// // // //         start={{ x: 0, y: 0 }}
// // // //         end={{ x: 1, y: 0 }}
// // // //       >
// // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // //           <Feather name="arrow-left" size={24} color="#fff" />
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.headerTitle}>Set Goals</Text>
// // // //         <View style={{ width: 24 }} />
// // // //       </LinearGradient>

// // // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// // // //         {/* Tabs */}
// // // //         <View style={styles.tabContainer}>
// // // //           {['daily', 'weekly', 'all'].map((tab) => (
// // // //             <TouchableOpacity
// // // //               key={tab}
// // // //               onPress={() => {
// // // //                 setSelectedTab(tab);
// // // //                 animateProgress();
// // // //               }}
// // // //               style={[
// // // //                 styles.tabButton,
// // // //                 selectedTab === tab && styles.activeTabButton,
// // // //               ]}
// // // //             >
// // // //               <Text
// // // //                 style={[
// // // //                   styles.tabText,
// // // //                   selectedTab === tab && styles.activeTabText,
// // // //                 ]}
// // // //               >
// // // //                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //           ))}
// // // //         </View>

// // // //         {/* Goals Grid */}
// // // //         <View style={styles.goalsGrid}>
// // // //           {filteredGoalTypes.map(({ key, title, color, icon, unit }) => {
// // // //             const progress = goals[key].finished / goals[key].target;
// // // //             const percentage = Math.round(progress * 100);
            
// // // //             return (
// // // //               <TouchableOpacity
// // // //                 key={key}
// // // //                 style={styles.goalCard}
// // // //                 onPress={() => handleCategoryPress(key)}
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <View style={styles.goalHeader}>
// // // //                   <View style={[styles.goalIcon, { backgroundColor: `${color}20` }]}>
// // // //                     <MaterialCommunityIcons 
// // // //                       name={icon} 
// // // //                       size={20} 
// // // //                       color={color} 
// // // //                     />
// // // //                   </View>
// // // //                   <Text style={styles.goalTitle}>{title}</Text>
// // // //                 </View>
                
// // // //                 <View style={styles.progressContainer}>
// // // //                   <View style={styles.progressCircleContainer}>
// // // //                     <Circle
// // // //                       size={width * 0.25}
// // // //                       progress={progress}
// // // //                       color={color}
// // // //                       thickness={6}
// // // //                       unfilledColor="#f0f0f0"
// // // //                       borderWidth={0}
// // // //                       strokeCap="round"
// // // //                     />
// // // //                     <View style={styles.progressTextContainer}>
// // // //                       <Text style={styles.progressText}>{percentage}%</Text>
// // // //                     </View>
// // // //                   </View>
// // // //                 </View>
                
// // // //                 <View style={styles.goalStats}>
// // // //                   <Text style={styles.currentValue}>
// // // //                     {goals[key].finished}{unit}
// // // //                   </Text>
// // // //                   <Text style={styles.targetValue}>
// // // //                     / {goals[key].target}{unit}
// // // //                   </Text>
// // // //                 </View>
                
// // // //                 <View style={styles.progressBarContainer}>
// // // //                   <View 
// // // //                     style={[
// // // //                       styles.progressBar,
// // // //                       { 
// // // //                         width: `${Math.min(percentage, 100)}%`,
// // // //                         backgroundColor: color
// // // //                       }
// // // //                     ]}
// // // //                   />
// // // //                 </View>
// // // //               </TouchableOpacity>
// // // //             );
// // // //           })}
// // // //         </View>

// // // //         {/* Tips Section */}
// // // //         <View style={styles.tipsCard}>
// // // //           <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
// // // //           <View style={styles.tipItem}>
// // // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // // //             <Text style={styles.tipText}>Set realistic, achievable targets</Text>
// // // //           </View>
// // // //           <View style={styles.tipItem}>
// // // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // // //             <Text style={styles.tipText}>Increase goals gradually by 10-15% weekly</Text>
// // // //           </View>
// // // //           <View style={styles.tipItem}>
// // // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // // //             <Text style={styles.tipText}>Focus on consistency over intensity</Text>
// // // //           </View>
// // // //         </View>
// // // //       </ScrollView>
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#F5F7FB',
// // // //   },
// // // //   header: {
// // // //     paddingTop: Dimensions.get('window').height * 0.06,
// // // //     paddingHorizontal: '5%',
// // // //     paddingBottom: '5%',
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     borderBottomLeftRadius: 20,
// // // //     borderBottomRightRadius: 20,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 8,
// // // //     elevation: 8,
// // // //   },
// // // //   headerTitle: {
// // // //     fontSize: Dimensions.get('window').width * 0.055,
// // // //     fontWeight: '600',
// // // //     color: '#fff',
// // // //   },
// // // //   scrollContainer: {
// // // //     padding: '5%',
// // // //     paddingBottom: '10%',
// // // //   },
// // // //   tabContainer: {
// // // //     flexDirection: 'row',
// // // //     backgroundColor: '#E0E0E0',
// // // //     borderRadius: 12,
// // // //     overflow: 'hidden',
// // // //     marginBottom: '5%',
// // // //   },
// // // //   tabButton: {
// // // //     flex: 1,
// // // //     paddingVertical: '3%',
// // // //     alignItems: 'center',
// // // //   },
// // // //   activeTabButton: {
// // // //     backgroundColor: '#4B6CB7',
// // // //   },
// // // //   tabText: {
// // // //     fontSize: Dimensions.get('window').width * 0.035,
// // // //     fontWeight: '600',
// // // //     color: '#666',
// // // //   },
// // // //   activeTabText: {
// // // //     color: '#fff',
// // // //   },
// // // //   goalsGrid: {
// // // //     flexDirection: 'row',
// // // //     flexWrap: 'wrap',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   goalCard: {
// // // //     width: Dimensions.get('window').width > 400 ? '48%' : '100%',
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 16,
// // // //     padding: '4%',
// // // //     marginBottom: '4%',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 6,
// // // //     elevation: 3,
// // // //   },
// // // //   goalHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: '3%',
// // // //   },
// // // //   goalIcon: {
// // // //     width: Dimensions.get('window').width * 0.09,
// // // //     height: Dimensions.get('window').width * 0.09,
// // // //     borderRadius: Dimensions.get('window').width * 0.045,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: '2%',
// // // //   },
// // // //   goalTitle: {
// // // //     fontSize: Dimensions.get('window').width * 0.04,
// // // //     fontWeight: '600',
// // // //     color: '#333',
// // // //     flex: 1,
// // // //   },
// // // //   progressContainer: {
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     height: Dimensions.get('window').width * 0.25,
// // // //     marginVertical: '2%',
// // // //   },
// // // //   progressCircleContainer: {
// // // //     position: 'relative',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   progressTextContainer: {
// // // //     position: 'absolute',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   progressText: {
// // // //     fontSize: Dimensions.get('window').width * 0.045,
// // // //     fontWeight: 'bold',
// // // //     color: '#333',
// // // //   },
// // // //   goalStats: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'baseline',
// // // //     justifyContent: 'center',
// // // //     marginBottom: '2%',
// // // //   },
// // // //   currentValue: {
// // // //     fontSize: Dimensions.get('window').width * 0.05,
// // // //     fontWeight: 'bold',
// // // //     color: '#333',
// // // //   },
// // // //   targetValue: {
// // // //     fontSize: Dimensions.get('window').width * 0.04,
// // // //     color: '#666',
// // // //   },
// // // //   progressBarContainer: {
// // // //     height: 6,
// // // //     backgroundColor: '#f0f0f0',
// // // //     borderRadius: 3,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   progressBar: {
// // // //     height: '100%',
// // // //     borderRadius: 3,
// // // //   },
// // // //   tipsCard: {
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 16,
// // // //     padding: '4%',
// // // //     marginTop: '2%',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 6,
// // // //     elevation: 3,
// // // //   },
// // // //   tipsTitle: {
// // // //     fontSize: Dimensions.get('window').width * 0.045,
// // // //     fontWeight: '600',
// // // //     color: '#333',
// // // //     marginBottom: '3%',
// // // //   },
// // // //   tipItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: '2%',
// // // //   },
// // // //   tipText: {
// // // //     fontSize: Dimensions.get('window').width * 0.035,
// // // //     color: '#666',
// // // //     marginLeft: '2%',
// // // //     flex: 1,
// // // //   },
// // // // });

// // // // export default SetGoalScreen;