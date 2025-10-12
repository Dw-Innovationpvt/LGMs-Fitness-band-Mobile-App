// ForgotPassword.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    useWindowDimensions
} from 'react-native';
// import { useAuthStore } from '../store/authStore';
// import { useAuthStore } from '../store/authStore'; // Adjust the import based on your store setup
import { useAuthStore } from '../store/authStore';
import { imageURL } from '../constants/api';
const ForgotPassword = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [email, setEmail] = useState('');
    const { isLoading, forgotReq } = useAuthStore();

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        const result = await forgotReq(email);
        if (result.success) {
            Alert.alert("Success", "OTP sent to your email");
            navigation.navigate('OtpScreen', { email });
        } else {
            Alert.alert("Error", result.error || "Failed to send OTP");
        }
    };

    const colors = {
        bg: isDarkMode ? '#000' : '#fff',
        text: isDarkMode ? '#fff' : '#000',
                linkText: '#4DA6FF',
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
                        <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                        <TextInput
                            placeholder="Enter your email address"
                            placeholderTextColor={colors.placeholder}
                            style={[styles.input, { 
                                backgroundColor: colors.bg, 
                                borderColor: colors.inputBorder, 
                                color: colors.text 
                            }]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: colors.buttonBg }]} 
                            onPress={handleForgotPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.buttonText} />
                            ) : (
                                <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                                    Send OTP
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={[styles.switchText, { color: colors.text }]}>
                                Remember your password? <Text style={{ color: colors.linkText }}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default ForgotPassword;