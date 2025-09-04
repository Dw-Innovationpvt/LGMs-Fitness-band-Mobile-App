import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useBLEStore } from '../store/augBleStore';

const DevicePairingScreen = ({ navigation }) => {
  const {
    scanForDevices,
    connectToDevice,
    disconnect,
    isConnected,
    isScanning,
    foundDevices,
    connectedDevice,
    error
  } = useBLEStore();

  const [scanning, setScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    // If connected successfully, navigate back after a short delay
    if (isConnected && connectedDevice) {
      const timer = setTimeout(() => {
        navigation.goBack();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, connectedDevice]);

  useEffect(() => {
    // Show error alerts if any
    if (error) {
      Alert.alert('Bluetooth Error', error);
    }
  }, [error]);

  const checkPermissions = async () => {
    setCheckingPermission(true);
    try {
      if (Platform.OS === 'android') {
        // For Android, we need both Bluetooth and Location permissions
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ];

        // For Android 12+ (API 31+), add Bluetooth permissions
        if (Platform.Version >= 31) {
          permissions.push(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
          );
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        // Check if all required permissions are granted
        const hasLocationPermission = 
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        
        let hasBluetoothPermission = true;
        if (Platform.Version >= 31) {
          hasBluetoothPermission = 
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED;
        }

        const allGranted = hasLocationPermission && hasBluetoothPermission;
        setPermissionGranted(allGranted);
        
        if (!allGranted) {
          let message = 'This app needs the following permissions:\n\n';
          if (!hasLocationPermission) message += '• Location (for device discovery)\n';
          if (!hasBluetoothPermission) message += '• Bluetooth\n';
          
          Alert.alert(
            'Permissions Required',
            message,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openAppSettings }
            ]
          );
        }
      } else {
        // For iOS, permissions are handled differently - we'll assume granted for now
        // In a real app, you'd use expo-permissions or similar
        setPermissionGranted(true);
      }
    } catch (error) {
      console.error('Permission check error:', error);
      Alert.alert('Error', 'Could not check permissions');
    } finally {
      setCheckingPermission(false);
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const startScanning = async () => {
    if (!permissionGranted) {
      Alert.alert(
        'Permissions Required',
        'Please grant the required permissions to scan for devices.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Request Permissions', onPress: checkPermissions }
        ]
      );
      return;
    }

    setScanning(true);
    try {
      await scanForDevices();
    } catch (error) {
      console.error('Scanning error:', error);
      Alert.alert('Error', 'Failed to scan for devices');
    } finally {
      setScanning(false);
    }
  };

  const handleConnect = async (device) => {
    if (!permissionGranted) {
      Alert.alert(
        'Permissions Required',
        'Please grant the required permissions to connect to devices.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Request Permissions', onPress: checkPermissions }
        ]
      );
      return;
    }

    try {
      await connectToDevice(device);
      // Show success message
      Alert.alert(
        'Connected', 
        `Successfully connected to ${device.name || 'device'}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Failed', 'Could not connect to the device');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      Alert.alert('Disconnected', 'Device disconnected successfully');
    } catch (error) {
      console.error('Disconnection error:', error);
      Alert.alert('Error', 'Failed to disconnect from device');
    }
  };

  // Render permission request UI if permissions are not granted
  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pair Device</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons name="bluetooth" size={64} color="#9AA5B9" />
          <Text style={styles.permissionTitle}>Permissions Needed</Text>
          <Text style={styles.permissionText}>
            This app needs {Platform.OS === 'android' ? 'Bluetooth and Location ' : 'Bluetooth '} 
            permissions to scan for and connect to devices.
          </Text>
          
          {checkingPermission ? (
            <ActivityIndicator size="large" color="#4B6CB7" style={styles.permissionSpinner} />
          ) : (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={checkPermissions}
            >
              <Text style={styles.permissionButtonText}>Grant Permissions</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openAppSettings}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pair Device</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Connection Status */}
        {isConnected && connectedDevice && (
          <View style={styles.connectedStatus}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.connectedText}>Connected to {connectedDevice.name || 'device'}</Text>
            <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectButton}>
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Scanning Status */}
        {(scanning || isScanning) && (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color="#4B6CB7" />
            <Text style={styles.scanningText}>Scanning for devices...</Text>
          </View>
        )}

        {/* Devices List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Available Devices ({foundDevices.length})
            </Text>
            <TouchableOpacity onPress={startScanning} disabled={scanning}>
              <MaterialCommunityIcons name="refresh" size={20} color="#4B6CB7" />
            </TouchableOpacity>
          </View>
          
          {foundDevices.length > 0 ? (
            <FlatList
              data={foundDevices}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.deviceItem,
                    connectedDevice?.id === item.id && styles.deviceItemConnected
                  ]}
                  onPress={() => handleConnect(item)}
                  disabled={scanning || (isConnected && connectedDevice?.id === item.id)}
                >
                  <View style={styles.deviceIcon}>
                    <MaterialCommunityIcons 
                      name="bluetooth" 
                      size={24} 
                      color={connectedDevice?.id === item.id ? "#4B6CB7" : "#5A6A8C"} 
                    />
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>
                      {item.name || 'Unknown Device'}
                    </Text>
                    <Text style={styles.deviceId}>{item.id}</Text>
                  </View>
                  <View style={styles.deviceStatus}>
                    {connectedDevice?.id === item.id ? (
                      <>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                        <Text style={styles.connectedLabel}>Connected</Text>
                      </>
                    ) : (
                      <Feather name="chevron-right" size={20} color="#9AA5B9" />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : !scanning ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="bluetooth-off" size={48} color="#9AA5B9" />
              <Text style={styles.emptyStateTitle}>No devices found</Text>
              <Text style={styles.emptyStateText}>
                Make sure your device is in pairing mode and Bluetooth is enabled
              </Text>
              <TouchableOpacity
                style={styles.scanButtonSmall}
                onPress={startScanning}
                disabled={scanning}
              >
                <Text style={styles.scanButtonTextSmall}>
                  {scanning ? 'Scanning...' : 'Scan for Devices'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Instructions</Text>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Make sure your fitness band is turned on and in pairing mode
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Ensure Bluetooth is enabled on your phone
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Tap on your device from the list above to connect
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
          onPress={startScanning}
          disabled={scanning}
        >
          <MaterialCommunityIcons 
            name="bluetooth-connect" 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.scanButtonText}>
            {scanning ? 'Scanning...' : 'Scan Again'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
  },
  headerRight: {
    width: 40,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionText: {
    textAlign: 'center',
    color: '#5A6A8C',
    lineHeight: 22,
    marginBottom: 30,
  },
  permissionSpinner: {
    marginTop: 20,
  },
  permissionButton: {
    backgroundColor: '#4B6CB7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  settingsButton: {
    padding: 16,
  },
  settingsButtonText: {
    color: '#4B6CB7',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  connectedText: {
    marginLeft: 12,
    flex: 1,
    color: '#2E3A59',
    fontWeight: '500',
  },
  disconnectButton: {
    padding: 8,
  },
  disconnectText: {
    color: '#F44336',
    fontWeight: '500',
  },
  scanningContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    marginBottom: 20,
  },
  scanningText: {
    marginTop: 12,
    color: '#5A6A8C',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceItemConnected: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#4B6CB7',
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: {
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
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedLabel: {
    marginLeft: 4,
    color: '#4CAF50',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#5A6A8C',
    lineHeight: 20,
    marginBottom: 20,
  },
  scanButtonSmall: {
    backgroundColor: '#4B6CB7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scanButtonTextSmall: {
    color: 'white',
    fontWeight: '600',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4B6CB7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    color: '#5A6A8C',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E7FF',
  },
  scanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B6CB7',
    padding: 16,
    borderRadius: 12,
  },
  scanButtonDisabled: {
    backgroundColor: '#9AA5B9',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DevicePairingScreen;
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// // import { useBLEStore } from './BLEStore'; // Adjust the import path as needed
// import { useBLEStore } from '../store/augBleStore';

// const DevicePairingScreen = ({ navigation }) => {
//   const {
//     foundDevices,
//     isScanning,
//     isConnected,
//     connectedDevice,
//     error,
//     scanForDevices,
//     connectToDevice,
//     disconnect,
//   } = useBLEStore();

//   const [connecting, setConnecting] = useState(false);
//   const [connectingDeviceId, setConnectingDeviceId] = useState(null);

//   useEffect(() => {
//     // Start scanning when component mounts
//     handleScan();
    
//     // Cleanup function
//     return () => {
//       // Clean up any ongoing operations if needed
//     };
//   }, []);

//   const handleScan = async () => {
//     try {
//       await scanForDevices();
//     } catch (err) {
//       console.error('Scan error:', err);
//     }
//   };

//   const handleConnect = async (device) => {
//     if (connecting) return;
    
//     setConnecting(true);
//     setConnectingDeviceId(device.id);
    
//     try {
//       await connectToDevice(device);
//       // Navigate to main app or dashboard after successful connection
//       // navigation.navigate('Dashboard'); // Uncomment and adjust as needed
//     } catch (err) {
//       console.error('Connection failed:', err);
//       Alert.alert(
//         'Connection Failed',
//         `Failed to connect to ${device.name || device.id}. Please try again.`,
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setConnecting(false);
//       setConnectingDeviceId(null);
//     }
//   };

//   const handleDisconnect = async () => {
//     Alert.alert(
//       'Disconnect Device',
//       `Are you sure you want to disconnect from ${connectedDevice?.name || 'the device'}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Disconnect',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await disconnect();
//             } catch (err) {
//               console.error('Disconnect error:', err);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const renderDeviceItem = ({ item }) => {
//     const deviceName = item.name || item.localName || 'Unknown Device';
//     const isCurrentlyConnecting = connecting && connectingDeviceId === item.id;
//     const isThisDeviceConnected = isConnected && connectedDevice?.id === item.id;
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.deviceItem,
//           isThisDeviceConnected && styles.connectedDevice,
//           isCurrentlyConnecting && styles.connectingDevice,
//         ]}
//         onPress={() => !isThisDeviceConnected && handleConnect(item)}
//         disabled={connecting || isThisDeviceConnected}
//       >
//         <View style={styles.deviceInfo}>
//           <Text style={[
//             styles.deviceName,
//             isThisDeviceConnected && styles.connectedText
//           ]}>
//             {deviceName}
//           </Text>
//           <Text style={styles.deviceId}>{item.id}</Text>
//           {item.rssi && (
//             <Text style={styles.deviceRssi}>Signal: {item.rssi} dBm</Text>
//           )}
//         </View>
        
//         <View style={styles.deviceStatus}>
//           {isCurrentlyConnecting ? (
//             <ActivityIndicator size="small" color="#007AFF" />
//           ) : isThisDeviceConnected ? (
//             <TouchableOpacity
//               style={styles.disconnectButton}
//               onPress={handleDisconnect}
//             >
//               <Text style={styles.disconnectButtonText}>Disconnect</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity style={styles.connectButton}>
//               <Text style={styles.connectButtonText}>Connect</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <Text style={styles.title}>Pair Fitness Band</Text>
//       <Text style={styles.subtitle}>
//         {isConnected 
//           ? `Connected to ${connectedDevice?.name || 'device'}`
//           : 'Select your fitness band from the list below'
//         }
//       </Text>
      
//       {error && (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       )}
//     </View>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       {isScanning ? (
//         <>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.emptyStateText}>Scanning for devices...</Text>
//           <Text style={styles.emptyStateSubtext}>
//             Make sure your fitness band is nearby and in pairing mode
//           </Text>
//         </>
//       ) : (
//         <>
//           <Text style={styles.emptyStateText}>No devices found</Text>
//           <Text style={styles.emptyStateSubtext}>
//             Pull down to refresh or check if your fitness band is in pairing mode
//           </Text>
//         </>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
//       <FlatList
//         data={foundDevices}
//         renderItem={renderDeviceItem}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={renderHeader}
//         ListEmptyComponent={renderEmptyState}
//         refreshControl={
//           <RefreshControl
//             refreshing={isScanning}
//             onRefresh={handleScan}
//             colors={['#007AFF']}
//             tintColor="#007AFF"
//           />
//         }
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//       />
      
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
//           onPress={handleScan}
//           disabled={isScanning}
//         >
//           {isScanning ? (
//             <ActivityIndicator size="small" color="#FFFFFF" />
//           ) : (
//             <Text style={styles.scanButtonText}>
//               {foundDevices.length > 0 ? 'Scan Again' : 'Start Scanning'}
//             </Text>
//           )}
//         </TouchableOpacity>
        
//         {isConnected && (
//           <Text style={styles.connectedIndicator}>
//             ✅ Connected and ready to use
//           </Text>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   listContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 16,
//   },
//   header: {
//     paddingVertical: 24,
//     paddingHorizontal: 8,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666666',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   errorContainer: {
//     backgroundColor: '#FFE6E6',
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF3B30',
//   },
//   errorText: {
//     color: '#D70015',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   deviceItem: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   connectedDevice: {
//     backgroundColor: '#E6F7E6',
//     borderWidth: 2,
//     borderColor: '#34C759',
//   },
//   connectingDevice: {
//     backgroundColor: '#E6F3FF',
//     borderWidth: 2,
//     borderColor: '#007AFF',
//   },
//   deviceInfo: {
//     flex: 1,
//   },
//   deviceName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1A1A1A',
//     marginBottom: 4,
//   },
//   connectedText: {
//     color: '#1B5E20',
//   },
//   deviceId: {
//     fontSize: 12,
//     color: '#8E8E93',
//     marginBottom: 4,
//     fontFamily: 'Courier',
//   },
//   deviceRssi: {
//     fontSize: 12,
//     color: '#666666',
//   },
//   deviceStatus: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   connectButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   connectButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   disconnectButton: {
//     backgroundColor: '#FF3B30',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   disconnectButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 32,
//   },
//   emptyStateText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1A1A1A',
//     marginTop: 16,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptyStateSubtext: {
//     fontSize: 16,
//     color: '#666666',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5EA',
//   },
//   scanButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 50,
//   },
//   scanButtonDisabled: {
//     backgroundColor: '#B0B0B0',
//   },
//   scanButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   connectedIndicator: {
//     textAlign: 'center',
//     marginTop: 12,
//     fontSize: 16,
//     color: '#34C759',
//     fontWeight: '500',
//   },
// });

// export default DevicePairingScreen;
// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   ActivityIndicator,
// //   StyleSheet,
// //   SafeAreaView,
// //   ScrollView,
// //   Alert,
// //   Platform,
// //   Linking
// // } from 'react-native';
// // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // // import { useBLEStore } from '../store/augBleStore';
// // import { useBLEStore } from '../store/augBleStore';
// // import * as Permissions from 'expo-permissions';
// // import * as IntentLauncher from 'expo-intent-launcher';

// // const DevicePairingScreen = ({ navigation }) => {
// //   const {
// //     connectToDevice,
// //     isConnected,
// //     scanForDevices,
// //     data,
// //     sendCommand,
// //     isScanning,
// //     hasPermissions,
// //     foundDevices,
// //     connectedDevice,
// //     disconnectDevice
// //   } = useBLEStore();

// //   const [scanning, setScanning] = useState(false);
// //   const [permissionGranted, setPermissionGranted] = useState(false);
// //   const [checkingPermission, setCheckingPermission] = useState(true);

// //   useEffect(() => {
// //     checkPermissions();
// //   }, []);

// //   useEffect(() => {
// //     // If connected successfully, navigate back
// //     if (isConnected && connectedDevice) {
// //       navigation.goBack();
// //     }
// //   }, [isConnected, connectedDevice]);

// //   const checkPermissions = async () => {
// //     setCheckingPermission(true);
// //     try {
// //       if (Platform.OS === 'android') {
// //         // For Android, we need to check and request multiple permissions
// //         const { status } = await Permissions.askAsync(
// //           Permissions.BLUETOOTH,
// //           Permissions.BLUETOOTH_ADMIN,
// //           Permissions.BLUETOOTH_SCAN,
// //           Permissions.BLUETOOTH_CONNECT,
// //           Permissions.ACCESS_FINE_LOCATION
// //         );
        
// //         setPermissionGranted(status === 'granted');
        
// //         if (status !== 'granted') {
// //           Alert.alert(
// //             'Permissions Required',
// //             'This app needs Bluetooth and Location permissions to scan for and connect to devices.',
// //             [
// //               { text: 'Cancel', style: 'cancel' },
// //               { text: 'Open Settings', onPress: openAppSettings }
// //             ]
// //           );
// //         }
// //       } else {
// //         // For iOS, we need Bluetooth permissions
// //         const { status } = await Permissions.askAsync(Permissions.BLUETOOTH);
// //         setPermissionGranted(status === 'granted');
        
// //         if (status !== 'granted') {
// //           Alert.alert(
// //             'Bluetooth Permission Required',
// //             'Please enable Bluetooth permissions in Settings to use this feature.',
// //             [
// //               { text: 'Cancel', style: 'cancel' },
// //               { text: 'Open Settings', onPress: openAppSettings }
// //             ]
// //           );
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Permission error:', error);
// //       Alert.alert('Error', 'Could not check permissions');
// //     } finally {
// //       setCheckingPermission(false);
// //     }
// //   };

// //   const openAppSettings = async () => {
// //     if (Platform.OS === 'ios') {
// //       Linking.openURL('app-settings:');
// //     } else {
// //       IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
// //         data: 'package:com.yourapp.package' // Replace with your app's package name
// //       });
// //     }
// //   };

// //   const startScanning = async () => {
// //     if (!permissionGranted) {
// //       Alert.alert(
// //         'Permissions Required',
// //         'Please grant the required permissions to scan for devices.',
// //         [
// //           { text: 'Cancel', style: 'cancel' },
// //           { text: 'Request Permissions', onPress: checkPermissions }
// //         ]
// //       );
// //       return;
// //     }

// //     setScanning(true);
// //     try {
// //       await scanForDevices();
// //     } catch (error) {
// //       console.error('Scanning error:', error);
// //       Alert.alert('Error', 'Failed to scan for devices');
// //     } finally {
// //       setScanning(false);
// //     }
// //   };

// //   const handleConnect = async (device) => {
// //     if (!permissionGranted) {
// //       Alert.alert(
// //         'Permissions Required',
// //         'Please grant the required permissions to connect to devices.',
// //         [
// //           { text: 'Cancel', style: 'cancel' },
// //           { text: 'Request Permissions', onPress: checkPermissions }
// //         ]
// //       );
// //       return;
// //     }

// //     try {
// //       await connectToDevice(device);
// //       // Navigation will happen automatically due to the useEffect above
// //     } catch (error) {
// //       console.error('Connection error:', error);
// //       Alert.alert('Connection Failed', 'Could not connect to the device');
// //     }
// //   };

// //   const handleDisconnect = async () => {
// //     try {
// //       await disconnectDevice();
// //     } catch (error) {
// //       console.error('Disconnection error:', error);
// //       Alert.alert('Error', 'Failed to disconnect from device');
// //     }
// //   };

// //   // Render permission request UI if permissions are not granted
// //   if (!permissionGranted) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //             <Feather name="arrow-left" size={24} color="#2E3A59" />
// //           </TouchableOpacity>
// //           <Text style={styles.headerTitle}>Pair Device</Text>
// //           <View style={styles.headerRight} />
// //         </View>

// //         <View style={styles.permissionContainer}>
// //           <MaterialCommunityIcons name="bluetooth" size={64} color="#9AA5B9" />
// //           <Text style={styles.permissionTitle}>Permissions Needed</Text>
// //           <Text style={styles.permissionText}>
// //             This app needs Bluetooth {Platform.OS === 'android' ? 'and Location ' : ''} 
// //             permissions to scan for and connect to devices.
// //           </Text>
          
// //           {checkingPermission ? (
// //             <ActivityIndicator size="large" color="#4B6CB7" style={styles.permissionSpinner} />
// //           ) : (
// //             <TouchableOpacity
// //               style={styles.permissionButton}
// //               onPress={checkPermissions}
// //             >
// //               <Text style={styles.permissionButtonText}>Grant Permissions</Text>
// //             </TouchableOpacity>
// //           )}
          
// //           <TouchableOpacity
// //             style={styles.settingsButton}
// //             onPress={openAppSettings}
// //           >
// //             <Text style={styles.settingsButtonText}>Open Settings</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //           <Feather name="arrow-left" size={24} color="#2E3A59" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Pair Device</Text>
// //         <View style={styles.headerRight} />
// //       </View>

// //       <ScrollView style={styles.content}>
// //         {/* Connection Status */}
// //         {isConnected && connectedDevice && (
// //           <View style={styles.connectedStatus}>
// //             <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
// //             <Text style={styles.connectedText}>Connected to {connectedDevice.name}</Text>
// //             <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectButton}>
// //               <Text style={styles.disconnectText}>Disconnect</Text>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Scanning Status */}
// //         {scanning && (
// //           <View style={styles.scanningContainer}>
// //             <ActivityIndicator size="large" color="#4B6CB7" />
// //             <Text style={styles.scanningText}>Scanning for devices...</Text>
// //           </View>
// //         )}

// //         {/* Devices List */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>
// //             Available Devices ({foundDevices.length})
// //           </Text>
          
// //           {foundDevices.length > 0 ? (
// //             <FlatList
// //               data={foundDevices}
// //               keyExtractor={(item) => item.id}
// //               scrollEnabled={false}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.deviceItem,
// //                     connectedDevice?.id === item.id && styles.deviceItemConnected
// //                   ]}
// //                   onPress={() => handleConnect(item)}
// //                   disabled={scanning || (isConnected && connectedDevice?.id === item.id)}
// //                 >
// //                   <View style={styles.deviceIcon}>
// //                     <MaterialCommunityIcons 
// //                       name="bluetooth" 
// //                       size={24} 
// //                       color={connectedDevice?.id === item.id ? "#4B6CB7" : "#5A6A8C"} 
// //                     />
// //                   </View>
// //                   <View style={styles.deviceInfo}>
// //                     <Text style={styles.deviceName}>
// //                       {item.name || 'Unknown Device'}
// //                     </Text>
// //                     <Text style={styles.deviceId}>{item.id}</Text>
// //                   </View>
// //                   <View style={styles.deviceStatus}>
// //                     {connectedDevice?.id === item.id ? (
// //                       <>
// //                         <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
// //                         <Text style={styles.connectedLabel}>Connected</Text>
// //                       </>
// //                     ) : (
// //                       <Feather name="chevron-right" size={20} color="#9AA5B9" />
// //                     )}
// //                   </View>
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           ) : !scanning ? (
// //             <View style={styles.emptyState}>
// //               <MaterialCommunityIcons name="bluetooth-off" size={48} color="#9AA5B9" />
// //               <Text style={styles.emptyStateTitle}>No devices found</Text>
// //               <Text style={styles.emptyStateText}>
// //                 Make sure your device is in pairing mode and Bluetooth is enabled
// //               </Text>
// //               <TouchableOpacity
// //                 style={styles.scanButtonSmall}
// //                 onPress={startScanning}
// //                 disabled={scanning}
// //               >
// //                 <Text style={styles.scanButtonTextSmall}>
// //                   {scanning ? 'Scanning...' : 'Scan for Devices'}
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           ) : null}
// //         </View>

