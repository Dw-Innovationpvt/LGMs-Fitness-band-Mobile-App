// BleManager.js

import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Platform, PermissionsAndroid } from 'react-native';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

class BLEService {
  constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.monitorSubscription = null;
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return Object.values(granted).every(val => val === PermissionsAndroid.RESULTS.GRANTED);
    }
    return true;
  }

  startDeviceScan(onDeviceFound, onError) {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('❌ Scan error:', error);
        console.log('33, BLEManager');
        onError(error);
        return;
      }

      if (device && device.name && device.name.includes('SkatingBand')) {
        console.log('✅ Found device:', device.name);
        this.manager.stopDeviceScan();
        onDeviceFound(device);
      }
    });
  }

  stopDeviceScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(device, onData, onStatus) {
    try {
      onStatus('🔌 Connecting...');
      const connectedDevice = await device.connect();
      onStatus('🔍 Discovering services...');
      this.device = await connectedDevice.discoverAllServicesAndCharacteristics();

      this.monitorCharacteristic(onData, onStatus);
    } catch (error) {
      console.log('❌ Connection error:', error);
      onStatus('⚠️ Connection failed');
    }
  }

  monitorCharacteristic(onData, onStatus) {
    if (!this.device) {
      onStatus('❌ No device connected');
      return;
    }

    this.monitorSubscription = this.device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.log('❌ Monitor error:', error);
          onStatus('⚠️ Monitor failed');
          return;
        }

        const base64Value = characteristic?.value;
        if (base64Value) {
          try {
            const decoded = Buffer.from(base64Value, 'base64').toString('utf-8');
            console.log('📥 Received:', decoded);
            const data = JSON.parse(decoded);
            onData(data);
          } catch (e) {
            console.log('❌ JSON Parse Error:', e.message);
          }
        }
      }
    );
  }

  async sendCommand(command) {
    if (!this.device) {
      console.log('❌ No connected device to send command');
      return;
    }

    try {
      const base64Command = Buffer.from(command).toString('base64');
      await this.device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      );
      console.log('📤 Sent command:', command);
    } catch (error) {
      console.log('❌ Send command error:', error);
    }
  }

  async disconnect() {
    if (this.monitorSubscription) {
      this.monitorSubscription.remove();
      this.monitorSubscription = null;
    }

    if (this.device) {
      try {
        await this.device.cancelConnection();
        console.log('🔌 Disconnected');
      } catch (e) {
        console.log('❌ Error while disconnecting:', e);
      }
      this.device = null;
    }
  }

  destroy() {
    this.disconnect();
    this.manager.destroy();
    console.log('🧹 BLE Manager destroyed');
  }
}

export default new BLEService();
