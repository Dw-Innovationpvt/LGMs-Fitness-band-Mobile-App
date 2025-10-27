// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native';

// import { imageURL } from '../constants/api';
// const SplashScreen = ({ navigation }) => {
//     const { width, height } = useWindowDimensions();

//     const styles = StyleSheet.create({
//         background: {
//             flex: 1,
//             width: width,
//             justifyContent: 'flex-end',
//             alignItems: 'center',
//         },
//         overlay: {
//             width: '100%',
//             paddingBottom: '20%',
//             alignItems: 'center',
//         },
//         button: {
//             backgroundColor: '#042c5b',
//             paddingVertical: '3.5%',
//             paddingHorizontal: '20%',
//             borderRadius: 30,
//             marginVertical: '2.5%',
//             borderWidth: 2,
//             borderColor: '#fff',
//         },
//         buttonText: {
//             color: '#fff',
//             fontSize: width * 0.045,
//             fontWeight: '600',
//         },
//     });

    

//     return (
//         <ImageBackground
//             // source={imageURL}
//             source={require('../assets/88.png')}
//             // source={require('../assets/splash-lgm.png')}
//             style={styles.background}
//             resizeMode="cover"
//         >
//             <View style={styles.overlay}>
//                 <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
//                     <Text style={styles.buttonText}>Sign In</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
//                     <Text style={styles.buttonText}>Sign Up</Text>
//                 </TouchableOpacity>
//             </View>
//         </ImageBackground>
//     );
// };

// export default SplashScreen;



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { imageURL } from '../constants/api';

const SplashScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const [isToken, setToken] = useState(false);
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

    // Function to check if user is authenticated
    const checkAuthentication = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setToken(true)
                // Token exists, navigate to home screen
                navigation.replace('Main'); // Use replace so user can't go back to splash
            }
            // If no token, do nothing - show the normal splash screen
        } catch (error) {
            console.error('Error checking authentication:', error);
            // If there's an error, show the normal splash screen
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

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