// //         {/* Instructions */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Connection Instructions</Text>
// //           <View style={styles.instructionItem}>
// //             <View style={styles.instructionNumber}>
// //               <Text style={styles.instructionNumberText}>1</Text>
// //             </View>
// //             <Text style={styles.instructionText}>
// //               Make sure your device is turned on and in pairing mode
// //             </Text>
// //           </View>
// //           <View style={styles.instructionItem}>
// //             <View style={styles.instructionNumber}>
// //               <Text style={styles.instructionNumberText}>2</Text>
// //             </View>
// //             <Text style={styles.instructionText}>
// //               Ensure Bluetooth is enabled on your phone
// //             </Text>
// //           </View>
// //           <View style={styles.instructionItem}>
// //             <View style={styles.instructionNumber}>
// //               <Text style={styles.instructionNumberText}>3</Text>
// //             </View>
// //             <Text style={styles.instructionText}>
// //               Tap on your device from the list above to connect
// //             </Text>
// //           </View>
// //         </View>
// //       </ScrollView>

// //       {/* Footer Actions */}
// //       <View style={styles.footer}>
// //         <TouchableOpacity
// //           style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
// //           onPress={startScanning}
// //           disabled={scanning}
// //         >
// //           <MaterialCommunityIcons 
// //             name="bluetooth-connect" 
// //             size={20} 
// //             color="#fff" 
// //           />
// //           <Text style={styles.scanButtonText}>
// //             {scanning ? 'Scanning...' : 'Scan Again'}
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F5F7FB',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     padding: 16,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#E0E7FF',
// //   },
// //   backButton: {
// //     padding: 8,
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#2E3A59',
// //   },
// //   headerRight: {
// //     width: 40,
// //   },
// //   permissionContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 40,
// //   },
// //   permissionTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#2E3A59',
// //     marginTop: 20,
// //     marginBottom: 12,
// //   },
// //   permissionText: {
// //     textAlign: 'center',
// //     color: '#5A6A8C',
// //     lineHeight: 22,
// //     marginBottom: 30,
// //   },
// //   permissionSpinner: {
// //     marginTop: 20,
// //   },
// //   permissionButton: {
// //     backgroundColor: '#4B6CB7',
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },
// //   permissionButtonText: {
// //     color: 'white',
// //     fontWeight: '600',
// //   },
// //   settingsButton: {
// //     padding: 16,
// //   },
// //   settingsButtonText: {
// //     color: '#4B6CB7',
// //     fontWeight: '500',
// //   },
// //   content: {
// //     flex: 1,
// //     padding: 16,
// //   },
// //   connectedStatus: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#E8F5E9',
// //     padding: 16,
// //     borderRadius: 12,
// //     marginBottom: 20,
// //   },
// //   connectedText: {
// //     marginLeft: 12,
// //     flex: 1,
// //     color: '#2E3A59',
// //     fontWeight: '500',
// //   },
// //   disconnectButton: {
// //     padding: 8,
// //   },
// //   disconnectText: {
// //     color: '#F44336',
// //     fontWeight: '500',
// //   },
// //   scanningContainer: {
// //     alignItems: 'center',
// //     padding: 20,
// //     backgroundColor: '#F0F4FF',
// //     borderRadius: 12,
// //     marginBottom: 20,
// //   },
// //   scanningText: {
// //     marginTop: 12,
// //     color: '#5A6A8C',
// //   },
// //   section: {
// //     marginBottom: 24,
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#2E3A59',
// //     marginBottom: 16,
// //   },
// //   deviceItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'white',
// //     padding: 16,
// //     borderRadius: 12,
// //     marginBottom: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   deviceItemConnected: {
// //     backgroundColor: '#F0F4FF',
// //     borderWidth: 1,
// //     borderColor: '#4B6CB7',
// //   },
// //   deviceIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#F0F4FF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   deviceInfo: {
// //     flex: 1,
// //   },
// //   deviceName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#2E3A59',
// //     marginBottom: 4,
// //   },
// //   deviceId: {
// //     fontSize: 12,
// //     color: '#9AA5B9',
// //   },
// //   deviceStatus: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   connectedLabel: {
// //     marginLeft: 4,
// //     color: '#4CAF50',
// //     fontSize: 12,
// //   },
// //   emptyState: {
// //     alignItems: 'center',
// //     padding: 40,
// //     backgroundColor: 'white',
// //     borderRadius: 12,
// //   },
// //   emptyStateTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#2E3A59',
// //     marginTop: 16,
// //     marginBottom: 8,
// //   },
// //   emptyStateText: {
// //     textAlign: 'center',
// //     color: '#5A6A8C',
// //     lineHeight: 20,
// //     marginBottom: 20,
// //   },
// //   scanButtonSmall: {
// //     backgroundColor: '#4B6CB7',
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //   },
// //   scanButtonTextSmall: {
// //     color: 'white',
// //     fontWeight: '600',
// //   },
// //   instructionItem: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     marginBottom: 16,
// //   },
// //   instructionNumber: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     backgroundColor: '#4B6CB7',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //     marginTop: 2,
// //   },
// //   instructionNumberText: {
// //     color: 'white',
// //     fontWeight: '600',
// //     fontSize: 12,
// //   },
// //   instructionText: {
// //     flex: 1,
// //     color: '#5A6A8C',
// //     lineHeight: 20,
// //   },
// //   footer: {
// //     padding: 16,
// //     backgroundColor: 'white',
// //     borderTopWidth: 1,
// //     borderTopColor: '#E0E7FF',
// //   },
// //   scanButton: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#4B6CB7',
// //     padding: 16,
// //     borderRadius: 12,
// //   },
// //   scanButtonDisabled: {
// //     backgroundColor: '#9AA5B9',
// //   },
// //   scanButtonText: {
// //     color: 'white',
// //     fontWeight: '600',
// //     marginLeft: 8,
// //   },
// // });

