// In your main component
import { useBLEReconnectionStore } from "../store/useBLEReconnectionStore";
import { useBLEStore } from "../store/augBleStore";
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppComponent = () => {
  const { hasSavedDevice, manualReconnect, getReconnectionStatus, savedDevice } = useBLEReconnectionStore();
  const { isConnected, connectToDevice, disconnect, data, currentMode } = useBLEStore();
  
  // Auto-reconnect on app start if we have a saved device
  useEffect(() => {
    const tryAutoReconnect = async () => {
      if (hasSavedDevice() && !isConnected) {
        console.log('Attempting auto-reconnect on app start...');
        const success = await manualReconnect();
        if (success) {
          console.log('Auto-reconnected successfully!');
        }
      }
    };
    
    tryAutoReconnect();
  }, []);
  
  // Display reconnection status
  const reconnectStatus = getReconnectionStatus();

  return (
    <View style={styles.container}>
      
      {/* Connection Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.title}>Connection Status</Text>
        
        {/* Current Connection Status */}
        <View style={[styles.statusRow, isConnected ? styles.connected : styles.disconnected]}>
          <View style={[styles.statusIndicator, isConnected ? styles.indicatorConnected : styles.indicatorDisconnected]} />
          <Text style={styles.statusText}>
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </Text>
        </View>

        {/* Device Information */}
        {savedDevice && (
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{savedDevice.name || savedDevice.localName || 'Unknown Device'}</Text>
            <Text style={styles.deviceId}>ID: {savedDevice.id}</Text>
          </View>
        )}

        {/* Current Mode */}
        {isConnected && data && (
          <View style={styles.modeContainer}>
            <Text style={styles.modeText}>Mode: {currentMode}</Text>
          </View>
        )}
      </View>

      {/* Reconnection Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.title}>Reconnection Status</Text>
        
        {/* Reconnection Attempts */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Attempts:</Text>
          <Text style={styles.value}>
            {reconnectStatus.reconnectAttempts}/{reconnectStatus.maxReconnectAttempts}
          </Text>
        </View>

        {/* Saved Device Status */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Saved Device:</Text>
          <Text style={[styles.value, reconnectStatus.hasSavedDevice ? styles.available : styles.unavailable]}>
            {reconnectStatus.hasSavedDevice ? 'Available' : 'None'}
          </Text>
        </View>

        {/* Last Disconnect Time */}
        {reconnectStatus.lastDisconnectTime && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Disconnect:</Text>
            <Text style={styles.value}>
              {new Date(reconnectStatus.lastDisconnectTime).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {/* Active Reconnection Indicator */}
        {reconnectStatus.isAttemptingReconnect && (
          <View style={styles.reconnectingContainer}>
            <View style={styles.pulsingDot} />
            <Text style={styles.reconnectingText}>
              Attempting to reconnect... ({reconnectStatus.reconnectAttempts + 1}/{reconnectStatus.maxReconnectAttempts})
            </Text>
          </View>
        )}

        {/* Reconnection Available */}
        {!isConnected && reconnectStatus.hasSavedDevice && !reconnectStatus.isAttemptingReconnect && (
          <View style={styles.reconnectAvailable}>
            <Text style={styles.reconnectText}>Device available for reconnection</Text>
          </View>
        )}

        {/* No Saved Device */}
        {!reconnectStatus.hasSavedDevice && !isConnected && (
          <View style={styles.noDevice}>
            <Text style={styles.noDeviceText}>No device saved for auto-reconnect</Text>
          </View>
        )}
      </View>

      {/* Data Display Card */}
      {isConnected && data && (
        <View style={styles.statusCard}>
          <Text style={styles.title}>Live Data</Text>
          <View style={styles.dataGrid}>
            {data.stepCount !== undefined && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Steps</Text>
                <Text style={styles.dataValue}>{data.stepCount}</Text>
              </View>
            )}
            {data.speed !== undefined && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Speed</Text>
                <Text style={styles.dataValue}>{data.speed} km/h</Text>
              </View>
            )}
            {data.skatingDistance !== undefined && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Distance</Text>
                <Text style={styles.dataValue}>{data.skatingDistance}m</Text>
              </View>
            )}
            {data.maxSpeed !== undefined && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Max Speed</Text>
                <Text style={styles.dataValue}>{data.maxSpeed} km/h</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  connected: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  indicatorConnected: {
    backgroundColor: '#4CAF50',
  },
  indicatorDisconnected: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deviceInfo: {
    alignItems: 'center',
    marginVertical: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modeContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  modeText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  available: {
    color: '#4CAF50',
  },
  unavailable: {
    color: '#f44336',
  },
  reconnectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffc107',
    marginRight: 8,
  },
  reconnectingText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  reconnectAvailable: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  reconnectText: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
  },
  noDevice: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9e9e9e',
  },
  noDeviceText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});



export default AppComponent;

// i thinnk we need to do some changes in the main app component to integrate this properly

// // In your main component
// // import { useBLEReconnectionStore } from './stores/bleReconnectionStore';
// // import { useBLEStore } from './stores/bleStore';

// import { useBLEReconnectionStore } from "../store/useBLEReconnectionStore";
// import { useBLEStore } from "../store/augBleStore";

// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';


// const AppComponent = () => {
//   const { hasSavedDevice, manualReconnect, getReconnectionStatus } = useBLEReconnectionStore();
//   const { isConnected, connectToDevice, disconnect } = useBLEStore();
  
//   // Auto-reconnect on app start if we have a saved device
//   useEffect(() => {
//     const tryAutoReconnect = async () => {
//       if (hasSavedDevice() && !isConnected) {
//         console.log('Attempting auto-reconnect on app start...');
//         const success = await manualReconnect();
//         if (success) {
//           console.log('Auto-reconnected successfully!');
//         }
//       }
//     };
    
//     tryAutoReconnect();
//   }, []);
  
//   // Display reconnection status
//   const reconnectStatus = getReconnectionStatus();
  
//   return (
//     <View>
//       {reconnectStatus.isAttemptingReconnect && (
//         <Text>Attempting to reconnect... ({reconnectStatus.reconnectAttempts + 1}/{reconnectStatus.maxReconnectAttempts})</Text>
//       )}
//       {/* Your existing UI */}
//     </View>
//   );
// };

// export default AppComponent;