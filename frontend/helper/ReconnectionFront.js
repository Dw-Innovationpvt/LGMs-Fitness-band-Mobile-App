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
} from 'react-native';
import { useBLEStore } from '../store/augBleStore';
import { useBLEReconnectionStore } from '../store/useBLEReconnectionStore';

/**
 * BLE Connection Manager Component
 * Demonstrates auto-reconnection functionality
 * 
 * Features:
 * 1. Automatic reconnection on app startup if device was previously connected
 * 2. Manual reconnection button
 * 3. Connection status display
 * 4. Reconnection attempt counter
 * 5. Connection history viewer
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
    reconnectAttempts,
    maxReconnectAttempts,
    loadSavedDevice,
    manualReconnect,
    getReconnectionStatus,
    clearSavedDevice,
    connectionHistory,
    loadConnectionHistory,
    hasSavedDevice,
  } = useBLEReconnectionStore();

  const [status, setStatus] = useState('Initializing...');
  const [showHistory, setShowHistory] = useState(false);

  // ========== Lifecycle: App Startup ==========
  useEffect(() => {
    /**
     * On component mount:
     * 1. Load saved device from AsyncStorage
     * 2. Load connection history
     * 3. Attempt auto-reconnection if device was previously connected
     */
    const initializeConnection = async () => {
      console.log('🚀 Initializing BLE connection manager...');
      
      // Load saved device data
      const device = await loadSavedDevice();
      
      // Load connection history
      await loadConnectionHistory();

      if (device) {
        console.log('📱 Found previously connected device:', device.name);
        setStatus(`Previous device: ${device.name}`);
        
        // Prompt user for auto-reconnection
        Alert.alert(
          'Previous Connection Found',
          `Would you like to reconnect to ${device.name}?`,
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => setStatus('Waiting for connection...'),
            },
            {
              text: 'Yes',
              onPress: async () => {
                setStatus('Attempting auto-reconnection...');
                const success = await manualReconnect();
                if (success) {
                  setStatus(`Connected to ${device.name}`);
                } else {
                  setStatus('Auto-reconnection failed');
                }
              },
            },
          ]
        );
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
      setStatus(`Connected to ${connectedDevice.name || 'Device'}`);
    } else if (isAttemptingReconnect) {
      setStatus(`Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`);
    } else if (!isConnected && !isAttemptingReconnect) {
      setStatus('Disconnected');
    }
  }, [isConnected, connectedDevice, isAttemptingReconnect, reconnectAttempts]);

  // ========== Event Handlers ==========

  /**
   * Handle device scanning
   */
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

  /**
   * Handle device connection
   */
  const handleConnect = async (device) => {
    console.log('🔗 Connecting to device:', device.name);
    setStatus(`Connecting to ${device.name}...`);
    
    try {
      await connectToDevice(device);
      setStatus(`Connected to ${device.name}`);
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('Connection failed');
      Alert.alert('Connection Error', error.message);
    }
  };

  /**
   * Handle manual reconnection
   */
  const handleManualReconnect = async () => {
    console.log('🔄 Manual reconnection requested...');
    setStatus('Attempting manual reconnection...');
    
    const success = await manualReconnect();
    
    if (success) {
      setStatus('Reconnection successful!');
    } else {
      setStatus('Reconnection failed');
    }
  };

  /**
   * Handle disconnection
   */
  const handleDisconnect = async () => {
    console.log('🔌 Disconnecting device...');
    
    Alert.alert(
      'Disconnect Device',
      'Do you want to forget this device?',
      [
        {
          text: 'Disconnect Only',
          onPress: async () => {
            await disconnect();
            setStatus('Disconnected (device saved)');
          },
        },
        {
          text: 'Disconnect & Forget',
          style: 'destructive',
          onPress: async () => {
            await disconnect();
            await clearSavedDevice();
            setStatus('Disconnected (device forgotten)');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  /**
   * Get event icon based on event type
   */
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

  // ========== Render ==========
  return (
    <ScrollView style={styles.container}>
      {/* Connection Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Connection Status</Text>
        <Text style={styles.statusText}>{status}</Text>
        
        {isAttemptingReconnect && (
          <View style={styles.reconnectingIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.reconnectingText}>
              Attempt {reconnectAttempts} of {maxReconnectAttempts}
            </Text>
          </View>
        )}

        {/* Connection Indicator */}
        <View style={[
          styles.indicator,
          { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
        ]}>
          <Text style={styles.indicatorText}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </Text>
        </View>
      </View>

      {/* Saved Device Info */}
      {savedDevice && (
        <View style={styles.deviceCard}>
          <Text style={styles.cardTitle}>Saved Device</Text>
          <Text style={styles.deviceName}>{savedDevice.name}</Text>
          <Text style={styles.deviceId}>ID: {savedDevice.id}</Text>
          <Text style={styles.deviceDate}>
            Saved: {formatTimestamp(savedDevice.savedAt)}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!isConnected && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Scan for Devices</Text>
              )}
            </TouchableOpacity>

            {hasSavedDevice() && (
              <TouchableOpacity
                style={[styles.button, styles.reconnectButton]}
                onPress={handleManualReconnect}
                disabled={isAttemptingReconnect}
              >
                {isAttemptingReconnect ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reconnect to Saved Device</Text>
                )}
              </TouchableOpacity>
            )}
          </>
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
          <Text style={styles.cardTitle}>Found Devices</Text>
          {foundDevices.map((device, index) => (
            <TouchableOpacity
              key={index}
              style={styles.deviceItem}
              onPress={() => handleConnect(device)}
            >
              <Text style={styles.deviceItemName}>
                {device.name || 'Unknown Device'}
              </Text>
              <Text style={styles.deviceItemId}>{device.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
  },
  reconnectingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
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
  reconnectButton: {
    backgroundColor: '#FF9500',
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