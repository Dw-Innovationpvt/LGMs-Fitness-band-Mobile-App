import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, Dimensions, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BMIScreen = ({ navigation }) => {
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState(25);
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg');

    const calculateBMI = () => {
        if (!height || !weight) {
            alert('Please enter both height and weight');
            return;
        }
        
        let heightInMeters = heightUnit === 'cm' ? height / 100 : height * 0.0254;
        let weightInKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) * 0.453592;

        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);

    navigation.navigate('SkatePreference', {
  bmiData: {
    height,
    heightUnit,
    weight,
    weightUnit,
    gender,
    age,
    bmiValue: bmi
  }
});
    };

    const renderAgePicker = () => {
        const ages = Array.from({ length: 21 }, (_, i) => i + 10);
        return (
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ageScrollContainer}
            >
                {ages.map(item => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.ageItem,
                            age === item && styles.selectedAgeItem
                        ]}
                        onPress={() => setAge(item)}
                    >
                        <Text style={[
                            styles.ageText,
                            age === item && styles.selectedAgeText
                        ]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <LinearGradient
            colors={['#F5F7FB', '#E4E8F0']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Let's Get Started 🚀</Text>
                <Text style={styles.subtitle}>Tell us about yourself</Text>

                {/* Gender Selection */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Gender</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.genderOption,
                                gender === 'male' && styles.selectedGender
                            ]}
                            onPress={() => setGender('male')}
                        >
                            <MaterialCommunityIcons 
                                name="gender-male" 
                                size={32} 
                                color={gender === 'male' ? '#fff' : '#4B6CB7'} 
                            />
                            <Text style={[
                                styles.genderText,
                                gender === 'male' && styles.selectedGenderText
                            ]}>
                                Male
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.genderOption,
                                gender === 'female' && styles.selectedGender
                            ]}
                            onPress={() => setGender('female')}
                        >
                            <MaterialCommunityIcons 
                                name="gender-female" 
                                size={32} 
                                color={gender === 'female' ? '#fff' : '#FF6B6B'} 
                            />
                            <Text style={[
                                styles.genderText,
                                gender === 'female' && styles.selectedGenderText
                            ]}>
                                Female
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Age Selection */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Age</Text>
                    {renderAgePicker()}
                </View>

                {/* Height Input */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Height</Text>
                    <View style={styles.unitToggle}>
                        <TouchableOpacity
                            style={[
                                styles.unitButton,
                                heightUnit === 'cm' && styles.activeUnit
                            ]}
                            onPress={() => setHeightUnit('cm')}
                        >
                            <Text style={[
                                styles.unitText,
                                heightUnit === 'cm' && styles.activeUnitText
                            ]}>
                                cm
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.unitButton,
                                heightUnit === 'inch' && styles.activeUnit
                            ]}
                            onPress={() => setHeightUnit('inch')}
                        >
                            <Text style={[
                                styles.unitText,
                                heightUnit === 'inch' && styles.activeUnitText
                            ]}>
                                inch
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder={`Enter height in ${heightUnit}`}
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                    />
                </View>

                {/* Weight Input */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Weight</Text>
                    <View style={styles.unitToggle}>
                        <TouchableOpacity
                            style={[
                                styles.unitButton,
                                weightUnit === 'kg' && styles.activeUnit
                            ]}
                            onPress={() => setWeightUnit('kg')}
                        >
                            <Text style={[
                                styles.unitText,
                                weightUnit === 'kg' && styles.activeUnitText
                            ]}>
                                kg
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.unitButton,
                                weightUnit === 'lbs' && styles.activeUnit
                            ]}
                            onPress={() => setWeightUnit('lbs')}
                        >
                            <Text style={[
                                styles.unitText,
                                weightUnit === 'lbs' && styles.activeUnitText
                            ]}>
                                lbs
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder={`Enter weight in ${weightUnit}`}
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={calculateBMI}
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
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderOption: {
        width: '48%',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#F5F7FB',
    },
    selectedGender: {
        backgroundColor: '#4B6CB7',
    },
    selectedGenderText: {
        color: '#fff',
    },
    genderText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        color: '#333',
    },
    ageScrollContainer: {
        paddingVertical: 10,
    },
    ageItem: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F5F7FB',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    selectedAgeItem: {
        backgroundColor: '#4B6CB7',
    },
    ageText: {
        fontSize: 18,
        color: '#666',
    },
    selectedAgeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    unitToggle: {
        flexDirection: 'row',
        backgroundColor: '#F5F7FB',
        borderRadius: 12,
        padding: 5,
        marginBottom: 15,
    },
    unitButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeUnit: {
        backgroundColor: '#4B6CB7',
    },
    unitText: {
        fontSize: 16,
        color: '#666',
    },
    activeUnitText: {
        color: '#fff',
    },
    input: {
        height: 50,
        backgroundColor: '#F5F7FB',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
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

export default BMIScreen;


// import React, { useState } from 'react';
// import {
//     View, Text, TouchableOpacity, StyleSheet,
//     ScrollView, Dimensions, TextInput
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const BMIScreen = ({ navigation }) => {
//     const [gender, setGender] = useState('male');
//     const [age, setAge] = useState(25);
//     const [height, setHeight] = useState('');
//     const [heightUnit, setHeightUnit] = useState('cm');
//     const [weight, setWeight] = useState('');
//     const [weightUnit, setWeightUnit] = useState('kg');

//     const calculateBMI = () => {
//         if (!height || !weight) {
//             alert('Please enter both height and weight');
//             return;
//         }
        
//         let heightInMeters = heightUnit === 'cm' ? height / 100 : height * 0.0254;
//         let weightInKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) * 0.453592;

//         const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);

//         navigation.navigate('MealTiming', {
//             bmiData: {
//                 height,
//                 heightUnit,
//                 weight,
//                 weightUnit,
//                 gender,
//                 age,
//                 bmiValue: bmi
//             }
//         });
//     };

//     const renderAgePicker = () => {
//         const ages = Array.from({ length: 21 }, (_, i) => i + 10);
//         return (
//             <ScrollView 
//                 horizontal 
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.ageScrollContainer}
//             >
//                 {ages.map(item => (
//                     <TouchableOpacity
//                         key={item}
//                         style={[
//                             styles.ageItem,
//                             age === item && styles.selectedAgeItem
//                         ]}
//                         onPress={() => setAge(item)}
//                     >
//                         <Text style={[
//                             styles.ageText,
//                             age === item && styles.selectedAgeText
//                         ]}>
//                             {item}
//                         </Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>
//         );
//     };

//     return (
//         <LinearGradient
//             colors={['#F5F7FB', '#E4E8F0']}
//             style={styles.container}
//         >
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <Text style={styles.title}>Let's Get Started 🚀</Text>
//                 <Text style={styles.subtitle}>Tell us about yourself</Text>

//                 {/* Gender Selection */}
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>Gender</Text>
//                     <View style={styles.genderContainer}>
//                         <TouchableOpacity 
//                             style={[
//                                 styles.genderOption,
//                                 gender === 'male' && styles.selectedGender
//                             ]}
//                             onPress={() => setGender('male')}
//                         >
//                             <MaterialCommunityIcons 
//                                 name="gender-male" 
//                                 size={32} 
//                                 color={gender === 'male' ? '#fff' : '#4B6CB7'} 
//                             />
//                             <Text style={[
//                                 styles.genderText,
//                                 gender === 'male' && styles.selectedGenderText
//                             ]}>
//                                 Male
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity 
//                             style={[
//                                 styles.genderOption,
//                                 gender === 'female' && styles.selectedGender
//                             ]}
//                             onPress={() => setGender('female')}
//                         >
//                             <MaterialCommunityIcons 
//                                 name="gender-female" 
//                                 size={32} 
//                                 color={gender === 'female' ? '#fff' : '#FF6B6B'} 
//                             />
//                             <Text style={[
//                                 styles.genderText,
//                                 gender === 'female' && styles.selectedGenderText
//                             ]}>
//                                 Female
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 {/* Age Selection */}
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>Age</Text>
//                     {renderAgePicker()}
//                 </View>

//                 {/* Height Input */}
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>Height</Text>
//                     <View style={styles.unitToggle}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.unitButton,
//                                 heightUnit === 'cm' && styles.activeUnit
//                             ]}
//                             onPress={() => setHeightUnit('cm')}
//                         >
//                             <Text style={[
//                                 styles.unitText,
//                                 heightUnit === 'cm' && styles.activeUnitText
//                             ]}>
//                                 cm
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[
//                                 styles.unitButton,
//                                 heightUnit === 'inch' && styles.activeUnit
//                             ]}
//                             onPress={() => setHeightUnit('inch')}
//                         >
//                             <Text style={[
//                                 styles.unitText,
//                                 heightUnit === 'inch' && styles.activeUnitText
//                             ]}>
//                                 inch
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                     <TextInput
//                         style={styles.input}
//                         placeholder={`Enter height in ${heightUnit}`}
//                         placeholderTextColor="#999"
//                         keyboardType="numeric"
//                         value={height}
//                         onChangeText={setHeight}
//                     />
//                 </View>

//                 {/* Weight Input */}
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>Weight</Text>
//                     <View style={styles.unitToggle}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.unitButton,
//                                 weightUnit === 'kg' && styles.activeUnit
//                             ]}
//                             onPress={() => setWeightUnit('kg')}
//                         >
//                             <Text style={[
//                                 styles.unitText,
//                                 weightUnit === 'kg' && styles.activeUnitText
//                             ]}>
//                                 kg
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[
//                                 styles.unitButton,
//                                 weightUnit === 'lbs' && styles.activeUnit
//                             ]}
//                             onPress={() => setWeightUnit('lbs')}
//                         >
//                             <Text style={[
//                                 styles.unitText,
//                                 weightUnit === 'lbs' && styles.activeUnitText
//                             ]}>
//                                 lbs
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                     <TextInput
//                         style={styles.input}
//                         placeholder={`Enter weight in ${weightUnit}`}
//                         placeholderTextColor="#999"
//                         keyboardType="numeric"
//                         value={weight}
//                         onChangeText={setWeight}
//                     />
//                 </View>

//                 <TouchableOpacity 
//                     style={styles.continueButton}
//                     onPress={calculateBMI}
//                 >
//                     <LinearGradient
//                         colors={['#4B6CB7', '#182848']}
//                         style={styles.gradientButton}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 0 }}
//                     >
//                         <Text style={styles.buttonText}>Continue</Text>
//                         <MaterialCommunityIcons 
//                             name="arrow-right" 
//                             size={24} 
//                             color="#fff" 
//                         />
//                     </LinearGradient>
//                 </TouchableOpacity>
//             </ScrollView>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F7FB',
//         paddingTop: 30,
//     },
//     scrollContainer: {
//         padding: 20,
//         paddingBottom: 40,
//     },
//     title: {
//         fontSize: width * 0.08,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 5,
//     },
//     subtitle: {
//         fontSize: width * 0.045,
//         color: '#666',
//         marginBottom: 30,
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     cardTitle: {
//         fontSize: width * 0.045,
//         fontWeight: '600',
//         color: '#4B6CB7',
//         marginBottom: 15,
//     },
//     genderContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     genderOption: {
//         width: '48%',
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//         backgroundColor: '#F5F7FB',
//     },
//     selectedGender: {
//         backgroundColor: '#4B6CB7',
//     },
//     selectedGenderText: {
//         color: '#fff',
//     },
//     genderText: {
//         fontSize: 16,
//         fontWeight: '600',
//         marginTop: 10,
//         color: '#333',
//     },
//     ageScrollContainer: {
//         paddingVertical: 10,
//     },
//     ageItem: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         backgroundColor: '#F5F7FB',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginHorizontal: 5,
//     },
//     selectedAgeItem: {
//         backgroundColor: '#4B6CB7',
//     },
//     ageText: {
//         fontSize: 18,
//         color: '#666',
//     },
//     selectedAgeText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     unitToggle: {
//         flexDirection: 'row',
//         backgroundColor: '#F5F7FB',
//         borderRadius: 12,
//         padding: 5,
//         marginBottom: 15,
//     },
//     unitButton: {
//         flex: 1,
//         padding: 10,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     activeUnit: {
//         backgroundColor: '#4B6CB7',
//     },
//     unitText: {
//         fontSize: 16,
//         color: '#666',
//     },
//     activeUnitText: {
//         color: '#fff',
//     },
//     input: {
//         height: 50,
//         backgroundColor: '#F5F7FB',
//         borderRadius: 12,
//         paddingHorizontal: 15,
//         fontSize: 16,
//         color: '#333',
//     },
//     continueButton: {
//         marginTop: 10,
//     },
//     gradientButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 16,
//         borderRadius: 12,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginRight: 10,
//     },
// });

// export default BMIScreen;
// // BMI screen

// // import React, { useState } from 'react';
// // import {
// //     View, Text, TouchableOpacity, StyleSheet,
// //     ScrollView, Dimensions, TextInput
// // } from 'react-native';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { MaterialCommunityIcons } from '@expo/vector-icons';

// // const { width } = Dimensions.get('window');

// // const BMIScreen = ({ navigation }) => {
// //     const [gender, setGender] = useState('male');
// //     const [age, setAge] = useState(25);
// //     const [height, setHeight] = useState('');
// //     const [heightUnit, setHeightUnit] = useState('cm');
// //     const [weight, setWeight] = useState('');
// //     const [weightUnit, setWeightUnit] = useState('kg');

// //     const calculateBMI = () => {
// //         if (!height || !weight) {
// //             alert('Please enter both height and weight');
// //             return;
// //         }
        
// //         let heightInMeters = heightUnit === 'cm' ? height / 100 : height * 0.0254;
// //         let weightInKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) * 0.453592;

// //         const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);

// //         navigation.navigate('MealTiming', {
// //             bmiData: {
// //                 height,
// //                 heightUnit,
// //                 weight,
// //                 weightUnit,
// //                 gender,
// //                 age,
// //                 bmiValue: bmi
// //             }
// //         });
// //     };

// //     const renderAgePicker = () => {
// //         const ages = Array.from({ length: 62 }, (_, i) => i + 18);
// //         return (
// //             <ScrollView 
// //                 horizontal 
// //                 showsHorizontalScrollIndicator={false}
// //                 contentContainerStyle={styles.ageScrollContainer}
// //             >
// //                 {ages.map(item => (
// //                     <TouchableOpacity
// //                         key={item}
// //                         style={[
// //                             styles.ageItem,
// //                             age === item && styles.selectedAgeItem
// //                         ]}
// //                         onPress={() => setAge(item)}
// //                     >
// //                         <Text style={[
// //                             styles.ageText,
// //                             age === item && styles.selectedAgeText
// //                         ]}>
// //                             {item}
// //                         </Text>
// //                     </TouchableOpacity>
// //                 ))}
// //             </ScrollView>
// //         );
// //     };

// //     return (
// //         <LinearGradient
// //             colors={['#F5F7FB', '#E4E8F0']}
// //             style={styles.container}
// //         >
// //             <ScrollView contentContainerStyle={styles.scrollContainer}>
// //                 <Text style={styles.title}>Let's Get Started 🚀</Text>
// //                 <Text style={styles.subtitle}>Tell us about yourself</Text>

// //                 {/* Gender Selection */}
// //                 <View style={styles.card}>
// //                     <Text style={styles.cardTitle}>Gender</Text>
// //                     <View style={styles.genderContainer}>
// //                         <TouchableOpacity 
// //                             style={[
// //                                 styles.genderOption,
// //                                 gender === 'male' && styles.selectedGender
// //                             ]}
// //                             onPress={() => setGender('male')}
// //                         >
// //                             <MaterialCommunityIcons 
// //                                 name="gender-male" 
// //                                 size={32} 
// //                                 color={gender === 'male' ? '#fff' : '#4B6CB7'} 
// //                             />
// //                             <Text style={[
// //                                 styles.genderText,
// //                                 gender === 'male' && styles.selectedGenderText
// //                             ]}>
// //                                 Male
// //                             </Text>
// //                         </TouchableOpacity>
// //                         <TouchableOpacity 
// //                             style={[
// //                                 styles.genderOption,
// //                                 gender === 'female' && styles.selectedGender
// //                             ]}
// //                             onPress={() => setGender('female')}
// //                         >
// //                             <MaterialCommunityIcons 
// //                                 name="gender-female" 
// //                                 size={32} 
// //                                 color={gender === 'female' ? '#fff' : '#FF6B6B'} 
// //                             />
// //                             <Text style={[
// //                                 styles.genderText,
// //                                 gender === 'female' && styles.selectedGenderText
// //                             ]}>
// //                                 Female
// //                             </Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                 </View>

// //                 {/* Age Selection */}
// //                 <View style={styles.card}>
// //                     <Text style={styles.cardTitle}>Age</Text>
// //                     {renderAgePicker()}
// //                 </View>

// //                 {/* Height Input */}
// //                 <View style={styles.card}>
// //                     <Text style={styles.cardTitle}>Height</Text>
// //                     <View style={styles.unitToggle}>
// //                         <TouchableOpacity
// //                             style={[
// //                                 styles.unitButton,
// //                                 heightUnit === 'cm' && styles.activeUnit
// //                             ]}
// //                             onPress={() => setHeightUnit('cm')}
// //                         >
// //                             <Text style={[
// //                                 styles.unitText,
// //                                 heightUnit === 'cm' && styles.activeUnitText
// //                             ]}>
// //                                 cm
// //                             </Text>
// //                         </TouchableOpacity>
// //                         <TouchableOpacity
// //                             style={[
// //                                 styles.unitButton,
// //                                 heightUnit === 'inch' && styles.activeUnit
// //                             ]}
// //                             onPress={() => setHeightUnit('inch')}
// //                         >
// //                             <Text style={[
// //                                 styles.unitText,
// //                                 heightUnit === 'inch' && styles.activeUnitText
// //                             ]}>
// //                                 inch
// //                             </Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                     <TextInput
// //                         style={styles.input}
// //                         placeholder={`Enter height in ${heightUnit}`}
// //                         placeholderTextColor="#999"
// //                         keyboardType="numeric"
// //                         value={height}
// //                         onChangeText={setHeight}
// //                     />
// //                 </View>

// //                 {/* Weight Input */}
// //                 <View style={styles.card}>
// //                     <Text style={styles.cardTitle}>Weight</Text>
// //                     <View style={styles.unitToggle}>
// //                         <TouchableOpacity
// //                             style={[
// //                                 styles.unitButton,
// //                                 weightUnit === 'kg' && styles.activeUnit
// //                             ]}
// //                             onPress={() => setWeightUnit('kg')}
// //                         >
// //                             <Text style={[
// //                                 styles.unitText,
// //                                 weightUnit === 'kg' && styles.activeUnitText
// //                             ]}>
// //                                 kg
// //                             </Text>
// //                         </TouchableOpacity>
// //                         <TouchableOpacity
// //                             style={[
// //                                 styles.unitButton,
// //                                 weightUnit === 'lbs' && styles.activeUnit
// //                             ]}
// //                             onPress={() => setWeightUnit('lbs')}
// //                         >
// //                             <Text style={[
// //                                 styles.unitText,
// //                                 weightUnit === 'lbs' && styles.activeUnitText
// //                             ]}>
// //                                 lbs
// //                             </Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                     <TextInput
// //                         style={styles.input}
// //                         placeholder={`Enter weight in ${weightUnit}`}
// //                         placeholderTextColor="#999"
// //                         keyboardType="numeric"
// //                         value={weight}
// //                         onChangeText={setWeight}
// //                     />
// //                 </View>

// //                 <TouchableOpacity 
// //                     style={styles.continueButton}
// //                     onPress={calculateBMI}
// //                 >
// //                     <LinearGradient
// //                         colors={['#4B6CB7', '#182848']}
// //                         style={styles.gradientButton}
// //                         start={{ x: 0, y: 0 }}
// //                         end={{ x: 1, y: 0 }}
// //                     >
// //                         <Text style={styles.buttonText}>Continue</Text>
// //                         <MaterialCommunityIcons 
// //                             name="arrow-right" 
// //                             size={24} 
// //                             color="#fff" 
// //                         />
// //                     </LinearGradient>
// //                 </TouchableOpacity>
// //             </ScrollView>
// //         </LinearGradient>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#F5F7FB',
// //         paddingTop: 30,
// //     },
// //     scrollContainer: {
// //         padding: 20,
// //         paddingBottom: 40,
// //     },
// //     title: {
// //         fontSize: width * 0.08,
// //         fontWeight: 'bold',
// //         color: '#333',
// //         marginBottom: 5,
// //     },
// //     subtitle: {
// //         fontSize: width * 0.045,
// //         color: '#666',
// //         marginBottom: 30,
// //     },
// //     card: {
// //         backgroundColor: '#fff',
// //         borderRadius: 16,
// //         padding: 20,
// //         marginBottom: 20,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 4 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 8,
// //         elevation: 4,
// //     },
// //     cardTitle: {
// //         fontSize: width * 0.045,
// //         fontWeight: '600',
// //         color: '#4B6CB7',
// //         marginBottom: 15,
// //     },
// //     genderContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //     },
// //     genderOption: {
// //         width: '48%',
// //         padding: 15,
// //         borderRadius: 12,
// //         alignItems: 'center',
// //         backgroundColor: '#F5F7FB',
// //     },
// //     selectedGender: {
// //         backgroundColor: '#4B6CB7',
// //     },
// //     selectedGenderText: {
// //         color: '#fff',
// //     },
// //     genderText: {
// //         fontSize: 16,
// //         fontWeight: '600',
// //         marginTop: 10,
// //         color: '#333',
// //     },
// //     ageScrollContainer: {
// //         paddingVertical: 10,
// //     },
// //     ageItem: {
// //         width: 60,
// //         height: 60,
// //         borderRadius: 30,
// //         backgroundColor: '#F5F7FB',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginHorizontal: 5,
// //     },
// //     selectedAgeItem: {
// //         backgroundColor: '#4B6CB7',
// //     },
// //     ageText: {
// //         fontSize: 18,
// //         color: '#666',
// //     },
// //     selectedAgeText: {
// //         color: '#fff',
// //         fontWeight: 'bold',
// //     },
// //     unitToggle: {
// //         flexDirection: 'row',
// //         backgroundColor: '#F5F7FB',
// //         borderRadius: 12,
// //         padding: 5,
// //         marginBottom: 15,
// //     },
// //     unitButton: {
// //         flex: 1,
// //         padding: 10,
// //         borderRadius: 8,
// //         alignItems: 'center',
// //     },
// //     activeUnit: {
// //         backgroundColor: '#4B6CB7',
// //     },
// //     unitText: {
// //         fontSize: 16,
// //         color: '#666',
// //     },
// //     activeUnitText: {
// //         color: '#fff',
// //     },
// //     input: {
// //         height: 50,
// //         backgroundColor: '#F5F7FB',
// //         borderRadius: 12,
// //         paddingHorizontal: 15,
// //         fontSize: 16,
// //         color: '#333',
// //     },
// //     continueButton: {
// //         marginTop: 10,
// //     },
// //     gradientButton: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         padding: 16,
// //         borderRadius: 12,
// //     },
// //     buttonText: {
// //         color: '#fff',
// //         fontSize: 18,
// //         fontWeight: 'bold',
// //         marginRight: 10,
// //     },
// // });

// // export default BMIScreen;