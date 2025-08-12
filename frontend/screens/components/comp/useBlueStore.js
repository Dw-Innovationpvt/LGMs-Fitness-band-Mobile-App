import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { create } from 'zustand';

const bleManager = new BleManager();

export const useBlueStore = create((set, get) => ({
  devices: [],
  isScanning: false,
  hasPermissions: false,
  connectedDevice: null,
  // connectToBlueDevice
    datablue: null,

  // Request permissions
  requestBluetoothPermissions: async () => {
    if (Platform.OS !== 'android') {
      set({ hasPermissions: true });
      return true;
    }

    try {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const permissionsGranted =
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;

        set({ hasPermissions: permissionsGranted });
        return permissionsGranted;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        const permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        set({ hasPermissions: permissionGranted });
        return permissionGranted;
      }
    } catch (err) {
      console.error("Permission error:", err);
      Alert.alert("Permission Error", "Failed to get Bluetooth permissions.");
      set({ hasPermissions: false });
      return false;
    }
  },

  // Check if Bluetooth is powered on
  checkBluetoothEnabled: async () => {
    const state = await bleManager.state();
    return state === 'PoweredOn';
  },

  // Scan for devices
  scanForDevices: async () => {
    const permissions = await get().requestBluetoothPermissions();
    if (!permissions) {
      Alert.alert("Permissions Required", "Bluetooth permissions are needed to scan for devices");
      return;
    }

    const isBluetoothOn = await get().checkBluetoothEnabled();
    if (!isBluetoothOn) {
      Alert.alert("Bluetooth Off", "Please enable Bluetooth to continue");
      return;
    }

    set({ isScanning: true, devices: [] });

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        Alert.alert("Scan Error", error.message || "Unknown error");
        get().stopScan();
        return;
      }

      set((state) => {
        const exists = state.devices.some((d) => d.id === device.id);
        return exists
          ? {}
          : { devices: [...state.devices, device] };
      });
    });

    setTimeout(get().stopScan, 5000);
  },

  // Stop scanning
  stopScan: () => {
    bleManager.stopDeviceScan();
    set({ isScanning: false });
  },

  // Connect to a device
  connectToBlueDevice: async (deviceId) => {
    try {
      const device = await bleManager.connectToBlueDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      set({ connectedDevice: device });
      Alert.alert("Connected", `Connected to ${device.name || device.id}`);
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert("Connection Error", error.message || "Failed to connect");
    }
  },

  // Disconnect from device
  disconnectDevice: async () => {
    const { connectedDevice } = get();
    if (connectedDevice) {
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      set({ connectedDevice: null });
      Alert.alert("Disconnected", "Device disconnected successfully");
    }
  },

  // Cleanup
  cleanup: () => {
    bleManager.destroy();
  }
}));
