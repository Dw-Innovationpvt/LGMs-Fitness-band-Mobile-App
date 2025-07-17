import React, { useState, useEffect } from 'react';
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
  Platform,
  Modal,
  TextInput,
  Switch,
  FlatList
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle } from 'react-native-progress';
import * as Notifications from 'expo-notifications';

const goalTypes = [
  { 
    key: 'time', 
    title: 'Time Duration', 
    color: '#FF6B6B', 
    icon: 'clock',
    unit: 'min',
    category: 'skating'
  },
  { 
    key: 'speed', 
    title: 'Speed', 
    color: '#4B6CB7', 
    icon: 'speedometer',
    unit: 'km/h',
    category: 'skating'
  },
  { 
    key: 'calories', 
    title: 'Calorie Burn', 
    color: '#FFA500', 
    icon: 'fire',
    unit: 'kcal',
    category: 'both'
  },
  { 
    key: 'distance', 
    title: 'Distance', 
    color: '#32CD32', 
    icon: 'map-marker-distance',
    unit: 'km',
    category: 'skating'
  },
  { 
    key: 'cadence', 
    title: 'Stride Rate', 
    color: '#9370DB', 
    icon: 'repeat',
    unit: 'spm',
    category: 'skating'
  },
  { 
    key: 'steps', 
    title: 'Step Count', 
    color: '#00BFFF', 
    icon: 'walk',
    unit: 'steps',
    category: 'both'
  },
  { 
    key: 'hydration', 
    title: 'Water Intake', 
    color: '#1E90FF', 
    icon: 'cup-water',
    unit: 'ml',
    category: 'health'
  },
  { 
    key: 'sleep', 
    title: 'Sleep Duration', 
    color: '#8A2BE2', 
    icon: 'sleep',
    unit: 'hours',
    category: 'health'
  },
  { 
    key: 'weight', 
    title: 'Weight Goal', 
    color: '#FF6347', 
    icon: 'scale',
    unit: 'kg',
    category: 'health'
  },
];

const skatingTemplates = [
  { title: "Beginner Skate Routine", goals: { distance: 5, time: 30, cadence: 80 } },
  { title: "Speed Training", goals: { speed: 25, time: 45 } },
  { title: "Endurance Challenge", goals: { distance: 15, time: 90 } }
];

const healthTemplates = [
  { title: "Hydration Boost", goals: { hydration: 3000 } },
  { title: "Sleep Improvement", goals: { sleep: 8 } },
  { title: "Weekly Activity", goals: { steps: 70 } }  
];

const badges = {
  streak: [
    { id: 1, name: "3-Day Streak", icon: "fire", threshold: 3 },
    { id: 2, name: "7-Day Streak", icon: "fire", threshold: 7 },
    { id: 3, name: "30-Day Streak", icon: "fire", threshold: 30 }
  ],
  skating: [
    { id: 4, name: "Speed Demon", icon: "lightning-bolt", threshold: 30 },
    { id: 5, name: "Cadence Master", icon: "repeat", threshold: 100 },
    { id: 6, name: "Distance King", icon: "map-marker-distance", threshold: 50 }
  ],
  health: [
    { id: 7, name: "Hydration Hero", icon: "cup-water", threshold: 3000 },
    { id: 8, name: "Sleep Champion", icon: "sleep", threshold: 8 },
    { id: 9, name: "Consistency Pro", icon: "calendar-check", threshold: 14 }
  ]
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SetGoalScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [selectedTab, setSelectedTab] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [goals, setGoals] = useState({
    time: { target: 30, finished: 12, history: [12, 15, 18, 20, 22, 25, 28] },
    speed: { target: 20, finished: 8, history: [8, 10, 12, 15, 16, 18, 19] },
    calories: { target: 500, finished: 320, history: [320, 350, 380, 400, 420, 450, 480] },
    distance: { target: 10, finished: 6.5, history: [6.5, 7, 7.5, 8, 8.5, 9, 9.5] },
    cadence: { target: 90, finished: 75, history: [75, 78, 80, 82, 85, 88, 89] },
    steps: { target: 10000, finished: 6500, history: [6500, 7000, 7500, 8000, 8500, 9000, 9500] },
    hydration: { target: 2000, finished: 1200, history: [1200, 1400, 1600, 1800, 1900, 1950, 2000] },
    sleep: { target: 8, finished: 6.5, history: [6.5, 7, 7.5, 7.5, 8, 8, 8] },
    weight: { target: 70, finished: 75, history: [75, 74.5, 74, 73.5, 73, 72.5, 72] }
  });
  const [animation] = useState(new Animated.Value(0));
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNotes, setCurrentNotes] = useState("");
  const [currentGoalKey, setCurrentGoalKey] = useState("");
  const [repeatDays, setRepeatDays] = useState([false, false, false, false, false, false, false]);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [streakCount, setStreakCount] = useState(5);
  const [earnedBadges, setEarnedBadges] = useState([1, 4, 7]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Request notification permissions
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications for hydration reminders');
      }
    })();
  }, []);

  const animateProgress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  const updateGoal = (key, value) => {
    if (!isNaN(value) && value > 0) {
      setGoals(prev => ({
        ...prev,
        [key]: { 
          ...prev[key], 
          target: value,
          history: [...prev[key].history, value] 
        }
      }));
      animateProgress();
      checkForBadges(key, value);
    }
    setShowAndroidPrompt(false);
    setInputValue('');
  };
