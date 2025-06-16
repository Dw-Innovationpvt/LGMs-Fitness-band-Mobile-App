import React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated
  ,useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('personal');
  const animation = new Animated.Value(0);

  const userData = {
    name: 'Charan Dusary',
    email: 'charandusary@gmail.com',
    bio: 'Fitness enthusiast and professional skater',
    stats: {
      workouts: 42,
      challenges: 18,
      streak: 7
    },
    achievements: [
      { id: '1', name: 'Skate Master', icon: 'skate', date: '2023-06-01' },
      { id: '2', name: 'Early Bird', icon: 'weather-sunny', date: '2023-05-15' },
      { id: '3', name: 'Hydration Hero', icon: 'cup-water', date: '2023-04-28' }
    ]
  };

  const profileOptions = [
    { icon: 'account-circle', text: 'Account Settings' },
    { icon: 'bell', text: 'Notifications' },
    { icon: 'shield', text: 'Privacy' },
    { icon: 'help-circle', text: 'Help & Support' },
    { icon: 'logout', text: 'Sign Out' }
  ];

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

  const handleSignOut = () => {
    // Sign out logic here
    navigation.replace('Auth');
  };

  const renderAchievementBadge = (achievement) => {
    return (
      <View key={achievement.id} style={styles.achievementBadge}>
        <View style={styles.achievementIcon}>
          <MaterialCommunityIcons 
            name={achievement.icon} 
            size={24} 
            color="#4B6CB7" 
          />
        </View>
        <View>
          <Text style={styles.achievementTitle}>{achievement.name}</Text>
          <Text style={styles.achievementDate}>Earned: {achievement.date}</Text>
        </View>
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Feather name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userBio}>{userData.bio}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userData.stats.workouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userData.stats.challenges}</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userData.stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'personal' && styles.activeTabButton]}
          onPress={() => handleTabPress('personal')}
        >
          <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
            Personal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'achievements' && styles.activeTabButton]}
          onPress={() => handleTabPress('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'personal' ? (
          <View style={styles.personalContent}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.optionItem}
                onPress={option.text === 'Sign Out' ? handleSignOut : null}
              >
                <MaterialCommunityIcons 
                  name={option.icon} 
                  size={24} 
                  color="#4B6CB7" 
                />
                <Text style={styles.optionText}>{option.text}</Text>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.achievementsContent}>
            {userData.achievements.length > 0 ? (
              userData.achievements.map(renderAchievementBadge)
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="trophy-outline" 
                  size={60} 
                  color="#E0E0E0" 
                />
                <Text style={styles.emptyText}>No achievements yet</Text>
                <Text style={styles.emptySubtext}>
                  Complete challenges to earn achievements!
                </Text>
              </View>
            )}
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
  profileHeader: {
    alignItems: 'center',
    padding: '5%',
    marginTop: '5%',
  },
  avatarContainer: {
    marginBottom: '4%',
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#4B6CB7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1%',
  },
  userEmail: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: '2%',
  },
  userBio: {
    fontSize: width * 0.04,
    color: '#4B6CB7',
    textAlign: 'center',
    paddingHorizontal: '10%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
    marginTop: '5%',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: '1%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginTop: '5%',
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
    paddingBottom: '10%',
  },
  personalContent: {
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '4%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    flex: 1,
    fontSize: width * 0.04,
    marginLeft: '4%',
    color: '#333',
  },
  achievementsContent: {
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '3%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    backgroundColor: 'rgba(75, 108, 183, 0.1)',
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '4%',
  },
  achievementTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  achievementDate: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: '1%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10%',
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#666',
    marginTop: '4%',
    marginBottom: '2%',
  },
  emptySubtext: {
    fontSize: width * 0.035,
    color: '#999',
    textAlign: 'center',
  },
});

export default ProfileScreen;