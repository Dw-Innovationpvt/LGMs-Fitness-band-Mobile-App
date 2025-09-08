import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
// import { useBLEStore } from './useBLEStore'; // Import your store
import { useBLEStore } from '../store/augBleStore';
// import 

const SimpleBLEComponent = () => {
  // Get state and actions from the store
  const {
    foundDevices,
    isScanning,
    isConnected,
    connectedDevice,
    error,
    data,
    scanForDevices,
    connectToDevice,
    disconnect
  } = useBLEStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, []);

  // Render device item
  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
      disabled={isConnected || isScanning}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>
          {item.name || item.localName || 'Unknown Device'}
        </Text>
        <Text style={styles.deviceId}>{item.id}</Text>
        <Text style={styles.deviceRssi}>
          Signal: {item.rssi ? `${item.rssi} dBm` : 'Unknown'}
        </Text>
      </View>
      <Text style={styles.tapText}>Tap to connect</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>BLE Device Manager</Text>

      {/* Connection Status */}
      <View style={[
        styles.statusCard,
        isConnected ? styles.connectedCard : styles.disconnectedCard
      ]}>
        <Text style={styles.statusTitle}>Connection Status</Text>
        <Text style={styles.statusText}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
        {isConnected && connectedDevice && (
          <Text style={styles.connectedDeviceText}>
            📱 {connectedDevice.name || connectedDevice.id}
          </Text>
        )}
        {error && (
          <Text style={styles.errorText}>❌ {error}</Text>
        )}
      </View>

      {/* Data Display */}
      {data && (
        <View style={styles.dataCard}>
          <Text style={styles.dataTitle}>Received Data</Text>
          <Text style={styles.dataText}>
            {JSON.stringify(data, null, 2)}
          </Text>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        {!isConnected ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.scanButton,
              isScanning && styles.disabledButton
            ]}
            onPress={scanForDevices}
            disabled={isScanning}
          >
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.buttonText}>Scanning...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>🔍 Scan for Devices</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.disconnectButton]}
            onPress={disconnect}
          >
            <Text style={styles.buttonText}>🔌 Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Device List */}
      {!isConnected && (
        <View style={styles.deviceListContainer}>
          <Text style={styles.deviceListTitle}>
            Found Devices ({foundDevices.length})
          </Text>
          
          {foundDevices.length === 0 && !isScanning && !error && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                🔍 No devices found yet
              </Text>
              <Text style={styles.emptySubText}>
                Tap "Scan for Devices" to start searching
              </Text>
            </View>
          )}

          <FlatList
            data={foundDevices}
            keyExtractor={(item) => item.id}
            renderItem={renderDevice}
            style={styles.deviceList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Connection Info */}
      {isConnected && (
        <View style={styles.connectionInfo}>
          <Text style={styles.infoTitle}>Connection Details</Text>
          <Text style={styles.infoText}>
            • Device connected successfully
          </Text>
          <Text style={styles.infoText}>
            • Listening for data...
          </Text>
          <Text style={styles.infoText}>
            • Ready to send commands
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectedCard: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    borderWidth: 1,
  },
  disconnectedCard: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  connectedDeviceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 5,
    fontStyle: 'italic',
  },
  dataCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#2196f3',
    borderWidth: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1976d2',
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButton: {
    backgroundColor: '#007AFF',
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    opacity: 0.7,
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 5,
  },
  deviceListContainer: {
    flex: 1,
  },
  deviceListTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  deviceRssi: {
    fontSize: 12,
    color: '#999',
  },
  tapText: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  connectionInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default SimpleBLEComponent;