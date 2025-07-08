import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Linking, Alert, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const PrivacyScreen = ({ navigation }) => {
    const [privacySettings, setPrivacySettings] = useState({
        shareWithHealthApps: false,
        analytics: true,
        personalizedAds: false
    });

    const showCustomAlert = (title, message, onConfirm) => {
        Alert.alert(
            title,
            message,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: onConfirm, style: 'default' }
            ],
            { cancelable: false }
        );
    };

    const toggleSwitch = (key) => {
        setPrivacySettings({ ...privacySettings, [key]: !privacySettings[key] });
        Haptics.trigger('impactLight');
    };

    const handleDataExport = () => {
        showCustomAlert('Export Data', 'Your data export request has been submitted.', () => {});
        Haptics.trigger('notificationSuccess');
    };

    const handleDataDelete = () => {
        showCustomAlert(
            'Delete Data',
            'Are you sure you want to delete all your data? This action cannot be undone.',
            () => {
                Haptics.trigger('notificationWarning');
            }
        );
    };

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
                <Text style={styles.headerTitle}>Privacy</Text>
                <View style={{ width: 24 }} />
            </LinearGradient>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Sharing</Text>
                    <View style={styles.optionCard}>
                        <Text style={styles.optionText}>Share with Health Apps</Text>
                        <Switch
                            value={privacySettings.shareWithHealthApps}
                            onValueChange={() => toggleSwitch('shareWithHealthApps')}
                            thumbColor={privacySettings.shareWithHealthApps ? '#4B6CB7' : '#ccc'}
                            trackColor={{ false: '#E0E0E0', true: '#4B6CB7' }}
                            accessible={true}
                            accessibilityLabel="Toggle health app sharing"
                        />
                    </View>
                    <View style={styles.optionCard}>
                        <Text style={styles.optionText}>Analytics</Text>
                        <Switch
                            value={privacySettings.analytics}
                            onValueChange={() => toggleSwitch('analytics')}
                            thumbColor={privacySettings.analytics ? '#4B6CB7' : '#ccc'}
                            trackColor={{ false: '#E0E0E0', true: '#4B6CB7' }}
                            accessible={true}
                            accessibilityLabel="Toggle analytics"
                        />
                    </View>
                    <View style={styles.optionCard}>
                        <Text style={styles.optionText}>Personalized Ads</Text>
                        <Switch
                            value={privacySettings.personalizedAds}
                            onValueChange={() => toggleSwitch('personalizedAds')}
                            thumbColor={privacySettings.personalizedAds ? '#4B6CB7' : '#ccc'}
                            trackColor={{ false: '#E0E0E0', true: '#4B6CB7' }}
                            accessible={true}
                            accessibilityLabel="Toggle personalized ads"
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleDataExport}
                        accessible={true}
                        accessibilityLabel="Export data"
                    >
                        <Text style={styles.optionText}>Export Data</Text>
                        <Feather name="download" size={20} color="#4B6CB7" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionCard, styles.dangerButton]}
                        onPress={handleDataDelete}
                        accessible={true}
                        accessibilityLabel="Delete data"
                    >
                        <Text style={[styles.optionText, { color: '#F44336' }]}>Delete Data</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => Linking.openURL('https://x.ai')}
                        accessible={true}
                        accessibilityLabel="View privacy policy"
                    >
                        <Text style={styles.optionText}>Privacy Policy</Text>
                        <Feather name="external-link" size={20} color="#4B6CB7" />
                    </TouchableOpacity>
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
    dangerButton: { borderColor: '#F44336', borderWidth: 1 },
});

export default PrivacyScreen;