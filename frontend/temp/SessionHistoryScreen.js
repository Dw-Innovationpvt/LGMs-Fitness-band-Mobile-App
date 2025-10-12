// screens/SessionHistoryScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  Share,
  SafeAreaView
} from 'react-native';
import { useSessionStore, useSpeedSkatingSessions, useDistanceSkatingSessions, useStepCountingSessions } from '../store/useSessionStore';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SessionHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Get store functions and state
  const {
    sessions,
    loading,
    error,
    fetchSessions,
    clearError,
  } = useSessionStore();

  // Get specialized session hooks
  const { 
    speedSessions, 
    fetchSpeedSessions,
  } = useSpeedSkatingSessions();
  
  const { 
    distanceSessions, 
    fetchDistanceSessions,
  } = useDistanceSkatingSessions();
  
  const { 
    stepSessions, 
    fetchStepSessions,
  } = useStepCountingSessions();

  // Filter sessions based on active tab
  const getFilteredSessions = () => {
    switch (activeTab) {
      case 'speed':
        return speedSessions;
      case 'distance':
        return distanceSessions;
      case 'steps':
        return stepSessions;
      default:
        return sessions;
    }
  };

  const filteredSessions = getFilteredSessions();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);

  const loadData = async () => {
    try {
      switch (activeTab) {
        case 'speed':
          await fetchSpeedSessions();
          break;
        case 'distance':
          await fetchDistanceSessions();
          break;
        case 'steps':
          await fetchStepSessions();
          break;
        default:
          await fetchSessions();
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [activeTab]);

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

  const getSessionTypeIcon = (mode) => {
    switch (mode) {
      case 'SS':
        return '⚡';
      case 'SD':
        return '📏';
      case 'S':
        return '👣';
      default:
        return '🎯';
    }
  };

  const getSessionTypeName = (mode) => {
    switch (mode) {
      case 'SS':
        return 'Speed Skating';
      case 'SD':
        return 'Distance Skating';
      case 'S':
        return 'Step Counting';
      default:
        return 'Unknown';
    }
  };

  const getTabGradient = (tabId) => {
    const gradients = {
      all: ['#667eea', '#764ba2'],
      speed: ['#f093fb', '#f5576c'],
      distance: ['#4facfe', '#00f2fe'],
      steps: ['#43e97b', '#38f9d7']
    };
    return gradients[tabId] || gradients.all;
  };

  const shareSession = async (session) => {
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

  // Render different data based on session mode
  const renderModeSpecificData = (session) => {
    switch (session.mode) {
      case 'SS': // Speed Skating
        return (
          <View style={styles.detailRow}>
            {session.speedData?.maxSpeed > 0 && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Max Speed</Text>
                <Text style={[styles.detailValue, styles.highlightValue]}>
                  {session.speedData.maxSpeed.toFixed(1)} m/s
                </Text>
              </View>
            )}
            {session.speedData?.averageSpeed > 0 && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Avg Speed</Text>
                <Text style={styles.detailValue}>
                  {session.speedData.averageSpeed.toFixed(1)} m/s
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'SD': // Distance Skating
        return (
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Skating Distance</Text>
              <Text style={[styles.detailValue, styles.highlightValue]}>
                {formatDistance(session.skatingDistance || 0)}
              </Text>
            </View>
            {session.speedData?.averageSpeed > 0 && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pace</Text>
                <Text style={styles.detailValue}>
                  {(session.speedData.averageSpeed * 3.6).toFixed(1)} km/h
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'S': // Step Counting
        return (
          <View style={styles.detailRow}>
            {session.stepCount > 0 && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Steps</Text>
                <Text style={[styles.detailValue, styles.highlightValue]}>
                  {session.stepCount.toLocaleString()}
                </Text>
              </View>
            )}
            {session.walkingDistance > 0 && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Walking Distance</Text>
                <Text style={styles.detailValue}>
                  {formatDistance(session.walkingDistance)}
                </Text>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderSessionDetails = (session) => {
    if (selectedSession?._id !== session._id) return null;

    return (
      <View style={styles.sessionDetailsExpanded}>
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Session Details</Text>
          
          <View style={styles.detailGrid}>
            <View style={styles.detailGridItem}>
              <Text style={styles.detailGridLabel}>Start Time</Text>
              <Text style={styles.detailGridValue}>
                {format(parseISO(session.startTime), 'hh:mm a')}
              </Text>
            </View>
            
            <View style={styles.detailGridItem}>
              <Text style={styles.detailGridLabel}>Session Type</Text>
              <Text style={styles.detailGridValue}>
                {getSessionTypeName(session.mode)}
              </Text>
            </View>
          </View>

          {session.speedData?.averageSpeed > 0 && (
            <View style={styles.detailGrid}>
              <View style={styles.detailGridItem}>
                <Text style={styles.detailGridLabel}>Average Speed</Text>
                <Text style={styles.detailGridValue}>
                  {session.speedData.averageSpeed.toFixed(1)} m/s
                </Text>
              </View>
            </View>
          )}

          {session.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{session.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.sessionActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => shareSession(session)}
          >
            <Text style={styles.shareButtonText}>Share Session</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.closeButton]}
            onPress={() => setSelectedSession(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, styles.cardElevated]}
      onPress={() => setSelectedSession(selectedSession?._id === item._id ? null : item)}
    >
      <View style={styles.sessionHeader}>
        <View style={styles.sessionType}>
          <Text style={styles.sessionTypeIcon}>
            {getSessionTypeIcon(item.mode)}
          </Text>
          <Text style={styles.sessionTypeText}>
            {getSessionTypeName(item.mode)}
          </Text>
        </View>
        <Text style={styles.timeText}>
          {format(parseISO(item.startTime), 'MMM dd, yyyy')}
        </Text>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>
              {formatDuration(item.duration || 0)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>
              {formatDistance(item.skatingDistance || item.walkingDistance || 0)}
            </Text>
          </View>
        </View>

        {/* MODE-SPECIFIC DATA DISPLAY */}
        {renderModeSpecificData(item)}
        
        {item.notes && !selectedSession && (
          <View style={styles.foodDetailsContainer}>
            <Text style={styles.foodDetailsText}>Notes: {item.notes}</Text>
          </View>
        )}

        <Text style={styles.timeText}>
          {formatDistanceToNow(parseISO(item.startTime))} ago
          {selectedSession?._id === item._id ? ' • Tap to collapse' : ' • Tap for details'}
        </Text>
      </View>

      {/* Expanded Session Details */}
      {renderSessionDetails(item)}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.card}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>📊</Text>
        <Text style={styles.emptyStateTitle}>No Sessions Found</Text>
        <Text style={styles.emptyStateText}>
          {activeTab === 'all' 
            ? "You haven't recorded any sessions yet."
            : `You haven't recorded any ${getTabName(activeTab)} sessions yet.`}
        </Text>
        <Text style={styles.emptyStateSubtext}>
          Start a new session to see your data here.
        </Text>
      </View>
    </View>
  );

  const getTabName = (tab) => {
    switch (tab) {
      case 'speed': return 'Speed Skating';
      case 'distance': return 'Distance Skating';
      case 'steps': return 'Step Counting';
      default: return 'All';
    }
  };

  const tabs = [
    { id: 'all', name: 'All Sessions' },
    { id: 'speed', name: 'Speed' },
    { id: 'distance', name: 'Distance' },
    { id: 'steps', name: 'Steps' },
  ];

  return (
    <>
    <View style={styles.safeArea}>
      <LinearGradient
                colors={['#4B6CB7', '#182848']}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.headerText}>
              {getTabName(activeTab)} Sessions
            </Text>
          </View>

        </View>

        {/* Tab Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollView}
          contentContainerStyle={styles.tabContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.actionCard}
              onPress={() => {
                setActiveTab(tab.id);
                setSelectedSession(null);
              }}
            >
              <LinearGradient
                colors={activeTab === tab.id ? getTabGradient(tab.id) : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={[styles.actionIconContainer, styles.actionIconShadow]}
              >
                <Text style={{ color: '#fff', fontSize: width * 0.05 }}>
                  {tab.id === 'all' ? '📊' : tab.id === 'speed' ? '⚡' : tab.id === 'distance' ? '📏' : '👣'}
                </Text>
              </LinearGradient>
              <Text style={styles.actionLabel}>{tab.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>
                {getTabName(activeTab)} Sessions ({filteredSessions.length})
              </Text>
            </View>
            {filteredSessions.length > 0 && (
              <TouchableOpacity onPress={onRefresh}>
                <Text style={styles.timeText}>Refresh</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#667eea" />
              <Text style={styles.loadingText}>Loading sessions...</Text>
            </View>
          ) : filteredSessions.length > 0 ? (
            <FlatList
              data={filteredSessions}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item._id || item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            renderEmptyState()
          )}
        </View>

                  <View style={{marginBottom: 100}}>
                  </View>

      </ScrollView>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
        flex: 1,
        // marginBottom: Platform.OS === 'ios' ? 40 : 40,
        // paddingBottom: Platform.OS === 'ios' ? 0 : 0,
        backgroundColor: '#F5F7FB',
    // flex: 1,
    // marginBottom: Platform.OS === 'ios' ? 40 : 40,
    // paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    // backgroundColor: '#F5F7FB',
  },
  headerGradient: {
    marginTop: Platform.OS === 'ios' ? -60 : -10,
    paddingHorizontal: '6%',
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
    paddingBottom: height * 0.02,
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
  tabScrollView: {
    // Only styling for the ScrollView container itself
  },
  tabContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '-2%',
  },
  actionCard: {
    alignItems: 'center',
    width: '30%',
    paddingHorizontal: '2%',
  },
  actionIconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
  },
  actionIconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionLabel: {
    color: '#fff',
    fontSize: width * 0.033,
    textAlign: 'center',
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
  },
  cardElevated: {
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
  timeText: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
  },
  // Session item styles
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTypeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sessionTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  sessionDetails: {
    // Details container
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  highlightValue: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  foodDetailsContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  foodDetailsText: {
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8e8e93',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#c7c7cc',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Expanded session details styles
  sessionDetailsExpanded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailGridItem: {
    flex: 1,
  },
  detailGridLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 4,
  },
  detailGridValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E3A59',
  },
  notesContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#2E3A59',
    lineHeight: 18,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  shareButton: {
    backgroundColor: '#4B6CB7',
  },
  closeButton: {
    backgroundColor: '#F5F7FB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButtonText: {
    color: '#2E3A59',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SessionHistoryScreen;


// // screens/SessionHistoryScreen.js
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   RefreshControl,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   StatusBar,
//   Platform,
//   Share
// } from 'react-native';
// import { useSessionStore, useSpeedSkatingSessions, useDistanceSkatingSessions, useStepCountingSessions } from '../store/useSessionStore';
// import { format, parseISO, formatDistanceToNow } from 'date-fns';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width, height } = Dimensions.get('window');

// const SessionHistoryScreen = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedSession, setSelectedSession] = useState(null);
  
//   // Get store functions and state
//   const {
//     sessions,
//     loading,
//     error,
//     fetchSessions,
//     clearError,
//   } = useSessionStore();

//   // Get specialized session hooks
//   const { 
//     speedSessions, 
//     fetchSpeedSessions,
//   } = useSpeedSkatingSessions();
  
//   const { 
//     distanceSessions, 
//     fetchDistanceSessions,
//   } = useDistanceSkatingSessions();
  
//   const { 
//     stepSessions, 
//     fetchStepSessions,
//   } = useStepCountingSessions();

//   // Filter sessions based on active tab
//   const getFilteredSessions = () => {
//     switch (activeTab) {
//       case 'speed':
//         return speedSessions;
//       case 'distance':
//         return distanceSessions;
//       case 'steps':
//         return stepSessions;
//       default:
//         return sessions;
//     }
//   };

//   const filteredSessions = getFilteredSessions();

//   // Load data on component mount
//   useEffect(() => {
//     loadData();
//   }, [activeTab]);

//   // Show error alerts
//   useEffect(() => {
//     if (error) {
//       Alert.alert('Error', error, [
//         { text: 'OK', onPress: clearError }
//       ]);
//     }
//   }, [error]);

//   const loadData = async () => {
//     try {
//       switch (activeTab) {
//         case 'speed':
//           await fetchSpeedSessions();
//           break;
//         case 'distance':
//           await fetchDistanceSessions();
//           break;
//         case 'steps':
//           await fetchStepSessions();
//           break;
//         default:
//           await fetchSessions();
//           break;
//       }
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   }, [activeTab]);

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const remainingSeconds = seconds % 60;

//     if (hours > 0) {
//       return `${hours}h ${minutes}m ${remainingSeconds}s`;
//     } else if (minutes > 0) {
//       return `${minutes}m ${remainingSeconds}s`;
//     } else {
//       return `${remainingSeconds}s`;
//     }
//   };

//   const formatDistance = (meters) => {
//     if (meters >= 1000) {
//       return `${(meters / 1000).toFixed(2)} km`;
//     }
//     return `${meters.toFixed(0)} m`;
//   };

//   const getSessionTypeIcon = (mode) => {
//     switch (mode) {
//       case 'SS':
//         return '⚡';
//       case 'SD':
//         return '📏';
//       case 'S':
//         return '👣';
//       default:
//         return '🎯';
//     }
//   };

//   const getSessionTypeName = (mode) => {
//     switch (mode) {
//       case 'SS':
//         return 'Speed Skating';
//       case 'SD':
//         return 'Distance Skating';
//       case 'S':
//         return 'Step Counting';
//       default:
//         return 'Unknown';
//     }
//   };

//   const getTabGradient = (tabId) => {
//     const gradients = {
//       all: ['#667eea', '#764ba2'],
//       speed: ['#f093fb', '#f5576c'],
//       distance: ['#4facfe', '#00f2fe'],
//       steps: ['#43e97b', '#38f9d7']
//     };
//     return gradients[tabId] || gradients.all;
//   };

//   const shareSession = async (session) => {
//     try {
//       const shareMessage = `Check out my ${getSessionTypeName(session.mode)} session!\n
// Duration: ${formatDuration(session.duration || 0)}
// Distance: ${formatDistance(session.skatingDistance || session.walkingDistance || 0)}
// ${session.stepCount ? `Steps: ${session.stepCount.toLocaleString()}\n` : ''}
// Recorded on ${format(parseISO(session.startTime), 'MMM dd, yyyy')}`;

//       await Share.share({
//         message: shareMessage,
//         title: 'My Training Session',
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Failed to share session');
//     }
//   };

//   // Render different data based on session mode
//   const renderModeSpecificData = (session) => {
//     switch (session.mode) {
//       case 'SS': // Speed Skating
//         return (
//           <View style={styles.detailRow}>
//             {session.speedData?.maxSpeed > 0 && (
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Max Speed</Text>
//                 <Text style={[styles.detailValue, styles.highlightValue]}>
//                   {session.speedData.maxSpeed.toFixed(1)} m/s
//                 </Text>
//               </View>
//             )}
//             {session.speedData?.averageSpeed > 0 && (
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Avg Speed</Text>
//                 <Text style={styles.detailValue}>
//                   {session.speedData.averageSpeed.toFixed(1)} m/s
//                 </Text>
//               </View>
//             )}
//           </View>
//         );
      
//       case 'SD': // Distance Skating
//         return (
//           <View style={styles.detailRow}>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Skating Distance</Text>
//               <Text style={[styles.detailValue, styles.highlightValue]}>
//                 {formatDistance(session.skatingDistance || 0)}
//               </Text>
//             </View>
//             {session.speedData?.averageSpeed > 0 && (
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Pace</Text>
//                 <Text style={styles.detailValue}>
//                   {(session.speedData.averageSpeed * 3.6).toFixed(1)} km/h
//                 </Text>
//               </View>
//             )}
//           </View>
//         );
      
//       case 'S': // Step Counting
//         return (
//           <View style={styles.detailRow}>
//             {session.stepCount > 0 && (
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Steps</Text>
//                 <Text style={[styles.detailValue, styles.highlightValue]}>
//                   {session.stepCount.toLocaleString()}
//                 </Text>
//               </View>
//             )}
//             {session.walkingDistance > 0 && (
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Walking Distance</Text>
//                 <Text style={styles.detailValue}>
//                   {formatDistance(session.walkingDistance)}
//                 </Text>
//               </View>
//             )}
//           </View>
//         );
      
//       default:
//         return null;
//     }
//   };

//   const renderSessionDetails = (session) => {
//     if (selectedSession?._id !== session._id) return null;

//     return (
//       <View style={styles.sessionDetailsExpanded}>
//         <View style={styles.detailSection}>
//           <Text style={styles.detailSectionTitle}>Session Details</Text>
          
//           <View style={styles.detailGrid}>
//             <View style={styles.detailGridItem}>
//               <Text style={styles.detailGridLabel}>Start Time</Text>
//               <Text style={styles.detailGridValue}>
//                 {format(parseISO(session.startTime), 'hh:mm a')}
//               </Text>
//             </View>
            
//             <View style={styles.detailGridItem}>
//               <Text style={styles.detailGridLabel}>Session Type</Text>
//               <Text style={styles.detailGridValue}>
//                 {getSessionTypeName(session.mode)}
//               </Text>
//             </View>
//           </View>

//           {session.speedData?.averageSpeed > 0 && (
//             <View style={styles.detailGrid}>
//               <View style={styles.detailGridItem}>
//                 <Text style={styles.detailGridLabel}>Average Speed</Text>
//                 <Text style={styles.detailGridValue}>
//                   {session.speedData.averageSpeed.toFixed(1)} m/s
//                 </Text>
//               </View>
//             </View>
//           )}

//           {session.notes && (
//             <View style={styles.notesContainer}>
//               <Text style={styles.notesLabel}>Notes:</Text>
//               <Text style={styles.notesText}>{session.notes}</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.sessionActions}>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.shareButton]}
//             onPress={() => shareSession(session)}
//           >
//             <Text style={styles.shareButtonText}>Share Session</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.closeButton]}
//             onPress={() => setSelectedSession(null)}
//           >
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const renderSessionItem = ({ item }) => (
//     <TouchableOpacity 
//       style={[styles.card, styles.cardElevated]}
//       onPress={() => setSelectedSession(selectedSession?._id === item._id ? null : item)}
//     >
//       <View style={styles.sessionHeader}>
//         <View style={styles.sessionType}>
//           <Text style={styles.sessionTypeIcon}>
//             {getSessionTypeIcon(item.mode)}
//           </Text>
//           <Text style={styles.sessionTypeText}>
//             {getSessionTypeName(item.mode)}
//           </Text>
//         </View>
//         <Text style={styles.timeText}>
//           {format(parseISO(item.startTime), 'MMM dd, yyyy')}
//         </Text>
//       </View>

//       <View style={styles.sessionDetails}>
//         <View style={styles.detailRow}>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Duration</Text>
//             <Text style={styles.detailValue}>
//               {formatDuration(item.duration || 0)}
//             </Text>
//           </View>
          
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Distance</Text>
//             <Text style={styles.detailValue}>
//               {formatDistance(item.skatingDistance || item.walkingDistance || 0)}
//             </Text>
//           </View>
//         </View>

//         {/* MODE-SPECIFIC DATA DISPLAY */}
//         {renderModeSpecificData(item)}
        
//         {item.notes && !selectedSession && (
//           <View style={styles.foodDetailsContainer}>
//             <Text style={styles.foodDetailsText}>Notes: {item.notes}</Text>
//           </View>
//         )}

//         <Text style={styles.timeText}>
//           {formatDistanceToNow(parseISO(item.startTime))} ago
//           {selectedSession?._id === item._id ? ' • Tap to collapse' : ' • Tap for details'}
//         </Text>
//       </View>

//       {/* Expanded Session Details */}
//       {renderSessionDetails(item)}
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.card}>
//       <View style={styles.emptyState}>
//         <Text style={styles.emptyStateIcon}>📊</Text>
//         <Text style={styles.emptyStateTitle}>No Sessions Found</Text>
//         <Text style={styles.emptyStateText}>
//           {activeTab === 'all' 
//             ? "You haven't recorded any sessions yet."
//             : `You haven't recorded any ${getTabName(activeTab)} sessions yet.`}
//         </Text>
//         <Text style={styles.emptyStateSubtext}>
//           Start a new session to see your data here.
//         </Text>
//       </View>
//     </View>
//   );

//   const getTabName = (tab) => {
//     switch (tab) {
//       case 'speed': return 'Speed Skating';
//       case 'distance': return 'Distance Skating';
//       case 'steps': return 'Step Counting';
//       default: return 'All';
//     }
//   };

//   const tabs = [
//     { id: 'all', name: 'All Sessions' },
//     { id: 'speed', name: 'Speed' },
//     { id: 'distance', name: 'Distance' },
//     { id: 'steps', name: 'Steps' },
//   ];

//   return (
//     <View style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
      
//       {/* Header */}
//       <LinearGradient
//         colors={getTabGradient(activeTab)}
//         style={styles.headerGradient}
//       >
//         <View style={styles.headerSection}>
//           <View>
//             <Text style={styles.greetingText}>Your Training History</Text>
//             <Text style={styles.headerText}>
//               {getTabName(activeTab)} Sessions
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.profileIcon}>
//             <Text style={{ color: '#fff', fontSize: width * 0.04 }}>👤</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Tab Navigation */}
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           style={styles.topActions}
//           contentContainerStyle={styles.tabContent}
//         >
//           {tabs.map((tab) => (
//             <TouchableOpacity
//               key={tab.id}
//               style={styles.actionCard}
//               onPress={() => {
//                 setActiveTab(tab.id);
//                 setSelectedSession(null);
//               }}
//             >
//               <LinearGradient
//                 colors={activeTab === tab.id ? getTabGradient(tab.id) : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
//                 style={[styles.actionIconContainer, styles.actionIconShadow]}
//               >
//                 <Text style={{ color: '#fff', fontSize: width * 0.05 }}>
//                   {tab.id === 'all' ? '📊' : tab.id === 'speed' ? '⚡' : tab.id === 'distance' ? '📏' : '👣'}
//                 </Text>
//               </LinearGradient>
//               <Text style={styles.actionLabel}>{tab.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </LinearGradient>

//       {/* Content */}
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#667eea']}
//             tintColor="#667eea"
//           />
//         }
//       >
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardTitleContainer}>
//               <Text style={styles.cardTitle}>
//                 {getTabName(activeTab)} Sessions ({filteredSessions.length})
//               </Text>
//             </View>
//             {filteredSessions.length > 0 && (
//               <TouchableOpacity onPress={onRefresh}>
//                 <Text style={styles.timeText}>Refresh</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {loading && !refreshing ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#667eea" />
//               <Text style={styles.loadingText}>Loading sessions...</Text>
//             </View>
//           ) : filteredSessions.length > 0 ? (
//             <FlatList
//               data={filteredSessions}
//               renderItem={renderSessionItem}
//               keyExtractor={(item) => item._id || item.id}
//               scrollEnabled={false}
//               showsVerticalScrollIndicator={false}
//               ItemSeparatorComponent={() => <View style={styles.separator} />}
//             />
//           ) : (
//             renderEmptyState()
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     marginBottom: Platform.OS === 'ios' ? 40 : 40,
//     paddingBottom: Platform.OS === 'ios' ? 0 : 0,
//     backgroundColor: '#F5F7FB',
//   },
//   headerGradient: {
//     marginTop: Platform.OS === 'ios' ? -60 : -10,
//     paddingHorizontal: '6%',
//     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
//     paddingBottom: height * 0.02,
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     shadowColor: '#1A2980',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
//     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
//     elevation: Platform.OS === 'android' ? 10 : 0,
//   },
//   headerSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: '8%',
//   },
//   greetingText: {
//     fontSize: width * 0.045,
//     marginRight: '2%',
//     color: 'rgba(255,255,255,0.9)',
//   },
//   headerText: {
//     fontSize: width * 0.055,
//     color: '#fff',
//     marginTop: '1%',
//   },
//   profileIcon: {
//     width: width * 0.1,
//     height: width * 0.1,
//     borderRadius: width * 0.05,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   topActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: '-2%',
//   },
//   actionCard: {
//     alignItems: 'center',
//     width: '30%',
//     paddingHorizontal: '2%',
//   },
//   actionIconContainer: {
//     width: width * 0.14,
//     height: width * 0.14,
//     borderRadius: width * 0.07,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: '4%',
//   },
//   actionIconShadow: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   actionLabel: {
//     color: '#fff',
//     fontSize: width * 0.033,
//     textAlign: 'center',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: '4%',
//     paddingBottom: '8%',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: '4%',
//     marginBottom: '4%',
//     overflow: 'hidden',
//   },
//   cardElevated: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '4%',
//   },
//   cardTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: width * 0.045,
//     color: '#2E3A59',
//     marginLeft: '2%',
//     fontWeight: '500',
//   },
//   timeText: {
//     fontSize: width * 0.035,
//     color: '#5A6A8C',
//   },
//   // Session item styles
//   sessionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sessionType: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sessionTypeIcon: {
//     fontSize: 18,
//     marginRight: 8,
//   },
//   sessionTypeText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2E3A59',
//   },
//   sessionDetails: {
//     // Details container
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   detailItem: {
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#8e8e93',
//     marginBottom: 2,
//   },
//   detailValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2E3A59',
//   },
//   highlightValue: {
//     color: '#667eea',
//     fontWeight: 'bold',
//   },
//   foodDetailsContainer: {
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   foodDetailsText: {
//     fontSize: 14,
//     color: '#2E3A59',
//     fontWeight: '500',
//   },
//   separator: {
//     height: 12,
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#8e8e93',
//   },
//   emptyState: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyStateIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E3A59',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: '#8e8e93',
//     textAlign: 'center',
//     marginBottom: 4,
//     lineHeight: 20,
//   },
//   emptyStateSubtext: {
//     fontSize: 12,
//     color: '#c7c7cc',
//     textAlign: 'center',
//     lineHeight: 16,
//   },
//   // Expanded session details styles
//   sessionDetailsExpanded: {
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//   },
//   detailSection: {
//     marginBottom: 16,
//   },
//   detailSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2E3A59',
//     marginBottom: 12,
//   },
//   detailGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   detailGridItem: {
//     flex: 1,
//   },
//   detailGridLabel: {
//     fontSize: 12,
//     color: '#8e8e93',
//     marginBottom: 4,
//   },
//   detailGridValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#2E3A59',
//   },
//   notesContainer: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 8,
//   },
//   notesLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#8e8e93',
//     marginBottom: 4,
//   },
//   notesText: {
//     fontSize: 14,
//     color: '#2E3A59',
//     lineHeight: 18,
//   },
//   sessionActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   shareButton: {
//     backgroundColor: '#4B6CB7',
//   },
//   closeButton: {
//     backgroundColor: '#F5F7FB',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   shareButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   closeButtonText: {
//     color: '#2E3A59',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default SessionHistoryScreen;







// // // screens/SessionHistoryScreen.js
// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   RefreshControl,
// //   TouchableOpacity,
// //   FlatList,
// //   ActivityIndicator,
// //   Alert,
// //   Dimensions,
// //   StatusBar,
// //   Platform
// // } from 'react-native';
// // import { useSessionStore, useSpeedSkatingSessions, useDistanceSkatingSessions, useStepCountingSessions, useLast7DaysData } from '../store/useSessionStore';
// // import { format, parseISO, formatDistanceToNow } from 'date-fns';
// // import { LinearGradient } from 'expo-linear-gradient';

// // const { width, height } = Dimensions.get('window');

// // const SessionHistoryScreen = () => {
// //   const [activeTab, setActiveTab] = useState('all');
// //   const [refreshing, setRefreshing] = useState(false);
  
// //   // Get store functions and state
// //   const {
// //     sessions,
// //     loading,
// //     error,
// //     stats,
// //     selectedDate,
// //     selectedMode,
// //     fetchSessions,
// //     fetchSessionStats,
// //     clearError,
// //     setSelectedMode
// //   } = useSessionStore();

// //   // Get specialized session hooks
// //   const { speedSessions, fetchSpeedSessions } = useSpeedSkatingSessions();
// //   const { distanceSessions, fetchDistanceSessions } = useDistanceSkatingSessions();
// //   const { stepSessions, fetchStepSessions } = useStepCountingSessions();
// //   const { getLast7DaysWithData, loading: last7DaysLoading } = useLast7DaysData();

// //   // Filter sessions based on active tab
// //   const getFilteredSessions = () => {
// //     switch (activeTab) {
// //       case 'speed':
// //         return speedSessions;
// //       case 'distance':
// //         return distanceSessions;
// //       case 'steps':
// //         return stepSessions;
// //       default:
// //         return sessions;
// //     }
// //   };

// //   const filteredSessions = getFilteredSessions();

// //   // Load data on component mount
// //   useEffect(() => {
// //     loadData();
// //   }, [activeTab]);

// //   // Show error alerts
// //   useEffect(() => {
// //     if (error) {
// //       Alert.alert('Error', error, [
// //         { text: 'OK', onPress: clearError }
// //       ]);
// //     }
// //   }, [error]);

// //   const loadData = async () => {
// //     try {
// //       switch (activeTab) {
// //         case 'speed':
// //           await fetchSpeedSessions();
// //           break;
// //         case 'distance':
// //           await fetchDistanceSessions();
// //           break;
// //         case 'steps':
// //           await fetchStepSessions();
// //           break;
// //         default:
// //           await fetchSessions();
// //           break;
// //       }
// //       await fetchSessionStats();
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     }
// //   };

// //   const onRefresh = useCallback(async () => {
// //     setRefreshing(true);
// //     await loadData();
// //     setRefreshing(false);
// //   }, [activeTab]);

// //   const formatDuration = (seconds) => {
// //     const hours = Math.floor(seconds / 3600);
// //     const minutes = Math.floor((seconds % 3600) / 60);
// //     const remainingSeconds = seconds % 60;

// //     if (hours > 0) {
// //       return `${hours}h ${minutes}m ${remainingSeconds}s`;
// //     } else if (minutes > 0) {
// //       return `${minutes}m ${remainingSeconds}s`;
// //     } else {
// //       return `${remainingSeconds}s`;
// //     }
// //   };

// //   const formatDistance = (meters) => {
// //     if (meters >= 1000) {
// //       return `${(meters / 1000).toFixed(2)} km`;
// //     }
// //     return `${meters.toFixed(0)} m`;
// //   };

// //   const getSessionTypeIcon = (mode) => {
// //     switch (mode) {
// //       case 'SS':
// //         return '⚡';
// //       case 'SD':
// //         return '📏';
// //       case 'S':
// //         return '👣';
// //       default:
// //         return '🎯';
// //     }
// //   };

// //   const getSessionTypeName = (mode) => {
// //     switch (mode) {
// //       case 'SS':
// //         return 'Speed Skating';
// //       case 'SD':
// //         return 'Distance Skating';
// //       case 'S':
// //         return 'Step Counting';
// //       default:
// //         return 'Unknown';
// //     }
// //   };

// //   const getTabGradient = (tabId) => {
// //     const gradients = {
// //       all: ['#667eea', '#764ba2'],
// //       speed: ['#f093fb', '#f5576c'],
// //       distance: ['#4facfe', '#00f2fe'],
// //       steps: ['#43e97b', '#38f9d7']
// //     };
// //     return gradients[tabId] || gradients.all;
// //   };

// //   const renderSessionItem = ({ item }) => (
// //     <TouchableOpacity style={[styles.card, styles.cardElevated]}>
// //       <View style={styles.sessionHeader}>
// //         <View style={styles.sessionType}>
// //           <Text style={styles.sessionTypeIcon}>
// //             {getSessionTypeIcon(item.mode)}
// //           </Text>
// //           <Text style={styles.sessionTypeText}>
// //             {getSessionTypeName(item.mode)}
// //           </Text>
// //         </View>
// //         <Text style={styles.timeText}>
// //           {format(parseISO(item.startTime), 'MMM dd, yyyy')}
// //         </Text>
// //       </View>

// //       <View style={styles.sessionDetails}>
// //         <View style={styles.detailRow}>
// //           <View style={styles.detailItem}>
// //             <Text style={styles.detailLabel}>Duration</Text>
// //             <Text style={styles.detailValue}>
// //               {formatDuration(item.duration || 0)}
// //             </Text>
// //           </View>
          
// //           <View style={styles.detailItem}>
// //             <Text style={styles.detailLabel}>Distance</Text>
// //             <Text style={styles.detailValue}>
// //               {formatDistance(item.skatingDistance || item.walkingDistance || 0)}
// //             </Text>
// //           </View>
// //         </View>

// //         <View style={styles.detailRow}>
// //           {item.stepCount > 0 && (
// //             <View style={styles.detailItem}>
// //               <Text style={styles.detailLabel}>Steps</Text>
// //               <Text style={styles.detailValue}>
// //                 {item.stepCount?.toLocaleString() || '0'}
// //               </Text>
// //             </View>
// //           )}
          
// //           {item.speedData?.maxSpeed > 0 && (
// //             <View style={styles.detailItem}>
// //               <Text style={styles.detailLabel}>Max Speed</Text>
// //               <Text style={styles.detailValue}>
// //                 {item.speedData.maxSpeed.toFixed(1)} m/s
// //               </Text>
// //             </View>
// //           )}
// //         </View>

// //         {item.notes && (
// //           <View style={styles.foodDetailsContainer}>
// //             <Text style={styles.foodDetailsText}>Notes: {item.notes}</Text>
// //           </View>
// //         )}

// //         <Text style={styles.timeText}>
// //           {formatDistanceToNow(parseISO(item.startTime))} ago
// //         </Text>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   const renderStatsCard = () => {
// //     if (!stats || loading) return null;

// //     return (
// //       <LinearGradient
// //         colors={['#667eea', '#764ba2']}
// //         style={[styles.card, styles.activityGradient]}
// //       >
// //         <View style={styles.cardHeader}>
// //           <View style={styles.cardTitleContainer}>
// //             <Text style={styles.cardTitle}>Session Statistics</Text>
// //           </View>
// //         </View>

// //         {/* <View style={styles.activityGrid}>
// //           <View style={styles.activityMetricCard}>
// //             <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
// //               <Text style={[styles.metricValue, { color: '#fff' }]}>{stats.totalSessions || 0}</Text>
// //             </View>
// //             <Text style={[styles.metricLabel, { color: 'rgba(255,255,255,0.9)' }]}>Total Sessions</Text>
// //           </View>

// //           <View style={styles.activityMetricCard}>
// //             <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
// //               <Text style={[styles.metricValue, { color: '#fff' }]}>
// //                 {formatDistance(stats.totalDistance || 0)}
// //               </Text>
// //             </View>
// //             <Text style={[styles.metricLabel, { color: 'rgba(255,255,255,0.9)' }]}>Total Distance</Text>
// //           </View>

// //           <View style={styles.activityMetricCard}>
// //             <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
// //               <Text style={[styles.metricValue, { color: '#fff' }]}>
// //                 {formatDuration(stats.totalDuration || 0)}
// //               </Text>
// //             </View>
// //             <Text style={[styles.metricLabel, { color: 'rgba(255,255,255,0.9)' }]}>Total Time</Text>
// //           </View>

// //           <View style={styles.activityMetricCard}>
// //             <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
// //               <Text style={[styles.metricValue, { color: '#fff' }]}>
// //                 {(stats.averageSpeed || 0).toFixed(1)}
// //               </Text>
// //             </View>
// //             <Text style={[styles.metricLabel, { color: 'rgba(255,255,255,0.9)' }]}>Avg Speed (m/s)</Text>
// //           </View>
// //         </View> */}
// //       </LinearGradient>
// //     );
// //   };

// //   const renderEmptyState = () => (
// //     <View style={styles.card}>
// //       <View style={styles.emptyState}>
// //         <Text style={styles.emptyStateIcon}>📊</Text>
// //         <Text style={styles.emptyStateTitle}>No Sessions Found</Text>
// //         <Text style={styles.emptyStateText}>
// //           {activeTab === 'all' 
// //             ? "You haven't recorded any sessions yet."
// //             : `You haven't recorded any ${getTabName(activeTab)} sessions yet.`}
// //         </Text>
// //         <Text style={styles.emptyStateSubtext}>
// //           Start a new session to see your data here.
// //         </Text>
// //       </View>
// //     </View>
// //   );

// //   const getTabName = (tab) => {
// //     switch (tab) {
// //       case 'speed': return 'Speed Skating';
// //       case 'distance': return 'Distance Skating';
// //       case 'steps': return 'Step Counting';
// //       default: return 'All';
// //     }
// //   };

// //   const tabs = [
// //     { id: 'all', name: 'All Sessions' },
// //     { id: 'speed', name: 'Speed' },
// //     { id: 'distance', name: 'Distance' },
// //     { id: 'steps', name: 'Steps' },
// //   ];

// //   return (
// //     <View style={styles.safeArea}>
// //       <StatusBar barStyle="light-content" />
      
// //       {/* Header */}
// //       <LinearGradient
// //         colors={['#667eea', '#764ba2']}
// //         style={styles.headerGradient}
// //       >
// //         <View style={styles.headerSection}>
// //           <View>
// //             <Text style={styles.greetingText}>Your Training History</Text>
// //             <Text style={styles.headerText}>Session Records</Text>
// //           </View>
// //           <TouchableOpacity style={styles.profileIcon}>
// //             <Text style={{ color: '#fff', fontSize: width * 0.04 }}>👤</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Tab Navigation */}
// //         {/* <ScrollView 
// //           horizontal 
// //           showsHorizontalScrollIndicator={false}
// //           style={styles.topActions}
// //           contentContainerStyle={styles.tabContent}
// //         >
// //           {tabs.map((tab) => (
// //             <TouchableOpacity
// //               key={tab.id}
// //               style={styles.actionCard}
// //               onPress={() => setActiveTab(tab.id)}
// //             >
// //               <LinearGradient
// //                 colors={activeTab === tab.id ? getTabGradient(tab.id) : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
// //                 style={[styles.actionIconContainer, styles.actionIconShadow]}
// //               >
// //                 <Text style={{ color: '#fff', fontSize: width * 0.05 }}>
// //                   {tab.id === 'all' ? '📊' : tab.id === 'speed' ? '⚡' : tab.id === 'distance' ? '📏' : '👣'}
// //                 </Text>
// //               </LinearGradient>
// //               <Text style={styles.actionLabel}>{tab.name}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </ScrollView> */}
// // // In SessionHistoryScreen.js, update the ScrollView section:

// // {/* Content */}
// // <ScrollView 
// //   style={styles.scrollView}
// //   contentContainerStyle={styles.scrollContent}
// //   refreshControl={
// //     <RefreshControl
// //       refreshing={refreshing}
// //       onRefresh={onRefresh}
// //       colors={['#667eea']}
// //       tintColor="#667eea"
// //     />
// //   }
// // >
// //   {renderStatsCard()}

// //   <View style={styles.card}>
// //     <View style={styles.cardHeader}>
// //       <View style={styles.cardTitleContainer}>
// //         <Text style={styles.cardTitle}>
// //           {getTabName(activeTab)} Sessions ({filteredSessions.length})
// //         </Text>
// //       </View>
// //       {filteredSessions.length > 0 && (
// //         <TouchableOpacity onPress={onRefresh}>
// //           <Text style={styles.timeText}>Refresh</Text>
// //         </TouchableOpacity>
// //       )}
// //     </View>

// //     {loading && !refreshing ? (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#667eea" />
// //         <Text style={styles.loadingText}>Loading sessions...</Text>
// //       </View>
// //     ) : filteredSessions.length > 0 ? (
// //       <FlatList
// //         data={filteredSessions}
// //         renderItem={renderSessionItem}
// //         keyExtractor={(item) => item._id || item.id}
// //         scrollEnabled={false}
// //         showsVerticalScrollIndicator={false}
// //         ItemSeparatorComponent={() => <View style={styles.separator} />}
// //       />
// //     ) : (
// //       renderEmptyState()
// //     )}
// //   </View>
// // </ScrollView>

// //       </LinearGradient>

// //       {/* Content */}
// //       <ScrollView 
// //         style={styles.scrollView}
// //         contentContainerStyle={styles.scrollContent}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={['#667eea']}
// //             tintColor="#667eea"
// //           />
// //         }
// //       >
// //         {renderStatsCard()}

// //         <View style={styles.card}>
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <Text style={styles.cardTitle}>
// //                 {getTabName(activeTab)} Sessions ({filteredSessions.length})
// //               </Text>
// //             </View>
// //             {filteredSessions.length > 0 && (
// //               <TouchableOpacity onPress={onRefresh}>
// //                 <Text style={styles.timeText}>Refresh</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>

// //           {loading && !refreshing ? (
// //             <View style={styles.loadingContainer}>
// //               <ActivityIndicator size="large" color="#667eea" />
// //               <Text style={styles.loadingText}>Loading sessions...</Text>
// //             </View>
// //           ) : filteredSessions.length > 0 ? (
// //             <FlatList
// //               data={filteredSessions}
// //               renderItem={renderSessionItem}
// //               keyExtractor={(item) => item._id || item.id}
// //               scrollEnabled={false}
// //               showsVerticalScrollIndicator={false}
// //               ItemSeparatorComponent={() => <View style={styles.separator} />}
// //             />
// //           ) : (
// //             renderEmptyState()
// //           )}
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     marginBottom: Platform.OS === 'ios' ? 40 : 40,
// //     paddingBottom: Platform.OS === 'ios' ? 0 : 0,
// //     backgroundColor: '#F5F7FB',
// //   },
// //   headerGradient: {
// //     marginTop: Platform.OS === 'ios' ? -60 : -10,
// //     paddingHorizontal: '6%',
// //     paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
// //     paddingBottom: height * 0.02,
// //     borderBottomLeftRadius: 40,
// //     borderBottomRightRadius: 40,
// //     shadowColor: '#1A2980',
// //     shadowOffset: { width: 0, height: 10 },
// //     shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
// //     shadowRadius: Platform.OS === 'ios' ? 20 : 0,
// //     elevation: Platform.OS === 'android' ? 10 : 0,
// //   },
// //   headerSection: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     marginBottom: '8%',
// //   },
// //   greetingText: {
// //     fontSize: width * 0.045,
// //     marginRight: '2%',
// //     color: 'rgba(255,255,255,0.9)',
// //   },
// //   headerText: {
// //     fontSize: width * 0.055,
// //     color: '#fff',
// //     marginTop: '1%',
// //   },
// //   profileIcon: {
// //     width: width * 0.1,
// //     height: width * 0.1,
// //     borderRadius: width * 0.05,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   topActions: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginHorizontal: '-2%',
// //   },
// //   actionCard: {
// //     alignItems: 'center',
// //     width: '30%',
// //     paddingHorizontal: '2%',
// //   },
// //   actionIconContainer: {
// //     width: width * 0.14,
// //     height: width * 0.14,
// //     borderRadius: width * 0.07,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: '4%',
// //   },
// //   actionIconShadow: {
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //     elevation: 3,
// //   },
// //   actionLabel: {
// //     color: '#fff',
// //     fontSize: width * 0.033,
// //     textAlign: 'center',
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     padding: '4%',
// //     paddingBottom: '8%',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: '4%',
// //     marginBottom: '4%',
// //     overflow: 'hidden',
// //   },
// //   cardElevated: {
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: '4%',
// //   },
// //   cardTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   cardTitle: {
// //     fontSize: width * 0.045,
// //     color: '#2E3A59',
// //     marginLeft: '2%',
// //     fontWeight: '500',
// //   },
// //   timeText: {
// //     fontSize: width * 0.035,
// //     color: '#5A6A8C',
// //   },
// //   activityGradient: {
// //     padding: '4%',
// //     borderRadius: 16,
// //   },
// //   activityGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //   },
// //   activityMetricCard: {
// //     width: '48%',
// //     borderRadius: 12,
// //     padding: '4%',
// //     marginBottom: '4%',
// //     alignItems: 'center',
// //   },
// //   metricIconContainer: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: '4%',
// //   },
// //   metricValue: {
// //     fontSize: width * 0.04,
// //     fontWeight: 'bold',
// //   },
// //   metricLabel: {
// //     fontSize: width * 0.03,
// //     textAlign: 'center',
// //   },
// //   // Session item styles
// //   sessionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   sessionType: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   sessionTypeIcon: {
// //     fontSize: 18,
// //     marginRight: 8,
// //   },
// //   sessionTypeText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#2E3A59',
// //   },
// //   sessionDetails: {
// //     // Details container
// //   },
// //   detailRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 8,
// //   },
// //   detailItem: {
// //     flex: 1,
// //   },
// //   detailLabel: {
// //     fontSize: 12,
// //     color: '#8e8e93',
// //     marginBottom: 2,
// //   },
// //   detailValue: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#2E3A59',
// //   },
// //   foodDetailsContainer: {
// //     backgroundColor: 'rgba(255,255,255,0.7)',
// //     borderRadius: 12,
// //     padding: 12,
// //     marginTop: 8,
// //     marginBottom: 8,
// //   },
// //   foodDetailsText: {
// //     fontSize: 14,
// //     color: '#2E3A59',
// //     fontWeight: '500',
// //   },
// //   separator: {
// //     height: 12,
// //   },
// //   loadingContainer: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingVertical: 40,
// //   },
// //   loadingText: {
// //     marginTop: 12,
// //     fontSize: 16,
// //     color: '#8e8e93',
// //   },
// //   emptyState: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingVertical: 40,
// //   },
// //   emptyStateIcon: {
// //     fontSize: 48,
// //     marginBottom: 16,
// //   },
// //   emptyStateTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#2E3A59',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   emptyStateText: {
// //     fontSize: 14,
// //     color: '#8e8e93',
// //     textAlign: 'center',
// //     marginBottom: 4,
// //     lineHeight: 20,
// //   },
// //   emptyStateSubtext: {
// //     fontSize: 12,
// //     color: '#c7c7cc',
// //     textAlign: 'center',
// //     lineHeight: 16,
// //   },
// // });

// // export default SessionHistoryScreen;