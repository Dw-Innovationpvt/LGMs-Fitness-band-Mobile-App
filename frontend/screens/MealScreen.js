import React from 'react';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    useWindowDimensions
} from 'react-native';

const MealScreen = () => {
    const { width, height } = useWindowDimensions();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Dummy meal data
    const mealData = {
        '2023-11-01': {
            meals: [
                { name: 'Oatmeal', calories: 300, carbs: 50, protein: 10, fats: 5 },
                { name: 'Chicken Salad', calories: 450, carbs: 20, protein: 35, fats: 25 },
                { name: 'Protein Shake', calories: 250, carbs: 15, protein: 30, fats: 5 }
            ],
            totals: { calories: 1000, carbs: 85, protein: 75, fats: 35 }
        },
        '2023-11-02': {
            meals: [
                { name: 'Scrambled Eggs', calories: 350, carbs: 5, protein: 25, fats: 25 },
                { name: 'Grilled Salmon', calories: 500, carbs: 10, protein: 40, fats: 30 },
                { name: 'Greek Yogurt', calories: 150, carbs: 10, protein: 15, fats: 5 }
            ],
            totals: { calories: 1000, carbs: 25, protein: 80, fats: 60 }
        },
        [selectedDate]: {
            meals: [
                { name: 'Avocado Toast', calories: 400, carbs: 45, protein: 10, fats: 20 },
                { name: 'Turkey Sandwich', calories: 550, carbs: 40, protein: 35, fats: 25 },
                { name: 'Mixed Nuts', calories: 200, carbs: 10, protein: 5, fats: 15 }
            ],
            totals: { calories: 1150, carbs: 95, protein: 50, fats: 60 }
        }
    };

    const dailyData = mealData[selectedDate] || { meals: [], totals: { calories: 0, carbs: 0, protein: 0, fats: 0 } };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f7f7f7',
        },
        scrollContainer: {
            padding: 16,
            paddingBottom: 80,
        },
        calendarContainer: {
            backgroundColor: 'white',
            borderRadius: 10,
            marginBottom: 16,
            elevation: 3,
            overflow: 'hidden',
        },
        summaryContainer: {
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 16,
            marginBottom: 16,
            elevation: 3,
        },
        summaryTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12,
            color: '#333',
        },
        macrosRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        macroCard: {
            alignItems: 'center',
            padding: 8,
            borderRadius: 8,
            backgroundColor: '#f0f0f0',
            width: '23%',
        },
        macroValue: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#4a90e2',
        },
        macroLabel: {
            fontSize: 12,
            color: '#666',
            marginTop: 4,
        },
        mealsContainer: {
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 16,
            elevation: 3,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12,
            color: '#333',
        },
        mealCard: {
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        mealName: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 6,
            color: '#444',
        },
        mealMacros: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        mealMacroText: {
            fontSize: 14,
            color: '#666',
        },
        noMealsText: {
            textAlign: 'center',
            color: '#999',
            marginVertical: 16,
        },
        addButton: {
            backgroundColor: '#4a90e2',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 14,
            borderRadius: 10,
            marginTop: 16,
            elevation: 3,
        },
        addButtonText: {
            color: 'white',
            fontWeight: 'bold',
            marginLeft: 8,
            fontSize: 16,
        },
    });

    return (
        <LinearGradient colors={['#f7f7f7', '#e8e8e8']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.calendarContainer}>
                    <Calendar
                        current={selectedDate}
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: '#4a90e2' }
                        }}
                        theme={{
                            selectedDayBackgroundColor: '#4a90e2',
                            todayTextColor: '#4a90e2',
                            arrowColor: '#4a90e2',
                        }}
                    />
                </View>

                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Nutrition Summary for {selectedDate}</Text>
                    <View style={styles.macrosRow}>
                        <View style={styles.macroCard}>
                            <Text style={styles.macroValue}>{dailyData.totals.calories}</Text>
                            <Text style={styles.macroLabel}>Calories</Text>
                        </View>
                        <View style={styles.macroCard}>
                            <Text style={styles.macroValue}>{dailyData.totals.carbs}g</Text>
                            <Text style={styles.macroLabel}>Carbs</Text>
                        </View>
                        <View style={styles.macroCard}>
                            <Text style={styles.macroValue}>{dailyData.totals.protein}g</Text>
                            <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <View style={styles.macroCard}>
                            <Text style={styles.macroValue}>{dailyData.totals.fats}g</Text>
                            <Text style={styles.macroLabel}>Fats</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.mealsContainer}>
                    <Text style={styles.sectionTitle}>Meals</Text>
                    {dailyData.meals.length > 0 ? (
                        <FlatList
                            data={dailyData.meals}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.mealCard}>
                                    <Text style={styles.mealName}>{item.name}</Text>
                                    <View style={styles.mealMacros}>
                                        <Text style={styles.mealMacroText}>{item.calories} cal</Text>
                                        <Text style={styles.mealMacroText}>{item.carbs}g C</Text>
                                        <Text style={styles.mealMacroText}>{item.protein}g P</Text>
                                        <Text style={styles.mealMacroText}>{item.fats}g F</Text>
                                    </View>
                                </View>
                            )}
                        />
                    ) : (
                        <Text style={styles.noMealsText}>No meals recorded for this day</Text>
                    )}
                </View>

                <TouchableOpacity style={styles.addButton}>
                    <MaterialCommunityIcons name="plus" size={24} color="white" />
                    <Text style={styles.addButtonText}>Add Meal</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default MealScreen;