import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const colors = {
    bg: isDarkMode ? '#000' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    placeholder: isDarkMode ? '#ddd' : '#555',
    buttonBg: isDarkMode ? '#fff' : '#000',
    buttonText: isDarkMode ? '#000' : '#fff',
    formBg: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    inputBorder: isDarkMode ? '#fff' : '#000',
  };

  return (
    <ImageBackground
      source={require('../assets/88.png')}
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

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonBg }]}>
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
  },
  container: {
    flex: 1,
  },
  toggle: {
    marginTop: 50,
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  formContainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 24,
    marginTop: 'auto',
    paddingTop: 40,
    paddingBottom: 80,
    width: width,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 13,
  },
});
