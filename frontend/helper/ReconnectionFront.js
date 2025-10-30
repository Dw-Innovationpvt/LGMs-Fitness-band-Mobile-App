// Example: How to use the Combined BLE Store
// components/BLEScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
// import { useBLEStore } from '../store/useBLEStore';
import { useBLEStore } from '../store/augBleStore';

const BLEScreen = () => {
  const {
    // Main BLE state
    isConnected,
    connectedDevice,
    isScanning,
    foundDevices,
    data,
    bandActive,
    currentMode,
    
    // Auto-reconnection state
    savedDevice,
    isAttemptingReconnect,
    continuousReconnectEnabled,
    reconnectAttemptCount,
    
    // Main BLE functions
    scanForDevices,
    connectToDevice,
    disconnect,
    toggleBand,
    setStepCountingMode,
    setSpeedSkatingMode,
    setDistanceSkatingMode,
    
    // Auto-reconnection functions
    loadSavedDevice,
    setAutoReconnect,
    manualReconnect,
    clearSavedDevice,
    getReconnectionStatus,
    loadConnectionHistory,
  } = useBLEStore();

  const [status, setStatus] = useState('Initializing...');

  // ========== Initialize on App Start ==========
  useEffect(() => {
    const initialize = async () => {
      console.log('🚀 Initializing BLE...');
      
      // Load saved device from AsyncStorage
      const device = await loadSavedDevice();
      
      // Load connection history
      await loadConnectionHistory();
      
      if (device) {
        console.log('📱 Found saved device:', device.name);
        setStatus(`Saved device: ${device.name}`);
        
        // Auto-reconnection is already enabled when device is loaded
        // The store will automatically try to reconnect when device comes in range
      } else {
        setStatus('No saved device');
      }
    };
    
    initialize();
  }, []);

  // ========== Update Status Based on Connection State ==========
  useEffect(() => {
    if (isConnected && connectedDevice) {
      setStatus(`✅ Connected: ${connectedDevice.name || 'Device'}`);
    } else if (isAttemptingReconnect) {
      setStatus(`🔄 Auto-reconnecting... (Attempt #${reconnectAttemptCount})`);
    } else if (savedDevice && continuousReconnectEnabled) {
      setStatus(`📡 Waiting for ${savedDevice.name}...`);
    } else {
      setStatus('Disconnected');
    }
  }, [isConnected, connectedDevice, isAttemptingReconnect, reconnectAttemptCount, savedDevice, continuousReconnectEnabled]);

  // ========== Event Handlers ==========
  
  const handleScan = async () => {
    setStatus('Scanning...');
    const devices = await scanForDevices();
    if (devices.length === 0) {
      setStatus('No devices found');
    } else {
      setStatus(`Found ${devices.length} device(s)`);
    }
  };

  const handleConnect = async (device) => {
    setStatus(`Connecting to ${device.name}...`);
    try {
      await connectToDevice(device);
      // Device is automatically saved and auto-reconnection is enabled
    } catch (error) {
      setStatus('Connection failed');
    }
  };

  const handleDisconnect = async () => {
    // Disconnect but keep device saved
    await disconnect(false);
  };

  const handleForgetDevice = async () => {
    // Disconnect and forget device completely
    await disconnect(true);
    setStatus('Device forgotten');
  };

  const handleToggleAutoReconnect = (value) => {
    setAutoReconnect(value);
  };

  const handleManualReconnect = async () => {
    await manualReconnect();
  };

  const handleToggleBand = async () => {
    await toggleBand();
  };

  const handleModeChange = async (mode) => {
    switch (mode) {
      case 'STEP':
        await setStepCountingMode();
        break;
      case 'SPEED':
        await setSpeedSkatingMode();
        break;
      case 'DISTANCE':
        await setDistanceSkatingMode();
        break;
    }
  };

  // ========== Render ==========
  return (
    <ScrollView style={styles.container}>
      {/* Status Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Connection Status</Text>
        <Text style={styles.status}>{status}</Text>
        
        {isAttemptingReconnect && (
          <View style={styles.reconnectIndicator}>
            <ActivityIndicator size="small" color="#FF9500" />
            <Text style={styles.reconnectText}>
              Scanning... (Attempt #{reconnectAttemptCount})
            </Text>
          </View>
        )}
        
        <View style={[
          styles.indicator,
          { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
        ]}>
          <Text style={styles.indicatorText}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </Text>
        </View>
      </View>

      {/* Auto-Reconnection Control */}
      {savedDevice && (
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.title}>🔄 Auto-Reconnection</Text>
              <Text style={styles.subtitle}>
                {continuousReconnectEnabled 
                  ? 'Device will reconnect automatically' 
                  : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={continuousReconnectEnabled}
              onValueChange={handleToggleAutoReconnect}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
            />
          </View>
          
          {continuousReconnectEnabled && !isConnected && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                📡 Scanning every 5 seconds for "{savedDevice.name}"
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleForgetDevice}
          >
            <Text style={styles.secondaryButtonText}>Forget Device</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Saved Device Info */}
      {savedDevice && (
        <View style={styles.card}>
          <Text style={styles.title}>Saved Device</Text>
          <Text style={styles.deviceName}>{savedDevice.name}</Text>
          <Text style={styles.deviceId}>ID: {savedDevice.id}</Text>
        </View>
      )}

      {/* Current Data Display */}
      {isConnected && data && (
        <View style={styles.card}>
          <Text style={styles.title}>Current Data</Text>
          <Text style={styles.dataText}>Mode: {data.modeDisplay}</Text>
          <Text style={styles.dataText}>Steps: {data.stepCount}</Text>
          <Text style={styles.dataText}>Distance: {data.skatingDistance.toFixed(2)} m</Text>
          <Text style={styles.dataText}>Speed: {data.speed.toFixed(1)} km/h</Text>
          <Text style={styles.dataText}>Max Speed: {data.maxSpeed.toFixed(1)} km/h</Text>
          <Text style={styles.dataText}>Laps: {data.laps}</Text>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.card}>
        {!isConnected ? (
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
            
            {savedDevice && (
              <TouchableOpacity
                style={[styles.button, styles.orangeButton]}
                onPress={handleManualReconnect}
                disabled={isAttemptingReconnect}
              >
                {isAttemptingReconnect ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reconnect Now</Text>
                )}
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={handleToggleBand}
            >
              <Text style={styles.buttonText}>
                {bandActive ? 'Turn Off Band' : 'Turn On Band'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.redButton]}
              onPress={handleDisconnect}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Mode Selection */}
      {isConnected && (
        <View style={styles.card}>
          <Text style={styles.title}>Select Mode</Text>
          <TouchableOpacity
            style={[styles.modeButton, currentMode === 'S' && styles.activeModeButton]}
            onPress={() => handleModeChange('STEP')}
          >
            <Text style={styles.modeButtonText}>Step Counting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, currentMode === 'SS' && styles.activeModeButton]}
            onPress={() => handleModeChange('SPEED')}
          >
            <Text style={styles.modeButtonText}>Speed Skating</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, currentMode === 'SD' && styles.activeModeButton]}
            onPress={() => handleModeChange('DISTANCE')}
          >
            <Text style={styles.modeButtonText}>Distance Skating</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Found Devices List */}
      {foundDevices.length > 0 && !isConnected && (
        <View style={styles.card}>
          <Text style={styles.title}>Available Devices</Text>
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
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Info Box */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ How It Works</Text>
        <Text style={styles.infoText}>
          1. Connect to your device manually (first time)
        </Text>
        <Text style={styles.infoText}>
          2. Device info is automatically saved
        </Text>
        <Text style={styles.infoText}>
          3. If device disconnects → Auto-scans every 5 seconds
        </Text>
        <Text style={styles.infoText}>
          4. When device comes back → Reconnects automatically!
        </Text>
        <Text style={styles.infoText}>
          5. No manual reconnection needed 🎉
        </Text>
      </View>
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
  card: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  reconnectIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginTop: 8,
  },
  reconnectText: {
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 4,
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
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  orangeButton: {
    backgroundColor: '#FF9500',
  },
  redButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modeButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  activeModeButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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
  },
  deviceItemId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  arrow: {
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
});

export default BLEScreen;