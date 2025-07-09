import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput,
    Alert, Platform, Modal, Pressable
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const AccountSettingsScreen = ({ navigation }) => {
     const { checkAuth, user, getUserData, changePassword, updateAccountUser } = useAuthStore();
      useEffect(() => {
        //  checkAuth();
        getUserData();
        console.warn('User data:', user, '17-account settings screen');
         console.warn('User data:', user, '17-account settings screen');
     }, []);
    const [userData, setUserData] = useState({
        username: user?.username || 'Madan',
        email: user?.email || 'charandusary@gmail.com',
        bio: user?.bio || 'Professional skater',
//         password: '',
//         language: 'English',
//         units: 'Metric'
    });
    // const [userData, setUserData] = useState({
    //     name: 'Charan Dusary',
    //     email: 'charandusary@gmail.com',
    //     bio: 'Fitness enthusiast and professional skater',
    // });
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');

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

    const handleSave = async () => {
        if (!userData.email.includes('@') || userData.username.length < 3) {
            showCustomAlert('Invalid Input', 'Please enter a valid email and name (minimum 3 characters).', () => {});
            return;
        }
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        const res = updateAccountUser(userData);
        if (res.error) {
            console.warn('error in update account user:', res.error);
            showCustomAlert('Error', 'Failed to update account settings. Please try again.', () => {});
            return;
        }
        navigation.goBack();
        console.log('User data saved:', userData);
        showCustomAlert('Success', 'Account settings updated successfully!', () => {});
        Haptics.trigger('notificationSuccess');
    };

    const handleChangePassword = () => {
        setIsPasswordModalVisible(true);
    };

    const handlePasswordSubmit = () => {
        if (newPassword && newPassword.length >= 6) {
            const res = changePassword(newPassword);
            if (res.error) {
                console.warn('error in change password:', res.error);   
            }
            else{

                showCustomAlert('Success', 'Password changed successfully!', () => {});
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setIsPasswordModalVisible(false);
                setNewPassword('');
            }
        } else {
            showCustomAlert('Invalid Password', 'Password must be at least 6 characters.', () => {});
        }
    };

    const handleDeleteAccount = () => {
        showCustomAlert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            async () => {
                await AsyncStorage.removeItem('userData');
                await AsyncStorage.removeItem('healthData');
                navigation.navigate('Home'); // Adjust to your app's entry screen
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
                <Text style={styles.headerTitle}>Account Settings</Text>
                <View style={{ width: 24 }} />
            </LinearGradient>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Information</Text>
                    {['username', 'email', 'bio'].map(field => (
                        <View key={field} style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            <TextInput
                                style={styles.input}
                                value={userData[field]}
                                onChangeText={(text) => setUserData({ ...userData, [field]: text })}
                                placeholder={`Enter ${field}`}
                                placeholderTextColor="#999"
                                keyboardType={field === 'email' ? 'email-address' : 'default'}
                                multiline={field === 'bio'}
                                numberOfLines={field === 'bio' ? 3 : 1}
                                accessible={true}
                                accessibilityLabel={`Enter ${field}`}
                            />
                        </View>
                    ))}
                                    <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    accessible={true}
                    accessibilityLabel="Save account settings"
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    <TouchableOpacity
                        style={[styles.optionCard]}
                        onPress={handleChangePassword}
                        accessible={true}
                        accessibilityLabel="Change password"
                    >
                        <Text style={styles.optionText}>Change Password</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4B6CB7" />
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Management</Text>
                    <TouchableOpacity
                        style={[styles.optionCard, styles.dangerButton]}
                        onPress={handleDeleteAccount}
                        accessible={true}
                        accessibilityLabel="Delete account"
                    >
                        <Text style={[styles.optionText, { color: '#F44336' }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Password Change Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPasswordModalVisible}
                onRequestClose={() => {
                    setIsPasswordModalVisible(!isPasswordModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <Text style={styles.modalText}>Enter your new password (minimum 6 characters):</Text>
                        <TextInput
                            style={styles.modalInput}
                            onChangeText={setNewPassword}
                            value={newPassword}
                            placeholder="New password"
                            placeholderTextColor="#999"
                            secureTextEntry={true}
                            autoFocus={true}
                        />
                        <View style={styles.modalButtonContainer}>
                            <Pressable
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setIsPasswordModalVisible(false);
                                    setNewPassword('');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handlePasswordSubmit}
                            >
                                <Text style={styles.modalButtonText}>Submit</Text>
                            </Pressable>
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
    scrollContent: { padding: 20, paddingBottom: 40 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
    inputContainer: { marginBottom: 15 },
    inputLabel: { fontSize: 16, color: '#333', marginBottom: 8 },
    input: { 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        padding: 15, 
        fontSize: 16, 
        borderWidth: 1, 
        borderColor: '#E0E0E0' 
    },
    optionCard: { 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        padding: 15, 
        marginBottom: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 6, 
        elevation: 3 
    },
    optionText: { fontSize: 16, color: '#333' },
    optionValue: { fontSize: 16, color: '#4B6CB7' },
    dangerButton: { borderColor: '#F44336', borderWidth: 1 },
    saveButton: { 
        backgroundColor: '#4B6CB7', 
        borderRadius: 10, 
        padding: 15, 
        alignItems: 'center', 
        marginTop: 20 
    },
    saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    // Modal styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontSize: 16,
        color: '#555',
    },
    modalInput: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        minWidth: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
    },
    submitButton: {
        backgroundColor: '#4B6CB7',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AccountSettingsScreen;

// import React, { useState } from 'react';
// import {
//     View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput,
//     Alert, Platform
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Haptics from 'expo-haptics';

// const AccountSettingsScreen = ({ navigation }) => {
//     const [userData, setUserData] = useState({
//         name: 'Charan Dusary',
//         email: 'charandusary@gmail.com',
//         bio: 'Fitness enthusiast and professional skater',
//     });

//     const showCustomAlert = (title, message, onConfirm) => {
//         Alert.alert(
//             title,
//             message,
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 { text: 'OK', onPress: onConfirm, style: 'default' }
//             ],
//             { cancelable: false }
//         );
//     };

//     const handleSave = async () => {
//         if (!userData.email.includes('@') || userData.name.length < 3) {
//             showCustomAlert('Invalid Input', 'Please enter a valid email and name (minimum 3 characters).', () => {});
//             return;
//         }
//         await AsyncStorage.setItem('userData', JSON.stringify(userData));
//         showCustomAlert('Success', 'Account settings updated successfully!', () => {});
//         Haptics.trigger('notificationSuccess');
//     };

//     const handleChangePassword = () => {
//         Alert.prompt(
//             'Change Password',
//             'Enter your new password (minimum 6 characters):',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 { 
//                     text: 'Submit', 
//                     onPress: (password) => {
//                         if (password && password.length >= 6) {
//                             showCustomAlert('Success', 'Password changed successfully!', () => {});
//                             Haptics.trigger('notificationSuccess');
//                         } else {
//                             showCustomAlert('Invalid Password', 'Password must be at least 6 characters.', () => {});
//                         }
//                     } 
//                 }
//             ],
//             'secure-text'
//         );
//     };

//     const handleDeleteAccount = () => {
//         showCustomAlert(
//             'Delete Account',
//             'Are you sure you want to delete your account? This action cannot be undone.',
//             async () => {
//                 await AsyncStorage.removeItem('userData');
//                 await AsyncStorage.removeItem('healthData');
//                 navigation.navigate('Home'); // Adjust to your app's entry screen
//                 Haptics.trigger('notificationWarning');
//             }
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <LinearGradient
//                 colors={['#4B6CB7', '#182848']}
//                 style={styles.header}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//             >
//                 <TouchableOpacity onPress={() => navigation.goBack()} accessible={true} accessibilityLabel="Go back">
//                     <Feather name="arrow-left" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Account Settings</Text>
//                 <View style={{ width: 24 }} />
//             </LinearGradient>
//             <ScrollView
//                 style={styles.scrollContainer}
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Profile Information</Text>
//                     {['name', 'email', 'bio'].map(field => (
//                         <View key={field} style={styles.inputContainer}>
//                             <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
//                             <TextInput
//                                 style={styles.input}
//                                 value={userData[field]}
//                                 onChangeText={(text) => setUserData({ ...userData, [field]: text })}
//                                 placeholder={`Enter ${field}`}
//                                 placeholderTextColor="#999"
//                                 keyboardType={field === 'email' ? 'email-address' : 'default'}
//                                 multiline={field === 'bio'}
//                                 numberOfLines={field === 'bio' ? 3 : 1}
//                                 accessible={true}
//                                 accessibilityLabel={`Enter ${field}`}
//                             />
//                         </View>
//                     ))}
//                 </View>
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Security</Text>
//                     <TouchableOpacity
//                         style={[styles.optionCard]}
//                         onPress={handleChangePassword}
//                         accessible={true}
//                         accessibilityLabel="Change password"
//                     >
//                         <Text style={styles.optionText}>Change Password</Text>
//                         <MaterialCommunityIcons name="chevron-right" size={24} color="#4B6CB7" />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Account Management</Text>
//                     <TouchableOpacity
//                         style={[styles.optionCard, styles.dangerButton]}
//                         onPress={handleDeleteAccount}
//                         accessible={true}
//                         accessibilityLabel="Delete account"
//                     >
//                         <Text style={[styles.optionText, { color: '#F44336' }]}>Delete Account</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableOpacity
//                     style={styles.saveButton}
//                     onPress={handleSave}
//                     accessible={true}
//                     accessibilityLabel="Save account settings"
//                 >
//                     <Text style={styles.saveButtonText}>Save Changes</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F5F7FB' },
//     header: {
//         paddingTop: Platform.OS === 'ios' ? 50 : 30,
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
//     headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
//     scrollContainer: { flex: 1 },
//     scrollContent: { padding: 20, paddingBottom: 40 },
//     section: { marginBottom: 20 },
//     sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
//     inputContainer: { marginBottom: 15 },
//     inputLabel: { fontSize: 16, color: '#333', marginBottom: 8 },
//     input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
//     optionCard: { 
//         backgroundColor: '#fff', 
//         borderRadius: 12, 
//         padding: 15, 
//         marginBottom: 10, 
//         flexDirection: 'row', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         shadowColor: '#000', 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 6, 
//         elevation: 3 
//     },
//     optionText: { fontSize: 16, color: '#333' },
//     optionValue: { fontSize: 16, color: '#4B6CB7' },
//     dangerButton: { borderColor: '#F44336', borderWidth: 1 },
//     saveButton: { backgroundColor: '#4B6CB7', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 20 },
//     saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
// });

// export default AccountSettingsScreen;


// import React, { useEffect, useState } from 'react';
// import {
//     View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput,
//     Alert, Platform
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Haptics from 'expo-haptics';
// import { useAuthStore } from '../store/authStore';


// const AccountSettingsScreen = ({ navigation }) => {
//     const { checkAuth, user } = useAuthStore();
//     useEffect(() => {
//         checkAuth();
//         // console.log('User data:', user, '17-account settings screen');
//     }, []);
//     const [userData, setUserData] = useState({
//         name: user?.username || 'Charan Dussary',
//         email: user?.email || 'charandusary@gmail.com',
//         bio: 'Fitness enthusiast and professional skater',
//         password: '',
//         language: 'English',
//         units: 'Metric'
//     });

//     const showCustomAlert = (title, message, onConfirm) => {
//         Alert.alert(
//             title,
//             message,
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 { text: 'OK', onPress: onConfirm, style: 'default' }
//             ],
//             { cancelable: false }
//         );
//     };

//     const handleSave = async () => {
//         console.log('iInside of handel sve of account setigngs');

//         // if (!userData.email.includes('@') || userData.name.length < 3) {
//         //     showCustomAlert('Invalid Input', 'Please enter a valid email and name (minimum 3 characters).', () => {});
//         //     return;
//         // }
//         // if (userData.password && userData.password.length < 6) {
//         //     showCustomAlert('Invalid Password', 'Password must be at least 6 characters.', () => {});
//         //     return;
//         // }
//         // await AsyncStorage.setItem('userData', JSON.stringify(userData));
//         // showCustomAlert('Success', 'Account settings updated successfully!', () => {});
//         // Haptics.trigger('notificationSuccess');
//         console.log('User data saved:', userData);
//     };

//     const handleDeleteAccount = () => {
//         showCustomAlert(
//             'Delete Account',
//             'Are you sure you want to delete your account? This action cannot be undone.',
//             async () => {
//                 await AsyncStorage.removeItem('userData');
//                 await AsyncStorage.removeItem('healthData');
//                 navigation.navigate('Home'); // Adjust to your app's entry screen
//                 Haptics.trigger('notificationWarning');
//             }
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <LinearGradient
//                 colors={['#4B6CB7', '#182848']}
//                 style={styles.header}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//             >
//                 <TouchableOpacity onPress={() => navigation.goBack()} accessible={true} accessibilityLabel="Go back">
//                     <Feather name="arrow-left" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Account Settings</Text>
//                 <View style={{ width: 24 }} />
//             </LinearGradient>
//             <ScrollView
//                 style={styles.scrollContainer}
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Profile Information</Text>
//                     {['name', 'email', 'bio'].map(field => (
//                         <View key={field} style={styles.inputContainer}>
//                             <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
//                             <TextInput
//                                 style={styles.input}
//                                 value={userData[field]}
//                                 onChangeText={(text) => setUserData({ ...userData, [field]: text })}
//                                 placeholder={`Enter ${field}`}
//                                 placeholderTextColor="#999"
//                                 keyboardType={field === 'email' ? 'email-address' : 'default'}
//                                 multiline={field === 'bio'}
//                                 numberOfLines={field === 'bio' ? 3 : 1}
//                                 accessible={true}
//                                 accessibilityLabel={`Enter ${field}`}
//                             />
//                         </View>
//                     ))}
//                     <View style={styles.inputContainer}>
//                         <Text style={styles.inputLabel}>New Password</Text>
//                         <TextInput
//                             style={styles.input}
//                             value={userData.password}
//                             onChangeText={(text) => setUserData({ ...userData, password: text })}
//                             placeholder="Enter new password"
//                             placeholderTextColor="#999"
//                             secureTextEntry
//                             accessible={true}
//                             accessibilityLabel="Enter new password"
//                         />
//                     </View>
//                 </View>
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Preferences</Text>
//                     <View style={styles.optionCard}>
//                         <Text style={styles.optionText}>Language</Text>
//                         <TouchableOpacity
//                             onPress={() => {
//                                 // Placeholder for language picker
//                                 setUserData({ ...userData, language: userData.language === 'English' ? 'Spanish' : 'English' });
//                                 Haptics.trigger('impactLight');
//                             }}
//                             accessible={true}
//                             accessibilityLabel="Select language"
//                         >
//                             <Text style={styles.optionValue}>{userData.language}</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.optionCard}>
//                         <Text style={styles.optionText}>Units</Text>
//                         <TouchableOpacity
//                             onPress={() => {
//                                 setUserData({ ...userData, units: userData.units === 'Metric' ? 'Imperial' : 'Metric' });
//                                 Haptics.trigger('impactLight');
//                             }}
//                             accessible={true}
//                             accessibilityLabel="Select units"
//                         >
//                             <Text style={styles.optionValue}>{userData.units}</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Account Management</Text>
//                                         <TouchableOpacity
//                         style={[styles.optionCard, styles.dangerButton]}
//                         onPress={handleDeleteAccount}
//                         accessible={true}
//                         accessibilityLabel="Delete account"
//                     >
//                         <Text style={[styles.optionText, { color: '#F44336' }]}>Logout</Text>
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity
//                         style={[styles.optionCard, styles.dangerButton]}
//                         onPress={handleDeleteAccount}
//                         accessible={true}
//                         accessibilityLabel="Delete account"
//                     >
//                         <Text style={[styles.optionText, { color: '#F44336' }]}>Delete Account</Text>
//                     </TouchableOpacity>

//                 </View>
//                 <TouchableOpacity
//                     style={styles.saveButton}
//                     onPress={handleSave}
//                     accessible={true}
//                     accessibilityLabel="Save account settings"
//                 >
//                     <Text style={styles.saveButtonText}>Save Changes</Text>
//                 </TouchableOpacity>
//                 <View style={{ height: 90 }} />

//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F5F7FB' },
//     header: {
//         paddingTop: Platform.OS === 'ios' ? 50 : 30,
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
//     headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
//     scrollContainer: { flex: 1 },
//     scrollContent: { padding: 20, paddingBottom: 40 },
//     section: { marginBottom: 20 },
//     sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
//     inputContainer: { marginBottom: 15 },
//     inputLabel: { fontSize: 16, color: '#333', marginBottom: 8 },
//     input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
//     optionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
//     optionText: { fontSize: 16, color: '#333' },
//     optionValue: { fontSize: 16, color: '#4B6CB7' },
//     dangerButton: { borderColor: '#F44336', borderWidth: 1 },
//     saveButton: { backgroundColor: '#4B6CB7', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 20 },
//     saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
// });

// export default AccountSettingsScreen;