const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`.replace('.0k', 'k');
  }
  return num.toString();
};
  const handleCategoryPress = (key) => {
    const goalType = goalTypes.find(g => g.key === key);
    
    // Custom prompts for different goal types
    const getCustomPrompt = () => {
      switch(key) {
        case 'time':
          return `How many minutes do you want to skate ${selectedTab === 'daily' ? 'today' : 'this week'}?`;
        case 'speed':
          return `What's your target ${selectedTab === 'daily' ? 'maximum' : 'average'} speed (km/h)?`;
        case 'distance':
          return `How many kilometers do you want to cover ${selectedTab === 'daily' ? 'today' : 'this week'}?`;
        case 'cadence':
          return `What stride rate (steps/min) are you aiming for?`;
        case 'hydration':
          return `How much water (ml) do you want to drink ${selectedTab === 'daily' ? 'today' : 'this week'}?`;
        case 'sleep':
          return `How many hours of sleep are you targeting ${selectedTab === 'daily' ? 'tonight' : 'nightly average'}?`;
        default:
          return `Enter your ${selectedTab} target in ${goalType.unit}:`;
      }
    };

    // Custom placeholders
    const getPlaceholder = () => {
      switch(key) {
        case 'time': return 'e.g. 30';
        case 'speed': return 'e.g. 20';
        case 'distance': return 'e.g. 5';
        case 'cadence': return 'e.g. 80';
        case 'hydration': return 'e.g. 2000';
        case 'sleep': return 'e.g. 7.5';
        default: return '';
      }
    };

    if (Platform.OS === 'ios') {
      // iOS - Use Alert.prompt with custom UI
      Alert.prompt(
        `Set ${goalType.title} Goal`,
        getCustomPrompt(),
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Set Goal',
            onPress: (text) => {
              const value = parseFloat(text);
              if (!isNaN(value)) {
                updateGoal(key, value);
              }
            },
          },
        ],
        'plain-text',
        getPlaceholder(),
        'numeric'
      );
    } else {
      // Android - Use a custom modal for better UI
      setCurrentGoalKey(key);
      setInputValue('');
      setShowAndroidPrompt(true);
    }
  };

  const checkForBadges = (key, value) => {
    const goalType = goalTypes.find(g => g.key === key);
    const categoryBadges = badges[goalType.category === 'both' ? 'health' : goalType.category];
    
    categoryBadges.forEach(badge => {
      if (value >= badge.threshold && !earnedBadges.includes(badge.id)) {
        setEarnedBadges(prev => [...prev, badge.id]);
        setSelectedBadge(badge);
        setShowBadgeModal(true);
      }
    });
    
    // Check streak badges
    badges.streak.forEach(badge => {
      if (streakCount >= badge.threshold && !earnedBadges.includes(badge.id)) {
        setEarnedBadges(prev => [...prev, badge.id]);
        setSelectedBadge(badge);
        setShowBadgeModal(true);
      }
    });
  };

  const handleTemplateSelect = (template) => {
    setGoals(prev => {
      const newGoals = {...prev};
      Object.keys(template.goals).forEach(key => {
        newGoals[key] = {
          ...newGoals[key],
          target: template.goals[key],
          history: [...newGoals[key].history, template.goals[key]]
        };
      });
      return newGoals;
    });
    setShowTemplateModal(false);
    animateProgress();
  };
   const handleNotesSubmit = () => {
    console.log(`Notes for ${currentGoalKey}: ${currentNotes}`);
    setShowNotesModal(false);
    setCurrentNotes("");
  };

  const toggleDay = (index) => {
    const newDays = [...repeatDays];
    newDays[index] = !newDays[index];
    setRepeatDays(newDays);
  };

  const scheduleHydrationReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (let hour = 8; hour <= 20; hour += 2) {
      const trigger = {
        hour: hour,
        minute: 0,
        repeats: true
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Hydration Reminder",
          body: `Time to drink water! Goal: ${goals.hydration.target}ml today`,
          sound: true,
          data: { goalType: 'hydration' },
        },
        trigger,
      });
    }
  };

  const filteredGoalTypes = () => {
    let filtered = goalTypes;
    
    if (selectedTab === 'all') {
      filtered = filtered.filter(({ key }) => selectedCategory === 'all' || 
        (selectedCategory === 'skating' && ['time', 'speed', 'distance', 'cadence', 'calories'].includes(key)) ||
        (selectedCategory === 'health' && ['hydration', 'sleep', 'weight', 'steps', 'calories'].includes(key)));
    } else {
      filtered = filtered.filter(({ key }) => selectedTab === 'daily' || selectedTab === 'weekly');
    }
    
    if (selectedCategory === 'skating') {
      filtered = filtered.filter(({ category }) => category === 'skating' || category === 'both');
    } else if (selectedCategory === 'health') {
      filtered = filtered.filter(({ category }) => category === 'health' || category === 'both');
    }
    
    return filtered;
  };

  const renderBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'fire': return <FontAwesome name="fire" size={24} color="#FF4500" />;
      case 'lightning-bolt': return <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFD700" />;
      case 'cup-water': return <MaterialCommunityIcons name="cup-water" size={24} color="#1E90FF" />;
      case 'sleep': return <MaterialCommunityIcons name="sleep" size={24} color="#8A2BE2" />;
      case 'calendar-check': return <FontAwesome name="calendar-check-o" size={24} color="#32CD32" />;
      default: return <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />;
    }
  };

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
        <TouchableOpacity onPress={() => setShowTemplateModal(true)}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Category Tabs */}
        <View style={styles.categoryTabContainer}>
          {['skating', 'health'].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => {
                setSelectedCategory(category);
                animateProgress();
              }}
              style={[
                styles.categoryTabButton,
                selectedCategory === category && styles.activeCategoryTabButton,
              ]}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category && styles.activeCategoryTabText,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['daily', 'weekly'].map((tab) => (
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

        {/* Streak Display */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>🔥 {streakCount}-Day Streak!</Text>
          <TouchableOpacity 
            style={styles.badgeButton}
            onPress={() => navigation.navigate('Badges', { badges, earnedBadges })}
          >
            <Text style={styles.badgeButtonText}>View Badges</Text>
          </TouchableOpacity>
        </View>

        {/* Goals Grid */}
        <View style={styles.goalsGrid}>
          {filteredGoalTypes().map(({ key, title, color, icon, unit }) => {
            const progress = goals[key].finished / goals[key].target;
            const percentage = Math.min(Math.round(progress * 100), 100);
            
            return (
              <TouchableOpacity
                key={key}
                style={styles.goalCard}
                onPress={() => handleCategoryPress(key)}
                onLongPress={() => {
                  setCurrentGoalKey(key);
                  setShowNotesModal(true);
                }}
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
                  <TouchableOpacity 
                    onPress={() => {
                      setCurrentGoalKey(key);
                      setShowRepeatModal(true);
                    }}
                  >
                    <Feather name="repeat" size={16} color="#888" />
                  </TouchableOpacity>
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
    {key === 'steps' ? formatNumber(goals[key].finished) : goals[key].finished}{unit}
  </Text>
  <Text style={styles.targetValue}>
    / {key === 'steps' ? formatNumber(goals[key].target) : goals[key].target}{unit}
  </Text>
</View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }
                    ]}
                  />
                </View>

                {/* Mini history graph */}
                <View style={styles.historyGraph}>
                  {goals[key].history.slice(-7).map((value, index) => {
                    const maxValue = Math.max(...goals[key].history);
                    const heightPercent = (value / maxValue) * 100;
                    return (
                      <View key={index} style={styles.historyBarContainer}>
                        <View 
                          style={[
                            styles.historyBar,
                            { 
                              height: `${heightPercent}%`,
                              backgroundColor: color
                            }
                          ]}
                        />
                      </View>
                    );
                  })}
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

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Share My Progress</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Template Selection Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Goal Template</Text>
            
            <Text style={styles.templateSectionTitle}>Skating Templates</Text>
            <FlatList
              data={skatingTemplates}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.templateItem}
                  onPress={() => handleTemplateSelect(item)}
                >
                  <Text style={styles.templateText}>{item.title}</Text>
                  <View style={styles.templateGoals}>
                    {Object.keys(item.goals).map(key => (
                      <Text key={key} style={styles.templateGoalText}>
                        {goalTypes.find(g => g.key === key)?.title}: {item.goals[key]}{goalTypes.find(g => g.key === key)?.unit}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            
            <Text style={styles.templateSectionTitle}>Health Templates</Text>
            <FlatList
              data={healthTemplates}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.templateItem}
                  onPress={() => handleTemplateSelect(item)}
                >
                  <Text style={styles.templateText}>{item.title}</Text>
                  <View style={styles.templateGoals}>
                    {Object.keys(item.goals).map(key => (
                      <Text key={key} style={styles.templateGoalText}>
                        {goalTypes.find(g => g.key === key)?.title}: {item.goals[key]}{goalTypes.find(g => g.key === key)?.unit}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowTemplateModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notes Modal */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session Notes</Text>
            <Text style={styles.notesSubtitle}>{goalTypes.find(g => g.key === currentGoalKey)?.title}</Text>
            
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="How did it go? (e.g., 'Felt great today' or 'Wind resistance slowed me down')"
              value={currentNotes}
              onChangeText={setCurrentNotes}
            />
            
            <View style={styles.notesButtons}>
              <TouchableOpacity 
                style={[styles.notesButton, styles.cancelButton]}
                onPress={() => setShowNotesModal(false)}
              >
                <Text style={styles.notesButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.notesButton, styles.submitButton]}
                onPress={handleNotesSubmit}
              >
                <Text style={styles.notesButtonText}>Save Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Repeat Days Modal */}
      <Modal
        visible={showRepeatModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRepeatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Repeat Settings</Text>
            <Text style={styles.notesSubtitle}>{goalTypes.find(g => g.key === currentGoalKey)?.title}</Text>
            
            <View style={styles.daysContainer}>
              {daysOfWeek.map((day, index) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    repeatDays[index] && styles.dayButtonSelected
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    repeatDays[index] && styles.dayButtonTextSelected
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {currentGoalKey === 'hydration' && (
              <View style={styles.reminderOption}>
                <Text style={styles.reminderText}>Enable Hydration Reminders</Text>
                <Switch 
                  value={repeatDays.some(d => d)}
                  onValueChange={(val) => {
                    if (val) scheduleHydrationReminders();
                    setRepeatDays([val, val, val, val, val, val, val]);
                  }}
                  trackColor={{ false: "#767577", true: "#1E90FF" }}
                  thumbColor={repeatDays.some(d => d) ? "#fff" : "#f4f3f4"}
                />
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowRepeatModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Badge Unlocked Modal */}
      <Modal
        visible={showBadgeModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowBadgeModal(false)}
      >
        <View style={styles.badgeModalOverlay}>
          <View style={styles.badgeModalContent}>
            <View style={styles.badgeIconLarge}>
              {selectedBadge && renderBadgeIcon(selectedBadge.icon)}
            </View>
            <Text style={styles.badgeModalTitle}>Badge Unlocked!</Text>
            <Text style={styles.badgeModalText}>{selectedBadge?.name}</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowBadgeModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Android Goal Input Modal */}
      {Platform.OS === 'android' && (
        <Modal
          visible={showAndroidPrompt}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAndroidPrompt(false)}
        >
          <View style={styles.androidPromptOverlay}>
            <View style={styles.androidPromptContainer}>
              <Text style={styles.androidPromptTitle}>
                Set {goalTypes.find(g => g.key === currentGoalKey)?.title} Goal
              </Text>
              <Text style={styles.androidPromptText}>
                {(() => {
                  switch(currentGoalKey) {
                    case 'time':
                      return `How many minutes do you want to skate ${selectedTab === 'daily' ? 'today' : 'this week'}?`;
                    case 'speed':
                      return `What's your target ${selectedTab === 'daily' ? 'maximum' : 'average'} speed (km/h)?`;
                    case 'distance':
                      return `How many kilometers do you want to cover ${selectedTab === 'daily' ? 'today' : 'this week'}?`;
                    case 'cadence':
                      return `What stride rate (steps/min) are you aiming for?`;
                    case 'hydration':
                      return `How much water (ml) do you want to drink ${selectedTab === 'daily' ? 'today' : 'this week'}?`;
                    case 'sleep':
                      return `How many hours of sleep are you targeting ${selectedTab === 'daily' ? 'tonight' : 'nightly average'}?`;
                    default:
                      return `Enter your ${selectedTab} target in ${goalTypes.find(g => g.key === currentGoalKey)?.unit}:`;
                  }
                })()}
              </Text>
              <TextInput
                style={styles.androidInput}
                keyboardType="numeric"
                placeholder={(() => {
                  switch(currentGoalKey) {
                    case 'time': return 'e.g. 30';
                    case 'speed': return 'e.g. 20';
                    case 'distance': return 'e.g. 5';
                    case 'cadence': return 'e.g. 80';
                    case 'hydration': return 'e.g. 2000';
                    case 'sleep': return 'e.g. 7.5';
                    default: return '';
                  }
                })()}
                value={inputValue}
                onChangeText={setInputValue}
              />
              <View style={styles.androidButtonContainer}>
                <TouchableOpacity
                  style={[styles.androidButton, styles.androidCancelButton]}
                  onPress={() => setShowAndroidPrompt(false)}
                >
                  <Text style={styles.androidButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.androidButton, styles.androidConfirmButton]}
                  onPress={() => updateGoal(currentGoalKey, parseFloat(inputValue))}
                >
                  <Text style={styles.androidButtonText}>Set Goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    marginBottom: Platform.OS === 'android' ? 80 : 80,
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
  categoryTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: '3%',
  },
  categoryTabButton: {
    flex: 1,
    paddingVertical: '3%',
    alignItems: 'center',
  },
  activeCategoryTabButton: {
    backgroundColor: '#4B6CB7',
  },
  categoryTabText: {
    fontSize: Dimensions.get('window').width * 0.035,
    fontWeight: '600',
    color: '#666',
  },
  activeCategoryTabText: {
    color: '#fff',
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
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B6B20',
    borderRadius: 12,
    padding: '3%',
    marginBottom: '5%',
  },
  streakText: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  badgeButton: {
    backgroundColor: '#4B6CB7',
    borderRadius: 20,
    paddingVertical: '2%',
    paddingHorizontal: '4%',
  },
  badgeButtonText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.035,
    fontWeight: '600',
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
    marginBottom: '2%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  historyGraph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
    marginTop: '2%',
  },
  historyBarContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  historyBar: {
    width: '100%',
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
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B6CB7',
    borderRadius: 12,
    padding: '4%',
    marginTop: '5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
    marginLeft: '2%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '5%',
  },
  modalTitle: {
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: '600',
    color: '#333',
    marginBottom: '3%',
    textAlign: 'center',
  },
  notesSubtitle: {
    fontSize: Dimensions.get('window').width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginBottom: '5%',
  },
  templateSectionTitle: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
    color: '#4B6CB7',
    marginTop: '3%',
    marginBottom: '2%',
  },
  templateItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: '3%',
    marginBottom: '3%',
  },
  templateText: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  templateGoals: {
    marginTop: '2%',
  },
  templateGoalText: {
    fontSize: Dimensions.get('window').width * 0.035,
    color: '#666',
  },
  notesInput: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: '3%',
    marginBottom: '5%',
    textAlignVertical: 'top',
  },
  notesButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notesButton: {
    borderRadius: 8,
    padding: '3%',
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#4B6CB7',
  },
  notesButtonText: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: '#4B6CB7',
    borderRadius: 8,
    padding: '3%',
    marginTop: '5%',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#4B6CB7',
  },
  dayButtonText: {
    fontSize: Dimensions.get('window').width * 0.035,
    color: '#666',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  reminderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5%',
  },
  reminderText: {
    fontSize: Dimensions.get('window').width * 0.04,
    color: '#333',
  },
  badgeModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  badgeModalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '5%',
    alignItems: 'center',
  },
  badgeIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD70020',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
  },
  badgeModalTitle: {
    fontSize: Dimensions.get('window').width * 0.06,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: '3%',
  },
  badgeModalText: {
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: '600',
    color: '#333',
    marginBottom: '5%',
    textAlign: 'center',
  },
  androidPromptOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  androidPromptContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  androidPromptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  androidPromptText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  androidInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  androidButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  androidButton: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  androidCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  androidConfirmButton: {
    backgroundColor: '#4B6CB7',
  },
  androidButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
//   useWindowDimensions,
//   Platform
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
//     const goalType = goalTypes.find(g => g.key === key);
    
//     // For Android, we'll use a simpler Alert with a single button
//     if (Platform.OS === 'android') {
//       Alert.prompt(
//         `Set ${goalType.title} Goal`,
//         `Enter your ${selectedTab} target in ${goalType.unit}:`,
//         (text) => {
//           const value = parseFloat(text);
//           if (!isNaN(value) && value > 0) {
//             setGoals(prev => ({
//               ...prev,
//               [key]: { ...prev[key], target: value }
//             }));
//             animateProgress();
//           }
//         },
//         'plain-text',
//         '',
//         'numeric'
//       );
//     } else {
//       // iOS can use the more complex version
//       Alert.prompt(
//         `Set ${goalType.title} Goal`,
//         `Enter your ${selectedTab} target in ${goalType.unit}:`,
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel',
//           },
//           {
//             text: 'Set Goal',
//             onPress: (text) => {
//               const value = parseFloat(text);
//               if (!isNaN(value) && value > 0) {
//                 setGoals(prev => ({
//                   ...prev,
//                   [key]: { ...prev[key], target: value }
//                 }));
//                 animateProgress();
//               }
//             },
//           },
//         ],
//         'plain-text',
//         '',
//         'numeric'
//       );
//     }
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






// // // // // import React, { useState } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   ScrollView,
// // // // //   StyleSheet,
// // // // //   Alert,
// // // // //   Animated,
// // // // //   Easing,
// // // // //   Dimensions,
// // // // //   useWindowDimensions
// // // // // } from 'react-native';
// // // // // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // // // // import { LinearGradient } from 'expo-linear-gradient';
// // // // // import { Circle } from 'react-native-progress';

// // // // // const goalTypes = [
// // // // //   { 
// // // // //     key: 'time', 
// // // // //     title: 'Time Duration', 
// // // // //     color: '#FF6B6B', 
// // // // //     icon: 'clock',
// // // // //     unit: 'min'
// // // // //   },
// // // // //   { 
// // // // //     key: 'speed', 
// // // // //     title: 'Speed', 
// // // // //     color: '#4B6CB7', 
// // // // //     icon: 'speedometer',
// // // // //     unit: 'km/h'
// // // // //   },
// // // // //   { 
// // // // //     key: 'calories', 
// // // // //     title: 'Calorie Burn', 
// // // // //     color: '#FFA500', 
// // // // //     icon: 'fire',
// // // // //     unit: 'kcal'
// // // // //   },
// // // // //   { 
// // // // //     key: 'distance', 
// // // // //     title: 'Distance', 
// // // // //     color: '#32CD32', 
// // // // //     icon: 'map-marker-distance',
// // // // //     unit: 'km'
// // // // //   },
// // // // //   { 
// // // // //     key: 'cadence', 
// // // // //     title: 'Stride Rate', 
// // // // //     color: '#9370DB', 
// // // // //     icon: 'repeat',
// // // // //     unit: 'spm'
// // // // //   },
// // // // //   { 
// // // // //     key: 'steps', 
// // // // //     title: 'Step Count', 
// // // // //     color: '#00BFFF', 
// // // // //     icon: 'walk',
// // // // //     unit: 'steps'
// // // // //   },
// // // // // ];

// // // // // const SetGoalScreen = ({ navigation }) => {
// // // // //   const { width, height } = useWindowDimensions();
// // // // //   const [selectedTab, setSelectedTab] = useState('daily');
// // // // //   const [goals, setGoals] = useState({
// // // // //     time: { target: 30, finished: 12 },
// // // // //     speed: { target: 20, finished: 8 },
// // // // //     calories: { target: 500, finished: 320 },
// // // // //     distance: { target: 10, finished: 6.5 },
// // // // //     cadence: { target: 90, finished: 75 },
// // // // //     steps: { target: 10000, finished: 6500 },
// // // // //   });
// // // // //   const [animation] = useState(new Animated.Value(0));

// // // // //   const animateProgress = () => {
// // // // //     Animated.timing(animation, {
// // // // //       toValue: 1,
// // // // //       duration: 800,
// // // // //       easing: Easing.out(Easing.ease),
// // // // //       useNativeDriver: true
// // // // //     }).start();
// // // // //   };

// // // // //   const handleCategoryPress = (key) => {
// // // // //     Alert.prompt(
// // // // //       `Set ${goalTypes.find(g => g.key === key).title} Goal`,
// // // // //       `Enter your ${selectedTab} target:`,
// // // // //       [
// // // // //         {
// // // // //           text: 'Cancel',
// // // // //           style: 'cancel',
// // // // //         },
// // // // //         {
// // // // //           text: 'Set Goal',
// // // // //           onPress: (text) => {
// // // // //             const value = parseInt(text);
// // // // //             if (!isNaN(value) && value > 0) {
// // // // //               setGoals(prev => ({
// // // // //                 ...prev,
// // // // //                 [key]: { ...prev[key], target: value }
// // // // //               }));
// // // // //               animateProgress();
// // // // //             }
// // // // //           },
// // // // //         },
// // // // //       ],
// // // // //       'plain-text',
// // // // //       '',
// // // // //       'numeric'
// // // // //     );
// // // // //   };

// // // // //   const filteredGoalTypes = selectedTab === 'all' 
// // // // //     ? goalTypes 
// // // // //     : goalTypes.filter(({ key }) => selectedTab === 'daily' || selectedTab === 'weekly');

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       {/* Header */}
// // // // //       <LinearGradient
// // // // //         colors={['#4B6CB7', '#182848']}
// // // // //         style={styles.header}
// // // // //         start={{ x: 0, y: 0 }}
// // // // //         end={{ x: 1, y: 0 }}
// // // // //       >
// // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //           <Feather name="arrow-left" size={24} color="#fff" />
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.headerTitle}>Set Goals</Text>
// // // // //         <View style={{ width: 24 }} />
// // // // //       </LinearGradient>

// // // // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// // // // //         {/* Tabs */}
// // // // //         <View style={styles.tabContainer}>
// // // // //           {['daily', 'weekly', 'all'].map((tab) => (
// // // // //             <TouchableOpacity
// // // // //               key={tab}
// // // // //               onPress={() => {
// // // // //                 setSelectedTab(tab);
// // // // //                 animateProgress();
// // // // //               }}
// // // // //               style={[
// // // // //                 styles.tabButton,
// // // // //                 selectedTab === tab && styles.activeTabButton,
// // // // //               ]}
// // // // //             >
// // // // //               <Text
// // // // //                 style={[
// // // // //                   styles.tabText,
// // // // //                   selectedTab === tab && styles.activeTabText,
// // // // //                 ]}
// // // // //               >
// // // // //                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
// // // // //               </Text>
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </View>

// // // // //         {/* Goals Grid */}
// // // // //         <View style={styles.goalsGrid}>
// // // // //           {filteredGoalTypes.map(({ key, title, color, icon, unit }) => {
// // // // //             const progress = goals[key].finished / goals[key].target;
// // // // //             const percentage = Math.round(progress * 100);
            
// // // // //             return (
// // // // //               <TouchableOpacity
// // // // //                 key={key}
// // // // //                 style={styles.goalCard}
// // // // //                 onPress={() => handleCategoryPress(key)}
// // // // //                 activeOpacity={0.8}
// // // // //               >
// // // // //                 <View style={styles.goalHeader}>
// // // // //                   <View style={[styles.goalIcon, { backgroundColor: `${color}20` }]}>
// // // // //                     <MaterialCommunityIcons 
// // // // //                       name={icon} 
// // // // //                       size={20} 
// // // // //                       color={color} 
// // // // //                     />
// // // // //                   </View>
// // // // //                   <Text style={styles.goalTitle}>{title}</Text>
// // // // //                 </View>
                
