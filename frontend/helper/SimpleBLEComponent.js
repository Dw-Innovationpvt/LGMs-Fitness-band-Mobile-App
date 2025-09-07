import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useBLEStore } from '../store/augBleStore';

const { width, height } = Dimensions.get('window');

const SimpleBLEComponent = ({ navigation }) => {
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
      <View style={styles.deviceIconContainer}>
        <Text style={styles.deviceIcon}>📱</Text>
      </View>
      <View style={styles.deviceInfoContainer}>
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
      <View style={styles.headerGradient}>
        <View style={styles.headerSection}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            {/* <Text style={styles.backButtonText}>←</Text> */}
                      <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Pair Device</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <View style={styles.scrollContent}>
        {/* Connection Status */}
        <View style={[
          styles.card,
          styles.cardElevated,
          isConnected ? styles.connectedCard : styles.disconnectedCard
        ]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Connection Status</Text>
            </View>
          </View>
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
          <View style={[styles.card, styles.cardElevated]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Received Data</Text>
              </View>
            </View>
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
                styles.addButton,
                isScanning && styles.disabledButton
              ]}
              onPress={scanForDevices}
              disabled={isScanning}
            >
              {isScanning ? (
                <View style={styles.scanningContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.addButtonText}>Scanning...</Text>
                </View>
              ) : (
                <Text style={styles.addButtonText}>🔍 Scan for Devices</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.addButton, styles.disconnectButton]}
              onPress={disconnect}
            >
              <Text style={styles.addButtonText}>🔌 Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Device List */}
        {!isConnected && (
          <View style={[styles.card, styles.cardElevated]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>
                  Found Devices ({foundDevices.length})
                </Text>
              </View>
            </View>
            
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
              contentContainerStyle={styles.deviceListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Connection Info
        {isConnected && (
          <View style={[styles.card, styles.cardElevated]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Connection Details</Text>
              </View>
            </View>
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
        )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  headerGradient: {
    paddingHorizontal: '6%',
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
    paddingBottom: height * 0.02,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: '#4B6CB7',
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
    shadowRadius: Platform.OS === 'ios' ? 20 : 0,
    elevation: Platform.OS === 'android' ? 10 : 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8%',
  },
  backButton: {
    width: 40,
    height: 40,
    // borderRadius: 20,
    // backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: width * 0.055,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingTop: 30,
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
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2E3A59',
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
  dataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: '#F5F7FB',
    padding: 10,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4B6CB7',
    borderRadius: 24,
    paddingVertical: '2.5%',
    paddingHorizontal: '5%',
    alignSelf: 'center',
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    minWidth: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
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
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
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
    // maxHeight: 300,
  },
  deviceListContent: {
    paddingBottom: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#4B6CB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceIcon: {
    fontSize: 20,
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
  deviceRssi: {
    fontSize: 12,
    color: '#5A6A8C',
  },
  tapText: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default SimpleBLEComponent;