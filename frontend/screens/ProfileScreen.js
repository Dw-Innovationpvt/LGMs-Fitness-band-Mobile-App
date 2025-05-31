import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const colorPalette = [
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#009688', // Teal
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colorPalette.length);
  return colorPalette[index];
};

const getInitials = (name) => {
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
};

const profileOptions = [
  { icon: 'account-circle', text: 'Account' },
  { icon: 'lock', text: 'Privacy' },
  { icon: 'star', text: 'Skating Level' },
  { icon: 'history', text: 'Tracking History' },
];

const ProfileScreen = ({ navigation }) => {
  const colors = {
    background: '#f2f2f2',
    card: '#fff',
    text: '#000',
    icon: '#000',
    secondary: '#555',
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Sign Out', 
          onPress: () => navigation.replace('SignIn'),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      {/* Header with back button, title, and sign out icon */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Feather name="log-out" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>




      <ScrollView contentContainerStyle={styles.scrollContainer}>



      <View style={{ flex: 1, backgroundColor: '#042c5c',marginHorizontal: 10  ,  borderTopLeftRadius: 80, borderTopRightRadius: 80, marginTop: 80 }}> 

  
        {/* Profile Header */}

        <View style={styles.profileHeader}>
               
                  <View style={styles.outerCircle2}>

   <View style={[styles.initialsContainer, { backgroundColor: getColorFromName('Charan Dusary') }]}>
    <Text style={styles.initialsText}>{getInitials('Charan Dusary')}</Text>
 </View>
</View>

          <Text style={styles.name}>Charan</Text>
          <Text style={styles.subtitle}>
            Confidence, Not ego.
          </Text>
        </View>

        {/* Achievements Card */}
        <View style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <Text style={styles.achievementsText}>
            Your progress and achievements will be displayed here
          </Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.optionRow}>
              <MaterialIcons name={item.icon} size={24} color={colors.icon} />
              <Text style={styles.optionText}>{item.text}</Text>
              <Feather name="chevron-right" size={20} color={colors.secondary} />
            </TouchableOpacity>
          ))}
        </View>

      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  profileHeader: {
    flex: 2,
     alignItems: 'center',
    paddingTop: 10,
     marginTop: -80,
     marginBottom: 0,
  },
  name: {
 
    fontSize: 36,
    fontWeight: '600',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
        flex: 2,

    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    marginTop: 4,
    paddingHorizontal: 30,
  },
  achievementsCard: {
        flex: 2,
marginTop: -60,
height: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
     borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  achievementsText: {
    fontSize: 14,
    color: '#555',
  },
  optionsContainer: {
        flex: 2,
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 80,
    height: 124 ,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#000',
  },
  initialsContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
 
  outerCircle2: {
  width: 140,
  height: 140,
  borderRadius: 70,
  backgroundColor: '#042c5b',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
}
,
  initialsText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

 








// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert
// } from 'react-native';
// import { MaterialIcons, Feather } from '@expo/vector-icons';

// const colorPalette = [
//   '#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3',
//   '#009688', '#4CAF50', '#FF9800', '#795548', '#607D8B',
// ];

// const getColorFromName = (name) => {
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const index = Math.abs(hash % colorPalette.length);
//   return colorPalette[index];
// };

// const getInitials = (name) => {
//   const names = name.trim().split(' ');
//   if (names.length === 1) return names[0].charAt(0).toUpperCase();
//   return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
// };

// const profileOptions = [
//   { icon: 'account-circle', text: 'Account' },
//   { icon: 'lock', text: 'Privacy' },
//   { icon: 'star', text: 'Skating Level' },
//   { icon: 'history', text: 'Tracking History' },
// ];

// const ProfileScreen = ({ navigation }) => {
//   const handleSignOut = () => {
//     Alert.alert(
//       'Sign Out',
//       'Are you sure you want to sign out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Sign Out', onPress: () => navigation.replace('SignIn'), style: 'destructive' }
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Feather name="chevron-left" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile</Text>
//         <TouchableOpacity onPress={handleSignOut}>
//           <Feather name="log-out" size={24} color="#FF3B30" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           <View style={styles.avatarWrapper}>
//             <View style={[styles.avatar, { backgroundColor: getColorFromName('Charan Dusary') }]}>
//               <Text style={styles.initialsText}>{getInitials('Charan Dusary')}</Text>
//             </View>
//           </View>
//           <Text style={styles.name}>Charan</Text>
//           <Text style={styles.subtitle}>Confidence, Not ego.</Text>
//         </View>

//         {/* Achievements */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Achievements</Text>
//           <Text style={styles.cardText}>Your progress and achievements will be displayed here.</Text>
//         </View>

//         {/* Profile Options */}
//         <View style={styles.optionsContainer}>
//           {profileOptions.map((item, index) => (
//             <TouchableOpacity key={index} style={styles.optionRow}>
//               <MaterialIcons name={item.icon} size={24} color="#333" />
//               <Text style={styles.optionText}>{item.text}</Text>
//               <Feather name="chevron-right" size={20} color="#aaa" />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContainer: {
//     paddingBottom: 30,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#ddd',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   backButton: {
//     padding: 4,
//   },
//   profileSection: {
//     alignItems: 'center',
//     backgroundColor: '#042c5c',
//     paddingVertical: 40,
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//   },
//   avatarWrapper: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: '#042c5c',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#fff',
//   },
//   initialsText: {
//     fontSize: 40,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   name: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#fff',
//     marginTop: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#e0e0e0',
//     marginTop: 4,
//     paddingHorizontal: 30,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#f9f9f9',
//     marginHorizontal: 16,
//     marginTop: 24,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 8,
//   },
//   cardText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   optionsContainer: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 20,
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   optionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#eee',
//   },
//   optionText: {
//     flex: 1,
//     fontSize: 16,
//     marginLeft: 12,
//     color: '#333',
//   },
// });

// export default ProfileScreen;
