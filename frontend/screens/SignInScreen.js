import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  ScrollView,
  Platform,
  Keyboard,
  Animated,
  Dimensions
} from 'react-native';

const { height } = Dimensions.get('window');

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardHeight: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.state.keyboardHeight, {
      duration: 250,
      toValue: event.endCoordinates.height,
      useNativeDriver: false,
    }).start();
  };

  keyboardWillHide = () => {
    Animated.timing(this.state.keyboardHeight, {
      duration: 250,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  render() {
    const { keyboardHeight } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {/* Background Image */}
        <Image 
          source={require('../assets/LGM_3.jpg')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        {/* Animated Form Container */}
        <Animated.View 
          style={[
            styles.formContainer,
            {
              transform: [{
                translateY: keyboardHeight.interpolate({
                  inputRange: [0, height],
                  outputRange: [0, -height * 0.3], // Adjust this value for how much you want it to move up
                }),
              }],
            },
          ]}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.heading}>Welcome Back!</Text>
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              placeholderTextColor="#ccc" 
            />
            <TextInput 
              placeholder="Password" 
              secureTextEntry 
              style={styles.input} 
              placeholderTextColor="#ccc" 
            />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },
  logo: {
    position: 'absolute',
     top: 21,
    left: 36,
    right: 0,
    bottom: -21,
    height: '50%', // Adjust this to control how much of the image is visible
    width: '80%',

    resizeMode: 'contain',
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#002856',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 40,
    height: '50%', // Adjust this to control the initial height of the form
  },
  scrollContainer: {
    flexGrow: 2,
    alignItems: 'center',
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    width: '80%',
    backgroundColor: '#f58220',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: { 
    marginTop: 20, 
    color: '#f58220',
    fontWeight: 'bold',
  },
});

export default SignInScreen;