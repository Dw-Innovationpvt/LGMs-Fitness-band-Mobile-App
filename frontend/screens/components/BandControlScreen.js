// File: components/BandControlScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import base64 from 'react-native-base64';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcdefab-1234-5678-1234-abcdefabcdef';

const BandControlScreen = ({ device, manager, onDisconnect }) => {
  const [wheelSize, setWheelSize] = useState('90');
  const [lapDistance, setLapDistance] = useState('100');
  const [mode, setMode] = useState('STEP_COUNTING');

  const sendCommandToBand = async (cmd) => {
    try {
      const base64Command = base64.encode(cmd);
      await manager.writeCharacteristicWithResponseForDevice(
        device.id,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      );
      console.log('✅ Sent:', cmd);
    } catch (err) {
      console.log('❌ Error:', err.message);
      Alert.alert('BLE Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control Skating Band</Text>

      <Text>Wheel Size (mm):</Text>
      <TextInput style={styles.input} value={wheelSize} onChangeText={setWheelSize} keyboardType="numeric" />

      <Text>Lap Distance (meters):</Text>
      <TextInput style={styles.input} value={lapDistance} onChangeText={setLapDistance} keyboardType="numeric" />

      <Button
        title="Send Skate Config"
        onPress={() => sendCommandToBand(`SET_CONFIG INLINE ${wheelSize} ${lapDistance}`)}
      />

      <Button
        title="Set Mode: STEP_COUNTING"
        onPress={() => sendCommandToBand('SET_MODE STEP_COUNTING')}
      />
      <Button title="Set Mode: SKATING_SPEED" onPress={() => sendCommandToBand('SET_MODE SKATING_SPEED')} />
      <Button title="Set Mode: SKATING_DISTANCE" onPress={() => sendCommandToBand('SET_MODE SKATING_DISTANCE')} />
      <Button title="Set Mode: SKATING_FREESTYLE" onPress={() => sendCommandToBand('SET_MODE SKATING_FREESTYLE')} />

      <View style={{ height: 10 }} />

      <Button title="Turn Off Band" color="red" onPress={() => sendCommandToBand('TURN_OFF')} />
      <Button title="Disconnect" onPress={onDisconnect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
});

export default BandControlScreen;
