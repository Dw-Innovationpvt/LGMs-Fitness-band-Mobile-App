// Update SkatePreferenceScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const wheelOptions = {
  inline: ['90 mm', '100 mm', '110 mm'],
  quad: ['56 mm', '58 mm', '62 mm', '65 mm']
};

const SkatePreferenceScreen = ({ navigation, route }) => {
  // Get the current preferences and callback from route params with defaults
  const { currentPreferences = {}, onUpdatePreferences = () => {} } = route.params || {};
  
  const [skateType, setSkateType] = useState(currentPreferences.skateType || 'inline');
  const [wheelDiameter, setWheelDiameter] = useState(currentPreferences.wheelDiameter || '');
  const [customDiameter, setCustomDiameter] = useState('');

  useEffect(() => {
    // Reset wheel diameter when skate type changes
    console.log('Inside skate preference screen, 28 for set check setup true')
    console.log(route.params)
    setWheelDiameter('');
    setCustomDiameter('');
  }, [skateType]);

  const handleSave = () => {
    const selectedDiameter = wheelDiameter || customDiameter;
    
    if (!selectedDiameter) {
      alert('Please select or enter a wheel diameter');
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Call the update callback with new preferences
    onUpdatePreferences({
      skateType,
      wheelDiameter: selectedDiameter
    });

    // console.log('SkatePreference, ', )

    // Go back to profile
    // navigation.goBack();
    // navigation.navigate('Home');
    // navigation.replace('Main');
    // navigation.navigate('MealTimingScreen', route) 

    navigation.navigate('MealTiming', {
      ...route.params, 
      skatePreferences: {
        skateType,
        wheelDiameter: selectedDiameter
      }
    })


  };

  const handleWheelSelect = (size) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

        {/* Skate Type Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skate Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity 
              style={[
                styles.typeOption,
                skateType === 'inline' && styles.selectedType
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSkateType('inline');
              }}
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSkateType('quad');
              }}
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

          <Text style={styles.sectionTitle}>Custom Size</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter custom diameter in mm (${skateType === 'inline' ? '72-110' : '50-65'}mm)`}
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={customDiameter}
            onChangeText={(text) => {
              setCustomDiameter(text);
              setWheelDiameter('');
            }}
          />
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleSave}
          disabled={!wheelDiameter && !customDiameter}
        >
          <LinearGradient
            colors={['#4B6CB7', '#182848']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={24} 
              color="#fff" 
            />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};


// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet,
//   ScrollView, Dimensions, TextInput
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';

// const { width } = Dimensions.get('window');

// const wheelOptions = {
//   inline: ['90 mm', '100 mm', '110 mm'],
//   quad: ['56 mm', '58 mm', '62 mm', '65 mm']
// };

// const SkatePreferenceScreen = ({ navigation, route }) => {
//   // Get the current preferences and callback from route params
//   const { currentPreferences, onUpdatePreferences } = route.params;
  
//   const [skateType, setSkateType] = useState(currentPreferences.skateType || 'inline');
//   const [wheelDiameter, setWheelDiameter] = useState(currentPreferences.wheelDiameter || '');
//   const [customDiameter, setCustomDiameter] = useState('');

//   useEffect(() => {
//     // Reset wheel diameter when skate type changes
//     setWheelDiameter('');
//     setCustomDiameter('');
//   }, [skateType]);

//   const handleSave = () => {
//     const selectedDiameter = wheelDiameter || customDiameter;
    
//     if (!selectedDiameter) {
//       alert('Please select or enter a wheel diameter');
//       return;
//     }
    
//     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
//     // Call the update callback with new preferences
//     onUpdatePreferences({
//       skateType,
//       wheelDiameter: selectedDiameter
//     });
    
//     // Go back to profile
//     navigation.goBack();
//   };

//   const handleWheelSelect = (size) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
//             {wheelOptions[skateType].map((size) => (
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

//           <Text style={styles.sectionTitle}>Custom Size</Text>
//           <TextInput
//             style={styles.input}
//             placeholder={`Enter custom diameter in mm (${skateType === 'inline' ? '72-110' : '50-65'}mm)`}
//             placeholderTextColor="#999"
//             keyboardType="numeric"
//             value={customDiameter}
//             onChangeText={(text) => {
//               setCustomDiameter(text);
//               setWheelDiameter('');
//             }}
//           />
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

export default SkatePreferenceScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet,
//   ScrollView, Dimensions, TextInput
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';

// const { width } = Dimensions.get('window');

// const wheelOptions = {
//   inline: ['90 mm', '100 mm', '110 mm'],
//   quad: ['56 mm', '58 mm', '62 mm', '65 mm']
// };

// const SkatePreferenceScreen = ({ navigation, route }) => {
//   const [skateType, setSkateType] = useState('inline');
//   const [wheelDiameter, setWheelDiameter] = useState('');
//   const [customDiameter, setCustomDiameter] = useState('');

//   useEffect(() => {
//     // Reset wheel diameter when skate type changes
//     setWheelDiameter('');
//     setCustomDiameter('');
//   }, [skateType]);

//   const handleContinue = () => {
//     const selectedDiameter = wheelDiameter || customDiameter;
    
//     if (!selectedDiameter) {
//       alert('Please select or enter a wheel diameter');
//       return;
//     }
    
//     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
//     navigation.navigate('MealTiming', {
//       ...route.params,
//       skatePreferences: {
//         skateType,
//         wheelDiameter: selectedDiameter
//       }
//     });
//   };

//   const handleWheelSelect = (size) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
//             {wheelOptions[skateType].map((size) => (
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

//           <Text style={styles.sectionTitle}>Custom Size</Text>
//           <TextInput
//             style={styles.input}
//             placeholder={`Enter custom diameter in mm (${skateType === 'inline' ? '72-110' : '50-65'}mm)`}
//             placeholderTextColor="#999"
//             keyboardType="numeric"
//             value={customDiameter}
//             onChangeText={(text) => {
//               setCustomDiameter(text);
//               setWheelDiameter('');
//             }}
//           />
//         </View>

//         <TouchableOpacity 
//           style={styles.continueButton}
//           onPress={handleContinue}
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
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FB',
//     paddingTop: 30,
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   title: {
//     fontSize: width * 0.08,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: width * 0.045,
//     color: '#666',
//     marginBottom: 30,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   cardTitle: {
//     fontSize: width * 0.045,
//     fontWeight: '600',
//     color: '#4B6CB7',
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#555',
//     marginBottom: 10,
//     marginTop: 5,
//   },
//   typeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   typeOption: {
//     width: '48%',
//     padding: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     backgroundColor: '#F5F7FB',
//   },
//   selectedType: {
//     backgroundColor: '#4B6CB7',
//   },
//   selectedTypeText: {
//     color: '#fff',
//   },
//   typeText: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 10,
//     color: '#333',
//   },
//   wheelContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   wheelOption: {
//     width: '48%',
//     padding: 15,
//     borderRadius: 12,
//     backgroundColor: '#F5F7FB',
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#E4E8F0',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   selectedWheel: {
//     backgroundColor: '#E8F0FE',
//     borderColor: '#4B6CB7',
//   },
//   wheelText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   selectedWheelText: {
//     color: '#4B6CB7',
//   },
//   checkIcon: {
//     marginLeft: 5,
//   },
//   input: {
//     height: 50,
//     backgroundColor: '#F5F7FB',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     color: '#333',
//     borderWidth: 1,
//     borderColor: '#E4E8F0',
//   },
//   continueButton: {
//     marginTop: 10,
//   },
//   gradientButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     borderRadius: 12,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
// });

// export default SkatePreferenceScreen;