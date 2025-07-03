import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/authStore.js';
import React, { useState } from 'react';

const SkatingTrackingCheck = () => {
  const getSkatingTracking = useAuthStore((state) => state.getSkatingTracking);
  const [skatingTrackings, setSkatingTrackings] = useState([]);

  const handleGetSkatingTracking = async () => {
    const result = await getSkatingTracking();
    // Parse if result is a string
    const parsed = typeof result === 'string' ? JSON.parse(result) : result;
    // Extract the data property
    const data = parsed.data ? parsed.data : parsed;
    // Wrap in array for mapping
    setSkatingTrackings(Array.isArray(data) ? data : [data]);
    console.log('Skating Trackings fetched:', data);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {skatingTrackings.length === 0 ? (
          <Text style={styles.infoText}>No skating tracking data yet.</Text>
        ) : (
          skatingTrackings.map((item, idx) => (
            <View key={item._id || idx} style={styles.itemContainer}>
              <Text style={styles.itemText}>Date: {new Date(item.date).toLocaleString()}</Text>
              <Text style={styles.itemText}>Average Speed: {item.averageSpeed} km/h</Text>
              <Text style={styles.itemText}>Strides Count: {item.stridesCount}</Text>
              <Text style={styles.itemText}>Stride Rate: {item.strideRate}</Text>
              <Text style={styles.itemText}>Steps Count: {item.stepsCount}</Text>
              <Text style={styles.itemText}>Calories Burned: {item.caloriesBurned}</Text>
              <Text style={styles.itemText}>Altitude Gain: {item.AltitideGain}</Text>
              <Text style={styles.itemText}>Altitude Loss: {item.AltitideLoss}</Text>
              <Text style={styles.itemText}>Trip Duration: {item.TripDuration} min</Text>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity onPress={handleGetSkatingTracking} style={styles.button}>
        <Text style={styles.buttonText}>Get Skating Trackings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SkatingTrackingCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  itemContainer: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    width: '100%',
    marginBottom: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

// import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
// import { useAuthStore } from '../../store/authStore.js';
// import React, { useState } from 'react';

// const SkatingTrackingCheck = () => {
//   const getSkatingTracking = useAuthStore((state) => state.getSkatingTracking);
//   const [skatingTrackings, setSkatingTrackings] = useState([]);

//   const handleGetSkatingTracking = async () => {
//     const result = await getSkatingTracking();
//     // If result is a string, parse it
//     const parsed = typeof result === 'string' ? JSON.parse(result) : result;
//     // Ensure it's always an array for mapping
//     setSkatingTrackings(Array.isArray(parsed) ? parsed : [parsed]);
//     // console.log('Skating Trackings fetched:', parsed);
//     console.log('inside hande')
//     console.log(JSON.stringify(result))
//     console.log('inside hande')
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView}>
//         {skatingTrackings.length === 0 ? (
//           <Text style={styles.infoText}>No skating tracking data yet.</Text>
//         ) : (
//           skatingTrackings.map((item, idx) => (
//             <View key={item._id || idx} style={styles.itemContainer}>
//               <Text style={styles.itemText}>Date: {new Date(item.date).toLocaleString()}</Text>
//               <Text style={styles.itemText}>Average Speed: {item.averageSpeed} km/h</Text>
//               <Text style={styles.itemText}>Strides Count: {item.stridesCount}</Text>
//               <Text style={styles.itemText}>Stride Rate: {item.strideRate}</Text>
//               <Text style={styles.itemText}>Steps Count: {item.stepsCount}</Text>
//               <Text style={styles.itemText}>Calories Burned: {item.caloriesBurned}</Text>
//               <Text style={styles.itemText}>Altitude Gain: {item.AltitideGain}</Text>
//               <Text style={styles.itemText}>Altitude Loss: {item.AltitideLoss}</Text>
//               <Text style={styles.itemText}>Trip Duration: {item.TripDuration} min</Text>
//             </View>
//           ))
//         )}
//       </ScrollView>
//       <TouchableOpacity onPress={handleGetSkatingTracking} style={styles.button}>
//         <Text style={styles.buttonText}>Get Skating Trackings</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default SkatingTrackingCheck;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   scrollView: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   infoText: {
//     textAlign: 'center',
//     color: '#888',
//     marginVertical: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#f0f4f8',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     padding: 12,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 100,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });



// import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
// import { useAuthStore } from '../../store/authStore.js';
// import React, { useState } from 'react';

// const SkatingTrackingCheck = () => {
//   const getSkatingTracking = useAuthStore((state) => state.getSkatingTracking);
//   const [skatingTrackings, setSkatingTrackings] = useState([]);

//   const handleGetSkatingTracking = async () => {
//     // If getSkatingTracking is async, await it
//     const result = await getSkatingTracking();
//     // Ensure result is always an array
//     setSkatingTrackings(Array.isArray(result) ? result : [result]);
//     console.log('Skating Trackings fetched:', result);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView}>
//         {skatingTrackings.length === 0 ? (
//           <Text style={styles.infoText}>No skating tracking data yet.</Text>
//         ) : (
//           skatingTrackings.map((item, idx) => (
//             <View key={item._id || idx} style={styles.itemContainer}>
//               <Text style={styles.itemText}>Date: {item.date}</Text>
//               <Text style={styles.itemText}>Distance: {item.distance} km</Text>
//               <Text style={styles.itemText}>Duration: {item.duration} min</Text>
//               {/* Add more fields as needed */}
//             </View>
//           ))
//         )}
//       </ScrollView>
//       <TouchableOpacity onPress={handleGetSkatingTracking} style={styles.button}>
//         <Text style={styles.buttonText}>Get Skating Trackings</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default SkatingTrackingCheck;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   scrollView: {
//     width: '100%',
//     marginBottom: 20,
//     marginTop: 60,
//   },
//   infoText: {
//     textAlign: 'center',
//     color: '#888',
//     marginVertical: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#f0f4f8',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     padding: 12,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 100,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// import { useAuthStore } from '../../store/authStore.js';


// import React, { useState } from 'react';

// const SkatingTrackingCheck = () => {
//     const { getSkatingTracking } = useAuthStore();
//     const [skatingTrackings, setSkatingTrackings] = useState([]);
//     const handeGetSkatingTracking = () => {
//         const result = getSkatingTracking();
//         setSkatingTrackings(JSON.stringify(result));
//         console.log('Skating Trackings fetched:', JSON.stringify(result));
//     };
//     // const getSkatingTrackings = getSkatingTracking();
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>{skatingTrackings}</Text>
//       <TouchableOpacity onPress={handeGetSkatingTracking} style={{ padding: 10, backgroundColor: '#007BFF', borderRadius: 5 }}>
//         <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>Get Skating Trackings</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default SkatingTrackingCheck

// const styles = StyleSheet.create({})