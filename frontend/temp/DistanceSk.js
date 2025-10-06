// DistanceSkatingScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
// import { useBLEStore } from "../store/bleStore"; // adjust path
// import { useBLEStore } from "../screens/components/bleStore";
import { useBLEStore } from "../store/augBleStore";

const DistanceSkatingScreen = () => {
  const { data, skatingMode, activateDistanceSkating, stopSkating } = useBLEStore();
  const [isTracking, setIsTracking] = useState(false);

  const distance = data?.skatingDistance ?? 0;
  const strideCount = data?.strideCount ?? 0;
  const laps = data?.laps ?? 0;
  const timestamp = data?.timestamp ?? 0;

  const handleStart = () => {
    activateDistanceSkating(); // switch to distance skating mode
    setIsTracking(true);
  };

  const handleStop = () => {
    stopSkating(); // custom store action you’ll need to add
    setIsTracking(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>⛸ Distance Skating Mode</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Skating Distance</Text>
        <Text style={styles.value}>{distance.toFixed(2)} m</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Stride Count</Text>
        <Text style={styles.value}>{strideCount}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Laps</Text>
        <Text style={styles.value}>{laps}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Timestamp</Text>
        <Text style={styles.value}>{timestamp} ms</Text>
      </View>

      <View style={styles.buttonRow}>
        {!isTracking ? (
          <TouchableOpacity style={[styles.button, styles.startBtn]} onPress={handleStart}>
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopBtn]} onPress={handleStop}>
            <Text style={styles.btnText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DistanceSkatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#161b22",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    color: "#8b949e",
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  startBtn: {
    backgroundColor: "#238636",
  },
  stopBtn: {
    backgroundColor: "#da3633",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
