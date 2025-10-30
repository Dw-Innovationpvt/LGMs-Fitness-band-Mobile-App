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
 * - If device goes out of range → Continuously scans every 5 seconds
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
    initializeBLE,
  } = useBLEStore();

  const {
    savedDevice,
    isAttemptingReconnect,
    continuousReconnectEnabled,
    reconnectAttemptCount,
    isCurrentlyScanning,
    loadSavedDevice,
    setAutoReconnect,
    getReconnectionStatus,
    clearSavedDevice,
    connectionHistory,
    loadConnectionHistory,
    isAutoReconnectActive,
    manualReconnect,
    forceStopReconnection,
  } = useBLEReconnectionStore();

  const [status, setStatus] = useState('Initializing...');
  const [showHistory, setShowHistory] = useState(false);
  const [autoReconnectToggle, setAutoReconnectToggle] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // ========== Lifecycle: App Startup ==========
  useEffect(() => {
    const initializeConnection = async () => {
      console.log('🚀 Initializing BLE connection manager...');
      setIsInitializing(true);
      
      try {
        // Initialize BLE store with auto-reconnection
        await initializeBLE();
        
        // Load saved device and history
        const device = await loadSavedDevice();
        await loadConnectionHistory();

        if (device) {
          console.log('📱 Found previously connected device:', device.name);
          setStatus(`Previous device: ${device.name}`);
          setAutoReconnectToggle(true);
          
          // Check if we're already connected
          if (!isConnected) {
            const reconnectionStatus = getReconnectionStatus();
            console.log('🔍 Reconnection status:', reconnectionStatus);
            
            if (reconnectionStatus.continuousReconnectEnabled && !reconnectionStatus.isAttemptingReconnect) {
              console.log('🔄 Auto-starting reconnection for saved device...');
              setStatus(`🔄 Auto-reconnecting to ${device.name}...`);
            } else {
              setStatus(`Ready to connect to ${device.name}`);
            }
          }
        } else {
          console.log('📭 No previous device found');
          setStatus('No previous connection found');
        }
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setStatus('Initialization failed');
      } finally {
        setIsInitializing(false);
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
      setStatus(`🔄 Scanning for device... (Attempt #${reconnectAttemptCount})`);
    } else if (savedDevice && continuousReconnectEnabled) {
      setStatus(`📡 Waiting for ${savedDevice.name}...`);
    } else if (savedDevice && !continuousReconnectEnabled) {
      setStatus(`💤 ${savedDevice.name} saved (auto-reconnect off)`);
    } else if (!isConnected && !isAttemptingReconnect) {
      setStatus('Disconnected - Scan for devices');
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
      // Stop any ongoing reconnection before manual scan
      if (isAttemptingReconnect) {
        forceStopReconnection();
      }
      
      const devices = await scanForDevices();
      console.log(`Found ${devices.length} devices`);
      
      if (devices.length === 0) {
        setStatus('No devices found');
        Alert.alert(
          'No Devices Found',
          'Make sure your fitness band is:\n• Powered on\n• In range\n• Not connected to another device',
          [{ text: 'OK' }]
        );
      } else {
        setStatus(`Found ${devices.length} device(s) - Tap to connect`);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setStatus('Scan failed');
      Alert.alert('Scan Error', error.message || 'Failed to scan for devices');
    }
  };

  const handleConnect = async (device) => {
    console.log('🔗 Connecting to device:', device.name);
    setStatus(`Connecting to ${device.name}...`);
    
    try {
      await connectToDevice(device);
      setStatus(`✅ Connected to ${device.name}`);
      setAutoReconnectToggle(true);
      
      Alert.alert(
        'Connected Successfully!',
        `You are now connected to ${device.name}\n\nAuto-reconnection is ENABLED. Your device will reconnect automatically if disconnected.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('Connection failed');
      Alert.alert(
        'Connection Failed',
        error.message || 'Failed to connect to device. Please try again.'
      );
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Device',
      'Choose disconnect option:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disconnect & Forget',
          style: 'destructive',
          onPress: async () => {
            setStatus('Disconnecting and forgetting device...');
            await disconnect(true); // forgetDevice = true
            setAutoReconnectToggle(false);
            setStatus('Disconnected (device forgotten)');
            
            Alert.alert(
              'Device Forgotten',
              'Device has been disconnected and removed from saved devices. Auto-reconnection is disabled.',
              [{ text: 'OK' }]
            );
          },
        },
        {
          text: 'Disconnect Only',
          onPress: async () => {
            setStatus('Disconnecting...');
            await disconnect(false); // Keep device saved
            setStatus('Disconnected (device saved)');
            
            Alert.alert(
              'Disconnected',
              'Device disconnected but saved for future connections. Enable auto-reconnect to reconnect automatically.',
              [
                { text: 'OK' },
                {
                  text: 'Enable Auto-Reconnect',
                  onPress: () => {
                    setAutoReconnect(true);
                    setAutoReconnectToggle(true);
                  }
                }
              ]
            );
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
        'Your device will automatically reconnect when it comes back in range. Continuous scanning will start now.',
        [{ text: 'OK' }]
      );
      setStatus(`🔄 Auto-reconnecting to ${savedDevice?.name}...`);
    } else {
      Alert.alert(
        'Auto-Reconnection Disabled',
        'Your device will not reconnect automatically. You can reconnect manually from the device list.',
        [{ text: 'OK' }]
      );
      setStatus('Auto-reconnect disabled');
    }
  };

  const handleManualReconnect = async () => {
    if (!savedDevice) {
      Alert.alert('No Saved Device', 'No device found to reconnect to.');
      return;
    }
    
    console.log('🔄 Manual reconnection triggered');
    setStatus(`Manually reconnecting to ${savedDevice.name}...`);
    
    try {
      await manualReconnect();
      // Status will update automatically through the effect
    } catch (error) {
      console.error('Manual reconnection error:', error);
      setStatus('Manual reconnection failed');
    }
  };

  const handleForceStopReconnection = () => {
    Alert.alert(
      'Stop Auto-Reconnection',
      'This will stop all ongoing reconnection attempts. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            forceStopReconnection();
            setStatus('Auto-reconnection stopped');
            setAutoReconnectToggle(false);
          }
        }
      ]
    );
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
    if (savedDevice) return '#2196F3';
    return '#F44336';
  };

  const getStatusIcon = () => {
    if (isConnected) return '●';
    if (isAttemptingReconnect) return '◐';
    if (savedDevice) return 'ⓘ';
    return '○';
  };

  // ========== Render ==========
  return (
    <ScrollView style={styles.container}>
      {/* Connection Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Connection Status</Text>
        <Text style={styles.statusText}>{status}</Text>
        
        {isInitializing && (
          <View style={styles.initializingIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.initializingText}>Initializing BLE...</Text>
          </View>
        )}

        {isAttemptingReconnect && (
          <View style={styles.reconnectingIndicator}>
            <ActivityIndicator size="small" color="#FF9500" />
            <Text style={styles.reconnectingText}>
              Continuous scanning active (Attempt #{reconnectAttemptCount})
              {isCurrentlyScanning && ' - Scanning now...'}
            </Text>
          </View>
        )}

        <View style={[
          styles.indicator,
          { backgroundColor: getStatusColor() }
        ]}>
          <Text style={styles.indicatorText}>
            {getStatusIcon()} {isConnected ? 'Connected' : isAttemptingReconnect ? 'Reconnecting' : savedDevice ? 'Device Saved' : 'Disconnected'}
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
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoReconnectToggle ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          
          {autoReconnectToggle && (
            <View style={styles.autoReconnectInfo}>
              <Text style={styles.autoReconnectInfoText}>
                📡 Scanning every 5 seconds for "{savedDevice.name}"
              </Text>
              <Text style={styles.autoReconnectInfoText}>
                💡 Device will connect automatically when in range
              </Text>
              
              {isAttemptingReconnect && (
                <TouchableOpacity
                  style={styles.stopScanButton}
                  onPress={handleForceStopReconnection}
                >
                  <Text style={styles.stopScanButtonText}>Stop Scanning</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {!autoReconnectToggle && !isConnected && (
            <TouchableOpacity
              style={styles.manualReconnectButton}
              onPress={handleManualReconnect}
            >
              <Text style={styles.manualReconnectButtonText}>Reconnect Now</Text>
            </TouchableOpacity>
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
                'Are you sure? This will:\n• Remove device from saved devices\n• Disable auto-reconnection\n• Require manual connection next time',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Forget Device',
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
            disabled={isScanning || isAttemptingReconnect}
          >
            {isScanning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isAttemptingReconnect ? 'Auto-Reconnecting...' : 'Scan for Devices'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {isConnected && (
          <TouchableOpacity
            style={[styles.button, styles.disconnectButton]}
            onPress={handleDisconnect}
          >
            <Text style={styles.buttonText}>Disconnect Device</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Found Devices List */}
      {foundDevices.length > 0 && !isConnected && (
        <View style={styles.devicesCard}>
          <Text style={styles.cardTitle}>Available Devices</Text>
          {foundDevices.map((device, index) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceItem}
              onPress={() => handleConnect(device)}
            >
              <View style={styles.deviceInfo}>
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
          3. If device disconnects → Continuous scanning starts
        </Text>
        <Text style={styles.infoText}>
          4. When back in range → Reconnects automatically!
        </Text>
        <Text style={styles.infoText}>
          5. Works across app restarts and Bluetooth toggles
        </Text>
        <Text style={styles.infoText}>
          6. No user action needed after first connection 🎉
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
            <Text style={styles.emptyHistory}>No connection history yet</Text>
          ) : (
            connectionHistory.slice(0, 10).map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyIcon}>
                  {getEventIcon(entry.event)}
                </Text>
                <View style={styles.historyContent}>
                  <Text style={styles.historyEvent}>
                    {entry.event.charAt(0).toUpperCase() + entry.event.slice(1)}
                  </Text>
                  <Text style={styles.historyDevice}>
                    {entry.device?.name || 'Unknown Device'}
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
    lineHeight: 20,
  },
  initializingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  initializingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
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
    flex: 1,
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
  stopScanButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  stopScanButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  manualReconnectButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  manualReconnectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    fontFamily: 'monospace',
  },
  deviceDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  forgetButton: {
    backgroundColor: '#FF6B6B',
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
    backgroundColor: '#FF6B6B',
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
  deviceInfo: {
    flex: 1,
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
    fontFamily: 'monospace',
  },
  connectArrow: {
    fontSize: 24,
    color: '#007AFF',
    marginLeft: 12,
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
    width: 24,
  },
  historyContent: {
    flex: 1,
  },
  historyEvent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textTransform: 'capitalize',
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