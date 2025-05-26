import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.heading}>Get Rolling with Us!</Text>
      <TextInput placeholder="Full Name" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 200, height: 200, marginBottom: 30 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#002856', marginBottom: 20 },
  input: { width: '80%', borderWidth: 1, borderColor: '#002856', borderRadius: 10, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#f58220', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  link: { marginTop: 20, color: '#002856' }
});

export default SignUpScreen;
