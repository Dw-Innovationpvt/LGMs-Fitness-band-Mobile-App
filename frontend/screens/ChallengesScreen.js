import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ChallengesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [animation] = useState(new Animated.Value(0));

 
const challenges = {
  ongoing: [
    {
      id: 1,
      title: '30-Day Skating Challenge',
      description: 'Skate at least 5km every day for 30 days',
      progress: 12,
      target: 30,
      reward: 'Gold Skater Badge',
      rewardIcon: 'medal',
    },
    {
      id: 2,
      title: 'Weekly Protein Intake',
      description: 'Reach protein goal 5 days this week',
      progress: 3,
      target: 5,
      reward: 'Protein Master Badge',
      rewardIcon: 'food-drumstick',
    },
    {
      id: 3,
      title: 'Hydration Hero',
      description: 'Drink 2L of water daily for 7 days straight',
      progress: 4,
      target: 7,
      reward: 'Hydration Badge',
      rewardIcon: 'cup-water',
    },
    {
      id: 6,
      title: 'Speed Skater Sprint',
      description: 'Achieve a top speed of 20km/h during a skate session',
      progress: 0,
      target: 1,
      reward: 'Speed Star Badge',
      rewardIcon: 'speedometer',
    },
    {
      id: 7,
      title: 'Core Strength Builder',
      description: 'Complete 3 core workouts (15 min each) this week',
      progress: 1,
      target: 3,
      reward: 'Core Champion Badge',
      rewardIcon: 'weight-lifter',
    },
    {
      id: 8,
      title: 'Skate Endurance',
      description: 'Skate for 1 hour non-stop 3 times this week',
      progress: 2,
      target: 3,
      reward: 'Endurance Elite Badge',
      rewardIcon: 'clock',
    },
    {
      id: 9,
      title: 'Morning Skate Streak',
      description: 'Skate before 9 AM for 5 consecutive days',
      progress: 3,
      target: 5,
      reward: 'Morning Skater Badge',
      rewardIcon: 'sunrise',
    },
    {
      id: 10,
      title: 'Calorie Burner',
      description: 'Burn 500 calories skating 4 days this week',
      progress: 2,
      target: 4,
      reward: 'Calorie Crusher Badge',
      rewardIcon: 'fire',
    },
    {
      id: 11,
      title: 'Balance Master',
      description: 'Practice balance exercises for 10 min daily for 7 days',
      progress: 5,
      target: 7,
      reward: 'Balance Boss Badge',
      rewardIcon: 'scale',
    },
    {
      id: 12,
      title: 'Skate Park Explorer',
      description: 'Visit and skate at 3 different skate parks',
      progress: 1,
      target: 3,
      reward: 'Park Pioneer Badge',
      rewardIcon: 'map',
    },
    {
      id: 13,
      title: 'Stretching Star',
      description: 'Complete 10 min of stretching daily for 10 days',
      progress: 6,
      target: 10,
      reward: 'Flexibility Badge',
      rewardIcon: 'yoga',
    },
    {
      id: 14,
      title: 'Skate Distance Marathon',
      description: 'Skate a total of 50km in one week',
      progress: 32,
      target: 50,
      reward: 'Marathon Skater Badge',
      rewardIcon: 'road',
    },
    {
      id: 15,
      title: 'Strength Training Boost',
      description: 'Complete 3 strength workouts (20 min each) this week',
      progress: 1,
      target: 3,
      reward: 'Strength Star Badge',
      rewardIcon: 'dumbbell',
    },
    {
      id: 16,
      title: 'Skate Trick Learner',
      description: 'Learn and perform 3 new skate tricks',
      progress: 1,
      target: 3,
      reward: 'Trickster Badge',
      rewardIcon: 'star',
    },
    {
      id: 17,
      title: 'Hydration Marathon',
      description: 'Drink 3L of water daily for 5 days',
      progress: 2,
      target: 5,
      reward: 'Super Hydration Badge',
      rewardIcon: 'bottle-water',
    },
    {
      id: 18,
      title: 'Skate Social',
      description: 'Skate with a friend 3 times this week',
      progress: 1,
      target: 3,
      reward: 'Social Skater Badge',
      rewardIcon: 'account-group',
    },
    {
      id: 19,
      title: 'Cardio King',
      description: 'Complete 4 cardio sessions (20 min each) this week',
      progress: 2,
      target: 4,
      reward: 'Cardio Crown Badge',
      rewardIcon: 'heart-pulse',
    },
    {
      id: 20,
      title: 'Evening Skate Vibes',
      description: 'Skate after 6 PM for 5 days straight',
      progress: 3,
      target: 5,
      reward: 'Night Skater Badge',
      rewardIcon: 'moon',
    },
    {
      id: 21,
      title: 'Skate Consistency',
      description: 'Skate at least 3km daily for 14 days',
      progress: 8,
      target: 14,
      reward: 'Consistency King Badge',
      rewardIcon: 'calendar-check',
    },
    {
      id: 22,
      title: 'Mobility Master',
      description: 'Complete 10 min of mobility exercises daily for 7 days',
      progress: 4,
      target: 7,
      reward: 'Mobility Maestro Badge',
      rewardIcon: 'run',
    },
    {
      id: 23,
      title: 'Skate Sprint Challenge',
      description: 'Complete 5 sprint intervals (30 sec each) in one session',
      progress: 0,
      target: 1,
      reward: 'Sprint Star Badge',
      rewardIcon: 'run-fast',
    },
    {
      id: 24,
      title: 'Healthy Eating Streak',
      description: 'Eat 5 servings of vegetables daily for 7 days',
      progress: 5,
      target: 7,
      reward: 'Veggie Victor Badge',
      rewardIcon: 'carrot',
    },
    {
      id: 25,
      title: 'Skate Hill Climb',
      description: 'Skate up a hill 5 times in one session',
      progress: 2,
      target: 5,
      reward: 'Hill Conqueror Badge',
      rewardIcon: 'terrain',
    },
    {
      id: 26,
      title: 'Sleep Champion',
      description: 'Get 8 hours of sleep for 7 nights straight',
      progress: 4,
      target: 7,
      reward: 'Sleep Star Badge',
      rewardIcon: 'bed',
    },
    {
      id: 27,
      title: 'Skate Agility',
      description: 'Complete an agility course on skates 3 times',
      progress: 1,
      target: 3,
      reward: 'Agility Ace Badge',
      rewardIcon: 'cone',
    },
    {
      id: 28,
      title: 'Post-Skate Recovery',
      description: 'Complete 10 min of recovery stretches after 5 skates',
      progress: 3,
      target: 5,
      reward: 'Recovery Rockstar Badge',
      rewardIcon: 'heart',
    },
    {
      id: 29,
      title: 'Skate Exploration',
      description: 'Skate a new route 3 times this week',
      progress: 1,
      target: 3,
      reward: 'Explorer Badge',
      rewardIcon: 'compass',
    },
    {
      id: 30,
      title: 'Weekly Skate Distance',
      description: 'Skate a total of 20km this week',
      progress: 12,
      target: 20,
      reward: 'Distance Driven Badge',
      rewardIcon: 'ruler',
    },
  ],
  completed: [
    {
      id: 4,
      title: '5-Day Step Challenge',
      description: '10,000 steps daily for 5 days',
      progress: 5,
      target: 5,
      reward: 'Step Master Badge',
      rewardIcon: 'walk',
      completedDate: '2023-10-28',
    },
    {
      id: 5,
      title: 'Morning Routine',
      description: 'Complete morning routine 7 days in a row',
      progress: 7,
      target: 7,
      reward: 'Early Bird Badge',
      rewardIcon: 'weather-sunny',
      completedDate: '2023-10-21',
    },
    {
      id: 31,
      title: 'First Skate Milestone',
      description: 'Complete your first 10km skate',
      progress: 1,
      target: 1,
      reward: 'First Skate Badge',
      rewardIcon: 'skate',
      completedDate: '2023-10-15',
    },
    {
      id: 32,
      title: 'Weekly Yoga Flow',
      description: 'Complete 3 yoga sessions (15 min each) this week',
      progress: 3,
      target: 3,
      reward: 'Yoga Yogi Badge',
      rewardIcon: 'lotus',
      completedDate: '2023-10-10',
    },
    {
      id: 33,
      title: 'Skate Stamina Starter',
      description: 'Skate for 30 min non-stop',
      progress: 1,
      target: 1,
      reward: 'Stamina Starter Badge',
      rewardIcon: 'timer',
      completedDate: '2023-10-05',
    },
    {
      id: 34,
      title: 'Protein Power',
      description: 'Hit protein goal 3 days in a row',
      progress: 3,
      target: 3,
      reward: 'Protein Pro Badge',
      rewardIcon: 'egg',
      completedDate: '2023-10-03',
    },
    {
      id: 35,
      title: 'Skate Trick Beginner',
      description: 'Learn and perform 1 new skate trick',
      progress: 1,
      target: 1,
      reward: 'Trick Starter Badge',
      rewardIcon: 'sparkles',
      completedDate: '2023-10-01',
    },
    {
      id: 36,
      title: 'Hydration Starter',
      description: 'Drink 2L of water in one day',
      progress: 1,
      target: 1,
      reward: 'Water Warrior Badge',
      rewardIcon: 'droplet',
      completedDate: '2023-09-28',
    },
    {
      id: 37,
      title: 'Skate Warm-Up',
      description: 'Complete 5 min warm-up before 3 skates',
      progress: 3,
      target: 3,
      reward: 'Warm-Up Winner Badge',
      rewardIcon: 'run',
      completedDate: '2023-09-25',
    },
    {
      id: 38,
      title: 'Step Starter',
      description: 'Achieve 8,000 steps in one day',
      progress: 1,
      target: 1,
      reward: 'Step Starter Badge',
      rewardIcon: 'shoe-print',
      completedDate: '2023-09-20',
    },
    {
      id: 39,
      title: 'Skate Buddy',
      description: 'Skate with a friend once',
      progress: 1,
      target: 1,
      reward: 'Buddy Skater Badge',
      rewardIcon: 'account',
      completedDate: '2023-09-15',
    },
    {
      id: 40,
      title: 'Core Starter',
      description: 'Complete one 10 min core workout',
      progress: 1,
      target: 1,
      reward: 'Core Starter Badge',
      rewardIcon: 'weight',
      completedDate: '2023-09-10',
    },
    {
      id: 41,
      title: 'Skate Sprint Starter',
      description: 'Complete one 30 sec sprint on skates',
      progress: 1,
      target: 1,
      reward: 'Sprint Starter Badge',
      rewardIcon: 'speedometer',
      completedDate: '2023-09-05',
    },
    {
      id: 42,
      title: 'Veggie Starter',
      description: 'Eat 5 servings of vegetables in one day',
      progress: 1,
      target: 1,
      reward: 'Veggie Starter Badge',
      rewardIcon: 'leaf',
      completedDate: '2023-09-01',
    },
    {
      id: 43,
      title: 'Skate Distance Starter',
      description: 'Skate 5km in one session',
      progress: 1,
      target: 1,
      reward: 'Distance Starter Badge',
      rewardIcon: 'route',
      completedDate: '2023-08-28',
    },
    {
      id: 44,
      title: 'Sleep Starter',
      description: 'Get 8 hours of sleep in one night',
      progress: 1,
      target: 1,
      reward: 'Sleep Starter Badge',
      rewardIcon: 'sleep',
      completedDate: '2023-08-25',
    },
    {
      id: 45,
      title: 'Skate Agility Starter',
      description: 'Complete one agility course on skates',
      progress: 1,
      target: 1,
      reward: 'Agility Starter Badge',
      rewardIcon: 'traffic-cone',
      completedDate: '2023-08-20',
    },
    {
      id: 46,
      title: 'Recovery Starter',
      description: 'Complete 5 min of recovery stretches after skating',
      progress: 1,
      target: 1,
      reward: 'Recovery Starter Badge',
      rewardIcon: 'heart-circle',
      completedDate: '2023-08-15',
    },
    {
      id: 47,
      title: 'Route Explorer',
      description: 'Skate a new route once',
      progress: 1,
      target: 1,
      reward: 'Route Starter Badge',
      rewardIcon: 'map-marker',
      completedDate: '2023-08-10',
    },
    {
      id: 48,
      title: 'Calorie Starter',
      description: 'Burn 300 calories in one skate session',
      progress: 1,
      target: 1,
      reward: 'Calorie Starter Badge',
      rewardIcon: 'flame',
      completedDate: '2023-08-05',
    },
    {
      id: 49,
      title: 'Balance Starter',
      description: 'Practice balance exercises for 5 min',
      progress: 1,
      target: 1,
      reward: 'Balance Starter Badge',
      rewardIcon: 'scale-balance',
      completedDate: '2023-08-01',
    },
    {
      id: 50,
      title: 'Morning Skate Starter',
      description: 'Skate before 9 AM once',
      progress: 1,
      target: 1,
      reward: 'Morning Starter Badge',
      rewardIcon: 'weather-sunrise',
      completedDate: '2023-07-28',
    },
  ],
};
  const animateTabChange = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true
    }).start(() => animation.setValue(0));
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    animateTabChange();
  };

  const renderChallengeCard = (challenge, isCompleted = false) => {
    const progressPercentage = Math.min((challenge.progress / challenge.target) * 100, 100);
    
    return (
      <View key={challenge.id} style={[styles.challengeCard, { borderLeftColor: challenge.color , borderLeftWidth: 1 ,borderBottomColor: challenge.color , borderBottomWidth: 1 }]}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <MaterialCommunityIcons name="check" size={16} color="#fff" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { 
              width: `${progressPercentage}%`,
              backgroundColor: challenge.color
            }]} />
          </View>
          <Text style={styles.progressText}>
            {challenge.progress}/{challenge.target} ({Math.round(progressPercentage)}%)
          </Text>
        </View>
        
        <View style={styles.rewardContainer}>
          <MaterialCommunityIcons 
            name={challenge.rewardIcon} 
            size={24} 
            color={isCompleted ? '#4CAF50' : '#FFC107'} 
          />
          <Text style={styles.rewardText}>Reward: {challenge.reward}</Text>
        </View>
        
        {isCompleted && (
          <Text style={styles.completedDate}>
            Completed on: {challenge.completedDate}
          </Text>
        )}
      </View>
    );
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
        <Text style={styles.headerTitle}>Challenges</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'ongoing' && styles.activeTabButton]}
          onPress={() => handleTabPress('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'completed' && styles.activeTabButton]}
          onPress={() => handleTabPress('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {challenges[activeTab].length > 0 ? (
          challenges[activeTab].map(challenge => 
            renderChallengeCard(challenge, activeTab === 'completed')
          )
        ) : (
          <View style={styles.emptyState}>
            <Image
              source={require('../assets/88.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              No {activeTab} challenges yet
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'ongoing' 
                ? 'Start a new challenge to see it here!' 
                : 'Complete challenges to see them here!'}
            </Text>
          </View>
        )}
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
    fontSize: width * 0.055,
    fontWeight: '600',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginTop: '5%',
    marginBottom: '2%',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
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
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: '10%',
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '4%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2%',
  },
  challengeTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  challengeDescription: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: '3%',
  },
  progressContainer: {
    marginBottom: '3%',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'right',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2%',
  },
  rewardText: {
    marginLeft: '2%',
    color: '#666',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: '2%',
    paddingVertical: '1%',
    borderRadius: 12,
  },
  completedText: {
    color: '#fff',
    fontSize: width * 0.03,
    marginLeft: 4,
  },
  completedDate: {
    marginTop: '2%',
    fontSize: width * 0.03,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10%',
  },
  emptyImage: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: '4%',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#666',
    marginBottom: '2%',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: width * 0.035,
    color: '#999',
    textAlign: 'center',
  },
});

export default ChallengesScreen;