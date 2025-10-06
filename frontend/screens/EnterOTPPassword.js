// EnterOTPPassword.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    useWindowDimensions
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { imageURL } from '../constants/api';

const EnterOTPPassword = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [otp, setOtp] = useState('');
    const { isLoading, verifyOTP } = useAuthStore();

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleVerifyOTP = async () => {
        if (!otp) {
            Alert.alert("Error", "Please enter OTP");
            return;
        }

        const result = await verifyOTP(otp);
        if (result.success) {
            Alert.alert("Success", "OTP verified successfully");
            navigation.navigate('ForgotPassword');
        } else {
            Alert.alert("Error", result.error || "Failed to verify OTP");
        }
    };

    const colors = {
        bg: isDarkMode ? '#000' : '#fff',
        text: isDarkMode ? '#fff' : '#000',
        placeholder: isDarkMode ? '#ddd' : '#555',
        buttonBg: isDarkMode ? '#fff' : '#000',
        buttonText: isDarkMode ? '#000' : '#fff',
        formBg: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
        inputBorder: isDarkMode ? '#fff' : '#000',
    };

    const styles = StyleSheet.create({
        background: {
            flex: 1,
            width: width,
        },
        container: {
            flex: 1,
        },
        toggle: {
            marginTop: height * 0.06,
            marginRight: '5%',
            alignSelf: 'flex-end',
        },
        formContainer: {
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            padding: '6%',
            marginTop: 'auto',
            paddingTop: '10%',
            paddingBottom: '20%',
            width: width,
        },
        label: {
            fontSize: width * 0.035,
            marginBottom: '1.5%',
        },
        input: {
            borderRadius: 25,
            height: width * 0.12,
            paddingHorizontal: '4%',
            fontSize: width * 0.035,
            marginBottom: '2%',
            borderWidth: 1,
        },
        button: {
            paddingVertical: '3.5%',
            borderRadius: 25,
            alignItems: 'center',
            marginTop: '2.5%',
        },
        buttonText: {
            fontSize: width * 0.04,
            fontWeight: '600',
        },
        switchText: {
            marginTop: '5%',
            textAlign: 'center',
            fontSize: width * 0.033,
        },
    });

    return (
        <ImageBackground
            source={require('../assets/88.png')}
            // source={imageURL}
            style={styles.background}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={-150}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableOpacity style={styles.toggle} onPress={toggleTheme}>
                        <Text style={{ color: colors.text }}>{isDarkMode ? '☀️' : '🌙'}</Text>
                    </TouchableOpacity>

                    <View style={[styles.formContainer, { backgroundColor: colors.formBg }]}>
                        <Text style={[styles.label, { color: colors.text }]}>OTP Code</Text>
                        <TextInput
                            placeholder="Enter OTP"
                            placeholderTextColor={colors.placeholder}
                            style={[styles.input, { 
                                backgroundColor: colors.bg, 
                                borderColor: colors.inputBorder, 
                                color: colors.text 
                            }]}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                        />

                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: colors.buttonBg }]} 
                            onPress={handleVerifyOTP}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.buttonText} />
                            ) : (
                                <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                                    Verify OTP
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={[styles.switchText, { color: colors.text }]}>
                                Back to <Text style={{ color: colors.text }}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default EnterOTPPassword;