// // export default DevicePairingScreen;
// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   ActivityIndicator,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   ScrollView
// // // } from 'react-native';
// // // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// // // import { useBLEStore } from '../store/augBleStore';

// // // const DevicePairingScreen = ({ navigation }) => {
// // //   const {
// // //     connectToDevice,
// // //     isConnected,
// // //     scanForDevices,
// // //     data,
// // //     sendCommand,
// // //     isScanning,
// // //     hasPermissions,
// // //     foundDevices,
// // //     connectedDevice,
// // //     disconnectDevice
// // //   } = useBLEStore();

// // //   const [scanning, setScanning] = useState(false);

// // //   useEffect(() => {
// // //     startScanning();
// // //   }, []);

// // //   useEffect(() => {
// // //     // If connected successfully, navigate back
// // //     if (isConnected && connectedDevice) {
// // //       navigation.goBack();
// // //     }
// // //   }, [isConnected, connectedDevice]);

// // //   const startScanning = async () => {
// // //     setScanning(true);
// // //     await scanForDevices();
// // //     setScanning(false);
// // //   };

// // //   const handleConnect = async (device) => {
// // //     try {
// // //       await connectToDevice(device);
// // //       // Navigation will happen automatically due to the useEffect above
// // //     } catch (error) {
// // //       console.error('Connection error:', error);
// // //       Alert.alert('Connection Failed', 'Could not connect to the device');
// // //     }
// // //   };