// // // // //                 <View style={styles.progressContainer}>
// // // // //                   <View style={styles.progressCircleContainer}>
// // // // //                     <Circle
// // // // //                       size={width * 0.25}
// // // // //                       progress={progress}
// // // // //                       color={color}
// // // // //                       thickness={6}
// // // // //                       unfilledColor="#f0f0f0"
// // // // //                       borderWidth={0}
// // // // //                       strokeCap="round"
// // // // //                     />
// // // // //                     <View style={styles.progressTextContainer}>
// // // // //                       <Text style={styles.progressText}>{percentage}%</Text>
// // // // //                     </View>
// // // // //                   </View>
// // // // //                 </View>
                
// // // // //                 <View style={styles.goalStats}>
// // // // //                   <Text style={styles.currentValue}>
// // // // //                     {goals[key].finished}{unit}
// // // // //                   </Text>
// // // // //                   <Text style={styles.targetValue}>
// // // // //                     / {goals[key].target}{unit}
// // // // //                   </Text>
// // // // //                 </View>
                
// // // // //                 <View style={styles.progressBarContainer}>
// // // // //                   <View 
// // // // //                     style={[
// // // // //                       styles.progressBar,
// // // // //                       { 
// // // // //                         width: `${Math.min(percentage, 100)}%`,
// // // // //                         backgroundColor: color
// // // // //                       }
// // // // //                     ]}
// // // // //                   />
// // // // //                 </View>
// // // // //               </TouchableOpacity>
// // // // //             );
// // // // //           })}
// // // // //         </View>

