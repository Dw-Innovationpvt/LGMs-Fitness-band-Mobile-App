// CaloriesScreen.js
import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
// import { useCaloriesStore } from "../store/caloriesStore";
import { useCaloriesStore } from "../../store/caloriesStore";

export default function CaloriesScreenTemp() {
  const {
    totalCaloriesEaten,
    totalCaloriesBurned,
    mealTarget,
    mealTargetMet,
    mealFlag,
    fetchCaloriesEaten,
    fetchCaloriesBurned,
    fetchMealTargetStatus,
  } = useCaloriesStore();

  useEffect(() => {
    // when screen loads, fetch all data
    fetchCaloriesEaten();
    fetchCaloriesBurned();
    fetchMealTargetStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calories Tracker</Text>

      <Text>Eaten: {totalCaloriesEaten} kcal</Text>
      <Text>Burned: {totalCaloriesBurned} kcal</Text>
      <Text>Target: {mealTarget} kcal</Text>
      <Text>Status: {mealTargetMet ? "✅ Target Met" : "❌ Not Yet"}</Text>
      {mealFlag && <Text>⚠️ Meal Flag Active</Text>}

      <Button title="Refresh" onPress={() => {
        fetchCaloriesEaten();
        fetchCaloriesBurned();
        fetchMealTargetStatus();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
