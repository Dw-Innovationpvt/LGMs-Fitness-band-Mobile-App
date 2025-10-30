import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useBLEStore } from '../store/augBleStore';

const { width, height } = Dimensions.get('window');

const SimpleBLEComponent = ({ navigation }) => {
  const {
    foundDevices,
    isScanning,
    isConnected,
    connectedDevice,
    error,
    data,
    scanForDevices,
    connectToDevice,
    disconnect,
    // Auto-reconnection states
    savedDevice,
    isAttemptingReconnect,
    continuousReconnectEnabled,
    reconnectAttemptCount,
    isCurrentlyScanning,
    // Auto-reconnection functions
    manualReconnect,
    setAutoReconnect,
    clearSavedDevice,
    getReconnectionStatus,
  } = useBLEStore();

  const [showReconnectOptions, setShowReconnectOptions] = useState(false);

  useEffect(() => {
    // Load saved device and connection history on component mount
    const initializeBLE = async () => {
      await useBLEStore.getState().loadSavedDevice();
      await useBLEStore.getState().loadConnectionHistory();
    };
    
    initializeBLE();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleConnectToDevice = async (device) => {
    try {
      await connectToDevice(device);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Device',
      'Do you want to forget this device?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disconnect Only',
          onPress: () => disconnect(false),
          style: 'default',
        },
        {
          text: 'Forget Device',
          onPress: () => disconnect(true),
          style: 'destructive',
        },
      ]
    );
  };

  const handleManualReconnect = async () => {
    const success = await manualReconnect();
    if (!success) {
      Alert.alert('Reconnection Failed', 'No saved device found or device not available.');
    }
  };

  const toggleAutoReconnect = () => {
    const newState = !continuousReconnectEnabled;
    setAutoReconnect(newState);
    Alert.alert(
      newState ? 'Auto-Reconnect Enabled' : 'Auto-Reconnect Disabled',
      newState 
        ? 'Your device will automatically reconnect when available.'
        : 'Auto-reconnection has been turned off.'
    );
  };

  const forgetDevice = () => {
    Alert.alert(
      'Forget Device',
      'Are you sure you want to forget this device? This will disable auto-reconnection.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Forget',
          onPress: () => {
            clearSavedDevice();
            setShowReconnectOptions(false);
            Alert.alert('Device Forgotten', 'The device has been removed from saved devices.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.deviceItem,
        isAttemptingReconnect && styles.deviceItemDisabled
      ]}
      onPress={() => handleConnectToDevice(item)}
      disabled={isConnected || isScanning || isAttemptingReconnect}
    >
      <View style={styles.deviceInfoContainer}>
        <Text style={styles.deviceName}>
          {item.name || item.localName || 'Unknown Device'}
        </Text>
        <Text style={styles.deviceId}>{item.id}</Text>
        <Text>{item.rssi ? `${item.rssi} dBm` : 'Unknown RSSI'}</Text>
      </View>
      <Feather 
        name="bluetooth" 
        size={20} 
        color={isAttemptingReconnect ? "#CCC" : "#4B6CB7"} 
      />
    </TouchableOpacity>
  );

  const renderReconnectionStatus = () => {
    if (!savedDevice) return null;

    const status = getReconnectionStatus();
    
    return (
      <View style={[styles.card, styles.cardElevated]}>
        <Text style={styles.cardTitle}>Auto-Reconnection Status</Text>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Saved Device:</Text>
          <Text style={styles.statusValue}>{savedDevice.name}</Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Auto-Reconnect:</Text>
          <Text style={[
            styles.statusValue, 
            continuousReconnectEnabled ? styles.statusEnabled : styles.statusDisabled
          ]}>
            {continuousReconnectEnabled ? 'ENABLED' : 'DISABLED'}
          </Text>
        </View>
        
        {isAttemptingReconnect && (
          <View style={styles.reconnectingContainer}>
            <ActivityIndicator size="small" color="#4B6CB7" />
            <Text style={styles.reconnectingText}>
              Attempting to reconnect... ({reconnectAttemptCount})
            </Text>
          </View>
        )}
        
        <View style={styles.reconnectButtons}>
          <TouchableOpacity
            style={[styles.smallButton, styles.primaryButton]}
            onPress={toggleAutoReconnect}
          >
            <Text style={styles.smallButtonText}>
              {continuousReconnectEnabled ? 'Disable Auto' : 'Enable Auto'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.smallButton, styles.secondaryButton]}
            onPress={handleManualReconnect}
            disabled={isAttemptingReconnect}
          >
            <Text style={styles.smallButtonText}>
              {isAttemptingReconnect ? 'Scanning...' : 'Reconnect Now'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.smallButton, styles.dangerButton]}
            onPress={forgetDevice}
          >
            <Text style={styles.smallButtonText}>Forget</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pair Devices</Text>
        <Text></Text>
      </View>

      {/* Connection Status */}
      <View style={[styles.card, styles.cardElevated]}>
        <Text style={styles.cardTitle}>Connection Status</Text>
        <Text>
          {isConnected ? '' : '  Please turn on Bluetooth and Location'}
        </Text>

        <Text>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
        {isConnected && connectedDevice && (
          <Text>📱 {connectedDevice.name || connectedDevice.id}</Text>
        )}
        {error && <Text style={{ color: 'red' }}>❌ {error}</Text>}
        {error === 'Location services are disabled' && <Text>Please enable Location</Text>}
      </View>

      {/* Auto-Reconnection Status */}
      {savedDevice && renderReconnectionStatus()}

      {/* Data Display */}
      {data && (
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.cardTitle}>Received Data</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.modalFooter}>
        {!isConnected ? (
          <TouchableOpacity
            style={[
              styles.modalButton, 
              styles.primaryButton,
              (isScanning || isAttemptingReconnect) && styles.buttonDisabled
            ]}
            onPress={scanForDevices}
            disabled={isScanning || isAttemptingReconnect}
          >
            {isScanning ? (
              <>
                <ActivityIndicator color="white" />
                <Text style={{ color: 'white', marginLeft: 8 }}>Scanning...</Text>
              </>
            ) : (
              <Text style={{ color: 'white' }}>🔍 Scan for Devices</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#FF3B30' }]}
            onPress={handleDisconnect}
          >
            <Text style={{ color: 'white' }}>🔌 Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Devices List */}
      {!isConnected && (
        <View style={styles.devicesContainer}>
          <Text style={styles.devicesFoundText}>
            Found Devices ({foundDevices.length})
            {isAttemptingReconnect && ` • Reconnecting... (${reconnectAttemptCount})`}
          </Text>

          {foundDevices.length === 0 && !isScanning && !isAttemptingReconnect && !error && (
            <View style={styles.noDevicesContainer}>
              <Text style={styles.noDevicesTitle}>🔍 No devices found yet</Text>
              <Text style={styles.noDevicesSubtitle}>
                Tap "Scan for Devices" to start searching
              </Text>
            </View>
          )}

          {isAttemptingReconnect && foundDevices.length === 0 && (
            <View style={styles.reconnectMessage}>
              <ActivityIndicator size="large" color="#4B6CB7" />
              <Text style={styles.reconnectMessageText}>
                Scanning for your device...{'\n'}
                <Text style={styles.reconnectMessageSubtext}>
                  Attempt {reconnectAttemptCount}
                </Text>
              </Text>
            </View>
          )}

          <FlatList
            data={foundDevices}
            keyExtractor={(item) => item.id}
            renderItem={renderDevice}
            contentContainerStyle={styles.deviceListContent}
          />
        </View>
      )}
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
    backgroundColor: '#4B6CB7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? -60 : -10,
    paddingHorizontal: '6%',
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
    paddingBottom: height * 0.02,
  },
  headerText: {
    fontSize: width * 0.055,
    color: '#fff',
    marginTop: '1%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
    marginTop: '4%',
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: width * 0.045,
    color: '#2E3A59',
    marginLeft: '2%',
    fontWeight: '500',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#5A6A8C',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusEnabled: {
    color: '#4CAF50',
  },
  statusDisabled: {
    color: '#FF6B6B',
  },
  reconnectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  reconnectingText: {
    marginLeft: 8,
    color: '#4B6CB7',
    fontSize: 14,
    fontWeight: '500',
  },
  reconnectButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4B6CB7',
  },
  secondaryButton: {
    backgroundColor: '#6C757D',
  },
  dangerButton: {
    backgroundColor: '#DC3545',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#4B6CB7',
    marginLeft: 8,
    shadowColor: '#4B6CB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
  },
  devicesContainer: {
    paddingVertical: 16,
    backgroundColor: '#F8FAFF',
    flex: 1,
  },
  devicesFoundText: {
    fontSize: 12,
    color: '#5A6A8C',
    marginBottom: 12,
    paddingHorizontal: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  deviceListContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#4B6CB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  deviceItemDisabled: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  deviceInfoContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#9AA5B9',
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
  },
  noDevicesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  noDevicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
  },
  noDevicesSubtitle: {
    fontSize: 14,
    color: '#5A6A8C',
    textAlign: 'center',
    lineHeight: 20,
  },
  reconnectMessage: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  reconnectMessageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginTop: 16,
    textAlign: 'center',
  },
  reconnectMessageSubtext: {
    fontSize: 14,
    color: '#5A6A8C',
    fontWeight: 'normal',
  },
});

export default SimpleBLEComponent;