import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
// import { useBleStore } from './useBleStore';
// import { useBLEStore } from '../bleStore';
// import { useBleStore } from './useBlueStore';
import { useBlueStore } from './useBlueStore';

export default function BleScreen() {
  const {
    devices,
    isScanning,
    hasPermissions,
    scanForDevices,
    connectToBlueDevice,
    cleanup
  } = useBlueStore();

  useEffect(() => {
    // return () => cleanup();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        BLE Device Scanner (Zustand)
      </Text>

      <Button
        title={isScanning ? "Scanning..." : "Start Scan"}
        onPress={scanForDevices}
        disabled={isScanning}
      />

      <Text style={{ marginTop: 20 }}>
        {hasPermissions ? "Permissions granted" : "Permissions needed"}
      </Text>

      <ScrollView style={{ marginTop: 20 }}>
        {devices.map((device, index) => (
          <View key={index} style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{device.name || 'Unnamed Device'}</Text>
            <Text>ID: {device.id}</Text>
            <Text>RSSI: {device.rssi}</Text>
            <Button title="Connect" onPress={() => connectToBlueDevice(device.id)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