// // //   const handleDisconnect = async () => {
// // //     await disconnectDevice();
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //           <Feather name="arrow-left" size={24} color="#2E3A59" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>Pair Device</Text>
// // //         <View style={styles.headerRight} />
// // //       </View>

// // //       <ScrollView style={styles.content}>
// // //         {/* Connection Status */}
// // //         {isConnected && connectedDevice && (
// // //           <View style={styles.connectedStatus}>
// // //             <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
// // //             <Text style={styles.connectedText}>Connected to {connectedDevice.name}</Text>
// // //             <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectButton}>
// // //               <Text style={styles.disconnectText}>Disconnect</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         )}

// // //         {/* Scanning Status */}
// // //         {scanning && (
// // //           <View style={styles.scanningContainer}>
// // //             <ActivityIndicator size="large" color="#4B6CB7" />
// // //             <Text style={styles.scanningText}>Scanning for devices...</Text>
// // //           </View>
// // //         )}

// // //         {/* Devices List */}
// // //         <View style={styles.section}>
// // //           <Text style={styles.sectionTitle}>
// // //             Available Devices ({foundDevices.length})
// // //           </Text>
          
// // //           {foundDevices.length > 0 ? (
// // //             <FlatList
// // //               data={foundDevices}
// // //               keyExtractor={(item) => item.id}
// // //               scrollEnabled={false} // Since we're in a ScrollView
// // //               renderItem={({ item }) => (
// // //                 <TouchableOpacity
// // //                   style={[
// // //                     styles.deviceItem,
// // //                     connectedDevice?.id === item.id && styles.deviceItemConnected
// // //                   ]}
// // //                   onPress={() => handleConnect(item)}
// // //                   disabled={scanning || (isConnected && connectedDevice?.id === item.id)}
// // //                 >
// // //                   <View style={styles.deviceIcon}>
// // //                     <MaterialCommunityIcons 
// // //                       name="bluetooth" 
// // //                       size={24} 
// // //                       color={connectedDevice?.id === item.id ? "#4B6CB7" : "#5A6A8C"} 
// // //                     />
// // //                   </View>
// // //                   <View style={styles.deviceInfo}>
// // //                     <Text style={styles.deviceName}>
// // //                       {item.name || 'Unknown Device'}
// // //                     </Text>
// // //                     <Text style={styles.deviceId}>{item.id}</Text>
// // //                   </View>
// // //                   <View style={styles.deviceStatus}>
// // //                     {connectedDevice?.id === item.id ? (
// // //                       <>
// // //                         <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
// // //                         <Text style={styles.connectedLabel}>Connected</Text>
// // //                       </>
// // //                     ) : (
// // //                       <Feather name="chevron-right" size={20} color="#9AA5B9" />
// // //                     )}
// // //                   </View>
// // //                 </TouchableOpacity>
// // //               )}
// // //             />
// // //           ) : !scanning ? (
// // //             <View style={styles.emptyState}>
// // //               <MaterialCommunityIcons name="bluetooth-off" size={48} color="#9AA5B9" />
// // //               <Text style={styles.emptyStateTitle}>No devices found</Text>
// // //               <Text style={styles.emptyStateText}>
// // //                 Make sure your device is in pairing mode and Bluetooth is enabled
// // //               </Text>
// // //             </View>
// // //           ) : null}
// // //         </View>

