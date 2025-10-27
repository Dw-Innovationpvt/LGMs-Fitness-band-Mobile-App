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
  } = useBLEStore();

  useEffect(() => {
    return () => {
      // cleanup if needed
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
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pair Device</Text>
        <Text></Text>
      </View>

      {/* Status */}
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

      {/* Data */}
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
            onPress={disconnect}
          >
            <Text style={{ color: 'white' }}>🔌 Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Devices */}
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

// bring in your big style system here
const styles = StyleSheet.create({
  safeArea: {
    // marginTop: Platform.OS === 'ios' ? 0 : 0,
    // marginTop: 10,
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
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
    shadowColor: '#1A2980',
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
    // shadowRadius: Platform.OS === 'ios' ? 20 : 0,
    // elevation: Platform.OS === 'android' ? 10 : 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8%',
  },
  greetingText: {
    fontSize: width * 0.045,
    marginRight: '2%',
    color: 'rgba(255,255,255,0.9)',
  },
  headerText: {
    fontSize: width * 0.055,
    color: '#fff',
    marginTop: '1%',
  },
  profileIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '-2%',
  },
  actionCard: {
    alignItems: 'center',
    width: '30%',
    paddingHorizontal: '2%',
  },
  actionIconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
  },
  actionIconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionLabel: {
    color: '#fff',
    fontSize: width * 0.033,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: '4%',
    paddingBottom: '8%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
    marginTop: '4%',
    overflow: 'hidden',
    // paddingHorizontal: 10,
    marginHorizontal: 10,
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
  timeText: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
  },
  mealInputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: width * 0.04,
    color: '#333',
    paddingVertical: 12,
  },
  foodDetailsContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  foodDetailsText: {
    fontSize: 16,
    color: '#2E3A59',
    fontWeight: '500',
  },
  calorieCalculation: {
    fontSize: 14,
    color: '#4B6CB7',
    marginTop: 4,
    fontWeight: '600',
  },
  mealButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    borderRadius: 12,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#4B6CB7',
  },
  mealButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#2E3A59',
  },
  activityGradient: {
    padding: '4%',
    borderRadius: 16,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityMetricCard: {
    width: '48%',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '4%',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
  },
  metricValue: {
    fontSize: width * 0.05,
    color: '#2E3A59',
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
    marginBottom: '2%',
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontSize: width * 0.035,
    marginLeft: 4,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
    borderWidth: 1,
    borderColor: 'rgba(74,108,183,0.2)',
  },
  progressCircleText: {
    fontSize: width * 0.035,
    color: '#4B6CB7',
    fontWeight: 'bold',
  },
  activityProgressContainer: {
    marginTop: '4%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: '4%',
    width: '100%',
  },
  activityProgressText: {
    fontSize: width * 0.04,
    color: '#2E3A59',
    marginBottom: '2%',
  },
  fullProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: '2%',
  },
  activityProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  activityProgressPercent: {
    fontSize: width * 0.035,
    color: '#5A6A8C',
  },
  waterCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  waterInfo: {
    flex: 1,
  },
  intakeRow: {
    marginBottom: '4%',
  },
  intakeText: {
    color: '#5A6A8C',
    fontSize: width * 0.04,
  },
  intakeBold: {
    fontSize: width * 0.05,
    color: '#2E3A59',
    fontWeight: 'bold',
  },
  recentSessionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  recentSessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(123, 31, 162, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentSessionDetails: {
    flex: 1,
  },
  recentSessionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
  },
  recentSessionStats: {
    fontSize: 14,
    color: '#5A6A8C',
    marginTop: 4,
  },
  recentSessionTime: {
    fontSize: 12,
    color: '#9AA5B9',
    alignSelf: 'flex-start',
  },
  stepProgressContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: '4%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  stepProgressText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  stepCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  stepGoal: {
    fontSize: 16,
    color: '#5A6A8C',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#4B6CB7',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4B6CB7',
    borderRadius: 24,
    paddingVertical: '2.5%',
    paddingHorizontal: '5%',
    alignSelf: 'flex-start',
    shadowColor: '#1A2980',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  waterBottleContainer: {
    marginLeft: '4%',
    alignItems: 'center',
  },
  waterBottle: {
    width: width * 0.15,
    height: width * 0.25,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F7FB',
    justifyContent: 'flex-end',
  },
  waterFill: {
    backgroundColor: '#4B6CB7',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 20,
    textAlign: 'center',
  },
  skatingTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  skatingTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
    flex: 1,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    color: '#2E3A59',
    fontSize: 16,
    fontWeight: '500',
  },
  pairingModalContainer: {
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
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    // backgroundColor: 'white',
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
  deviceItemConnecting: {
    backgroundColor: '#F0F4FF',
  },
  deviceNameConnecting: {
    color: '#5A6A8C',
  },
  mealModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mealModalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  mealModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E3A59',
    marginBottom: 4,
    textAlign: 'center',
  },
  mealModalSubtitle: {
    fontSize: 14,
    color: '#9AA5B9',
    textAlign: 'center',
    marginBottom: 24,
  },
  mealOptionsContainer: {
    marginBottom: 16,
  },
  mealOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  breakfastOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  lunchOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  snackOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  dinnerOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  mealOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  breakfastIconBg: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  lunchIconBg: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  snackIconBg: {
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
  },
  dinnerIconBg: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  mealOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  mealModalCancelButton: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  mealModalCancelText: {
    color: '#5A6A8C',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 4,
  },
  suggestionsList: {
    padding: 8,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  suggestionCalories: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
});

export default SimpleBLEComponent;

















































