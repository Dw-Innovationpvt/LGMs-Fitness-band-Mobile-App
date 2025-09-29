// SkatingScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
// import { useBLEStore } from "../store/bleStore"; // adjust path if needed
// import { useBLEStore } from "./augBleStore";
import { useBLEStore } from "../store/augBleStore";

const SkatingScreen = () => {
  const { data, skatingMode, activateSpeedSkating } = useBLEStore();

  // Activate Speed Skating mode when screen opens
  useEffect(() => {
    if (skatingMode !== "speed") {
      activateSpeedSkating();
    }
  }, [skatingMode]);

  // Extract skating data safely
  const speed = data?.speed ?? 0;
  const distance = data?.skatingDistance ?? 0;
  const strideCount = data?.strideCount ?? 0;
  const laps = data?.laps ?? 0;
  const timestamp = data?.timestamp ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🏒 Speed Skating Mode</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Speed</Text>
          <Text style={styles.value}>{speed.toFixed(2)} m/s</Text>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default SkatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  scrollContainer: {
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
});
