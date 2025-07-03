import { TouchableOpacity, StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Button, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BackendCodeCheck = () => {
  const [localtoken, setToken] = useState('')
  const [amount, setAmount] = useState('');
  const [waterId, setWaterId] = useState('');
  // const [steps, setSteps] = useState('');

  const [stepsTCount, setStepsTotalCount] = useState('');
  const [stepsKilo, setStepsKilometers] = useState('');
  const [stepsCalBurned, setStepsCaloriesBurned] = useState('');
  const [stepsActiveMin, setStepsActiveMinutes] = useState('');
  // const [waterData, setWater] = useState('nothing');
  const { stepsTotalCount, stepsKilometers, stepsCaloriesBurned, stepsActiveMinutes, nothingtoworry, login, isLoading, user, token, getWater, waterLogs, postWater, putWater, waterData, postWaterId, stepsData } = useAuthStore();
  useEffect(() => {
    getWater();
    // getSteps();
  }, []);
  // useEffect(() => {
  // }, []);
  useEffect(() => {
    setStepsTotalCount(stepsTotalCount);
    setStepsKilometers(stepsKilometers);
    setStepsCaloriesBurned(stepsCaloriesBurned);
    setStepsActiveMinutes(stepsActiveMinutes);
  }, [stepsTotalCount, stepsKilometers, stepsCaloriesBurned, stepsActiveMinutes]);
  if (isLoading) return <ActivityIndicator size="large" />;
  //   if (error) return <Text style={styles.error}>{error}</Text>;

  const handelSteps = async () => {
    // if (steps) {
      const result = await getSteps();
      if (!result) {
        console.log('Error fetching steps data');
        return;
      }
      console.log('Steps data fetched successfully:', result);
      if (result && result._id) {
        console.log(result);
        // setWaterId(result._id)
      }
    // else {
    //   alert('Please enter steps first!');
    // } 
  };

  // Handling post and put
  const handlePost = async () => {
    const result = await postWater(amount);
    if (result && result._id) {
      console.log(result);
      setWaterId(result._id);
      // setWaterId(result._id);
    }
  };
  const handlePut = async () => {
    if (waterId) {
      await putWater(postWaterId, amount);
    } else {
      alert('Please POST first to get waterId!');
    }
  };
  const tokencheck = async () => {
    const tokens = await AsyncStorage.getItem('token');
    if (!tokens) console.log('User not authenticated, no token Available');
    console.warn('Token:', tokens);
    setToken(tokens)
    if (!tokens) return;
  }
  const getWaterOut = async () => {
    console.log('getWater clicked');
    const response = getWater();
    if (!response) console.log('error get water ')
    else console.log(JSON.stringify(response));

    // setWater(response.json());

    // console.log(res);
  }
  const nothing = async () => {
    try {
      const response = await nothingtoworry();
      if (response.success) {
        console.log('Backend is working:', response.data, user, "usr", token, "tok");
      } else {
        console.error('Error:', response.error);
      }
    } catch (error) {
      console.error('Error checking backend:', error);
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>User{JSON.stringify(user)}</Text>
      <Text>BackendCodeCheck</Text>
      <TouchableOpacity onPress={tokencheck}><Text>tokencheck</Text></TouchableOpacity>
      <Text>{localtoken}</Text>
      <Text>Normal Token{token}</Text>
      <TouchableOpacity onPress={getWaterOut}><Text>getWater</Text></TouchableOpacity>

      <Text>Water</Text>
      <Text>{waterData}</Text>
      {/* <FlatList
        data={waterLogs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>💧 Amount: {item.amount} ml</Text>
            <Text style={styles.text}>🎯 Target: {item.target} ml</Text>
            <Text style={styles.text}>📅 Time: {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text style={styles.text}>
              ✅ Completed: {item.completed ? 'Yes' : 'No'}
            </Text>
          </View>
        )}
      /> */}


      <View style={styles.container}>
        <Text style={styles.label}>Enter Water Amount (ml)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="e.g. 800"
        />
        <Button title="POST Water" onPress={handlePost} />
        <View style={{ height: 10 }} />
        <Button title="PUT Water (Update)" onPress={handlePut} />

        <Text>{JSON.stringify(waterData)}</Text>
        <Text>{postWaterId}</Text>
      </View>
        {/* /code for space at bottom height lower code */}
        <View style={{ width: '200px', height: '100' }}>
        </View>

      <ScrollView>
        <TouchableOpacity onPress={handelSteps}><Text>Get Steps</Text></TouchableOpacity>
        <Text>Steps</Text>
        <Text>{stepsTCount}</Text>
        <Text>{stepsKilometers}</Text>
        <Text>{stepsCaloriesBurned}</Text>
        <Text>{stepsActiveMinutes}</Text>
        <Text>{JSON.stringify(stepsData)}</Text>
      </ScrollView>

      </View>
      )
}

      export default BackendCodeCheck

      const styles = StyleSheet.create({
        container: {padding: 20 },
      label: {marginBottom: 8, fontSize: 16 },
      input: {
        borderWidth: 1,
      borderColor: '#aaa',
      padding: 10,
      marginBottom: 10,
      borderRadius: 6,
  },
      result: {marginTop: 20 },
})



// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const BackendCodeCheck = () => {
//   useEffect(() => {
//     const testAsyncStorage = async () => {
//       try {
//         // Save data
//         await AsyncStorage.setItem('test_key', 'Hello AsyncStorage');

//         // Read data
//         const value = await AsyncStorage.getItem('test_key');
//         console.log('Stored Value:', value);

//         // Check result
//         if (value === 'Hello AsyncStorage') {
//           console.log('✅ AsyncStorage is working!');
//         } else {
//           console.log('❌ Value not found or incorrect.');
//         }
//       } catch (error) {
//         console.log('❌ AsyncStorage error:', error);
//       }
//     };

//     testAsyncStorage();
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Check Console for AsyncStorage test</Text>
//     </View>
//   );
// };
// export default BackendCodeCheck;