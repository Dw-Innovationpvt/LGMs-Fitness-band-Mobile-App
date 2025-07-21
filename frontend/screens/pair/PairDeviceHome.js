import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBLEStore } from '../store/bleStore'; // adjust the path as needed

const PairDeviceHome = () => {
  const {
    connectToDevice,
    scanForDevices,
    foundDevices,
  } = useBLEStore();

  const [pairingModalVisible, setPairingModalVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState(null);

  useEffect(() => {
    // Automatically scan when modal opens
    if (pairingModalVisible) {
      handleScanDevices();
    }
  }, [pairingModalVisible]);

  const handleScanDevices = async () => {
    try {
      setIsScanning(true);
      await scanForDevices();
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Scan Error', error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const renderDeviceItem = ({ item }) => {
    const isConnecting = connectingDeviceId === item.id;

    const handleConnect = async () => {
      setConnectingDeviceId(item.id);
      try {
        await connectToDevice(item);
        setPairingModalVisible(false);
        Alert.alert('Connected', `Successfully connected to ${item.name || 'device'}`);
      } catch (error) {
        Alert.alert('Connection Failed', error.message);
      } finally {
        setConnectingDeviceId(null);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.deviceItem, isConnecting && styles.deviceItemConnecting]}
        onPress={handleConnect}
        disabled={isConnecting}
      >
        <View style={styles.deviceIconContainer}>
          <MaterialCommunityIcons
            name="bluetooth"
            size={24}
            color={isConnecting ? "#999" : "#4B6CB7"}
          />
        </View>

        <View style={styles.deviceInfoContainer}>
          <Text style={[styles.deviceName, isConnecting && styles.deviceNameConnecting]}>
            {item.name || 'Unknown Device'}
          </Text>
          <Text style={styles.deviceId}>{item.id}</Text>
        </View>

        {isConnecting ? (
          <ActivityIndicator size="small" color="#4B6CB7" />
        ) : (
          <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => setPairingModalVisible(true)}
        style={styles.pairButton}
      >
        <Text style={styles.pairButtonText}>Pair Device</Text>
      </TouchableOpacity>

      <Modal visible={pairingModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Available Devices</Text>

            {isScanning ? (
              <ActivityIndicator size="large" color="#4B6CB7" />
            ) : (
              <FlatList
                data={foundDevices}
                keyExtractor={(item) => item.id}
                renderItem={renderDeviceItem}
                ListEmptyComponent={<Text style={styles.noDevices}>No devices found</Text>}
              />
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={handleScanDevices} style={styles.footerBtn}>
                <Text style={styles.footerBtnText}>Rescan</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPairingModalVisible(false)} style={styles.footerBtn}>
                <Text style={styles.footerBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  pairButton: {
    backgroundColor: '#4B6CB7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  pairButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  noDevices: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  deviceIconContainer: {
    marginRight: 10
  },
  deviceInfoContainer: {
    flex: 1
  },
  deviceName: {
    fontWeight: '600'
  },
  deviceId: {
    fontSize: 12,
    color: '#666'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  footerBtn: {
    padding: 10
  },
  footerBtnText: {
    color: '#4B6CB7',
    fontWeight: 'bold'
  }
});

export default PairDeviceHome;