import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native';

import { imageURL } from '../constants/api';
const SplashScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();

    const styles = StyleSheet.create({
        background: {
            flex: 1,
            width: width,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        overlay: {
            width: '100%',
            paddingBottom: '20%',
            alignItems: 'center',
        },
        button: {
            backgroundColor: '#042c5b',
            paddingVertical: '3.5%',
            paddingHorizontal: '20%',
            borderRadius: 30,
            marginVertical: '2.5%',
            borderWidth: 2,
            borderColor: '#fff',
        },
        buttonText: {
            color: '#fff',
            fontSize: width * 0.045,
            fontWeight: '600',
        },
    });

    

    return (
        <ImageBackground
            // source={imageURL}
            source={require('../assets/88.png')}
            // source={require('../assets/splash-lgm.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default SplashScreen;