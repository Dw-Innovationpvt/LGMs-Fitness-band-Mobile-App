import { useAuthStore } from '../store/authStore';
import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, Dimensions, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const { width, height } = Dimensions.get('window');

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//     }),
// });

const generateSlots = (startHour, startMin, endHour, endMin) => {
    const slots = [];
    let hour = startHour;
    let minute = startMin;
    while (hour < endHour || (hour === endHour && minute < endMin)) {
        let nextMinute = minute + 30;
        let nextHour = hour;
        if (nextMinute >= 60) {
            nextMinute = 0;
            nextHour++;
        }

        slots.push({
            start: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            end: `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`,
        });

        hour = nextHour;
        minute = nextMinute;
    }
    return slots;
};

const MealTimingScreen = ({ navigation, route }) => {
    const breakfastSlots = generateSlots(7, 0, 10, 0);
    const lunchSlots = generateSlots(12, 0, 15, 0);
    const snackSlots = generateSlots(16, 0, 18, 30);
    const dinnerSlots = generateSlots(19, 0, 22, 0);

    const { loading, error, setupComplete, saveUserData, checkSetupStatus, savePreferences } = useAuthStore();


    const [selectedSlots, setSelectedSlots] = useState({
        breakfast: null,
        lunch: null,
        snack: null,
        dinner: null
    });

    const [expoPushToken, setExpoPushToken] = useState(null);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        checkSetupStatus();
        console.log('Checking setup status...', setupComplete);
        console.warn('69Mealtiming')

    }, []);

    const handleSelect = (meal, slot) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedSlots(prev => ({
            ...prev,
            [meal]: prev[meal] === slot ? null : slot
        }));
    };

    const scheduleMealNotifications = async (slots) => {
        for (const [meal, timeStr] of Object.entries(slots)) {
            if (!timeStr) continue;

            const [hour, minute] = timeStr.split(':').map(Number);

            const now = new Date();
            const target = new Date();
            target.setHours(hour, minute, 0, 0);

            // If the time already passed today, schedule for tomorrow
            if (target <= now) {
                target.setDate(target.getDate() + 1);
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Time to log your ${meal}`,
                    body: `Don't forget to log your ${meal} in the app! 🍽️`,
                },
                trigger: {
                    hour: target.getHours(),
                    minute: target.getMinutes(),
                    repeats: true, // Repeat daily
                }
            });
        }
    };

    const handleSubmit = async () => {
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const userData = {
  ...route.params.bmiData,
  skatePreferences: route.params.skatePreferences,
  mealTimes: selectedSlots
};
        try {
        const result = await savePreferences(userData);
        if (!result.success) {
            Alert.alert('Error', 'Failed to save user data. Please try again.');
            return;
        }
        // if (!expoPushToken) {
        //     Alert.alert('Error', 'Failed to register for notifications. Please enable notifications in settings.');
        //     return;
        // }

        await scheduleMealNotifications(selectedSlots);
        Alert.alert("Notifications Set", "You'll be reminded daily to log your meals!");
    } catch (error) {
        console.error('Error saving user data:', error);
    }
        navigation.replace('Main');
    };

    const isFormComplete = selectedSlots.breakfast && selectedSlots.lunch &&
        selectedSlots.snack && selectedSlots.dinner;

    const MealSection = ({ title, slots, selected, onSelect, icon, color }) => {
        return (
            <View style={styles.mealSectionContainer}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                    style={styles.mealSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.mealHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: color }]}>
                            <MaterialCommunityIcons name={icon} size={20} color="#fff" />
                        </View>
                        <Text style={styles.mealTitle}>{title}</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.slotContainer}
                    >
                        {slots.map((slot, index) => {
                            const isSelected = selected === slot.start;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() => onSelect(slot.start)}
                                >
                                    <LinearGradient
                                        colors={isSelected ?
                                            [color, lightenColor(color, 20)] :
                                            ['rgba(255,255,255,0.9)', 'rgba(245,247,251,0.9)']}
                                        style={[
                                            styles.slotCard,
                                            isSelected && styles.selectedSlotCard,
                                            { borderColor: isSelected ? color : '#E0E0E0' }
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={[
                                            styles.slotText,
                                            isSelected && styles.selectedSlotText
                                        ]}>
                                            {`${slot.start} - ${slot.end}`}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </LinearGradient>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#f9f9ff', '#e6f0ff']}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Meal Time Preferences</Text>
                    <Text style={styles.subtitle}>Select your preferred meal times to personalize your experience</Text>
                </View>

                <MealSection
                    title="Breakfast"
                    slots={breakfastSlots}
                    selected={selectedSlots.breakfast}
                    onSelect={(slot) => handleSelect('breakfast', slot)}
                    icon="weather-sunny"
                    color="#FF9A44"
                />

                <MealSection
                    title="Lunch"
                    slots={lunchSlots}
                    selected={selectedSlots.lunch}
                    onSelect={(slot) => handleSelect('lunch', slot)}
                    icon="food"
                    color="#4CAF50"
                />

                <MealSection
                    title="Snack"
                    slots={snackSlots}
                    selected={selectedSlots.snack}
                    onSelect={(slot) => handleSelect('snack', slot)}
                    icon="food-apple"
                    color="#9C27B0"
                />

                <MealSection
                    title="Dinner"
                    slots={dinnerSlots}
                    selected={selectedSlots.dinner}
                    onSelect={(slot) => handleSelect('dinner', slot)}
                    icon="weather-night"
                    color="#2196F3"
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!isFormComplete}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={isFormComplete ?
                            ['#667EEA', '#764BA2'] :
                            ['#cccccc', '#999999']}
                        style={[
                            styles.submitButton,
                            !isFormComplete && styles.disabledButton
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Complete Setup</Text>
                        <MaterialCommunityIcons
                            name="arrow-right"
                            size={24}
                            color="#fff"
                            style={styles.buttonIcon}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

// Helper to register for notifications
async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            Alert.alert('Permission required', 'Enable notifications to receive meal reminders.');
            return null;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
    } else {
        Alert.alert('Must use physical device');
        return null;
    }
}

// Lighten color function remains same
const lightenColor = (color, percent) => {
    if (color.startsWith('#')) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
    return color;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Roboto-Medium',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        fontFamily: 'Roboto-Regular',
    },
    mealSectionContainer: {
        marginBottom: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    mealSection: {
        borderRadius: 20,
        padding: 20,
        overflow: 'hidden',
    },
    mealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Roboto-Medium',
    },
    slotContainer: {
        paddingBottom: 5,
    },
    slotCard: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 1,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    selectedSlotCard: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    slotText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        fontFamily: 'Roboto-Regular',
    },
    selectedSlotText: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'Roboto-Medium',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 15,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold',
    },
    buttonIcon: {
        marginLeft: 10,
    },
});

export default MealTimingScreen;