// // // // //         {/* Tips Section */}
// // // // //         <View style={styles.tipsCard}>
// // // // //           <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
// // // // //           <View style={styles.tipItem}>
// // // // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // // // //             <Text style={styles.tipText}>Set realistic, achievable targets</Text>
// // // // //           </View>
// // // // //           <View style={styles.tipItem}>
// // // // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // // // //             <Text style={styles.tipText}>Increase goals gradually by 10-15% weekly</Text>
// // // // //           </View>
// // // // //           <View style={styles.tipItem}>
// // // // //             <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
// // // // //             <Text style={styles.tipText}>Focus on consistency over intensity</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </ScrollView>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#F5F7FB',
// // // // //   },
// // // // //   header: {
// // // // //     paddingTop: Dimensions.get('window').height * 0.06,
// // // // //     paddingHorizontal: '5%',
// // // // //     paddingBottom: '5%',
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     borderBottomLeftRadius: 20,
// // // // //     borderBottomRightRadius: 20,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 4 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 8,
// // // // //     elevation: 8,
// // // // //   },
// // // // //   headerTitle: {
// // // // //     fontSize: Dimensions.get('window').width * 0.055,
// // // // //     fontWeight: '600',
// // // // //     color: '#fff',
// // // // //   },
// // // // //   scrollContainer: {
// // // // //     padding: '5%',
// // // // //     paddingBottom: '10%',
// // // // //   },
// // // // //   tabContainer: {
// // // // //     flexDirection: 'row',
// // // // //     backgroundColor: '#E0E0E0',
// // // // //     borderRadius: 12,
// // // // //     overflow: 'hidden',
// // // // //     marginBottom: '5%',
// // // // //   },
// // // // //   tabButton: {
// // // // //     flex: 1,
// // // // //     paddingVertical: '3%',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   activeTabButton: {
// // // // //     backgroundColor: '#4B6CB7',
// // // // //   },
// // // // //   tabText: {
// // // // //     fontSize: Dimensions.get('window').width * 0.035,
// // // // //     fontWeight: '600',
// // // // //     color: '#666',
// // // // //   },
// // // // //   activeTabText: {
// // // // //     color: '#fff',
// // // // //   },
// // // // //   goalsGrid: {
// // // // //     flexDirection: 'row',
// // // // //     flexWrap: 'wrap',
// // // // //     justifyContent: 'space-between',
// // // // //   },
// // // // //   goalCard: {
// // // // //     width: Dimensions.get('window').width > 400 ? '48%' : '100%',
// // // // //     backgroundColor: '#fff',
// // // // //     borderRadius: 16,
// // // // //     padding: '4%',
// // // // //     marginBottom: '4%',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 6,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   goalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: '3%',
// // // // //   },
// // // // //   goalIcon: {
// // // // //     width: Dimensions.get('window').width * 0.09,
// // // // //     height: Dimensions.get('window').width * 0.09,
// // // // //     borderRadius: Dimensions.get('window').width * 0.045,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: '2%',
// // // // //   },
// // // // //   goalTitle: {
// // // // //     fontSize: Dimensions.get('window').width * 0.04,
// // // // //     fontWeight: '600',
// // // // //     color: '#333',
// // // // //     flex: 1,
// // // // //   },
// // // // //   progressContainer: {
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     height: Dimensions.get('window').width * 0.25,
// // // // //     marginVertical: '2%',
// // // // //   },
// // // // //   progressCircleContainer: {
// // // // //     position: 'relative',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   progressTextContainer: {
// // // // //     position: 'absolute',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   progressText: {
// // // // //     fontSize: Dimensions.get('window').width * 0.045,
// // // // //     fontWeight: 'bold',
// // // // //     color: '#333',
// // // // //   },
// // // // //   goalStats: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'baseline',
// // // // //     justifyContent: 'center',
// // // // //     marginBottom: '2%',
// // // // //   },
// // // // //   currentValue: {
// // // // //     fontSize: Dimensions.get('window').width * 0.05,
// // // // //     fontWeight: 'bold',
// // // // //     color: '#333',
// // // // //   },
// // // // //   targetValue: {
// // // // //     fontSize: Dimensions.get('window').width * 0.04,
// // // // //     color: '#666',
// // // // //   },
// // // // //   progressBarContainer: {
// // // // //     height: 6,
// // // // //     backgroundColor: '#f0f0f0',
// // // // //     borderRadius: 3,
// // // // //     overflow: 'hidden',
// // // // //   },
// // // // //   progressBar: {
// // // // //     height: '100%',
// // // // //     borderRadius: 3,
// // // // //   },
// // // // //   tipsCard: {
// // // // //     backgroundColor: '#fff',
// // // // //     borderRadius: 16,
// // // // //     padding: '4%',
// // // // //     marginTop: '2%',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 6,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   tipsTitle: {
// // // // //     fontSize: Dimensions.get('window').width * 0.045,
// // // // //     fontWeight: '600',
// // // // //     color: '#333',
// // // // //     marginBottom: '3%',
// // // // //   },
// // // // //   tipItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: '2%',
// // // // //   },
// // // // //   tipText: {
// // // // //     fontSize: Dimensions.get('window').width * 0.035,
// // // // //     color: '#666',
// // // // //     marginLeft: '2%',
// // // // //     flex: 1,
// // // // //   },
// // // // // });

// // // // // export default SetGoalScreen;