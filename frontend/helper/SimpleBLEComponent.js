// components/SimpleBLEComponent.js
import React, { useEffect } from 'react';
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
    initializeAutoReconnection,
    continuousReconnectEnabled,
    savedDevice,
  } = useBLEStore();

  // ✅ Auto Reconnection Initialization
  useEffect(() => {
    console.log('🔄 Checking auto reconnection on mount...');
    initializeAutoReconnection();

    return () => {
      console.log('🧹 Cleanup BLE listeners');
    };
  }, []);

  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
      disabled={isConnected || isScanning}
    >
      <View style={styles.deviceInfoContainer}>
        <Text style={styles.deviceName}>
          {item.name || item.localName || 'Unknown Device'}
        </Text>
        <Text style={styles.deviceId}>{item.id}</Text>
        <Text>{item.rssi ? `${item.rssi} dBm` : 'Unknown RSSI'}</Text>
      </View>
      <Feather name="bluetooth" size={20} color="#4B6CB7" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pair Device</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Status Card */}
      <View style={[styles.card, styles.cardElevated]}>
        <Text style={styles.cardTitle}>Connection Status</Text>
        <Text>
          {isConnected ? '' : 'Please turn on Bluetooth and Location'}
        </Text>

        <Text>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
        {isConnected && connectedDevice && (
          <Text>📱 {connectedDevice.name || connectedDevice.id}</Text>
        )}

        {continuousReconnectEnabled && savedDevice && (
          <Text style={{ color: '#4B6CB7' }}>
            🔁 Auto Reconnect Enabled ({savedDevice.name})
          </Text>
        )}

        {error && <Text style={{ color: 'red' }}>❌ {error}</Text>}
      </View>

      {/* BLE Data */}
      {data && (
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.cardTitle}>Received Data</Text>
          <Text selectable style={{ color: '#333' }}>
            {JSON.stringify(data, null, 2)}
          </Text>
        </View>
      )}

      {/* Main Controls */}
      <View style={styles.modalFooter}>
        {!isConnected ? (
          <TouchableOpacity
            style={[styles.modalButton, styles.primaryButton]}
            onPress={scanForDevices}
            disabled={isScanning}
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
            onPress={() => {
              Alert.alert(
                'Disconnect',
                'Do you want to disable auto reconnection too?',
                [
                  {
                    text: 'Keep Auto-Reconnect',
                    onPress: () => disconnect(false),
                  },
                  {
                    text: 'Forget Device',
                    style: 'destructive',
                    onPress: () => disconnect(true),
                  },
                ]
              );
            }}
          >
            <Text style={{ color: 'white' }}>🔌 Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Device List */}
      {!isConnected && (
        <View style={styles.devicesContainer}>
          <Text style={styles.devicesFoundText}>
            Found Devices ({foundDevices.length})
          </Text>

          {foundDevices.length === 0 && !isScanning && !error && (
            <View style={styles.noDevicesContainer}>
              <Text style={styles.noDevicesTitle}>🔍 No devices found yet</Text>
              <Text style={styles.noDevicesSubtitle}>
                Tap "Scan for Devices" to start searching
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
    backgroundColor: '#F5F7FB',
  },
  headerGradient: {
    backgroundColor: '#4B6CB7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: 8,
    fontWeight: '500',
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
  devicesContainer: {
    paddingVertical: 16,
    backgroundColor: '#F8FAFF',
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
});

export default SimpleBLEComponent;
