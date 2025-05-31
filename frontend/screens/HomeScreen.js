 

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const userName = 'Charan';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {userName}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
  <Feather name="user" size={24} color="#000" />
</TouchableOpacity>
      </View>
      <View style={styles.cards}>
        <View style={styles.card}><Text>Card 1</Text></View>
        <View style={styles.card}><Text>Card 2</Text></View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,
    marginTop: 50,
   },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
  },
  cards: {
    gap: 15,
  },
  card: {
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
});
