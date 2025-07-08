import React, { useState, useMemo, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions,
    ImageBackground, Modal, TextInput, Alert, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Haptics from 'expo-haptics';

import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const { checkAuth, user, updateHealtData } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [tempHealthData, setTempHealthData] = useState({
        age: '',
        height: '',
        weight: ''
    });

    const [userData] = useState({
        name: user.username || 'Madan',
        email: user.email || '',
        bio: 'Fitness enthusiast and professional skater',
        stats: {
            workouts: 42,
            challenges: 18,
            streak: 7
        },
        achievements: [
            { id: '1', name: 'Skate Master', icon: 'skate', date: '2023-06-01' },
            { id: '2', name: 'Early Bird', icon: 'weather-sunny', date: '2023-05-15' },
            { id: '3', name: 'Hydration Hero', icon: 'cup-water', date: '2023-04-28' }
        ],
        progress: [
            { day: 'Mon', minutes: 30 },
            { day: 'Tue', minutes: 45 },
            { day: 'Wed', minutes: 0 },
            { day: 'Thu', minutes: 60 },
            { day: 'Fri', minutes: 20 },
            { day: 'Sat', minutes: 90 },
            { day: 'Sun', minutes: 15 }
        ],
        goals: [
            { id: '1', name: 'Lose 5kg', progress: 80, target: 100 },
            { id: '2', name: 'Run 10km weekly', progress: 60, target: 100 }
        ]
    });

    const [healthData, setHealthData] = useState({
        age: user.age || 25,
        height: user.height || 175,
        weight: user?.weight || 68,
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

    const calculateBMI = () => {
        const bmi = (healthData.weight / ((healthData.height / 100) ** 2)).toFixed(1);
        return {
            value: bmi,
            status: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese',
            color: bmi < 18.5 ? '#FFC107' : bmi < 25 ? '#4CAF50' : bmi < 30 ? '#FF9800' : '#F44336'
        };
    };

    const bmi = useMemo(() => calculateBMI(), [healthData]);

    const openHealthModal = () => {
        setTempHealthData({ age: '', height: '', weight: '' });
        setShowHealthModal(true);
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleHealthUpdate = async () => {
        const newAge = tempHealthData.age ? parseInt(tempHealthData.age) : healthData.age;
        const newHeight = tempHealthData.height ? parseInt(tempHealthData.height) : healthData.height;
        const newWeight = tempHealthData.weight ? parseInt(tempHealthData.weight) : healthData.weight;

        if ((tempHealthData.age && (newAge < 10 || newAge > 120)) ||
            (tempHealthData.height && (newHeight < 100 || newHeight > 250)) ||
            (tempHealthData.weight && (newWeight < 30 || newWeight > 300))) {
            showCustomAlert(
                'Invalid Input',
                'Please enter valid values:\nAge: 10-120 years\nHeight: 100-250 cm\nWeight: 30-300 kg',
                () => {}
            );
            return;
        }

        const updatedData = { age: newAge, height: newHeight, weight: newWeight };
        const res =  updateHealtData(updatedData);
        console.log("Health data updated successfully:", res);
        setHealthData(updatedData);
        setShowHealthModal(false);
        await AsyncStorage.setItem('healthData', JSON.stringify(updatedData));
        showCustomAlert('Success', 'Your health data has been updated successfully!', () => {});
        Haptics.trigger('notificationSuccess');
    };

    const handleNavigation = (screen) => {
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate(screen);
    };

    useEffect(() => {
        checkAuth();
        console.log("ProfileScreen Mounted, user=>", user);

    }, []);


    const renderProfileTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.infoCard} accessible={true} accessibilityLabel="User email">
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="email" size={20} color="#4B6CB7" />
                    <Text style={styles.infoText}>{user.email}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.optionCard}
                onPress={openHealthModal}
                accessible={true}
                accessibilityLabel="Update health data"
            >
                <View style={styles.optionContent}>
                    <MaterialCommunityIcons name="human" size={24} color="#4B6CB7" />
                    <Text style={styles.optionText}>Update Health Data</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            {['AccountSettings', 'Notifications', 'Privacy'].map((screen) => (
                <TouchableOpacity
                    key={screen}
                    style={styles.optionCard}
                    onPress={() => handleNavigation(screen)}
                    accessible={true}
                    accessibilityLabel={`${screen} option`}
                >
                    <View style={styles.optionContent}>
                        <MaterialCommunityIcons
                            name={screen === 'AccountSettings' ? 'account' : screen === 'Notifications' ? 'bell' : 'shield'}
                            size={24}
                            color="#4B6CB7"
                        />
                        <Text style={styles.optionText}>{screen.replace(/([A-Z])/g, ' $1').trim()}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>
            ))}
            <View style={[styles.bmiDisplayCard, { borderColor: bmi.color }]}>
                <View style={styles.bmiDisplayHeader}>
                    <MaterialCommunityIcons name="heart-pulse" size={24} color={bmi.color} />
                    <Text style={[styles.bmiDisplayTitle, { color: bmi.color }]}>Your BMI</Text>
                </View>
                <Text style={[styles.bmiDisplayValue, { color: bmi.color }]} accessible={true} accessibilityLabel={`BMI ${bmi.value}, ${bmi.status}`}>
                    {bmi.value} - {bmi.status}
                </Text>
                <Text style={styles.bmiDisplayNote}>
                    {bmi.status === 'Normal' ? 'Great! You have a healthy weight' : 'Consider consulting a health professional'}
                </Text>
            </View>
            <View style={{ marginBottom: 50 }}>

            </View>
        </View>
    );

    const renderAchievementsTab = () => (
        <View style={styles.tabContent}>
            {userData.achievements.length > 0 ? (
                userData.achievements.map(achievement => (
                    <View key={achievement.id} style={styles.achievementCard}>
                        <View style={styles.achievementIcon}>
                            <MaterialCommunityIcons name={achievement.icon} size={28} color="#4B6CB7" />
                        </View>
                        <View style={styles.achievementInfo}>
                            <Text style={styles.achievementTitle}>{achievement.name}</Text>
                            <Text style={styles.achievementDate}>Earned: {achievement.date}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="trophy-outline" size={60} color="#E0E0E0" />
                    <Text style={styles.emptyText}>No achievements yet</Text>
                </View>
            )}
        </View>
    );

    const renderProgressTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Weekly Workout Progress</Text>
                <View style={styles.progressChart}>
                    {userData.progress.map((item, index) => (
                        <View key={index} style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { height: item.minutes * 2 }]} />
                            <Text style={styles.progressLabel}>{item.day}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderGoalsTab = () => (
        <View style={styles.tabContent}>
            {userData.goals.length > 0 ? (
                userData.goals.map(goal => (
                    <View key={goal.id} style={styles.goalCard}>
                        <Text style={styles.goalTitle}>{goal.name}</Text>
                        <View style={styles.goalProgressContainer}>
                            <View style={[styles.goalProgressBar, { width: `${goal.progress}%` }]} />
                            <Text style={styles.goalProgressText}>{goal.progress}%</Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="target" size={60} color="#E0E0E0" />
                    <Text style={styles.emptyText}>No goals set yet</Text>
                </View>
            )}
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
                <TouchableOpacity onPress={() => navigation.navigate('HomeMain')} accessible={true} accessibilityLabel="Go back to home">
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={() => handleNavigation('AccountSettings')} accessible={true} accessibilityLabel="Account settings">
                    <Feather name="settings" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                        <ImageBackground
                            source={require('../assets/bg2.jpg')}
                            style={styles.avatar}
                            imageStyle={styles.avatarImage}
                        >
                            <View style={styles.avatarOverlay} />
                            <Text style={styles.avatarText}>
                                {userData.name.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </ImageBackground>
                    </View>
                    <Text style={styles.userName}>{user?.username}</Text>
                    <Text style={styles.userBio}>{userData.bio}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userData.stats.workouts}</Text>
                        <Text style={styles.statLabel}>Workouts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userData.stats.challenges}</Text>
                        <Text style={styles.statLabel}>Challenges</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userData.stats.streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                </View>
                <View style={styles.tabBar}>
                    {/* {['profile', 'progress', 'goals', 'achievements'].map(tab => ( */}
                    {['profile', 'progress', 'goals', 'records'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                            onPress={() => {
                                setActiveTab(tab);
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            accessible={true}
                            accessibilityLabel={`${tab.charAt(0).toUpperCase() + tab.slice(1)} tab`}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {activeTab === 'profile' ? renderProfileTab() :
                 activeTab === 'progress' ? renderProgressTab() :
                 activeTab === 'goals' ? renderGoalsTab() :
                 renderAchievementsTab()}
            </ScrollView>
            <Modal
                visible={showHealthModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowHealthModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.healthModal}>
                        <Text style={styles.modalTitle}>Update Health Data</Text>
                        <Text style={styles.modalSubtitle}>Leave blank fields to keep current values</Text>
                        {['age', 'height', 'weight'].map(field => (
                            <View key={field} style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)} ({field === 'age' ? 'years' : field === 'height' ? 'cm' : 'kg'})</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={`Current: ${healthData[field]}`}
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={tempHealthData[field]}
                                    onChangeText={(text) => setTempHealthData({ ...tempHealthData, [field]: text })}
                                    maxLength={3}
                                    accessible={true}
                                    accessibilityLabel={`Enter ${field}`}
                                />
                            </View>
                        ))}
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowHealthModal(false)}
                                accessible={true}
                                accessibilityLabel="Cancel health update"
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.updateButton]}
                                onPress={handleHealthUpdate}
                                accessible={true}
                                accessibilityLabel="Update health data"
                            >
                                <Text style={styles.updateButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    scrollContent: { paddingBottom: 40 },
    profileContainer: { alignItems: 'center', marginTop: 20, paddingHorizontal: 20 },
    avatarContainer: { marginBottom: 15 },
    avatar: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    avatarOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(75, 108, 183, 0.4)' },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
    userName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    userBio: { fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 40 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 40, marginTop: 25, marginBottom: 20 },
    statCard: { alignItems: 'center' },
    statNumber: { fontSize: 22, fontWeight: 'bold', color: '#4B6CB7' },
    statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
    tabBar: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#E0E0E0', borderRadius: 12, overflow: 'hidden' },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    activeTabButton: { backgroundColor: '#4B6CB7' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
    activeTabText: { color: '#fff' },
    tabContent: { paddingHorizontal: 20, paddingTop: 20 },
    infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { fontSize: 16, color: '#333', marginLeft: 10 },
    optionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    optionContent: { flexDirection: 'row', alignItems: 'center' },
    optionText: { fontSize: 16, color: '#333', marginLeft: 10 },
    achievementCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    achievementIcon: { backgroundColor: 'rgba(75, 108, 183, 0.1)', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    achievementInfo: { flex: 1 },
    achievementTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    achievementDate: { fontSize: 14, color: '#666', marginTop: 2 },
    emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyText: { fontSize: 18, color: '#666', marginTop: 15 },
    bmiDisplayCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginTop: 15, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    bmiDisplayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    bmiDisplayTitle: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
    bmiDisplayValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    bmiDisplayNote: { fontSize: 14, color: '#666' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    healthModal: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    modalTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 10 },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    inputContainer: { marginBottom: 15 },
    inputLabel: { fontSize: 16, color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    modalButton: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
    cancelButton: { backgroundColor: '#f5f5f5', marginRight: 10 },
    updateButton: { backgroundColor: '#4B6CB7' },
    cancelButtonText: { color: '#333', fontWeight: '600' },
    updateButtonText: { color: '#fff', fontWeight: '600' },
    progressCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginTop: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    progressTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 },
    progressChart: { flexDirection: 'row', justifyContent: 'space-between' },
    progressBarContainer: { alignItems: 'center', width: width / 7 },
    progressBar: { width: 20, backgroundColor: '#4B6CB7', borderRadius: 10 },
    progressLabel: { marginTop: 5, fontSize: 14, color: '#666' },
    goalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
        shadowRadius: 6, elevation: 3 },
    goalTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
    goalProgressContainer: { flexDirection: 'row', alignItems: 'center' },
    goalProgressBar: { height: 10, backgroundColor: '#4B6CB7', borderRadius: 5, flex: 1 },
    goalProgressText: { marginLeft: 10, fontSize: 14, color: '#666' },
});

export default ProfileScreen;

// import React, { useState } from 'react';
// import {
//     View, Text, TouchableOpacity, StyleSheet,
//     ScrollView, Dimensions, ImageBackground
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const ProfileScreen = ({ navigation }) => {
//     const [activeTab, setActiveTab] = useState('profile');
//     const [userData] = useState({
//         name: 'Charan Dusary',
//         email: 'charandusary@gmail.com',
//         bio: 'Fitness enthusiast and professional skater',
//         stats: {
//             workouts: 42,
//             challenges: 18,
//             streak: 7
//         },
//         achievements: [
//             { id: '1', name: 'Skate Master', icon: 'skate', date: '2023-06-01' },
//             { id: '2', name: 'Early Bird', icon: 'weather-sunny', date: '2023-05-15' },
//             { id: '3', name: 'Hydration Hero', icon: 'cup-water', date: '2023-04-28' }
//         ]
//     });

//     const [healthData, setHealthData] = useState({
//         age: 25,
//         height: 175,
//         weight: 68,
//     });

//     const calculateBMI = () => {
//         const bmi = (healthData.weight / ((healthData.height / 100) ** 2)).toFixed(1);
//         return {
//             value: bmi,
//             status: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese',
//             color: bmi < 18.5 ? '#FFC107' : bmi < 25 ? '#4CAF50' : bmi < 30 ? '#FF9800' : '#F44336'
//         };
//     };

//     const bmi = calculateBMI();

//     const handleEditProfile = () => {
//         navigation.navigate('BMI', {
//             onSave: (data) => {
//                 setHealthData({
//                     age: data.age,
//                     height: data.height,
//                     weight: data.weight,
//                 });
//                 navigation.goBack();
//             }
//         });
//     };

//     const renderProfileTab = () => (
//         <View style={styles.tabContent}>
//             <View style={styles.infoCard}>
//                 <View style={styles.infoRow}>
//                     <MaterialCommunityIcons name="email" size={20} color="#4B6CB7" />
//                     <Text style={styles.infoText}>{userData.email}</Text>
//                 </View>
//             </View>

//             <TouchableOpacity 
//                 style={styles.optionCard}
//                 onPress={() => navigation.navigate('AccountSettings')}
//             >
//                 <View style={styles.optionContent}>
//                     <MaterialCommunityIcons name="account" size={24} color="#4B6CB7" />
//                     <Text style={styles.optionText}>Account Settings</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#999" />
//             </TouchableOpacity>

//             <TouchableOpacity 
//                 style={styles.optionCard}
//                 onPress={handleEditProfile}
//             >
//                 <View style={styles.optionContent}>
//                     <MaterialCommunityIcons name="human" size={24} color="#4B6CB7" />
//                     <Text style={styles.optionText}>Edit Health Profile</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#999" />
//             </TouchableOpacity>

//             <TouchableOpacity 
//                 style={styles.optionCard}
//                 onPress={() => navigation.navigate('Notifications')}
//             >
//                 <View style={styles.optionContent}>
//                     <MaterialCommunityIcons name="bell" size={24} color="#4B6CB7" />
//                     <Text style={styles.optionText}>Notifications</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#999" />
//             </TouchableOpacity>

//             <TouchableOpacity 
//                 style={styles.optionCard}
//                 onPress={() => navigation.navigate('Privacy')}
//             >
//                 <View style={styles.optionContent}>
//                     <MaterialCommunityIcons name="shield" size={24} color="#4B6CB7" />
//                     <Text style={styles.optionText}>Privacy</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color="#999" />
//             </TouchableOpacity>
//         </View>
//     );

//     const renderAchievementsTab = () => (
//         <View style={styles.tabContent}>
//             {userData.achievements.length > 0 ? (
//                 userData.achievements.map(achievement => (
//                     <View key={achievement.id} style={styles.achievementCard}>
//                         <View style={styles.achievementIcon}>
//                             <MaterialCommunityIcons 
//                                 name={achievement.icon} 
//                                 size={28} 
//                                 color="#4B6CB7" 
//                             />
//                         </View>
//                         <View style={styles.achievementInfo}>
//                             <Text style={styles.achievementTitle}>{achievement.name}</Text>
//                             <Text style={styles.achievementDate}>Earned: {achievement.date}</Text>
//                         </View>
//                     </View>
//                 ))
//             ) : (
//                 <View style={styles.emptyState}>
//                     <MaterialCommunityIcons 
//                         name="trophy-outline" 
//                         size={60} 
//                         color="#E0E0E0" 
//                     />
//                     <Text style={styles.emptyText}>No achievements yet</Text>
//                 </View>
//             )}
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <LinearGradient
//                 colors={['#4B6CB7', '#182848']}
//                 style={styles.header}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//             >
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Feather name="arrow-left" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Profile</Text>
//                 <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
//                     <Feather name="settings" size={24} color="#fff" />
//                 </TouchableOpacity>
//             </LinearGradient>

//             {/* Profile Info */}
//             <View style={styles.profileContainer}>
//                 <View style={styles.avatarContainer}>
//                     <ImageBackground
//                         source={require('../assets/0.jpg')}
//                         style={styles.avatar}
//                         imageStyle={styles.avatarImage}
//                     >
//                         <View style={styles.avatarOverlay} />
//                         <Text style={styles.avatarText}>
//                             {userData.name.split(' ').map(n => n[0]).join('')}
//                         </Text>
//                     </ImageBackground>
//                 </View>
//                 <Text style={styles.userName}>{userData.name}</Text>
//                 <Text style={styles.userBio}>{userData.bio}</Text>
//             </View>

//             {/* Stats */}
//             <View style={styles.statsContainer}>
//                 <View style={styles.statCard}>
//                     <Text style={styles.statNumber}>{userData.stats.workouts}</Text>
//                     <Text style={styles.statLabel}>Workouts</Text>
//                 </View>
//                 <View style={styles.statCard}>
//                     <Text style={styles.statNumber}>{userData.stats.challenges}</Text>
//                     <Text style={styles.statLabel}>Challenges</Text>
//                 </View>
//                 <View style={styles.statCard}>
//                     <Text style={styles.statNumber}>{userData.stats.streak}</Text>
//                     <Text style={styles.statLabel}>Day Streak</Text>
//                 </View>
//             </View>

//             {/* BMI Card */}
//             <View style={styles.bmiCard}>
//                 <Text style={styles.bmiTitle}>Health Metrics</Text>
                
//                 <View style={styles.bmiGrid}>
//                     <View style={styles.bmiItem}>
//                         <Text style={styles.bmiLabel}>Age</Text>
//                         <Text style={styles.bmiValue}>{healthData.age} yrs</Text>
//                     </View>
//                     <View style={styles.bmiItem}>
//                         <Text style={styles.bmiLabel}>Height</Text>
//                         <Text style={styles.bmiValue}>{healthData.height} cm</Text>
//                     </View>
//                     <View style={styles.bmiItem}>
//                         <Text style={styles.bmiLabel}>Weight</Text>
//                         <Text style={styles.bmiValue}>{healthData.weight} kg</Text>
//                     </View>
//                     <View style={[
//                         styles.bmiItem,
//                         { backgroundColor: bmi.color + '20', borderColor: bmi.color }
//                     ]}>
//                         <Text style={[styles.bmiLabel, { color: bmi.color }]}>BMI</Text>
//                         <Text style={[styles.bmiValue, { color: bmi.color }]}>
//                             {bmi.value} ({bmi.status})
//                         </Text>
//                     </View>
//                 </View>
//             </View>

//             {/* Tabs */}
//             <View style={styles.tabBar}>
//                 <TouchableOpacity
//                     style={[
//                         styles.tabButton,
//                         activeTab === 'profile' && styles.activeTabButton
//                     ]}
//                     onPress={() => setActiveTab('profile')}
//                 >
//                     <Text style={[
//                         styles.tabText,
//                         activeTab === 'profile' && styles.activeTabText
//                     ]}>
//                         Profile
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[
//                         styles.tabButton,
//                         activeTab === 'achievements' && styles.activeTabButton
//                     ]}
//                     onPress={() => setActiveTab('achievements')}
//                 >
//                     <Text style={[
//                         styles.tabText,
//                         activeTab === 'achievements' && styles.activeTabText
//                     ]}>
//                         Achievements
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Tab Content */}
//             <ScrollView style={styles.contentScroll}>
//                 {activeTab === 'profile' ? renderProfileTab() : renderAchievementsTab()}
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F7FB',
//     },
//     header: {
//         paddingTop: 50,
//         paddingHorizontal: 20,
//         paddingBottom: 20,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//         elevation: 8,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#fff',
//     },
//     profileContainer: {
//         alignItems: 'center',
//         marginTop: 20,
//         paddingHorizontal: 20,
//     },
//     avatarContainer: {
//         marginBottom: 15,
//     },
//     avatar: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflow: 'hidden',
//     },
//     avatarImage: {
//         width: '100%',
//         height: '100%',
//     },
//     avatarOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(75, 108, 183, 0.4)',
//     },
//     avatarText: {
//         fontSize: 40,
//         fontWeight: 'bold',
//         color: '#fff',
//     },
//     userName: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 5,
//     },
//     userBio: {
//         fontSize: 16,
//         color: '#666',
//         textAlign: 'center',
//         paddingHorizontal: 40,
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: 40,
//         marginTop: 25,
//         marginBottom: 20,
//     },
//     statCard: {
//         alignItems: 'center',
//     },
//     statNumber: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#4B6CB7',
//     },
//     statLabel: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 5,
//     },
//     bmiCard: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         marginHorizontal: 20,
//         marginBottom: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     bmiTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#4B6CB7',
//         marginBottom: 15,
//     },
//     bmiGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     bmiItem: {
//         width: '48%',
//         backgroundColor: '#F5F7FB',
//         borderRadius: 12,
//         padding: 15,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//     },
//     bmiLabel: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 5,
//     },
//     bmiValue: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//     },
//     tabBar: {
//         flexDirection: 'row',
//         marginHorizontal: 20,
//         backgroundColor: '#E0E0E0',
//         borderRadius: 12,
//         overflow: 'hidden',
//     },
//     tabButton: {
//         flex: 1,
//         paddingVertical: 12,
//         alignItems: 'center',
//     },
//     activeTabButton: {
//         backgroundColor: '#4B6CB7',
//     },
//     tabText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#666',
//     },
//     activeTabText: {
//         color: '#fff',
//     },
//     contentScroll: {
//         flex: 1,
//         paddingHorizontal: 20,
//     },
//     tabContent: {
//         paddingBottom: 40,
//     },
//     infoCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 15,
//         marginBottom: 15,
//     },
//     infoRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     infoText: {
//         fontSize: 16,
//         color: '#333',
//         marginLeft: 10,
//     },
//     optionCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 15,
//         marginBottom: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     optionContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     optionText: {
//         fontSize: 16,
//         color: '#333',
//         marginLeft: 10,
//     },
//     achievementCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 15,
//         marginBottom: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     achievementIcon: {
//         backgroundColor: 'rgba(75, 108, 183, 0.1)',
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 15,
//     },
//     achievementInfo: {
//         flex: 1,
//     },
//     achievementTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//     },
//     achievementDate: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 2,
//     },
//     emptyState: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 40,
//     },
//     emptyText: {
//         fontSize: 18,
//         color: '#666',
//         marginTop: 15,
//     },
// });

// export default ProfileScreen;

// // import React from 'react';
// // import { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   Image,
// //   Dimensions,
// //   Animated
// //   ,useWindowDimensions,
// // } from 'react-native';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// // const { width } = Dimensions.get('window');

// // const ProfileScreen = ({ navigation }) => {
// //     const { width, height } = useWindowDimensions();

// //   const [activeTab, setActiveTab] = useState('personal');
// //   const animation = new Animated.Value(0);

// //   const userData = {
// //     name: 'Charan Dusary',
// //     email: 'charandusary@gmail.com',
// //     bio: 'Fitness enthusiast and professional skater',
// //     stats: {
// //       workouts: 42,
// //       challenges: 18,
// //       streak: 7
// //     },
// //     achievements: [
// //       { id: '1', name: 'Skate Master', icon: 'skate', date: '2023-06-01' },
// //       { id: '2', name: 'Early Bird', icon: 'weather-sunny', date: '2023-05-15' },
// //       { id: '3', name: 'Hydration Hero', icon: 'cup-water', date: '2023-04-28' }
// //     ]
// //   };

// //   const profileOptions = [
// //     { icon: 'account-circle', text: 'Account Settings' },
// //     { icon: 'bell', text: 'Notifications' },
// //     { icon: 'shield', text: 'Privacy' },
// //     { icon: 'help-circle', text: 'Help & Support' },
// //     { icon: 'logout', text: 'Sign Out' }
// //   ];

// //   const animateTabChange = () => {
// //     Animated.spring(animation, {
// //       toValue: 1,
// //       friction: 5,
// //       useNativeDriver: true
// //     }).start(() => animation.setValue(0));
// //   };

// //   const handleTabPress = (tab) => {
// //     setActiveTab(tab);
// //     animateTabChange();
// //   };

// //   const handleSignOut = () => {
// //     // Sign out logic here
// //     navigation.replace('Auth');
// //   };

// //   const renderAchievementBadge = (achievement) => {
// //     return (
// //       <View key={achievement.id} style={styles.achievementBadge}>
// //         <View style={styles.achievementIcon}>
// //           <MaterialCommunityIcons 
// //             name={achievement.icon} 
// //             size={24} 
// //             color="#4B6CB7" 
// //           />
// //         </View>
// //         <View>
// //           <Text style={styles.achievementTitle}>{achievement.name}</Text>
// //           <Text style={styles.achievementDate}>Earned: {achievement.date}</Text>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <LinearGradient
// //         colors={['#4B6CB7', '#182848']}
// //         style={styles.header}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //       >
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Feather name="arrow-left" size={24} color="#fff" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Profile</Text>
// //         <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
// //           <Feather name="settings" size={24} color="#fff" />
// //         </TouchableOpacity>
// //       </LinearGradient>

// //       {/* Profile Header */}
// //       <View style={styles.profileHeader}>
// //         <View style={styles.avatarContainer}>
// //           <View style={styles.avatar}>
// //             <Text style={styles.avatarText}>
// //               {userData.name.split(' ').map(n => n[0]).join('')}
// //             </Text>
// //           </View>
// //         </View>
        
// //         <Text style={styles.userName}>{userData.name}</Text>
// //         <Text style={styles.userEmail}>{userData.email}</Text>
// //         <Text style={styles.userBio}>{userData.bio}</Text>
// //       </View>

// //       {/* Stats */}
// //       <View style={styles.statsContainer}>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statValue}>{userData.stats.workouts}</Text>
// //           <Text style={styles.statLabel}>Workouts</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statValue}>{userData.stats.challenges}</Text>
// //           <Text style={styles.statLabel}>Challenges</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statValue}>{userData.stats.streak}</Text>
// //           <Text style={styles.statLabel}>Day Streak</Text>
// //         </View>
// //       </View>

// //       {/* Tabs */}
// //       <View style={styles.tabContainer}>
// //         <TouchableOpacity 
// //           style={[styles.tabButton, activeTab === 'personal' && styles.activeTabButton]}
// //           onPress={() => handleTabPress('personal')}
// //         >
// //           <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
// //             Personal
// //           </Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity 
// //           style={[styles.tabButton, activeTab === 'achievements' && styles.activeTabButton]}
// //           onPress={() => handleTabPress('achievements')}
// //         >
// //           <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
// //             Achievements
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Content */}
// //       <ScrollView contentContainerStyle={styles.scrollContent}>
// //         {activeTab === 'personal' ? (
// //           <View style={styles.personalContent}>
// //             {profileOptions.map((option, index) => (
// //               <TouchableOpacity 
// //                 key={index} 
// //                 style={styles.optionItem}
// //                 onPress={option.text === 'Sign Out' ? handleSignOut : null}
// //               >
// //                 <MaterialCommunityIcons 
// //                   name={option.icon} 
// //                   size={24} 
// //                   color="#4B6CB7" 
// //                 />
// //                 <Text style={styles.optionText}>{option.text}</Text>
// //                 <Feather name="chevron-right" size={20} color="#999" />
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //         ) : (
// //           <View style={styles.achievementsContent}>
// //             {userData.achievements.length > 0 ? (
// //               userData.achievements.map(renderAchievementBadge)
// //             ) : (
// //               <View style={styles.emptyState}>
// //                 <MaterialCommunityIcons 
// //                   name="trophy-outline" 
// //                   size={60} 
// //                   color="#E0E0E0" 
// //                 />
// //                 <Text style={styles.emptyText}>No achievements yet</Text>
// //                 <Text style={styles.emptySubtext}>
// //                   Complete challenges to earn achievements!
// //                 </Text>
// //               </View>
// //             )}
// //           </View>
// //         )}
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F5F7FB',
// //   },
// //   header: {
// //     paddingTop: Dimensions.get('window').height * 0.06,
// //     paddingHorizontal: '5%',
// //     paddingBottom: '5%',
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     borderBottomLeftRadius: 20,
// //     borderBottomRightRadius: 20,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 8,
// //     elevation: 8,
// //   },
// //   headerTitle: {
// //     fontSize: width * 0.055,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   profileHeader: {
// //     alignItems: 'center',
// //     padding: '5%',
// //     marginTop: '5%',
// //   },
// //   avatarContainer: {
// //     marginBottom: '4%',
// //   },
// //   avatar: {
// //     width: width * 0.3,
// //     height: width * 0.3,
// //     borderRadius: width * 0.15,
// //     backgroundColor: '#4B6CB7',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 3,
// //     borderColor: '#fff',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 6,
// //     elevation: 4,
// //   },
// //   avatarText: {
// //     fontSize: width * 0.1,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   userName: {
// //     fontSize: width * 0.06,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: '1%',
// //   },
// //   userEmail: {
// //     fontSize: width * 0.04,
// //     color: '#666',
// //     marginBottom: '2%',
// //   },
// //   userBio: {
// //     fontSize: width * 0.04,
// //     color: '#4B6CB7',
// //     textAlign: 'center',
// //     paddingHorizontal: '10%',
// //   },
// //   statsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: '10%',
// //     marginTop: '5%',
// //   },
// //   statCard: {
// //     alignItems: 'center',
// //   },
// //   statValue: {
// //     fontSize: width * 0.06,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   statLabel: {
// //     fontSize: width * 0.035,
// //     color: '#666',
// //     marginTop: '1%',
// //   },
// //   tabContainer: {
// //     flexDirection: 'row',
// //     marginHorizontal: '5%',
// //     marginTop: '5%',
// //     backgroundColor: '#E0E0E0',
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //   },
// //   tabButton: {
// //     flex: 1,
// //     paddingVertical: '3%',
// //     alignItems: 'center',
// //   },
// //   activeTabButton: {
// //     backgroundColor: '#4B6CB7',
// //   },
// //   tabText: {
// //     fontSize: width * 0.04,
// //     fontWeight: '600',
// //     color: '#666',
// //   },
// //   activeTabText: {
// //     color: '#fff',
// //   },
// //   scrollContent: {
// //     paddingBottom: '10%',
// //   },
// //   personalContent: {
// //     paddingHorizontal: '5%',
// //     marginTop: '5%',
// //   },
// //   optionItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: '4%',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f0',
// //   },
// //   optionText: {
// //     flex: 1,
// //     fontSize: width * 0.04,
// //     marginLeft: '4%',
// //     color: '#333',
// //   },
// //   achievementsContent: {
// //     paddingHorizontal: '5%',
// //     marginTop: '5%',
// //   },
// //   achievementBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: '4%',
// //     marginBottom: '3%',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   achievementIcon: {
// //     backgroundColor: 'rgba(75, 108, 183, 0.1)',
// //     width: width * 0.12,
// //     height: width * 0.12,
// //     borderRadius: width * 0.06,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: '4%',
// //   },
// //   achievementTitle: {
// //     fontSize: width * 0.04,
// //     fontWeight: '600',
// //     color: '#333',
// //   },
// //   achievementDate: {
// //     fontSize: width * 0.035,
// //     color: '#666',
// //     marginTop: '1%',
// //   },
// //   emptyState: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: '10%',
// //   },
// //   emptyText: {
// //     fontSize: width * 0.045,
// //     color: '#666',
// //     marginTop: '4%',
// //     marginBottom: '2%',
// //   },
// //   emptySubtext: {
// //     fontSize: width * 0.035,
// //     color: '#999',
// //     textAlign: 'center',
// //   },
// // });

// // export default ProfileScreen;