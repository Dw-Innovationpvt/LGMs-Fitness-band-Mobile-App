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
    useWindowDimensions
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { imageURL } from '../constants/api';


const SignUpScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
        const { user, isLoading, register, token } = useAuthStore();
    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    
  const handleSignUp = async () => {
      const username = fullName.trim();
      console.log(username, "unername");
        console.log(username, email, password, confirmPassword);
        if (password !== confirmPassword) {
          Alert.alert("Passoword & Confirm password", "Passwords do not match");
          return;
        }
        const result = await register(username, email, password);

      // console.log("SignUpScreen: handleSignUp called");
    //   console.log("SignUpScreen: handleSignUp user:", user);
    //     console.log("SignUpScreen: handleSignUp result:", result);
    if (!result.success) Alert.alert("Error", result.error);
    if (result.success) {
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate('SignIn');
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
                keyboardVerticalOffset={-180}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableOpacity
                        style={styles.toggle}
                        onPress={toggleTheme}
                    >
                        <Text style={{ color: colors.text }}>{isDarkMode ? '☀️' : '🌙'}</Text>
                    </TouchableOpacity>

                    <View style={[styles.formContainer, { backgroundColor: colors.formBg }]}>
                        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                        <TextInput
                            placeholder="Enter your full name"
                            placeholderTextColor={colors.placeholder}
                            style={[styles.input, {
                                backgroundColor: colors.bg,
                                borderColor: colors.inputBorder,
                                color: colors.text,
                            }]}
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                        <TextInput
                            placeholder="Enter your email address"
                            placeholderTextColor={colors.placeholder}
                            style={[styles.input, {
                                backgroundColor: colors.bg,
                                borderColor: colors.inputBorder,
                                color: colors.text,
                            }]}
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                        <TextInput
                            placeholder="Enter your password"
                            placeholderTextColor={colors.placeholder}
                            secureTextEntry
                            style={[styles.input, {
                                backgroundColor: colors.bg,
                                borderColor: colors.inputBorder,
                                color: colors.text,
                            }]}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                        <TextInput
                            placeholder="Confirm your password"
                            placeholderTextColor={colors.placeholder}
                            secureTextEntry
                            style={[styles.input, {
                                backgroundColor: colors.bg,
                                borderColor: colors.inputBorder,
                                color: colors.text,
                            }]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity onPress={handleSignUp} style={[styles.button, { backgroundColor: colors.buttonBg }]}>
                            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={[styles.switchText, { color: colors.text }]}>
                                Already have an account? <Text style={{ color: colors.text }}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default SignUpScreen;