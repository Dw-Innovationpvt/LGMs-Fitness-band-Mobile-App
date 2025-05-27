// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
// import { Video } from 'expo-av';
// import { BlurView } from 'expo-blur';

// const { width, height } = Dimensions.get('window');

// const SplashScreen = ({ navigation }) => {
//   const videoTranslateY = useRef(new Animated.Value(0)).current;
//   const logoTranslateY = useRef(new Animated.Value(-height)).current; // Starts above screen
// const logoTranslateX = useRef(new Animated.Value(0)).current;

//   const screenOpacity = useRef(new Animated.Value(0)).current;
//   const blurOpacity = useRef(new Animated.Value(0)).current;
//   const bgParallax = useRef(new Animated.Value(0)).current;

// useEffect(() => {
//   // Fade in the screen
//   Animated.timing(screenOpacity, {
//     toValue: 1,
//     duration: 600,
//     useNativeDriver: true,
//   }).start();

//   setTimeout(() => {
//     Animated.sequence([
//       // Background parallax shift
//       Animated.timing(bgParallax, {
//         toValue: -20,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       // Move video down and blur in
//       Animated.parallel([
//         Animated.timing(videoTranslateY, {
//           toValue: height,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(blurOpacity, {
//           toValue: 1,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//       ]),
//       // Instantly show the logo (set Y to 0 without animation)
//       Animated.timing(logoTranslateY, {
//         toValue: 0,
//         duration: 1, // Just to trigger frame update
//         useNativeDriver: true,
//       }),
//       // Hold logo for 1 second
//       Animated.delay(3000),
//       // Slide logo to the left
//       Animated.timing(logoTranslateX, {
//         toValue: -width,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//       // Fade out the screen
//       Animated.timing(screenOpacity, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start(() => navigation.replace('SignIn'));
//   }, 1500);
// }, []);


//   return (
//     <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
//       <Animated.View
//         style={[
//           styles.videoWrapper,
//           {
//             transform: [
//               { translateY: videoTranslateY },
//               { translateX: bgParallax },
//             ],
//           },
//         ]}
//       >
//         <Video
//           source={require('../assets/1212.mp4')}
//           isLooping={false}
//           shouldPlay
//           resizeMode="contain"
//           style={styles.video}
//         />
//         <Animated.View style={[styles.blurOverlay, { opacity: blurOpacity }]}>
//           <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
//         </Animated.View>
//       </Animated.View>

//       <Animated.View
//         style={[
//           styles.logoWrapper,
//           {
//             transform: [
//               { translateY: logoTranslateY },
//               { translateX: logoTranslateX },
//             ],
//           },
//         ]}
//       >
//         <View style={styles.logoWrapper2}>
//           <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
//         </View>
//         <Text style={styles.appName}>ROLLSMART</Text>
//         <Text style={styles.tagline}>Track It. Master It.</Text>
//       </Animated.View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0463b3',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// videoWrapper: {
//   flex: 1,
//   width: '200%',  
//   height: '200%',
//  resizeMode: 'contain',
// },

// video: {
//   width: '100%',
//   height: '100%',
// },

//   blurOverlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   logoWrapper: {
//     alignItems: 'center',
//     position: 'absolute',
//   },
//   logoWrapper2: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 30,
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//     marginBottom: 20,
//     alignContent: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//     width: 240,
//     height: 180,
//   },
//   logo: {
//     width: 200,
//     height: 200,
//     marginBottom: 10,
//   },
//   appName: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   tagline: {
//     fontSize: 14,
//     letterSpacing: 1.5,
//     color: '#fff',
//     marginTop: 6,
//   },
// });

// export default SplashScreen;







import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = ({ navigation }) => {
  const [showSkip, setShowSkip] = useState(false);
  const slideX = useRef(new Animated.Value(0)).current;

  const onComplete = () => navigation.replace('SignIn');

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= 200) {
          slideX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 150) {
          Animated.timing(slideX, {
            toValue: 200,
            duration: 300,
            useNativeDriver: true,
          }).start(() => onComplete());
        } else {
          Animated.spring(slideX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.appName}>SKATETRACK</Text>
        <Text style={styles.tagline}>Train. Track. Triumph.</Text>

        {showSkip && (
          <View style={styles.sliderTrack}>
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.sliderThumb, { transform: [{ translateX: slideX }] }]}
            >
              <Text style={styles.sliderText}>➔</Text>
            </Animated.View>

            <Animated.Text
              style={[
                styles.sliderHint,
                {
                  opacity: slideX.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0.6, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              Slide to Start
            </Animated.Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { width: '100%', alignItems: 'center',justifyContent: 'space-around', padding: 20 },
  logoContainer: {
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 30,
    height: 160,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 30,
  },
  logo: { width: 160, height: 160 },
  appName: {
    fontSize: 36,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 40,
  },
sliderTrack: {
  width: 250,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center', // keep center for hint text
  alignItems: 'center',     // ensure hint text centers
  overflow: 'hidden',
  marginTop: 200,

  borderWidth: 1,
  borderColor: '#fff',
  position: 'relative',
},
sliderThumb: {
  position: 'absolute',
  bottom: 0,
  left: 0, // Align to baseline
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
},
  sliderText: { fontSize: 20, color: '#004e92' },
sliderHint: {
  color: '#fff',
  fontSize: 14,
  letterSpacing: 1,
  textAlign: 'center',
},
});

export default SplashScreen;