// // //         {/* Instructions */}
// // //         <View style={styles.section}>
// // //           <Text style={styles.sectionTitle}>Connection Instructions</Text>
// // //           <View style={styles.instructionItem}>
// // //             <View style={styles.instructionNumber}>
// // //               <Text style={styles.instructionNumberText}>1</Text>
// // //             </View>
// // //             <Text style={styles.instructionText}>
// // //               Make sure your device is turned on and in pairing mode
// // //             </Text>
// // //           </View>
// // //           <View style={styles.instructionItem}>
// // //             <View style={styles.instructionNumber}>
// // //               <Text style={styles.instructionNumberText}>2</Text>
// // //             </View>
// // //             <Text style={styles.instructionText}>
// // //               Ensure Bluetooth is enabled on your phone
// // //             </Text>
// // //           </View>
// // //           <View style={styles.instructionItem}>
// // //             <View style={styles.instructionNumber}>
// // //               <Text style={styles.instructionNumberText}>3</Text>
// // //             </View>
// // //             <Text style={styles.instructionText}>
// // //               Tap on your device from the list above to connect
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </ScrollView>

// // //       {/* Footer Actions */}
// // //       <View style={styles.footer}>
// // //         <TouchableOpacity
// // //           style={styles.scanButton}
// // //           onPress={startScanning}
// // //           disabled={scanning}
// // //         >
// // //           <MaterialCommunityIcons 
// // //             name="bluetooth-connect" 
// // //             size={20} 
// // //             color="#fff" 
// // //           />
// // //           <Text style={styles.scanButtonText}>
// // //             {scanning ? 'Scanning...' : 'Scan Again'}
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F5F7FB',
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     padding: 16,
// // //     backgroundColor: '#fff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#E0E7FF',
// // //   },
// // //   backButton: {
// // //     padding: 8,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#2E3A59',
// // //   },
// // //   headerRight: {
// // //     width: 40,
// // //   },
// // //   content: {
// // //     flex: 1,
// // //     padding: 16,
// // //   },
// // //   connectedStatus: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#E8F5E9',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginBottom: 20,
// // //   },
// // //   connectedText: {
// // //     marginLeft: 12,
// // //     flex: 1,
// // //     color: '#2E3A59',
// // //     fontWeight: '500',
// // //   },
// // //   disconnectButton: {
// // //     padding: 8,
// // //   },
// // //   disconnectText: {
// // //     color: '#F44336',
// // //     fontWeight: '500',
// // //   },
// // //   scanningContainer: {
// // //     alignItems: 'center',
// // //     padding: 20,
// // //     backgroundColor: '#F0F4FF',
// // //     borderRadius: 12,
// // //     marginBottom: 20,
// // //   },
// // //   scanningText: {
// // //     marginTop: 12,
// // //     color: '#5A6A8C',
// // //   },
// // //   section: {
// // //     marginBottom: 24,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#2E3A59',
// // //     marginBottom: 16,
// // //   },
// // //   deviceItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: 'white',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginBottom: 12,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   deviceItemConnected: {
// // //     backgroundColor: '#F0F4FF',
// // //     borderWidth: 1,
// // //     borderColor: '#4B6CB7',
// // //   },
// // //   deviceIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: '#F0F4FF',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   deviceInfo: {
// // //     flex: 1,
// // //   },
// // //   deviceName: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#2E3A59',
// // //     marginBottom: 4,
// // //   },
// // //   deviceId: {
// // //     fontSize: 12,
// // //     color: '#9AA5B9',
// // //   },
// // //   deviceStatus: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   connectedLabel: {
// // //     marginLeft: 4,
// // //     color: '#4CAF50',
// // //     fontSize: 12,
// // //   },
// // //   emptyState: {
// // //     alignItems: 'center',
// // //     padding: 40,
// // //     backgroundColor: 'white',
// // //     borderRadius: 12,
// // //   },
// // //   emptyStateTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#2E3A59',
// // //     marginTop: 16,
// // //     marginBottom: 8,
// // //   },
// // //   emptyStateText: {
// // //     textAlign: 'center',
// // //     color: '#5A6A8C',
// // //     lineHeight: 20,
// // //   },
// // //   instructionItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 16,
// // //   },
// // //   instructionNumber: {
// // //     width: 24,
// // //     height: 24,
// // //     borderRadius: 12,
// // //     backgroundColor: '#4B6CB7',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //     marginTop: 2,
// // //   },
// // //   instructionNumberText: {
// // //     color: 'white',
// // //     fontWeight: '600',
// // //     fontSize: 12,
// // //   },
// // //   instructionText: {
// // //     flex: 1,
// // //     color: '#5A6A8C',
// // //     lineHeight: 20,
// // //   },
// // //   footer: {
// // //     padding: 16,
// // //     backgroundColor: 'white',
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#E0E7FF',
// // //   },
// // //   scanButton: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: '#4B6CB7',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //   },
// // //   scanButtonText: {
// // //     color: 'white',
// // //     fontWeight: '600',
// // //     marginLeft: 8,
// // //   },
// // // });

// // // export default DevicePairingScreen;