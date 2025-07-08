import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, StyleSheet, RefreshControl } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zustand store for meal data
const useMealStore = create((set) => ({
  meals: [],
  getMeals: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch('http://192.168.1.5:3000/api/meals/get', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch meal data");
      
      // Transform API data to desired format
      const transformedMeals = data.map(meal => ({
        id: meal._id,
        type: meal.mealType,
        items: meal.name,
        calories: meal.calories,
        time: new Date(meal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      
      console.log(transformedMeals, "transformedMeals");
      set({ meals: transformedMeals });
      return { success: true, data: transformedMeals };
    } catch (error) {
      console.error("Error fetching meal data:", error);
      return { success: false, error: error.message };
    }
  },
}));

// Meal item component
const MealItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.mealName}>{item.items}</Text>
      <Text>Calories: {item.calories}</Text>
      <Text>Time: {item.time}</Text>
    </View>
  );
};

// Main MealScreen component
const MealScreen = () => {
  const { meals, getMeals } = useMealStore();
  const [refreshing, setRefreshing] = useState(false);

  // Initial data fetch on mount
  useEffect(() => {
    getMeals();
  }, [getMeals]);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getMeals();
    setRefreshing(false);
    if (!result.success) {
      console.log('Refresh failed:', result.error);
    }
  };

  // Organize meals by type
  const sections = [
    { title: 'Breakfast', data: meals.filter(meal => meal.type === 'Breakfast') },
    { title: 'Lunch', data: meals.filter(meal => meal.type === 'Lunch') },
    { title: 'Snack', data: meals.filter(meal => meal.type === 'Snack') },
    { title: 'Dinner', data: meals.filter(meal => meal.type === 'Dinner') },
  ].filter(section => section.data.length > 0); // Only show sections with data

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Meals</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MealItem item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={<Text>No meals found.</Text>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

// Basic styles (minimal as per request)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginTop: 8,
  },
  itemContainer: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MealScreen;























// import React, { useEffect, useState } from 'react';
// import { View, Text, SectionList, StyleSheet, RefreshControl } from 'react-native';
// import { create } from 'zustand';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Zustand store for meal data
// const useMealStore = create((set) => ({
//   mealData: [],
//   getMeals: async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await fetch('http://192.168.1.5:3000/api/meals/get', {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch meal data");
//       console.log(data, "mealData");
//       set({ mealData: data });
//       return { success: true, data };
//     } catch (error) {
//       console.error("Error fetching meal data:", error);
//       return { success: false, error: error.message };
//     }
//   },
// }));

// // Meal item component
// const MealItem = ({ item }) => {
//   const date = new Date(item.createdAt).toLocaleString();
//   return (
//     <View style={styles.itemContainer}>
//       <Text style={styles.mealName}>{item.name}</Text>
//       <Text>Calories: {item.calories}</Text>
//       <Text>Date: {date}</Text>
//     </View>
//   );
// };

// // Main MealScreen component
// const MealScreen = () => {
//   const { mealData, getMeals } = useMealStore();
//   const [refreshing, setRefreshing] = useState(false);

//   // Initial data fetch on mount
//   useEffect(() => {
//     getMeals();
//   }, [getMeals]);

//   // Refresh handler
//   const onRefresh = async () => {
//     setRefreshing(true);
//     const result = await getMeals();
//     setRefreshing(false);
//     if (!result.success) {
//       console.log('Refresh failed:', result.error);
//     }
//   };

//   // Organize meals by mealType
//   const sections = [
//     { title: 'Breakfast', data: mealData.filter(meal => meal.mealType === 'Breakfast') },
//     { title: 'Lunch', data: mealData.filter(meal => meal.mealType === 'Lunch') },
//     { title: 'Snack', data: mealData.filter(meal => meal.mealType === 'Snack') },
//     { title: 'Dinner', data: mealData.filter(meal => meal.mealType === 'Dinner') },
//   ].filter(section => section.data.length > 0); // Only show sections with data

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Your Meals</Text>
//       <SectionList
//         sections={sections}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => <MealItem item={item} />}
//         renderSectionHeader={({ section: { title } }) => (
//           <Text style={styles.sectionHeader}>{title}</Text>
//         )}
//         ListEmptyComponent={<Text>No meals found.</Text>}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//       />
//     </View>
//   );
// };

// // Basic styles (minimal as per request)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     backgroundColor: '#e0e0e0',
//     padding: 8,
//     marginTop: 8,
//   },
//   itemContainer: {
//     padding: 16,
//     marginBottom: 8,
//     backgroundColor: '#f9f9f9',
//   },
//   mealName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default MealScreen;