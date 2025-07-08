import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, FlatList, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const NotificationsScreen = ({ navigation }) => {
    const [notificationSettings, setNotificationSettings] = useState({
        push: true,
        email: false,
        reminders: true
    });

    const notificationHistory = [
        { id: '1', message: 'Achievement Unlocked: Skate Master', date: '2023-06-01' },
        { id: '2', message: 'Workout Reminder: Morning Yoga', date: '2023-06-02' }
    ];

    const toggleSwitch = (key) => {
        setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
        Haptics.trigger('impactLight');
    };

    const renderNotification = ({ item }) => (
        <View style={styles.notificationCard}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#4B6CB7" />
            <View style={styles.notificationInfo}>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationDate}>{item.date}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#4B6CB7', '#182848']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} accessible={true} accessibilityLabel="Go back">
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </LinearGradient>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notification Preferences</Text>
                    <View style={styles.optionCard}>
                        <Text style={styles.optionText}>Push Notifications</Text>
                        <Switch
                            value={notificationSettings.push}
                            onValueChange={() => toggleSwitch('push')}
                            thumbColor={notificationSettings.push ? '#4B6CB7' : '#ccc'}
                            trackColor={{ false: '#E0E0E0', true: '#4B6CB7' }}
                            accessible={true}
                            accessibilityLabel="Toggle push notifications"
                        />
                    </View>
                    <View style={styles.optionCard}>
                        <Text style={styles.optionText}>Email Notifications</Text>
                        <Switch
                            value={notificationSettings.email}
                            onValueChange={() => toggleSwitch('email')}
                            thumbColor={notificationSettings.email ? '#4B6CB7' : '#ccc'}
                            trackColor={{ false: '#E0E0E0', true: '#4B6CB7' }}
                            accessible={true}
                            accessibilityLabel="Toggle email notifications"
                        />
                    </View>
                    <View style={styles.optionCard}>
                        <Text style={styles.optionText}>Workout Reminders</Text>
                        <Switch
                            value={notificationSettings.reminders}
                            onValueChange={() => toggleSwitch('reminders')}
                            thumbColor={notificationSettings.reminders ? '#4B6CB7' : '#ccc'}
                            trackColor={{ false: '#E0E0E0', true: '#4B6CB7' }}
                            accessible={true}
                            accessibilityLabel="Toggle workout reminders"
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notification History</Text>
                    <FlatList
                        data={notificationHistory}
                        renderItem={renderNotification}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons name="bell-off-outline" size={60} color="#E0E0E0" />
                                <Text style={styles.emptyText}>No notifications yet</Text>
                            </View>
                        }
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FB' },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
    scrollContainer: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
    optionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    optionText: { fontSize: 16, color: '#333' },
    notificationCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    notificationInfo: { flex: 1, marginLeft: 10 },
    notificationMessage: { fontSize: 16, color: '#333' },
    notificationDate: { fontSize: 14, color: '#666', marginTop: 2 },
    emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyText: { fontSize: 18, color: '#666', marginTop: 15 },
});

export default NotificationsScreen;