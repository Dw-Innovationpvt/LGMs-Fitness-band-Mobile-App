// SkatePreferenceScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet,
//   ScrollView, Dimensions, Alert, ActivityIndicator
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSkatePreferencesStore } from '../store/skatePreferencesStore'; // or the correct path to your store
// import { useSkatePreferencesStore } from './caloriesStore';/// or the correct path
// SkatePreferenceScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useSkatePreferencesStore } from './caloriesStore';

const { width } = Dimensions.get('window');

const wheelOptions = {
  inline: ['90 mm', '100 mm', '110 mm'],
  quad: ['56 mm', '58 mm', '62 mm', '65 mm']
};

const SkatePref = ({ navigation, route }) => {
  const {
    activeWheelType,
    activeWheelDiameter,
    loading,
    error,
    setPreferences,
    fetchPreferences,
    onPreferencesUpdate
  } = useSkatePreferencesStore();

  const [skateType, setSkateType] = useState(activeWheelType || 'inline');
  const [wheelDiameter, setWheelDiameter] = useState(
    activeWheelDiameter ? `${activeWheelDiameter} mm` : ''
  );
  const [customDiameter, setCustomDiameter] = useState('');

  // Use the callback from route params if provided (for backward compatibility)
  const routeCallback = route.params?.onUpdatePreferences;

  // Register callback with store when component mounts
  useEffect(() => {
    if (routeCallback) {
      const unsubscribe = onPreferencesUpdate(routeCallback);
      return unsubscribe; // Cleanup on unmount
    }
  }, [routeCallback, onPreferencesUpdate]);

  // Fetch preferences when component mounts
  useEffect(() => {
    fetchPreferences();
  }, []);

  // Update local state when store values change
  useEffect(() => {
    if (activeWheelType) {
      setSkateType(activeWheelType);
    }
    if (activeWheelDiameter) {
      setWheelDiameter(`${activeWheelDiameter} mm`);
    }
  }, [activeWheelType, activeWheelDiameter]);

  useEffect(() => {
    setWheelDiameter('');
    setCustomDiameter('');
  }, [skateType]);

  const handleSave = async () => {
    const selectedDiameter = wheelDiameter || customDiameter;
    
    if (!selectedDiameter) {
      Alert.alert('Error', 'Please select or enter a wheel diameter');
      return;
    }
    
    const diameterValue = parseInt(selectedDiameter.replace(' mm', ''), 10);
    
    if (isNaN(diameterValue)) {
      Alert.alert('Error', 'Please enter a valid wheel diameter');
      return;
    }

    try {
      const result = await setPreferences({
        skateType,
        wheelDiameter: diameterValue,
        setActive: true
      });

      if (result.success) {
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error || 'Failed to save preferences');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save preferences: ' + err.message);
    }
  };

  const handleWheelSelect = (size) => {
    setWheelDiameter(size);
    setCustomDiameter('');
  };

  return (
    <LinearGradient
      colors={['#F5F7FB', '#E4E8F0']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Skate Preferences 🛼</Text>
        <Text style={styles.subtitle}>Tell us about your skating setup</Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B6CB7" />
            <Text style={styles.loadingText}>Loading preferences...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#d32f2f" />
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {/* ... rest of your UI remains the same ... */}
		        {/* Skate Type Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skate Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity 
              style={[
                styles.typeOption,
                skateType === 'inline' && styles.selectedType
              ]}
              onPress={() => setSkateType('inline')}
              disabled={loading}
            >
              <MaterialCommunityIcons 
                name="rollerblade" 
                size={32} 
                color={skateType === 'inline' ? '#fff' : '#4B6CB7'} 
              />
              <Text style={[
                styles.typeText,
                skateType === 'inline' && styles.selectedTypeText
              ]}>
                Inline Skates
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.typeOption,
                skateType === 'quad' && styles.selectedType
              ]}
              onPress={() => setSkateType('quad')}
              disabled={loading}
            >
              <MaterialCommunityIcons 
                name="roller-skate" 
                size={32} 
                color={skateType === 'quad' ? '#fff' : '#FF6B6B'} 
              />
              <Text style={[
                styles.typeText,
                skateType === 'quad' && styles.selectedTypeText
              ]}>
                Quad Skates
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wheel Diameter Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Wheel Diameter</Text>
          <Text style={styles.sectionTitle}>Common {skateType === 'inline' ? 'Inline' : 'Quad'} Sizes</Text>
          
          <View style={styles.wheelContainer}>
            {(wheelOptions[skateType] || []).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.wheelOption,
                  wheelDiameter === size && styles.selectedWheel
                ]}
                onPress={() => handleWheelSelect(size)}
                disabled={loading}
              >
                <Text style={[
                  styles.wheelText,
                  wheelDiameter === size && styles.selectedWheelText
                ]}>
                  {size}
                </Text>
                {wheelDiameter === size && (
                  <MaterialCommunityIcons 
                    name="check-circle" 
                    size={20} 
                    color="#4B6CB7" 
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.continueButton, (loading || (!wheelDiameter && !customDiameter)) && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading || (!wheelDiameter && !customDiameter)}
        >
          <LinearGradient
            colors={[loading ? '#ccc' : '#4B6CB7', loading ? '#999' : '#182848']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Continue</Text>
                <MaterialCommunityIcons 
                  name="arrow-right" 
                  size={24} 
                  color="#fff" 
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={{ height: 20 }} />
        
      </ScrollView>
    </LinearGradient>
  );
};

// ... keep your existing styles ...

// export default SkatePref;

// const { width,height } = Dimensions.get('window');

// const wheelOptions = {
//   inline: ['90 mm', '100 mm', '110 mm'],
//   quad: ['56 mm', '58 mm', '62 mm', '65 mm']
// };

// const SkatePref = ({ navigation, route }) => {
//   // Get Zustand store state and actions
//   const {
//     activeWheelType,
//     activeWheelDiameter,
//     loading,
//     error,
//     setPreferences,
//     fetchPreferences
//   } = useSkatePreferencesStore();

//   const { currentPreferences = {}, onUpdatePreferences = () => {} } = route?.params || {};

//   const [skateType, setSkateType] = useState(activeWheelType || 'inline');
//   const [wheelDiameter, setWheelDiameter] = useState(
//     activeWheelDiameter ? `${activeWheelDiameter} mm` : ''
//   );
//   const [customDiameter, setCustomDiameter] = useState('');

//   // Fetch preferences when component mounts
//   useEffect(() => {
//     fetchPreferences();
//   }, []);

//   // Update local state when store values change
//   useEffect(() => {
//     if (activeWheelType) {
//       setSkateType(activeWheelType);
//     }
//     if (activeWheelDiameter) {
//       setWheelDiameter(`${activeWheelDiameter} mm`);
//     }
//   }, [activeWheelType, activeWheelDiameter]);

//   // Also consider route params for initial values
//   useEffect(() => {
//     if (currentPreferences.skateType) {
//       setSkateType(currentPreferences.skateType);
//     }
//     if (currentPreferences.wheelDiameter) {
//       setWheelDiameter(currentPreferences.wheelDiameter);
//     }
//   }, [currentPreferences]);

//   useEffect(() => {
//     // Reset wheel diameter when skate type changes
//     setWheelDiameter('');
//     setCustomDiameter('');
//   }, [skateType]);

//   const handleSave = async () => {
//     const selectedDiameter = wheelDiameter || customDiameter;
    
//     if (!selectedDiameter) {
//       Alert.alert('Error', 'Please select or enter a wheel diameter');
//       return;
//     }
    
//     // Extract numeric value from diameter string (e.g., "90 mm" -> 90)
//     const diameterValue = parseInt(selectedDiameter.replace(' mm', ''), 10);
    
//     if (isNaN(diameterValue)) {
//       Alert.alert('Error', 'Please enter a valid wheel diameter');
//       return;
//     }

//     try {
//       // Save preferences to backend and update store
//       const result = await setPreferences({
//         skateType,
//         wheelDiameter: diameterValue,
//         setActive: true
//       });

//       if (result.success) {
//         // Call the update callback with new preferences if provided via props
//         onUpdatePreferences({
//           skateType,
//           wheelDiameter: selectedDiameter
//         });

//         // Go back to previous screen
//         navigation.goBack();
//       } else {
//         Alert.alert('Error', result.error || 'Failed to save preferences');
//       }
      
//     } catch (err) {
//       Alert.alert('Error', 'Failed to save preferences: ' + err.message);
//     }
//   };

//   const handleWheelSelect = (size) => {
//     setWheelDiameter(size);
//     setCustomDiameter('');
//   };

//   return (
//     <LinearGradient
//       colors={['#F5F7FB', '#E4E8F0']}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Skate Preferences 🛼</Text>
//         <Text style={styles.subtitle}>Tell us about your skating setup</Text>

//         {loading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#4B6CB7" />
//             <Text style={styles.loadingText}>Loading preferences...</Text>
//           </View>
//         )}

//         {error && (
//           <View style={styles.errorContainer}>
//             <MaterialCommunityIcons name="alert-circle" size={24} color="#d32f2f" />
//             <Text style={styles.errorText}>Error: {error}</Text>
//           </View>
//         )}

//         {/* Skate Type Selection */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Skate Type</Text>
//           <View style={styles.typeContainer}>
//             <TouchableOpacity 
//               style={[
//                 styles.typeOption,
//                 skateType === 'inline' && styles.selectedType
//               ]}
//               onPress={() => setSkateType('inline')}
//               disabled={loading}
//             >
//               <MaterialCommunityIcons 
//                 name="rollerblade" 
//                 size={32} 
//                 color={skateType === 'inline' ? '#fff' : '#4B6CB7'} 
//               />
//               <Text style={[
//                 styles.typeText,
//                 skateType === 'inline' && styles.selectedTypeText
//               ]}>
//                 Inline Skates
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[
//                 styles.typeOption,
//                 skateType === 'quad' && styles.selectedType
//               ]}
//               onPress={() => setSkateType('quad')}
//               disabled={loading}
//             >
//               <MaterialCommunityIcons 
//                 name="roller-skate" 
//                 size={32} 
//                 color={skateType === 'quad' ? '#fff' : '#FF6B6B'} 
//               />
//               <Text style={[
//                 styles.typeText,
//                 skateType === 'quad' && styles.selectedTypeText
//               ]}>
//                 Quad Skates
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Wheel Diameter Selection */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Select Wheel Diameter</Text>
//           <Text style={styles.sectionTitle}>Common {skateType === 'inline' ? 'Inline' : 'Quad'} Sizes</Text>
          
//           <View style={styles.wheelContainer}>
//             {(wheelOptions[skateType] || []).map((size) => (
//               <TouchableOpacity
//                 key={size}
//                 style={[
//                   styles.wheelOption,
//                   wheelDiameter === size && styles.selectedWheel
//                 ]}
//                 onPress={() => handleWheelSelect(size)}
//                 disabled={loading}
//               >
//                 <Text style={[
//                   styles.wheelText,
//                   wheelDiameter === size && styles.selectedWheelText
//                 ]}>
//                   {size}
//                 </Text>
//                 {wheelDiameter === size && (
//                   <MaterialCommunityIcons 
//                     name="check-circle" 
//                     size={20} 
//                     color="#4B6CB7" 
//                     style={styles.checkIcon}
//                   />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <TouchableOpacity 
//           style={[styles.continueButton, (loading || (!wheelDiameter && !customDiameter)) && styles.disabledButton]}
//           onPress={handleSave}
//           disabled={loading || (!wheelDiameter && !customDiameter)}
//         >
//           <LinearGradient
//             colors={[loading ? '#ccc' : '#4B6CB7', loading ? '#999' : '#182848']}
//             style={styles.gradientButton}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Text style={styles.buttonText}>Continue</Text>
//                 <MaterialCommunityIcons 
//                   name="arrow-right" 
//                   size={24} 
//                   color="#fff" 
//                 />
//               </>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>
        
//         <View style={{ height: 20 }} />
//       </ScrollView>
//     </LinearGradient>
//   );
// };



// // Update SkatePreferenceScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet,
//   ScrollView, Dimensions, TextInput, Alert
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useSkatePreferencesStore } from '../store/skatePreferencesStore'; // or the correct path to your store
// // import { useSkatePreferencesStore } from './caloriesStore'; // or the correct path to your store
// // import * as Haptics from 'expo-haptics';

// const { width } = Dimensions.get('window');

// const wheelOptions = {
//   inline: ['90 mm', '100 mm', '110 mm'],
//   quad: ['56 mm', '58 mm', '62 mm', '65 mm']
// };

// const SkatePref = ({ navigation }) => {
//   // Get Zustand store state and actions
//   const {
//     activeWheelType,
//     activeWheelDiameter,
//     wheelOptions: storeWheelOptions,
//     loading,
//     error,
//     setPreferences,
//     fetchPreferences
//   } = useSkatePreferencesStore();

//   // Get token from your auth context or async storage
//   const [token, setToken] = useState(''); // You'll need to get this from your auth system

//   const [skateType, setSkateType] = useState(activeWheelType || 'inline');
//   const [wheelDiameter, setWheelDiameter] = useState(activeWheelDiameter ? `${activeWheelDiameter} mm` : '');
//   const [customDiameter, setCustomDiameter] = useState('');

//   // Fetch preferences when component mounts
//   useEffect(() => {
//     const loadPreferences = async () => {
//       // You need to get the token from your auth system
//       const userToken = await getToken(); // Implement this function
//       setToken(userToken);
//       if (userToken) {
//         await fetchPreferences(userToken);
//       }
//     };
    
//     loadPreferences();
//   }, []);

//   // Update local state when store values change
//   useEffect(() => {
//     if (activeWheelType) {
//       setSkateType(activeWheelType);
//     }
//     if (activeWheelDiameter) {
//       setWheelDiameter(`${activeWheelDiameter} mm`);
//     }
//   }, [activeWheelType, activeWheelDiameter]);

//   useEffect(() => {
//     // Reset wheel diameter when skate type changes
//     setWheelDiameter('');
//     setCustomDiameter('');
//   }, [skateType]);

//   const handleSave = async () => {
//     const selectedDiameter = wheelDiameter || customDiameter;
    
//     if (!selectedDiameter) {
//       Alert.alert('Error', 'Please select or enter a wheel diameter');
//       return;
//     }
    
//     // Extract numeric value from diameter string (e.g., "90 mm" -> 90)
//     const diameterValue = parseInt(selectedDiameter.replace(' mm', ''), 10);
    
//     if (!token) {
//       Alert.alert('Error', 'Authentication token not available');
//       return;
//     }

//     try {
//       // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
//       // Save preferences to backend and update store
//       await setPreferences({
//         skateType,
//         wheelDiameter: diameterValue,
//         setActive: true,
//         token
//       });

//       // Call the update callback with new preferences if provided via props
//       if (onUpdatePreferences) {
//         onUpdatePreferences({
//           skateType,
//           wheelDiameter: selectedDiameter
//         });
//       }

//       // Go back to previous screen
//       navigation.goBack();
      
//     } catch (err) {
//       Alert.alert('Error', 'Failed to save preferences: ' + err.message);
//     }
//   };

//   const handleWheelSelect = (size) => {
//     // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     setWheelDiameter(size);
//     setCustomDiameter('');
//   };

//   // Function to get token (you need to implement this based on your auth system)
//   const getToken = async () => {
//     // Example: return await AsyncStorage.getItem('userToken');
//     // Replace with your actual token retrieval logic
//     return 'your-auth-token-here';
//   };

//   return (
//     <LinearGradient
//       colors={['#F5F7FB', '#E4E8F0']}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Skate Preferences 🛼</Text>
//         <Text style={styles.subtitle}>Tell us about your skating setup</Text>

//         {loading && (
//           <View style={styles.loadingContainer}>
//             <Text style={styles.loadingText}>Loading preferences...</Text>
//           </View>
//         )}

//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>Error: {error}</Text>
//           </View>
//         )}

//         {/* Skate Type Selection */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Skate Type</Text>
//           <View style={styles.typeContainer}>
//             <TouchableOpacity 
//               style={[
//                 styles.typeOption,
//                 skateType === 'inline' && styles.selectedType
//               ]}
//               onPress={() => {
//                 // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                 setSkateType('inline');
//               }}
//               disabled={loading}
//             >
//               <MaterialCommunityIcons 
//                 name="rollerblade" 
//                 size={32} 
//                 color={skateType === 'inline' ? '#fff' : '#4B6CB7'} 
//               />
//               <Text style={[
//                 styles.typeText,
//                 skateType === 'inline' && styles.selectedTypeText
//               ]}>
//                 Inline Skates
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[
//                 styles.typeOption,
//                 skateType === 'quad' && styles.selectedType
//               ]}
//               onPress={() => {
//                 // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                 setSkateType('quad');
//               }}
//               disabled={loading}
//             >
//               <MaterialCommunityIcons 
//                 name="roller-skate" 
//                 size={32} 
//                 color={skateType === 'quad' ? '#fff' : '#FF6B6B'} 
//               />
//               <Text style={[
//                 styles.typeText,
//                 skateType === 'quad' && styles.selectedTypeText
//               ]}>
//                 Quad Skates
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Wheel Diameter Selection */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Select Wheel Diameter</Text>
//           <Text style={styles.sectionTitle}>Common {skateType === 'inline' ? 'Inline' : 'Quad'} Sizes</Text>
          
//           <View style={styles.wheelContainer}>
//             {(wheelOptions[skateType] || []).map((size) => (
//               <TouchableOpacity
//                 key={size}
//                 style={[
//                   styles.wheelOption,
//                   wheelDiameter === size && styles.selectedWheel
//                 ]}
//                 onPress={() => handleWheelSelect(size)}
//                 disabled={loading}
//               >
//                 <Text style={[
//                   styles.wheelText,
//                   wheelDiameter === size && styles.selectedWheelText
//                 ]}>
//                   {size}
//                 </Text>
//                 {wheelDiameter === size && (
//                   <MaterialCommunityIcons 
//                     name="check-circle" 
//                     size={20} 
//                     color="#4B6CB7" 
//                     style={styles.checkIcon}
//                   />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>

//         </View>

//         <TouchableOpacity 
//           style={[styles.continueButton, loading && styles.disabledButton]}
//           onPress={handleSave}
//           disabled={(!wheelDiameter && !customDiameter) || loading}
//         >
//           <LinearGradient
//             colors={[loading ? '#ccc' : '#4B6CB7', loading ? '#999' : '#182848']}
//             style={styles.gradientButton}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? 'Saving...' : 'Continue'}
//             </Text>
//             {!loading && (
//               <MaterialCommunityIcons 
//                 name="arrow-right" 
//                 size={24} 
//                 color="#fff" 
//               />
//             )}
//           </LinearGradient>
//         </TouchableOpacity>
        
//         {/* Add some spacing at the bottom */}
//         <View style={{ height: 20 }} />
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// // Add these new styles
// const styles = StyleSheet.create({
//   // ... keep your existing styles and add these:
//   loadingContainer: {
//     padding: 10,
//     backgroundColor: '#e3f2fd',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   loadingText: {
//     color: '#1976d2',
//     textAlign: 'center',
//   },
//   errorContainer: {
//     padding: 10,
//     backgroundColor: '#ffebee',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#d32f2f',
//     textAlign: 'center',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default SkatePref;
// // Update SkatePreferenceScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet,
//   ScrollView, Dimensions, TextInput
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// // import * as Haptics from 'expo-haptics';

// const { width } = Dimensions.get('window');

// const wheelOptions = {
//   inline: ['90 mm', '100 mm', '110 mm'],
//   quad: ['56 mm', '58 mm', '62 mm', '65 mm']
// };

// const SkatePref = ({ navigation }) => {
//   // Get the current preferences and callback from route params with defaults
// //   const { currentPreferences = {}, onUpdatePreferences = () => {} } = route.params || {};
//   const { currentPreferences = {}, onUpdatePreferences = () => {} } =  {};
  
//   const [skateType, setSkateType] = useState(currentPreferences.skateType || 'inline');
//   const [wheelDiameter, setWheelDiameter] = useState(currentPreferences.wheelDiameter || '');
//   const [customDiameter, setCustomDiameter] = useState('');

//   useEffect(() => {
//     // Reset wheel diameter when skate type changes
//     console.log('Inside skate preference screen, 28 for set check setup true')
//     // console.log(route.params)
//     setWheelDiameter('');
//     setCustomDiameter('');
//   }, [skateType]);

//   const handleSave = () => {
//     const selectedDiameter = wheelDiameter || customDiameter;
    
//     if (!selectedDiameter) {
//       alert('Please select or enter a wheel diameter');
//       return;
//     }
    
//     // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
//     // Call the update callback with new preferences
//     onUpdatePreferences({
//       skateType,
//       wheelDiameter: selectedDiameter
//     });


//     // console.log('SkatePreference, ', )

//     // Go back to profile
//     navigation.goBack();
//     // navigation.navigate('Home');
//     // navigation.replace('Main');
//     // navigation.navigate('MealTimingScreen', route) 

//     // navigation.navigate('MealTiming', {
//     //   ...route.params, 
//     //   skatePreferences: {
//     //     skateType,
//     //     wheelDiameter: selectedDiameter
//     //   }
//     // })


//   };

//   const handleWheelSelect = (size) => {
//     // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     setWheelDiameter(size);
//     setCustomDiameter('');
//   };

//   return (
//     <LinearGradient
//       colors={['#F5F7FB', '#E4E8F0']}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Skate Preferences 🛼</Text>
//         {/* <Text style={styles.title}>Skate Pres 🛼</Text> */}
//         <Text style={styles.subtitle}>Tell us about your skating setup</Text>

//         {/* Skate Type Selection */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Skate Type</Text>
//           <View style={styles.typeContainer}>
//             <TouchableOpacity 
//               style={[
//                 styles.typeOption,
//                 skateType === 'inline' && styles.selectedType
//               ]}
//               onPress={() => {
//                 // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                 setSkateType('inline');
//               }}
//             >
//               <MaterialCommunityIcons 
//                 name="rollerblade" 
//                 size={32} 
//                 color={skateType === 'inline' ? '#fff' : '#4B6CB7'} 
//               />
//               <Text style={[
//                 styles.typeText,
//                 skateType === 'inline' && styles.selectedTypeText
//               ]}>
//                 Inline Skates
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[
//                 styles.typeOption,
//                 skateType === 'quad' && styles.selectedType
//               ]}
//               onPress={() => {
//                 // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                 setSkateType('quad');
//               }}
//             >
//               <MaterialCommunityIcons 
//                 name="roller-skate" 
//                 size={32} 
//                 color={skateType === 'quad' ? '#fff' : '#FF6B6B'} 
//               />
//               <Text style={[
//                 styles.typeText,
//                 skateType === 'quad' && styles.selectedTypeText
//               ]}>
//                 Quad Skates
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Wheel Diameter Selection */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Select Wheel Diameter</Text>
//           <Text style={styles.sectionTitle}>Common {skateType === 'inline' ? 'Inline' : 'Quad'} Sizes</Text>
          
//           <View style={styles.wheelContainer}>
//             {(wheelOptions[skateType] || []).map((size) => (
//               <TouchableOpacity
//                 key={size}
//                 style={[
//                   styles.wheelOption,
//                   wheelDiameter === size && styles.selectedWheel
//                 ]}
//                 onPress={() => handleWheelSelect(size)}
//               >
//                 <Text style={[
//                   styles.wheelText,
//                   wheelDiameter === size && styles.selectedWheelText
//                 ]}>
//                   {size}
//                 </Text>
//                 {wheelDiameter === size && (
//                   <MaterialCommunityIcons 
//                     name="check-circle" 
//                     size={20} 
//                     color="#4B6CB7" 
//                     style={styles.checkIcon}
//                   />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>

//         </View>

//         <TouchableOpacity 
//           style={styles.continueButton}
//           onPress={handleSave}
//           disabled={!wheelDiameter && !customDiameter}
//         >
//           <LinearGradient
//             colors={['#4B6CB7', '#182848']}
//             style={styles.gradientButton}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Text style={styles.buttonText}>Continue</Text>
//             <MaterialCommunityIcons 
//               name="arrow-right" 
//               size={24} 
//               color="#fff" 
//             />
//           </LinearGradient>
//         </TouchableOpacity>
//         <View style={{ height: 20 }} />
//         <View style={{ height: 20 }} />
//         <View style={{ height: 20 }} />
//         <View style={{ height: 20 }} />
//         <View style={{ height: 20 }} />
//         <View style={{ height: 20 }} />
//       </ScrollView>
//     </LinearGradient>
//   );
// };



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingTop: 30,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#666',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#4B6CB7',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    marginTop: 5,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  selectedType: {
    backgroundColor: '#4B6CB7',
  },
  selectedTypeText: {
    color: '#fff',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  wheelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  wheelOption: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F5F7FB',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedWheel: {
    backgroundColor: '#E8F0FE',
    borderColor: '#4B6CB7',
  },
  wheelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedWheelText: {
    color: '#4B6CB7',
  },
  checkIcon: {
    marginLeft: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E4E8F0',
  },
  continueButton: {
    marginTop: 10,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default SkatePref;

