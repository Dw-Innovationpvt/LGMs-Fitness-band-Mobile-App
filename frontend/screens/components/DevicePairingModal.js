import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useBLEStore } from '../store/augBleStore';
import { useBLEStore } from '../../store/augBleStore';
const { width, height } = Dimensions.get('window');

// Device Pairing Modal Component
const DevicePairingModal = ({ visible, onClose }) => {
  const {
    foundDevices,
    isScanning,
    error,
    scanForDevices,
    connectToDevice,
    isConnected,
    connectedDevice,
  } = useBLEStore();
  
  const [connectingDeviceId, setConnectingDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (visible) {
      handleStartScan();
    } else {
      // Clean up when modal closes
      setConnectingDeviceId(null);
    }
  }, [visible]);

  // Watch for changes to foundDevices from the BLE store
  useEffect(() => {
    if (foundDevices && foundDevices.length > 0) {
      console.log('Devices found:', foundDevices);
      setDevices(foundDevices);
    } else {
      setDevices([]);
    }
  }, [foundDevices]);

  const handleStartScan = async () => {
    setConnectingDeviceId(null);
    setDevices([]);
    await scanForDevices();
  };

  const handleConnectToDevice = async (device) => {
    try {
      setConnectingDeviceId(device.id);
      await connectToDevice(device);
      setConnectingDeviceId(null);
      
      // Auto-close modal on successful connection after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setConnectingDeviceId(null);
      Alert.alert('Connection Failed', err.message || 'Failed to connect to the device');
    }
  };

  const renderDeviceItem = ({ item }) => {
    const isConnecting = connectingDeviceId === item.id;
    const isConnectedToThis = isConnected && connectedDevice?.id === item.id;
    const deviceName = item.name || item.localName || 'Unknown Device';
    
    return (
      <TouchableOpacity
        style={[
          styles.deviceItem,
          isConnecting && styles.deviceItemConnecting,
          isConnectedToThis && styles.deviceItemConnected
        ]}
        onPress={() => !isConnectedToThis && handleConnectToDevice(item)}
        disabled={isConnecting || isConnectedToThis}
      >
        <View style={styles.deviceIconContainer}>
          <MaterialCommunityIcons 
            name={isConnectedToThis ? "bluetooth-connected" : "bluetooth"} 
            size={24} 
            color={isConnectedToThis ? "#4B6CB7" : "#9AA5B9"} 
          />
        </View>
        
        <View style={styles.deviceInfoContainer}>
          <Text style={[
            styles.deviceName,
            isConnecting && styles.deviceNameConnecting,
            isConnectedToThis && styles.deviceNameConnected
          ]} numberOfLines={1}>
            {deviceName}
            {isConnectedToThis && ' (Connected)'}
          </Text>
          <Text style={styles.deviceId} numberOfLines={1}>{item.id}</Text>
        </View>
        
        {isConnecting ? (
          <ActivityIndicator size="small" color="#4B6CB7" />
        ) : (
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color="#9AA5B9" 
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.pairingModalContent}>
          <LinearGradient 
            colors={['#4B6CB7', '#1A2980']} 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}}
            style={styles.modalHeader}
          >
            <Text style={[styles.modalTitle, { color: '#fff' }]}>
              {isConnected ? 'Device Connected' : 'Connect Your Device'}
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.modalBody}>
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <View style={styles.scanningAnimation}>
                  <ActivityIndicator size="large" color="#4B6CB7" />
                  <MaterialCommunityIcons 
                    name="bluetooth" 
                    size={48} 
                    color="#4B6CB7" 
                    style={styles.bluetoothIcon}
                  />
                </View>
                <Text style={styles.scanningTitle}>Searching for nearby devices...</Text>
                
                <View style={styles.requirementsContainer}>
                  <View style={styles.requirementItem}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#A5D6A7" />
                    <Text style={styles.requirementText}>Turn on your fitness tracker</Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#A5D6A7" />
                    <Text style={styles.requirementText}>Enable Bluetooth pairing mode</Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#A5D6A7" />
                    <Text style={styles.requirementText}>Keep device within 3-5 feet</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.devicesContainer}>
                {error ? (
                  <View style={styles.errorContainer}>
                    <MaterialCommunityIcons name="alert-circle" size={48} color="#FF6B6B" />
                    <Text style={styles.errorText}>{error}</Text>
                    <Text style={styles.errorSubtext}>
                      {Platform.OS === 'android' 
                        ? 'Please check Bluetooth and location permissions in app settings'
                        : 'Please check Bluetooth settings and try again'
                      }
                    </Text>
                  </View>
                ) : devices.length > 0 ? (
                  <>
                    <Text style={styles.devicesFoundText}>
                      {devices.length} DEVICE{devices.length !== 1 ? 'S' : ''} FOUND
                    </Text>
                    <FlatList
                      data={devices}
                      keyExtractor={(item) => item.id}
                      renderItem={renderDeviceItem}
                      style={styles.deviceList}
                      contentContainerStyle={styles.deviceListContent}
                    />
                  </>
                ) : (
                  <View style={styles.noDevicesContainer}>
                    <MaterialCommunityIcons name="bluetooth-off" size={48} color="#9AA5B9" />
                    <Text style={styles.noDevicesTitle}>No devices detected</Text>
                    <Text style={styles.noDevicesSubtitle}>
                      Ensure your device is powered on, in pairing mode, and nearby. 
                      Then try scanning again.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.secondaryButton]}
              onPress={handleStartScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator size="small" color="#4B6CB7" />
              ) : (
                <>
                  <MaterialCommunityIcons name="magnify" size={20} color="#4B6CB7" />
                  <Text style={styles.secondaryButtonText}>
                    {devices.length > 0 ? 'Scan Again' : 'Start Scan'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.primaryButton]}
              onPress={onClose}
            >
              <Text style={styles.primaryButtonText}>
                {isConnected ? 'Done' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  pairingModalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1,
  },
  scanningContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  scanningAnimation: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bluetoothIcon: {
    position: 'absolute',
  },
  scanningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  requirementsContainer: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 40,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  requirementText: {
    fontSize: 14,
    color: '#2E3A59',
    marginLeft: 12,
    fontWeight: '500',
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
  deviceList: {
    maxHeight: 300,
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
  deviceItemConnecting: {
    backgroundColor: '#F0F4FF',
  },
  deviceItemConnected: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#4B6CB7',
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
  deviceInfoContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 4,
  },
  deviceNameConnecting: {
    color: '#5A6A8C',
  },
  deviceNameConnected: {
    color: '#4B6CB7',
    fontWeight: '600',
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
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#5A6A8C',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
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
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#4B6CB7',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default DevicePairingModal;
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   Platform,
//   StyleSheet,
//   Dimensions
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Feather from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { useBLEStore } from '../store/augBleStore';
// import { useBLEStore } from '../../store/augBleStore';

// const { width, height } = Dimensions.get('window');

// // Device Pairing Modal Component
// const DevicePairingModal = ({ visible, onClose }) => {
//   const {
//     foundDevices,
//     isScanning,
//     error,
//     scanForDevices,
//     connectToDevice,
//     isConnected,
//     connectedDevice,
//   } = useBLEStore();
  
//   const [connectingDeviceId, setConnectingDeviceId] = useState(null);

//   useEffect(() => {
//     if (visible) {
//       handleStartScan();
//     } else {
//       // Clean up when modal closes
//       setConnectingDeviceId(null);
//     }
//   }, [visible]);

//   const handleStartScan = async () => {
//     setConnectingDeviceId(null);
//     await scanForDevices();
//   };

//   const handleConnectToDevice = async (device) => {
//     try {
//       setConnectingDeviceId(device.id);
//       await connectToDevice(device);
//       setConnectingDeviceId(null);
      
//       // Optional: Auto-close modal on successful connection
//       // onClose();
//     } catch (err) {
//       setConnectingDeviceId(null);
//       Alert.alert('Connection Failed', err.message || 'Failed to connect to the device');
//     }
//   };

//   const renderDeviceItem = ({ item }) => {
//     const isConnecting = connectingDeviceId === item.id;
//     const isConnectedToThis = isConnected && connectedDevice?.id === item.id;
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.deviceItem,
//           isConnecting && styles.deviceItemConnecting,
//           isConnectedToThis && styles.deviceItemConnected
//         ]}
//         onPress={() => !isConnectedToThis && handleConnectToDevice(item)}
//         disabled={isConnecting || isConnectedToThis}
//       >
//         <View style={styles.deviceIconContainer}>
//           <MaterialCommunityIcons 
//             name={isConnectedToThis ? "bluetooth-connected" : "bluetooth"} 
//             size={24} 
//             color={isConnectedToThis ? "#4B6CB7" : "#9AA5B9"} 
//           />
//         </View>
        
//         <View style={styles.deviceInfoContainer}>
//           <Text style={[
//             styles.deviceName,
//             isConnecting && styles.deviceNameConnecting,
//             isConnectedToThis && styles.deviceNameConnected
//           ]}>
//             {item.name || item.localName || 'Unknown Device'}
//             {isConnectedToThis && ' (Connected)'}
//           </Text>
//           <Text style={styles.deviceId}>{item.id}</Text>
//         </View>
        
//         {isConnecting ? (
//           <ActivityIndicator size="small" color="#4B6CB7" />
//         ) : (
//           <MaterialCommunityIcons 
//             name="chevron-right" 
//             size={24} 
//             color="#9AA5B9" 
//           />
//         )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.modalOverlay}>
//         <View style={styles.pairingModalContent}>
//           <LinearGradient 
//             colors={['#4B6CB7', '#1A2980']} 
//             start={{x: 0, y: 0}} 
//             end={{x: 1, y: 0}}
//             style={styles.modalHeader}
//           >
//             <Text style={[styles.modalTitle, { color: '#fff' }]}>
//               {isConnected ? 'Device Connected' : 'Connect Your Device'}
//             </Text>
//             <TouchableOpacity 
//               onPress={onClose}
//               style={styles.closeButton}
//             >
//               <Feather name="x" size={24} color="white" />
//             </TouchableOpacity>
//           </LinearGradient>

//           <View style={styles.modalBody}>
//             {isScanning ? (
//               <View style={styles.scanningContainer}>
//                 <View style={styles.scanningAnimation}>
//                   <ActivityIndicator size="large" color="#4B6CB7" />
//                   <MaterialCommunityIcons 
//                     name="bluetooth" 
//                     size={48} 
//                     color="#4B6CB7" 
//                     style={styles.bluetoothIcon}
//                   />
//                 </View>
//                 <Text style={styles.scanningTitle}>Searching for nearby devices...</Text>
                
//                 <View style={styles.requirementsContainer}>
//                   <View style={styles.requirementItem}>
//                     <MaterialCommunityIcons name="check-circle" size={20} color="#A5D6A7" />
//                     <Text style={styles.requirementText}>Turn on your fitness tracker</Text>
//                   </View>
//                   <View style={styles.requirementItem}>
//                     <MaterialCommunityIcons name="check-circle" size={20} color="#A5D6A7" />
//                     <Text style={styles.requirementText}>Enable Bluetooth pairing mode</Text>
//                   </View>
//                   <View style={styles.requirementItem}>
//                     <MaterialCommunityIcons name="check-circle" size={20} color="#A5D6A7" />
//                     <Text style={styles.requirementText}>Keep device within 3-5 feet</Text>
//                   </View>
//                 </View>
//               </View>
//             ) : (
//               <View style={styles.devicesContainer}>
//                 {error ? (
//                   <View style={styles.errorContainer}>
//                     <MaterialCommunityIcons name="alert-circle" size={48} color="#FF6B6B" />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <Text style={styles.errorSubtext}>
//                       {Platform.OS === 'android' 
//                         ? 'Please check Bluetooth and location permissions in app settings'
//                         : 'Please check Bluetooth settings and try again'
//                       }
//                     </Text>
//                   </View>
//                 ) : foundDevices.length > 0 ? (
//                   <>
//                     <Text style={styles.devicesFoundText}>
//                       {foundDevices.length} DEVICE{foundDevices.length !== 1 ? 'S' : ''} FOUND
//                     </Text>
//                     <FlatList
//                       data={foundDevices}
//                       keyExtractor={(item) => item.id}
//                       renderItem={renderDeviceItem}
//                       style={styles.deviceList}
//                       contentContainerStyle={styles.deviceListContent}
//                     />
//                   </>
//                 ) : (
//                   <View style={styles.noDevicesContainer}>
//                     <MaterialCommunityIcons name="bluetooth-off" size={48} color="#9AA5B9" />
//                     <Text style={styles.noDevicesTitle}>No devices detected</Text>
//                     <Text style={styles.noDevicesSubtitle}>
//                       Ensure your device is powered on, in pairing mode, and nearby. 
//                       Then try scanning again.
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             )}
//           </View>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={[styles.modalButton, styles.secondaryButton]}
//               onPress={handleStartScan}
//               disabled={isScanning}
//             >
//               {isScanning ? (
//                 <ActivityIndicator size="small" color="#4B6CB7" />
//               ) : (
//                 <>
//                   <MaterialCommunityIcons name="magnify" size={20} color="#4B6CB7" />
//                   <Text style={styles.secondaryButtonText}>
//                     {foundDevices.length > 0 ? 'Scan Again' : 'Start Scan'}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={[styles.modalButton, styles.primaryButton]}
//               onPress={onClose}
//             >
//               <Text style={styles.primaryButtonText}>
//                 {isConnected ? 'Done' : 'Cancel'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   pairingModalContent: {
//     width: '90%',
//     maxHeight: '85%',
//     backgroundColor: '#fff',
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   modalHeader: {
//     paddingVertical: 20,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   closeButton: {
//     position: 'absolute',
//     right: 20,
//     top: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 20,
//     padding: 4,
//   },
//   modalBody: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     flex: 1,
//   },
//   scanningContainer: {
//     paddingVertical: 32,
//     alignItems: 'center',
//     backgroundColor: '#F8FAFF',
//   },
//   scanningAnimation: {
//     width: 150,
//     height: 150,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   bluetoothIcon: {
//     position: 'absolute',
//   },
//   scanningTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2E3A59',
//     marginBottom: 24,
//     textAlign: 'center',
//     paddingHorizontal: 40,
//   },
//   requirementsContainer: {
//     width: '100%',
//     marginTop: 16,
//     paddingHorizontal: 40,
//   },
//   requirementItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 12,
//   },
//   requirementText: {
//     fontSize: 14,
//     color: '#2E3A59',
//     marginLeft: 12,
//     fontWeight: '500',
//   },
//   devicesContainer: {
//     paddingVertical: 16,
//     backgroundColor: '#F8FAFF',
//   },
//   devicesFoundText: {
//     fontSize: 12,
//     color: '#5A6A8C',
//     marginBottom: 12,
//     paddingHorizontal: 24,
//     fontWeight: '600',
//     letterSpacing: 0.5,
//   },
//   deviceList: {
//     maxHeight: 300,
//   },
//   deviceListContent: {
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//   },
//   deviceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     marginBottom: 12,
//     shadowColor: '#4B6CB7',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   deviceItemConnecting: {
//     backgroundColor: '#F0F4FF',
//   },
//   deviceItemConnected: {
//     backgroundColor: '#F0F4FF',
//     borderWidth: 1,
//     borderColor: '#4B6CB7',
//   },
//   deviceIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F0F4FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   deviceInfoContainer: {
//     flex: 1,
//   },
//   deviceName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2E3A59',
//     marginBottom: 4,
//   },
//   deviceNameConnecting: {
//     color: '#5A6A8C',
//   },
//   deviceNameConnected: {
//     color: '#4B6CB7',
//     fontWeight: '600',
//   },
//   deviceId: {
//     fontSize: 12,
//     color: '#9AA5B9',
//     fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
//   },
//   noDevicesContainer: {
//     alignItems: 'center',
//     paddingVertical: 40,
//     paddingHorizontal: 40,
//   },
//   noDevicesTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2E3A59',
//     marginBottom: 8,
//   },
//   noDevicesSubtitle: {
//     fontSize: 14,
//     color: '#5A6A8C',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   errorContainer: {
//     alignItems: 'center',
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FF6B6B',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   errorSubtext: {
//     fontSize: 14,
//     color: '#5A6A8C',
//     textAlign: 'center',
//     marginTop: 8,
//     lineHeight: 20,
//   },
//   modalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 16,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   primaryButton: {
//     backgroundColor: '#4B6CB7',
//     marginLeft: 8,
//     shadowColor: '#4B6CB7',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   secondaryButton: {
//     backgroundColor: '#F3F4F6',
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: '#E0E7FF',
//   },
//   primaryButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   secondaryButtonText: {
//     color: '#4B6CB7',
//     fontWeight: '600',
//     fontSize: 16,
//     marginLeft: 8,
//   },
// });

// export default DevicePairingModal;