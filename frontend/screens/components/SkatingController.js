import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import useBLEStore from './bleStore';

export default function SkatingController() {
  const {
    devices,
    isScanning,
    connectionStatus,
    data,
    scanDevices,
    connectToDevice,
    sendCommand,
  } = useBLEStore();

  return (
    <View style={{ padding: 20 }}>
      <Text>Status: {connectionStatus}</Text>
      <Button title="Scan" disabled={isScanning} onPress={scanDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => connectToDevice(item)} />
        )}
      />
      <Text>Steps: {data.steps}</Text>
      <Text>Distance: {data.walking_dist}</Text>
      <Button title="Turn On Band" onPress={() => sendCommand('TURN_ON')} />
    </View>
  );
}
