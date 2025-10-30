// components/BLEConnectionManager.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useBLEStore } from '../store/augBleStore';
import { useBLEReconnectionStore } from '../store/useBLEReconnectionStore';

/**
 * BLE Connection Manager Component
 * Features CONTINUOUS auto-reconnection
 * 
 * Once connected manually:
 * - Device info is saved
 * - If device goes out of range → Continuously scans every 3 seconds
 * - When device comes back → AUTOMATICALLY reconnects (no user action!)
 * - Repeats indefinitely until user manually disconnects
 */
const BLEConnectionManager = () => {
  // ========== State Management ==========
  const {
    connectedDevice,
    isConnected,
    isScanning,
    foundDevices,
    scanForDevices,
    connectToDevice,
    disconnect,
  } = useBLEStore();

  const {
    savedDevice,
    isAttemptingReconnect,
    continuousReconnectEnabled,
    reconnectAttemptCount,
    loadSavedDevice,
    setAutoReconnect,
    getReconnectionStatus,
    clearSavedDevice,
    connectionHistory,
    loadConnectionHistory,
    isAutoReconnectActive,
  } = useBLEReconnectionStore();

  const [status, setStatus] = useState('Initializing...');
  const [showHistory, setShowHistory] = useState(false);
  const [autoReconnectToggle, setAutoReconnectToggle] = useState(false);

  // ========== Lifecycle: App Startup ==========
  useEffect(() => {
    const initializeConnection = async () => {
      console.log('🚀 Initializing BLE connection manager...');
      
      const device = await loadSavedDevice();
      await loadConnectionHistory();

      if (device) {
        console.log('📱 Found previously connected device:', device.name);
        setStatus(`Previous device: ${device.name}`);
        setAutoReconnectToggle(true);
        
        // Automatically start reconnection if not connected
        if (!isConnected) {
          Alert.alert(
            'Auto-Reconnection Active',
            `Your device "${device.name}" will reconnect automatically when in range.\n\nScanning in background...`,
            [{ text: 'OK' }]
          );
          setStatus(`Waiting for ${device.name} to come in range...`);
        }
      } else {
        console.log('📭 No previous device found');
        setStatus('No previous connection found');
      }
    };

    initializeConnection();
  }, []);

  // ========== Monitor Connection Status ==========
  useEffect(() => {
    if (isConnected && connectedDevice) {
      setStatus(`✅ Connected to ${connectedDevice.name || 'Device'}`);
      setAutoReconnectToggle(true);
    } else if (isAttemptingReconnect) {
      setStatus(`🔄 Auto-reconnecting... (Attempt #${reconnectAttemptCount})`);
    } else if (savedDevice && continuousReconnectEnabled) {
      setStatus(`📡 Scanning for ${savedDevice.name}...`);
    } else if (!isConnected && !isAttemptingReconnect) {
      setStatus('Disconnected');
    }
  }, [isConnected, connectedDevice, isAttemptingReconnect, reconnectAttemptCount, continuousReconnectEnabled, savedDevice]);

  // ========== Monitor Auto-Reconnect Toggle ==========
  useEffect(() => {
    setAutoReconnectToggle(continuousReconnectEnabled);
  }, [continuousReconnectEnabled]);

  // ========== Event Handlers ==========

  const handleScan = async () => {
    console.log('🔍 Starting device scan...');
    setStatus('Scanning for devices...');
    
    try {
      const devices = await scanForDevices();
      console.log(`Found ${devices.length} devices`);
      
      if (devices.length === 0) {
        setStatus('No devices found');
      } else {
        setStatus(`Found ${devices.length} device(s)`);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setStatus('Scan failed');
    }
  };

  const handleConnect = async (device) => {
    console.log('🔗 Connecting to device:', device.name);
    setStatus(`Connecting to ${device.name}...`);
    
    try {
      await connectToDevice(device);
      setStatus(`Connected to ${device.name}`);
      setAutoReconnectToggle(true);
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('Connection failed');
      Alert.alert('Connection Error', error.message);
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Device',
      'Do you want to keep auto-reconnection enabled?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disconnect & Forget',
          style: 'destructive',
          onPress: async () => {
            await disconnect(true); // forgetDevice = true
            setAutoReconnectToggle(false);
            setStatus('Disconnected (device forgotten)');
          },
        },
        {
          text: 'Disconnect Only',
          onPress: async () => {
            await disconnect(false); // Keep device saved
            setStatus('Disconnected (device saved)');
          },
        },
      ]
    );
  };

  const handleAutoReconnectToggle = (value) => {
    setAutoReconnectToggle(value);
    setAutoReconnect(value);
    
    if (value) {
      Alert.alert(
        'Auto-Reconnection Enabled',
        'Your device will automatically reconnect when it comes back in range.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Auto-Reconnection Disabled',
        'Your device will not reconnect automatically. You can reconnect manually from the device list.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getEventIcon = (event) => {
    switch (event) {
      case 'connected':
        return '✅';
      case 'disconnected':
        return '🔌';
      case 'reconnected':
        return '🔄';
      case 'reconnection_failed':
        return '❌';
      default:
        return '📝';
    }
  };

  const getStatusColor = () => {
    if (isConnected) return '#4CAF50';
    if (isAttemptingReconnect) return '#FF9500';
    return '#F44336';
  };

  const getStatusIcon = () => {
    if (isConnected) return '●';
    if (isAttemptingReconnect) return '◐';
    return '○';
  };

  // ========== Render ==========
  return (
    <ScrollView style={styles.container}>
      {/* Connection Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Connection Status</Text>
        <Text style={styles.statusText}>{status}</Text>
        
        {isAttemptingReconnect && (
          <View style={styles.reconnectingIndicator}>
            <ActivityIndicator size="small" color="#FF9500" />
            <Text style={styles.reconnectingText}>
              Continuous scanning active (Attempt #{reconnectAttemptCount})
            </Text>
          </View>
        )}

        <View style={[
          styles.indicator,
          { backgroundColor: getStatusColor() }
        ]}>
          <Text style={styles.indicatorText}>
            {getStatusIcon()} {isConnected ? 'Connected' : isAttemptingReconnect ? 'Reconnecting' : 'Disconnected'}
          </Text>
        </View>
      </View>

      {/* Auto-Reconnection Control */}
      {savedDevice && (
        <View style={styles.autoReconnectCard}>
          <View style={styles.autoReconnectHeader}>
            <View>
              <Text style={styles.autoReconnectTitle}>
                🔄 Auto-Reconnection
              </Text>
              <Text style={styles.autoReconnectSubtitle}>
                {autoReconnectToggle 
                  ? 'Device will reconnect automatically' 
                  : 'Manual reconnection required'}
              </Text>
            </View>
            <Switch
              value={autoReconnectToggle}
              onValueChange={handleAutoReconnectToggle}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              thumbColor={autoReconnectToggle ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          {autoReconnectToggle && !isConnected && (
            <View style={styles.autoReconnectInfo}>
              <Text style={styles.autoReconnectInfoText}>
                📡 Scanning every 3 seconds for "{savedDevice.name}"
              </Text>
              <Text style={styles.autoReconnectInfoText}>
                💡 Device will connect automatically when in range
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Saved Device Info */}
      {savedDevice && (
        <View style={styles.deviceCard}>
          <Text style={styles.cardTitle}>Saved Device</Text>
          <Text style={styles.deviceName}>{savedDevice.name}</Text>
          <Text style={styles.deviceId}>ID: {savedDevice.id}</Text>
          <Text style={styles.deviceDate}>
            Saved: {formatTimestamp(savedDevice.savedAt)}
          </Text>
          
          <TouchableOpacity
            style={styles.forgetButton}
            onPress={async () => {
              Alert.alert(
                'Forget Device',
                'Are you sure? Auto-reconnection will be disabled.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Forget',
                    style: 'destructive',
                    onPress: async () => {
                      await clearSavedDevice();
                      setAutoReconnectToggle(false);
                      setStatus('Device forgotten');
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.forgetButtonText}>Forget Device</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!isConnected && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Scan for New Devices</Text>
            )}
          </TouchableOpacity>
        )}

        {isConnected && (
          <TouchableOpacity
            style={[styles.button, styles.disconnectButton]}
            onPress={handleDisconnect}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Found Devices List */}
      {foundDevices.length > 0 && !isConnected && (
        <View style={styles.devicesCard}>
          <Text style={styles.cardTitle}>Available Devices</Text>
          {foundDevices.map((device, index) => (
            <TouchableOpacity
              key={index}
              style={styles.deviceItem}
              onPress={() => handleConnect(device)}
            >
              <View>
                <Text style={styles.deviceItemName}>
                  {device.name || 'Unknown Device'}
                </Text>
                <Text style={styles.deviceItemId}>{device.id}</Text>
              </View>
              <Text style={styles.connectArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ How Auto-Reconnection Works</Text>
        <Text style={styles.infoText}>
          1. Connect to device manually (first time only)
        </Text>
        <Text style={styles.infoText}>
          2. Device info is saved automatically
        </Text>
        <Text style={styles.infoText}>
          3. If device goes out of range → Scans every 3 seconds
        </Text>
        <Text style={styles.infoText}>
          4. When back in range → Reconnects automatically!
        </Text>
        <Text style={styles.infoText}>
          5. No user action needed 🎉
        </Text>
      </View>

      {/* Connection History */}
      <TouchableOpacity
        style={styles.historyToggle}
        onPress={() => setShowHistory(!showHistory)}
      >
        <Text style={styles.historyToggleText}>
          {showHistory ? '▼' : '▶'} Connection History ({connectionHistory.length})
        </Text>
      </TouchableOpacity>

      {showHistory && (
        <View style={styles.historyCard}>
          {connectionHistory.length === 0 ? (
            <Text style={styles.emptyHistory}>No connection history</Text>
          ) : (
            connectionHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyIcon}>
                  {getEventIcon(entry.event)}
                </Text>
                <View style={styles.historyContent}>
                  <Text style={styles.historyEvent}>{entry.event}</Text>
                  <Text style={styles.historyDevice}>
                    {entry.device?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.historyTime}>
                    {formatTimestamp(entry.timestamp)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

// ========== Styles ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  reconnectingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  reconnectingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
  },
  indicator: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  indicatorText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  autoReconnectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  autoReconnectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoReconnectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  autoReconnectSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  autoReconnectInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  autoReconnectInfoText: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 4,
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  deviceDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  forgetButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  forgetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceItemId: {
    fontSize: 12,
    color: '#999',
  },
  connectArrow: {
    fontSize: 24,
    color: '#007AFF',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 6,
    paddingLeft: 8,
  },
  historyToggle: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  historyToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  emptyHistory: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyEvent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  historyDevice: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 11,
    color: '#999',
  },
});

export default BLEConnectionManager;