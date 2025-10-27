// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     ImageBackground,
//     KeyboardAvoidingView,
//     Platform,
//     ActivityIndicator,
//     ScrollView,
//     useWindowDimensions,
//     Alert
// } from 'react-native';
// import { useAuthStore } from '../store/authStore';
// import { imageURL } from '../constants/api';

// const SignInScreen = ({ navigation, route }) => {
//     const { width, height } = useWindowDimensions();
//     // const [email, setEmail] = useState('');
//     // const [password, setPassword] = useState('');
//     // const [isDarkMode, setIsDarkMode] = useState(true);

//     // const onSignInPress = () => {
//     //     navigation.replace('Main');
//     // };
//      const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [onSignInPressLoading, setOnSignInPressLoading] = useState(false);

//       // const { isLoading, login, isCheckingAuth, nothingtoworry } = useAuthStore();
//       const { nothingtoworry, login, isLoading, checkSetup } = useAuthStore();

//   // checking if backend is working
//   const onForgotPasswordPress = async () => {
//       console.log('onForgotPasswordPress called');
//     navigation.navigate('ForgotPassword');
//     // try {
//     //   const response = await nothingtoworry();
//     //   if (response.success) {
//     //     // console.log('Backend is working:', response.data);
//     //   } else {
//     //     console.error('Error:', response.error);
//     //   }
//     // } catch (error) {
//     //   console.error('Error checking backend:', error);
//     // }
//   };

//   // Get setIsSignedIn from route params
// const onSignInPress = async () => {
    
//     setOnSignInPressLoading(true);
    
//     const result = await login(email, password);

//     if (!result.success) {
//         Alert.alert("Error", result.error);
//         navigation.replace('SignIn'); // back to signin on failure
//         return;
//     }
//     else {


    
//     // if (result.user.hasCompletedSetup) {
//     // const s = await checkSetup();
//     // if (!s.success) {
//     //     Alert.alert("Error", s.error);
//     //     navigation.replace('SignIn'); // back to signin on failure
//     //     return;
//     // }
//     // console.log("Setup status:", s.data);
//     const { setup } = await checkSetup();
//     console.log("Setup status:", setup, '68');
//     if (setup) {
//         console.log("If auth success and already setup, navigating to Main");
//         console.log("Setup status:", setup.setup);
//         navigation.replace('Main');
//     } else {
//         navigation.replace('BMI');
//     }
    
//     }
// };

//     const toggleTheme = () => setIsDarkMode(!isDarkMode);
//     // useEffect(() => {
//     //     // console.log('SignInScreen mounted');
//     // }, [email, password, isDarkMode]);
//     const colors = {
//         bg: isDarkMode ? '#000' : '#fff',
//         text: isDarkMode ? '#fff' : '#000',
//         linkText: '#4DA6FF',
//         placeholder: isDarkMode ? '#ddd' : '#555',
//         buttonBg: isDarkMode ? '#fff' : '#000',
//         buttonText: isDarkMode ? '#000' : '#fff',
//     };

//     const styles = StyleSheet.create({
//         background: {
//             flex: 1,
//             width: width,
//         },
//         container: {
//             flex: 1,
//         },
//         toggle: {
//             marginTop: height * 0.06,
//             marginRight: '5%',
//             alignSelf: 'flex-end',
//         },
//         formContainer: {
//             borderTopLeftRadius: 50,
//             borderTopRightRadius: 50,
//             padding: '6%',
//             marginTop: 'auto',
//             paddingTop: '10%',
//             paddingBottom: '20%',
//             width: width,
//         },
//         label: {
//             fontSize: width * 0.035,
//             marginBottom: '1.5%',
//         },
//         input: {
//             borderRadius: 25,
//             height: width * 0.12,
//             paddingHorizontal: '4%',
//             fontSize: width * 0.035,
//             marginBottom: '2%',
//             borderWidth: 1,
//         },
//         forgotPassword: {
//             alignItems: 'flex-end',
//             marginBottom: '4%',
//         },
//         forgotText: {
//             fontSize: width * 0.033,
//         },
//         button: {
//             paddingVertical: '3.5%',
//             borderRadius: 25,
//             alignItems: 'center',
//             marginTop: '2.5%',
//         },
//         buttonText: {
//             fontSize: width * 0.04,
//             fontWeight: '600',
//         },
//         switchText: {
//             marginTop: '5%',
//             textAlign: 'center',
//             fontSize: width * 0.033,
//         },
//     });

//     return (
//         <ImageBackground
//             source={require('../assets/88.png')}
//             // source={imageURL}
//             style={styles.background}
//             resizeMode="cover"
//         >
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.container}
//                 keyboardVerticalOffset={-150}
//             >
//                 <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                     <TouchableOpacity style={styles.toggle} onPress={toggleTheme}>
//                         <Text style={{ color: colors.text }}>{isDarkMode ? '☀️' : '🌙'}</Text>
//                     </TouchableOpacity>

