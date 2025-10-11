// screens/SessionDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SessionDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { session } = route.params;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  const shareSession = async () => {
    try {
      const shareMessage = `Check out my ${getSessionTypeName(session.mode)} session!\n
Duration: ${formatDuration(session.duration || 0)}
Distance: ${formatDistance(session.skatingDistance || session.walkingDistance || 0)}
${session.stepCount ? `Steps: ${session.stepCount.toLocaleString()}\n` : ''}
Recorded on ${format(parseISO(session.startTime), 'MMM dd, yyyy')}`;

      await Share.share({
        message: shareMessage,
        title: 'My Training Session',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share session');
    }
  };

  const getSessionTypeName = (mode) => {
    switch (mode) {
      case 'SS': return 'Speed Skating';
      case 'SD': return 'Distance Skating';
      case 'S': return 'Step Counting';
      default: return 'Training';
    }
  };

  const getSessionGradient = (mode) => {
    switch (mode) {
      case 'SS': return ['#f093fb', '#f5576c'];
      case 'SD': return ['#4facfe', '#00f2fe'];
      case 'S': return ['#43e97b', '#38f9d7'];
      default: return ['#667eea', '#764ba2'];
    }
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={getSessionGradient(session.mode)}
        style={styles.headerGradient}
      >
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.greetingText}>{getSessionTypeName(session.mode)}</Text>
            <Text style={styles.headerText}>
              {format(parseISO(session.startTime), 'EEEE, MMMM dd, yyyy')}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.goBack()}>
            <Text style={{ color: '#fff', fontSize: width * 0.04 }}>←</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

// In SessionDetailScreen.js, update the ScrollView section:

<ScrollView 
  style={styles.scrollView}
  contentContainerStyle={styles.scrollContent}
>
  {/* Stats Grid */}
  <View style={styles.activityGrid}>
    <View style={[styles.card, styles.activityMetricCard]}>
      <View style={[styles.metricIconContainer, { backgroundColor: '#F0F4FF' }]}>
        <Text style={styles.metricValue}>
          {formatDuration(session.duration || 0)}
        </Text>
      </View>
      <Text style={styles.metricLabel}>Duration</Text>
    </View>

    <View style={[styles.card, styles.activityMetricCard]}>
      <View style={[styles.metricIconContainer, { backgroundColor: '#F0F4FF' }]}>
        <Text style={styles.metricValue}>
          {formatDistance(session.skatingDistance || session.walkingDistance || 0)}
        </Text>
      </View>
      <Text style={styles.metricLabel}>Distance</Text>
    </View>

    {session.stepCount > 0 && (
      <View style={[styles.card, styles.activityMetricCard]}>
        <View style={[styles.metricIconContainer, { backgroundColor: '#F0F4FF' }]}>
          <Text style={styles.metricValue}>
            {session.stepCount?.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.metricLabel}>Steps</Text>
      </View>
    )}

    {session.speedData?.maxSpeed > 0 && (
      <View style={[styles.card, styles.activityMetricCard]}>
        <View style={[styles.metricIconContainer, { backgroundColor: '#F0F4FF' }]}>
          <Text style={styles.metricValue}>
            {session.speedData.maxSpeed.toFixed(1)} m/s
          </Text>
        </View>
        <Text style={styles.metricLabel}>Max Speed</Text>
      </View>
    )}
  </View>

  {session.notes && (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>Session Notes</Text>
        </View>
      </View>
      <View style={styles.foodDetailsContainer}>
        <Text style={styles.foodDetailsText}>{session.notes}</Text>
      </View>
    </View>
  )}

  {/* Additional Session Data */}
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>Session Details</Text>
      </View>
    </View>
    <View style={styles.detailRow}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Start Time</Text>
        <Text style={styles.detailValue}>
          {format(parseISO(session.startTime), 'hh:mm a')}
        </Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Session Type</Text>
        <Text style={styles.detailValue}>{getSessionTypeName(session.mode)}</Text>
      </View>
    </View>
    {session.speedData?.averageSpeed > 0 && (
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Average Speed</Text>
          <Text style={styles.detailValue}>
            {session.speedData.averageSpeed.toFixed(1)} m/s
          </Text>
        </View>
      </View>
    )}
  </View>

  <TouchableOpacity 
    style={[styles.addButton, { marginTop: 16 }]} 
    onPress={shareSession}
  >
    <Text style={styles.addButtonText}>Share Session</Text>
  </TouchableOpacity>
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 40 : 40,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: '#F5F7FB',
  },
  headerGradient: {
    marginTop: Platform.OS === 'ios' ? -60 : -10,
    paddingHorizontal: '6%',
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
    paddingBottom: height * 0.04,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
    shadowRadius: Platform.OS === 'ios' ? 20 : 0,
    elevation: Platform.OS === 'android' ? 10 : 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8%',
  },
  greetingText: {
    fontSize: width * 0.045,
    marginRight: '2%',
    color: 'rgba(255,255,255,0.9)',
  },
  headerText: {
    fontSize: width * 0.055,
    color: '#fff',
    marginTop: '1%',
  },
  profileIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: '4%',
    paddingBottom: '8%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: width * 0.045,
    color: '#2E3A59',
    marginLeft: '2%',
    fontWeight: '500',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityMetricCard: {
    width: '48%',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '4%',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
  },
  metricValue: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#2E3A59',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: width * 0.03,
    color: '#5A6A8C',
    textAlign: 'center',
  },
  foodDetailsContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 12,
  },
  foodDetailsText: {
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  addButton: {
    backgroundColor: '#4B6CB7',
    borderRadius: 24,
    paddingVertical: '3%',
    paddingHorizontal: '6%',
    alignSelf: 'center',
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
});

export default SessionDetailScreen;