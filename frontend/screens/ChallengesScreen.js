import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChallengesScreen = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  
  // Dummy goals data
  const goals = {
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
    ],
  };

  return (
    <LinearGradient colors={['#f7f7f7', '#e8e8e8']} style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {goals[activeTab].length > 0 ? (
          goals[activeTab].map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                {activeTab === 'completed' && (
                  <View style={styles.completedBadge}>
                    <MaterialCommunityIcons name="check" size={16} color="white" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
              </View>
              <Text style={styles.goalDescription}>{goal.description}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${(goal.progress / goal.target) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {goal.progress}/{goal.target} ({Math.round((goal.progress / goal.target) * 100)}%)
                </Text>
              </View>

              <View style={styles.rewardContainer}>
                <MaterialCommunityIcons 
                  name={goal.rewardIcon} 
                  size={24} 
                  color={activeTab === 'completed' ? '#4CAF50' : '#FFC107'} 
                />
                <Text style={styles.rewardText}>Reward: {goal.reward}</Text>
              </View>

              {activeTab === 'completed' && (
                <Text style={styles.completedDate}>
                  Completed on: {goal.completedDate}
                </Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="trophy-award" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No {activeTab} challenges</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4a90e2',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rewardText: {
    marginLeft: 8,
    color: '#666',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  completedDate: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
    fontSize: 16,
  },
});

export default ChallengesScreen;