//                     <View
//                         style={[
//                             styles.formContainer,
//                             { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)' },
//                         ]}
//                     >
//                         <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
//                         <TextInput
//                             placeholder="Enter your email address"
//                             placeholderTextColor={colors.placeholder}
//                             style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.text, color: colors.text }]}
//                             value={email}
//                             onChangeText={setEmail}
//                         />

//                         <Text style={[styles.label, { color: colors.text }]}>Password</Text>
//                         <TextInput
//                             placeholder="Enter your password"
//                             placeholderTextColor={colors.placeholder}
//                             secureTextEntry
//                             style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.text, color: colors.text }]}
//                             value={password}
//                             onChangeText={setPassword}
//                         />

//                         <TouchableOpacity style={styles.forgotPassword} onPress={onForgotPasswordPress}>
//                             <Text style={[styles.forgotText, { color: colors.linkText }]}>Forgot password</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonBg }]} onPress={onSignInPress}>
//                             {
//                                 (isLoading || onSignInPressLoading) ? (
//                                     <ActivityIndicator size="small" color={colors.buttonText} />
//                                 ) : <Text style={[styles.buttonText, { color: colors.buttonText }]}>Sign In</Text>
//                             }


//                         </TouchableOpacity>

//                         <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//                             <Text style={[styles.switchText, { color: colors.text }]}>
//                                 Don't have an account? <Text style={{ color: colors.linkText }}>Sign Up</Text>
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </ImageBackground>
//     );
// };

// export default SignInScreen;

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
    useWindowDimensions,
    Alert
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { imageURL } from '../constants/api';

const SignInScreen = ({ navigation, route }) => {
    const { width, height } = useWindowDimensions();
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [isDarkMode, setIsDarkMode] = useState(true);

    // const onSignInPress = () => {
    //     navigation.replace('Main');
    // };
     const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [onSignInPressLoading, setOnSignInPressLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

      // const { isLoading, login, isCheckingAuth, nothingtoworry } = useAuthStore();
      const { nothingtoworry, login, isLoading, checkSetup } = useAuthStore();

  // checking if backend is working
  const onForgotPasswordPress = async () => {
      console.log('onForgotPasswordPress called');
    navigation.navigate('ForgotPassword');
    // try {
    //   const response = await nothingtoworry();
    //   if (response.success) {
    //     // console.log('Backend is working:', response.data);
    //   } else {
    //     console.error('Error:', response.error);
    //   }
    // } catch (error) {
    //   console.error('Error checking backend:', error);
    // }
  };

  // Get setIsSignedIn from route params
const onSignInPress = async () => {
    
    setOnSignInPressLoading(true);
    
    const result = await login(email, password);

    if (!result.success) {
        Alert.alert("Error", result.error);
        navigation.replace('SignIn'); // back to signin on failure
        return;
    }
    else {

    const { setup } = await checkSetup();
    console.log("Setup status:", setup, '68');
    if (setup) {
        console.log("If auth success and already setup, navigating to Main");
        console.log("Setup status:", setup.setup);
        navigation.replace('Main');
    } else {
        navigation.replace('BMI');
    }
    
    }
};

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    // useEffect(() => {
    //     // console.log('SignInScreen mounted');
    // }, [email, password, isDarkMode]);
    const colors = {
        bg: isDarkMode ? '#000' : '#fff',
        text: isDarkMode ? '#fff' : '#000',
        linkText: '#4DA6FF',
        placeholder: isDarkMode ? '#ddd' : '#555',
        buttonBg: isDarkMode ? '#fff' : '#000',
        buttonText: isDarkMode ? '#000' : '#fff',
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
        passwordContainer: {
            position: 'relative',
        },
        eyeIcon: {
            position: 'absolute',
            right: 15,
            top: '15%',
            zIndex: 1,
        },
        eyeIconText: {
            fontSize: width * 0.05,
        },
        forgotPassword: {
            alignItems: 'flex-end',
            marginBottom: '4%',
        },
        forgotText: {
            fontSize: width * 0.033,
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

                    <View
                        style={[
                            styles.formContainer,
                            { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)' },
                        ]}
                    >
                        <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                        <TextInput
                            placeholder="Enter your email address"
                            placeholderTextColor={colors.placeholder}
                            style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.text, color: colors.text }]}
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Enter your password"
                                placeholderTextColor={colors.placeholder}
                                secureTextEntry={!showPassword}
                                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.text, color: colors.text, paddingRight: 50 }]}
                                value={password}
                                onChangeText={setPassword}
                            />
                          
                                    <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                                    <Text style={[styles.eyeIconText, { color: colors.placeholder }]}>
                                    {showPassword ? '👁️' : '👁️'}
                                    </Text>
                                    </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword} onPress={onForgotPasswordPress}>
                            <Text style={[styles.forgotText, { color: colors.linkText }]}>Forgot password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonBg }]} onPress={onSignInPress}>
                            {
                                (isLoading || onSignInPressLoading) ? (
                                    <ActivityIndicator size="small" color={colors.buttonText} />
                                ) : <Text style={[styles.buttonText, { color: colors.buttonText }]}>Sign In</Text>
                            }


                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={[styles.switchText, { color: colors.text }]}>
                                Don't have an account? <Text style={{ color: colors.linkText }}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default SignInScreen;